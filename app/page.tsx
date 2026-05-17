'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Animated counters
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCount1(Math.floor((step / steps) * 1240))
      setCount2(Math.floor((step / steps) * 98))
      setCount3(Math.floor((step / steps) * 4800000))
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [])

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }))

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020408',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up-delay1 {
          0%, 20% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up-delay2 {
          0%, 40% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up-delay3 {
          0%, 55% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes border-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .hero-badge {
          animation: slide-up 0.8s ease forwards;
        }
        .hero-title {
          animation: slide-up-delay1 1s ease forwards;
        }
        .hero-sub {
          animation: slide-up-delay2 1.2s ease forwards;
        }
        .hero-btns {
          animation: slide-up-delay3 1.4s ease forwards;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4) !important;
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          background: #1a1a2e !important;
        }
        .stat-card:hover {
          border-color: #2563eb !important;
          transform: translateY(-4px);
        }
        .feature-card:hover {
          border-color: #2563eb !important;
          transform: translateY(-6px);
        }
        .platform-chip:hover {
          background: #1e3a8a !important;
          border-color: #3b82f6 !important;
        }
        * { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
      `}</style>

      {/* Animated gradient orbs */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
        top: mouseY - 300,
        left: mouseX - 300,
        pointerEvents: 'none',
        transition: 'top 0.3s ease, left 0.3s ease',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        animation: 'glow-pulse 4s ease infinite',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        animation: 'glow-pulse 6s ease infinite reverse',
        zIndex: 0
      }} />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: '50%',
          background: p.id % 3 === 0 ? '#2563eb' : p.id % 3 === 1 ? '#7c3aed' : '#10b981',
          animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>M</div>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
            Merj<span style={{ color: '#2563eb' }}>.</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => router.push('/listings')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #222',
              borderRadius: '8px',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Browse
          </button>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              background: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5rem 1.5rem 3rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>

        {/* Badge */}
        <div className="hero-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(37,99,235,0.1)',
          border: '1px solid rgba(37,99,235,0.3)',
          borderRadius: '100px',
          color: '#60a5fa',
          fontSize: '0.85rem',
          fontWeight: '500',
          marginBottom: '2rem'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#60a5fa',
            display: 'inline-block',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              border: '1px solid #60a5fa',
              animation: 'pulse-ring 1.5s ease-out infinite'
            }} />
          </span>
          Escrow-Protected Marketplace — Fully Automated
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Buy & Sell Websites{' '}
          <span style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Without Risk
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub" style={{
          fontSize: '1.2rem',
          color: '#6b7280',
          maxWidth: '600px',
          lineHeight: 1.7,
          marginBottom: '2.5rem'
        }}>
          WordPress sites, Blogger blogs, and Vercel projects — bought and sold
          with <strong style={{ color: '#9ca3af' }}>automated ownership transfer</strong> and{' '}
          <strong style={{ color: '#9ca3af' }}>Stripe escrow protection</strong>.
          Zero trust required.
        </p>

        {/* Buttons */}
        <div className="hero-btns" style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
            style={{
              padding: '0.9rem 2.5rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Start Selling →</span>
          </button>
          <button
            onClick={() => router.push('/listings')}
            className="btn-secondary"
            style={{
              padding: '0.9rem 2.5rem',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Browse Listings
          </button>
        </div>

        {/* Trust line */}
        <p style={{ color: '#4b5563', fontSize: '0.85rem' }}>
          🔒 Funds held in escrow until transfer confirmed &nbsp;·&nbsp; No trust required
        </p>
      </div>

      {/* Platform chips */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        padding: '0 1.5rem 4rem'
      }}>
        {[
          { icon: '🔵', label: 'WordPress Sites' },
          { icon: '🟠', label: 'Blogger Blogs' },
          { icon: '⬛', label: 'Vercel Projects' },
          { icon: '💳', label: 'Stripe Escrow' },
          { icon: '🔐', label: 'Auto Transfer' },
        ].map((chip) => (
          <div
            key={chip.label}
            className="platform-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '100px',
              color: '#9ca3af',
              fontSize: '0.85rem',
              cursor: 'default'
            }}
          >
            {chip.icon} {chip.label}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem'
      }}>
        {[
          { value: `${count1.toLocaleString()}+`, label: 'Sites Sold', icon: '🌐' },
          { value: `${count2}%`, label: 'Success Rate', icon: '✅' },
          { value: `$${(count3 / 1000000).toFixed(1)}M+`, label: 'Total Volume', icon: '💰' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '0.25rem',
              background: 'linear-gradient(135deg, #fff, #9ca3af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {stat.value}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: '900px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '0.75rem'
        }}>
          How it works
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '3rem',
          fontSize: '1rem'
        }}>
          Three steps. Fully automated. No manual handoffs.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {[
            {
              step: '01',
              icon: '🔍',
              title: 'Seller Lists & Verifies',
              desc: 'Seller connects their WordPress, Blogger, or Vercel asset. We verify real ownership via each platform\'s API.',
              color: '#2563eb'
            },
            {
              step: '02',
              icon: '💳',
              title: 'Buyer Pays Into Escrow',
              desc: 'Buyer checks out via Stripe. Funds are captured but not released. The money is held safely in escrow.',
              color: '#7c3aed'
            },
            {
              step: '03',
              icon: '🚀',
              title: 'Auto Transfer & Release',
              desc: 'Our system automatically transfers ownership. Only on success are seller funds released. Buyer is protected.',
              color: '#10b981'
            },
          ].map((item) => (
            <div
              key={item.step}
              className="feature-card"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '5rem',
                fontWeight: '900',
                color: `${item.color}08`,
                lineHeight: 1,
                userSelect: 'none'
              }}>
                {item.step}
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                {item.icon}
              </div>
              <h3 style={{
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: '700px',
        margin: '0 auto 4rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))',
          border: '1px solid rgba(37,99,235,0.25)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Ready to get started?
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '1rem' }}>
            Create a free account and start buying or selling in minutes.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
            style={{
              padding: '0.9rem 3rem',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(37,99,235,0.3)'
            }}
          >
            Create Free Account →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 5,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem',
        textAlign: 'center',
        color: '#374151',
        fontSize: '0.85rem'
      }}>
        © 2025 Merj Marketplace · Secured by Stripe Escrow
      </footer>

    </div>
  )
}
