'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const WPIcon = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.931 12c0-1.15.243-2.243.668-3.236L7.898 19.3A8.454 8.454 0 0 1 3.93 12zm8.069 8.47a8.52 8.52 0 0 1-2.42-.352l2.569-7.471 2.634 7.214a.892.892 0 0 0 .067.13 8.504 8.504 0 0 1-2.85.479zm1.18-12.71c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109-.84 0-2.253-.109-2.253-.109-.463-.027-.517.679-.054.707 0 0 .437.054.898.081l1.334 3.655-1.874 5.62L8.11 7.76c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109a9.128 9.128 0 0 1-.56-.017A8.474 8.474 0 0 1 12 3.53c2.234 0 4.27.854 5.797 2.252a3.46 3.46 0 0 0-.246-.009c-.84 0-1.44.73-1.44 1.514 0 .707.407 1.306.842 2.012.326.571.707 1.305.707 2.362 0 .734-.282 1.586-.65 2.77l-.853 2.852-3.077-9.153zm3.355 11.73-.048-.092 2.605-7.534c.489-1.224.652-2.202.652-3.073 0-.316-.021-.61-.058-.887A8.473 8.473 0 0 1 20.47 12a8.447 8.447 0 0 1-3.934 7.49z"/>
  </svg>
)

const BloggerIcon = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M20.585 9.463C20.147 9.463 20 9.29 20 8.857V7.143C20 4.303 17.674 2 14.808 2H6.239C3.373 2 1 4.303 1 7.143v9.714C1 19.697 3.326 22 6.192 22h11.616C20.674 22 23 19.697 23 16.857v-4.345c0-1.695-1.019-3.049-2.415-3.049zM8.962 7.393h3.693c.52 0 .942.422.942.941v.001a.942.942 0 0 1-.942.942H8.962a.942.942 0 0 1-.942-.942v-.001c0-.519.422-.941.942-.941zm5.885 9.214H8.962a.942.942 0 0 1-.942-.942v-.001c0-.52.422-.942.942-.942h5.885c.52 0 .942.422.942.942v.001a.941.941 0 0 1-.942.942z"/>
  </svg>
)

const VercelIcon = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M24 22.525H0l12-21.05 12 21.05z"/>
  </svg>
)

const NetlifyIcon = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.732v1.727l3.488-3.488zm.303 7.462a1.044 1.044 0 0 1-.303.732L12 21.658V19.03l5.237-5.237zM12 2.342l4.934 4.934a1.044 1.044 0 0 1 .303.732v.199L12 13.145V2.342zM5.768 8.028l3.488 3.488V9.789a1.044 1.044 0 0 1 .303-.732L12 6.124V2.342zm0 7.944V14.25l3.791 3.791H5.768zm3.791 5.686L5.768 17.867v-1.727L9.559 19.93zm0-13.658L6.071 4.512A1.044 1.044 0 0 1 7.116 3.3L9.559 5.743zm2.441 11.617L7.116 14.323a1.044 1.044 0 0 1 0-1.476L12 7.963z"/>
  </svg>
)

const GlobeIcon = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
    <path d="M2 12h20"/>
  </svg>
)

