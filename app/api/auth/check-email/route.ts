import { NextResponse } from 'next/server'
import { adminAuth } from '../../../../lib/firebaseAdmin'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  try {
    await adminAuth.getUserByEmail(email)
    // No error thrown means a user with this email exists.
    return NextResponse.json({ exists: true })
  } catch (e: any) {
    if (e?.code === 'auth/user-not-found') {
      return NextResponse.json({ exists: false })
    }
    return NextResponse.json({ error: e?.message || 'Could not check email' }, { status: 500 })
  }
}
