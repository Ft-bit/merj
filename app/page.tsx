'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/* ─── SVG ICONS ─── */
const WP = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.931 12c0-1.15.243-2.243.668-3.236L7.898 19.3A8.454 8.454 0 0 1 3.93 12zm8.069 8.47a8.52 8.52 0 0 1-2.42-.352l2.569-7.471 2.634 7.214c.02.045.044.088.067.13a8.504 8.504 0 0 1-2.85.479zm1.18-12.71c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109-.84 0-2.253-.109-2.253-.109-.463-.027-.517.679-.054.707 0 0 .437.054.898.081l1.334 3.655-1.874 5.62L8.11 7.76c.516-.027.98-.081.98-.081.462-.055.408-.734-.054-.707 0 0-1.386.109-2.28.109a9.128 9.128 0 0 1-.56-.017A8.474 8.474 0 0 1 12 3.53c2.234 0 4.27.854 5.797 2.252a3.46 3.46 0 0 0-.246-.009c-.84 0-1.44.73-1.44 1.514 0 .707.407 1.306.842 2.012.326.571.707 1.305.707 2.362 0 .734-.282 1.586-.65 2.77l-.853 2.852zm3.355 11.73-.048-.092 2.605-7.534c.489-1.224.652-2.202.652-3.073 0-.316-.021-.61-.058-.887A8.473 8.473 0 0 1 20.47 12a8.447 8.447 0 0 1-3.934 7.49z"/>
  </svg>
)
const BL = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M20.585 9.463C20.147 9.463 20 9.29 20 8.857V7.143C20 4.303 17.674 2 14.808 2H6.239C3.373 2 1 4.303 1 7.143v9.714C1 19.697 3.326 22 6.192 22h11.616C20.674 22 23 19.697 23 16.857v-4.345c0-1.695-1.019-3.049-2.415-3.049zM8.962 7.393h3.693c.52 0 .942.422.942.941a.942.942 0 0 1-.942.942H8.962a.942.942 0 0 1-.942-.942c0-.519.422-.941.942-.941zm5.885 9.214H8.962a.942.942 0 0 1-.942-.942c0-.52.422-.942.942-.942h5.885c.52 0 .942.422.942.942a.941.941 0 0 1-.942.942z"/>
  </svg>
)
const VC = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M24 22.525H0l12-21.05 12 21.05z"/>
  </svg>
)
const NT = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
    <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.732v1.727l3.488-3.488zm.303 7.462a1.044 1.044 0 0 1-.303.732L12 21.658V19.03l5.237-5.237zM12 2.342l4.934 4.934a1.044 1.044 0 0 1 .303.732v.199L12 13.145V2.342zM5.768 8.028l3.488 3.488V9.789a1.044 1.044 0 0 1 .303-.732L12 6.124V2.342zm0 7.944V14.25l3.791 3.791H5.768zm3.791 5.686L5.768 17.867v-1.727L9.559 19.93zm0-13.658L6.071 4.512A1.044 1.044 0 0 1 7.116 3.3L9.559 5.743zm2.441 11.617L7.116 14.323a1.044 1.044 0 0 1 0-1.476L12 7.963z"/>
  </svg>
)
const GL = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/>
    <path d="M2 12h20M2 8h20M2 16h20" strokeOpacity="0.5"/>
  </svg>
)

