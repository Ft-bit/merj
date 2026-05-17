'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontSize: '1rem'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Dashboard
          </h1>
          <button
            onClick={async () => { await logout(); router.push('/login') }}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Sign out
          </button>
        </div>

        <div style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Signed in as</p>
          <p style={{ color: '#fff', fontWeight: '600', margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
            {user.displayName || 'User'}
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{user.email}</p>
        </div>

        <div style={{
          background: '#111',
          border: '1px solid #1a3a1a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ color: '#4ade80', fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
            🎉 Welcome to Merj!
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            Your Merj account is live. Start buying or selling web assets.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div
            onClick={() => router.push('/listings')}
            style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: '16px',
              padding: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>🛒</p>
            <p style={{ color: '#fff', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Browse Listings</p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Find websites to buy</p>
          </div>
          <div
            onClick={() => router.push('/sell')}
            style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: '16px',
              padding: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>💰</p>
            <p style={{ color: '#fff', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Sell a Website</p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>List your asset</p>
          </div>
        </div>

      </div>
    </div>
  )
}
