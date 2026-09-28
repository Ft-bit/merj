import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.paystack.co/bank?country=nigeria&currency=NGN', {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const data = await res.json()
    if (!data.status) return NextResponse.json({ error: 'Could not load banks' }, { status: 500 })
    return NextResponse.json({ banks: data.data.map((b: any) => ({ name: b.name, code: b.code })) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not load banks' }, { status: 500 })
  }
}
