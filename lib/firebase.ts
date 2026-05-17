import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBertalx96gHldekbEspu2RdpcqW1iH7x8",
  authDomain: "merj-d69bf.firebaseapp.com",
  projectId: "merj-d69bf",
  storageBucket: "merj-d69bf.firebasestorage.app",
  messagingSenderId: "471279192593",
  appId: "1:471279192593:web:6cf55416f84535e824bfb0"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
