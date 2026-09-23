'use client'

import { useEffect, useState } from 'react'

const GREEN = '#00e676'

interface Bank { name: string; code: string }

interface Props {
  uid: string
  balanceKobo: number
  onSuccess: () => void
}

type Step = 'form' | 'confirm' | 'result'

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function WithdrawButton({ uid, balanceKobo, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')

  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')

  const [resolving, setResolving] = useState(false)
  const [resolvedName, setResolvedName] = useState('')
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [resultOk, setResultOk] = useState(false)

  const balanceNaira = balanceKobo / 100

  useEffect(() => {
    if (!open || banks.length > 0) return
    setBanksLoading(true)
    fetch('/api/paystack/banks')
      .then(res => res.json())
      .then(data => setBanks(data.banks || []))
      .catch(() => setError('Could not load banks. Please try again.'))
      .finally(() => setBanksLoading(false))
  }, [open, banks.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, submitting])

  const openModal = () => {
    setStep('form')
    setBankCode('')
    setAccountNumber('')
    setAmount('')
    setResolvedName('')
    setError('')
    setResultMessage('')
    setOpen(true)
  }

  const handleClose = () => {
    if (submitting) return
    setOpen(false)
  }

  const handleVerify = async () => {
    setError('')
    const naira = parseFloat(amount)
    if (!bankCode) { setError('Select a bank.'); return }
    if (!accountNumber || accountNumber.length < 10) { setError('Enter a valid 10-digit account number.'); return }
    if (isNaN(naira) || naira <= 0) { setError('Enter a valid amount.'); return }
    if (Math.round(naira * 100) > balanceKobo) { setError('That\'s more than your available balance.'); return }

    setResolving(true)
    try {
      const res = await fetch('/api/paystack/resolve-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, bankCode }),
      })
      const data = await res.json()
      if (data.accountName) {
        setResolvedName(data.accountName)
        setStep('confirm')
      } else {
        setError(data.error || 'Could not verify that account. Double-check the number and bank.')
      }
    } catch {
      setError('Could not verify that account. Please try again.')
    }
    setResolving(false)
  }

  const handleConfirmWithdraw = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/paystack/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, amountNaira: amount, accountNumber, bankCode, accountName: resolvedName }),
      })
      const data = await res.json()
      if (data.success) {
        setResultOk(true)
        setResultMessage(`₦${fmt(parseFloat(amount))} is on its way to ${resolvedName} (status: ${data.status}). It'll be finalized shortly.`)
        onSuccess()
      } else {
        setResultOk(false)
        setResultMessage(data.error || 'Withdrawal could not be completed.')
      }
    } catch {
      setResultOk(false)
      setResultMessage('Something went wrong. Please try again.')
    }
    setStep('result')
    setSubmitting(false)
  }

  const bankName = banks.find(b => b.code === bankCode)?.name || ''
  const stepNumber = step === 'form' ? 1 : 2

  return (
    <>
      <button className="balance-action-btn" onClick={openModal}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        Withdraw
      </button>

      {open && (
        <div className="wm-overlay" onClick={handleClose}>
          <style>{modalCss}</style>
          <div className="wm-sheet" role="dialog" aria-modal="true" aria-labelledby="withdraw-title" onClick={e => e.stopPropagation()}>

            {step !== 'result' && (
              <div className="wm-head">
                <div className="wm-head-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 id="withdraw-title" className="wm-title">{step === 'form' ? 'Withdraw funds' : 'Confirm withdrawal'}</h3>
                  <p className="wm-sub">Step {stepNumber} of 2 · {step === 'form' ? 'Recipient details' : 'Review & send'}</p>
                </div>
                <button className="wm-close" onClick={handleClose} aria-label="Close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {step !== 'result' && (
              <div className="wm-progress">
                <span className="on" />
                <span className={step === 'confirm' ? 'on' : ''} />
              </div>
            )}

            {step === 'form' && (
              <>
                <div className="wm-field">
                  <label className="wm-label" htmlFor="wd-bank">Bank</label>
                  <div className="wm-select-wrap">
                    <select
                      id="wd-bank"
                      className="wm-input"
                      value={bankCode}
                      onChange={e => setBankCode(e.target.value)}
                      disabled={banksLoading}
                    >
                      <option value="">{banksLoading ? 'Loading banks…' : 'Select your bank'}</option>
                      {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="wm-field">
                  <label className="wm-label" htmlFor="wd-acct">Account number</label>
                  <input
                    id="wd-acct"
                    className="wm-input"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit account number"
                    inputMode="numeric"
                    autoComplete="off"
                    style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: accountNumber ? '.08em' : 'normal' }}
                  />
                </div>

                <div className="wm-field" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label className="wm-label" htmlFor="wd-amt">Amount</label>
                    <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.45)', fontVariantNumeric: 'tabular-nums' }}>
                      Available: <span style={{ color: '#fff', fontWeight: 600 }}>₦{fmt(balanceNaira)}</span>
                    </span>
                  </div>
                  <div className="wm-prefix-wrap">
                    <span className="wm-prefix">₦</span>
                    <input
                      id="wd-amt"
                      className="wm-input"
                      value={amount}
                      onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                      onKeyDown={e => { if (e.key === 'Enter') handleVerify() }}
                      placeholder="0.00"
                      inputMode="decimal"
                      style={{ paddingLeft: '2rem', paddingRight: '4rem', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                    />
                    <button
                      type="button"
                      className="wm-max"
                      onClick={() => setAmount(balanceNaira > 0 ? String(balanceNaira) : '')}
                      disabled={balanceNaira <= 0}
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {error && <p className="wm-error">{error}</p>}

                <div className="wm-actions">
                  <button className="wm-btn ghost" onClick={handleClose}>Cancel</button>
                  <button className="wm-btn primary" onClick={handleVerify} disabled={resolving}>
                    {resolving ? <span className="wm-inline-spin" /> : null}
                    {resolving ? 'Verifying…' : 'Continue'}
                  </button>
                </div>
              </>
            )}

            {step === 'confirm' && (
              <>
                <div className="wm-summary-amount">
                  <p>You're sending</p>
                  <div>₦{fmt(parseFloat(amount))}</div>
                </div>

                <div className="wm-summary">
                  <div className="wm-recipient">
                    <div className="wm-avatar">{resolvedName.charAt(0).toUpperCase()}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="wm-recipient-name">{resolvedName}</p>
                      <p className="wm-recipient-meta">{bankName} · {accountNumber}</p>
                    </div>
                    <span className="wm-verified" title="Account verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  </div>
                </div>

                <div className="wm-warning">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" /></svg>
                  Double-check these details. Transfers can't be reversed once sent.
                </div>

                {error && <p className="wm-error">{error}</p>}

                <div className="wm-actions">
                  <button className="wm-btn ghost" onClick={() => setStep('form')} disabled={submitting}>Back</button>
                  <button className="wm-btn primary" onClick={handleConfirmWithdraw} disabled={submitting}>
                    {submitting ? <span className="wm-inline-spin" /> : null}
                    {submitting ? 'Sending…' : 'Confirm & send'}
                  </button>
                </div>
              </>
            )}

            {step === 'result' && (
              <div className="wm-center">
                <div className={`wm-result-icon ${resultOk ? 'ok' : 'bad'}`}>
                  {resultOk ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#03140a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  )}
                </div>
                <h3 id="withdraw-title" className="wm-title">{resultOk ? 'Withdrawal initiated' : 'Withdrawal failed'}</h3>
                <p className="wm-sub" style={{ marginBottom: '1.5rem' }}>{resultMessage}</p>
                <div className="wm-actions">
                  {!resultOk && <button className="wm-btn ghost" onClick={() => setStep('confirm')}>Try again</button>}
                  <button className="wm-btn primary" onClick={() => setOpen(false)}>Done</button>
                </div>
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
  .wm-head{display:flex;align-items:flex-start;gap:.8rem;margin-bottom:1rem}
  .wm-head-icon{width:40px;height:40px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;color:${GREEN};background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.18)}
  .wm-title{font-size:1.08rem;font-weight:700;letter-spacing:-.02em;margin:0 0 2px}
  .wm-sub{font-size:.82rem;color:rgba(255,255,255,.55);margin:0;line-height:1.5}
  .wm-close{width:32px;height:32px;border-radius:10px;flex-shrink:0;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);cursor:pointer;display:grid;place-items:center;transition:background .15s,color .15s}
  .wm-close:hover{background:rgba(255,255,255,.09);color:#fff}
  .wm-progress{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:1.4rem}
  .wm-progress span{height:3px;border-radius:100px;background:rgba(255,255,255,.08);transition:background .3s}
  .wm-progress span.on{background:${GREEN}}
  .wm-label{display:block;font-size:.72rem;font-weight:600;color:rgba(255,255,255,.5);letter-spacing:.02em;margin:0 0 .4rem}
  .wm-field{margin-bottom:1rem}
  .wm-input{width:100%;box-sizing:border-box;padding:.8rem .9rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#fff;font-size:.9rem;font-family:inherit;outline:none;transition:border-color .15s,box-shadow .15s;appearance:none;-webkit-appearance:none}
  .wm-input::placeholder{color:rgba(255,255,255,.28);letter-spacing:normal}
  .wm-input:focus{border-color:rgba(0,230,118,.45);box-shadow:0 0 0 4px rgba(0,230,118,.08)}
  .wm-input:disabled{opacity:.6}
  .wm-select-wrap{position:relative}
  .wm-select-wrap::after{content:'';position:absolute;right:14px;top:50%;width:7px;height:7px;border-right:2px solid rgba(255,255,255,.45);border-bottom:2px solid rgba(255,255,255,.45);transform:translateY(-70%) rotate(45deg);pointer-events:none}
  .wm-select-wrap select{padding-right:2.2rem;cursor:pointer}
  .wm-select-wrap option{color:#000}
  .wm-prefix-wrap{position:relative}
  .wm-prefix{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.45);font-weight:600;font-size:.9rem;pointer-events:none}
  .wm-max{position:absolute;right:.45rem;top:50%;transform:translateY(-50%);padding:.35rem .6rem;border-radius:8px;border:1px solid rgba(0,230,118,.25);background:rgba(0,230,118,.1);color:${GREEN};font-size:.68rem;font-weight:700;letter-spacing:.05em;cursor:pointer;transition:background .15s}
  .wm-max:hover:not(:disabled){background:rgba(0,230,118,.18)}
  .wm-max:disabled{opacity:.4;cursor:not-allowed}
  .wm-error{font-size:.8rem;color:#fca5a5;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);padding:.6rem .75rem;border-radius:10px;margin:0 0 1rem}
  .wm-actions{display:flex;gap:.55rem}
  .wm-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:.85rem;border-radius:13px;font-weight:650;font-size:.88rem;cursor:pointer;border:none;transition:transform .15s,filter .15s,background .15s,opacity .15s}
  .wm-btn.primary{background:${GREEN};color:#03140a;box-shadow:0 8px 20px -8px rgba(0,230,118,.6),0 1px 0 rgba(255,255,255,.35) inset}
  .wm-btn.primary:hover:not(:disabled){filter:brightness(1.05);transform:translateY(-1px)}
  .wm-btn.ghost{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.09)}
  .wm-btn.ghost:hover:not(:disabled){background:rgba(255,255,255,.1)}
  .wm-btn:disabled{opacity:.55;cursor:not-allowed}
  .wm-inline-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(3,20,10,.25);border-top-color:#03140a;animation:wmSpin .7s linear infinite}
  .wm-summary-amount{text-align:center;padding:.5rem 0 1.25rem}
  .wm-summary-amount p{font-size:.78rem;color:rgba(255,255,255,.5);margin:0 0 .35rem}
  .wm-summary-amount div{font-size:2.1rem;font-weight:700;letter-spacing:-.035em;font-variant-numeric:tabular-nums}
  .wm-summary{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:.9rem;margin-bottom:.8rem}
  .wm-recipient{display:flex;align-items:center;gap:.75rem}
  .wm-avatar{width:40px;height:40px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;font-weight:700;color:${GREEN};background:linear-gradient(145deg,rgba(0,230,118,.22),rgba(0,230,118,.05));border:1px solid rgba(0,230,118,.22)}
  .wm-recipient-name{font-weight:650;font-size:.9rem;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .wm-recipient-meta{font-size:.76rem;color:rgba(255,255,255,.5);margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
  .wm-verified{margin-left:auto;width:22px;height:22px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:rgba(0,230,118,.14);color:${GREEN}}
  .wm-warning{display:flex;gap:8px;font-size:.78rem;line-height:1.45;color:#fcd34d;background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.16);padding:.7rem .8rem;border-radius:12px;margin-bottom:1.1rem}
  .wm-center{text-align:center;padding:.75rem 0 0}
  .wm-center .wm-title{margin-bottom:.35rem}
  .wm-result-icon{width:60px;height:60px;border-radius:50%;margin:0 auto 1.1rem;display:grid;place-items:center}
  .wm-result-icon.ok{background:${GREEN};box-shadow:0 0 0 8px rgba(0,230,118,.12),0 12px 30px -8px rgba(0,230,118,.6)}
  .wm-result-icon.bad{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);box-shadow:0 0 0 8px rgba(239,68,68,.06)}
  @media(max-width:600px){
    .wm-overlay{align-items:flex-end;padding:0}
    .wm-sheet{max-width:none;border-radius:24px 24px 0 0;padding:1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));max-height:92dvh}
  }
  @media (prefers-reduced-motion:reduce){.wm-overlay,.wm-sheet{animation:none}}
`
