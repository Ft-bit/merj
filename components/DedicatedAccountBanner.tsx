'use client'

import { useEffect, useState } from 'react'

const GREEN = '#00e676'

interface Props {
  uid: string
  email: string
  displayName: string
}

interface Account {
  accountName: string
  accountNumber: string
  bankName: string
}

export default function DedicatedAccountBanner({ uid, email, displayName }: Props) {
  const [account, setAccount] = useState<Account | null | undefined>(undefined) // undefined = loading
  const [showSetup, setShowSetup] = useState(false)
  const [firstName, setFirstName] = useState(displayName.split(' ')[0] || '')
  const [lastName, setLastName] = useState(displayName.split(' ').slice(1).join(' ') || '')
  const [phone, setPhone] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupError, setSetupError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/paystack/dedicated-account?uid=${encodeURIComponent(uid)}`)
      .then(res => res.json())
      .then(data => setAccount(data.account || null))
      .catch(() => setAccount(null))
  }, [uid])

  const handleActivate = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setSetupError('All fields are required.')
      return
    }
    setSetupLoading(true)
    setSetupError('')
    try {
      const res = await fetch('/api/paystack/dedicated-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() }),
      })
      const data = await res.json()
      if (data.account) {
        setAccount(data.account)
        setShowSetup(false)
      } else {
        setSetupError(data.error || 'Could not activate your deposit account.')
      }
    } catch {
      setSetupError('Could not activate your deposit account. Please try again.')
    }
    setSetupLoading(false)
  }

  const handleCopy = () => {
    if (!account) return
    navigator.clipboard?.writeText(account.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (account === undefined) return null // still loading — render nothing to avoid layout flash

  return (
    <div style={{ position: 'relative', zIndex: 1, marginBottom: '1rem' }}>
      {account ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '.6rem .8rem' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.45)', fontWeight: '600', letterSpacing: '.03em', marginBottom: '2px' }}>YOUR DEPOSIT ACCOUNT</p>
            <p style={{ fontSize: '.85rem', color: '#fff', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {account.accountNumber} · {account.bankName}
            </p>
          </div>
          <button
            onClick={handleCopy}
            style={{ flexShrink: 0, background: 'rgba(0,230,118,.12)', border: '1px solid rgba(0,230,118,.3)', color: GREEN, borderRadius: '8px', padding: '.4rem .7rem', fontSize: '.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      ) : !showSetup ? (
        <button
          onClick={() => setShowSetup(true)}
          style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.15)', borderRadius: '10px', padding: '.6rem .8rem', color: 'rgba(255,255,255,.7)', fontSize: '.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + Activate your Naira deposit account
        </button>
      ) : (
        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '.9rem' }}>
          <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', marginBottom: '.6rem' }}>
            One-time setup — this gives you a real bank account number for direct deposits.
          </p>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
            <input
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ flex: 1, padding: '.55rem .7rem', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', color: '#fff', fontSize: '.82rem', fontFamily: 'inherit', minWidth: 0 }}
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ flex: 1, padding: '.55rem .7rem', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', color: '#fff', fontSize: '.82rem', fontFamily: 'inherit', minWidth: 0 }}
            />
          </div>
          <input
            placeholder="Phone number (e.g. 08012345678)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '.55rem .7rem', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', color: '#fff', fontSize: '.82rem', fontFamily: 'inherit', marginBottom: '.6rem' }}
          />
          {setupError && <p style={{ color: '#fca5a5', fontSize: '.75rem', marginBottom: '.5rem' }}>{setupError}</p>}
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button
              onClick={() => setShowSetup(false)}
              style={{ flex: 1, padding: '.55rem', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
            <button
              onClick={handleActivate}
              disabled={setupLoading}
              style={{ flex: 1, padding: '.55rem', background: GREEN, border: 'none', borderRadius: '8px', color: '#000', fontSize: '.8rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: setupLoading ? .7 : 1 }}
            >
              {setupLoading ? 'Activating…' : 'Activate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