const platforms = [
  {
    id: 'wordpress',
    name: 'WordPress',
    tagBuy: 'Browse WordPress sites',
    tagSell: 'List your WordPress site today',
    descBuy: 'Discover established WordPress blogs, business sites, and e-commerce stores. Every listing is ownership-verified before you see it.',
    descSell: 'Connect your WordPress site via REST API. We verify ownership, secure your credentials, and execute the handover automatically when it sells.',
    bg: 'linear-gradient(145deg, #1e8ec4 0%, #0073aa 50%, #004d73 100%)',
    glow: 'rgba(0,115,170,0.7)',
    color: '#0073aa',
    lightColor: '#5bb8f5',
    delay: 0,
    floatAnim: 'float0',
    icon: <WPIcon size={55} />,
    bigIcon: <WPIcon size={90} />,
  },
  {
    id: 'blogger',
    name: 'Blogger',
    tagBuy: 'Browse Blogger blogs',
    tagSell: 'List your Blogger blog today',
    descBuy: 'Find monetized Blogger blogs with real audiences. Ownership is verified through the Google Blogger API before any listing goes live.',
    descSell: 'Connect via Google OAuth. We verify you own the blog, secure the transfer credentials, and hand over access automatically to the buyer.',
    bg: 'linear-gradient(145deg, #ff9534 0%, #f57d00 50%, #c45e00 100%)',
    glow: 'rgba(245,125,0,0.7)',
    color: '#f57d00',
    lightColor: '#ffb347',
    delay: 150,
    floatAnim: 'float1',
    icon: <BloggerIcon size={55} />,
    bigIcon: <BloggerIcon size={90} />,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    tagBuy: 'Browse Vercel projects',
    tagSell: 'List your Vercel project today',
    descBuy: 'Acquire live Next.js apps, SaaS tools, and Vercel-hosted projects. Project transfer is executed directly through the Vercel API.',
    descSell: 'Authenticate with your Vercel token. When your project sells, the transfer request is sent automatically — buyer gets access in minutes.',
    bg: 'linear-gradient(145deg, #2a2a2a 0%, #111 50%, #000 100%)',
    glow: 'rgba(255,255,255,0.2)',
    color: '#fff',
    lightColor: '#aaa',
    delay: 300,
    floatAnim: 'float2',
    icon: <VercelIcon size={55} />,
    bigIcon: <VercelIcon size={90} />,
  },
  {
    id: 'netlify',
    name: 'Netlify',
    tagBuy: 'Browse Netlify sites',
    tagSell: 'List your Netlify site today',
    descBuy: 'Find deployed Netlify sites across every niche. All listings verified via the Netlify API.',
    descSell: 'Link your Netlify account. Merj handles the ownership transfer end-to-end so you never have to email credentials to a stranger.',
    bg: 'linear-gradient(145deg, #00d4c2 0%, #00c7b7 50%, #009e91 100%)',
    glow: 'rgba(0,199,183,0.7)',
    color: '#00c7b7',
    lightColor: '#4de8de',
    delay: 450,
    floatAnim: 'float3',
    icon: <NetlifyIcon size={55} />,
    bigIcon: <NetlifyIcon size={90} />,
  },
  {
    id: 'custom',
    name: 'Any Website',
    tagBuy: 'Browse all websites',
    tagSell: 'List any live website today',
    descBuy: 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, Squarespace, locally hosted with a live URL — all on one marketplace.',
    descSell: 'Got a live URL? You can list it. Merj supports every major platform and any custom-hosted site with a public domain.',
    bg: 'linear-gradient(145deg, #5b3fa6 0%, #7c3aed 50%, #4c1d95 100%)',
    glow: 'rgba(124,58,237,0.7)',
    color: '#7c3aed',
    lightColor: '#a78bfa',
    delay: 600,
    floatAnim: 'float4',
    icon: <GlobeIcon size={55} />,
    bigIcon: <GlobeIcon size={90} />,
  },
]

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 150)
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id')
            if (id) setVisibleSections(prev => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.25 }
    )
    sectionRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const buying = mode === 'buy'

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: 'hidden' }}>

      <style>{`
        @keyframes float0 { 0%,100%{transform:rotate(-6deg) translateY(0)} 50%{transform:rotate(-6deg) translateY(-14px)} }
        @keyframes float1 { 0%,100%{transform:rotate(-2deg) translateY(0)} 50%{transform:rotate(-2deg) translateY(-18px)} }
        @keyframes float2 { 0%,100%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(0deg) translateY(-20px)} }
        @keyframes float3 { 0%,100%{transform:rotate(2deg) translateY(0)} 50%{transform:rotate(2deg) translateY(-16px)} }
        @keyframes float4 { 0%,100%{transform:rotate(6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-12px)} }

        @keyframes iconDrop {
          0%   { opacity:0; transform:translateY(-140px) scale(0.4) rotate(-8deg); }
          55%  { opacity:1; transform:translateY(18px) scale(1.08) rotate(2deg); }
          75%  { transform:translateY(-8px) scale(0.96) rotate(-1deg); }
          100% { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes popPulse {
          0%,100% { box-shadow: 0 0 40px var(--plat-glow), 0 20px 60px rgba(0,0,0,0.5); }
          50%     { box-shadow: 0 0 80px var(--plat-glow), 0 20px 60px rgba(0,0,0,0.5); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes dotMove {
          0%   { left:0%;   opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { left:100%; opacity:0; }
        }
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 20%{transform:translate(-1%,-2%)} 40%{transform:translate(2%,1%)} 60%{transform:translate(-1%,3%)} 80%{transform:translate(1%,-1%)}
        }

        .icon-card-hero {
          border-radius: 22px;
          display:flex; align-items:center; justify-content:center;
          position:relative; cursor:pointer;
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .icon-card-hero::before {
          content:''; position:absolute; top:0; left:0; right:0; height:55%;
          border-radius:22px 22px 0 0;
          background:linear-gradient(180deg,rgba(255,255,255,0.22) 0%,transparent 100%);
          z-index:2; pointer-events:none;
        }
        .icon-card-hero::after {
          content:''; position:absolute; inset:0; border-radius:22px;
          border:1px solid rgba(255,255,255,0.18); z-index:3; pointer-events:none;
        }
        .icon-card-hero:hover { filter:brightness(1.2) saturate(1.1); }

        .toggle-pill {
          display:inline-flex; border-radius:100px;
          border:1px solid rgba(255,255,255,0.12);
          background:rgba(255,255,255,0.04);
          padding:4px; gap:4px;
          position:relative; overflow:hidden;
        }
        .toggle-btn {
          position:relative; z-index:1; border:none; border-radius:100px;
          padding:0.65rem 1.75rem; font-size:0.9rem; font-weight:600;
          cursor:pointer; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          font-family:inherit; letter-spacing:0.01em; white-space:nowrap;
        }
        .toggle-btn.active { background:#e8c547; color:#000; box-shadow:0 4px 20px rgba(232,197,71,0.35); transform:scale(1.03); }
        .toggle-btn.inactive { background:transparent; color:rgba(255,255,255,0.4); }
        .toggle-btn.inactive:hover { color:rgba(255,255,255,0.8); }

        .btn-main {
          border:none; border-radius:8px; padding:0.95rem 2.5rem;
          font-size:0.95rem; font-weight:700; cursor:pointer;
          font-family:inherit; letter-spacing:0.02em;
          transition:all 0.25s ease;
        }
        .btn-buy { background:#e8c547; color:#000; }
        .btn-buy:hover { background:#f0d060; transform:translateY(-3px); box-shadow:0 14px 40px rgba(232,197,71,0.35); }
        .btn-sell { background:#fff; color:#000; }
        .btn-sell:hover { background:#f0f0f0; transform:translateY(-3px); box-shadow:0 14px 40px rgba(255,255,255,0.2); }
        .btn-ghost-main {
          background:transparent; color:rgba(255,255,255,0.6);
          border:1px solid rgba(255,255,255,0.15); border-radius:8px;
          padding:0.95rem 2.5rem; font-size:0.95rem; font-weight:500;
          cursor:pointer; font-family:inherit; transition:all 0.25s ease;
        }
        .btn-ghost-main:hover { border-color:rgba(255,255,255,0.5); color:#fff; transform:translateY(-2px); }

        .plat-section { transition: background 0.8s ease; }

        .plat-icon-wrap {
          opacity:0; transform:translateY(-140px) scale(0.4) rotate(-8deg);
        }
        .plat-icon-wrap.dropped {
          animation: iconDrop 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .plat-text-wrap { opacity:0; }
        .plat-text-wrap.visible {
          animation: fadeSlideUp 0.7s ease 0.5s forwards;
        }

        .plat-big-card {
          border-radius:28px; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
        }
        .plat-big-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,0.2) 0%,transparent 100%);
          border-radius:28px 28px 0 0; z-index:2; pointer-events:none;
        }
        .plat-big-card::after {
          content:''; position:absolute; inset:0; border-radius:28px;
          border:1px solid rgba(255,255,255,0.2); z-index:3; pointer-events:none;
        }

        .nav-btn-link {
          background:none; border:none; color:rgba(255,255,255,0.45);
          cursor:pointer; font-size:0.88rem; font-family:inherit;
          padding:0.4rem 0.75rem; transition:color 0.2s; letter-spacing:0.01em;
        }
        .nav-btn-link:hover { color:#fff; }

        .grain-overlay {
          position:fixed; inset:-50%; width:200%; height:200%;
          opacity:0.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation:grain 0.4s steps(1) infinite; pointer-events:none; z-index:9999;
        }

        .connector-line { height:1px; background:rgba(255,255,255,0.08); position:relative; overflow:visible; }
        .connector-dot { position:absolute; top:-3px; width:6px; height:6px; border-radius:50%; background:#e8c547; animation:dotMove 1.8s linear infinite; }

        @media (max-width:768px) {
          .hero-icons-row { gap:0 !important; }
          .hero-icon-size { width:64px !important; height:64px !important; border-radius:16px !important; }
          .connector-w { width:16px !important; }
          .icon-label { display:none !important; }
          .hero-title { font-size:2.6rem !important; }
          .hero-sub { font-size:0.95rem !important; }
          .plat-layout { flex-direction:column !important; text-align:center !important; align-items:center !important; }
          .plat-layout.reverse { flex-direction:column !important; }
          .plat-big-card-wrap { width:160px !important; height:160px !important; }
          .plat-title { font-size:2rem !important; }
          .nav-links-desktop { display:none !important; }
          .hero-btns { flex-direction:column !important; align-items:stretch !important; }
          .hero-btns button { width:100% !important; }
          .toggle-btn { padding:0.55rem 1.1rem !important; font-size:0.82rem !important; }
          .how-grid { grid-template-columns:1fr !important; }
          .footer-inner { flex-direction:column !important; text-align:center !important; gap:1rem !important; }
          .stat-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:480px) {
          .hero-title { font-size:2rem !important; }
          .section-pad { padding:4rem 1.25rem !important; }
          .cta-title { font-size:2.2rem !important; }
        }
      `}</style>

      <div className="grain-overlay" />

      {/* ─── NAV ─── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'1.1rem 2rem',
        background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition:'all 0.3s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width:'26px', height:'26px', background:'#e8c547', borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'13px', color:'#000' }}>M</div>
          <span style={{ fontWeight:'700', fontSize:'1.05rem', letterSpacing:'-0.02em' }}>Merj</span>
        </div>
        <div className="nav-links-desktop" style={{ display:'flex', gap:'0.15rem', alignItems:'center' }}>
          <button className="nav-btn-link" onClick={() => router.push('/listings')}>Browse</button>
          <button className="nav-btn-link" onClick={() => router.push('/sell')}>Sell</button>
          <button className="nav-btn-link">About</button>
        </div>
        <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
          <button className="nav-btn-link" onClick={() => router.push('/login')}>Sign in</button>
          <button
            onClick={() => router.push('/login')}
            style={{ background:'#e8c547', color:'#000', border:'none', borderRadius:'6px', padding:'0.5rem 1.1rem', fontSize:'0.82rem', fontWeight:'700', cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background='#f0d060'; e.currentTarget.style.transform='translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='#e8c547'; e.currentTarget.style.transform='translateY(0)' }}
          >
            List a site
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'7rem 1.5rem 4rem', position:'relative', textAlign:'center', overflow:'hidden' }}>

        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`, backgroundSize:'80px 80px', maskImage:'radial-gradient(ellipse at center top, black 20%, transparent 70%)', WebkitMaskImage:'radial-gradient(ellipse at center top, black 20%, transparent 70%)', zIndex:0 }} />

        {/* Top glow */}
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)', width:'700px', height:'350px', background:'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, rgba(232,197,71,0.05) 40%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        {/* FLOATING ICONS ROW */}
        <div
          className="hero-icons-row"
          style={{
            position:'relative', zIndex:2,
            display:'flex', alignItems:'flex-end', justifyContent:'center',
            gap:'0', marginBottom:'3.5rem',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {platforms.map((p, i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'flex-end', position:'relative' }}>
              {i > 0 && (
                <div className="connector-w" style={{ width:'24px', position:'relative', marginBottom:'46px' }}>
                  <div className="connector-line">
                    <div className="connector-dot" style={{ animationDelay:`${i * 0.5}s` }} />
                  </div>
                </div>
              )}
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
                animation:`${p.floatAnim} ${3.5 + i * 0.3}s ease-in-out ${p.delay}ms infinite`,
                opacity: heroVisible ? 1 : 0,
                transition:`opacity 0.6s ease ${p.delay}ms`,
              }}>
                <div
                  className="icon-card-hero hero-icon-size"
                  style={{
                    width:'88px', height:'88px',
                    background: p.bg,
                    boxShadow:`0 20px 50px ${p.glow}, 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                  onClick={() => router.push('/listings')}
                >
                  <div style={{ position:'relative', zIndex:4, display:'flex', alignItems:'center', justifyContent:'center', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
                    {p.icon}
                  </div>
                </div>
                <span className="icon-label" style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', fontWeight:'500', letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div style={{
          position:'relative', zIndex:2, marginBottom:'2rem',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
          transition:'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
        }}>
          <div className="toggle-pill">
            <button className={`toggle-btn ${mode === 'buy' ? 'active' : 'inactive'}`} onClick={() => setMode('buy')}>
              🛒 I want to buy
            </button>
            <button className={`toggle-btn ${mode === 'sell' ? 'active' : 'inactive'}`} onClick={() => setMode('sell')}>
              💰 I want to sell
            </button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{
          position:'relative', zIndex:2, maxWidth:'800px',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
          transition:'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
        }}>
          <h1
            className="hero-title"
            style={{ fontSize:'clamp(2.8rem,7vw,5.5rem)', fontWeight:'900', letterSpacing:'-0.035em', lineHeight:1, margin:'0 0 1.5rem', transition:'all 0.4s ease' }}
          >
            {buying ? (
              <>Find your next<br /><span style={{ color:'#e8c547' }}>website.</span> Own it safely.</>
            ) : (
              <>List your website.<br /><span style={{ color:'#e8c547' }}>Get paid</span> automatically.</>
            )}
          </h1>

          <p className="hero-sub" style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.38)', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:'500px', margin:'0 auto 2.5rem', transition:'all 0.4s ease' }}>
            {buying
              ? 'Browse verified WordPress sites, Blogger blogs, Vercel projects, and more. Payment is secured before you transfer a single dollar.'
              : 'Connect your site, set your price, and let Merj handle the entire sale. Ownership transfers automatically — you just get paid.'}
          </p>

          <div className="hero-btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            {buying ? (
              <>
                <button className="btn-main btn-buy" onClick={() => router.push('/listings')}>Browse websites</button>
                <button className="btn-ghost-main" onClick={() => { setMode('sell') }}>Switch to selling</button>
              </>
            ) : (
              <>
                <button className="btn-main btn-sell" onClick={() => router.push('/login')}>List your site — free</button>
                <button className="btn-ghost-main" onClick={() => { setMode('buy') }}>Switch to buying</button>
              </>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.15)', zIndex:2, fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase' }}>
          <div style={{ width:'1px', height:'36px', background:'rgba(255,255,255,0.1)' }} />
          Scroll
        </div>
      </section>

      {/* ─── PLATFORM SECTIONS ─── */}
      {platforms.map((p, i) => {
        const isVisible = visibleSections.has(p.id)
        const isReverse = i % 2 !== 0
        return (
          <section
            key={p.id}
            ref={el => { sectionRefs.current[i] = el }}
            data-id={p.id}
            className="plat-section section-pad"
            style={{
              padding:'6rem 2rem',
              background: isVisible ? `rgba(${p.id === 'wordpress' ? '0,115,170' : p.id === 'blogger' ? '245,125,0' : p.id === 'vercel' ? '40,40,40' : p.id === 'netlify' ? '0,199,183' : '124,58,237'},0.04)` : 'transparent',
              borderTop:'1px solid rgba(255,255,255,0.05)',
              transition:'background 1s ease',
            }}
          >
            <div
              className={`plat-layout ${isReverse ? 'reverse' : ''}`}
              style={{
                maxWidth:'1000px', margin:'0 auto',
                display:'flex', alignItems:'center',
                flexDirection: isReverse ? 'row-reverse' : 'row',
                gap:'4rem',
              }}
            >
              {/* Icon side */}
              <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
                {/* Glow behind */}
                <div style={{ position:'relative' }}>
                  <div style={{
                    position:'absolute', bottom:'-20px', left:'50%', transform:'translateX(-50%)',
                    width:'180px', height:'30px',
                    background: p.glow, filter:'blur(20px)', borderRadius:'50%',
                    opacity: isVisible ? 0.7 : 0, transition:'opacity 1s ease 0.3s',
                  }} />
                  <div
                    className={`plat-icon-wrap ${isVisible ? 'dropped' : ''}`}
                    style={{ '--plat-glow': p.glow } as React.CSSProperties}
                  >
                    <div
                      className="plat-big-card plat-big-card-wrap"
                      style={{
                        width:'200px', height:'200px',
                        background: p.bg,
                        boxShadow: isVisible ? `0 30px 80px ${p.glow}, 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)` : 'none',
                        animation: isVisible ? `popPulse 3s ease-in-out 1s infinite` : 'none',
                      } as React.CSSProperties}
                    >
                      <div style={{ position:'relative', zIndex:4, filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
                        {p.bigIcon}
                      </div>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize:'0.72rem', fontWeight:'600', letterSpacing:'0.2em',
                  color: isVisible ? p.lightColor : 'transparent',
                  textTransform:'uppercase', transition:'color 0.8s ease 0.7s',
                }}>
                  {p.name}
                </span>
              </div>

              {/* Text side */}
              <div className={`plat-text-wrap ${isVisible ? 'visible' : ''}`} style={{ flex:1 }}>
                <div style={{ width:'30px', height:'3px', background: p.color, borderRadius:'2px', marginBottom:'1.5rem' }} />
                <h2
                  className="plat-title"
                  style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:'800', letterSpacing:'-0.03em', margin:'0 0 1rem', lineHeight:1.1 }}
                >
                  {buying ? p.tagBuy : p.tagSell}
                </h2>
                <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'1rem', lineHeight:1.8, margin:'0 0 2rem' }}>
                  {buying ? p.descBuy : p.descSell}
                </p>
                <button
                  onClick={() => router.push(buying ? '/listings' : '/login')}
                  style={{
                    background: p.id === 'vercel' ? '#fff' : p.color,
                    color: p.id === 'vercel' ? '#000' : '#fff',
                    border:'none', borderRadius:'8px',
                    padding:'0.85rem 2rem', fontSize:'0.9rem', fontWeight:'700',
                    cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em',
                    transition:'all 0.25s ease',
                    boxShadow:`0 8px 24px ${p.glow}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.filter='none' }}
                >
                  {buying ? `Browse ${p.name} listings →` : `List on ${p.name} →`}
                </button>
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── HOW IT WORKS ─── */}
      <section className="section-pad" style={{ padding:'6rem 2rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto', textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px' }}>
            <div style={{ width:'20px', height:'1px', background:'rgba(255,255,255,0.25)' }} />
            How it works
            <div style={{ width:'20px', height:'1px', background:'rgba(255,255,255,0.25)' }} />
          </div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:'800', letterSpacing:'-0.03em', margin:0 }}>
            Simple. Secure. Automatic.
          </h2>
        </div>
        <div className="how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px', background:'rgba(255,255,255,0.05)', borderRadius:'16px', overflow:'hidden', maxWidth:'1000px', margin:'0 auto' }}>
          {[
            { n:'01', icon:'🔗', title:'List & verify', body:'Connect via any platform integration. We verify real ownership through the platform\'s API before your listing goes live.' },
            { n:'02', icon:'🔒', title:'Buyer pays. Money locks.', body:"The buyer's payment is secured the moment they check out. Neither party can access it until the transfer is confirmed complete." },
            { n:'03', icon:'⚡', title:'Transfer first. Pay after.', body:'Admin access, credentials, and project files transfer automatically. Only after confirmation does your payment release.' },
          ].map(s => (
            <div key={s.n} style={{ background:'#080808', padding:'2.5rem 2rem', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'1rem', right:'1rem', fontSize:'4rem', fontWeight:'900', color:'rgba(255,255,255,0.025)', letterSpacing:'-0.04em', lineHeight:1, userSelect:'none' }}>{s.n}</div>
              <div style={{ fontSize:'1.8rem', marginBottom:'1rem' }}>{s.icon}</div>
              <div style={{ width:'20px', height:'2px', background:'#e8c547', marginBottom:'1rem' }} />
              <h3 style={{ fontSize:'1rem', fontWeight:'700', margin:'0 0 0.75rem', letterSpacing:'-0.01em' }}>{s.title}</h3>
              <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.88rem', lineHeight:1.75, margin:0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background:'rgba(232,197,71,0.03)', borderTop:'1px solid rgba(232,197,71,0.08)', borderBottom:'1px solid rgba(232,197,71,0.08)', padding:'3.5rem 2rem' }}>
        <div className="stat-grid" style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(255,255,255,0.05)', borderRadius:'12px', overflow:'hidden' }}>
          {[
            { v:'Any platform', l:'If it has a live URL' },
            { v:'100% Auto', l:'No manual handoffs' },
            { v:'Transfer first', l:'Pay only on success' },
            { v:'Free to list', l:'Commission on sale only' },
          ].map(s => (
            <div key={s.l} style={{ background:'#050505', padding:'1.75rem 1.25rem', textAlign:'center' }}>
              <div style={{ fontSize:'1.1rem', fontWeight:'800', color:'#e8c547', marginBottom:'0.4rem', letterSpacing:'-0.01em' }}>{s.v}</div>
              <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.28)', fontWeight:'500' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding:'8rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(232,197,71,0.06) 0%, transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 className="cta-title" style={{ fontSize:'clamp(2.2rem,6vw,4rem)', fontWeight:'900', letterSpacing:'-0.035em', margin:'0 0 1.25rem', lineHeight:1 }}>
            Your site has value.<br />
            <span style={{ color:'#e8c547' }}>Let&apos;s move it.</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'1rem', marginBottom:'2.5rem', maxWidth:'380px', margin:'0 auto 2.5rem', lineHeight:1.7 }}>
            Free to list. No fees until your site sells.
          </p>
          <div className="hero-btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-main btn-buy" onClick={() => router.push('/login')}>List your site — free</button>
            <button className="btn-ghost-main" onClick={() => router.push('/listings')}>Browse listings</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'2rem' }}>
        <div className="footer-inner" style={{ maxWidth:'1000px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'20px', height:'20px', background:'#e8c547', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'10px', color:'#000' }}>M</div>
            <span style={{ fontWeight:'600', fontSize:'0.9rem' }}>Merj</span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.15)', fontSize:'0.78rem', margin:0 }}>© 2025 Merj · Website acquisition, done right.</p>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            {['Browse','Sell','Sign in'].map(l => (
              <button key={l} onClick={() => router.push(l === 'Browse' ? '/listings' : '/login')}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:'0.78rem', padding:0, fontFamily:'inherit', transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
              >{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
