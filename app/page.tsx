'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const connectors = [
  {
    name: 'WordPress',
    color: '#21759b',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#21759b">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1.542c2.347 0 4.49.875 6.123 2.307L4.849 18.123A8.458 8.458 0 0 1 3.542 12c0-4.669 3.789-8.458 8.458-8.458zm0 16.916a8.413 8.413 0 0 1-4.664-1.413l6.201-18.01A8.432 8.432 0 0 1 20.458 12c0 4.669-3.789 8.458-8.458 8.458z"/>
      </svg>
    )
  },
  {
    name: 'Blogger',
    color: '#f57d00',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#f57d00">
        <path d="M18.5 0h-13C2.467 0 0 2.467 0 5.5v13C0 21.533 2.467 24 5.5 24h13c3.033 0 5.5-2.467 5.5-5.5v-13C24 2.467 21.533 0 18.5 0zm-2.757 17.8H8.257C7.556 17.8 7 17.243 7 16.543V14.8c0-.7.556-1.257 1.257-1.257h7.486c.7 0 1.257.557 1.257 1.257v1.743c0 .7-.557 1.257-1.257 1.257zm0-6.371H12.77c-.399-.973-1.354-1.657-2.47-1.657H8.257C7.556 9.772 7 9.215 7 8.515V6.771c0-.7.556-1.257 1.257-1.257h3.043c2.382 0 4.386 1.703 4.9 3.957h.543c.7 0 1.257.557 1.257 1.257v.444c0 .7-.557 1.257-1.257 1.257z"/>
      </svg>
    )
  },
  {
    name: 'Vercel',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    )
  },
  {
    name: 'GitHub Pages',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    name: 'Netlify',
    color: '#00c7b7',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#00c7b7">
        <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.732v1.727l3.488-3.488zm.303 7.462a1.044 1.044 0 0 1-.303.732L12 21.658V19.03l5.237-5.237zM12 2.342l4.934 4.934a1.044 1.044 0 0 1 .303.732v.199L12 13.145V2.342zM5.768 8.028l3.488 3.488V9.789a1.044 1.044 0 0 1 .303-.732L12 6.124V2.342zm0 7.944V14.25l3.791 3.791H5.768zm3.791 5.686L5.768 17.867v-1.727L9.559 19.93zm0-13.658L6.071 4.512A1.044 1.044 0 0 1 7.116 3.3L9.559 5.743zm2.441 11.617L7.116 14.323a1.044 1.044 0 0 1 0-1.476L12 7.963z"/>
      </svg>
    )
  },
  {
    name: 'Shopify',
    color: '#96bf48',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#96bf48">
        <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73a.336.336 0 0 0-.33-.285c-.14 0-2.682-.189-2.682-.189s-1.773-1.754-1.978-1.961v21.726h.399zM11.733 2.35S10.16.802 8.01.802C5.614.802 4.395 2.68 4.037 4.558c-.981.305-1.674.518-1.674.518S.001 5.803 0 6.046L1.427 23.98l13.91-2.547V2.254c-.584.093-.974.281-1.227.367-.109-.148-.226-.271-.377-.271zm1.227 13.43L8.4 17.162l-.512-4.09 4.561-1.082.511 3.79zm-3.24-8.64c.435-.13.915-.268 1.432-.414l.383 2.99-1.815.431z"/>
      </svg>
    )
  },
  {
    name: 'Wix',
    color: '#faad00',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#faad00">
        <path d="M9.567 7.348c-.47.235-.78.58-.968 1.048-.043.11-.09.243-.14.396L7.2 13.013l-1.277-4.12C5.66 7.73 5.158 7.125 4.2 7.063c-.63-.04-1.15.213-1.463.715-.24.384-.276.804-.255 1.08l1.93 8.065c.28 1.17 1.025 1.73 1.793 1.73.777 0 1.42-.555 1.697-1.47l1.37-4.464 1.37 4.466c.278.913.92 1.467 1.697 1.467.77 0 1.514-.558 1.795-1.728l1.93-8.065c.02-.278-.015-.697-.255-1.08-.313-.503-.832-.757-1.462-.716-.96.062-1.46.666-1.723 1.83L11.14 13.01l-1.258-4.22c-.05-.151-.097-.284-.14-.394-.188-.468-.498-.813-.968-1.048h.793z"/>
        <path d="M20.457 7.063c-.754.016-1.282.47-1.627 1.395l-1.903 5.32-1.038-3.445c-.18-.598-.548-.935-1.008-.98-.01-.001-.022-.002-.033-.002-.46 0-.85.313-1.04.835l-1.03 3.592-1.906-5.322c-.344-.924-.873-1.378-1.627-1.393h-.014c-.766 0-1.395.563-1.395 1.256 0 .14.024.284.073.428l2.49 7.1c.333.95 1.017 1.52 1.83 1.52.817 0 1.504-.578 1.83-1.548l.798-2.456.797 2.456c.326.97 1.013 1.547 1.83 1.547.813 0 1.497-.57 1.83-1.52l2.49-7.1c.05-.144.073-.288.073-.428 0-.693-.63-1.256-1.395-1.256h-.015z"/>
      </svg>
    )
  },
  {
    name: 'Squarespace',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
        <path d="M17.108 4.96a4.755 4.755 0 0 0-6.715 0l-1.21 1.195 1.88 1.88 1.21-1.195a2.394 2.394 0 0 1 3.384 0 2.394 2.394 0 0 1 0 3.384L9.96 15.92a2.394 2.394 0 0 1-3.384 0 2.394 2.394 0 0 1 0-3.384l1.194-1.195-1.88-1.88-1.194 1.195a4.755 4.755 0 0 0 0 6.716 4.755 4.755 0 0 0 6.716 0l5.697-5.697a4.755 4.755 0 0 0 0-6.716z"/>
        <path d="M19.11 4.89a4.755 4.755 0 0 0-6.716 0L6.698 10.587a4.755 4.755 0 0 0 0 6.716 4.755 4.755 0 0 0 6.716 0l1.194-1.195-1.88-1.88-1.194 1.195a2.394 2.394 0 0 1-3.384 0 2.394 2.394 0 0 1 0-3.384l5.697-5.697a2.394 2.394 0 0 1 3.384 0 2.394 2.394 0 0 1 0 3.384l-1.21 1.195 1.88 1.88 1.21-1.195a4.755 4.755 0 0 0 0-6.716z"/>
      </svg>
    )
  },
  {
    name: 'Custom Domain',
    color: '#a78bfa',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#a78bfa" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
        <path d="M2 12h20"/>
      </svg>
    )
  },
  {
    name: 'Live Local',
    color: '#34d399',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#34d399" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 8l2 2-2 2M13 10h2"/>
      </svg>
    )
  },
]

