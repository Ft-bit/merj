'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { updateProfile as updateFirebaseProfile } from 'firebase/auth'
import { db, auth } from '../lib/firebase'

const GREEN = '#00e676'

function needsUsername(name?: string) {
  const n = (name || '').trim().toLowerCase()
  return n === '' || n === 'user'
}

export default function UsernameGate() {
  const { user } = useAuth()
  const [checked, setChecked] = useState(false)
  const [required, setRequired] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      setChecked(false)
      setRequired(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        const name = snap.exists() ? snap.data().name : ''
        if (!cancelled) {
          setRequired(needsUsername(name))
          setChecked(true)
        }
      } catch {
        if (!cancelled) setChecked(true)
      }
    })()
    return () => { cancelled = true }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setError('')
    const trimmed = value.trim()
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.')
      return
    }
    if (trimmed.length > 30) {
      setError('Username must be 30 characters or fewer.')
      return
    }
    if (!/^[a-zA-Z0-9 _.'-]+$/.test(trimmed)) {
      setError('Only letters, numbers, spaces, and basic punctuation are allowed.')
      return
    }
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), { name: trimmed }, { merge: true })
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, { displayName: trimmed })
      }
      setRequired(false)
    } catch {
      setError('Could not save. Please try again.')
    }
    setSaving(false)
  }

  if (!checked || !required) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    }}>
      <style>{`@keyframes gateIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
      <div style={{
        background: '#0d0d0d', border: '1px solid rgba(255,255,255,.09)',
        borderRadius: '20px', padding: '2.25rem 2rem', width: '100%', maxWidth: '380px',
        animation: 'gateIn .35s cubic-bezier(.22,1,.36,1)', color: '#fff',
      }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', color: '#000', marginBottom: '1.25rem' }}>M</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '.5rem', letterSpacing: '-.02em' }}>Choose your name</h2>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          This is how buyers, sellers, and your chats will see you on Merj.
        </p>

        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Your name"
          style={{
            width: '100%', padding: '.85rem 1rem', background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.1)', borderRadius: '10px',
            color: '#fff', fontSize: '.95rem', outline: 'none', fontFamily: 'inherit', marginBottom: '.75rem',
          }}
        />

        {error && (
          <p style={{ color: '#fca5a5', fontSize: '.82rem', marginBottom: '.75rem' }}>{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: '.85rem', background: GREEN, color: '#000',
            border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '.92rem',
            cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? .7 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
