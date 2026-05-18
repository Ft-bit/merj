'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
    }
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const base: React.CSSProperties = {
  background: '#000',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
}

const card: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: '20px',
  padding: '2.25rem',
  width: '100%',
  maxWidth: '420px',
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '.85rem 1rem',
  background: '#111',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color .2s',
}

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resendVerification, checkVerification } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      await loginWithGoogle()
      router.push('/dashboard')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/popup-closed-by-user') setError('Popup closed — please try again.')
      else if (code === 'auth/unauthorized-domain') setError('Add this domain to Firebase Console → Auth → Authorized Domains.')
      else setError('Google sign-in failed. Try again.')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (tab === 'register') {
        await registerWithEmail(email, password, name)
        setShowVerify(true)
      } else {
        const { needsVerification } = await loginWithEmail(email, password)
        if (needsVerification) { setShowVerify(true) }
        else router.push('/dashboard')
      }
    } catch (e: any) {
      const c = e?.code || ''
      if (c === 'auth/invalid-credential' || c === 'auth/wrong-password') setError('Incorrect email or password.')
      else if (c === 'auth/email-already-in-use') setError('An account with this email already exists.')
      else if (c === 'auth/weak-password') setError('Password must be at least 6 characters.')
      else if (c === 'auth/user-not-found') setError('No account found with this email.')
      else if (c === 'auth/too-many-requests') setError('Too many attempts. Please wait a moment.')
      else setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  /* ─── EMAIL VERIFICATION SCREEN ─── */
  if (showVerify) {
    return (
      <div style={{ ...base, background:'#000' }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
          .verify-card { animation: fadeUp .5s ease; }
          .code-ring { animation: spin 1.5s linear infinite; }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>
        <div className="verify-card" style={{ ...card, textAlign:'center', maxWidth:'400px' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(232,197,71,.1)', border:'2px solid rgba(232,197,71,.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', fontSize:'1.8rem' }}>
            📧
          </div>
          <h2 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:'700', marginBottom:'.6rem', letterSpacing:'-.02em' }}>Check your email</h2>
          <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.9rem', lineHeight:1.7, marginBottom:'1.75rem' }}>
            We sent a verification link to<br />
            <strong style={{ color:'#e8c547' }}>{email}</strong>
          </p>

          {/* Steps */}
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'12px', padding:'1.25rem', marginBottom:'1.5rem', textAlign:'left' }}>
            {[
              { n:'1', t:'Open your email inbox' },
              { n:'2', t:'Click the verification link from Merj' },
              { n:'3', t:'Come back and click "I\'ve verified" below' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'.5rem 0', borderBottom: s.n !== '3' ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(232,197,71,.15)', border:'1px solid rgba(232,197,71,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:'700', color:'#e8c547', flexShrink:0 }}>{s.n}</div>
                <span style={{ fontSize:'.88rem', color:'rgba(255,255,255,.55)' }}>{s.t}</span>
              </div>
            ))}
          </div>

          <button
            onClick={async () => { setChecking(true); const v = await checkVerification(); if (v) router.push('/dashboard'); else setError('Not verified yet — check your inbox.'); setChecking(false) }}
            disabled={checking}
            style={{ width:'100%', padding:'.9rem', background:'#e8c547', color:'#000', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'.95rem', cursor:'pointer', marginBottom:'.75rem', fontFamily:'inherit', opacity:checking?.7:1, letterSpacing:'.02em' }}
          >
            {checking ? 'Checking...' : "I've verified my email →"}
          </button>

          <button
            onClick={async () => { setResendSent(false); await resendVerification(); setResendSent(true); setTimeout(() => setResendSent(false), 4000) }}
            style={{ width:'100%', padding:'.85rem', background:'transparent', color:resendSent?'#4ade80':'rgba(255,255,255,.35)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'10px', fontWeight:'500', fontSize:'.88rem', cursor:'pointer', fontFamily:'inherit', transition:'all .25s' }}
          >
            {resendSent ? '✓ Sent! Check your inbox.' : 'Resend verification email'}
          </button>

          {error && <p style={{ color:'#f87171', fontSize:'.83rem', marginTop:'1rem' }}>{error}</p>}

          <p style={{ color:'rgba(255,255,255,.2)', fontSize:'.78rem', marginTop:'1.25rem', lineHeight:1.6 }}>
            Check spam/junk folder if you don&apos;t see it.
          </p>
        </div>
      </div>
    )
  }

  /* ─── MAIN LOGIN SCREEN ─── */
  return (
    <div style={base}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .login-card { animation: fadeUp .5s ease; }
        .inp-field:focus { border-color: rgba(232,197,71,.5) !important; }
        .tab-btn { background:none; border:none; cursor:pointer; font-family:inherit; font-size:.9rem; font-weight:600; padding:0 0 .75rem; position:relative; transition:color .2s; }
        .tab-btn.active { color:#fff; }
        .tab-btn.active::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#e8c547; border-radius:2px; }
        .tab-btn.inactive { color:rgba(255,255,255,.3); }
        .tab-btn.inactive:hover { color:rgba(255,255,255,.6); }
        .pw-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,.3); cursor:pointer; padding:4px; line-height:0; transition:color .2s; }
        .pw-toggle:hover { color:rgba(255,255,255,.7); }
        .google-btn { width:100%; padding:.85rem; background:#fff; color:#111; border:none; border-radius:10px; font-weight:600; font-size:.92rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; font-family:inherit; transition:all .2s; }
        .google-btn:hover { background:#f0f0f0; transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,255,255,.12); }
        .submit-btn { width:100%; padding:.9rem; background:#e8c547; color:#000; border:none; border-radius:10px; font-weight:700; font-size:.95rem; cursor:pointer; font-family:inherit; transition:all .2s; letter-spacing:.02em; }
        .submit-btn:hover:not(:disabled) { background:#f0d060; transform:translateY(-2px); box-shadow:0 10px 28px rgba(232,197,71,.35); }
        .submit-btn:disabled { opacity:.6; cursor:not-allowed; }
      `}</style>

      <div className="login-card" style={card}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'2rem' }}>
          <div style={{ width:'28px', height:'28px', background:'#e8c547', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'13px', color:'#000' }}>M</div>
          <span style={{ fontWeight:'800', fontSize:'1.05rem', letterSpacing:'-.02em', color:'#fff' }}>Merj</span>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'1.75rem', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:'1.75rem' }}>
          <button className={`tab-btn ${tab === 'signin' ? 'active' : 'inactive'}`} onClick={() => { setTab('signin'); setError('') }}>Sign in</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : 'inactive'}`} onClick={() => { setTab('register'); setError('') }}>Create account</button>
        </div>

        {/* Headline */}
        <div style={{ marginBottom:'1.5rem' }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:'700', color:'#fff', marginBottom:'.35rem', letterSpacing:'-.02em' }}>
            {tab === 'signin' ? 'Welcome back' : 'Join Merj'}
          </h2>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.88rem' }}>
            {tab === 'signin' ? 'Sign in to your account' : 'Start buying and selling websites'}
          </p>
        </div>

        {/* Google */}
        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'1.25rem 0' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
          <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.8rem' }}>or</span>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          {tab === 'register' && (
            <div>
              <label style={{ display:'block', fontSize:'.8rem', fontWeight:'500', color:'rgba(255,255,255,.4)', marginBottom:'.4rem', letterSpacing:'.02em' }}>FULL NAME</label>
              <input
                className="inp-field" type="text" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} required
                style={inp}
              />
            </div>
          )}

          <div>
            <label style={{ display:'block', fontSize:'.8rem', fontWeight:'500', color:'rgba(255,255,255,.4)', marginBottom:'.4rem', letterSpacing:'.02em' }}>EMAIL</label>
            <input
              className="inp-field" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
              style={inp}
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'.8rem', fontWeight:'500', color:'rgba(255,255,255,.4)', marginBottom:'.4rem', letterSpacing:'.02em' }}>PASSWORD</label>
            <div style={{ position:'relative' }}>
              <input
                className="inp-field"
                type={showPw ? 'text' : 'password'}
                placeholder={tab === 'register' ? 'Min. 6 characters' : '••••••••'}
                value={password} onChange={e => setPassword(e.target.value)} required
                style={{ ...inp, paddingRight:'2.8rem' }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {tab === 'signin' && (
            <div style={{ textAlign:'right' }}>
              <button type="button" style={{ background:'none', border:'none', color:'rgba(232,197,71,.7)', fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit', padding:0 }}>
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'.75rem', background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)', borderRadius:'8px' }}>
              <span style={{ fontSize:'.85rem' }}>⚠️</span>
              <p style={{ color:'#f87171', fontSize:'.83rem', margin:0 }}>{error}</p>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop:'.25rem' }}>
            {loading ? 'Please wait...' : tab === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {tab === 'register' && (
          <p style={{ color:'rgba(255,255,255,.2)', fontSize:'.78rem', marginTop:'1.25rem', lineHeight:1.6, textAlign:'center' }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </div>
    </div>
  )
}
