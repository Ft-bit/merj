'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user || !user.emailVerified) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .feed-card{
          background:#0a0a0a;border:1px solid rgba(255,255,255,.07);border-radius:16px;
          padding:1.5rem;transition:border-color .2s;
        }
        .feed-card:hover{border-color:rgba(0,230,118,.15)}
        .action-tile{
          background:#0a0a0a;border:1px solid rgba(255,255,255,.07);border-radius:14px;
          padding:1.25rem;cursor:pointer;transition:all .2s;text-align:left;
        }
        .action-tile:hover{border-color:rgba(0,230,118,.25);transform:translateY(-2px);background:#0e0e0e}
        .rail-card{
          background:#0a0a0a;border:1px solid rgba(255,255,255,.07);border-radius:14px;
          padding:1.25rem;
        }
        @media(max-width:900px){ .right-rail{display:none!important} }
        @media(max-width:600px){ .feed-main{padding:1rem!important} }
      `}</style>

      <Sidebar />

      <main className="feed-main" style={{ flex: 1, padding: '2rem', maxWidth: '640px', margin: '0 auto', animation: 'fadeUp .4s ease' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', marginBottom: '.25rem' }}>Welcome back</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-.03em' }}>
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </h1>
        </div>

        <div className="feed-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          </span>
          <div>
            <p style={{ fontWeight: '700', color: GREEN, fontSize: '.95rem', marginBottom: '.2rem' }}>Your account is live</p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>Start buying or selling digital assets on Merj.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.85rem', marginBottom: '2rem' }}>
          <div className="action-tile" onClick={() => router.push('/listings')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.6rem' }}>🛒</div>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>Browse marketplace</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem', lineHeight: 1.4 }}>Websites, accounts, stores</p>
          </div>
          <div className="action-tile" onClick={() => router.push('/sell')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.6rem' }}>💰</div>
            <p style={{ fontWeight: '700', fontSize: '.9rem', marginBottom: '.2rem' }}>List an asset</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem', lineHeight: 1.4 }}>Free to list, pay on sale</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', marginBottom: '1rem' }}>
            Recent activity
          </p>
          <div className="feed-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.9rem', marginBottom: '.4rem' }}>No activity yet</p>
            <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '.8rem' }}>Listings and offers will show up here once the marketplace launches.</p>
          </div>
        </div>
      </main>

      <aside className="right-rail" style={{ width: '300px', flexShrink: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="rail-card">
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '1rem' }}>
            Account
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.6rem' }}>
            <span style={{ color: 'rgba(255,255,255,.5)' }}>Status</span>
            <span style={{ color: GREEN, fontWeight: '600' }}>Verified</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
            <span style={{ color: 'rgba(255,255,255,.5)' }}>Active listings</span>
            <span style={{ fontWeight: '600' }}>0</span>
          </div>
        </div>

        <div className="rail-card">
          <p style={{ fontSize: '.78rem', fontWeight: '700', letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '1rem' }}>
            Coming soon
          </p>
          {['Marketplace listings', 'Direct messaging', 'Notifications'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '.4rem 0', fontSize: '.85rem', color: 'rgba(255,255,255,.5)' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(0,230,118,.5)' }} />
              {item}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
