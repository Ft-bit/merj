'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

// react-paystack touches window at import time, which breaks Next.js's
// server-side render pass for this page even though the page itself is
// 'use client' — dynamic + ssr:false keeps it out of that pass entirely.
const AddCashButton = dynamic(() => import('../../components/AddCashButton'), { ssr: false })

const GREEN = '#00e676'

interface ChecklistState {
  emailVerified: boolean
  hasPhoto: boolean
  hasBio: boolean
  hasListing: boolean
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [checklist, setChecklist] = useState<ChecklistState>({
    emailVerified: false,
    hasPhoto: false,
    hasBio: false,
    hasListing: false,
  })
  const [balanceCents, setBalanceCents] = useState(0)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const stepIndexInitRef = useRef(false)

  useEffect(() => {
    if (!checking && !stepIndexInitRef.current) {
      stepIndexInitRef.current = true
      const order = [checklist.emailVerified, checklist.hasPhoto, checklist.hasBio, checklist.hasListing]
      const firstIncomplete = order.findIndex(v => !v)
      setStepIndex(firstIncomplete === -1 ? 0 : firstIncomplete)
    }
  }, [checking, checklist])

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        const data = snap.exists() ? snap.data() : {}
        setChecklist({
          emailVerified: !!user.emailVerified,
          hasPhoto: !!data.photo,
          hasBio: !!(data.bio && data.bio.trim().length > 0),
          hasListing: false, // wired up once we can query the user's own listings
        })
        setBalanceCents(typeof data.balance === 'number' ? data.balance : 0)
      } catch {
        setChecklist(prev => ({ ...prev, emailVerified: !!user.emailVerified }))
      }
      setChecking(false)
    })()
  }, [user])

  const handleWithdraw = () => {
    window.alert("Withdrawals coming soon — the payment system for moving funds out isn't built yet, this button is a placeholder for now.")
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user || !user.emailVerified) return null

  const steps = [
    { key: 'emailVerified', label: 'Verify your email', done: checklist.emailVerified, action: null },
    { key: 'hasPhoto', label: 'Add a profile photo', done: checklist.hasPhoto, action: () => router.push('/profile') },
    { key: 'hasBio', label: 'Write a short bio', done: checklist.hasBio, action: () => router.push('/profile') },
    { key: 'hasListing', label: 'List your first asset', done: checklist.hasListing, action: () => router.push('/sell') },
  ]
  const completedCount = steps.filter(s => s.done).length
  const allDone = completedCount === steps.length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}

        .feed-card{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;
          padding:1.5rem;transition:border-color .2s;
        }
        .feed-card:hover{border-color:rgba(0,230,118,.15)}

        .step-nav-btn{
          width:32px;height:32px;border-radius:50%;flex-shrink:0;border:none;
          background:var(--bg-input);color:var(--text-secondary);cursor:pointer;
          display:flex;align-items:center;justify-content:center;transition:background .15s;
          padding:0;
        }
        .step-nav-btn:hover:not(:disabled){ background:var(--border-color);color:var(--text-primary) }
        .step-nav-btn:disabled{ opacity:.35;cursor:not-allowed }

        .action-tile{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;
          padding:1.25rem;cursor:pointer;transition:all .2s;text-align:left;min-height:44px;
        }
        .action-tile:hover{border-color:rgba(0,230,118,.25);transform:translateY(-2px)}
        .rail-card{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;
          padding:1.25rem;
        }

        .balance-card{
          background:#0d1f14;border:1px solid rgba(0,230,118,.25);border-radius:18px;padding:1.5rem;
        }
        .balance-eye{ background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7) }
        .balance-action-btn{
          display:flex;align-items:center;gap:6px;border:none;border-radius:10px;padding:.6rem 1rem;
          font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;background:${GREEN};color:#000;
          transition:transform .15s;
        }
        .balance-action-btn:hover{ transform:translateY(-1px) }
        .balance-action-btn.ghost{ background:rgba(255,255,255,.08);color:#fff }

        @media(max-width:900px){ .right-rail{display:none!important} .feed-main{padding-top:4.5rem!important;padding-bottom:7rem!important} }
        @media(max-width:600px){ .feed-main{padding:1rem!important;padding-top:4.5rem!important;padding-bottom:7rem!important} }
      `}</style>

      <Sidebar />

      <main className="feed-main" style={{ flex: 1, padding: '2rem', maxWidth: '640px', margin: '0 auto', animation: 'fadeUp .4s ease' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem', marginBottom: '.25rem' }}>Welcome back</p>

          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-.03em' }}>
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </h1>
        </div>

        <div className="balance-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', fontWeight: '600' }}>Your balance</span>
            <button className="balance-eye" onClick={() => setBalanceVisible(v => !v)} aria-label="Toggle balance visibility">
              {balanceVisible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.7 19.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
          <div style={{ color: '#fff', fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-.02em', marginBottom: '1.25rem' }}>
            {balanceVisible ? formatCurrency(balanceCents) : '••••••'}
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            {user && (
              <AddCashButton uid={user.uid} email={user.email || ''} />
            )}
            <button className="balance-action-btn" onClick={handleWithdraw}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              Withdraw
            </button>
            <button className="balance-action-btn ghost" onClick={() => router.push('/listings')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
              Activity
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.85rem', marginBottom: '2rem' }}>
          <div className="action-tile" onClick={() => router.push('/listings')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" style={{ display: 'block', marginBottom: '.6rem' }}>
              <path d="M3 3h18l-1.5 6h-15z" />
              <path d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9" />
              <path d="M9 21v-6h6v6" />
            </svg>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>Browse marketplace</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.4 }}>Websites, accounts, stores</p>
          </div>
          <div className="action-tile" onClick={() => router.push('/sell')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" style={{ display: 'block', marginBottom: '.6rem' }}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>List an asset</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.4 }}>Free to list, pay on sale</p>
          </div>
        </div>

        <div style={{ borderBottom: !checking ? '1px solid var(--border-color)' : 'none', paddingBottom: !checking ? '1.5rem' : 0, marginBottom: !checking ? '1.5rem' : 0 }}>
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
            Recent activity
          </p>
          <div className="feed-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginBottom: '.4rem' }}>No activity yet</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem' }}>Offers and sales on your listings will show up here.</p>
          </div>
        </div>

        {!checking && !allDone && (() => {
          const idx = Math.min(stepIndex, steps.length - 1)
          const step = steps[idx]
          const canAct = !!(step.action && !step.done)
          return (
            <div className="feed-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.75rem' }}>
                <p style={{ fontWeight: '700', fontSize: '.9rem' }}>Get your account set up</p>
                <p style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>{completedCount}/{steps.length}</p>
              </div>
              <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.1rem' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: GREEN, borderRadius: '100px', transition: 'width .4s ease' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <button
                  className="step-nav-btn"
                  onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                  disabled={idx === 0}
                  aria-label="Previous step"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M15 18l-6-6 6-6"/></svg>
                </button>

                <div
                  onClick={() => { if (canAct) step.action!() }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '.7rem .9rem', borderRadius: '12px', background: 'var(--bg-input)',
                    cursor: canAct ? 'pointer' : 'default', minHeight: '44px', boxSizing: 'border-box',
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    border: step.done ? 'none' : '2px solid var(--border-color-strong)',
                    background: step.done ? GREEN : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </div>
                  <span style={{ fontSize: '.92rem', fontWeight: '600', color: step.done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: step.done ? 'line-through' : 'none' }}>
                    {step.label}
                  </span>
                </div>

                <button
                  className="step-nav-btn"
                  onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))}
                  disabled={idx === steps.length - 1}
                  aria-label="Next step"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '.9rem' }}>
                {steps.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setStepIndex(i)}
                    aria-label={`Go to step ${i + 1}`}
                    style={{
                      width: '6px', height: '6px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                      background: i === idx ? GREEN : 'var(--border-color)', transition: 'background .15s',
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })()}

        {!checking && allDone && (
          <div className="feed-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            <div>
              <p style={{ fontWeight: '700', color: GREEN, fontSize: '.95rem', marginBottom: '.2rem' }}>You're all set up</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem' }}>Start buying or selling digital assets on Merj.</p>
            </div>
          </div>
        )}
      </main>

      <aside className="right-rail" style={{ width: '300px', flexShrink: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="rail-card">
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
            Account
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.6rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span style={{ color: GREEN, fontWeight: '600' }}>Verified</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Active listings</span>
            <span style={{ fontWeight: '600' }}>0</span>
          </div>
        </div>

        <div className="rail-card">
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
            Coming soon
          </p>
          {['Secure checkout & escrow', 'Offers & negotiation'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '.4rem 0', fontSize: '.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(0,230,118,.5)' }} />
              {item}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
