'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

const GREEN = '#00e676'

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeClosed() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function LoginPage() {
  const { user, loading: authLoading, loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification, resetPassword } = useAuth()
  const router = useRouter()

  const [panel, setPanel] = useState<'signin' | 'register'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [resent, setResent] = useState(false)
  const [panelAnim, setPanelAnim] = useState(false)

  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const isRegister = panel === 'register'

  useEffect(() => {
    setTimeout(() => setMounted(true), 60)
  }, [])

  useEffect(() => {
    if (user && user.emailVerified) router.push('/dashboard')
  }, [user, router])

  const switchPanel = (to: 'signin' | 'register') => {
    setPanelAnim(true)
    setTimeout(() => {
      setPanel(to)
      setError('')
      setResetSent(false)
      setPanelAnim(false)
    }, 300)
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      router.push('/dashboard')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/popup-closed-by-user') setError('Popup closed — try again.')
      else if (code === 'auth/unauthorized-domain') setError('Add this domain in Firebase Console → Auth → Authorized Domains.')
      else setError('Google sign-in failed. Please try again.')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await registerWithEmail(email, password, name)
        setShowVerify(true)
      } else {
        const result = await loginWithEmail(email, password)
        if (result.needsVerification) {
          setShowVerify(true)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Incorrect email or password.')
      else if (code === 'auth/email-already-in-use') setError('An account with this email already exists.')
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.')
      else if (code === 'auth/user-not-found') setError('No account found with this email.')
      else setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleResend = async () => {
    try {
      await resendVerification()
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } catch {
      setError('Could not resend. Please try again.')
    }
  }

  const handleCheckVerified = async () => {
    setLoading(true)
    const verified = await checkVerification()
    if (verified) {
      router.push('/dashboard')
    } else {
      setError('Not verified yet. Please check your inbox.')
    }
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    setError('')
    setResetSent(false)
    if (!email) {
      setError('Enter your email above first, then click "Forgot?"')
      return
    }
    setResetLoading(true)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/user-not-found') setError('No account found with this email.')
      else if (code === 'auth/invalid-email') setError('That email address looks invalid.')
      else setError('Could not send reset email. Please try again.')
    }
    setResetLoading(false)
  }

  if (authLoading || (user && user.emailVerified)) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (showVerify) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
        <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'fadeUp .5s ease', color: '#fff', fontFamily: 'inherit' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,230,118,.1)', border: '2px solid rgba(0,230,118,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>📧</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '.6rem' }}>Check your email</h2>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            We sent a verification link to<br />
            <strong style={{ color: GREEN }}>{email}</strong>
          </p>
          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {['Open your email inbox', 'Click the verification link from Merj', 'Come back and click the button below'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.5rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', border: '1px solid rgba(0,230,118,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: '700', color: GREEN, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.55)' }}>{s}</span>
              </div>
            ))}
          </div>
          <button onClick={handleCheckVerified} disabled={loading} style={{ width: '100%', padding: '.9rem', background: GREEN, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '.95rem', cursor: 'pointer', marginBottom: '.75rem', fontFamily: 'inherit', opacity: loading ? .7 : 1 }}>
            {loading ? 'Checking...' : "I've verified my email →"}
          </button>
          <button onClick={handleResend} style={{ width: '100%', padding: '.85rem', background: 'transparent', color: resent ? '#4ade80' : 'rgba(255,255,255,.35)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', fontWeight: '500', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            {resent ? '✓ Sent! Check your inbox.' : 'Resend verification email'}
          </button>
          {error && <p style={{ color: '#f87171', fontSize: '.83rem', marginTop: '1rem' }}>{error}</p>}
          <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '.78rem', marginTop: '1.25rem' }}>Check spam folder if you do not see it.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflow: 'hidden', position: 'relative' }}>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}

        @keyframes cardIn{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes formIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
        @keyframes formInR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}
        @keyframes panelIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes orbPulse{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.12;transform:scale(1.1)}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        @keyframes fadeIn2{from{opacity:0}to{opacity:1}}

        .inp{
          width:100%;padding:.85rem 1rem;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:10px;color:#fff;font-size:.95rem;
          outline:none;font-family:inherit;
          transition:border-color .2s,background .2s;
        }
        .inp:focus{border-color:${GREEN}66;background:rgba(0,230,118,.03)}
        .inp::placeholder{color:rgba(255,255,255,.22)}

        .btn-main{
          width:100%;padding:.9rem;background:${GREEN};color:#000;
          border:none;border-radius:10px;font-weight:700;font-size:.95rem;
          cursor:pointer;font-family:inherit;transition:all .2s;letter-spacing:.02em;
        }
        .btn-main:hover:not(:disabled){background:#00c853;transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,230,118,.35)}
        .btn-main:disabled{opacity:.6;cursor:not-allowed}

        .btn-google{
          width:100%;padding:.85rem;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.09);
          border-radius:10px;color:#fff;font-size:.92rem;font-weight:500;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;
          font-family:inherit;transition:all .2s;
        }
        .btn-google:hover{background:rgba(255,255,255,.09);transform:translateY(-1px)}

        .eye-btn{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;color:rgba(255,255,255,.3);
          cursor:pointer;padding:4px;line-height:0;transition:color .2s;
        }
        .eye-btn:hover{color:rgba(255,255,255,.7)}

        .panel-toggle-btn{
          padding:.85rem 2.5rem;
          background:transparent;color:#fff;
          border:2px solid rgba(255,255,255,.4);
          border-radius:100px;font-weight:700;font-size:.9rem;
          cursor:pointer;font-family:inherit;letter-spacing:.03em;
          transition:all .25s;
        }
        .panel-toggle-btn:hover{background:rgba(255,255,255,.12);border-color:#fff}

        .back-btn{
          position:fixed;top:1.5rem;left:1.5rem;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.09);
          border-radius:8px;color:rgba(255,255,255,.45);
          cursor:pointer;font-size:.83rem;font-family:inherit;
          padding:.5rem 1rem;display:flex;align-items:center;gap:6px;
          transition:all .2s;z-index:100;
        }
        .back-btn:hover{color:#fff;background:rgba(255,255,255,.1)}

        .mobile-toggle{ display:none; }

        @media(max-width:860px){
          .right-panel{display:none!important}
          .form-side{width:100%!important;border-radius:20px!important}
          .mobile-toggle{ display:block!important; }
        }
        @media(max-width:480px){
          .form-side{padding:2rem 1.5rem!important}
        }
      `}</style>

      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,230,118,.07)', top: '-150px', right: '-150px', filter: 'blur(100px)', animation: 'orbPulse 5s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(0,230,118,.05)', bottom: '-100px', left: '-100px', filter: 'blur(80px)', animation: 'orbPulse 6s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      <button className="back-btn" onClick={() => router.push('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </button>

      <div style={{
        width: '100%', maxWidth: '920px',
        display: 'flex',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)',
        opacity: mounted ? 1 : 0,
        animation: mounted ? 'cardIn .6s cubic-bezier(.22,1,.36,1)' : 'none',
        minHeight: '580px',
      }}>

        <div className="form-side" style={{ flex: 1, background: '#0d0d0d', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '2.5rem' }}>
            <div style={{ width: '30px', height: '30px', background: GREEN, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', color: '#000' }}>M</div>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', letterSpacing: '-.02em' }}>Merj</span>
          </div>

          <div
            key={panel}
            style={{ animation: panelAnim ? 'fadeOut .25s ease forwards' : `${isRegister ? 'formInR' : 'formIn'} .4s cubic-bezier(.22,1,.36,1)` }}
          >
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginBottom: '.4rem', letterSpacing: '-.03em' }}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.32)', fontSize: '.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              {isRegister
                ? 'Join Merj — buy and sell digital assets securely'
                : 'Sign in to your Merj account'}
            </p>

            <button className="btn-google" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon />
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.07)' }} />
              <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.78rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.07)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Full name</label>
                  <input className="inp" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Email</label>
                <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                  <label style={{ fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resetLoading}
                      style={{ background: 'none', border: 'none', color: `${GREEN}88`, fontSize: '.8rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                    >
                      {resetLoading ? 'Sending...' : 'Forgot?'}
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input className="inp" type={showPw ? 'text' : 'password'} placeholder={isRegister ? 'Min. 6 characters' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '2.8rem' }} />
                  <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                    {showPw ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {resetSent && !isRegister && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(0,230,118,.07)', border: '1px solid rgba(0,230,118,.18)', borderRadius: '8px', color: GREEN, fontSize: '.83rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>✓</span>
                  Reset link sent to {email}. Check your inbox.
                </div>
              )}

              {error && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '8px', color: '#fca5a5', fontSize: '.83rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-main" disabled={loading} style={{ marginTop: '.5rem' }}>
                {loading
                  ? 'Please wait...'
                  : isRegister ? 'Create Account' : 'Sign In'
                }
              </button>
            </form>

            <p className="mobile-toggle" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,.3)', fontSize: '.85rem' }}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => switchPanel(isRegister ? 'signin' : 'register')} style={{ background: 'none', border: 'none', color: GREEN, cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit', fontSize: '.85rem' }}>
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>

        <div
          className="right-panel"
          style={{
            width: '42%',
            background: isRegister
              ? 'linear-gradient(145deg, #002d17 0%, #00522e 50%, #007a42 100%)'
              : 'linear-gradient(145deg, #001f10 0%, #003d22 50%, #006633 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background .6s ease',
            animation: 'panelIn .7s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(0,230,118,.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(0,230,118,.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', border: '1px solid rgba(255,255,255,.15)', animation: 'float 3s ease-in-out infinite', position: 'relative', zIndex: 1, boxShadow: '0 20px 50px rgba(0,0,0,.4)' }}>
            M
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '.75rem', letterSpacing: '-.02em', lineHeight: 1.2 }}>
              {isRegister ? 'Already have an account?' : 'New to Merj?'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '220px' }}>
              {isRegister
                ? 'Sign in and continue trading digital assets securely.'
                : 'Create a free account and start buying or selling websites, social accounts, stores, and more.'
              }
            </p>
            <button
              className="panel-toggle-btn"
              onClick={() => switchPanel(isRegister ? 'signin' : 'register')}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, display: 'flex', gap: '.5rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0 1.5rem', zIndex: 1 }}>
            {['Websites', 'X Accounts', 'Instagram', 'Stores', 'More...'].map((tag, i) => (
              <span key={tag} style={{ padding: '.25rem .75rem', background: 'rgba(0,230,118,.1)', border: '1px solid rgba(0,230,118,.15)', borderRadius: '100px', fontSize: '.72rem', color: 'rgba(0,230,118,.8)', fontWeight: '600' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
