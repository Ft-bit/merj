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
import { auth, db, googleProvider } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  emailVerified: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<{ needsVerification: boolean }>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  resendVerification: () => Promise<void>
  checkVerification: () => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            photo: firebaseUser.photoURL || '',
            createdAt: serverTimestamp(),
            role: 'user',
            emailVerified: firebaseUser.emailVerified,
          })
        }
        setEmailVerified(firebaseUser.emailVerified)
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')
    const result = await signInWithPopup(auth, provider)
    // Google accounts are always verified
    const userRef = doc(db, 'users', result.user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || 'User',
        photo: result.user.photoURL || '',
        createdAt: serverTimestamp(),
        role: 'user',
        emailVerified: true,
      })
    }
  }

  const loginWithEmail = async (email: string, password: string): Promise<{ needsVerification: boolean }> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    if (!result.user.emailVerified) {
      return { needsVerification: true }
    }
    return { needsVerification: false }
  }

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // Send verification email immediately
    await sendEmailVerification(result.user, {
      url: `${window.location.origin}/dashboard`,
    })
    const userRef = doc(db, 'users', result.user.uid)
    await setDoc(userRef, {
      uid: result.user.uid,
      email,
      name,
      photo: '',
      createdAt: serverTimestamp(),
      role: 'user',
      emailVerified: false,
    })
  }

  const resendVerification = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/dashboard`,
      })
    }
  }

  const checkVerification = async (): Promise<boolean> => {
    if (auth.currentUser) {
      await reload(auth.currentUser)
      const verified = auth.currentUser.emailVerified
      setEmailVerified(verified)
      return verified
    }
    return false
  }

  const logout = async () => {
    await signOut(auth)
    setEmailVerified(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, emailVerified, loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
