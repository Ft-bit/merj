import { NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '../../../../lib/firebaseAdmin'

export async function POST(req: Request) {
  const providedSecret = req.headers.get('x-admin-secret')
  if (!providedSecret || providedSecret !== process.env.ADMIN_CLEANUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { uid } = await req.json()
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 })

  const adminAuth = getAdminAuth()
  const adminDb = getAdminDb()
  const summary = { authDeleted: false, userDocDeleted: false, notificationsDeleted: 0, conversationsDeleted: 0, messagesDeleted: 0 }

  try {
    try {
      await adminAuth.deleteUser(uid)
      summary.authDeleted = true
    } catch (e: any) {
      if (e?.code !== 'auth/user-not-found') throw e
    }

    await adminDb.collection('users').doc(uid).delete()
    summary.userDocDeleted = true

    const notifSnap = await adminDb.collection('notifications').where('userId', '==', uid).get()
    const notifBatch = adminDb.batch()
    notifSnap.docs.forEach(d => notifBatch.delete(d.ref))
    if (notifSnap.size > 0) await notifBatch.commit()
    summary.notificationsDeleted = notifSnap.size

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
