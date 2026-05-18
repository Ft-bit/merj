'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4'

/* ─── PLATFORM DATA ─── */
const PLATFORMS = [
  {
    id: 'wordpress', name: 'WordPress', num: '01',
    img: '/images/wp.png',
    buyH: 'Buy or list your WordPress website',
    buySub: 'Turn your WordPress site into cash — or acquire one that already earns. Ownership verified through the WordPress REST API. Admin access transfers the moment the deal closes.',
    sellH: 'Sell your WordPress website today',
    sellSub: 'Connect via Application Password. We verify real ownership and execute a full admin handover automatically. You get paid. Buyer gets access. No emails, no trust required.',
    achieve: ['Verified admin handover', 'WooCommerce & blogs', 'Automated credentials'],
    bg: 'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)',
    glow: '#0073aa', rgb: '0,115,170', light: '#5bb8f5', textColor: '#fff',
  },
  {
    id: 'blogger', name: 'Blogger', num: '02',
    img: '/images/blogger.png',
    buyH: 'Buy or list your Blogger website',
    buySub: 'Find monetized Blogger blogs with real audiences and domain authority — or put yours on the market. Google Blogger API confirms every listing before it goes live.',
    sellH: 'Sell your Blogger blog today',
    sellSub: 'Connect via Google OAuth. We verify ownership and transfer blog access to the buyer through the Blogger API. The handover is code, not conversation.',
    achieve: ['Google API verified', 'Real audience metrics', 'Instant credential handoff'],
    bg: 'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)',
    glow: '#f57d00', rgb: '245,125,0', light: '#ffb347', textColor: '#fff',
  },
  {
    id: 'vercel', name: 'Vercel', num: '03',
    img: '/images/vc.png',
    buyH: 'Buy or list your Vercel project',
    buySub: 'Acquire live Next.js apps, SaaS tools, and Vercel-deployed projects. Project transfer executes directly through the Vercel API — buyer has access within minutes.',
    sellH: 'Sell your Vercel project today',
    sellSub: 'Authenticate with your Vercel token. When your project sells, the transfer request fires automatically. You get paid the moment the buyer confirms access.',
    achieve: ['Vercel API transfer', 'Next.js & SaaS apps', 'Domain included'],
    bg: 'linear-gradient(145deg,#1a1a1a,#0a0a0a 50%,#000)',
    glow: '#666', rgb: '150,150,150', light: '#ccc', textColor: '#fff',
  },
  {
    id: 'custom', name: 'Any Live Website', num: '04',
    img: null,
    buyH: 'Buy or list any live website',
    buySub: 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, Squarespace, locally hosted apps with a live domain — every platform, one marketplace.',
    sellH: 'Sell any live website today',
    sellSub: 'Got a live URL? List it on Merj. We support every major hosting platform and any custom-hosted site. More connectors ship every month.',
    achieve: ['Every platform welcome', 'Custom domains', 'Local hosted apps'],
    bg: 'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)',
    glow: '#7c3aed', rgb: '124,58,237', light: '#a78bfa', textColor: '#fff',
  },
]

