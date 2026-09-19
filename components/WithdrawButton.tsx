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

export default function WithdrawButton({ uid, balanceKobo, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')

  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('');

  const [resolving, setResolving] = useState(false);
  const [resolvedName, setResolvedName] = useState('');
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultOk, setResultOk] = useState(false);

  useEffect(() => {
    if (!open || banks.length > 0) return
    setBanksLoading(true)
    fetch('/api/paystack/banks')
      .then(res => res.json())
      .then(data => setBanks(data.banks || []))
      .catch(() => setError('Could not load banks. Please try again.'))
      .finally(() => setBanksLoading(false))
  }, [open, banks.length])

  const reset = () => {
    setStep('form')
    setBankCode('')
    setAccountNumber('')
    setAmount('')
    setResolvedName('')
    setError('')
    setResultMessage('')
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const handleVerify = async () => {
    setError('')
    const naira = parseFloat(amount)
    if (!bankCode) { setError('Select a bank.'); return }
    if (!accountNumber || accountNumber.length < 10) { setError('Enter a valid account number.'); return }
    if (isNaN(naira) || naira <= 0) { setError('Enter a valid amount.'); return }
    if (Math.round(naira * 100) > balanceKobo) { setError('That\'s more than your current balance.'); return }

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
        setResultMessage(`Withdrawal of ₦${parseFloat(amount).toLocaleString()} to ${resolvedName} has been initiated (status: ${data.status}). It'll be finalized shortly.`)
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

  return (
    <>
      <button className="balance-action-btn" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        Withdraw
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1.5rem' }} onClick={handleClose}>
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.1)', borderRadius: '18px', padding: '1.75rem', width: '100%', maxWidth: '380px', color: '#fff' }} onClick={e => e.stopPropagation()}>

            {step === 'form' && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.2rem' }}>Withdraw funds</h3>

                <label style={{ fontSize: '.72rem', fontWeight: '700', color: 'rgba(255,255,255,.5)', letterSpacing: '.04em' }}>BANK</label>
                <select
                  value={bankCode}
                  onChange={e => setBankCode(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '.7rem', marginTop: '.3rem', marginBottom: '.9rem', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '10px', color: '#fff', fontSize: '.88rem', fontFamily: 'inherit' }}
                >
                  <option value="" style={{ color: '#000' }}>{banksLoading ? 'Loading banks…' : 'Select your bank'}</option>
                  {banks.map(b => <option key={b.code} value={b.code} style={{ color: '#000' }}>{b.name}</option>)}
                </select>

                <label style={{ fontSize: '.72rem', fontWeight: '700', color: 'rgba(255,255,255,.5)', letterSpacing: '.04em' }}>ACCOUNT NUMBER</label>
                <input
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit account number"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '.7rem', marginTop: '.3rem', marginBottom: '.9rem', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '10px', color: '#fff', fontSize: '.88rem', fontFamily: 'inherit' }}
                />

                <label style={{ fontSize: '.72rem', fontWeight: '700', color: 'rgba(255,255,255,.5)', letterSpacing: '.04em' }}>AMOUNT (₦)</label>
                <input
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  type="number"
                  min="0"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '.7rem', marginTop: '.3rem', marginBottom: '.4rem', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '10px', color: '#fff', fontSize: '.88rem', fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.4)', marginBottom: '1.1rem' }}>
                  Available: ₦{(balanceKobo / 100).toLocaleString()}
                </p>

                {error && <p style={{ color: '#fca5a5', fontSize: '.8rem', marginBottom: '.9rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button onClick={handleClose} style={{ flex: 1, padding: '.75rem', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                  <button onClick={handleVerify} disabled={resolving} style={{ flex: 1, padding: '.75rem', background: GREEN, border: 'none', borderRadius: '10px', color: '#000', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: resolving ? .7 : 1 }}>
                    {resolving ? 'Verifying…' : 'Continue'}
                  </button>
                </div>
              </>
            )}

            {step === 'confirm' && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '.4rem' }}>Confirm withdrawal</h3>
                <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.6)', marginBottom: '1.2rem' }}>Double-check this before continuing — transfers can't be reversed once sent.</p>

                <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: '12px', padding: '1rem', marginBottom: '1.1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>Amount</span><span style={{ fontWeight: '700', fontSize: '.85rem' }}>₦{parseFloat(amount).toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>Recipient</span><span style={{ fontWeight: '700', fontSize: '.85rem', textAlign: 'right' }}>{resolvedName}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>Account</span><span style={{ fontWeight: '700', fontSize: '.85rem' }}>{accountNumber}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>Bank</span><span style={{ fontWeight: '700', fontSize: '.85rem' }}>{banks.find(b => b.code === bankCode)?.name}</span></div>
                </div>

                {error && <p style={{ color: '#fca5a5', fontSize: '.8rem', marginBottom: '.9rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button onClick={() => setStep('form')} style={{ flex: 1, padding: '.75rem', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                  <button onClick={handleConfirmWithdraw} disabled={submitting} style={{ flex: 1, padding: '.75rem', background: GREEN, border: 'none', borderRadius: '10px', color: '#000', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? .7 : 1 }}>
                    {submitting ? 'Sending…' : 'Confirm & send'}
                  </button>
                </div>
              </>
            )}

            {step === 'result' && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '.6rem', color: resultOk ? GREEN : '#fca5a5' }}>
                  {resultOk ? 'Withdrawal initiated' : 'Withdrawal failed'}
                </h3>
                <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.7)', marginBottom: '1.3rem', lineHeight: 1.5 }}>{resultMessage}</p>
                <button onClick={handleClose} style={{ width: '100%', padding: '.8rem', background: GREEN, border: 'none', borderRadius: '10px', color: '#000', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
