'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const WordPressIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" fill="white">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.931 12c0-1.15.243-2.243.668-3.236L7.898 19.3A8.454 8.454 0 0 1 3.93 12zm8.069 8.47a8.52 8.52 0 0 1-2.42-.352l2.569-7.471 2.634 7.214a.892.892 0 0 0 .067.13 8.504 8.504 0 0 1-2.85.479zm1.18-12.71c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109-.84 0-2.253-.109-2.253-.109-.463-.027-.517.679-.054.707 0 0 .437.054.898.081l1.334 3.655-1.874 5.62L8.11 7.76c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109a9.128 9.128 0 0 1-.56-.017A8.474 8.474 0 0 1 12 3.53c2.234 0 4.27.854 5.797 2.252a3.46 3.46 0 0 0-.246-.009c-.84 0-1.44.73-1.44 1.514 0 .707.407 1.306.842 2.012.326.571.707 1.305.707 2.362 0 .734-.282 1.586-.65 2.77l-.853 2.852-3.077-9.153zm3.355 11.73-.048-.092 2.605-7.534c.489-1.224.652-2.202.652-3.073 0-.316-.021-.61-.058-.887A8.473 8.473 0 0 1 20.47 12a8.447 8.447 0 0 1-3.934 7.49z"/>
  </svg>
)

const BloggerIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" fill="white">
    <path d="M20.585 9.463C20.147 9.463 20 9.29 20 8.857V7.143C20 4.303 17.674 2 14.808 2H6.239C3.373 2 1 4.303 1 7.143v9.714C1 19.697 3.326 22 6.192 22h11.616C20.674 22 23 19.697 23 16.857v-4.345c0-1.695-1.019-3.049-2.415-3.049zM8.962 7.393h3.693c.52 0 .942.422.942.941v.001a.942.942 0 0 1-.942.942H8.962a.942.942 0 0 1-.942-.942v-.001c0-.519.422-.941.942-.941zm5.885 9.214H8.962a.942.942 0 0 1-.942-.942v-.001c0-.52.422-.942.942-.942h5.885c.52 0 .942.422.942.942v.001a.941.941 0 0 1-.942.942z"/>
  </svg>
)

const VercelIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" fill="white">
    <path d="M24 22.525H0l12-21.05 12 21.05z"/>
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
    <path d="M2 12h20"/>
    <path d="M2 8h20M2 16h20" strokeOpacity="0.5"/>
  </svg>
)

const NetlifyIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" fill="white">
    <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.732v1.727l3.488-3.488zm.303 7.462a1.044 1.044 0 0 1-.303.732L12 21.658V19.03l5.237-5.237zM12 2.342l4.934 4.934a1.044 1.044 0 0 1 .303.732v.199L12 13.145V2.342zM5.768 8.028l3.488 3.488V9.789a1.044 1.044 0 0 1 .303-.732L12 6.124V2.342zm0 7.944V14.25l3.791 3.791H5.768zm3.791 5.686L5.768 17.867v-1.727L9.559 19.93zm0-13.658L6.071 4.512A1.044 1.044 0 0 1 7.116 3.3L9.559 5.743zm2.441 11.617L7.116 14.323a1.044 1.044 0 0 1 0-1.476L12 7.963z"/>
  </svg>
)

