'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
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
          })
        }
      }
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const ref = doc(db, 'users', result.user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || 'User',
        photo: result.user.photoURL || '',
        createdAt: serverTimestamp(),
        role: 'user',
      })
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { needsVerification: !result.user.emailVerified }
  }

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(result.user)
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      name,
      photo: '',
      createdAt: serverTimestamp(),
      role: 'user',
    })
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

  const logout = async () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
