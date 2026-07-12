'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
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

  // Back to signInWithPopup, paired with the COOP header in next.config.js.
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    await ensureUserDoc(result.user)
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
