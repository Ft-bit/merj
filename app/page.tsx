'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const WPIcon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.931 12c0-1.15.243-2.243.668-3.236L7.898 19.3A8.454 8.454 0 0 1 3.93 12zm8.069 8.47a8.52 8.52 0 0 1-2.42-.352l2.569-7.471 2.634 7.214c.02.045.044.088.067.13a8.504 8.504 0 0 1-2.85.479zm1.18-12.71c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109-.84 0-2.253-.109-2.253-.109-.463-.027-.517.679-.054.707 0 0 .437.054.898.081l1.334 3.655-1.874 5.62L8.11 7.76c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109a9.128 9.128 0 0 1-.56-.017A8.474 8.474 0 0 1 12 3.53c2.234 0 4.27.854 5.797 2.252a3.46 3.46 0 0 0-.246-.009c-.84 0-1.44.73-1.44 1.514 0 .707.407 1.306.842 2.012.326.571.707 1.305.707 2.362 0 .734-.282 1.586-.65 2.77l-.853 2.852zm3.355 11.73-.048-.092 2.605-7.534c.489-1.224.652-2.202.652-3.073 0-.316-.021-.61-.058-.887A8.473 8.473 0 0 1 20.47 12a8.447 8.447 0 0 1-3.934 7.49z"/>
  </svg>
)

const BIcon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M20.585 9.463C20.147 9.463 20 9.29 20 8.857V7.143C20 4.303 17.674 2 14.808 2H6.239C3.373 2 1 4.303 1 7.143v9.714C1 19.697 3.326 22 6.192 22h11.616C20.674 22 23 19.697 23 16.857v-4.345c0-1.695-1.019-3.049-2.415-3.049zM8.962 7.393h3.693c.52 0 .942.422.942.941a.942.942 0 0 1-.942.942H8.962a.942.942 0 0 1-.942-.942c0-.519.422-.941.942-.941zm5.885 9.214H8.962a.942.942 0 0 1-.942-.942c0-.52.422-.942.942-.942h5.885c.52 0 .942.422.942.942a.941.941 0 0 1-.942.942z"/>
  </svg>
)

const VIcon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M24 22.525H0l12-21.05 12 21.05z"/>
  </svg>
)

const NIcon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.732v1.727l3.488-3.488zm.303 7.462a1.044 1.044 0 0 1-.303.732L12 21.658V19.03l5.237-5.237zM12 2.342l4.934 4.934a1.044 1.044 0 0 1 .303.732v.199L12 13.145V2.342zM5.768 8.028l3.488 3.488V9.789a1.044 1.044 0 0 1 .303-.732L12 6.124V2.342zm0 7.944V14.25l3.791 3.791H5.768zm3.791 5.686L5.768 17.867v-1.727L9.559 19.93zm0-13.658L6.071 4.512A1.044 1.044 0 0 1 7.116 3.3L9.559 5.743zm2.441 11.617L7.116 14.323a1.044 1.044 0 0 1 0-1.476L12 7.963z"/>
  </svg>
)

