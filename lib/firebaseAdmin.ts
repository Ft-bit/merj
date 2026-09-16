import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

// Initialization is deferred until something actually calls getAdminAuth()
// or getAdminDb() — NOT run at module-import time. This matters because
// Vercel's build step "collects page data" for every API route by
// importing its module, and if initializeApp() ran eagerly here, it would
// try to read FIREBASE_ADMIN_* env vars during that build step (where
// they may not be reliably available yet), crashing the whole build even
// though the route would work fine once actually deployed and called.
let app: App | null = null
let _adminAuth: Auth | null = null
let _adminDb: Firestore | null = null

function getAdminApp(): App {
  if (!app) {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })
  }
  return app
}

export function getAdminAuth(): Auth {
  if (!_adminAuth) _adminAuth = getAuth(getAdminApp())
  return _adminAuth
}

export function getAdminDb(): Firestore {
  if (!_adminDb) _adminDb = getFirestore(getAdminApp())
  return _adminDb
}
