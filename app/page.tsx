/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4'

const PLATFORMS = [
  {
    id: 'wordpress', name: 'WordPress', num: '01',
    img: '/images/wp.png',
    buyH: 'Buy or list your WordPress website',
    buyB: 'Acquire established blogs, WooCommerce stores, and business sites. Ownership verified through the WordPress REST API before you see a single listing.',
    sellH: 'Sell your WordPress website today',
    sellB: 'Connect via Application Password. We verify real ownership and execute a full admin handover automatically. You get paid. Buyer gets access.',
    achieve: ['Verified admin handover', 'WooCommerce & blogs', 'Automated credentials'],
    bg: 'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)',
    glow: '#0073aa', rgb: '0,115,170', light: '#5bb8f5',
  },
  {
    id: 'blogger', name: 'Blogger', num: '02',
    img: '/images/blogger.png',
    buyH: 'Buy or list your Blogger website',
    buyB: 'Find monetized Blogger blogs with real audiences. Google Blogger API confirms every listing before it goes live on Merj.',
    sellH: 'Sell your Blogger blog today',
    sellB: 'Connect via Google OAuth. We verify ownership and transfer blog access to the buyer through the Blogger API automatically.',
    achieve: ['Google API verified', 'Real audience metrics', 'Instant credential handoff'],
    bg: 'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)',
    glow: '#f57d00', rgb: '245,125,0', light: '#ffb347',
  },
  {
    id: 'vercel', name: 'Vercel', num: '03',
    img: '/images/vc.png',
    buyH: 'Buy or list your Vercel project',
    buyB: 'Acquire live Next.js apps, SaaS tools, and Vercel-deployed projects. Transfer executes directly through the Vercel API.',
    sellH: 'Sell your Vercel project today',
    sellB: 'Authenticate with your Vercel token. Transfer request fires automatically when your project sells.',
    achieve: ['Vercel API transfer', 'Next.js & SaaS apps', 'Domain included'],
    bg: 'linear-gradient(145deg,#1a1a1a,#0a0a0a 50%,#000)',
    glow: '#888', rgb: '150,150,150', light: '#ccc',
  },
  {
    id: 'custom', name: 'Any Website', num: '04',
    img: null as string | null,
    buyH: 'Buy or list any live website',
    buyB: 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, locally hosted apps — every platform, one marketplace.',
    sellH: 'Sell any live website today',
    sellB: 'Got a live URL? List it on Merj. We support every major hosting platform and any custom-hosted site.',
    achieve: ['Every platform welcome', 'Custom domains', 'Local hosted apps'],
    bg: 'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)',
    glow: '#7c3aed', rgb: '124,58,237', light: '#a78bfa',
  },
]

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [scrolled, setScrolled] = useState(false)
  const [heroIn, setHeroIn] = useState(false)
  const [videoErr, setVideoErr] = useState(false)
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const secRefs = useRef<(HTMLDivElement | null)[]>([])
  const buy = mode === 'buy'

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id
            if (id) setVisible(prev => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.15 }
    )
    secRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: 'hidden' }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes dotMove{0%{left:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:100%;opacity:0}}
        @keyframes grain{0%,100%{transform:translate(0,0)}33%{transform:translate(-1%,-2%)}66%{transform:translate(1%,1%)}}
        @keyframes glowP{0%,100%{opacity:.4}50%{opacity:.85}}
        @keyframes iconDrop{
          0%{opacity:0;transform:translateY(-180px) scale(0.2) rotate(-18deg)}
          60%{opacity:1;transform:translateY(10px) scale(1.04) rotate(1deg)}
          80%{transform:translateY(-4px) scale(0.97) rotate(-.5deg)}
          100%{opacity:1;transform:translateY(0) scale(1) rotate(0deg)}
        }
        @keyframes textIn{
          from{opacity:0;transform:translateY(40px)}
          to{opacity:1;transform:translateY(0)}
        }
        .grain{position:fixed;inset:-50%;width:200%;height:200%;opacity:.022;pointer-events:none;z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation:grain .35s steps(1) infinite}
        .ic{border-radius:22px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:pointer;transition:filter .3s,transform .3s;animation:floatUp 3.8s ease-in-out infinite}
        .ic::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%);border-radius:22px 22px 0 0;z-index:2;pointer-events:none}
        .ic::after{content:'';position:absolute;inset:0;border-radius:22px;border:1px solid rgba(255,255,255,.2);z-index:3;pointer-events:none}
        .ic:hover{filter:brightness(1.25);transform:translateY(-6px) scale(1.04)}
        .pc{border-radius:30px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .pc::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.18) 0%,transparent 100%);border-radius:30px 30px 0 0;z-index:2;pointer-events:none}
        .pc::after{content:'';position:absolute;inset:0;border-radius:30px;border:1px solid rgba(255,255,255,.18);z-index:3;pointer-events:none}
        .tog{display:inline-flex;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);padding:5px;gap:4px}
        .tb{border:none;border-radius:100px;padding:.72rem 2rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1);font-family:inherit;white-space:nowrap}
        .tb.on{background:#e8c547;color:#000;box-shadow:0 6px 24px rgba(232,197,71,.4);transform:scale(1.04)}
        .tb.off{background:transparent;color:rgba(255,255,255,.35)}
        .tb.off:hover{color:rgba(255,255,255,.8)}
        .btn{border:none;border-radius:7px;padding:1rem 2.5rem;font-size:.9rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
        .btn.g{background:#e8c547;color:#000}
        .btn.g:hover{background:#f0d060;transform:translateY(-3px);box-shadow:0 16px 40px rgba(232,197,71,.35)}
        .btn.w{background:#fff;color:#000}
        .btn.w:hover{background:#f0f0f0;transform:translateY(-3px)}
        .btn.gh{background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.14)}
        .btn.gh:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-2px)}
        .nl{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:.88rem;font-family:inherit;padding:.4rem .8rem;transition:color .2s}
        .nl:hover{color:#fff}
        .cx{height:1px;background:rgba(255,255,255,.07);position:relative;overflow:visible}
        .cd{position:absolute;top:-3px;width:6px;height:6px;border-radius:50%;background:#e8c547;animation:dotMove 1.8s linear infinite}
        .pb{border:none;border-radius:7px;padding:.95rem 2.25rem;font-size:.88rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
        .pb:hover{filter:brightness(1.1);transform:translateY(-3px)}
        .icon-drop{opacity:0;transform:translateY(-180px) scale(0.2) rotate(-18deg)}
        .icon-drop.show{animation:iconDrop .9s cubic-bezier(.34,1.56,.64,1) forwards}
        .txt-in{opacity:0;transform:translateY(40px)}
        .txt-in.show{animation:textIn .7s ease .4s forwards}
        @media(max-width:768px){
          .grain,.nmid{display:none !important}
          .ic{width:58px !important;height:58px !important;border-radius:16px !important}
          .cxg{width:10px !important}.ilbl{display:none !important}
          .hh{font-size:2.4rem !important}.hs{font-size:.95rem !important}
          .btns{flex-direction:column !important;width:100% !important}
          .btns .btn,.btns .pb{width:100% !important}
          .tb{padding:.6rem 1rem !important;font-size:.82rem !important}
          .pr,.pr.rev{flex-direction:column !important;text-align:center !important;align-items:center !important}
          .pc{width:150px !important;height:150px !important}
          .ph{font-size:1.75rem !important}
          .ctah{font-size:2.2rem !important}
        }
        @media(max-width:480px){
          .hh{font-size:1.95rem !important}
          .ic{width:46px !important;height:46px !important}
          .cxg{width:7px !important}
          .pc{width:120px !important;height:120px !important}
        }
      `}</style>

      <div className="grain" />

      {/* NAV */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.1rem 2.5rem',background:scrolled?'rgba(0,0,0,.94)':'transparent',backdropFilter:scrolled?'blur(24px)':'none',borderBottom:scrolled?'1px solid rgba(255,255,255,.05)':'1px solid transparent',transition:'all .35s ease' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'9px',cursor:'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width:'28px',height:'28px',background:'#e8c547',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px',color:'#000' }}>M</div>
          <span style={{ fontWeight:'800',fontSize:'1.1rem',letterSpacing:'-.03em' }}>Merj</span>
        </div>
        <div className="nmid" style={{ display:'flex',gap:'.1rem' }}>
          <button className="nl">Marketplace</button>
          <button className="nl">Sell</button>
          <button className="nl">How it works</button>
        </div>
        <div style={{ display:'flex',gap:'.75rem',alignItems:'center' }}>
          <button className="nl" onClick={() => router.push('/login')}>Sign in</button>
          <button className="btn g" style={{ padding:'.5rem 1.25rem',fontSize:'.82rem' }} onClick={() => router.push('/login')}>List a site</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'7rem 2rem 5rem',position:'relative',textAlign:'center',overflow:'hidden' }}>
        {!videoErr && (
          <video autoPlay muted loop playsInline onError={() => setVideoErr(true)} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.28,zIndex:0,pointerEvents:'none' }}>
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        )}
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.65) 80%,#000 100%)',zIndex:1 }} />
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,.7) 100%)',zIndex:1 }} />
        <div style={{ position:'absolute',inset:0,zIndex:1,backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse at center top, black 5%, transparent 55%)',WebkitMaskImage:'radial-gradient(ellipse at center top, black 5%, transparent 55%)' }} />
        <div style={{ position:'absolute',top:'-5%',left:'50%',transform:'translateX(-50%)',width:'900px',height:'380px',background:'radial-gradient(ellipse, rgba(124,58,237,.14) 0%, transparent 70%)',zIndex:1,pointerEvents:'none' }} />

        {/* ICON ROW */}
        <div style={{ position:'relative',zIndex:3,display:'flex',alignItems:'flex-end',justifyContent:'center',marginBottom:'3rem',gap:0,opacity:heroIn?1:0,transform:heroIn?'none':'translateY(20px)',transition:'opacity .9s ease, transform .9s ease' }}>
          {PLATFORMS.map((p, i) => (
            <div key={p.id} style={{ display:'flex',alignItems:'flex-end' }}>
              {i > 0 && (
                <div className="cxg" style={{ width:'22px',marginBottom:'38px' }}>
                  <div className="cx"><div className="cd" style={{ animationDelay:`${i*.5}s` }} /></div>
                </div>
              )}
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',opacity:heroIn?1:0,transition:`opacity .6s ease ${i*120+200}ms` }}>
                <div className="ic" style={{ width:'84px',height:'84px',background:p.bg,boxShadow:`0 20px 50px ${p.glow}55, inset 0 1px 0 rgba(255,255,255,.22)`,animationDelay:`${i*.3}s`,animationDuration:`${3.5+i*.3}s` }}>
                  <div style={{ position:'relative',zIndex:4 }}>
                    {p.img
                      ? <img src={p.img} alt={p.name} width={50} height={50} style={{ objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,.5))',display:'block' }} />
                      : <svg viewBox="0 0 24 24" width={46} height={46} fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/><path d="M2 12h20"/></svg>
                    }
                  </div>
                </div>
                <span className="ilbl" style={{ fontSize:'.65rem',color:'rgba(255,255,255,.28)',fontWeight:'600',letterSpacing:'.08em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLE */}
        <div style={{ position:'relative',zIndex:3,marginBottom:'2rem',opacity:heroIn?1:0,transition:'opacity .9s ease .3s' }}>
          <div className="tog">
            <button className={`tb ${buy?'on':'off'}`} onClick={() => setMode('buy')}>🛒 I want to buy</button>
            <button className={`tb ${!buy?'on':'off'}`} onClick={() => setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{ position:'relative',zIndex:3,maxWidth:'860px',opacity:heroIn?1:0,transition:'opacity 1s ease .4s' }}>
          <div style={{ fontSize:'.68rem',fontWeight:'700',letterSpacing:'.24em',color:'#e8c547',textTransform:'uppercase',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'14px' }}>
            <div style={{ width:'28px',height:'1px',background:'#e8c547' }} />Website Acquisition Marketplace<div style={{ width:'28px',height:'1px',background:'#e8c547' }} />
          </div>
          <h1 className="hh" style={{ fontSize:'clamp(2.8rem,7.5vw,6rem)',fontWeight:'900',letterSpacing:'-.04em',lineHeight:.96,marginBottom:'1.5rem',transition:'all .4s ease' }}>
            {buy
              ? <><span style={{ color:'rgba(255,255,255,.9)' }}>The place websites</span><br /><span style={{ color:'#e8c547' }}>change hands.</span></>
              : <><span style={{ color:'rgba(255,255,255,.9)' }}>Turn your website</span><br /><span style={{ color:'#e8c547' }}>into money.</span></>
            }
          </h1>
          <p className="hs" style={{ fontSize:'1.08rem',color:'rgba(255,255,255,.38)',lineHeight:1.8,margin:'0 auto 2.5rem',maxWidth:'520px' }}>
            {buy ? 'Every listing is ownership-verified before you see it. Your money moves only when ownership does.' : 'List any live website in minutes. Merj verifies ownership, secures payment, and transfers everything automatically.'}
          </p>
          <div className="btns" style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
            {buy
              ? <><button className="btn g">Browse verified websites</button><button className="btn gh" onClick={() => setMode('sell')}>Switch to selling</button></>
              : <><button className="btn w" onClick={() => router.push('/login')}>List your site — free</button><button className="btn gh" onClick={() => setMode('buy')}>Switch to buying</button></>
            }
          </div>
        </div>

        <div style={{ position:'absolute',bottom:'2.25rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',zIndex:3 }}>
          <div style={{ width:'1px',height:'42px',background:'rgba(255,255,255,.12)' }} />
          <span style={{ fontSize:'.6rem',letterSpacing:'.18em',color:'rgba(255,255,255,.18)',textTransform:'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* PLATFORM SECTIONS */}
      {PLATFORMS.map((p, i) => {
        const rev = i % 2 !== 0
        const isIn = visible.has(p.id)
        return (
          <section
            key={p.id}
            data-id={p.id}
            ref={el => { secRefs.current[i] = el }}
            style={{ padding:'8rem 2rem',borderTop:'1px solid rgba(255,255,255,.05)',position:'relative',overflow:'hidden',minHeight:'600px',background:`radial-gradient(ellipse at ${rev?'75%':'25%'} 50%, rgba(${p.rgb},.06) 0%, transparent 55%)` }}
          >
            <div style={{ position:'absolute',top:'50%',transform:'translateY(-50%)',right:rev?'1rem':undefined,left:rev?undefined:'1rem',fontSize:'16rem',fontWeight:'900',color:'rgba(255,255,255,.018)',lineHeight:1,userSelect:'none',letterSpacing:'-.07em',pointerEvents:'none',zIndex:0 }}>{p.num}</div>

            <div className={rev?'pr rev':'pr'} style={{ maxWidth:'1080px',margin:'0 auto',display:'flex',alignItems:'center',flexDirection:rev?'row-reverse':'row',gap:'4.5rem',position:'relative',zIndex:1 }}>

              {/* ICON DROPS IN */}
              <div style={{ flex:'0 0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem' }}>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute',bottom:'-18px',left:'50%',transform:'translateX(-50%)',width:'160px',height:'26px',background:p.glow,filter:'blur(24px)',borderRadius:'50%',opacity:.5,animation:'glowP 3.5s ease-in-out infinite',pointerEvents:'none' }} />
                  <div className={`pc icon-drop${isIn?' show':''}`} style={{ width:'220px',height:'220px',background:p.bg,boxShadow:`0 32px 80px ${p.glow}44, inset 0 1px 0 rgba(255,255,255,.2)`,animationDelay:`${i*0.1}s` }}>
                    <div style={{ position:'relative',zIndex:4 }}>
                      {p.img
                        ? <img src={p.img} alt={p.name} width={120} height={120} style={{ objectFit:'contain',filter:'drop-shadow(0 4px 18px rgba(0,0,0,.5))',display:'block' }} />
                        : <svg viewBox="0 0 24 24" width={90} height={90} fill="none" stroke="white" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/><path d="M2 12h20"/></svg>
                      }
                    </div>
                  </div>
                </div>
                <span style={{ fontSize:'.7rem',fontWeight:'700',letterSpacing:'.2em',textTransform:'uppercase',color:p.light,whiteSpace:'nowrap' }}>{p.name}</span>
              </div>

              {/* TEXT SLIDES IN */}
              <div className={`txt-in${isIn?' show':''}`} style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.5rem' }}>
                  <div style={{ width:'40px',height:'3px',background:p.glow,borderRadius:'2px' }} />
                  <span style={{ fontSize:'.65rem',fontWeight:'700',letterSpacing:'.22em',color:'rgba(255,255,255,.25)',textTransform:'uppercase' }}>{p.num} / 04</span>
                </div>
                <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)',fontWeight:'900',letterSpacing:'-.035em',marginBottom:'1.25rem',lineHeight:1.05 }}>
                  {buy ? p.buyH : p.sellH}
                </h2>
                <p style={{ color:'rgba(255,255,255,.42)',fontSize:'.97rem',lineHeight:1.85,marginBottom:'1.75rem',maxWidth:'440px' }}>
                  {buy ? p.buyB : p.sellB}
                </p>
                <div style={{ display:'flex',flexWrap:'wrap',gap:'.6rem',marginBottom:'2rem' }}>
                  {p.achieve.map(tag => (
                    <span key={tag} style={{ padding:'.35rem .9rem',border:`1px solid ${p.glow}44`,borderRadius:'100px',fontSize:'.78rem',color:p.light,fontWeight:'500',background:`rgba(${p.rgb},.08)` }}>✓ {tag}</span>
                  ))}
                </div>
                <button className="pb" onClick={() => router.push('/login')} style={{ background:p.id==='vercel'?'#fff':p.glow,color:'#000',boxShadow:`0 10px 28px ${p.glow}44` }}>
                  {buy ? `Buy ${p.name} →` : `Sell on ${p.name} →`}
                </button>
              </div>
            </div>
          </section>
        )
      })}

      {/* TRUST */}
      <section style={{ padding:'6rem 2rem',background:'rgba(232,197,71,.025)',borderTop:'1px solid rgba(232,197,71,.07)',borderBottom:'1px solid rgba(232,197,71,.07)' }}>
        <div style={{ maxWidth:'1080px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'3rem' }}>
          {[
            { t:'Ownership verified first', b:"Every listing confirmed through each platform's official API. Unverified assets don't exist on Merj." },
            { t:'Payment locked on checkout', b:"Buyer's payment secured at checkout. Neither side can access it until transfer is fully confirmed." },
            { t:'Transfer or full refund', b:"If transfer does not complete, the buyer gets every cent back. Automatically." },
            { t:'No manual handoffs', b:'Admin access, credentials, and project files transfer through code. Not email. Not WhatsApp. Code.' },
          ].map(item => (
            <div key={item.t} style={{ borderTop:'2px solid rgba(232,197,71,.25)',paddingTop:'1.5rem' }}>
              <div style={{ width:'24px',height:'2.5px',background:'#e8c547',borderRadius:'2px',marginBottom:'1.25rem' }} />
              <h4 style={{ fontSize:'1rem',fontWeight:'700',marginBottom:'.75rem' }}>{item.t}</h4>
              <p style={{ color:'rgba(255,255,255,.38)',fontSize:'.88rem',lineHeight:1.75 }}>{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'9rem 2rem',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at center, rgba(232,197,71,.06) 0%, transparent 60%)' }} />
        <div style={{ position:'relative',zIndex:1 }}>
          <h2 className="ctah" style={{ fontSize:'clamp(2.4rem,7vw,5rem)',fontWeight:'900',letterSpacing:'-.04em',marginBottom:'1.25rem',lineHeight:.96 }}>
            Your site has value.<br /><span style={{ color:'#e8c547' }}>{"Let's move it."}</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.3)',fontSize:'1.05rem',margin:'0 auto 2.75rem',maxWidth:'380px',lineHeight:1.75 }}>
            Free to list. No fees until your site sells. Fully automated.
          </p>
          <div className="btns" style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
            <button className="btn g" onClick={() => router.push('/login')}>List your site — free</button>
            <button className="btn gh">Explore the marketplace</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.05)',padding:'2.5rem' }}>
        <div style={{ maxWidth:'1080px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1.5rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'9px' }}>
            <div style={{ width:'22px',height:'22px',background:'#e8c547',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'11px',color:'#000' }}>M</div>
            <span style={{ fontWeight:'700',fontSize:'.95rem' }}>Merj</span>
          </div>
          <p style={{ color:'rgba(255,255,255,.12)',fontSize:'.78rem' }}>© 2025 Merj · Website acquisition, done right.</p>
          <div style={{ display:'flex',gap:'1.75rem' }}>
            {['Marketplace','Sell','Sign in'].map(l => (
              <button key={l} style={{ background:'none',border:'none',color:'rgba(255,255,255,.18)',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit',padding:0 }}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
