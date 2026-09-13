'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

const GREEN = '#00e676'

function AuthActionInner() {
  const params = useSearchParams()
  const modeParam = params.get('mode')
  const oobCode = params.get('oobCode')
  // Set by our own API routes on the continueUrl (?type=verify / ?type=reset),
  // since Firebase's own hosted page strips mode/oobCode before handing off
  // to this "Continue" link — this is how we know which action just
  // completed even though we didn't get to process the code ourselves.
  const typeParam = params.get('type')

  const [status, setStatus] = useState<'working' | 'success' | 'error' | 'ready-to-reset'>('working')
  const [errorMsg, setErrorMsg] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirming, setConfirming] = useState(false)

  // Used for rendering: when we have a real oobCode, this reflects what
  // Firebase told us via `mode`. When we're on the codeless "continue" leg
  // (Firebase's own page already did the work), we fall back to whichever
  // type our own link was tagged with.
  const effectiveMode = oobCode
    ? modeParam
    : typeParam === 'verify'
      ? 'verifyEmail'
      : typeParam === 'reset'
        ? 'resetPassword'
        : null

  useEffect(() => {
    if (!oobCode) {
      if (typeParam === 'verify' || typeParam === 'reset') {
        // Firebase's own default page already completed the action before
        // handing off to us — nothing left to do but show success.
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg('Missing verification code. This link looks incomplete.')
      }
      return
    }

    if (modeParam === 'verifyEmail') {
      applyActionCode(auth, oobCode)
        .then(() => setStatus('success'))
        .catch(() => {
          setStatus('error')
          setErrorMsg('This link is invalid or has expired. Request a new one from the app.')
        })
    } else if (modeParam === 'resetPassword') {
      verifyPasswordResetCode(auth, oobCode)
        .then(em => {
          setEmail(em)
          setStatus('ready-to-reset')
        })
        .catch(() => {
          setStatus('error')
          setErrorMsg('This link is invalid or has expired. Request a new one from the app.')
        })
    } else {
      setStatus('error')
      setErrorMsg('Unknown request type.')
    }
  }, [modeParam, oobCode, typeParam])

  const handleReset = async () => {
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    setConfirming(true)
    setErrorMsg('')
    try {
      await confirmPasswordReset(auth, oobCode as string, newPassword)
      setStatus('success')
    } catch {
      setErrorMsg('Could not reset your password. The link may have expired.')
    }
    setConfirming(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '30px', height: '30px', background: GREEN, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', color: '#000' }}>M</div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Merj</span>
        </div>

        {status === 'working' && (
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem' }}>Verifying…</p>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.5rem' }}>Something went wrong</h2>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem' }}>{errorMsg}</p>
          </>
        )}

        {status === 'success' && effectiveMode === 'verifyEmail' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.5rem' }}>Email verified!</h2>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
              Your account is ready. Head back to the app to continue.
            </p>
            <a href="merjnativeapp://login" style={{ display: 'block', width: '100%', padding: '.9rem', background: GREEN, color: '#000', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', boxSizing: 'border-box' }}>
              Open Merj app
            </a>
          </>
        )}

        {status === 'ready-to-reset' && (
          <>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.3rem' }}>Reset your password</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginBottom: '1.5rem' }}>for {email}</p>
            <input
              type="password"
              placeholder="New password (min. 6 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '.85rem 1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', color: '#fff', marginBottom: '1rem', fontSize: '.95rem', boxSizing: 'border-box' }}
            />
            {errorMsg && <p style={{ color: '#f87171', fontSize: '.83rem', marginBottom: '1rem' }}>{errorMsg}</p>}
            <button
              onClick={handleReset}
              disabled={confirming}
              style={{ width: '100%', padding: '.9rem', background: GREEN, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: confirming ? .7 : 1 }}
            >
              {confirming ? 'Saving…' : 'Reset password'}
            </button>
          </>
        )}

        {status === 'success' && effectiveMode === 'resetPassword' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '.5rem' }}>Password updated</h2>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
              Head back to the app and sign in with your new password.
            </p>
            <a href="merjnativeapp://login" style={{ display: 'block', width: '100%', padding: '.9rem', background: GREEN, color: '#000', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', boxSizing: 'border-box' }}>
              Open Merj app
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#060606' }} />}>
      <AuthActionInner />
    </Suspense>
  )
}