const PLATFORMS = [
  {
    id: 'wordpress', name: 'WordPress', num: '01',
    buyH: 'Buy WordPress websites', sellH: 'Sell your WordPress website',
    buyB: 'Acquire established blogs, WooCommerce stores, and business sites. Every listing ownership-verified through the WordPress REST API before you see it.',
    sellB: 'Connect via Application Password. We verify real ownership and execute a full admin handover the moment your site sells — no emails, no trust.',
    bg: 'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)',
    glow: '#0073aa', rgb: '0,115,170', light: '#5bb8f5',
    smI: <WP s={44} />, lgI: <WP s={90} />,
    float: 'f0',
  },
  {
    id: 'blogger', name: 'Blogger', num: '02',
    buyH: 'Buy Blogger blogs', sellH: 'Sell your Blogger blog',
    buyB: 'Find monetized Blogger blogs with real audiences and domain authority. Google Blogger API confirms ownership before any listing appears.',
    sellB: 'Connect via Google OAuth. We verify the blog is yours and transfer access to the buyer automatically — credentials handled by code, not conversation.',
    bg: 'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)',
    glow: '#f57d00', rgb: '245,125,0', light: '#ffb347',
    smI: <BL s={44} />, lgI: <BL s={90} />,
    float: 'f1',
  },
  {
    id: 'vercel', name: 'Vercel', num: '03',
    buyH: 'Buy Vercel projects', sellH: 'Sell your Vercel project',
    buyB: 'Acquire live Next.js apps, SaaS products, and Vercel-hosted projects. Transfer executed directly through the Vercel API — instant and automatic.',
    sellB: 'Authenticate with your Vercel token. When your project sells, the transfer request fires automatically. Buyer has access within minutes.',
    bg: 'linear-gradient(145deg,#2a2a2a,#141414 50%,#000)',
    glow: '#ffffff', rgb: '180,180,180', light: '#ccc',
    smI: <VC s={44} />, lgI: <VC s={90} />,
    float: 'f2',
  },
  {
    id: 'netlify', name: 'Netlify', num: '04',
    buyH: 'Buy Netlify sites', sellH: 'Sell your Netlify site',
    buyB: 'Find deployed Netlify sites across every niche. All listings verified via the Netlify API. Ownership transferred through their platform, not through you.',
    sellB: 'Link your Netlify account. Merj handles end-to-end ownership transfer. You never hand credentials to a stranger — the system does it for you.',
    bg: 'linear-gradient(145deg,#00d4c2,#00c7b7 50%,#009e91)',
    glow: '#00c7b7', rgb: '0,199,183', light: '#4de8de',
    smI: <NT s={44} />, lgI: <NT s={90} />,
    float: 'f3',
  },
  {
    id: 'custom', name: 'Any Live Website', num: '05',
    buyH: 'Buy any live website', sellH: 'Sell any live website',
    buyB: 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, Squarespace, or a custom-hosted app with a live URL — all on one marketplace.',
    sellB: 'Got a live domain? List it on Merj. We support every major platform and any custom-hosted site. More connectors ship every month.',
    bg: 'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)',
    glow: '#7c3aed', rgb: '124,58,237', light: '#a78bfa',
    smI: <GL s={44} />, lgI: <GL s={90} />,
    float: 'f4',
  },
]

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4'

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'buy'|'sell'>('buy')
  const [scrolled, setScrolled] = useState(false)
  const [heroIn, setHeroIn] = useState(false)
  const iconRefs = useRef<(HTMLDivElement|null)[]>([])
  const textRefs = useRef<(HTMLDivElement|null)[]>([])
  const secRefs  = useRef<(HTMLDivElement|null)[]>([])
  const buy = mode === 'buy'

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  /* ─── GSAP SCROLL SCRUB ─── */
  useEffect(() => {
    let killed = false
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (killed) return
      gsap.registerPlugin(ScrollTrigger)

      iconRefs.current.forEach((icon, i) => {
        const sec = secRefs.current[i]
        if (!icon || !sec) return
        gsap.fromTo(icon,
          { y: -360, scale: 0.15, rotation: -22, opacity: 0, willChange: 'transform,opacity' },
          { y: 0, scale: 1, rotation: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 95%', end: 'top 20%', scrub: 1.8 }
          }
        )
      })

      textRefs.current.forEach((txt, i) => {
        const sec = secRefs.current[i]
        if (!txt || !sec) return
        gsap.fromTo(txt,
          { opacity: 0, y: 60, willChange: 'transform,opacity' },
          { opacity: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 25%', scrub: 1.2 }
          }
        )
      })

      ScrollTrigger.refresh()
    }
    init()
    return () => {
      killed = true
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(t => t.kill())
      }).catch(() => {})
    }
  }, [])

  return (
    <div style={{ background:'#000', color:'#fff', fontFamily:'"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX:'hidden', minHeight:'100vh' }}>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}

        /* float animations */
        @keyframes f0{0%,100%{transform:rotate(-5deg) translateY(0)}50%{transform:rotate(-5deg) translateY(-10px)}}
        @keyframes f1{0%,100%{transform:rotate(-2deg) translateY(0)}50%{transform:rotate(-2deg) translateY(-14px)}}
        @keyframes f2{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(0deg) translateY(-16px)}}
        @keyframes f3{0%,100%{transform:rotate(2deg) translateY(0)}50%{transform:rotate(2deg) translateY(-12px)}}
        @keyframes f4{0%,100%{transform:rotate(5deg) translateY(0)}50%{transform:rotate(5deg) translateY(-9px)}}

        @keyframes dotMove{0%{left:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:100%;opacity:0}}
        @keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-1%,-2%)}75%{transform:translate(1%,2%)}}
        @keyframes heroFade{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:.9}}

        /* icon card glass effect */
        .ic{border-radius:22px;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;transition:filter .3s,transform .3s;transform:translate3d(0,0,0)}
        .ic::before{content:'';position:absolute;top:0;left:0;right:0;height:52%;background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%);border-radius:22px 22px 0 0;z-index:2;pointer-events:none}
        .ic::after{content:'';position:absolute;inset:0;border-radius:22px;border:1px solid rgba(255,255,255,.2);z-index:3;pointer-events:none}
        .ic:hover{filter:brightness(1.25) saturate(1.1);transform:translate3d(0,-6px,0) scale(1.04)}

        .big-ic{border-radius:30px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;transform:translate3d(0,0,0)}
        .big-ic::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.2) 0%,transparent 100%);border-radius:30px 30px 0 0;z-index:2;pointer-events:none}
        .big-ic::after{content:'';position:absolute;inset:0;border-radius:30px;border:1px solid rgba(255,255,255,.18);z-index:3;pointer-events:none}

        /* toggle */
        .tog{display:inline-flex;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);padding:5px;gap:4px}
        .tb{border:none;border-radius:100px;padding:.7rem 2rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1);font-family:inherit;white-space:nowrap;letter-spacing:.01em}
        .tb.on{background:#e8c547;color:#000;box-shadow:0 6px 24px rgba(232,197,71,.4);transform:scale(1.04)}
        .tb.off{background:transparent;color:rgba(255,255,255,.35)}
        .tb.off:hover{color:rgba(255,255,255,.8)}

        /* buttons */
        .bg{border:none;border-radius:6px;padding:1rem 2.5rem;font-size:.93rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;text-transform:uppercase;transition:all .25s;display:inline-flex;align-items:center;gap:8px}
        .bg.gld{background:#e8c547;color:#000}
        .bg.gld:hover{background:#f0d060;transform:translateY(-3px);box-shadow:0 16px 40px rgba(232,197,71,.35)}
        .bg.wht{background:#fff;color:#000}
        .bg.wht:hover{background:#f0f0f0;transform:translateY(-3px);box-shadow:0 16px 40px rgba(255,255,255,.18)}
        .bg.gh{background:transparent;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.14)}
        .bg.gh:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-2px)}

        /* nav link */
        .nl{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:.88rem;font-family:inherit;padding:.4rem .8rem;transition:color .2s;letter-spacing:.01em}
        .nl:hover{color:#fff}

        /* connector */
        .cx{height:1px;background:rgba(255,255,255,.08);position:relative;overflow:visible}
        .cd{position:absolute;top:-3px;width:6px;height:6px;border-radius:50%;background:#e8c547;animation:dotMove 1.8s linear infinite}

        /* grain */
        .grain{position:fixed;inset:-50%;width:200%;height:200%;opacity:.022;pointer-events:none;z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation:grain .35s steps(1) infinite}

        /* responsive */
        @media(max-width:1024px){
          .plat-row{gap:2.5rem !important}
        }
        @media(max-width:768px){
          .grain{display:none}
          .hero-icons .ic{width:58px !important;height:58px !important;border-radius:16px !important}
          .hero-icons .cx-w{width:12px !important}
          .ilbl{display:none !important}
          .hh{font-size:2.5rem !important;line-height:1.05 !important}
          .hsub{font-size:.95rem !important}
          .btns{flex-direction:column !important;width:100% !important}
          .btns .bg{width:100% !important;justify-content:center !important}
          .tb{padding:.6rem 1.1rem !important;font-size:.82rem !important}
          .plat-row{flex-direction:column !important;text-align:center !important;align-items:center !important}
          .plat-row.rev{flex-direction:column !important}
          .plat-big{width:140px !important;height:140px !important;border-radius:24px !important}
          .ph{font-size:1.75rem !important}
          .how-g{grid-template-columns:1fr !important}
          .stat-g{grid-template-columns:1fr 1fr !important}
          .nav-mid{display:none !important}
          .cta-h{font-size:2.2rem !important}
          .plat-num{font-size:6rem !important}
        }
        @media(max-width:480px){
          .hh{font-size:2rem !important}
          .hero-icons .ic{width:46px !important;height:46px !important}
          .hero-icons .cx-w{width:8px !important}
          .plat-big{width:110px !important;height:110px !important}
          .ph{font-size:1.5rem !important}
          .cta-h{font-size:1.9rem !important}
          .bg{padding:.85rem 1.75rem !important;font-size:.82rem !important}
        }
      `}</style>

      <div className="grain" />

      {/* ─── NAV ─── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'1.1rem 2.5rem',
        background: scrolled ? 'rgba(0,0,0,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition:'all .35s ease',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'9px',cursor:'pointer'}} onClick={()=>router.push('/')}>
          <div style={{width:'28px',height:'28px',background:'#e8c547',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px',color:'#000',letterSpacing:'-.04em'}}>M</div>
          <span style={{fontWeight:'800',fontSize:'1.1rem',letterSpacing:'-.03em'}}>Merj</span>
        </div>

        <div className="nav-mid" style={{display:'flex',gap:'.1rem'}}>
          <button className="nl" onClick={()=>router.push('/listings')}>Marketplace</button>
          <button className="nl" onClick={()=>router.push('/sell')}>Sell</button>
          <button className="nl">How it works</button>
        </div>

        <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
          <button className="nl" onClick={()=>router.push('/login')}>Sign in</button>
          <button className="bg gld" style={{padding:'.52rem 1.25rem',fontSize:'.82rem'}} onClick={()=>router.push('/login')}>
            List a site
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'7rem 2rem 5rem',position:'relative',textAlign:'center',overflow:'hidden'}}>

        {/* VIDEO BACKGROUND */}
        <div style={{position:'absolute',inset:0,zIndex:0,overflow:'hidden'}}>
          <video autoPlay muted loop playsInline
            style={{width:'100%',height:'100%',objectFit:'cover',opacity:.18,transform:'scale(1.05)'}}
          >
            <source src={VIDEO_URL} type="video/mp4"/>
          </video>
          {/* Gradient overlays */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,1) 100%)'}} />
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)'}} />
        </div>

        {/* Grid */}
        <div style={{position:'absolute',inset:0,zIndex:1,backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse at center top, black 10%, transparent 60%)',WebkitMaskImage:'radial-gradient(ellipse at center top, black 10%, transparent 60%)'}} />

        {/* Purple glow */}
        <div style={{position:'absolute',top:'-8%',left:'50%',transform:'translateX(-50%)',width:'900px',height:'400px',background:'radial-gradient(ellipse, rgba(124,58,237,.12) 0%, transparent 70%)',pointerEvents:'none',zIndex:1}} />

        {/* HERO ICON ROW */}
        <div
          className="hero-icons"
          style={{position:'relative',zIndex:3,display:'flex',alignItems:'flex-end',justifyContent:'center',marginBottom:'3rem',gap:'0',opacity:heroIn?1:0,transform:heroIn?'translateY(0)':'translateY(20px)',transition:'opacity .9s ease, transform .9s ease'}}
        >
          {PLATFORMS.map((p, i) => (
            <div key={p.id} style={{display:'flex',alignItems:'flex-end'}}>
              {i > 0 && (
                <div className="cx-w" style={{width:'24px',marginBottom:'38px'}}>
                  <div className="cx" style={{width:'100%'}}>
                    <div className="cd" style={{animationDelay:`${i*.45}s`}} />
                  </div>
                </div>
              )}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',animation:`${p.float} ${3.8+i*.25}s ease-in-out ${i*130}ms infinite`,opacity:heroIn?1:0,transition:`opacity .7s ease ${i*100+200}ms`}}>
                <div
                  className="ic"
                  style={{width:'86px',height:'86px',background:p.bg,boxShadow:`0 20px 50px ${p.glow}55, 0 8px 20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.22)`}}
                  onClick={()=>router.push('/listings')}
                >
                  <div style={{position:'relative',zIndex:4,filter:'drop-shadow(0 2px 10px rgba(0,0,0,.5))'}}>{p.smI}</div>
                </div>
                <span className="ilbl" style={{fontSize:'.65rem',color:'rgba(255,255,255,.28)',fontWeight:'600',letterSpacing:'.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div style={{position:'relative',zIndex:3,marginBottom:'2rem',opacity:heroIn?1:0,transition:'opacity .9s ease .3s'}}>
          <div className="tog">
            <button className={`tb ${buy?'on':'off'}`} onClick={()=>setMode('buy')}>🛒 I want to buy</button>
            <button className={`tb ${!buy?'on':'off'}`} onClick={()=>setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{position:'relative',zIndex:3,maxWidth:'860px',opacity:heroIn?1:0,transition:'opacity 1s ease .4s'}}>
          <div style={{fontSize:'.7rem',fontWeight:'700',letterSpacing:'.25em',color:'#e8c547',textTransform:'uppercase',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'14px'}}>
            <div style={{width:'28px',height:'1px',background:'#e8c547'}} />
            Website Acquisition Marketplace
            <div style={{width:'28px',height:'1px',background:'#e8c547'}} />
          </div>

          <h1 className="hh" style={{fontSize:'clamp(2.8rem,7.5vw,6rem)',fontWeight:'900',letterSpacing:'-.04em',lineHeight:'.97',marginBottom:'1.5rem',transition:'all .4s ease'}}>
            {buy
              ? <><span style={{color:'rgba(255,255,255,.9)'}}>Find your next</span><br /><span style={{color:'#e8c547'}}>website.</span><span style={{color:'rgba(255,255,255,.9)'}}> Own it safely.</span></>
              : <><span style={{color:'rgba(255,255,255,.9)'}}>List your website.</span><br /><span style={{color:'#e8c547'}}>Get paid</span><span style={{color:'rgba(255,255,255,.9)'}}> automatically.</span></>
            }
          </h1>

          <p className="hsub" style={{fontSize:'1.05rem',color:'rgba(255,255,255,.38)',lineHeight:1.8,margin:'0 auto 2.5rem',maxWidth:'520px',transition:'all .4s ease'}}>
            {buy
              ? 'Browse verified WordPress sites, Blogger blogs, Vercel projects, and any live website. Payment is secured before a single file moves.'
              : 'Connect your site, set your price, and let Merj execute the sale end-to-end. Ownership transfers automatically. You just get paid.'
            }
          </p>

          <div className="btns" style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            {buy
              ? <><button className="bg gld" onClick={()=>router.push('/listings')}>Browse websites</button><button className="bg gh" onClick={()=>setMode('sell')}>Switch to selling</button></>
              : <><button className="bg wht" onClick={()=>router.push('/login')}>List your site — free</button><button className="bg gh" onClick={()=>setMode('buy')}>Switch to buying</button></>
            }
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{position:'absolute',bottom:'2.25rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',zIndex:3}}>
          <div style={{width:'1px',height:'40px',background:'rgba(255,255,255,.12)'}} />
          <span style={{fontSize:'.6rem',letterSpacing:'.18em',color:'rgba(255,255,255,.18)',textTransform:'uppercase'}}>Scroll</span>
        </div>
      </section>

      {/* ─── PLATFORM SECTIONS ─── */}
      {PLATFORMS.map((p, i) => {
        const rev = i % 2 !== 0
        return (
          <section
            key={p.id}
            ref={el => { secRefs.current[i] = el }}
            style={{
              padding:'7rem 2rem',
              borderTop:'1px solid rgba(255,255,255,.05)',
              position:'relative',
              overflow:'hidden',
              background:`radial-gradient(ellipse at ${rev?'80%':'20%'} 50%, rgba(${p.rgb},.05) 0%, transparent 60%)`,
            }}
          >
            {/* Big editorial number in background */}
            <div className="plat-num" style={{position:'absolute',top:'50%',transform:'translateY(-50%)',left:rev?'auto':'2rem',right:rev?'2rem':'auto',fontSize:'14rem',fontWeight:'900',color:'rgba(255,255,255,.025)',lineHeight:1,userSelect:'none',letterSpacing:'-.06em',pointerEvents:'none',zIndex:0}}>
              {p.num}
            </div>

            <div
              className={`plat-row${rev?' rev':''}`}
              style={{maxWidth:'1060px',margin:'0 auto',display:'flex',alignItems:'center',flexDirection:rev?'row-reverse':'row',gap:'4rem',position:'relative',zIndex:1}}
            >
              {/* ICON — animated by GSAP */}
              <div style={{flex:'0 0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
                <div style={{position:'relative'}}>
                  {/* Shadow glow */}
                  <div style={{position:'absolute',bottom:'-20px',left:'50%',transform:'translateX(-50%)',width:'160px',height:'28px',background:p.glow,filter:'blur(22px)',borderRadius:'50%',opacity:.55,animation:'pulse 3.5s ease-in-out infinite'}} />
                  {/* Falling icon */}
                  <div
                    ref={el => { iconRefs.current[i] = el }}
                    className="big-ic plat-big"
                    style={{width:'210px',height:'210px',background:p.bg,boxShadow:`0 30px 80px ${p.glow}44, 0 0 0 1px rgba(255,255,255,.1), inset 0 1px 0 rgba(255,255,255,.2)`,willChange:'transform,opacity'}}
                  >
                    <div style={{position:'relative',zIndex:4,filter:'drop-shadow(0 4px 18px rgba(0,0,0,.5))'}}>{p.lgI}</div>
                  </div>
                </div>
                <span style={{fontSize:'.7rem',fontWeight:'700',letterSpacing:'.2em',textTransform:'uppercase',color:p.light,whiteSpace:'nowrap',marginTop:'8px'}}>{p.name}</span>
              </div>

              {/* TEXT — animated by GSAP */}
              <div ref={el => { textRefs.current[i] = el }} style={{flex:1,willChange:'transform,opacity'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.5rem'}}>
                  <div style={{width:'40px',height:'3px',background:p.glow,borderRadius:'2px'}} />
                  <span style={{fontSize:'.68rem',fontWeight:'700',letterSpacing:'.2em',color:'rgba(255,255,255,.3)',textTransform:'uppercase'}}>{p.num} / 05</span>
                </div>
                <h2 className="ph" style={{fontSize:'clamp(1.9rem,4.5vw,3rem)',fontWeight:'900',letterSpacing:'-.035em',marginBottom:'1.25rem',lineHeight:1.05}}>
                  {buy ? p.buyH : p.sellH}
                </h2>
                <p style={{color:'rgba(255,255,255,.42)',fontSize:'1rem',lineHeight:1.85,marginBottom:'2.25rem',maxWidth:'440px'}}>
                  {buy ? p.buyB : p.sellB}
                </p>

                <div style={{display:'flex',gap:'.85rem',flexWrap:'wrap',alignItems:'center'}}>
                  <button
                    className="bg"
                    onClick={()=>router.push(buy?'/listings':'/login')}
                    style={{background:p.id==='vercel'?'#fff':p.glow,color:'#000',boxShadow:`0 10px 28px ${p.glow}44`}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.filter='brightness(1.12)';(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.filter='none';(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}
                  >
                    {buy ? `Buy ${p.name} →` : `Sell on ${p.name} →`}
                  </button>
                  <span style={{fontSize:'.8rem',color:'rgba(255,255,255,.22)',letterSpacing:'.04em'}}>API-verified ownership</span>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── HOW IT WORKS — EDITORIAL ─── */}
      <section style={{padding:'8rem 2rem',borderTop:'1px solid rgba(255,255,255,.05)',background:'#050505'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'2rem',marginBottom:'5rem',borderBottom:'1px solid rgba(255,255,255,.06)',paddingBottom:'2rem'}}>
            <div>
              <div style={{fontSize:'.68rem',fontWeight:'700',letterSpacing:'.22em',color:'rgba(255,255,255,.25)',textTransform:'uppercase',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'20px',height:'1px',background:'rgba(255,255,255,.25)'}} />
                The process
              </div>
              <h2 style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:'900',letterSpacing:'-.04em',lineHeight:1.02}}>
                Simple for both sides.<br /><span style={{color:'rgba(255,255,255,.3)'}}>Airtight for everyone.</span>
              </h2>
            </div>
            <p style={{color:'rgba(255,255,255,.3)',fontSize:'.9rem',maxWidth:'280px',lineHeight:1.75}}>
              Three steps. Every transaction. No exceptions. No manual handoffs.
            </p>
          </div>

          <div className="how-g" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'2px',borderRadius:'16px',overflow:'hidden',background:'rgba(255,255,255,.04)'}}>
            {[
              {n:'01',e:'🔗',t:'Verify & List',b:"Connect via any platform integration. We check real ownership through each platform's official API. Unverified listings don't exist on Merj."},
              {n:'02',e:'🔒',t:'Payment secured',b:"Buyer checks out via Stripe. Their payment is locked — neither side can touch it until transfer completes. No trust required."},
              {n:'03',e:'⚡',t:'Transfer. Then payment.',b:"Admin access, credentials, and project files move automatically through code. Only after confirmation does the seller get paid."},
            ].map(s=>(
              <div key={s.n} style={{background:'#0a0a0a',padding:'2.75rem 2rem',position:'relative',overflow:'hidden',transition:'background .25s'}}>
                <div style={{position:'absolute',top:'.5rem',right:'1rem',fontSize:'5rem',fontWeight:'900',color:'rgba(255,255,255,.03)',lineHeight:1,userSelect:'none',letterSpacing:'-.05em'}}>{s.n}</div>
                <div style={{fontSize:'1.75rem',marginBottom:'1rem'}}>{s.e}</div>
                <div style={{width:'24px',height:'2.5px',background:'#e8c547',borderRadius:'2px',marginBottom:'1.1rem'}} />
                <h3 style={{fontSize:'1rem',fontWeight:'700',marginBottom:'.75rem',letterSpacing:'-.01em'}}>{s.t}</h3>
                <p style={{color:'rgba(255,255,255,.37)',fontSize:'.88rem',lineHeight:1.8}}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST SECTION ─── */}
      <section style={{padding:'6rem 2rem',background:'rgba(232,197,71,.03)',borderTop:'1px solid rgba(232,197,71,.07)',borderBottom:'1px solid rgba(232,197,71,.07)'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'3rem'}}>
          {[
            {t:'Ownership verified',b:"Every listing is confirmed through each platform's official API. If we can't verify it, it doesn't list."},
            {t:'Payment locked first',b:"Buyer money is secured the moment checkout completes. It can't be touched until transfer is confirmed."},
            {t:'Transfer or full refund',b:"If the transfer doesn't complete for any reason, the buyer gets every cent back. Automatically."},
            {t:'Zero manual handoffs',b:"The entire ownership transfer — admin access, credentials, project files — is executed by code. Not people."},
          ].map(item=>(
            <div key={item.t} style={{borderTop:'1px solid rgba(232,197,71,.2)',paddingTop:'1.5rem'}}>
              <div style={{width:'24px',height:'2.5px',background:'#e8c547',borderRadius:'2px',marginBottom:'1.25rem'}} />
              <h4 style={{fontSize:'1rem',fontWeight:'700',marginBottom:'.75rem',letterSpacing:'-.01em'}}>{item.t}</h4>
              <p style={{color:'rgba(255,255,255,.38)',fontSize:'.88rem',lineHeight:1.75}}>{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{padding:'4rem 2rem',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
        <div className="stat-g" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'2px',borderRadius:'12px',overflow:'hidden',background:'rgba(255,255,255,.04)',maxWidth:'1060px',margin:'0 auto'}}>
          {[
            {v:'Any platform',l:'If it has a live URL'},
            {v:'100% Automatic',l:'No manual handoffs'},
            {v:'Transfer first',l:'Pay only on success'},
            {v:'Free to list',l:'Commission on sale only'},
          ].map(s=>(
            <div key={s.l} style={{background:'#040404',padding:'2.25rem 1.5rem',textAlign:'center',transition:'background .2s'}}>
              <div style={{fontSize:'1.05rem',fontWeight:'800',color:'#e8c547',marginBottom:'.4rem',letterSpacing:'-.01em'}}>{s.v}</div>
              <div style={{fontSize:'.77rem',color:'rgba(255,255,255,.25)',fontWeight:'500',letterSpacing:'.03em'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{padding:'9rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, rgba(232,197,71,.07) 0%, transparent 55%)'}} />
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:'.68rem',fontWeight:'700',letterSpacing:'.22em',color:'rgba(255,255,255,.2)',textTransform:'uppercase',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'14px'}}>
            <div style={{width:'28px',height:'1px',background:'rgba(255,255,255,.2)'}} />
            Get started today
            <div style={{width:'28px',height:'1px',background:'rgba(255,255,255,.2)'}} />
          </div>
          <h2 className="cta-h" style={{fontSize:'clamp(2.4rem,7vw,5rem)',fontWeight:'900',letterSpacing:'-.04em',marginBottom:'1.25rem',lineHeight:.97}}>
            Your site has value.<br /><span style={{color:'#e8c547'}}>{"Let's move it."}</span>
          </h2>
          <p style={{color:'rgba(255,255,255,.3)',fontSize:'1.05rem',margin:'0 auto 2.75rem',maxWidth:'380px',lineHeight:1.75}}>
            Free to list. No fees until your site sells. Fully automated from listing to payout.
          </p>
          <div className="btns" style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button className="bg gld" onClick={()=>router.push('/login')}>List your site — free</button>
            <button className="bg gh" onClick={()=>router.push('/listings')}>Explore the marketplace</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,.05)',padding:'2.5rem 2.5rem'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
            <div style={{width:'22px',height:'22px',background:'#e8c547',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'11px',color:'#000'}}>M</div>
            <span style={{fontWeight:'700',fontSize:'.95rem',letterSpacing:'-.02em'}}>Merj</span>
          </div>
          <p style={{color:'rgba(255,255,255,.12)',fontSize:'.78rem'}}>© 2025 Merj · Website acquisition, done right.</p>
          <div style={{display:'flex',gap:'1.75rem'}}>
            {['Marketplace','Sell','Sign in'].map(l=>(
              <button key={l}
                onClick={()=>router.push(l==='Marketplace'?'/listings':'/login')}
                style={{background:'none',border:'none',color:'rgba(255,255,255,.18)',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit',letterSpacing:'.02em',transition:'color .2s',padding:0}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.6)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.18)'}}
              >{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
