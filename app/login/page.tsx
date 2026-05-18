'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification } = useAuth()
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      router.push('/dashboard')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.')
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Add it in Firebase Console → Authentication → Authorized Domains.')
      } else {
        setError('Google sign-in failed. Try again.')
      }
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
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Incorrect email or password.')
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else if (code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setResendSent(false)
    await resendVerification()
    setResendSent(true)
  }

  const handleCheckVerified = async () => {
    setChecking(true)
    const verified = await checkVerification()
    if (verified) {
      router.push('/dashboard')
    } else {
      setError('Email not verified yet. Check your inbox.')
    }
    setChecking(false)
  }

  const inputStyle: React.CSSProperties = {
    padding:'0.8rem 1rem',
    background:'#1a1a1a',
    border:'1px solid #2a2a2a',
    borderRadius:'10px',
    color:'#fff',
    fontSize:'0.95rem',
    outline:'none',
    width:'100%',
    boxSizing:'border-box',
    fontFamily:'inherit',
    transition:'border-color 0.2s',
  }

  // ─── EMAIL VERIFICATION SCREEN ───
  if (showVerify) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', padding:'1rem' }}>
        <div style={{ background:'#111', border:'1px solid #222', borderRadius:'20px', padding:'2.5rem 2rem', width:'100%', maxWidth:'420px', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📧</div>
          <h2 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:'700', margin:'0 0 0.75rem' }}>
            Check your email
          </h2>
          <p style={{ color:'#888', fontSize:'0.9rem', lineHeight:1.7, margin:'0 0 1.5rem' }}>
            We sent a verification link to <strong style={{ color:'#fff' }}>{email}</strong>.
            Click the link in the email to activate your account.
          </p>

          <button
            onClick={handleCheckVerified}
            disabled={checking}
            style={{ width:'100%', padding:'0.8rem', background:'#e8c547', color:'#000', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'0.95rem', cursor:'pointer', marginBottom:'0.75rem', fontFamily:'inherit' }}
          >
            {checking ? 'Checking...' : "I've verified my email →"}
          </button>

          <button
            onClick={handleResend}
            style={{ width:'100%', padding:'0.8rem', background:'transparent', color:resendSent ? '#4ade80' : '#888', border:'1px solid #2a2a2a', borderRadius:'10px', fontWeight:'500', fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' }}
          >
            {resendSent ? '✓ Email sent!' : 'Resend verification email'}
          </button>

          {error && <p style={{ color:'#f87171', fontSize:'0.85rem', marginTop:'1rem' }}>{error}</p>}

          <p style={{ color:'#555', fontSize:'0.8rem', marginTop:'1.5rem' }}>
            Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      </div>
    )
  }

  // ─── MAIN LOGIN SCREEN ───
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', padding:'1rem' }}>
      <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:'400px' }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.75rem' }}>
          <div style={{ width:'26px', height:'26px', background:'#e8c547', borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'13px', color:'#000' }}>M</div>
          <span style={{ fontWeight:'700', fontSize:'1.05rem', color:'#fff' }}>Merj</span>
        </div>

        <h1 style={{ fontSize:'1.4rem', fontWeight:'700', color:'#fff', margin:'0 0 0.4rem' }}>
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ color:'#555', fontSize:'0.88rem', margin:'0 0 1.5rem' }}>
          {isRegister ? 'Join the marketplace' : 'Sign in to continue'}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width:'100%', padding:'0.8rem', background:'#fff', color:'#111', border:'none', borderRadius:'10px', fontWeight:'600', fontSize:'0.92rem', cursor:'pointer', marginBottom:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily:'inherit', opacity: loading ? 0.7 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign:'center', color:'#333', fontSize:'0.82rem', margin:'1rem 0' }}>or</div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
          {isRegister && (
            <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#e8c547')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          )}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#e8c547')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#e8c547')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />

          {error && <p style={{ color:'#f87171', fontSize:'0.83rem', margin:0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ padding:'0.8rem', background:'#e8c547', color:'#000', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily:'inherit', marginTop:'0.25rem' }}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'#555', fontSize:'0.83rem', marginTop:'1.25rem' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsRegister(!isRegister); setError('') }}
            style={{ color:'#e8c547', background:'none', border:'none', cursor:'pointer', fontWeight:'600', padding:0, fontFamily:'inherit' }}>
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
