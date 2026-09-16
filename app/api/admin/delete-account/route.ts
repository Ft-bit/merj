import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../../lib/firebaseAdmin'

// Protected admin/cleanup route — deletes a Firebase Auth account AND every
// trace of their Firestore data (user doc, notifications, conversations +
// messages they were part of). Deleting the Auth account alone (via the
// Console) never touched Firestore, which is exactly how repeated test
// account cleanup left "ghost" user docs behind.
//
// Requires a secret header so this can't be called by just anyone who finds
// the URL — set ADMIN_CLEANUP_SECRET in Vercel's environment variables to
// any long random string, then send it back as x-admin-secret.
export async function POST(req: Request) {
  const providedSecret = req.headers.get('x-admin-secret')
  if (!providedSecret || providedSecret !== process.env.ADMIN_CLEANUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { uid } = await req.json()
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 })

  const summary = { authDeleted: false, userDocDeleted: false, notificationsDeleted: 0, conversationsDeleted: 0, messagesDeleted: 0 }

  try {
    // 1. Delete the Auth account itself.
    try {
      await adminAuth.deleteUser(uid)
      summary.authDeleted = true
    } catch (e: any) {
      // If the Auth user is already gone (e.g. deleted manually via
      // Console already), that's fine — we still want to clean up
      // whatever Firestore data is left behind.
      if (e?.code !== 'auth/user-not-found') throw e
    }

    // 2. Delete their users/{uid} document.
    await adminDb.collection('users').doc(uid).delete()
    summary.userDocDeleted = true

    // 3. Delete all notifications addressed to them.
    const notifSnap = await adminDb.collection('notifications').where('userId', '==', uid).get()
    const notifBatch = adminDb.batch()
    notifSnap.docs.forEach(d => notifBatch.delete(d.ref))
    if (notifSnap.size > 0) await notifBatch.commit()
    summary.notificationsDeleted = notifSnap.size

    // 4. Delete every conversation they were a participant in, along with
    // each conversation's messages subcollection (Firestore doesn't
    // cascade-delete subcollections automatically).
    const convSnap = await adminDb.collection('conversations').where('participants', 'array-contains', uid).get()
    for (const convDoc of convSnap.docs) {
      const messagesSnap = await convDoc.ref.collection('messages').get()
      const msgBatch = adminDb.batch()
      messagesSnap.docs.forEach(m => msgBatch.delete(m.ref))
      if (messagesSnap.size > 0) await msgBatch.commit()
      summary.messagesDeleted += messagesSnap.size

      await convDoc.ref.delete()
      summary.conversationsDeleted += 1
    }

    return NextResponse.json({ success: true, summary })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Cleanup failed', summary }, { status: 500 })
  }
}
