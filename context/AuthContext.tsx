'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
  signOut,
  User,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<{ needsVerification: boolean }>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  resendVerification: () => Promise<void>
  checkVerification: () => Promise<boolean>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

// Pulled out so both the redirect-result handler and the popup-era code
// path (if ever needed again) create the user doc the same way.
async function ensureUserDoc(u: User) {
  const ref = doc(db, 'users', u.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email,
      name: u.displayName || 'User',
      photo: u.photoURL || '',
      createdAt: serverTimestamp(),
      role: 'user',
    }, { merge: true })
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // FIX: signInWithPopup relies on the main page reading window.closed on
  // the popup, which Vercel/Next.js's Cross-Origin-Opener-Policy header
  // blocks — causing sign-in to hang or report a generic failure.
  // signInWithRedirect avoids this entirely: it navigates the whole page
  // to Google and back, so there's no popup window to track.
  //
  // This handles the return trip from Google. It runs once on every page
  // load; if the user just came back from a Google redirect, it resolves
  // with their result and creates the Firestore doc if needed.
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await ensureUserDoc(result.user)
        }
      })
      .catch(() => {
        // Errors here are surfaced to the user via the login page's own
        // error state on next interaction; nothing to do silently here.
      })
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
    // Execution pauses here — the browser navigates away to Google.
    // When it comes back, the useEffect above (getRedirectResult) picks up.
  }

  const loginWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { needsVerification: !result.user.emailVerified }
  }

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    await sendEmailVerification(result.user)
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      name,
      photo: '',
      createdAt: serverTimestamp(),
      role: 'user',
    }, { merge: true })
  }

  const resendVerification = async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser)
  }

  const checkVerification = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser)
      return auth.currentUser.emailVerified
    }
    return false
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
