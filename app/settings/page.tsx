'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

interface Preferences {
  notifyMessages: boolean
  notifyListings: boolean
  compactLists: boolean
}

const DEFAULT_PREFS: Preferences = {
  notifyMessages: true,
  notifyListings: true,
  compactLists: false,
}

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      aria-pressed={on}
      style={{
        width: '44px', height: '26px', borderRadius: '100px', border: 'none',
        background: on ? GREEN : 'rgba(255,255,255,.15)', position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'background .2s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px', left: on ? '21px' : '3px', transition: 'left .2s',
      }} />
    </button>
  )
}

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [fetching, setFetching] = useState(true)
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const [isAdmin, setIsAdmin] = useState(false)
  const [announceTitle, setAnnounceTitle] = useState('')
  const [announceBody, setAnnounceBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          if (snap.data().preferences) {
            setPrefs({ ...DEFAULT_PREFS, ...snap.data().preferences })
          }
          setIsAdmin(snap.data().role === 'admin')
        }
      } catch {
        // Defaults stay in place if this fails — not worth blocking the page over.
      }
      setFetching(false)
    })()
  }, [user])

  const updatePref = async (key: keyof Preferences) => {
    if (!user) return
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    setSavingKey(key)
    setError('')
    try {
      await setDoc(doc(db, 'users', user.uid), { preferences: next }, { merge: true })
    } catch {
      setPrefs(prefs)
      setError('Could not save that change. Please try again.')
    }
    setSavingKey(null)
  }

  const handleBroadcast = async () => {
    if (!announceTitle.trim() || !announceBody.trim()) {
      setSendResult('Add both a title and a message before sending.')
      return
    }
    setSending(true)
    setSendResult('')
    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      const recipients = usersSnap.docs.map(d => d.id)
      await Promise.all(
        recipients.map(uid =>
          addDoc(collection(db, 'notifications'), {
            userId: uid,
            type: 'announcement',
            title: announceTitle.trim(),
            body: announceBody.trim(),
            read: false,
            createdAt: serverTimestamp(),
          })
        )
      )
      setSendResult(`Sent to ${recipients.length} user${recipients.length === 1 ? '' : 's'}.`)
      setAnnounceTitle('')
      setAnnounceBody('')
    } catch {
      setSendResult('Could not send the announcement. Please try again.')
    }
    setSending(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await logout()
    router.push('/login')
  }

  if (loading || fetching) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .section-card{
          background:#0a0a0a;border:1px solid rgba(255,255,255,.07);
          border-radius:16px;padding:1.5rem;
        }
        .settings-row{
          display:flex;align-items:center;justify-content:space-between;gap:1rem;
          padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.05);
        }
        .settings-row:last-child{ border-bottom:none }

        .link-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:1rem 0;cursor:pointer;transition:opacity .15s;
        }
        .link-row:hover{opacity:.75}

        .signout-btn{
          width:100%;padding:.85rem;background:rgba(248,113,113,.06);
          border:1px solid rgba(248,113,113,.18);border-radius:10px;
          color:#fca5a5;font-weight:600;font-size:.88rem;cursor:pointer;
          font-family:inherit;transition:all .2s;
        }
        .signout-btn:hover{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.3)}
        .signout-btn:disabled{opacity:.6;cursor:not-allowed}

        @media(max-width:900px){ .app-sidebar{display:none!important} }
        @media(max-width:700px){ .settings-main{ padding-bottom:5.5rem!important } }
      `}</style>

      <Sidebar />

      <main className="settings-main" style={{ flex: 1, maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', animation: 'fadeUp .4s ease' }}>
        <button
          onClick={() => router.push('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: '1.5rem' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Profile
        </button>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-.025em', marginBottom: '2rem' }}>Settings</h1>

        {error && (
          <div style={{ padding: '.75rem 1rem', background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '8px', color: '#fca5a5', fontSize: '.83rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '.85rem' }}>
          Account
        </p>
        <div className="section-card" style={{ marginBottom: '2rem' }}>
          <div className="settings-row">
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Email</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>{user.email}</p>
            </div>
          </div>
          <div className="link-row" onClick={() => router.push('/profile')}>
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Edit profile</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>Name, bio, photo, cover</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div className="link-row" onClick={() => router.push('/login')}>
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Change password</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>Send yourself a reset link</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '.85rem' }}>
          Notifications
        </p>
        <div className="section-card" style={{ marginBottom: '2rem' }}>
          <div className="settings-row">
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>New messages</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>Get notified when someone messages you</p>
            </div>
            <Toggle on={prefs.notifyMessages} onChange={() => updatePref('notifyMessages')} disabled={savingKey === 'notifyMessages'} />
          </div>
          <div className="settings-row">
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Listing activity</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>Offers, sales, and updates on your listings</p>
            </div>
            <Toggle on={prefs.notifyListings} onChange={() => updatePref('notifyListings')} disabled={savingKey === 'notifyListings'} />
          </div>
          <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)', paddingTop: '.5rem' }}>
            These control whether notifications reach you once Merj's notification system is live — your preference is saved now either way.
          </p>
        </div>

        <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '.85rem' }}>
          Appearance
        </p>
        <div className="section-card" style={{ marginBottom: '2rem' }}>
          <div className="settings-row">
            <div>
              <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Compact lists</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '2px' }}>Tighter spacing in your inbox and listings</p>
            </div>
            <Toggle on={prefs.compactLists} onChange={() => updatePref('compactLists')} disabled={savingKey === 'compactLists'} />
          </div>
          <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)', paddingTop: '.5rem' }}>
            Merj uses a fixed dark theme with green accents — this isn't changeable, by design.
          </p>
        </div>

        {isAdmin && (
          <>
            <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '.85rem' }}>
              Admin
            </p>
            <div className="section-card" style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '.9rem', fontWeight: '600', marginBottom: '.3rem' }}>Send announcement to everyone</p>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginBottom: '1rem' }}>
                Every registered user will get this as a notification.
              </p>

              <input
                value={announceTitle}
                onChange={e => setAnnounceTitle(e.target.value)}
                placeholder="Title"
                style={{ width: '100%', padding: '.75rem 1rem', background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '10px', color: '#fff', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', marginBottom: '.75rem' }}
              />
              <textarea
                value={announceBody}
                onChange={e => setAnnounceBody(e.target.value)}
                placeholder="What do you want to tell everyone?"
                style={{ width: '100%', padding: '.75rem 1rem', background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '10px', color: '#fff', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', minHeight: '90px', resize: 'vertical', marginBottom: '.75rem' }}
              />

              {sendResult && (
                <p style={{ fontSize: '.82rem', color: sendResult.startsWith('Sent') ? GREEN : '#fca5a5', marginBottom: '.75rem' }}>
                  {sendResult}
                </p>
              )}

              <button
                onClick={handleBroadcast}
                disabled={sending}
                style={{ padding: '.75rem 1.75rem', background: GREEN, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', opacity: sending ? .7 : 1 }}
              >
                {sending ? 'Sending...' : 'Send to everyone'}
              </button>
            </div>
          </>
        )}

        <button className="signout-btn" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </main>
    </div>
  )
}
