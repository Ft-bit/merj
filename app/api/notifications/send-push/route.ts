import { NextResponse } from 'next/server'

// Expo's push API needs no API key or auth for basic sends — just a valid
// Expo push token (starts with "ExponentPushToken[...]"). No Firebase Admin
// SDK needed here since we're not touching Auth, just relaying a message.
export async function POST(req: Request) {
  const { token, title, body, data } = await req.json()
  if (!token || !title || !body) {
    return NextResponse.json({ error: 'token, title, and body are required' }, { status: 400 })
  }

  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        data: data || {},
        sound: 'default',
      }),
    })
    const result = await res.json()

    // Expo wraps errors inside a 200 response sometimes (e.g. a token that's
    // no longer valid) — check the payload itself, not just the HTTP status.
    if (result?.data?.status === 'error') {
      return NextResponse.json({ error: result.data.message || 'Push send failed', details: result.data }, { status: 502 })
    }

    return NextResponse.json({ success: true, result })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not send push notification' }, { status: 500 })
  }
}