const GlobeIcon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
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
    tagSell: 'List your WordPress site',
    descBuy: 'Discover established WordPress blogs, stores, and business sites. Every listing ownership-verified before you see it.',
    descSell: 'Connect via WordPress REST API. We verify ownership, encrypt credentials, and execute the full handover when your site sells.',
    bg: 'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)',
    glow: '#0073aa',
    glowRgb: '0,115,170',
    color: '#0073aa',
    light: '#5bb8f5',
    smIcon: <WPIcon s={46} />,
    lgIcon: <WPIcon s={80} />,
  },
  {
    id: 'blogger',
    name: 'Blogger',
    tagBuy: 'Browse Blogger blogs',
    tagSell: 'List your Blogger blog',
    descBuy: 'Find monetized Blogger blogs with real audiences. Google Blogger API verifies ownership before listing.',
    descSell: 'Connect via Google OAuth. We verify the blog is yours and hand access to the buyer automatically.',
    bg: 'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)',
    glow: '#f57d00',
    glowRgb: '245,125,0',
    color: '#f57d00',
    light: '#ffb347',
    smIcon: <BIcon s={46} />,
    lgIcon: <BIcon s={80} />,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    tagBuy: 'Browse Vercel projects',
    tagSell: 'List your Vercel project',
    descBuy: 'Acquire live Next.js apps, SaaS tools, and Vercel projects. Project transfer via the Vercel API.',
    descSell: 'Authenticate with your Vercel token. Transfer request fires automatically when your project sells.',
    bg: 'linear-gradient(145deg,#2a2a2a,#111 50%,#000)',
    glow: '#ffffff',
    glowRgb: '200,200,200',
    color: '#fff',
    light: '#aaa',
    smIcon: <VIcon s={46} />,
    lgIcon: <VIcon s={80} />,
  },
  {
    id: 'netlify',
    name: 'Netlify',
    tagBuy: 'Browse Netlify sites',
    tagSell: 'List your Netlify site',
    descBuy: 'Find deployed Netlify sites across every niche. Verified via the Netlify API.',
    descSell: 'Link your Netlify account. Merj handles ownership transfer end-to-end.',
    bg: 'linear-gradient(145deg,#00d4c2,#00c7b7 50%,#009e91)',
    glow: '#00c7b7',
    glowRgb: '0,199,183',
    color: '#00c7b7',
    light: '#4de8de',
    smIcon: <NIcon s={46} />,
    lgIcon: <NIcon s={80} />,
  },
  {
    id: 'custom',
    name: 'Any Website',
    tagBuy: 'Browse all listings',
    tagSell: 'List any live website',
    descBuy: 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, custom domains — all in one marketplace.',
    descSell: 'Got a live URL? List it. Merj supports every major platform and any custom-hosted site.',
    bg: 'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)',
    glow: '#7c3aed',
    glowRgb: '124,58,237',
    color: '#7c3aed',
    light: '#a78bfa',
    smIcon: <GlobeIcon s={46} />,
    lgIcon: <GlobeIcon s={80} />,
  },
]

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [scrolled, setScrolled] = useState(false)
  const [heroIn, setHeroIn] = useState(false)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id
            if (id) setVisible(prev => ({ ...prev, [id]: true }))
          }
        })
      },
      { threshold: 0.2 }
    )
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const buy = mode === 'buy'

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: 'hidden' }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes f0 { 0%,100%{transform:rotate(-6deg) translateY(0)} 50%{transform:rotate(-6deg) translateY(-12px)} }
        @keyframes f1 { 0%,100%{transform:rotate(-2deg) translateY(0)} 50%{transform:rotate(-2deg) translateY(-16px)} }
        @keyframes f2 { 0%,100%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(0deg) translateY(-18px)} }
        @keyframes f3 { 0%,100%{transform:rotate(2deg) translateY(0)} 50%{transform:rotate(2deg) translateY(-14px)} }
        @keyframes f4 { 0%,100%{transform:rotate(6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-10px)} }

        @keyframes dropIn {
          0%   { opacity:0; transform:translateY(-120px) scale(0.4) rotate(-8deg); }
          55%  { opacity:1; transform:translateY(16px) scale(1.07) rotate(2deg); }
          75%  { transform:translateY(-7px) scale(0.96) rotate(-1deg); }
          100% { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes dotMove {
          0%   { left:0%;   opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { left:100%; opacity:0; }
        }
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 20%{transform:translate(-1%,-2%)} 60%{transform:translate(-1%,3%)}
        }
        @keyframes gPulse {
          0%,100% { opacity:0.5; }
          50%     { opacity:0.9; }
        }

        .grain { position:fixed; inset:-50%; width:200%; height:200%; opacity:.025; pointer-events:none; z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grain 0.4s steps(1) infinite; }

        .ic {
          border-radius:20px; display:flex; align-items:center; justify-content:center;
          position:relative; cursor:pointer; transition:filter .25s, transform .25s;
        }
        .ic::before { content:''; position:absolute; top:0; left:0; right:0; height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%);
          border-radius:20px 20px 0 0; z-index:2; pointer-events:none; }
        .ic::after  { content:''; position:absolute; inset:0; border-radius:20px;
          border:1px solid rgba(255,255,255,.18); z-index:3; pointer-events:none; }
        .ic:hover { filter:brightness(1.2); transform:translateY(-4px) scale(1.03); }

        .big-ic {
          border-radius:28px; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
        }
        .big-ic::before { content:''; position:absolute; top:0; left:0; right:0; height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,.2) 0%,transparent 100%);
          border-radius:28px 28px 0 0; z-index:2; pointer-events:none; }
        .big-ic::after  { content:''; position:absolute; inset:0; border-radius:28px;
          border:1px solid rgba(255,255,255,.2); z-index:3; pointer-events:none; }

        .tog { display:inline-flex; border-radius:100px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); padding:4px; gap:4px; }
        .tb  { border:none; border-radius:100px; padding:.65rem 1.75rem; font-size:.9rem; font-weight:600; cursor:pointer; transition:all .3s cubic-bezier(.34,1.56,.64,1); font-family:inherit; white-space:nowrap; }
        .tb.on  { background:#e8c547; color:#000; box-shadow:0 4px 20px rgba(232,197,71,.35); transform:scale(1.03); }
        .tb.off { background:transparent; color:rgba(255,255,255,.4); }
        .tb.off:hover { color:rgba(255,255,255,.8); }

        .bm { border:none; border-radius:8px; padding:.95rem 2.25rem; font-size:.92rem; font-weight:700; cursor:pointer; font-family:inherit; letter-spacing:.02em; transition:all .25s; }
        .bm.gold { background:#e8c547; color:#000; }
        .bm.gold:hover { background:#f0d060; transform:translateY(-3px); box-shadow:0 12px 36px rgba(232,197,71,.35); }
        .bm.wht  { background:#fff; color:#000; }
        .bm.wht:hover  { background:#f0f0f0; transform:translateY(-3px); box-shadow:0 12px 36px rgba(255,255,255,.2); }
        .bm.gh   { background:transparent; color:rgba(255,255,255,.6); border:1px solid rgba(255,255,255,.15); }
        .bm.gh:hover { border-color:rgba(255,255,255,.5); color:#fff; transform:translateY(-2px); }

        .nb  { background:none; border:none; color:rgba(255,255,255,.45); cursor:pointer; font-size:.88rem; font-family:inherit; padding:.4rem .75rem; transition:color .2s; }
        .nb:hover { color:#fff; }

        .cx { height:1px; background:rgba(255,255,255,.08); position:relative; overflow:visible; }
        .cd { position:absolute; top:-3px; width:6px; height:6px; border-radius:50%; background:#e8c547; animation:dotMove 1.8s linear infinite; }

        .drop { opacity:0; transform:translateY(-120px) scale(0.4) rotate(-8deg); }
        .drop.in { animation: dropIn .9s cubic-bezier(.34,1.56,.64,1) forwards; }

        .tup { opacity:0; }
        .tup.in { animation: slideUp .7s ease .45s forwards; }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .hero-icons .ic { width:62px !important; height:62px !important; border-radius:15px !important; }
          .hero-icons .cx  { width:14px !important; }
          .icon-lbl { display:none !important; }
          .hero-h1  { font-size:2.4rem !important; }
          .hero-sub { font-size:.95rem !important; }
          .btns     { flex-direction:column !important; }
          .btns .bm, .btns button { width:100% !important; text-align:center !important; }
          .tb       { padding:.55rem 1rem !important; font-size:.82rem !important; }
          .plat-row { flex-direction:column !important; text-align:center !important; align-items:center !important; }
          .plat-row.rev { flex-direction:column !important; }
          .plat-big { width:150px !important; height:150px !important; }
          .plat-h   { font-size:1.8rem !important; }
          .how-g    { grid-template-columns:1fr !important; }
          .stat-g   { grid-template-columns:1fr 1fr !important; }
          .nav-mid  { display:none !important; }
          .hero-icons { gap:0 !important; }
          .sec-pad  { padding:4rem 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .hero-h1  { font-size:1.9rem !important; }
          .hero-icons .ic { width:50px !important; height:50px !important; }
          .hero-icons .cx  { width:8px !important; }
          .plat-big { width:120px !important; height:120px !important; }
          .cta-h    { font-size:2rem !important; }
        }
      `}</style>

      <div className="grain" />

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.75rem',
        background: scrolled ? 'rgba(0,0,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all .3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '26px', height: '26px', background: '#e8c547', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', color: '#000' }}>M</div>
          <span style={{ fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Merj</span>
        </div>

        <div className="nav-mid" style={{ display: 'flex', gap: '.15rem' }}>
          <button className="nb" onClick={() => router.push('/listings')}>Browse</button>
          <button className="nb" onClick={() => router.push('/sell')}>Sell</button>
          <button className="nb">About</button>
        </div>

        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <button className="nb" onClick={() => router.push('/login')}>Sign in</button>
          <button className="bm gold" style={{ padding: '.5rem 1.1rem', fontSize: '.82rem' }} onClick={() => router.push('/login')}>
            List a site
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '7rem 1.5rem 4rem', position: 'relative',
        textAlign: 'center', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center top, black 15%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center top, black 15%, transparent 65%)',
        }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '350px', background: 'radial-gradient(ellipse, rgba(124,58,237,.14) 0%, rgba(232,197,71,.04) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ICONS ROW */}
        <div
          className="hero-icons"
          style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: '0', marginBottom: '3rem',
            opacity: heroIn ? 1 : 0,
            transform: heroIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .8s ease, transform .8s ease',
          }}
        >
          {platforms.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'flex-end' }}>
              {i > 0 && (
                <div className="cx" style={{ width: '22px', marginBottom: '40px' }}>
                  <div className="cd" style={{ animationDelay: `${i * 0.5}s` }} />
                </div>
              )}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                animation: `f${i} ${3.5 + i * 0.3}s ease-in-out ${i * 150}ms infinite`,
                opacity: heroIn ? 1 : 0,
                transition: `opacity .6s ease ${i * 120}ms`,
              }}>
                <div
                  className="ic"
                  style={{ width: '84px', height: '84px', background: p.bg, boxShadow: `0 20px 50px ${p.glow}66, 0 8px 20px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.2)` }}
                  onClick={() => router.push('/listings')}
                >
                  <div style={{ position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.4))' }}>
                    {p.smIcon}
                  </div>
                </div>
                <span className="icon-lbl" style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.3)', fontWeight: '500', letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div style={{ position: 'relative', zIndex: 2, marginBottom: '1.75rem', opacity: heroIn ? 1 : 0, transition: 'opacity .8s ease .25s' }}>
          <div className="tog">
            <button className={`tb ${buy ? 'on' : 'off'}`} onClick={() => setMode('buy')}>🛒 I want to buy</button>
            <button className={`tb ${!buy ? 'on' : 'off'}`} onClick={() => setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', opacity: heroIn ? 1 : 0, transition: 'opacity .9s ease .35s' }}>
          <h1 className="hero-h1" style={{ fontSize: 'clamp(2.6rem,7vw,5.5rem)', fontWeight: '900', letterSpacing: '-.035em', lineHeight: 1, margin: '0 0 1.25rem', transition: 'all .4s ease' }}>
            {buy ? <>Find your next<br /><span style={{ color: '#e8c547' }}>website.</span> Own it safely.</> : <>List your website.<br /><span style={{ color: '#e8c547' }}>Get paid</span> automatically.</>}
          </h1>

          <p className="hero-sub" style={{ fontSize: '1rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.75, margin: '0 auto 2.25rem', maxWidth: '500px', transition: 'all .4s ease' }}>
            {buy ? 'Browse verified WordPress sites, Blogger blogs, Vercel projects, and more. Payment is secured in escrow before any transfer happens.' : 'Connect your site, set your price, and let Merj handle the entire sale. Ownership transfers automatically — you just get paid.'}
          </p>

          <div className="btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {buy
              ? <><button className="bm gold" onClick={() => router.push('/listings')}>Browse websites</button><button className="bm gh" onClick={() => setMode('sell')}>Switch to selling</button></>
              : <><button className="bm wht" onClick={() => router.push('/login')}>List your site — free</button><button className="bm gh" onClick={() => setMode('buy')}>Switch to buying</button></>
            }
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,.1)' }} />
          <span style={{ fontSize: '.62rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.15)', textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* ─── PLATFORM SECTIONS ─── */}
      {platforms.map((p, i) => {
        const isIn = !!visible[p.id]
        const rev = i % 2 !== 0
        return (
          <section
            key={p.id}
            data-id={p.id}
            ref={(el) => { if (el) sectionRefs.current[p.id] = el }}
            className="sec-pad"
            style={{
              padding: '6rem 2rem',
              borderTop: '1px solid rgba(255,255,255,.05)',
              background: isIn ? `rgba(${p.glowRgb},0.04)` : 'transparent',
              transition: 'background 1.2s ease',
            }}
          >
            <div
              className={`plat-row${rev ? ' rev' : ''}`}
              style={{
                maxWidth: '980px', margin: '0 auto',
                display: 'flex', alignItems: 'center',
                flexDirection: rev ? 'row-reverse' : 'row',
                gap: '3.5rem',
              }}
            >
              {/* Icon */}
              <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)',
                    width: '140px', height: '24px',
                    background: p.glow, filter: 'blur(18px)', borderRadius: '50%',
                    opacity: isIn ? 0.6 : 0, transition: 'opacity 1s ease .3s',
                    animation: isIn ? 'gPulse 3s ease-in-out infinite' : 'none',
                  }} />
                  <div className={`drop${isIn ? ' in' : ''}`}>
                    <div
                      className="big-ic plat-big"
                      style={{
                        width: '190px', height: '190px',
                        background: p.bg,
                        boxShadow: isIn ? `0 24px 70px ${p.glow}55, 0 0 0 1px rgba(255,255,255,.1), inset 0 1px 0 rgba(255,255,255,.2)` : 'none',
                      }}
                    >
                      <div style={{ position: 'relative', zIndex: 4, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,.5))' }}>
                        {p.lgIcon}
                      </div>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '.72rem', fontWeight: '600', letterSpacing: '.2em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  color: isIn ? p.light : 'transparent', transition: 'color .8s ease .7s',
                }}>
                  {p.name}
                </span>
              </div>

              {/* Text */}
              <div className={`tup${isIn ? ' in' : ''}`} style={{ flex: 1 }}>
                <div style={{ width: '28px', height: '3px', background: p.color, borderRadius: '2px', marginBottom: '1.25rem' }} />
                <h2 className="plat-h" style={{ fontSize: 'clamp(1.7rem,4vw,2.6rem)', fontWeight: '800', letterSpacing: '-.03em', margin: '0 0 1rem', lineHeight: 1.1 }}>
                  {buy ? p.tagBuy : p.tagSell}
                </h2>
                <p style={{ color: 'rgba(255,255,255,.42)', fontSize: '.97rem', lineHeight: 1.8, margin: '0 0 1.75rem' }}>
                  {buy ? p.descBuy : p.descSell}
                </p>
                <button
                  className="bm"
                  onClick={() => router.push(buy ? '/listings' : '/login')}
                  style={{
                    background: p.id === 'vercel' ? '#fff' : p.color,
                    color: '#000',
                    boxShadow: `0 8px 24px ${p.glow}44`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  {buy ? `Browse ${p.name} →` : `List on ${p.name} →`}
                </button>
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── HOW IT WORKS ─── */}
      <section className="sec-pad" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '.7rem', fontWeight: '600', letterSpacing: '.2em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', marginBottom: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,.25)' }} />
              How it works
              <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,.25)' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: '800', letterSpacing: '-.03em', margin: 0 }}>
              Simple. Secure. Automatic.
            </h2>
          </div>

          <div className="how-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', background: 'rgba(255,255,255,.05)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { n: '01', e: '🔗', t: 'Verify & List', b: 'Connect via any platform integration. We check real ownership through the platform\'s API before your listing goes live.' },
              { n: '02', e: '🔒', t: 'Buyer pays. Money locks.', b: "Buyer's payment is secured at checkout. Neither side can access it until transfer is fully confirmed." },
              { n: '03', e: '⚡', t: 'Transfer first. Pay after.', b: 'Admin access and credentials transfer automatically. Only after confirmation does payment release to the seller.' },
            ].map(s => (
              <div key={s.n} style={{ background: '#080808', padding: '2.25rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '.75rem', right: '1rem', fontSize: '4rem', fontWeight: '900', color: 'rgba(255,255,255,.025)', lineHeight: 1, userSelect: 'none', letterSpacing: '-.04em' }}>{s.n}</div>
                <div style={{ fontSize: '1.75rem', marginBottom: '.85rem' }}>{s.e}</div>
                <div style={{ width: '20px', height: '2px', background: '#e8c547', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '.97rem', fontWeight: '700', margin: '0 0 .65rem' }}>{s.t}</h3>
                <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.87rem', lineHeight: 1.75, margin: 0 }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: 'rgba(232,197,71,.03)', borderTop: '1px solid rgba(232,197,71,.08)', borderBottom: '1px solid rgba(232,197,71,.08)', padding: '3.5rem 2rem' }}>
        <div className="stat-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', background: 'rgba(255,255,255,.05)', borderRadius: '12px', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { v: 'Any platform', l: 'If it has a live URL' },
            { v: '100% Auto', l: 'No manual handoffs' },
            { v: 'Transfer first', l: 'Pay only on success' },
            { v: 'Free to list', l: 'Commission on sale only' },
          ].map(s => (
            <div key={s.l} style={{ background: '#050505', padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#e8c547', marginBottom: '.4rem' }}>{s.v}</div>
              <div style={{ fontSize: '.77rem', color: 'rgba(255,255,255,.28)', fontWeight: '500' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '7rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(232,197,71,.06) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-h" style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', fontWeight: '900', letterSpacing: '-.035em', margin: '0 0 1.1rem', lineHeight: 1 }}>
            Your site has value.<br />
            <span style={{ color: '#e8c547' }}>{"Let's move it."}</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.97rem', margin: '0 auto 2.25rem', maxWidth: '360px', lineHeight: 1.7 }}>
            Free to list. No fees until your site sells.
          </p>
          <div className="btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="bm gold" onClick={() => router.push('/login')}>List your site — free</button>
            <button className="bm gh" onClick={() => router.push('/listings')}>Browse listings</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '2rem 1.75rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: '#e8c547', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: '#000' }}>M</div>
            <span style={{ fontWeight: '600', fontSize: '.9rem' }}>Merj</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,.15)', fontSize: '.78rem', margin: 0 }}>© 2025 Merj · Website acquisition, done right.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Browse', 'Sell', 'Sign in'].map(l => (
              <button key={l}
                onClick={() => router.push(l === 'Browse' ? '/listings' : '/login')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.2)', cursor: 'pointer', fontSize: '.78rem', padding: 0, fontFamily: 'inherit', transition: 'color .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.6)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.2)' }}
              >{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
