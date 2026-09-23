'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'
import DedicatedAccountBanner from '../../components/DedicatedAccountBanner'

// react-paystack touches window at import time, which breaks Next.js's
// server-side render pass for this page even though the page itself is
// 'use client' — dynamic + ssr:false keeps it out of that pass entirely.
const AddCashButton = dynamic(() => import('../../components/AddCashButton'), { ssr: false })
const WithdrawButton = dynamic(() => import('../../components/WithdrawButton'), { ssr: false })

const GREEN = '#00e676'

interface ChecklistState {
  emailVerified: boolean
  hasPhoto: boolean
  hasBio: boolean
  hasListing: boolean
}

function splitNaira(kobo: number) {
  const [whole, dec] = (kobo / 100).toFixed(2).split('.')
  return { whole: Number(whole).toLocaleString(), dec }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ---------- Icons ---------- */
const Icon = {
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.7 19.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  clock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  store: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18l-1.5 6h-15z" /><path d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9" /><path d="M9 21v-6h6v6" /></svg>,
  plus: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,
  pulse: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
}

/* ---------- Progress ring ---------- */
function ProgressRing({ pct }: { pct: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border-color)" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r} fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <span className="num" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '.72rem', fontWeight: 700 }}>
        {pct}%
      </span>
    </div>
  )
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

  const today = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
    []
  )

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  const refreshBalance = async () => {
    if (!user) return
    try {
      const snap = await getDoc(doc(db, 'users', user.uid))
      const data = snap.exists() ? snap.data() : {}
      setBalanceCents(typeof data.balanceNGN === 'number' ? data.balanceNGN : 0)
    } catch {}
  }

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
        setBalanceCents(typeof data.balanceNGN === 'number' ? data.balanceNGN : 0)
      } catch {
        setChecklist(prev => ({ ...prev, emailVerified: !!user.emailVerified }))
      }
      setChecking(false)
    })()
  }, [user])

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(0,230,118,.15)', borderTopColor: GREEN, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user || !user.emailVerified) return null

  const name = user.displayName || user.email?.split('@')[0] || 'there'
  const firstName = name.split(' ')[0]
  const initial = name.charAt(0).toUpperCase()

  const steps = [
    { key: 'emailVerified', label: 'Verify your email', hint: 'Secures your account', done: checklist.emailVerified, action: null as null | (() => void) },
    { key: 'hasPhoto', label: 'Add a profile photo', hint: 'Buyers trust faces', done: checklist.hasPhoto, action: () => router.push('/profile') },
    { key: 'hasBio', label: 'Write a short bio', hint: 'Tell people what you do', done: checklist.hasBio, action: () => router.push('/profile') },
    { key: 'hasListing', label: 'List your first asset', hint: 'Free to list, pay on sale', done: checklist.hasListing, action: () => router.push('/sell') },
  ]
  const completedCount = steps.filter(s => s.done).length
  const allDone = completedCount === steps.length
  const progressPct = Math.round((completedCount / steps.length) * 100)
  const { whole, dec } = splitNaira(balanceCents)

  return (
    <div className="dash-root">
      <style>{`
        *{box-sizing:border-box}
        .dash-root{
          min-height:100dvh;display:flex;background:var(--bg-primary);color:var(--text-primary);
          font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          -webkit-font-smoothing:antialiased;
        }
        .num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}

        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .reveal{opacity:0;animation:fadeUp .5s cubic-bezier(.2,.8,.2,1) forwards}
        .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.16s}.d4{animation-delay:.22s}.d5{animation-delay:.28s}
        @media (prefers-reduced-motion:reduce){ .reveal{animation:none;opacity:1} }

        button{font-family:inherit}
        button:focus-visible{outline:2px solid ${GREEN};outline-offset:2px}

        /* Section label */
        .eyebrow{
          font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          color:var(--text-tertiary);
        }
        .section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem}
        .link-btn{
          background:none;border:none;padding:4px 0;cursor:pointer;font-size:.8rem;font-weight:600;
          color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px;transition:color .15s;
        }
        .link-btn:hover{color:${GREEN}}

        /* Surfaces */
        .surface{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;
          transition:border-color .2s, box-shadow .2s;
        }

        /* Balance card */
        .balance-card{
          position:relative;overflow:hidden;border-radius:24px;padding:1.5rem 1.5rem 1.25rem;
          background:
            radial-gradient(120% 90% at 100% 0%, rgba(0,230,118,.18) 0%, transparent 55%),
            linear-gradient(160deg,#0e2116 0%,#08170f 50%,#040c08 100%);
          border:1px solid rgba(0,230,118,.18);
          box-shadow:0 30px 60px -30px rgba(0,230,118,.35), 0 1px 0 rgba(255,255,255,.05) inset;
        }
        .balance-card::before{
          content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;
          background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
          background-size:28px 28px;
          mask-image:radial-gradient(80% 80% at 80% 10%,#000 0%,transparent 70%);
          -webkit-mask-image:radial-gradient(80% 80% at 80% 10%,#000 0%,transparent 70%);
        }
        .balance-card::after{
          content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,230,118,.5),transparent);
        }
        .balance-card > *{position:relative;z-index:1}
        .chip{
          display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 8px;border-radius:100px;
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);
          font-size:.75rem;font-weight:600;color:rgba(255,255,255,.75);
        }
        .balance-eye{
          width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.04);cursor:pointer;display:grid;place-items:center;
          color:rgba(255,255,255,.7);transition:background .15s,color .15s;
        }
        .balance-eye:hover{background:rgba(255,255,255,.09);color:#fff}
        .balance-amount{color:#fff;font-weight:700;letter-spacing:-.035em;line-height:1;display:flex;align-items:baseline}
        .balance-actions-row{display:flex;gap:.5rem;margin-top:1.25rem}
        .balance-action-btn{
          flex:1;display:flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:14px;
          padding:.85rem .5rem;font-size:.82rem;font-weight:650;cursor:pointer;font-family:inherit;
          background:${GREEN};color:#03140a;white-space:nowrap;
          box-shadow:0 8px 20px -8px rgba(0,230,118,.6), 0 1px 0 rgba(255,255,255,.35) inset;
          transition:transform .15s,filter .15s,box-shadow .15s;
        }
        .balance-action-btn:hover{transform:translateY(-1px);filter:brightness(1.05)}
        .balance-action-btn:active{transform:translateY(0) scale(.98)}
        .balance-action-btn.ghost{
          background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.09);box-shadow:none;
        }
        .balance-action-btn.ghost:hover{background:rgba(255,255,255,.1)}

        /* Action tiles */
        .tile{
          position:relative;text-align:left;cursor:pointer;padding:1.1rem;border-radius:18px;
          background:var(--bg-card);border:1px solid var(--border-color);color:inherit;
          display:flex;flex-direction:column;gap:.9rem;
          transition:border-color .2s,transform .2s,box-shadow .2s;
        }
        .tile:hover{
          border-color:rgba(0,230,118,.3);transform:translateY(-2px);
          box-shadow:0 16px 32px -20px rgba(0,230,118,.35);
        }
        .tile-icon{
          width:40px;height:40px;border-radius:12px;display:grid;place-items:center;color:${GREEN};
          background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.15);
        }
        .tile-arrow{
          position:absolute;top:1.1rem;right:1.1rem;color:var(--text-tertiary);
          transition:transform .2s,color .2s;
        }
        .tile:hover .tile-arrow{transform:translateX(3px);color:${GREEN}}

        /* Checklist */
        .step-row{
          width:100%;display:flex;align-items:center;gap:12px;padding:.75rem .85rem;border-radius:14px;
          background:transparent;border:1px solid transparent;color:inherit;text-align:left;
          transition:background .15s,border-color .15s;min-height:52px;
        }
        .step-row.actionable{cursor:pointer}
        .step-row.actionable:hover{background:var(--bg-input);border-color:var(--border-color)}
        .step-row.actionable:hover .step-chev{transform:translateX(2px);color:var(--text-primary)}
        .step-chev{color:var(--text-tertiary);transition:transform .15s,color .15s;margin-left:auto}
        .step-dot{
          width:22px;height:22px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;
        }

        /* Skeleton */
        .skeleton{
          border-radius:20px;height:180px;
          background:linear-gradient(90deg,var(--bg-card) 0%,var(--bg-input) 50%,var(--bg-card) 100%);
          background-size:800px 100%;animation:shimmer 1.4s linear infinite;border:1px solid var(--border-color);
        }

        /* Rail */
        .rail-row{display:flex;justify-content:space-between;align-items:center;font-size:.84rem;padding:.6rem 0}
        .rail-row + .rail-row{border-top:1px solid var(--border-color)}
        .badge{
          font-size:.66rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
          padding:3px 7px;border-radius:6px;
        }

        @media(max-width:1100px){ .right-rail{display:none!important} }
        @media(max-width:900px){ .feed-main{padding-top:4.5rem!important;padding-bottom:7rem!important} }
        @media(max-width:600px){
          .feed-main{padding:1rem!important;padding-top:4.5rem!important;padding-bottom:7rem!important}
          .balance-amount .whole{font-size:2.3rem!important}
        }
      `}</style>

      <Sidebar />

      <main className="feed-main" style={{ flex: 1, padding: '2.5rem 2rem', maxWidth: 680, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <header className="reveal d1" style={{ marginBottom: '1.75rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.5rem' }}>{today}</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.15, margin: 0 }}>
            {greeting()}, <span style={{ color: 'var(--text-secondary)' }}>{firstName}</span>
          </h1>
        </header>

        {/* Balance */}
        <section className="balance-card reveal d2" style={{ marginBottom: '1rem' }}>
          <DedicatedAccountBanner uid={user.uid} email={user.email || ''} displayName={user.displayName || ''} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="chip"><span style={{ fontSize: '.9rem' }}>🇳🇬</span> NGN Wallet</span>
            <button
              className="balance-eye"
              onClick={() => setBalanceVisible(v => !v)}
              aria label={balanceVisible ? 'Hide balance' : 'Show balance'}
              aria-pressed={!balanceVisible}
            >
              {balanceVisible ? Icon.eye : Icon.eyeOff}
            </button>
          </div>

          <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)', fontWeight: 500, margin: '0 0 .5rem' }}>Available balance</p>
          <div className="balance-amount num" aria-live="polite">
            {balanceVisible ? (
              <>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,.6)', marginRight: 4 }}>₦</span>
                <span className="whole" style={{ fontSize: '2.75rem' }}>{whole}</span>
                <span style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,.45)', fontWeight: 600 }}>.{dec}</span>
              </>
            ) : (
              <span className="whole" style={{ fontSize: '2.75rem', letterSpacing: '.1em' }}>••••••</span>
            )}
          </div>

          <div className="balance-actions-row">
            <AddCashButton uid={user.uid} email={user.email || ''} />
            <WithdrawButton uid={user.uid} balanceKobo={balanceCents} onSuccess={refreshBalance} />
            <button className="balance-action-btn ghost" onClick={() => router.push('/listings')}>
              {Icon.clock} Activity
            </button>
          </div>
        </section>

        {/* Quick actions */}
        <section className="reveal d3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem', marginBottom: '2.25rem' }}>
          <button className="tile" onClick={() => router.push('/listings')}>
            <span className="tile-arrow">{Icon.arrow}</span>
            <span className="tile-icon">{Icon.store}</span>
            <span>
              <span style={{ display: 'block', fontWeight: 650, fontSize: '.92rem', marginBottom: 3 }}>Browse marketplace</span>
              <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.45 }}>Websites, accounts, stores</span>
            </span>
          </button>
          <button className="tile" onClick={() => router.push('/sell')}>
            <span className="tile-arrow">{Icon.arrow}</span>
            <span className="tile-icon">{Icon.plus}</span>
            <span>
              <span style={{ display: 'block', fontWeight: 650, fontSize: '.92rem', marginBottom: 3 }}>List an asset</span>
              <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.45 }}>Free to list, pay on sale</span>
            </span>
          </button>
        </section>

        {/* Setup checklist */}
        <div className="reveal d4">
          {checking && <div className="skeleton" style={{ marginBottom: '2.25rem' }} />}

          {!checking && !allDone && (
            <section className="surface" style={{ padding: '1.25rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 .25rem .9rem' }}>
                <ProgressRing pct={progressPct} />
                <div>
                  <p style={{ fontWeight: 650, fontSize: '.98rem', margin: '0 0 2px', letterSpacing: '-.01em' }}>Finish setting up</p>
                  <p className="num" style={{ fontSize: '.8rem', color: 'var(--text-tertiary)', margin: 0 }}>
                    {completedCount} of {steps.length} complete · {steps.length - completedCount} to go
                  </p>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '0 .25rem .5rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {steps.map(step => {
                  const canAct = !!(step.action && !step.done)
                  return (
                    <button
                      key={step.key}
                      className={`step-row${canAct ? ' actionable' : ''}`}
                      onClick={() => canAct && step.action!()}
                      disabled={!canAct}
                      style={{ cursor: canAct ? 'pointer' : 'default' }}
                    >
                      <span
                        className="step-dot"
                        style={{
                          background: step.done ? GREEN : 'transparent',
                          border: step.done ? 'none' : '1.5px dashed var(--border-color-strong)',
                          boxShadow: step.done ? '0 0 0 4px rgba(0,230,118,.12)' : 'none',
                        }}
                      >
                        {step.done && Icon.check}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{
                          display: 'block', fontSize: '.9rem', fontWeight: 600,
                          color: step.done ? 'var(--text-tertiary)' : 'var(--text-primary)',
                          textDecoration: step.done ? 'line-through' : 'none',
                          textDecorationColor: 'var(--text-tertiary)',
                        }}>
                          {step.label}
                        </span>
                        {!step.done && (
                          <span style={{ display: 'block', fontSize: '.76rem', color: 'var(--text-tertiary)', marginTop: 1 }}>{step.hint}</span>
                        )}
                      </span>
                      {canAct && <span className="step-chev">{Icon.chevron}</span>}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {!checking && allDone && (
            <section className="surface" style={{ padding: '1.1rem 1.25rem', marginBottom: '2.25rem', display: 'flex', alignItems: 'center', gap: '.9rem', borderColor: 'rgba(0,230,118,.2)' }}>
              <span className="step-dot" style={{ width: 36, height: 36, background: GREEN, boxShadow: '0 0 0 6px rgba(0,230,118,.12)' }}>{Icon.check}</span>
              <div>
                <p style={{ fontWeight: 650, fontSize: '.95rem', margin: '0 0 2px' }}>You're all set up</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '.84rem', margin: 0 }}>Start buying or selling digital assets on Merj.</p>
              </div>
            </section>
          )}
        </div>

        {/* Activity */}
        <section className="reveal d5">
          <div className="section-head">
            <p className="eyebrow" style={{ margin: 0 }}>Recent activity</p>
            <button className="link-btn" onClick={() => router.push('/listings')}>View all {Icon.chevron}</button>
          </div>
          <div className="surface" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, margin: '0 auto 1rem', display: 'grid', placeItems: 'center',
              background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-tertiary)',
            }}>
              {Icon.pulse}
            </div>
            <p style={{ fontWeight: 600, fontSize: '.92rem', margin: '0 0 .3rem' }}>No activity yet</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.82rem', margin: '0 auto 1.25rem', maxWidth: 280, lineHeight: 1.5 }}>
              Offers and sales on your listings will show up here.
            </p>
            <button className="link-btn" style={{ color: GREEN }} onClick={() => router.push('/sell')}>
              Create a listing {Icon.arrow}
            </button>
          </div>
        </section>
      </main>

      {/* Right rail */}
      <aside className="right-rail" style={{ width: 300, flexShrink: 0, padding: '2.5rem 1.5rem 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="surface reveal d2" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', fontWeight: 700,
              background: 'linear-gradient(145deg, rgba(0,230,118,.25), rgba(0,230,118,.05))',
              border: '1px solid rgba(0,230,118,.25)', color: GREEN,
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 650, fontSize: '.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
              <p style={{ fontSize: '.76rem', color: 'var(--text-tertiary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
          </div>
          <div className="rail-row">
            <span style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: GREEN, fontWeight: 600, fontSize: '.8rem' }}>
              {Icon.shield} Verified
            </span>
          </div>
          <div className="rail-row">
            <span style={{ color: 'var(--text-secondary)' }}>Active listings</span>
            <span className="num" style={{ fontWeight: 600 }}>0</span>
          </div>
          <div className="rail-row">
            <span style={{ color: 'var(--text-secondary)' }}>Profile</span>
            <span className="num" style={{ fontWeight: 600 }}>{checking ? '—' : `${progressPct}%`}</span>
          </div>
        </div>

        <div className="surface reveal d3" style={{ padding: '1.25rem' }}>
          <p className="eyebrow" style={{ margin: '0 0 .75rem' }}>On the roadmap</p>
          {['Secure checkout & escrow', 'Offers & negotiation'].map(item => (
            <div key={item} className="rail-row">
              <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
              <span className="badge" style={{ background: 'rgba(0,230,118,.1)', color: GREEN }}>Soon</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
