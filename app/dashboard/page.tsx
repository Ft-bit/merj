'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const GREEN = '#00e676'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // FIX: previously only checked `!user`, which let an unverified email/password
  // user reach the dashboard directly by typing the URL, even though the login
  // page itself blocked them with the "check your email" screen.
  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontFamily: 'sans-serif', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user || !user.emailVerified) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '2rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#fff' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .card{background:#0d0d0d;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.5rem;transition:border-color .2s}
        .card:hover{border-color:rgba(0,230,118,.15)}
        .action-card{background:#0d0d0d;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.5rem;cursor:pointer;transition:all .2s;text-align:left}
        .action-card:hover{border-color:rgba(0,230,118,.25);transform:translateY(-2px);background:#111}
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto', animation: 'fadeUp .5s ease' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: GREEN, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', color: '#000' }}>M</div>
            <span style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-.02em' }}>Merj</span>
          </div>
          <button
            onClick={async () => { await logout(); router.push('/login') }}
            style={{ padding: '.5rem 1.25rem', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: '.85rem', fontFamily: 'inherit', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.08)' }}
          >
            Sign out
          </button>
        </div>

        {/* Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', marginBottom: '.25rem' }}>Welcome back</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-.03em' }}>
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </h1>
        </div>

        {/* User card */}
        <div className="card" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" width={48} height={48} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `rgba(0,230,118,.15)`, border: `1px solid rgba(0,230,118,.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700', color: GREEN }}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontWeight: '600', fontSize: '1rem', color: '#fff', marginBottom: '.15rem' }}>{user.displayName || 'User'}</p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', padding: '.3rem .85rem', background: 'rgba(0,230,118,.1)', border: '1px solid rgba(0,230,118,.2)', borderRadius: '100px', fontSize: '.75rem', fontWeight: '600', color: GREEN }}>
            Active
          </div>
        </div>

        {/* Success banner */}
        <div style={{ background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.15)', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎉</span>
          <div>
            <p style={{ fontWeight: '600', color: GREEN, fontSize: '.95rem', marginBottom: '.2rem' }}>You are in!</p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>Your Merj account is live. Start buying or selling digital assets.</p>
          </div>
        </div>

        {/* Action cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="action-card" onClick={() => router.push('/listings')}>
            <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>🛒</div>
            <p style={{ fontWeight: '700', marginBottom: '.3rem', fontSize: '.95rem' }}>Browse marketplace</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.83rem', lineHeight: 1.5 }}>Websites, accounts, stores and more</p>
          </div>

          <div className="action-card" onClick={() => router.push('/sell')}>
            <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>💰</div>
            <p style={{ fontWeight: '700', marginBottom: '.3rem', fontSize: '.95rem' }}>List an asset</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.83rem', lineHeight: 1.5 }}>Free to list, pay only when you sell</p>
          </div>

          <div className="action-card">
            <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>📊</div>
            <p style={{ fontWeight: '700', marginBottom: '.3rem', fontSize: '.95rem' }}>My listings</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.83rem', lineHeight: 1.5 }}>Manage your active listings</p>
          </div>

          <div className="action-card">
            <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>💳</div>
            <p style={{ fontWeight: '700', marginBottom: '.3rem', fontSize: '.95rem' }}>Purchases</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.83rem', lineHeight: 1.5 }}>View your transaction history</p>
          </div>
        </div>

      </div>
    </div>
  )
}
