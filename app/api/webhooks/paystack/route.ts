import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminDb } from '../../../../lib/firebaseAdmin'

// Signature check MUST run against the raw, unparsed body — Paystack's
// signature is computed over the exact bytes they sent, so JSON.parse-ing
// first (which can subtly reformat whitespace) would break verification.
export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(rawBody)
    .digest('hex')

  if (!signature || signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const adminDb = getAdminDb()

  try {
    // Finalize withdrawal status once Paystack confirms it one way or
    // the other.
    if (['transfer.success', 'transfer.failed', 'transfer.reversed'].includes(event.event)) {
      const transferCode = event.data.transfer_code
      const snap = await adminDb.collection('withdrawals').where('transferCode', '==', transferCode).limit(1).get()
      if (!snap.empty) {
        const withdrawalDoc = snap.docs[0]
        const newStatus = event.event === 'transfer.success' ? 'success' : 'failed'
        await withdrawalDoc.ref.update({ status: newStatus, updatedAt: new Date().toISOString() })

        // Refund if it failed/reversed — the money never actually left
        // (or came back), so the wallet shouldn't stay short.
        if (newStatus === 'failed') {
          const { uid, amountKobo } = withdrawalDoc.data()
          const userRef = adminDb.collection('users').doc(uid)
          await adminDb.runTransaction(async (t) => {
            const userSnap = await t.get(userRef)
            const currentBalance = userSnap.exists ? (userSnap.data()?.balanceNGN || 0) : 0
            t.update(userRef, { balanceNGN: currentBalance + amountKobo })
          })
        }
      }
    }

    // Incoming bank-transfer deposit into a dedicated virtual account
    // (separate from the card-checkout deposit flow already built —
    // only relevant once dedicated accounts are actually provisioned).
    if (event.event === 'charge.success' && event.data?.authorization?.channel === 'dedicated_nuban') {
      const customerCode = event.data.customer?.customer_code
      if (customerCode) {
        const userSnap = await adminDb.collection('users').where('paystackCustomerCode', '==', customerCode).limit(1).get()
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0]
          const amountKobo = event.data.amount
          const reference = event.data.reference

          const processedRef = adminDb.collection('processedDeposits').doc(reference)
          const alreadyProcessed = await processedRef.get()
          if (!alreadyProcessed.exists) {
            await adminDb.runTransaction(async (t) => {
              const snap = await t.get(userDoc.ref)
              const currentBalance = snap.exists ? (snap.data()?.balanceNGN || 0) : 0
              t.update(userDoc.ref, { balanceNGN: currentBalance + amountKobo })
              t.set(processedRef, { uid: userDoc.id, amountKobo, reference, source: 'dedicated_nuban', createdAt: new Date().toISOString() })
            })
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    // Still return 200 so Paystack doesn't endlessly retry over an error
    // unrelated to signature validity — check Vercel's function logs for
    // the actual failure.
    console.error('Webhook processing error:', e)
    return NextResponse.json({ received: true })
  }
}