const platforms = [
  {
    name: 'WordPress',
    bg: 'linear-gradient(145deg, #1e8ec4 0%, #0073aa 45%, #004d73 100%)',
    glow: 'rgba(0,115,170,0.6)',
    reflection: 'rgba(255,255,255,0.15)',
    delay: '0s',
    rotate: '-6deg',
    icon: <WordPressIcon />,
  },
  {
    name: 'Blogger',
    bg: 'linear-gradient(145deg, #ff9534 0%, #f57d00 45%, #c45e00 100%)',
    glow: 'rgba(245,125,0,0.6)',
    reflection: 'rgba(255,255,255,0.18)',
    delay: '0.15s',
    rotate: '-2deg',
    icon: <BloggerIcon />,
  },
  {
    name: 'Any Website',
    bg: 'linear-gradient(145deg, #5b3fa6 0%, #7c3aed 45%, #4c1d95 100%)',
    glow: 'rgba(124,58,237,0.7)',
    reflection: 'rgba(255,255,255,0.2)',
    delay: '0.3s',
    rotate: '0deg',
    icon: <GlobeIcon />,
    center: true,
  },
  {
    name: 'Vercel',
    bg: 'linear-gradient(145deg, #2a2a2a 0%, #111 45%, #000 100%)',
    glow: 'rgba(255,255,255,0.25)',
    reflection: 'rgba(255,255,255,0.12)',
    delay: '0.45s',
    rotate: '2deg',
    icon: <VercelIcon />,
  },
  {
    name: 'Netlify',
    bg: 'linear-gradient(145deg, #00d4c2 0%, #00c7b7 45%, #009e91 100%)',
    glow: 'rgba(0,199,183,0.6)',
    reflection: 'rgba(255,255,255,0.18)',
    delay: '0.6s',
    rotate: '6deg',
    icon: <NetlifyIcon />,
  },
]

