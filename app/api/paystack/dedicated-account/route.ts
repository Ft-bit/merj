import { NextResponse } from 'next/server'
import { getAdminDb } from '../../../../lib/firebaseAdmin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 })

  const snap = await getAdminDb().collection('users').doc(uid).get()
  const data = snap.data()
  if (!data?.dedicatedAccount) return NextResponse.json({ account: null })
  return NextResponse.json({ account: data.dedicatedAccount })
}

export async function POST(req: Request) {
  const { uid, email, firstName, lastName, phone } = await req.json()
  if (!uid || !email || !firstName || !lastName || !phone) {
    return NextResponse.json({ error: 'uid, email, firstName, lastName, and phone are required' }, { status: 400 })
  }

  const adminDb = getAdminDb()
  const userRef = adminDb.collection('users').doc(uid)
  const userSnap = await userRef.get()
  const existing = userSnap.data()

  if (existing?.dedicatedAccount) {
    return NextResponse.json({ account: existing.dedicatedAccount })
  }

  try {
    let customerCode = existing?.paystackCustomerCode

    if (!customerCode) {
      const customerRes = await fetch('https://api.paystack.co/customer', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName, phone }),
      })
      const customerData = await customerRes.json()
      if (!customerData.status) {
        return NextResponse.json({ error: customerData.message || 'Could not create customer' }, { status: 400 })
      }
      customerCode = customerData.data.customer_code
      await userRef.set({ paystackCustomerCode: customerCode }, { merge: true })
    }

    const dvaRes = await fetch('https://api.paystack.co/dedicated_account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: customerCode, preferred_bank: 'titan-paystack' }),
    })
    const dvaData = await dvaRes.json()
    if (!dvaData.status) {
      return NextResponse.json({ error: dvaData.message || 'Could not create dedicated account' }, { status: 400 })
    }

    const account = {
      accountName: dvaData.data.account_name,
      accountNumber: dvaData.data.account_number,
      bankName: dvaData.data.bank?.name || '',
    }
    await userRef.set({ dedicatedAccount: account }, { merge: true })

    return NextResponse.json({ account })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not set up dedicated account' }, { status: 500 })
  }
}
