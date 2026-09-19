import { NextResponse } from 'next/server'
import { getAdminDb } from '../../../../lib/firebaseAdmin'

// Full withdrawal flow: reserve funds -> create transfer recipient ->
// initiate transfer -> record as pending. The webhook (transfer.success /
// transfer.failed) is what finalizes things — a transfer being "initiated"
// here doesn't guarantee it completed, since Paystack sometimes requires
// OTP/manual approval on their side depending on account settings.
export async function POST(req: Request) {
  const { uid, amountNaira, accountNumber, bankCode, accountName } = await req.json()
  if (!uid || !amountNaira || !accountNumber || !bankCode || !accountName) {
    return NextResponse.json({ error: 'uid, amountNaira, accountNumber, bankCode, and accountName are required' }, { status: 400 })
  }
  const amountKobo = Math.round(Number(amountNaira) * 100)
  if (!amountKobo || amountKobo <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const adminDb = getAdminDb()
  const userRef = adminDb.collection('users').doc(uid)

  // Reserve funds inside a transaction first — this closes the classic
  // double-spend race where two withdrawal requests both pass a balance
  // check against the same starting balance before either deducts.
  try {
    await adminDb.runTransaction(async (t) => {
      const snap = await t.get(userRef)
      const currentBalance = snap.exists ? (snap.data()?.balanceNGN || 0) : 0
      if (currentBalance < amountKobo) throw new Error('INSUFFICIENT_BALANCE')
      t.update(userRef, { balanceNGN: currentBalance - amountKobo })
    })
  } catch (e: any) {
    if (e?.message === 'INSUFFICIENT_BALANCE') {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Could not reserve funds' }, { status: 500 })
  }

  // Funds are now deducted — any failure from here needs to refund them,
  // since the user's money shouldn't vanish if Paystack's side fails.
  const refund = async () => {
    await adminDb.runTransaction(async (t) => {
      const snap = await t.get(userRef)
      const currentBalance = snap.exists ? (snap.data()?.balanceNGN || 0) : 0
      t.update(userRef, { balanceNGN: currentBalance + amountKobo })
    })
  }

  try {
    const recipientRes = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nuban', name: accountName, account_number: accountNumber, bank_code: bankCode, currency: 'NGN' }),
    })
    const recipientData = await recipientRes.json()
    if (!recipientData.status) {
      await refund()
      return NextResponse.json({ error: recipientData.message || 'Could not create transfer recipient' }, { status: 400 })
    }
    const recipientCode = recipientData.data.recipient_code

    const withdrawalRef = adminDb.collection('withdrawals').doc()
    const transferRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'balance', amount: amountKobo, recipient: recipientCode, reason: 'Merj wallet withdrawal', reference: withdrawalRef.id }),
    })
    const transferData = await transferRes.json()

    if (!transferData.status) {
      await refund()
      return NextResponse.json({ error: transferData.message || 'Transfer could not be initiated' }, { status: 400 })
    }

    await withdrawalRef.set({
      uid, amountKobo, accountNumber, bankCode, accountName,
      recipientCode, transferCode: transferData.data.transfer_code,
      status: transferData.data.status,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, status: transferData.data.status, withdrawalId: withdrawalRef.id })
  } catch (e: any) {
    await refund()
    return NextResponse.json({ error: e?.message || 'Withdrawal failed' }, { status: 500 })
  }
}
