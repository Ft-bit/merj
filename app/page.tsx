
'use client'

import { useState, useEffect } from 'react'

const VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4'

const GREEN = '#00e676'
const GREEN2 = '#00c853'

export default function Home() {
  const [mode, setMode] = useState('buy')
  const [scrolled, setScrolled] = useState(false)
  const [ready, setReady] = useState(false)
  const [videoErr, setVideoErr] = useState(false)
  const buy = mode === 'buy'

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}

        @keyframes float0{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-14px) rotate(-4deg)}}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(-1deg)}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(0deg)}}
        @keyframes float3{0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
        @keyframes float4{0%,100%{transform:translateY(0) rotate(5deg)}50%{transform:translateY(-15px) rotate(5deg)}}
        @keyframes float5{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(-2deg)}}

        @keyframes dot{0%{left:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:100%;opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        @keyframes glow{0%,100%{opacity:.35}50%{opacity:.8}}
        @keyframes greenPulse{0%,100%{box-shadow:0 0 30px rgba(0,230,118,.3)}50%{box-shadow:0 0 60px rgba(0,230,118,.6)}}
        @keyframes grain{0%,100%{transform:translate(0,0)}33%{transform:translate(-1%,-2%)}66%{transform:translate(1%,1%)}}
        @keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}

        .grain{position:fixed;inset:-50%;width:200%;height:200%;opacity:.02;pointer-events:none;z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation:grain .35s steps(1) infinite}

        .ic{border-radius:22px;display:flex;align-items:center;justify-content:center;
          position:relative;overflow:hidden;cursor:pointer;
          transition:filter .3s,transform .3s}
        .ic::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,.22),transparent);
          border-radius:22px 22px 0 0;z-index:2;pointer-events:none}
        .ic::after{content:'';position:absolute;inset:0;border-radius:22px;
          border:1px solid rgba(255,255,255,.2);z-index:3;pointer-events:none}
        .ic:hover{filter:brightness(1.25);transform:translateY(-8px) scale(1.05)!important}

        .cx{height:1px;background:rgba(255,255,255,.06);position:relative;overflow:visible}
        .cd{position:absolute;top:-3px;width:6px;height:6px;border-radius:50%;background:${GREEN};animation:dot 1.8s linear infinite}

        .tog{display:inline-flex;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);padding:5px;gap:4px}
        .ton{border:none;border-radius:100px;padding:.75rem 2.25rem;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);font-family:inherit;white-space:nowrap;
          background:${GREEN};color:#000;box-shadow:0 6px 28px rgba(0,230,118,.35);transform:scale(1.04)}
        .toff{border:none;border-radius:100px;padding:.75rem 2.25rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .3s;font-family:inherit;white-space:nowrap;
          background:transparent;color:rgba(255,255,255,.4)}
        .toff:hover{color:rgba(255,255,255,.8)}

        .btn-g{border:none;border-radius:8px;padding:1rem 2.5rem;font-size:.92rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.03em;text-transform:uppercase;transition:all .25s;
          background:${GREEN};color:#000}
        .btn-g:hover{background:${GREEN2};transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,230,118,.35)}
        .btn-w{border:none;border-radius:8px;padding:1rem 2.5rem;font-size:.92rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.03em;text-transform:uppercase;transition:all .25s;
          background:#fff;color:#000}
        .btn-w:hover{background:#f0f0f0;transform:translateY(-3px)}
        .btn-gh{background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:1rem 2.5rem;font-size:.92rem;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:.03em;text-transform:uppercase;transition:all .25s}
        .btn-gh:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-2px)}

        .nl{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:.88rem;font-family:inherit;padding:.4rem .8rem;transition:color .2s}
        .nl:hover{color:#fff}

        .ticker-wrap{overflow:hidden;width:100%}
        .ticker-track{display:flex;width:max-content;animation:tickerScroll 30s linear infinite;gap:0}
        .ticker-item{display:flex;align-items:center;gap:10px;padding:0 2rem;color:rgba(255,255,255,.25);font-size:.8rem;font-weight:500;letter-spacing:.05em;white-space:nowrap}
        .ticker-dot{width:4px;height:4px;border-radius:50%;background:rgba(0,230,118,.5)}

        .coming-badge{padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:600;color:${GREEN};background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.2);margin-left:6px;vertical-align:middle}

        @media(max-width:768px){
          .nmid{display:none!important}
          .ic{width:58px!important;height:58px!important;border-radius:16px!important}
          .cxg{width:8px!important}
          .ilbl{display:none!important}
          .hh{font-size:2.4rem!important;line-height:1.05!important}
          .hs{font-size:.95rem!important}
          .btns{flex-direction:column!important;width:100%!important}
          .btns button{width:100%!important}
          .ton,.toff{padding:.6rem 1.1rem!important;font-size:.82rem!important}
        }
        @media(max-width:480px){
          .hh{font-size:1.95rem!important}
          .ic{width:46px!important;height:46px!important}
          .cxg{width:5px!important}
        }
      `}</style>

      <div className="grain" />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2.5rem',
        background: scrolled ? 'rgba(0,0,0,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.05)' : '1px solid transparent',
        transition: 'all .35s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', background: GREEN, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#000' }}>M</div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-.03em' }}>Merj</span>
        </div>
        <div className="nmid" style={{ display: 'flex', gap: '.1rem' }}>
          <button className="nl">Marketplace</button>
          <button className="nl">Sell</button>
          <button className="nl">How it works</button>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
          <button className="nl" onClick={() => window.location.href = '/login'}>Sign in</button>
          <button className="btn-g" style={{ padding: '.5rem 1.25rem', fontSize: '.82rem' }} onClick={() => window.location.href = '/login'}>
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '7rem 2rem 4rem', position: 'relative',
        textAlign: 'center', overflow: 'hidden',
      }}>
        {/* Video BG */}
        {!videoErr && (
          <video autoPlay muted loop playsInline onError={() => setVideoErr(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .3, zIndex: 0, pointerEvents: 'none' }}>
            <source src={VIDEO} type="video/mp4" />
          </video>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.05) 40%,rgba(0,0,0,.65) 80%,#000 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,.75) 100%)', zIndex: 1 }} />
        {/* Green glow from video */}
        <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse, rgba(0,230,118,.12) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

        {/* PLATFORM ICONS */}
        <div style={{
          position: 'relative', zIndex: 3,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          marginBottom: '2.75rem', gap: 0,
          opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(20px)',
          transition: 'opacity .9s ease, transform .9s ease',
        }}>

          {/* WordPress */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#1e8ec4,#0073aa,#004d73)', boxShadow: '0 18px 45px rgba(0,115,170,.55), inset 0 1px 0 rgba(255,255,255,.2)', animation: 'float0 3.5s ease-in-out 0s infinite' }}>
              <img src="/images/wp.png" alt="WordPress" width={48} height={48} style={{ objectFit: 'contain', position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }} />
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>WP</span>
          </div>

          <div className="cxg" style={{ width: '18px', marginBottom: '34px' }}><div className="cx"><div className="cd" style={{ animationDelay: '.4s' }} /></div></div>

          {/* Blogger */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#ff9534,#f57d00,#c45e00)', boxShadow: '0 18px 45px rgba(245,125,0,.55), inset 0 1px 0 rgba(255,255,255,.2)', animation: 'float1 3.8s ease-in-out .15s infinite' }}>
              <img src="/images/blogger.png" alt="Blogger" width={48} height={48} style={{ objectFit: 'contain', position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }} />
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>Blog</span>
          </div>

          <div className="cxg" style={{ width: '18px', marginBottom: '34px' }}><div className="cx"><div className="cd" style={{ animationDelay: '.8s' }} /></div></div>

          {/* Vercel */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#1a1a1a,#0a0a0a,#000)', boxShadow: '0 18px 45px rgba(150,150,150,.3), inset 0 1px 0 rgba(255,255,255,.22)', animation: 'float2 4.1s ease-in-out .3s infinite' }}>
              <img src="/images/vc.png" alt="Vercel" width={48} height={48} style={{ objectFit: 'contain', position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }} />
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>Vercel</span>
          </div>

          <div className="cxg" style={{ width: '18px', marginBottom: '34px' }}><div className="cx"><div className="cd" style={{ animationDelay: '1.2s' }} /></div></div>

          {/* X (Twitter) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#1a1a1a,#0d0d0d,#000)', boxShadow: '0 18px 45px rgba(255,255,255,.15), inset 0 1px 0 rgba(255,255,255,.2)', animation: 'float3 3.6s ease-in-out .45s infinite' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white" style={{ position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>X</span>
          </div>

          <div className="cxg" style={{ width: '18px', marginBottom: '34px' }}><div className="cx"><div className="cd" style={{ animationDelay: '1.6s' }} /></div></div>

          {/* Instagram */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#833ab4,#fd1d1d,#fcb045)', boxShadow: '0 18px 45px rgba(253,29,29,.4), inset 0 1px 0 rgba(255,255,255,.2)', animation: 'float4 4.3s ease-in-out .6s infinite' }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="white" style={{ position: 'relative', zIndex: 4, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>IG</span>
          </div>

          <div className="cxg" style={{ width: '18px', marginBottom: '34px' }}><div className="cx"><div className="cd" style={{ animationDelay: '2s' }} /></div></div>

          {/* More */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="ic" style={{ width: '80px', height: '80px', background: 'linear-gradient(145deg,#111,#1a1a1a)', boxShadow: '0 18px 45px rgba(0,230,118,.2), inset 0 1px 0 rgba(255,255,255,.1)', animation: 'float5 3.9s ease-in-out .75s infinite', border: `1px dashed rgba(0,230,118,.3)` }}>
              <div style={{ position: 'relative', zIndex: 4, textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: GREEN, lineHeight: 1 }}>+</div>
                <div style={{ fontSize: '.55rem', color: 'rgba(0,230,118,.7)', fontWeight: '600', letterSpacing: '.05em', marginTop: '2px' }}>MORE</div>
              </div>
            </div>
            <span className="ilbl" style={{ fontSize: '.6rem', color: 'rgba(0,230,118,.4)', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase' }}>Soon</span>
          </div>
        </div>

        {/* TOGGLE */}
        <div style={{ position: 'relative', zIndex: 3, marginBottom: '2rem', opacity: ready ? 1 : 0, transition: 'opacity .9s ease .25s' }}>
          <div className="tog">
            <button className={buy ? 'ton' : 'toff'} onClick={() => setMode('buy')}>🛒 I want to buy</button>
            <button className={!buy ? 'ton' : 'toff'} onClick={() => setMode('sell')}>💰 I want to sell</button>
          </div>
        </div>

        {/* HEADLINE */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '860px', opacity: ready ? 1 : 0, transition: 'opacity 1s ease .35s' }}>
          <h1 className="hh" style={{ fontSize: 'clamp(2.8rem,7.5vw,6rem)', fontWeight: '900', letterSpacing: '-.04em', lineHeight: .95, marginBottom: '1.5rem', transition: 'all .4s ease' }}>
            {buy ? (
              <>
                <span style={{ color: 'rgba(255,255,255,.92)' }}>Buy digital assets</span><br />
                <span style={{ color: GREEN }}>from real people.</span>
              </>
            ) : (
              <>
                <span style={{ color: 'rgba(255,255,255,.92)' }}>Sell anything digital.</span><br />
                <span style={{ color: GREEN }}>Get paid securely.</span>
              </>
            )}
          </h1>

          <p className="hs" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.8, margin: '0 auto 1rem', maxWidth: '560px', transition: 'all .4s ease' }}>
            {buy
              ? 'Websites, social media accounts, online stores, and more — every asset verified and secured before you pay a single cent.'
              : 'Websites, X accounts, Instagram pages, Facebook pages, Shopify stores, and more — list anything with a digital value. We handle verification, payment, and transfer automatically.'
            }
          </p>

          {/* Coming soon tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem', marginBottom: '2.25rem' }}>
            {['WordPress', 'Blogger', 'Vercel', 'X Accounts', 'Instagram', 'Facebook Pages', 'Shopify', 'More coming soon'].map((tag, i) => (
              <span key={tag} style={{
                padding: '.3rem .85rem',
                borderRadius: '100px',
                fontSize: '.75rem',
                fontWeight: '500',
                background: i >= 6 ? 'rgba(0,230,118,.08)' : 'rgba(255,255,255,.05)',
                border: i >= 6 ? '1px solid rgba(0,230,118,.2)' : '1px solid rgba(255,255,255,.08)',
                color: i >= 6 ? GREEN : 'rgba(255,255,255,.4)',
              }}>
                {i >= 7 ? '+ ' : ''}{tag}
              </span>
            ))}
          </div>

          <div className="btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {buy ? (
              <>
                <button className="btn-g" onClick={() => window.location.href = '/login'}>Browse the marketplace</button>
                <button className="btn-gh" onClick={() => setMode('sell')}>Switch to selling</button>
              </>
            ) : (
              <>
                <button className="btn-w" onClick={() => window.location.href = '/login'}>List your asset — free</button>
                <button className="btn-gh" onClick={() => setMode('buy')}>Switch to buying</button>
              </>
            )}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2.25rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 3 }}>
          <div style={{ width: '1px', height: '42px', background: 'rgba(255,255,255,.12)' }} />
          <span style={{ fontSize: '.6rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.15)', textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '.9rem 0', background: 'rgba(255,255,255,.01)', overflow: 'hidden' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, rep) => (
            ['Websites', 'X Accounts', 'Instagram Pages', 'Facebook Pages', 'Shopify Stores', 'Blogger Blogs', 'Vercel Projects', 'YouTube Channels', 'TikTok Accounts', 'Newsletters', 'SaaS Products', 'Custom Domains'].map((item, i) => (
              <div key={`${rep}-${i}`} className="ticker-item">
                <div className="ticker-dot" />
                {item}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '.68rem', fontWeight: '700', letterSpacing: '.22em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,.25)' }} />
            The process
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,.25)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '900', letterSpacing: '-.035em' }}>
            Simple. Secure. Automatic.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,.04)' }}>
          {[
            { n: '01', e: '🔗', t: 'List & verify', b: 'Connect your asset — website, social account, or store. We verify real ownership through the platform\'s official API. Unverified assets never go live.' },
            { n: '02', e: '🔒', t: 'Buyer pays. Money locks.', b: 'Buyer checks out through Stripe. Their payment is secured immediately. Neither party can touch it until the transfer is confirmed complete.' },
            { n: '03', e: '⚡', t: 'Transfer first. Pay after.', b: 'Access, credentials, and ownership transfer automatically through code. Only after confirmation does the seller receive payment. Buyer is always protected.' },
          ].map(s => (
            <div key={s.n} style={{ background: '#080808', padding: '2.75rem 2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '.5rem', right: '1rem', fontSize: '5rem', fontWeight: '900', color: 'rgba(255,255,255,.025)', lineHeight: 1, userSelect: 'none', letterSpacing: '-.05em' }}>{s.n}</div>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{s.e}</div>
              <div style={{ width: '24px', height: '2.5px', background: GREEN, borderRadius: '2px', marginBottom: '1.1rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '.75rem' }}>{s.t}</h3>
              <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.88rem', lineHeight: 1.8 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ background: 'rgba(0,230,118,.02)', borderTop: '1px solid rgba(0,230,118,.07)', borderBottom: '1px solid rgba(0,230,118,.07)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '3rem' }}>
          {[
            { t: 'Every asset verified', b: "Ownership is confirmed through each platform's official API before any listing goes live. You see only what's real." },
            { t: 'Payment locked first', b: "Buyer payment is secured at checkout via Stripe. It cannot be accessed until transfer is fully confirmed." },
            { t: 'Transfer or full refund', b: "If the transfer does not complete, the buyer gets every cent back. Automatically. No questions asked." },
            { t: 'Zero manual steps', b: 'Access, credentials, and ownership all transfer through code. Not through emails. Not through trust.' },
          ].map(item => (
            <div key={item.t} style={{ borderTop: `2px solid rgba(0,230,118,.2)`, paddingTop: '1.5rem' }}>
              <div style={{ width: '24px', height: '2.5px', background: GREEN, borderRadius: '2px', marginBottom: '1.25rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '.75rem' }}>{item.t}</h4>
              <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.88rem', lineHeight: 1.75 }}>{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '9rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,230,118,.06) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '.68rem', fontWeight: '700', letterSpacing: '.24em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,.2)' }} />
            Start today
            <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,.2)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2.4rem,7vw,5rem)', fontWeight: '900', letterSpacing: '-.04em', marginBottom: '1.25rem', lineHeight: .96 }}>
            Your asset has value.<br /><span style={{ color: GREEN }}>{"Let's move it."}</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '1.05rem', margin: '0 auto 2.75rem', maxWidth: '400px', lineHeight: 1.75 }}>
            Free to list. No fees until your asset sells. Fully automated from listing to payout.
          </p>
          <div className="btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-g" onClick={() => window.location.href = '/login'}>List your asset — free</button>
            <button className="btn-gh" onClick={() => window.location.href = '/login'}>Explore the marketplace</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '2.5rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '22px', height: '22px', background: GREEN, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', color: '#000' }}>M</div>
            <span style={{ fontWeight: '700', fontSize: '.95rem', letterSpacing: '-.02em' }}>Merj</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,.12)', fontSize: '.78rem' }}>© 2025 Merj · Buy and sell digital assets securely.</p>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            {['Marketplace', 'Sell', 'Sign in'].map(l => (
              <button key={l} onClick={() => window.location.href = '/login'} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.18)', cursor: 'pointer', fontSize: '.78rem', fontFamily: 'inherit', padding: 0 }}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
