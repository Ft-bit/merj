import { NextResponse } from 'next/server'
import { getAdminAuth } from '../../../../lib/firebaseAdmin'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

export async function POST(req: Request) {
  // Only signed-in Merj users can trigger a push. The app sends its Firebase
  // ID token in the Authorization header; without this check anyone who found
  // this URL could spam notifications to any device.
  const authHeader = req.headers.get('authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!idToken) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  try {
    await getAdminAuth().verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const { token, title, body, data } = await req.json()

  if (typeof token !== 'string' || !/^Expo(nent)?PushToken\[.+\]$/.test(token)) {
    return NextResponse.json({ error: 'Invalid push token' }, { status: 400 })
  }
  if (!title || !body) {
    return NextResponse.json({ error: 'Title and body required' }, { status: 400 })
  }

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: String(title).slice(0, 100),
        body: String(body).slice(0, 200),
        data: data || {},
        sound: 'default',
        priority: 'high',
        channelId: 'default',
      }),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ error: 'Push service rejected the request', detail: json }, { status: 502 })
    }
    return NextResponse.json({ success: true, result: json?.data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not send push' }, { status: 500 })
  }
}
