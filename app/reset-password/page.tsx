'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import { auth } from '../../lib/firebase'

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

function ResetPasswordInner() {
  const params = useSearchParams()
  const router = useRouter()
  const oobCode = params.get('oobCode') || ''

  // 'checking' -> verifying the code with Firebase
  // 'ready'    -> code valid, show the new-password form
  // 'invalid'  -> code missing/expired/already used
  // 'done'     -> password successfully changed
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid' | 'done'>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid')
      return
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail)
        setStatus('ready')
      })
      .catch(() => {
        setStatus('invalid')
      })
  }, [oobCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, password)
      setStatus('done')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/expired-action-code') setError('This reset link has expired. Request a new one.')
      else if (code === 'auth/invalid-action-code') setError('This reset link was already used or is invalid.')
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.')
      else setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes orbPulse{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.12;transform:scale(1.1)}}
        @keyframes spin{to{transform:rotate(360deg)}}

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

        .eye-btn{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;color:rgba(255,255,255,.3);
          cursor:pointer;padding:4px;line-height:0;transition:color .2s;
        }
        .eye-btn:hover{color:rgba(255,255,255,.7)}

        .link-btn{
          background:none;border:none;color:${GREEN};cursor:pointer;
          font-weight:600;font-family:inherit;font-size:.9rem;
        }
      `}</style>

      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,230,118,.07)', top: '-150px', right: '-150px', filter: 'blur(100px)', animation: 'orbPulse 5s ease-in-out infinite', pointerEvents: 'none' }} />

      <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '420px', textAlign: 'center', animation: 'fadeUp .5s ease', color: '#fff', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', marginBottom: '1.75rem' }}>
          <div style={{ width: '28px', height: '28px', background: GREEN, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#000' }}>M</div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-.03em' }}>Merj</span>
        </div>

        {status === 'checking' && (
          <>
            <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '1rem auto 1.5rem' }} />
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem' }}>Verifying your reset link...</p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(248,113,113,.1)', border: '2px solid rgba(248,113,113,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.6rem' }}>Link expired or invalid</h2>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              This password reset link is no longer valid. Request a new one from the sign-in page.
            </p>
            <button className="btn-main" onClick={() => router.push('/login')}>Back to sign in</button>
          </>
        )}

        {status === 'ready' && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '.4rem' }}>Set a new password</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.88rem', marginBottom: '1.75rem' }}>
              For <strong style={{ color: GREEN }}>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <input className="inp" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '2.8rem' }} />
                  <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                    {showPw ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Confirm password</label>
                <input className="inp" type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>

              {error && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '8px', color: '#fca5a5', fontSize: '.83rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-main" disabled={loading}>
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </>
        )}

        {status === 'done' && (
          <>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,230,118,.1)', border: '2px solid rgba(0,230,118,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>✓</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.6rem' }}>Password updated</h2>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              You can now sign in with your new password.
            </p>
            <button className="btn-main" onClick={() => router.push('/login')}>Go to sign in</button>
          </>
        )}
      </div>
    </div>
  )
}

// Wrapped in Suspense because useSearchParams requires it in the app router
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <ResetPasswordInner />
    </Suspense>
  )
}
