'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Premium Marketplace
        </h1>
        <p style={{
          color: '#888888',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Buy and sell WordPress, Blogger, and Vercel websites safely.
        </p>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '0.85rem 2.5rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