/* ─── FLOATING HERO ICONS ─── */
const FloatIcon = ({ p, delay, size = 82 }: { p: typeof PLATFORMS[0], delay: number, size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: '22px',
    background: p.bg,
    boxShadow: `0 20px 50px ${p.glow}55, inset 0 1px 0 rgba(255,255,255,.22)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', cursor: 'pointer',
    animation: `float ${3.5 + delay * .3}s ease-in-out ${delay * 140}ms infinite`,
    transition: 'transform .3s, filter .3s',
    flexShrink: 0,
  }}>
    {/* Glass top reflection */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%)', borderRadius: '22px 22px 0 0', zIndex: 2, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,.2)', borderRadius: '22px', zIndex: 3, pointerEvents: 'none' }} />
    {p.img
      ? <img src={p.img} alt={p.name} style={{ width: size * .6, height: size * .6, objectFit: 'contain', position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }} />
      : <svg viewBox="0 0 24 24" width={size*.55} height={size*.55} fill="none" stroke="white" strokeWidth="1.5" style={{ position: 'relative', zIndex: 4 }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
          <path d="M2 12h20"/>
        </svg>
    }
  </div>
)

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [scrolled, setScrolled] = useState(false)
  const [heroIn, setHeroIn] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const iconRefs  = useRef<(HTMLDivElement | null)[]>([])
  const textRefs  = useRef<(HTMLDivElement | null)[]>([])
  const secRefs   = useRef<(HTMLDivElement | null)[]>([])

  const buy = mode === 'buy'

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 100)
    const s = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', s, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', s) }
  }, [])

  /* ─── GSAP SCROLL-SCRUB DROP ─── */
  useEffect(() => {
    let killed = false
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (killed) return
      gsap.registerPlugin(ScrollTrigger)

      // Each icon falls FROM THE TOP tied directly to scroll position
      iconRefs.current.forEach((icon, i) => {
        const sec = secRefs.current[i]
        if (!icon || !sec) return
        gsap.set(icon, { y: -700, scale: 0.08, rotation: -30, opacity: 0 })
        gsap.to(icon, {
          y: 0, scale: 1, rotation: 0, opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 100%',   // icon starts falling when section enters bottom of screen
            end: 'top 15%',      // finishes when section is near top
            scrub: 2,            // directly tied to scroll speed
          },
        })
      })

      // Text reveals tied to scroll
      textRefs.current.forEach((txt, i) => {
        const sec = secRefs.current[i]
        if (!txt || !sec) return
        gsap.set(txt, { opacity: 0, y: 80 })
        gsap.to(txt, {
          opacity: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            end: 'top 15%',
            scrub: 1.5,
          },
        })
      })

      ScrollTrigger.refresh()
    }
    init()
    return () => {
      killed = true
      import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
        ST.getAll().forEach(t => t.kill())
      }).catch(() => {})
    }
  }, [])

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: 'hidden' }}>

      <style>{`
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }

        @keyframes float {
          0%,100% { transform:translateY(0px) }
          50%      { transform:translateY(-14px) }
        }
        @keyframes dotMove {
          0%   { left:0%; opacity:0 }
          10%  { opacity:1 }
          90%  { opacity:1 }
          100% { left:100%; opacity:0 }
        }
        @keyframes grain {
          0%,100% { transform:translate(0,0) }
          33%     { transform:translate(-1%,-2%) }
          66%     { transform:translate(1%,1%) }
        }
        @keyframes glowPulse {
          0%,100% { opacity:.4 }
          50%     { opacity:.85 }
        }

        .grain {
          position:fixed; inset:-50%; width:200%; height:200%;
          opacity:.022; pointer-events:none; z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grain .35s steps(1) infinite;
        }

        .ic-hover { transition:filter .3s, transform .3s; cursor:pointer; }
        .ic-hover:hover { filter:brightness(1.25); transform:translateY(-6px) scale(1.04); }

        .tog { display:inline-flex; border-radius:100px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03); padding:5px; gap:4px; }
        .tb  { border:none; border-radius:100px; padding:.72rem 2rem; font-size:.9rem; font-weight:600; cursor:pointer; transition:all .35s cubic-bezier(.34,1.56,.64,1); font-family:inherit; white-space:nowrap; }
        .tb.on  { background:#e8c547; color:#000; box-shadow:0 6px 24px rgba(232,197,71,.4); transform:scale(1.04); }
        .tb.off { background:transparent; color:rgba(255,255,255,.35); }
        .tb.off:hover { color:rgba(255,255,255,.8); }

        .btn { border:none; border-radius:7px; padding:1rem 2.5rem; font-size:.9rem; font-weight:700; cursor:pointer; font-family:inherit; letter-spacing:.04em; text-transform:uppercase; transition:all .25s; }
        .btn.g  { background:#e8c547; color:#000; }
        .btn.g:hover  { background:#f0d060; transform:translateY(-3px); box-shadow:0 16px 40px rgba(232,197,71,.35); }
        .btn.w  { background:#fff; color:#000; }
        .btn.w:hover  { background:#f0f0f0; transform:translateY(-3px); box-shadow:0 16px 40px rgba(255,255,255,.18); }
        .btn.gh { background:transparent; color:rgba(255,255,255,.5); border:1px solid rgba(255,255,255,.14); }
        .btn.gh:hover { border-color:rgba(255,255,255,.5); color:#fff; transform:translateY(-2px); }

        .nl { background:none; border:none; color:rgba(255,255,255,.4); cursor:pointer; font-size:.88rem; font-family:inherit; padding:.4rem .8rem; transition:color .2s; letter-spacing:.01em; }
        .nl:hover { color:#fff; }

        .cx { height:1px; background:rgba(255,255,255,.07); position:relative; overflow:visible; }
        .cd { position:absolute; top:-3px; width:6px; height:6px; border-radius:50%; background:#e8c547; animation:dotMove 1.8s linear infinite; }

        /* Platform icon container */
        .plat-img-wrap {
          border-radius:30px;
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          will-change:transform,opacity;
        }
        .plat-img-wrap::before {
          content:''; position:absolute; top:0; left:0; right:0; height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,.18) 0%,transparent 100%);
          border-radius:30px 30px 0 0; z-index:2; pointer-events:none;
        }
        .plat-img-wrap::after {
          content:''; position:absolute; inset:0; border-radius:30px;
          border:1px solid rgba(255,255,255,.18); z-index:3; pointer-events:none;
        }

        @media (max-width:768px) {
          .grain { display:none; }
          .nav-mid { display:none !important; }
          .hero-row .ic-wrap { width:58px !important; height:58px !important; border-radius:16px !important; }
          .hero-row .cx-gap { width:10px !important; }
          .hero-row .ilbl { display:none !important; }
          .hh  { font-size:2.4rem !important; }
          .hs  { font-size:.95rem !important; }
          .btns { flex-direction:column !important; width:100% !important; }
          .btns .btn { width:100% !important; text-align:center !important; }
          .tb  { padding:.6rem 1rem !important; font-size:.82rem !important; }
          .pr  { flex-direction:column !important; text-align:center !important; align-items:center !important; }
          .pr.rev { flex-direction:column !important; }
          .big-img { width:150px !important; height:150px !important; border-radius:22px !important; }
          .ph  { font-size:1.75rem !important; }
          .pnum { font-size:6rem !important; }
          .cta-h { font-size:2.2rem !important; }
        }
        @media (max-width:480px) {
          .hh  { font-size:1.95rem !important; }
          .hero-row .ic-wrap { width:46px !important; height:46px !important; }
          .hero-row .cx-gap { width:7px !important; }
          .big-img { width:120px !important; height:120px !important; }
          .ph  { font-size:1.5rem !important; }
          .cta-h { font-size:1.85rem !important; }
          .btn { padding:.85rem 1.5rem !important; font-size:.82rem !important; }
        }
      `}</style>

      <div className="grain" />

      {/* ─── NAV ─── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'1.1rem 2.5rem',
        background: scrolled ? 'rgba(0,0,0,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.05)' : '1px solid transparent',
        transition: 'all .35s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px', cursor:'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width:'28px', height:'28px', background:'#e8c547', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'14px', color:'#000' }}>M</div>
          <span style={{ fontWeight:'800', fontSize:'1.1rem', letterSpacing:'-.03em' }}>Merj</span>
        </div>
        <div className="nav-mid" style={{ display:'flex', gap:'.1rem' }}>
          <button className="nl" onClick={() => router.push('/listings')}>Marketplace</button>
          <button className="nl" onClick={() => router.push('/sell')}>Sell</button>
          <button className="nl">How it works</button>
        </div>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          <button className="nl" onClick={() => router.push('/login')}>Sign in</button>
          <button className="btn g" style={{ padding:'.5rem 1.25rem', fontSize:'.82rem' }} onClick={() => router.push('/login')}>List a site</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'7rem 2rem 5rem', position:'relative', textAlign:'center', overflow:'hidden' }}>

        {/* VIDEO BACKGROUND */}
        {!videoError && (
          <video
            autoPlay muted loop playsInline
            onError={() => setVideoError(true)}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.28, zIndex:0, pointerEvents:'none' }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        )}
        {/* Overlays */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.6) 80%,#000 100%)', zIndex:1 }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,.7) 100%)', zIndex:1 }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, zIndex:1, backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'80px 80px', maskImage:'radial-gradient(ellipse at center top, black 5%, transparent 55%)', WebkitMaskImage:'radial-gradient(ellipse at center top, black 5%, transparent 55%)' }} />
        {/* Purple glow */}
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'380px', background:'radial-gradient(ellipse, rgba(124,58,237,.14) 0%, transparent 70%)', zIndex:1, pointerEvents:'none' }} />

        {/* FLOATING ICONS */}
        <div className="hero-row" style={{ position:'relative', zIndex:3, display:'flex', alignItems:'flex-end', justifyContent:'center', marginBottom:'3rem', gap:0, opacity:heroIn?1:0, transform:heroIn?'none':'translateY(20px)', transition:'opacity .9s ease, transform .9s ease' }}>
          {PLATFORMS.map((p, i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'flex-end' }}>
              {i > 0 && (
                <div className="cx-gap" style={{ width:'22px', marginBottom:'38px' }}>
                  <div className="cx"><div className="cd" style={{ animationDelay:`${i*.5}s` }} /></div>
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', opacity:heroIn?1:0, transition:`opacity .6s ease ${i*120+200}ms` }}>
                <div className="ic-hover ic-wrap" style={{ width:'84px', height:'84px' }}>
                  <FloatIcon p={p} delay={i} size={84} />
                </div>
                <span className="ilbl" style={{ fontSize:'.65rem', color:'rgba(255,255,255,.28)', fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div style={{ position:'relative', zIndex:3, marginBottom:'2rem', opacity:heroIn?1:0, transition:'opacity .9s ease .3s' }}>
          <div className="tog">
            <button className={`tb ${buy?'on':'off'}`} onClick={() => setMode('buy')}>🛒 I want to buy</button>
            <button className={`tb ${!buy?'on':'off'}`} onClick={() => setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{ position:'relative', zIndex:3, maxWidth:'860px', opacity:heroIn?1:0, transition:'opacity 1s ease .4s' }}>
          <div style={{ fontSize:'.68rem', fontWeight:'700', letterSpacing:'.24em', color:'#e8c547', textTransform:'uppercase', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'14px' }}>
            <div style={{ width:'28px', height:'1px', background:'#e8c547' }} />
            Website Acquisition Marketplace
            <div style={{ width:'28px', height:'1px', background:'#e8c547' }} />
          </div>

          <h1 className="hh" style={{ fontSize:'clamp(2.8rem,7.5vw,6rem)', fontWeight:'900', letterSpacing:'-.04em', lineHeight:.96, marginBottom:'1.5rem', transition:'all .4s ease' }}>
            {buy
              ? <><span style={{ color:'rgba(255,255,255,.9)' }}>The place websites</span><br /><span style={{ color:'#e8c547' }}>change hands.</span></>
              : <><span style={{ color:'rgba(255,255,255,.9)' }}>Turn your website</span><br /><span style={{ color:'#e8c547' }}>into money.</span></>
            }
          </h1>

          <p className="hs" style={{ fontSize:'1.08rem', color:'rgba(255,255,255,.38)', lineHeight:1.8, margin:'0 auto 2.5rem', maxWidth:'520px', transition:'all .4s ease' }}>
            {buy
              ? 'Every listing on Merj is ownership-verified before you see it. Pay securely — your money moves only when ownership does.'
              : 'List any live website in minutes. Merj verifies ownership, secures payment, and transfers everything automatically. You just get paid.'
            }
          </p>

          <div className="btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            {buy
              ? <><button className="btn g" onClick={() => router.push('/listings')}>Browse verified websites</button><button className="btn gh" onClick={() => setMode('sell')}>Switch to selling</button></>
              : <><button className="btn w" onClick={() => router.push('/login')}>List your site — free</button><button className="btn gh" onClick={() => setMode('buy')}>Switch to buying</button></>
            }
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'2.25rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', zIndex:3 }}>
          <div style={{ width:'1px', height:'42px', background:'rgba(255,255,255,.12)' }} />
          <span style={{ fontSize:'.6rem', letterSpacing:'.18em', color:'rgba(255,255,255,.18)', textTransform:'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* ─── PLATFORM SCROLL SECTIONS ─── */}
      {PLATFORMS.map((p, i) => {
        const rev = i % 2 !== 0
        return (
          <section
            key={p.id}
            ref={el => { secRefs.current[i] = el }}
            style={{
              padding: '8rem 2rem',
              borderTop: '1px solid rgba(255,255,255,.05)',
              position: 'relative', overflow: 'hidden',
              background: `radial-gradient(ellipse at ${rev ? '75%' : '25%'} 50%, rgba(${p.rgb},.06) 0%, transparent 55%)`,
              minHeight: '600px',
            }}
          >
            {/* Big background number */}
            <div className="pnum" style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', [rev?'right':'left']:'1rem', fontSize:'16rem', fontWeight:'900', color:'rgba(255,255,255,.018)', lineHeight:1, userSelect:'none', letterSpacing:'-.07em', pointerEvents:'none', zIndex:0 }}>
              {p.num}
            </div>

            <div
              className={`pr${rev ? ' rev' : ''}`}
              style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', alignItems:'center', flexDirection:rev?'row-reverse':'row', gap:'4.5rem', position:'relative', zIndex:1 }}
            >
              {/* ICON — GSAP scroll-scrub drop */}
              <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
                <div style={{ position:'relative' }}>
                  {/* Glow shadow beneath icon */}
                  <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'26px', background:p.glow, filter:'blur(24px)', borderRadius:'50%', opacity:.5, animation:'glowPulse 3.5s ease-in-out infinite', pointerEvents:'none' }} />
                  {/* The falling icon */}
                  <div
                    ref={el => { iconRefs.current[i] = el }}
                    className="plat-img-wrap big-img"
                    style={{ width:'220px', height:'220px', background:p.bg, boxShadow:`0 32px 80px ${p.glow}44, inset 0 1px 0 rgba(255,255,255,.2)` }}
                  >
                    {p.img
                      ? <img src={p.img} alt={p.name} style={{ width:'55%', height:'55%', objectFit:'contain', position:'relative', zIndex:4, filter:'drop-shadow(0 4px 16px rgba(0,0,0,.5))' }} />
                      : <svg viewBox="0 0 24 24" width="90" height="90" fill="none" stroke="white" strokeWidth="1.4" style={{ position:'relative', zIndex:4 }}>
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
                          <path d="M2 12h20M2 8h20M2 16h20" strokeOpacity=".5"/>
                          <rect x="2" y="3" width="20" height="14" rx="2" strokeOpacity=".3"/>
                        </svg>
                    }
                  </div>
                </div>
                <span style={{ fontSize:'.7rem', fontWeight:'700', letterSpacing:'.2em', textTransform:'uppercase', color:p.light, whiteSpace:'nowrap' }}>{p.name}</span>
              </div>

              {/* TEXT — GSAP scroll reveal */}
              <div ref={el => { textRefs.current[i] = el }} style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
                  <div style={{ width:'40px', height:'3px', background:p.glow, borderRadius:'2px' }} />
                  <span style={{ fontSize:'.65rem', fontWeight:'700', letterSpacing:'.22em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>{p.num} / 04</span>
                </div>

                <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:'900', letterSpacing:'-.035em', marginBottom:'1.25rem', lineHeight:1.05 }}>
                  {buy ? p.buyH : p.sellH}
                </h2>

                <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.97rem', lineHeight:1.85, marginBottom:'1.75rem', maxWidth:'440px' }}>
                  {buy ? p.buyB : p.sellSub}
                </p>

                {/* Achievement tags */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginBottom:'2rem' }}>
                  {p.achieve.map(tag => (
                    <span key={tag} style={{ padding:'.35rem .9rem', border:`1px solid ${p.glow}44`, borderRadius:'100px', fontSize:'.78rem', color:p.light, fontWeight:'500', background:`rgba(${p.rgb},.08)` }}>
                      ✓ {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="btn"
                  onClick={() => router.push(buy ? '/listings' : '/login')}
                  style={{ background:p.id==='vercel'?'#fff':p.glow, color:'#000', boxShadow:`0 10px 28px ${p.glow}44` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter='brightness(1.1)'; (e.currentTarget as HTMLElement).style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter='none'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' }}
                >
                  {buy ? `Buy ${p.name} →` : `Sell on ${p.name} →`}
                </button>
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── TRUST STRIP ─── */}
      <section style={{ padding:'6rem 2rem', background:'rgba(232,197,71,.025)', borderTop:'1px solid rgba(232,197,71,.07)', borderBottom:'1px solid rgba(232,197,71,.07)' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'3rem' }}>
          {[
            { t:'Ownership verified first', b:"Every listing is confirmed through each platform's official API. Unverified assets don't exist on Merj." },
            { t:'Payment locked on checkout', b:"Buyer's payment is secured at checkout. Neither side can access it until transfer is fully confirmed." },
            { t:'Transfer or full refund', b:"If the transfer doesn't complete for any reason, the buyer gets every cent back. Automatically." },
            { t:'No manual handoffs', b:"Admin access, credentials, and project files all transfer through code. Not email. Not WhatsApp. Code." },
          ].map(item => (
            <div key={item.t} style={{ borderTop:`2px solid rgba(232,197,71,.25)`, paddingTop:'1.5rem' }}>
              <div style={{ width:'24px', height:'2.5px', background:'#e8c547', borderRadius:'2px', marginBottom:'1.25rem' }} />
              <h4 style={{ fontSize:'1rem', fontWeight:'700', marginBottom:'.75rem', letterSpacing:'-.01em' }}>{item.t}</h4>
              <p style={{ color:'rgba(255,255,255,.38)', fontSize:'.88rem', lineHeight:1.75 }}>{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding:'9rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(232,197,71,.06) 0%, transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'.68rem', fontWeight:'700', letterSpacing:'.24em', color:'rgba(255,255,255,.2)', textTransform:'uppercase', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'14px' }}>
            <div style={{ width:'28px', height:'1px', background:'rgba(255,255,255,.2)' }} />
            Start today
            <div style={{ width:'28px', height:'1px', background:'rgba(255,255,255,.2)' }} />
          </div>
          <h2 className="cta-h" style={{ fontSize:'clamp(2.4rem,7vw,5rem)', fontWeight:'900', letterSpacing:'-.04em', marginBottom:'1.25rem', lineHeight:.96 }}>
            Your site has value.<br /><span style={{ color:'#e8c547' }}>{"Let's move it."}</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.3)', fontSize:'1.05rem', margin:'0 auto 2.75rem', maxWidth:'380px', lineHeight:1.75 }}>
            Free to list. No fees until your site sells. Fully automated from listing to payout.
          </p>
          <div className="btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn g" onClick={() => router.push('/login')}>List your site — free</button>
            <button className="btn gh" onClick={() => router.push('/listings')}>Explore the marketplace</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.05)', padding:'2.5rem' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
            <div style={{ width:'22px', height:'22px', background:'#e8c547', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'11px', color:'#000' }}>M</div>
            <span style={{ fontWeight:'700', fontSize:'.95rem', letterSpacing:'-.02em' }}>Merj</span>
          </div>
          <p style={{ color:'rgba(255,255,255,.12)', fontSize:'.78rem' }}>© 2025 Merj · Website acquisition, done right.</p>
          <div style={{ display:'flex', gap:'1.75rem' }}>
            {['Marketplace', 'Sell', 'Sign in'].map(l => (
              <button key={l} onClick={() => router.push(l === 'Marketplace' ? '/listings' : '/login')}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,.18)', cursor:'pointer', fontSize:'.78rem', fontFamily:'inherit', padding:0, transition:'color .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.6)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.18)' }}
              >{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
