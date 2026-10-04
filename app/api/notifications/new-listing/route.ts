import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { getAdminAuth } from '../../../../lib/firebaseAdmin'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'
const TOKEN_PATTERN = /^Expo(nent)?PushToken\[.+\]$/

export async function POST(req: Request) {
  // Only the signed-in seller can trigger the announcement for their own listing.
  const authHeader = req.headers.get('authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!idToken) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  let uid: string
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  try {
    const { listingId } = await req.json()
    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }

    // verifyIdToken above has already initialised the Admin app.
    const db = getFirestore()
    const listingRef = db.collection('listings').doc(listingId)
    const listingSnap = await listingRef.get()
    if (!listingSnap.exists) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    // The title and price come from the saved listing, never from the request,
    // so nobody can use this route to push arbitrary text to users.
    const listing = listingSnap.data() as any
    if (listing.sellerId !== uid) return NextResponse.json({ error: 'Not your listing' }, { status: 403 })
    if (listing.status !== 'active') return NextResponse.json({ success: true, sent: 0 })
    if (listing.pushNotified) return NextResponse.json({ success: true, sent: 0, note: 'Already announced' })

    // Only people who left "Get product updates and marketplace tips" on.
    const usersSnap = await db.collection('users').where('marketingOptIn', '==', true).get()
    const tokens = Array.from(new Set(
      usersSnap.docs
        .filter(d => d.id !== uid)
        .map(d => d.data()?.expoPushToken)
        .filter((t: any): t is string => typeof t === 'string' && TOKEN_PATTERN.test(t))
    ))

    const title = 'New listing on Merj'
    const body = `${String(listing.title || 'A new asset').slice(0, 120)} — $${Number(listing.price || 0).toLocaleString('en-US')}`

    let sent = 0
    for (let i = 0; i < tokens.length; i += 100) {
      const chunk = tokens.slice(i, i + 100)
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk.map(to => ({
          to,
          title,
          body,
          data: { link: `listing/${listingId}` },
          sound: 'default',
          priority: 'high',
          channelId: 'default',
        }))),
      })
      if (res.ok) sent += chunk.length
    }

    // Stops a retry or double-tap from announcing the same listing twice.
    await listingRef.update({ pushNotified: true })

    return NextResponse.json({ success: true, sent })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not send notifications' }, { status: 500 })
  }
}
