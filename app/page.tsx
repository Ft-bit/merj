/* eslint-disable @next/next/no-img-element */
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

        .btn-g{border:none;border-radius:8px;padding:1rem
