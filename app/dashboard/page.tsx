'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  )

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
          <button onClick={async () => { await logout(); router.push('/login') }} style={{ padding: '.5rem 1.25rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            Sign out
          </button>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ color: '#888', fontSize: '.8rem', marginBottom: '.5rem' }}>Signed in as</p>
          <p style={{ color: '#fff', fontWeight: '600', fontSize: '1.1rem' }}>{user.displayName || 'User'}</p>
          <p style={{ color: '#888', fontSize: '.9rem' }}>{user.email}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div onClick={() => router.push('/listings')} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🛒</p>
            <p style={{ color: '#fff', fontWeight: '600', marginBottom: '.25rem' }}>Browse Listings</p>
            <p style={{ color: '#888', fontSize: '.85rem' }}>Find websites to buy</p>
          </div>
          <div onClick={() => router.push('/sell')} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>💰</p>
            <p style={{ color: '#fff', fontWeight: '600', marginBottom: '.25rem' }}>Sell a Website</p>
            <p style={{ color: '#888', fontSize: '.85rem' }}>List your asset</p>
          </div>
        </div>
      </div>
    </div>
  )
}
