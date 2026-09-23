'use client'

import { useEffect, useState } from 'react'
import { usePaystackPayment } from 'react-paystack'

const GREEN = '#00e676'
const QUICK_AMOUNTS = [1000, 5000, 10000, 50000]

interface Props {
  uid: string
  email: string
  onSuccess?: () => void
}

type Step = 'amount' | 'verifying' | 'result'

// Pulled into its own client-only component so react-paystack (which
// touches window at import time) never gets bundled into the server-side
// render pass for /dashboard — see AddCashButton dynamic-import usage in
// dashboard/page.tsx for the ssr:false wrapping that makes this safe.
export default function AddCashButton({ uid, email, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [resultOk, setResultOk] = useState(false)
  const [resultMessage, setResultMessage] = useState('')

  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'NGN',
    amount: 0,
    email,
  })

  const openModal = () => {
    setStep('amount')
    setAmount('')
    setError('')
    setResultMessage('')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'verifying') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, step])

  const handleContinue = () => {
    setError('')
    const naira = parseFloat(amount)
    if (isNaN(naira) || naira <= 0) {
      setError('Enter a valid amount.')
      return
    }
    const reference = `merj_${uid}_${Date.now()}`

    // Hide our modal so it doesn't sit on top of Paystack's popup
    setOpen(false)

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
        setStep('verifying')
        setOpen(true)
        try {
          const res = await fetch('/api/payments/verify-deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference, uid }),
          })
          const data = await res.json()
          if (data.success) {
            setResultOk(true)
            setResultMessage(`₦${naira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been added to your wallet.`)
            onSuccess?.()
          } else {
            setResultOk(false)
            setResultMessage(`Your payment went through, but we couldn't confirm it on our end: ${data.error || 'unknown error'}. Contact support with reference ${reference}.`)
          }
        } catch {
          setResultOk(false)
          setResultMessage(`Your payment went through, but something went wrong confirming it. Contact support with reference ${reference}.`)
        }
        setStep('result')
      },
      onClose: () => {},
    } as any)
  }

  const numeric = parseFloat(amount)
  const canContinue = !isNaN(numeric) && numeric > 0

  return (
    <>
      <button className="balance-action-btn" onClick={openModal}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Add cash
      </button>

      {open && (
        <div className="wm-overlay" onClick={() => step !== 'verifying' && setOpen(false)}>
          <style>{modalCss}</style>
          <div className="wm-sheet" role="dialog" aria-modal="true" aria-labelledby="addcash-title" onClick={e => e.stopPropagation()}>

            {step === 'amount' && (
              <>
                <div className="wm-head">
                  <div className="wm-head-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 id="addcash-title" className="wm-title">Add cash</h3>
                    <p className="wm-sub">Top up your NGN wallet via Paystack</p>
                  </div>
                  <button className="wm-close" onClick={() => setOpen(false)} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="wm-amount-box">
                  <span className="wm-amount-prefix">₦</span>
                  <input
                    className="wm-amount-input"
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                    onKeyDown={e => { if (e.key === 'Enter' && canContinue) handleContinue() }}
                    placeholder="0.00"
                    inputMode="decimal"
                    autoFocus
                    aria-label="Amount in naira"
                  />
                </div>

                <div className="wm-chips">
                  {QUICK_AMOUNTS.map(v => (
                    <button
                      key={v}
                      className={`wm-chip${numeric === v ? ' active' : ''}`}
                      onClick={() => { setAmount(String(v)); setError('') }}
                    >
                      ₦{v >= 1000 ? `${v / 1000}k` : v}
                    </button>
                  ))}
                </div>

                {error && <p className="wm-error">{error}</p>}

                <button className="wm-btn primary" onClick={handleContinue} disabled={!canContinue} style={{ width: '100%' }}>
                  Continue to payment
                </button>

                <p className="wm-foot">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
                  Payments are securely processed by Paystack
                </p>
              </>
            )}

            {step === 'verifying' && (
              <div className="wm-center">
                <div className="wm-spinner" />
                <h3 className="wm-title">Confirming payment</h3>
                <p className="wm-sub">This usually takes a few seconds. Please don't close this window.</p>
              </div>
            )}

            {step === 'result' && (
              <div className="wm-center">
                <div className={`wm-result-icon ${resultOk ? 'ok' : 'bad'}`}>
                  {resultOk ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#03140a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round"><path d="M12 8v5M12 16.5v.5" /></svg>
                  )}
                </div>
                <h3 className="wm-title">{resultOk ? 'Money added' : 'Needs attention'}</h3>
                <p className="wm-sub" style={{ marginBottom: '1.5rem' }}>{resultMessage}</p>
                <button className="wm-btn primary" style={{ width: '100%' }} onClick={() => setOpen(false)}>Done</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}

const modalCss = `
  @keyframes wmFade{from{opacity:0}to{opacity:1}}
  @keyframes wmUp{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
  @keyframes wmSpin{to{transform:rotate(360deg)}}
  .wm-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1.25rem;animation:wmFade .2s ease}
  .wm-sheet{position:relative;width:100%;max-width:400px;max-height:calc(100dvh - 2.5rem);overflow-y:auto;background:linear-gradient(180deg,#111713 0%,#0a0d0b 100%);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:1.5rem;color:#fff;box-shadow:0 40px 80px -20px rgba(0,0,0,.8),0 1px 0 rgba(255,255,255,.05) inset;animation:wmUp .3s cubic-bezier(.2,.8,.2,1);font-family:inherit}
  .wm-sheet::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,230,118,.45),transparent)}
  .wm-sheet button{font-family:inherit}
  .wm-sheet button:focus-visible,.wm-sheet input:focus-visible,.wm-sheet select:focus-visible{outline:2px solid ${GREEN};outline-offset:2px}
  .wm-head{display:flex;align-items:flex-start;gap:.8rem;margin-bottom:1.4rem}
  .wm-head-icon{width:40px;height:40px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;color:${GREEN};background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.18)}
  .wm-title{font-size:1.08rem;font-weight:700;letter-spacing:-.02em;margin:0 0 2px}
  .wm-sub{font-size:.82rem;color:rgba(255,255,255,.55);margin:0;line-height:1.5}
  .wm-close{width:32px;height:32px;border-radius:10px;flex-shrink:0;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);cursor:pointer;display:grid;place-items:center;transition:background .15s,color .15s}
  .wm-close:hover{background:rgba(255,255,255,.09);color:#fff}
  .wm-amount-box{display:flex;align-items:baseline;gap:6px;padding:1.1rem 1.1rem;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);transition:border-color .15s,box-shadow .15s;margin-bottom:.8rem}
  .wm-amount-box:focus-within{border-color:rgba(0,230,118,.45);box-shadow:0 0 0 4px rgba(0,230,118,.08)}
  .wm-amount-prefix{font-size:1.5rem;font-weight:600;color:rgba(255,255,255,.45)}
  .wm-amount-input{flex:1;min-width:0;background:none;border:none;outline:none;color:#fff;font-size:2.1rem;font-weight:700;letter-spacing:-.03em;font-family:inherit;font-variant-numeric:tabular-nums;padding:0}
  .wm-amount-input::placeholder{color:rgba(255,255,255,.2)}
  .wm-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:1.2rem}
  .wm-chip{padding:.55rem 0;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:rgba(255,255,255,.75);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .15s}
  .wm-chip:hover{border-color:rgba(0,230,118,.3);color:#fff}
  .wm-chip.active{background:rgba(0,230,118,.12);border-color:rgba(0,230,118,.4);color:${GREEN}}
  .wm-label{display:block;font-size:.72rem;font-weight:600;color:rgba(255,255,255,.5);letter-spacing:.02em;margin:0 0 .4rem}
  .wm-field{margin-bottom:1rem}
  .wm-input{width:100%;box-sizing:border-box;padding:.8rem .9rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#fff;font-size:.9rem;font-family:inherit;outline:none;transition:border-color .15s,box-shadow .15s;appearance:none;-webkit-appearance:none}
  .wm-input::placeholder{color:rgba(255,255,255,.28)}
  .wm-input:focus{border-color:rgba(0,230,118,.45);box-shadow:0 0 0 4px rgba(0,230,118,.08)}
  .wm-select-wrap{position:relative}
  .wm-select-wrap::after{content:'';position:absolute;right:14px;top:50%;width:7px;height:7px;border-right:2px solid rgba(255,255,255,.45);border-bottom:2px solid rgba(255,255,255,.45);transform:translateY(-70%) rotate(45deg);pointer-events:none}
  .wm-select-wrap select{padding-right:2.2rem;cursor:pointer}
  .wm-select-wrap option{color:#000}
  .wm-error{display:flex;align-items:center;gap:6px;font-size:.8rem;color:#fca5a5;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);padding:.6rem .75rem;border-radius:10px;margin:0 0 1rem}
  .wm-actions{display:flex;gap:.55rem}
  .wm-btn{flex:1;padding:.85rem;border-radius:13px;font-weight:650;font-size:.88rem;cursor:pointer;border:none;transition:transform .15s,filter .15s,background .15s,opacity .15s}
  .wm-btn.primary{background:${GREEN};color:#03140a;box-shadow:0 8px 20px -8px rgba(0,230,118,.6),0 1px 0 rgba(255,255,255,.35) inset}
  .wm-btn.primary:hover:not(:disabled){filter:brightness(1.05);transform:translateY(-1px)}
  .wm-btn.ghost{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.09)}
  .wm-btn.ghost:hover:not(:disabled){background:rgba(255,255,255,.1)}
  .wm-btn:disabled{opacity:.45;cursor:not-allowed}
  .wm-foot{display:flex;align-items:center;justify-content:center;gap:6px;font-size:.72rem;color:rgba(255,255,255,.38);margin:1rem 0 0}
  .wm-center{text-align:center;padding:.75rem 0 0}
  .wm-center .wm-title{margin-bottom:.35rem}
  .wm-spinner{width:44px;height:44px;margin:0 auto 1.1rem;border-radius:50%;border:3px solid rgba(0,230,118,.15);border-top-color:${GREEN};animation:wmSpin .8s linear infinite}
  .wm-result-icon{width:60px;height:60px;border-radius:50%;margin:0 auto 1.1rem;display:grid;place-items:center}
  .wm-result-icon.ok{background:${GREEN};box-shadow:0 0 0 8px rgba(0,230,118,.12),0 12px 30px -8px rgba(0,230,118,.6)}
  .wm-result-icon.bad{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);box-shadow:0 0 0 8px rgba(239,68,68,.06)}
  @media(max-width:600px){
    .wm-overlay{align-items:flex-end;padding:0}
    .wm-sheet{max-width:none;border-radius:24px 24px 0 0;padding:1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));max-height:92dvh}
  }
  @media (prefers-reduced-motion:reduce){.wm-overlay,.wm-sheet{animation:none}}
`
