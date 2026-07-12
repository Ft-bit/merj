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
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  redirectLoading: boolean
  redirectError: string
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<{ needsVerification: boolean }>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  resendVerification: () => Promise<void>
  checkVerification: () => Promise<boolean>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

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

  // FIX: this is new. Previously there was no way to know whether a Google
  // redirect sign-in was still being processed in the background, so the
  // login page would flash back to the normal sign-up form while Firebase
  // was still working. redirectLoading lets the UI show a proper
  // "completing sign-in..." state instead of looking like nothing happened.
  const [redirectLoading, setRedirectLoading] = useState(true)
  const [redirectError, setRedirectError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    // FIX: explicit persistence helps signInWithRedirect survive the
    // round-trip to Google and back on mobile browsers with stricter
    // storage-partitioning behavior.
    setPersistence(auth, browserLocalPersistence)
      .catch(() => {
        // If this fails, Firebase falls back to its default persistence.
        // Not fatal — continue to redirect result handling regardless.
      })
      .finally(() => {
        getRedirectResult(auth)
          .then(async (result) => {
            if (result?.user) {
              await ensureUserDoc(result.user)
            }
            setRedirectLoading(false)
          })
          .catch((e: any) => {
            // FIX: previously this error was silently discarded. Now it's
            // stored so the login page can actually show the user what
            // went wrong, instead of quietly looping back to the form.
            const code = e?.code || ''
            if (code === 'auth/unauthorized-domain') {
              setRedirectError('This domain is not authorized for sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains.')
            } else if (code) {
              setRedirectError(`Sign-in could not complete (${code}). Please try again.`)
            } else if (e?.message) {
              setRedirectError('Sign-in could not complete. Please try again, or use a different browser.')
            }
            setRedirectLoading(false)
          })
      })
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
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
    <AuthContext.Provider value={{ user, loading, redirectLoading, redirectError, loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
