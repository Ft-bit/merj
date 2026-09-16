import { NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebaseAdmin'

// Verifies a Paystack transaction server-side before crediting anyone's
// balance. Never trust a client-reported "payment succeeded" callback on
// its own — that's spoofable. This is the only place balanceNGN actually
// gets incremented.
export async function POST(req: Request) {
  const { reference, uid } = await req.json()
  if (!reference || !uid) {
    return NextResponse.json({ error: 'reference and uid are required' }, { status: 400 })
  }

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    if (!verifyData?.status || verifyData.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment could not be verified as successful' }, { status: 400 })
    }

    // Confirm the payment's own metadata actually matches the account
    // claiming it — otherwise someone could replay a reference that
    // belongs to a different user and credit their own account with it.
    if (verifyData.data.metadata?.uid !== uid) {
      return NextResponse.json({ error: 'This payment reference does not belong to this account' }, { status: 403 })
    }

    // Paystack amounts are already in kobo (the smallest NGN unit), which
    // matches how balanceNGN is stored — no conversion needed here.
    const amountKobo = verifyData.data.amount as number

    // Guard against double-processing the same reference twice (e.g. a
    // retried network request calling this route again).
    const processedRef = adminDb.collection('processedDeposits').doc(reference)
    const alreadyProcessed = await processedRef.get()
    if (alreadyProcessed.exists) {
      return NextResponse.json({ error: 'This deposit has already been processed' }, { status: 409 })
    }

    const userRef = adminDb.collection('users').doc(uid)
    await adminDb.runTransaction(async (t) => {
      const userSnap = await t.get(userRef)
      const currentBalance = userSnap.exists ? (userSnap.data()?.balanceNGN || 0) : 0
      t.set(userRef, { balanceNGN: currentBalance + amountKobo }, { merge: true })
      t.set(processedRef, { uid, amountKobo, reference, createdAt: new Date().toISOString() })
    })

    return NextResponse.json({ success: true, amountKobo })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Verification failed' }, { status: 500 })
  }
}