const steps = [
  {
    number: '01',
    title: 'List your asset',
    body: 'Connect your site through any of our platform integrations. We verify real ownership automatically — no screenshots, no trust required.',
  },
  {
    number: '02',
    title: 'Buyer pays. Money locks.',
    body: "The buyer's payment is secured the moment they check out. Neither side can touch it until the transfer is done.",
  },
  {
    number: '03',
    title: 'Transfer happens. Money moves.',
    body: 'Our system executes the handover directly through each platform\'s API. Admin access, project files, credentials — all transferred automatically. Then, and only then, you get paid.',
  },
]

export default function Home() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    let ctx: any
    const load = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {

        // Hero title word split animation
        gsap.from('.hero-word', {
          y: 120,
          opacity: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.2,
        })

        gsap.from('.hero-sub', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.9,
        })

        gsap.from('.hero-cta', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1.2,
        })

        // Connector cards stagger on scroll
        gsap.from('.connector-card', {
          scrollTrigger: {
            trigger: '.connectors-section',
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power3.out',
        })

        // Steps animate in
        gsap.from('.step-item', {
          scrollTrigger: {
            trigger: '.steps-section',
            start: 'top 75%',
          },
          x: -60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.9,
          ease: 'power3.out',
        })

        // Ticker marquee
        const ticker = document.querySelector('.ticker-track') as HTMLElement
        if (ticker) {
          gsap.to(ticker, {
            x: '-50%',
            duration: 25,
            ease: 'none',
            repeat: -1,
          })
        }

        // CTA section
        gsap.from('.cta-content', {
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        })

      }, containerRef)
    }
    load()
    return () => ctx && ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{
      background: '#000',
      color: '#fff',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowX: 'hidden',
    }}>

      <style>{`
        ::selection { background: #e8c547; color: #000; }
        html { scroll-behavior: smooth; }

        @keyframes grain {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-2%,-3%); }
          30% { transform: translate(3%,1%); }
          50% { transform: translate(-1%,4%); }
          70% { transform: translate(2%,-2%); }
          90% { transform: translate(-3%,2%); }
        }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .btn-gold {
          background: #e8c547;
          color: #000;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .btn-gold:hover {
          background: #f0d060;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232,197,71,0.25);
        }

        .btn-ghost {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 1rem 2.5rem;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-2px);
        }

        .connector-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: default;
          transition: all 0.25s ease;
        }
        .connector-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
        }

        .step-number {
          font-size: 5rem;
          font-weight: 900;
          color: rgba(255,255,255,0.04);
          line-height: 1;
          position: absolute;
          top: -1rem;
          left: -0.5rem;
          letter-spacing: -0.04em;
          user-select: none;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          padding: 0.5rem;
          transition: color 0.2s;
          font-family: inherit;
        }
        .nav-link:hover { color: #fff; }

        .grain-overlay {
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          animation: grain 0.5s steps(1) infinite;
          pointer-events: none;
          z-index: 999;
        }
      `}</style>

      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: '#e8c547',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '14px',
            color: '#000',
            letterSpacing: '-0.04em'
          }}>M</div>
          <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Merj
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button className="nav-link" onClick={() => router.push('/listings')}>
            Browse
          </button>
          <button className="nav-link" onClick={() => router.push('/sell')}>
            Sell
          </button>
          <button className="nav-link" onClick={() => router.push('/login')}
            style={{ marginLeft: '1rem', color: '#fff' }}>
            Sign in
          </button>
          <button
            onClick={() => router.push('/login')}
            className="btn-gold"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', marginLeft: '0.5rem' }}
          >
            List a site
          </button>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO ─── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '8rem 3rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background video feel — abstract website grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(232,197,71,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,197,71,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          zIndex: 0,
        }} />

        {/* Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, #000 100%)',
          zIndex: 1,
        }} />

        {/* Floating browser windows */}
        {[
          { top: '15%', right: '5%', w: 280, opacity: 0.06, rotate: 8 },
          { top: '50%', right: '-2%', w: 220, opacity: 0.04, rotate: -5 },
          { top: '25%', left: '-3%', w: 200, opacity: 0.05, rotate: -10 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: pos.top,
            right: (pos as any).right,
            left: (pos as any).left,
            width: pos.w,
            opacity: pos.opacity,
            transform: `rotate(${pos.rotate}deg)`,
            zIndex: 1,
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <div style={{ height: '24px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px' }}>
              {[0,1,2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />)}
            </div>
            <div style={{ height: pos.w * 0.6, background: 'rgba(255,255,255,0.03)' }}>
              {[0,1,2,3,4].map(d => (
                <div key={d} style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', margin: '10px 10px 0', width: `${60 + d * 8}%` }} />
              ))}
            </div>
          </div>
        ))}

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: '#e8c547',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{ width: '30px', height: '1px', background: '#e8c547' }} />
            Website Acquisition Marketplace
          </div>

          <div style={{ overflow: 'hidden', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              {'The place'.split(' ').map((w, i) => (
                <span key={i} className="hero-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{w}</span>
              ))}
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 0.95, color: '#e8c547' }}>
              {'websites change'.split(' ').map((w, i) => (
                <span key={i} className="hero-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{w}</span>
              ))}
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              {'hands.'.split(' ').map((w, i) => (
                <span key={i} className="hero-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{w}</span>
              ))}
            </h1>
          </div>

          <p className="hero-sub" style={{
            fontSize: '1.15rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '520px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Merj connects buyers and sellers of web assets across every major platform.
            Every transaction is verified, secured, and executed automatically.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => router.push('/listings')}>
              Browse assets
            </button>
            <button className="btn-ghost" onClick={() => router.push('/login')}>
              Start selling
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          zIndex: 2,
        }}>
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.15)' }} />
          Scroll
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '1rem 0',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div className="ticker-track" style={{ display: 'flex', width: 'max-content', gap: '3rem', alignItems: 'center' }}>
          {[...Array(2)].map((_, rep) => (
            connectors.concat([
              { name: 'More coming', color: '#e8c547', icon: <span style={{ fontSize: '18px' }}>+</span> }
            ] as any).map((c, i) => (
              <div key={`${rep}-${i}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.85rem',
                fontWeight: '500',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ opacity: 0.7 }}>{c.icon}</span>
                {c.name}
                <span style={{ color: 'rgba(255,255,255,0.1)', marginLeft: '1rem' }}>—</span>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ─── SECTION 2: CONNECTORS ─── */}
      <section className="connectors-section" style={{
        padding: '7rem 3rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            Supported platforms
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            margin: '0 0 1rem',
            lineHeight: 1.1,
          }}>
            Sell on any platform.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>We handle the rest.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
            From global platforms to your own custom-hosted site — if it has a live URL, you can sell it on Merj. More connectors added every month.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '1rem',
        }}>
          {connectors.map((c) => (
            <div key={c.name} className="connector-card">
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '10px',
                background: `${c.color}12`,
                border: `1px solid ${c.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {c.icon}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontWeight: '500', textAlign: 'center' }}>
                {c.name}
              </span>
            </div>
          ))}
          <div className="connector-card" style={{ borderStyle: 'dashed', opacity: 0.4 }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '10px',
              border: '1px dashed rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'rgba(255,255,255,0.3)',
            }}>+</div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              Your platform
            </span>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 3rem' }} />

      {/* ─── SECTION 3: HOW IT WORKS ─── */}
      <section className="steps-section" style={{
        padding: '7rem 3rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: '5rem' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            The process
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Simple for both sides.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Airtight for everyone.</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {steps.map((step, i) => (
            <div key={step.number} className="step-item" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
              padding: '4rem 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  letterSpacing: '0.2em',
                  color: '#e8c547',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}>
                  Step {step.number}
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  margin: '0 0 1rem',
                }}>
                  {step.title}
                </h3>
              </div>
              <div>
                <p style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  {step.body}
                </p>
              </div>
              <div className="step-number">{step.number}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: TRUST STRIP ─── */}
      <section style={{
        background: 'rgba(232,197,71,0.04)',
        borderTop: '1px solid rgba(232,197,71,0.1)',
        borderBottom: '1px solid rgba(232,197,71,0.1)',
        padding: '4rem 3rem',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}>
          {[
            { title: 'Ownership verified', body: 'We check real ownership through each platform\'s API before any listing goes live.' },
            { title: 'Payment secured first', body: 'Buyer\'s money is locked the moment checkout is complete. Sellers cannot access it until transfer is done.' },
            { title: 'Transfer or refund', body: 'If the transfer doesn\'t complete, the buyer gets every cent back. Automatically.' },
            { title: 'No middlemen', body: 'The entire handover — admin access, credentials, project files — is handled by code, not people.' },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ width: '20px', height: '2px', background: '#e8c547', marginBottom: '1.25rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
                {item.title}
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 5: CTA ─── */}
      <section className="cta-section" style={{
        padding: '10rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(232,197,71,0.06) 0%, transparent 65%)',
          zIndex: 0,
        }} />
        <div className="cta-content" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            margin: '0 0 1.5rem',
            lineHeight: 1,
          }}>
            Your site has value.<br />
            <span style={{ color: '#e8c547' }}>Let's move it.</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.1rem',
            marginBottom: '3rem',
            maxWidth: '450px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
          }}>
            List for free. Get paid when your site sells. No fees until the deal is done.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => router.push('/login')}>
              List your site — it's free
            </button>
            <button className="btn-ghost" onClick={() => router.push('/listings')}>
              Browse listings
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            background: '#e8c547',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '11px',
            color: '#000',
          }}>M</div>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Merj</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>
          © 2025 Merj · Website acquisition, done right.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Browse', 'Sell', 'Sign in'].map(l => (
            <button key={l} onClick={() => router.push(l === 'Browse' ? '/listings' : '/login')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.8rem', padding: 0, fontFamily: 'inherit' }}>
              {l}
            </button>
          ))}
        </div>
      </footer>

    </div>
  )
}
