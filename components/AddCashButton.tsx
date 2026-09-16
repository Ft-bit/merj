'use client'

import { usePaystackPayment } from 'react-paystack'

const GREEN = '#00e676'

interface Props {
  uid: string
  email: string
}

// Pulled into its own client-only component so react-paystack (which
// touches window at import time) never gets bundled into the server-side
// render pass for /dashboard — see AddCashButton dynamic-import usage in
// dashboard/page.tsx for the ssr:false wrapping that makes this safe.
export default function AddCashButton({ uid, email }: Props) {
  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'NGN',
    amount: 0,
    email,
  })

  const handleAddCash = () => {
    const nairaInput = window.prompt('How much would you like to add? (₦)')
    if (!nairaInput) return
    const naira = parseFloat(nairaInput)
    if (isNaN(naira) || naira <= 0) {
      window.alert('Enter a valid amount.')
      return
    }
    const reference = `merj_${uid}_${Date.now()}`
    initializePayment({
      config: {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email,
        amount: Math.round(naira * 100), // Paystack expects kobo, the smallest NGN unit
        currency: 'NGN',
        reference,
        metadata: { uid },
      },
      onSuccess: async () => {
        try {
          const res = await fetch('/api/payments/verify-deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference, uid }),
          })
          const data = await res.json()
          if (data.success) {
            window.alert(`✓ ₦${naira.toLocaleString()} added successfully.`)
          } else {
            window.alert(`Payment went through, but we couldn't confirm it on our end: ${data.error || 'unknown error'}. Contact support with reference ${reference}.`)
          }
        } catch {
          window.alert(`Payment went through, but something went wrong confirming it. Contact support with reference ${reference}.`)
        }
      },
      onClose: () => {},
    } as any)
  }

  return (
    <button className="balance-action-btn" onClick={handleAddCash}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      Add cash (₦)
    </button>
  )
}
