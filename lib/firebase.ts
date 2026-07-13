import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

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

// FIX: getStorage() can throw if the Storage bucket hasn't been provisioned
// yet (e.g. still on the Spark plan). Since every page imports this file
// via AuthContext, an uncaught error here broke the entire app, including
// pages like /dashboard that don't even use Storage. This wraps it so
// Auth/Firestore keep working regardless of Storage's status.
let storage: FirebaseStorage | null = null
try {
  storage = getStorage(app)
} catch {
  storage = null
}
export { storage }

export const googleProvider = new GoogleAuthProvider()
