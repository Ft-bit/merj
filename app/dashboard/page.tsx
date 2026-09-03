'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

interface ChecklistState {
  emailVerified: boolean
  hasPhoto: boolean
  hasBio: boolean
  hasListing: boolean
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
      } catch {
        setChecklist(prev => ({ ...prev, emailVerified: !!user.emailVerified }))
      }
      setChecking(false)
    })()
  }, [user])

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

        .checklist-row{
          display:flex;align-items:center;gap:12px;padding:.9rem 0;
          border-bottom:1px solid var(--border-color);min-height:44px;
        }
        .checklist-row:last-child{ border-bottom:none }
        .checklist-row.clickable{ cursor:pointer }
        .checklist-row.clickable:hover .checklist-label{ color:${GREEN} }

        .action-tile{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;
          padding:1.25rem;cursor:pointer;transition:all .2s;text-align:left;min-height:44px;
        }
        .action-tile:hover{border-color:rgba(0,230,118,.25);transform:translateY(-2px)}
        .rail-card{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;
          padding:1.25rem;
        }
        @media(max-width:900px){ .right-rail{display:none!important} .feed-main{padding-top:4.5rem!important} }
        @media(max-width:600px){ .feed-main{padding:1rem!important;padding-top:4.5rem!important;padding-bottom:6rem!important} }
      `}</style>

      <Sidebar />

      <main className="feed-main" style={{ flex: 1, padding: '2rem', maxWidth: '640px', margin: '0 auto', animation: 'fadeUp .4s ease' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem', marginBottom: '.25rem' }}>Welcome back</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-.03em' }}>
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </h1>
        </div>

        {!checking && !allDone && (
          <div className="feed-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <p style={{ fontWeight: '700', fontSize: '.95rem' }}>Get your account set up</p>
              <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)' }}>{completedCount}/{steps.length}</p>
            </div>
            <div style={{ height: '5px', background: 'var(--border-color)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: GREEN, borderRadius: '100px', transition: 'width .4s ease' }} />
            </div>
            {steps.map(step => (
              <div
                key={step.key}
                className={`checklist-row${step.action && !step.done ? ' clickable' : ''}`}
                onClick={() => { if (step.action && !step.done) step.action() }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  border: step.done ? 'none' : '2px solid var(--border-color-strong)',
                  background: step.done ? GREEN : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: step.done ? 'checkPop .3s ease' : 'none',
                }}>
                  {step.done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  )}
                </div>
                <span className="checklist-label" style={{ fontSize: '.9rem', color: step.done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: step.done ? 'line-through' : 'none', transition: 'color .15s' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {!checking && allDone && (
          <div className="feed-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            <div>
              <p style={{ fontWeight: '700', color: GREEN, fontSize: '.95rem', marginBottom: '.2rem' }}>You're all set up</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem' }}>Start buying or selling digital assets on Merj.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.85rem', marginBottom: '2rem' }}>
          <div className="action-tile" onClick={() => router.push('/listings')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.6rem' }}>🛒</div>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>Browse marketplace</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.4 }}>Websites, accounts, stores</p>
          </div>
          <div className="action-tile" onClick={() => router.push('/sell')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.6rem' }}>💰</div>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>List an asset</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem', lineHeight: 1.4 }}>Free to list, pay on sale</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
            Recent activity
          </p>
          <div className="feed-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', marginBottom: '.4rem' }}>No activity yet</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.8rem' }}>Offers and sales on your listings will show up here.</p>
          </div>
        </div>
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
