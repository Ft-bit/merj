import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { accountNumber, bankCode } = await req.json()
  if (!accountNumber || !bankCode) {
    return NextResponse.json({ error: 'accountNumber and bankCode are required' }, { status: 400 })
  }
  try {
    const res = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    )
    const data = await res.json()
    if (!data.status) return NextResponse.json({ error: data.message || 'Could not resolve account' }, { status: 400 })
    return NextResponse.json({ accountName: data.data.account_name })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not resolve account' }, { status: 500 })
  }
}
