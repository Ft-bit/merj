/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'

const VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4'

export default function Home() {
  const [mode, setMode] = useState('buy')
  const [scrolled, setScrolled] = useState(false)
  const [ready, setReady] = useState(false)
  const [videoErr, setVideoErr] = useState(false)

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const buy = mode === 'buy'

  return (
    <div style={{ background:'#000', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX:'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes dot{0%{left:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:100%;opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        @keyframes glow{0%,100%{opacity:.4}50%{opacity:.85}}
        @keyframes drop{
          0%{opacity:0;transform:translateY(-160px) scale(0.2) rotate(-15deg)}
          60%{opacity:1;transform:translateY(10px) scale(1.05) rotate(1deg)}
          80%{transform:translateY(-5px) scale(0.97)}
          100%{opacity:1;transform:none}
        }
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
        .card{border-radius:22px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:pointer;transition:filter .3s,transform .3s;animation:float 3.8s ease-in-out infinite}
        .card::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.22),transparent);border-radius:22px 22px 0 0;z-index:2;pointer-events:none}
        .card::after{content:'';position:absolute;inset:0;border-radius:22px;border:1px solid rgba(255,255,255,.2);z-index:3;pointer-events:none}
        .card:hover{filter:brightness(1.25);transform:translateY(-6px) scale(1.04)}
        .bigcard{border-radius:28px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .bigcard::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.18),transparent);border-radius:28px 28px 0 0;z-index:2;pointer-events:none}
        .bigcard::after{content:'';position:absolute;inset:0;border-radius:28px;border:1px solid rgba(255,255,255,.18);z-index:3;pointer-events:none}
        .tog{display:inline-flex;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);padding:5px;gap:4px}
        .ton{border:none;border-radius:100px;padding:.72rem 2rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .3s;font-family:inherit;white-space:nowrap;background:#e8c547;color:#000;box-shadow:0 6px 24px rgba(232,197,71,.4);transform:scale(1.04)}
        .toff{border:none;border-radius:100px;padding:.72rem 2rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .3s;font-family:inherit;white-space:nowrap;background:transparent;color:rgba(255,255,255,.35)}
        .toff:hover{color:rgba(255,255,255,.8)}
        .bg{border:none;border-radius:7px;padding:1rem 2.5rem;font-size:.9rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
        .bg.gold{background:#e8c547;color:#000}
        .bg.gold:hover{background:#f0d060;transform:translateY(-3px);box-shadow:0 16px 40px rgba(232,197,71,.35)}
        .bg.wht{background:#fff;color:#000}
        .bg.wht:hover{transform:translateY(-3px)}
        .bg.ghost{background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.14)}
        .bg.ghost:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-2px)}
        .nl{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:.88rem;font-family:inherit;padding:.4rem .8rem;transition:color .2s}
        .nl:hover{color:#fff}
        .cx{height:1px;background:rgba(255,255,255,.07);position:relative;overflow:visible}
        .cd{position:absolute;top:-3px;width:6px;height:6px;border-radius:50%;background:#e8c547;animation:dot 1.8s linear infinite}
        .pb{border:none;border-radius:7px;padding:.95rem 2.25rem;font-size:.88rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
        .pb:hover{filter:brightness(1.1);transform:translateY(-3px)}
        .sec-enter{animation:drop .9s cubic-bezier(.34,1.56,.64,1) both}
        .txt-enter{animation:slideUp .7s ease .35s both}
        @media(max-width:768px){
          .nmid{display:none!important}
          .hrow .card{width:58px!important;height:58px!important;border-radius:16px!important}
          .hrow .cxw{width:10px!important}
          .ilbl{display:none!important}
          .hh{font-size:2.4rem!important}
          .hs{font-size:.95rem!important}
          .btns{flex-direction:column!important;width:100%!important}
          .btns .bg,.btns .pb{width:100%!important}
          .tb{padding:.6rem 1rem!important;font-size:.82rem!important}
          .prow{flex-direction:column!important;text-align:center!important;align-items:center!important}
          .prow.rev{flex-direction:column!important}
          .bigcard{width:150px!important;height:150px!important}
          .ph{font-size:1.75rem!important}
          .ctah{font-size:2.2rem!important}
        }
        @media(max-width:480px){
          .hh{font-size:1.95rem!important}
          .hrow .card{width:46px!important;height:46px!important}
          .hrow .cxw{width:7px!important}
          .bigcard{width:120px!important;height:120px!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.1rem 2.5rem', background:scrolled?'rgba(0,0,0,.94)':'transparent', backdropFilter:scrolled?'blur(24px)':'none', borderBottom:scrolled?'1px solid rgba(255,255,255,.05)':'1px solid transparent', transition:'all .35s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px', cursor:'pointer' }}>
          <div style={{ width:'28px', height:'28px', background:'#e8c547', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'14px', color:'#000' }}>M</div>
          <span style={{ fontWeight:'800', fontSize:'1.1rem', letterSpacing:'-.03em' }}>Merj</span>
        </div>
        <div className="nmid" style={{ display:'flex', gap:'.1rem' }}>
          <button className="nl">Marketplace</button>
          <button className="nl">Sell</button>
          <button className="nl">How it works</button>
        </div>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          <button className="nl">Sign in</button>
          <button className="bg gold" style={{ padding:'.5rem 1.25rem', fontSize:'.82rem' }}>List a site</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'7rem 2rem 5rem', position:'relative', textAlign:'center', overflow:'hidden' }}>
        {!videoErr && (
          <video autoPlay muted loop playsInline onError={() => setVideoErr(true)} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.28, zIndex:0, pointerEvents:'none' }}>
            <source src={VIDEO} type="video/mp4" />
          </video>
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.65) 80%,#000 100%)', zIndex:1 }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,.7) 100%)', zIndex:1 }} />
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'380px', background:'radial-gradient(ellipse, rgba(124,58,237,.14) 0%, transparent 70%)', zIndex:1, pointerEvents:'none' }} />

        {/* ICON ROW */}
        <div className="hrow" style={{ position:'relative', zIndex:3, display:'flex', alignItems:'flex-end', justifyContent:'center', marginBottom:'3rem', gap:0, opacity:ready?1:0, transform:ready?'none':'translateY(20px)', transition:'opacity .9s, transform .9s' }}>

          {/* WordPress */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
            <div className="card" style={{ width:'84px', height:'84px', background:'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)', boxShadow:'0 20px 50px rgba(0,115,170,.55), inset 0 1px 0 rgba(255,255,255,.22)', animationDuration:'3.5s', animationDelay:'0s' }}>
              <img src="/images/wp.png" alt="WordPress" width={50} height={50} style={{ objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
            </div>
            <span className="ilbl" style={{ fontSize:'.65rem', color:'rgba(255,255,255,.28)', fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase' }}>WordPress</span>
          </div>

          {/* Connector */}
          <div className="cxw" style={{ width:'22px', marginBottom:'38px' }}><div className="cx"><div className="cd" style={{ animationDelay:'.5s' }} /></div></div>

          {/* Blogger */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
            <div className="card" style={{ width:'84px', height:'84px', background:'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)', boxShadow:'0 20px 50px rgba(245,125,0,.55), inset 0 1px 0 rgba(255,255,255,.22)', animationDuration:'3.8s', animationDelay:'.15s' }}>
              <img src="/images/blogger.png" alt="Blogger" width={50} height={50} style={{ objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
            </div>
            <span className="ilbl" style={{ fontSize:'.65rem', color:'rgba(255,255,255,.28)', fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase' }}>Blogger</span>
          </div>

          {/* Connector */}
          <div className="cxw" style={{ width:'22px', marginBottom:'38px' }}><div className="cx"><div className="cd" style={{ animationDelay:'1s' }} /></div></div>

          {/* Vercel */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
            <div className="card" style={{ width:'84px', height:'84px', background:'linear-gradient(145deg,#1a1a1a,#0a0a0a 50%,#000)', boxShadow:'0 20px 50px rgba(150,150,150,.3), inset 0 1px 0 rgba(255,255,255,.22)', animationDuration:'4.1s', animationDelay:'.3s' }}>
              <img src="/images/vc.png" alt="Vercel" width={50} height={50} style={{ objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
            </div>
            <span className="ilbl" style={{ fontSize:'.65rem', color:'rgba(255,255,255,.28)', fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase' }}>Vercel</span>
          </div>

          {/* Connector */}
          <div className="cxw" style={{ width:'22px', marginBottom:'38px' }}><div className="cx"><div className="cd" style={{ animationDelay:'1.5s' }} /></div></div>

          {/* Any Website */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
            <div className="card" style={{ width:'84px', height:'84px', background:'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)', boxShadow:'0 20px 50px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.22)', animationDuration:'4.4s', animationDelay:'.45s' }}>
              <svg viewBox="0 0 24 24" width={46} height={46} fill="none" stroke="white" strokeWidth="1.5" style={{ position:'relative', zIndex:4 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/><path d="M2 12h20"/>
              </svg>
            </div>
            <span className="ilbl" style={{ fontSize:'.65rem', color:'rgba(255,255,255,.28)', fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase' }}>Any Website</span>
          </div>
        </div>

        {/* TOGGLE */}
        <div style={{ position:'relative', zIndex:3, marginBottom:'2rem', opacity:ready?1:0, transition:'opacity .9s ease .3s' }}>
          <div className="tog">
            <button className={buy ? 'ton' : 'toff'} onClick={() => setMode('buy')}>🛒 I want to buy</button>
            <button className={!buy ? 'ton' : 'toff'} onClick={() => setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{ position:'relative', zIndex:3, maxWidth:'860px', opacity:ready?1:0, transition:'opacity 1s ease .4s' }}>
          <div style={{ fontSize:'.68rem', fontWeight:'700', letterSpacing:'.24em', color:'#e8c547', textTransform:'uppercase', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'14px' }}>
            <div style={{ width:'28px', height:'1px', background:'#e8c547' }} />
            Website Acquisition Marketplace
            <div style={{ width:'28px', height:'1px', background:'#e8c547' }} />
          </div>
          <h1 className="hh" style={{ fontSize:'clamp(2.8rem,7.5vw,6rem)', fontWeight:'900', letterSpacing:'-.04em', lineHeight:.96, marginBottom:'1.5rem' }}>
            {buy
              ? <><span style={{ color:'rgba(255,255,255,.9)' }}>The place websites</span><br /><span style={{ color:'#e8c547' }}>change hands.</span></>
              : <><span style={{ color:'rgba(255,255,255,.9)' }}>Turn your website</span><br /><span style={{ color:'#e8c547' }}>into money.</span></>
            }
          </h1>
          <p className="hs" style={{ fontSize:'1.08rem', color:'rgba(255,255,255,.38)', lineHeight:1.8, margin:'0 auto 2.5rem', maxWidth:'520px' }}>
            {buy
              ? 'Every listing is ownership-verified before you see it. Your money moves only when ownership does.'
              : 'List any live website in minutes. Merj verifies ownership, secures payment, and transfers everything automatically.'
            }
          </p>
          <div className="btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            {buy
              ? <><button className="bg gold">Browse verified websites</button><button className="bg ghost" onClick={() => setMode('sell')}>Switch to selling</button></>
              : <><button className="bg wht">List your site — free</button><button className="bg ghost" onClick={() => setMode('buy')}>Switch to buying</button></>
            }
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'2.25rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', zIndex:3 }}>
          <div style={{ width:'1px', height:'42px', background:'rgba(255,255,255,.12)' }} />
          <span style={{ fontSize:'.6rem', letterSpacing:'.18em', color:'rgba(255,255,255,.18)', textTransform:'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* WORDPRESS SECTION */}
      <section style={{ padding:'8rem 2rem', borderTop:'1px solid rgba(255,255,255,.05)', position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 25% 50%, rgba(0,115,170,.06) 0%, transparent 55%)' }}>
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:'1rem', fontSize:'14rem', fontWeight:'900', color:'rgba(255,255,255,.018)', lineHeight:1, userSelect:'none', letterSpacing:'-.07em', pointerEvents:'none' }}>01</div>
        <div className="prow" style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', alignItems:'center', gap:'4.5rem', position:'relative', zIndex:1 }}>
          <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'26px', background:'#0073aa', filter:'blur(24px)', borderRadius:'50%', opacity:.5, animation:'glow 3.5s ease-in-out infinite', pointerEvents:'none' }} />
              <div className="bigcard sec-enter" style={{ width:'220px', height:'220px', background:'linear-gradient(145deg,#1e8ec4,#0073aa 50%,#004d73)', boxShadow:'0 32px 80px rgba(0,115,170,.44), inset 0 1px 0 rgba(255,255,255,.2)' }}>
                <img src="/images/wp.png" alt="WordPress" width={120} height={120} style={{ objectFit:'contain', filter:'drop-shadow(0 4px 18px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
              </div>
            </div>
            <span style={{ fontSize:'.7rem', fontWeight:'700', letterSpacing:'.2em', textTransform:'uppercase', color:'#5bb8f5' }}>WordPress</span>
          </div>
          <div className="txt-enter" style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
              <div style={{ width:'40px', height:'3px', background:'#0073aa', borderRadius:'2px' }} />
              <span style={{ fontSize:'.65rem', fontWeight:'700', letterSpacing:'.22em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>01 / 04</span>
            </div>
            <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:'900', letterSpacing:'-.035em', marginBottom:'1.25rem', lineHeight:1.05 }}>
              {buy ? 'Buy or list your WordPress website' : 'Sell your WordPress website today'}
            </h2>
            <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.97rem', lineHeight:1.85, marginBottom:'1.75rem', maxWidth:'440px' }}>
              {buy ? 'Acquire established blogs, WooCommerce stores, and business sites. Ownership verified through the WordPress REST API before you see a single listing.' : 'Connect via Application Password. We verify real ownership and execute a full admin handover automatically. You get paid. Buyer gets access.'}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginBottom:'2rem' }}>
              {['Verified admin handover','WooCommerce & blogs','Automated credentials'].map(t => (
                <span key={t} style={{ padding:'.35rem .9rem', border:'1px solid rgba(0,115,170,.4)', borderRadius:'100px', fontSize:'.78rem', color:'#5bb8f5', fontWeight:'500', background:'rgba(0,115,170,.08)' }}>✓ {t}</span>
              ))}
            </div>
            <button className="pb" style={{ background:'#0073aa', color:'#fff', boxShadow:'0 10px 28px rgba(0,115,170,.44)' }}>{buy ? 'Buy WordPress →' : 'Sell on WordPress →'}</button>
          </div>
        </div>
      </section>

      {/* BLOGGER SECTION */}
      <section style={{ padding:'8rem 2rem', borderTop:'1px solid rgba(255,255,255,.05)', position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 75% 50%, rgba(245,125,0,.06) 0%, transparent 55%)' }}>
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', right:'1rem', fontSize:'14rem', fontWeight:'900', color:'rgba(255,255,255,.018)', lineHeight:1, userSelect:'none', letterSpacing:'-.07em', pointerEvents:'none' }}>02</div>
        <div className="prow rev" style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', alignItems:'center', flexDirection:'row-reverse', gap:'4.5rem', position:'relative', zIndex:1 }}>
          <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'26px', background:'#f57d00', filter:'blur(24px)', borderRadius:'50%', opacity:.5, animation:'glow 3.5s ease-in-out infinite .5s', pointerEvents:'none' }} />
              <div className="bigcard sec-enter" style={{ width:'220px', height:'220px', background:'linear-gradient(145deg,#ff9534,#f57d00 50%,#c45e00)', boxShadow:'0 32px 80px rgba(245,125,0,.44), inset 0 1px 0 rgba(255,255,255,.2)', animationDelay:'.1s' }}>
                <img src="/images/blogger.png" alt="Blogger" width={120} height={120} style={{ objectFit:'contain', filter:'drop-shadow(0 4px 18px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
              </div>
            </div>
            <span style={{ fontSize:'.7rem', fontWeight:'700', letterSpacing:'.2em', textTransform:'uppercase', color:'#ffb347' }}>Blogger</span>
          </div>
          <div className="txt-enter" style={{ flex:1, animationDelay:'.5s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
              <div style={{ width:'40px', height:'3px', background:'#f57d00', borderRadius:'2px' }} />
              <span style={{ fontSize:'.65rem', fontWeight:'700', letterSpacing:'.22em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>02 / 04</span>
            </div>
            <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:'900', letterSpacing:'-.035em', marginBottom:'1.25rem', lineHeight:1.05 }}>
              {buy ? 'Buy or list your Blogger website' : 'Sell your Blogger blog today'}
            </h2>
            <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.97rem', lineHeight:1.85, marginBottom:'1.75rem', maxWidth:'440px' }}>
              {buy ? 'Find monetized Blogger blogs with real audiences. Google Blogger API confirms every listing before it goes live on Merj.' : 'Connect via Google OAuth. We verify ownership and transfer blog access to the buyer through the Blogger API automatically.'}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginBottom:'2rem' }}>
              {['Google API verified','Real audience metrics','Instant credential handoff'].map(t => (
                <span key={t} style={{ padding:'.35rem .9rem', border:'1px solid rgba(245,125,0,.4)', borderRadius:'100px', fontSize:'.78rem', color:'#ffb347', fontWeight:'500', background:'rgba(245,125,0,.08)' }}>✓ {t}</span>
              ))}
            </div>
            <button className="pb" style={{ background:'#f57d00', color:'#fff', boxShadow:'0 10px 28px rgba(245,125,0,.44)' }}>{buy ? 'Buy Blogger →' : 'Sell on Blogger →'}</button>
          </div>
        </div>
      </section>

      {/* VERCEL SECTION */}
      <section style={{ padding:'8rem 2rem', borderTop:'1px solid rgba(255,255,255,.05)', position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 25% 50%, rgba(150,150,150,.06) 0%, transparent 55%)' }}>
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:'1rem', fontSize:'14rem', fontWeight:'900', color:'rgba(255,255,255,.018)', lineHeight:1, userSelect:'none', letterSpacing:'-.07em', pointerEvents:'none' }}>03</div>
        <div className="prow" style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', alignItems:'center', gap:'4.5rem', position:'relative', zIndex:1 }}>
          <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'26px', background:'#888', filter:'blur(24px)', borderRadius:'50%', opacity:.5, animation:'glow 3.5s ease-in-out infinite 1s', pointerEvents:'none' }} />
              <div className="bigcard sec-enter" style={{ width:'220px', height:'220px', background:'linear-gradient(145deg,#1a1a1a,#0a0a0a 50%,#000)', boxShadow:'0 32px 80px rgba(150,150,150,.3), inset 0 1px 0 rgba(255,255,255,.2)', animationDelay:'.2s' }}>
                <img src="/images/vc.png" alt="Vercel" width={120} height={120} style={{ objectFit:'contain', filter:'drop-shadow(0 4px 18px rgba(0,0,0,.5))', position:'relative', zIndex:4 }} />
              </div>
            </div>
            <span style={{ fontSize:'.7rem', fontWeight:'700', letterSpacing:'.2em', textTransform:'uppercase', color:'#ccc' }}>Vercel</span>
          </div>
          <div className="txt-enter" style={{ flex:1, animationDelay:'.7s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
              <div style={{ width:'40px', height:'3px', background:'#888', borderRadius:'2px' }} />
              <span style={{ fontSize:'.65rem', fontWeight:'700', letterSpacing:'.22em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>03 / 04</span>
            </div>
            <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:'900', letterSpacing:'-.035em', marginBottom:'1.25rem', lineHeight:1.05 }}>
              {buy ? 'Buy or list your Vercel project' : 'Sell your Vercel project today'}
            </h2>
            <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.97rem', lineHeight:1.85, marginBottom:'1.75rem', maxWidth:'440px' }}>
              {buy ? 'Acquire live Next.js apps, SaaS tools, and Vercel-deployed projects. Transfer executes directly through the Vercel API.' : 'Authenticate with your Vercel token. Transfer request fires automatically when your project sells.'}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginBottom:'2rem' }}>
              {['Vercel API transfer','Next.js & SaaS apps','Domain included'].map(t => (
                <span key={t} style={{ padding:'.35rem .9rem', border:'1px solid rgba(150,150,150,.4)', borderRadius:'100px', fontSize:'.78rem', color:'#ccc', fontWeight:'500', background:'rgba(150,150,150,.08)' }}>✓ {t}</span>
              ))}
            </div>
            <button className="pb" style={{ background:'#fff', color:'#000', boxShadow:'0 10px 28px rgba(150,150,150,.3)' }}>{buy ? 'Buy Vercel →' : 'Sell on Vercel →'}</button>
          </div>
        </div>
      </section>

      {/* ANY WEBSITE SECTION */}
      <section style={{ padding:'8rem 2rem', borderTop:'1px solid rgba(255,255,255,.05)', position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 75% 50%, rgba(124,58,237,.06) 0%, transparent 55%)' }}>
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', right:'1rem', fontSize:'14rem', fontWeight:'900', color:'rgba(255,255,255,.018)', lineHeight:1, userSelect:'none', letterSpacing:'-.07em', pointerEvents:'none' }}>04</div>
        <div className="prow rev" style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', alignItems:'center', flexDirection:'row-reverse', gap:'4.5rem', position:'relative', zIndex:1 }}>
          <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'26px', background:'#7c3aed', filter:'blur(24px)', borderRadius:'50%', opacity:.5, animation:'glow 3.5s ease-in-out infinite 1.5s', pointerEvents:'none' }} />
              <div className="bigcard sec-enter" style={{ width:'220px', height:'220px', background:'linear-gradient(145deg,#5b3fa6,#7c3aed 50%,#4c1d95)', boxShadow:'0 32px 80px rgba(124,58,237,.44), inset 0 1px 0 rgba(255,255,255,.2)', animationDelay:'.3s' }}>
                <svg viewBox="0 0 24 24" width={90} height={90} fill="none" stroke="white" strokeWidth="1.4" style={{ position:'relative', zIndex:4 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 1 4 10 14.5 14.5 0 0 1-4 10 14.5 14.5 0 0 1-4-10A14.5 14.5 0 0 1 12 2z"/><path d="M2 12h20"/>
                </svg>
              </div>
            </div>
            <span style={{ fontSize:'.7rem', fontWeight:'700', letterSpacing:'.2em', textTransform:'uppercase', color:'#a78bfa' }}>Any Website</span>
          </div>
          <div className="txt-enter" style={{ flex:1, animationDelay:'.9s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
              <div style={{ width:'40px', height:'3px', background:'#7c3aed', borderRadius:'2px' }} />
              <span style={{ fontSize:'.65rem', fontWeight:'700', letterSpacing:'.22em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>04 / 04</span>
            </div>
            <h2 className="ph" style={{ fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:'900', letterSpacing:'-.035em', marginBottom:'1.25rem', lineHeight:1.05 }}>
              {buy ? 'Buy or list any live website' : 'Sell any live website today'}
            </h2>
            <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.97rem', lineHeight:1.85, marginBottom:'1.75rem', maxWidth:'440px' }}>
              {buy ? 'WordPress, Blogger, Vercel, Netlify, GitHub Pages, Shopify, Wix, locally hosted apps — every platform, one marketplace.' : 'Got a live URL? List it on Merj. We support every major hosting platform and any custom-hosted site.'}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginBottom:'2rem' }}>
              {['Every platform welcome','Custom domains','Local hosted apps'].map(t => (
                <span key={t} style={{ padding:'.35rem .9rem', border:'1px solid rgba(124,58,237,.4)', borderRadius:'100px', fontSize:'.78rem', color:'#a78bfa', fontWeight:'500', background:'rgba(124,58,237,.08)' }}>✓ {t}</span>
              ))}
            </div>
            <button className="pb" style={{ background:'#7c3aed', color:'#fff', boxShadow:'0 10px 28px rgba(124,58,237,.44)' }}>{buy ? 'Buy any website →' : 'Sell any website →'}</button>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding:'6rem 2rem', background:'rgba(232,197,71,.025)', borderTop:'1px solid rgba(232,197,71,.07)', borderBottom:'1px solid rgba(232,197,71,.07)' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'3rem' }}>
          {[
            { t:'Ownership verified first', b:"Every listing confirmed through each platform's official API. Unverified assets do not exist on Merj." },
            { t:'Payment locked on checkout', b:"Buyer payment secured at checkout. Neither side can access it until transfer is fully confirmed." },
            { t:'Transfer or full refund', b:"If transfer does not complete, the buyer gets every cent back. Automatically." },
            { t:'No manual handoffs', b:'Admin access, credentials, and project files transfer through code. Not email. Not WhatsApp. Code.' },
          ].map(item => (
            <div key={item.t} style={{ borderTop:'2px solid rgba(232,197,71,.25)', paddingTop:'1.5rem' }}>
              <div style={{ width:'24px', height:'2.5px', background:'#e8c547', borderRadius:'2px', marginBottom:'1.25rem' }} />
              <h4 style={{ fontSize:'1rem', fontWeight:'700', marginBottom:'.75rem' }}>{item.t}</h4>
              <p style={{ color:'rgba(255,255,255,.38)', fontSize:'.88rem', lineHeight:1.75 }}>{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'9rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(232,197,71,.06) 0%, transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 className="ctah" style={{ fontSize:'clamp(2.4rem,7vw,5rem)', fontWeight:'900', letterSpacing:'-.04em', marginBottom:'1.25rem', lineHeight:.96 }}>
            Your site has value.<br /><span style={{ color:'#e8c547' }}>{"Let's move it."}</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.3)', fontSize:'1.05rem', margin:'0 auto 2.75rem', maxWidth:'380px', lineHeight:1.75 }}>
            Free to list. No fees until your site sells. Fully automated.
          </p>
          <div className="btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="bg gold">List your site — free</button>
            <button className="bg ghost">Explore the marketplace</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.05)', padding:'2.5rem' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
            <div style={{ width:'22px', height:'22px', background:'#e8c547', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'11px', color:'#000' }}>M</div>
            <span style={{ fontWeight:'700', fontSize:'.95rem' }}>Merj</span>
          </div>
          <p style={{ color:'rgba(255,255,255,.12)', fontSize:'.78rem' }}>© 2025 Merj</p>
          <div style={{ display:'flex', gap:'1.75rem' }}>
            <button style={{ background:'none', border:'none', color:'rgba(255,255,255,.18)', cursor:'pointer', fontSize:'.78rem', fontFamily:'inherit' }}>Marketplace</button>
            <button style={{ background:'none', border:'none', color:'rgba(255,255,255,.18)', cursor:'pointer', fontSize:'.78rem', fontFamily:'inherit' }}>Sell</button>
            <button style={{ background:'none', border:'none', color:'rgba(255,255,255,.18)', cursor:'pointer', fontSize:'.78rem', fontFamily:'inherit' }}>Sign in</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