export default function Home() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowX: 'hidden',
      color: '#fff',
    }}>

      <style>{`
        @keyframes float0 {
          0%,100% { transform: rotate(-6deg) translateY(0px) scale(1); }
          50% { transform: rotate(-6deg) translateY(-14px) scale(1.01); }
        }
        @keyframes float1 {
          0%,100% { transform: rotate(-2deg) translateY(0px) scale(1); }
          50% { transform: rotate(-2deg) translateY(-18px) scale(1.01); }
        }
        @keyframes float2 {
          0%,100% { transform: rotate(0deg) translateY(0px) scale(1); }
          50% { transform: rotate(0deg) translateY(-20px) scale(1.02); }
        }
        @keyframes float3 {
          0%,100% { transform: rotate(2deg) translateY(0px) scale(1); }
          50% { transform: rotate(2deg) translateY(-16px) scale(1.01); }
        }
        @keyframes float4 {
          0%,100% { transform: rotate(6deg) translateY(0px) scale(1); }
          50% { transform: rotate(6deg) translateY(-12px) scale(1.01); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes connectorPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes dotTravel {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes iconEntrance {
          from { opacity: 0; transform: translateY(40px) scale(0.85); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          20% { transform: translate(-1%,-2%); }
          40% { transform: translate(2%,1%); }
          60% { transform: translate(-1%,3%); }
          80% { transform: translate(1%,-1%); }
        }
        .icon-card {
          position: relative;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: filter 0.3s ease;
        }
        .icon-card:hover {
          filter: brightness(1.15) saturate(1.1);
        }
        .icon-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 55%;
          border-radius: 22px 22px 0 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%);
          z-index: 2;
          pointer-events: none;
        }
        .icon-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.18);
          z-index: 3;
          pointer-events: none;
        }
        .btn-gold {
          background: #e8c547;
          color: #000;
          border: none;
          padding: 0.9rem 2.25rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-gold:hover {
          background: #f0d060;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232,197,71,0.3);
        }
        .btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.9rem 2.25rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
          transform: translateY(-2px);
        }
        .nav-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          font-size: 0.88rem;
          font-family: inherit;
          padding: 0.4rem 0.75rem;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .nav-btn:hover { color: #fff; }
        .connector-line {
          position: relative;
          height: 1px;
          background: rgba(255,255,255,0.08);
          overflow: visible;
          animation: connectorPulse 2.5s ease-in-out infinite;
        }
        .connector-dot {
          position: absolute;
          top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8c547;
          animation: dotTravel 2s linear infinite;
        }
        .grain-overlay {
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grain 0.4s steps(1) infinite;
          pointer-events: none;
          z-index: 9999;
        }
        .stat-item:hover {
          border-color: rgba(232,197,71,0.2) !important;
        }
      `}</style>

      <div className="grain-overlay" />

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '26px', height: '26px',
            background: '#e8c547',
            borderRadius: '5px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '13px', color: '#000',
          }}>M</div>
          <span style={{ fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Merj</span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button className="nav-btn" onClick={() => router.push('/listings')}>Browse</button>
          <button className="nav-btn" onClick={() => router.push('/sell')}>Sell</button>
          <button className="nav-btn">About</button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="nav-btn" onClick={() => router.push('/login')}>Sign in</button>
          <button className="btn-gold" style={{ padding: '0.5rem 1.25rem', fontSize: '0.83rem' }}
            onClick={() => router.push('/login')}>
            List a site
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7rem 2rem 4rem',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
      }}>

        {/* Radial glow behind icons */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(232,197,71,0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center top, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center top, black 30%, transparent 75%)',
          zIndex: 0,
        }} />

        {/* ─── PLATFORM ICONS ROW ─── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '0',
          marginBottom: '5rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          {platforms.map((p, i) => {
            const isCenter = p.center
            const size = isCenter ? 110 : 88
            const animDelay = p.delay

            return (
              <div key={p.name} style={{ display: 'flex', alignItems: 'flex-end', position: 'relative' }}>

                {/* Connector line between icons */}
                {i > 0 && (
                  <div style={{ position: 'relative', width: '32px', height: '1px', marginBottom: isCenter || platforms[i-1].center ? '60px' : '48px' }}>
                    <div className="connector-line" style={{ width: '100%', animationDelay: `${i * 0.4}s` }}>
                      <div className="connector-dot" style={{ animationDelay: `${i * 0.6}s` }} />
                    </div>
                  </div>
                )}

                {/* Icon container with glow */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  animation: `iconEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${parseFloat(p.delay) + 0.3}s both`,
                }}>
                  {/* Glow beneath */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: `${size * 0.8}px`,
                    height: '20px',
                    background: p.glow,
                    filter: 'blur(16px)',
                    borderRadius: '50%',
                    zIndex: -1,
                    opacity: 0.6,
                  }} />

                  {/* The icon card */}
                  <div
                    className="icon-card"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      background: p.bg,
                      animation: `float${i} ${3.5 + i * 0.3}s ease-in-out ${animDelay} infinite`,
                      boxShadow: `
                        0 24px 60px ${p.glow},
                        0 8px 20px rgba(0,0,0,0.5),
                        inset 0 1px 0 rgba(255,255,255,0.2)
                      `,
                    }}
                  >
                    {/* Inner icon */}
                    <div style={{
                      position: 'relative',
                      zIndex: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                    }}>
                      {p.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <span style={{
                    fontSize: isCenter ? '0.75rem' : '0.7rem',
                    color: isCenter ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)',
                    fontWeight: '500',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── HEADLINE ─── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '780px',
          animation: visible ? 'slideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both' : 'none',
        }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: '600',
            letterSpacing: '0.22em',
            color: '#e8c547',
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}>
            <div style={{ width: '24px', height: '1px', background: '#e8c547' }} />
            Website Acquisition, Automated
            <div style={{ width: '24px', height: '1px', background: '#e8c547' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: '900',
            letterSpacing: '-0.035em',
            lineHeight: 0.95,
            margin: '0 0 1.75rem',
          }}>
            The place{' '}
            <span style={{
              background: 'linear-gradient(135deg, #e8c547 0%, #f0d060 40%, #c8a030 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              websites
            </span>
            <br />change hands.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}>
            Buy or sell any live website — WordPress, Blogger, Vercel, Netlify,
            custom domains, locally hosted apps. Ownership transfers automatically.
            Payment moves only when your site does.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => router.push('/listings')}>
              Browse websites
            </button>
            <button className="btn-ghost" onClick={() => router.push('/login')}>
              Start selling
            </button>
          </div>
        </div>

        {/* Down arrow */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255,255,255,0.15)',
          zIndex: 2,
        }}>
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="rgba(255,255,255,0.15)">
            <path d="M6 8L1 3h10L6 8z"/>
          </svg>
        </div>
      </section>

      {/* ─── CONNECTORS STRIP ─── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 3rem',
        background: 'rgba(255,255,255,0.01)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: '1rem' }}>
          Sell on
        </span>
        {['WordPress', 'Blogger', 'Vercel', 'Netlify', 'GitHub Pages', 'Shopify', 'Wix', 'Squarespace', 'Custom Domain', 'Any live URL'].map((name, i) => (
          <span key={name} style={{
            padding: '5px 14px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </span>
        ))}
        <span style={{
          padding: '5px 14px',
          border: '1px dashed rgba(232,197,71,0.3)',
          borderRadius: '100px',
          fontSize: '0.78rem',
          color: 'rgba(232,197,71,0.5)',
          fontWeight: '500',
        }}>
          + more soon
        </span>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '7rem 3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.25)' }} />
            The process
            <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.25)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', letterSpacing: '-0.03em', margin: '0' }}>
            Simple. Secure. Automatic.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            { n: '01', title: 'List your site', body: 'Connect via any of our platform integrations. We verify real ownership through each platform\'s API — no manual screenshots or trust needed.', icon: '🔗' },
            { n: '02', title: 'Buyer pays. Money locks.', body: "The buyer's payment is secured the moment they check out. It's held — neither party can access it until the transfer is verified complete.", icon: '🔒' },
            { n: '03', title: 'Transfer. Then payment.', body: 'Admin access, credentials, and project files transfer automatically through code. Only after confirmation does your money release.', icon: '⚡' },
          ].map((step) => (
            <div key={step.n} style={{
              background: '#0a0a0a',
              padding: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '1rem', right: '1.5rem',
                fontSize: '4.5rem', fontWeight: '900',
                color: 'rgba(255,255,255,0.025)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                userSelect: 'none',
              }}>{step.n}</div>
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{step.icon}</div>
              <div style={{ width: '24px', height: '2px', background: '#e8c547', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{
        background: 'rgba(232,197,71,0.03)',
        borderTop: '1px solid rgba(232,197,71,0.08)',
        borderBottom: '1px solid rgba(232,197,71,0.08)',
        padding: '4rem 3rem',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {[
            { value: 'Any platform', label: 'If it has a live URL' },
            { value: '100% Auto', label: 'No manual handoffs' },
            { value: 'Transfer first', label: 'Pay only on success' },
            { value: 'Free to list', label: 'Commission on sale only' },
          ].map((s) => (
            <div key={s.label} className="stat-item" style={{
              background: '#050505',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: '1px solid transparent',
              transition: 'border-color 0.2s ease',
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#e8c547', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: '9rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(232,197,71,0.05) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            letterSpacing: '-0.035em',
            margin: '0 0 1.25rem',
            lineHeight: 1,
          }}>
            Your site has value.<br />
            <span style={{ color: '#e8c547' }}>Let&apos;s move it.</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '1rem',
            marginBottom: '2.5rem',
            maxWidth: '400px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Free to list. No fees until your site sells. Fully automated.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => router.push('/login')}>
              List your site — free
            </button>
            <button className="btn-ghost" onClick={() => router.push('/listings')}>
              Browse listings
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px', height: '20px', background: '#e8c547',
            borderRadius: '4px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: '#000',
          }}>M</div>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Merj</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem', margin: 0 }}>
          © 2025 Merj · Website acquisition, done right.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Browse', 'Sell', 'Sign in'].map(l => (
            <button key={l}
              onClick={() => router.push(l === 'Browse' ? '/listings' : '/login')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.78rem', padding: 0, fontFamily: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              {l}
            </button>
          ))}
        </div>
      </footer>
    </div>
  )
}
