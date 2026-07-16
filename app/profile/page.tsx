'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile as updateFirebaseProfile } from 'firebase/auth'
import { db, storage, auth } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'
import { linkifyText } from '../../lib/linkify'

const GREEN = '#00e676'

interface ProfileData {
  name: string
  bio: string
  photo: string
  coverPhoto: string
  createdAt?: any
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [editing, setEditing] = useState(false)

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  const fetchProfile = async () => {
    if (!user) return
    setFetching(true)
    setFetchError('')
    try {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data() as ProfileData
        setProfile(data)
        setName(data.name || '')
        setBio(data.bio || '')
      }
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        setFetchError('Could not load your profile — permission denied. Check Firestore security rules.')
      } else {
        setFetchError('Could not load your profile. Check your connection and try again.')
      }
    }
    setFetching(false)
  }

  useEffect(() => {
    if (user) fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setError('')
    if (!name.trim()) {
      setError('Name cannot be empty.')
      return
    }
    if (bio.length > 280) {
      setError('Bio must be 280 characters or fewer.')
      return
    }
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        bio: bio.trim(),
      }, { merge: true })

      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, { displayName: name.trim() })
      }

      setProfile(prev => prev ? { ...prev, name: name.trim(), bio: bio.trim() } : prev)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Could not save changes. Please try again.')
    }
    setSaving(false)
  }

  const handleImageUpload = async (file: File, kind: 'avatar' | 'cover') => {
    if (!user) return
    if (!storage) {
      setError('Photo uploads are not available yet — storage is not enabled for this project.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.')
      return
    }

    setError('')
    kind === 'avatar' ? setAvatarUploading(true) : setCoverUploading(true)

    try {
      const path = kind === 'avatar' ? `avatars/${user.uid}` : `covers/${user.uid}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      const field = kind === 'avatar' ? 'photo' : 'coverPhoto'
      await setDoc(doc(db, 'users', user.uid), { [field]: url }, { merge: true })

      if (kind === 'avatar' && auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, { photoURL: url })
      }

      setProfile(prev => prev ? { ...prev, [field]: url } : prev)
    } catch {
      setError(`Could not upload ${kind === 'avatar' ? 'profile photo' : 'cover photo'}. Please try again.`)
    }

    kind === 'avatar' ? setAvatarUploading(false) : setCoverUploading(false)
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

  if (fetchError) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <p style={{ color: '#fca5a5', fontSize: '.9rem', marginBottom: '1.25rem' }}>{fetchError}</p>
          <button
            onClick={fetchProfile}
            style={{ padding: '.7rem 1.5rem', background: GREEN, color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const memberSince = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .cover-upload-btn, .avatar-upload-btn{
          position:absolute;background:rgba(0,0,0,.65);color:#fff;
          border:1px solid rgba(255,255,255,.16);border-radius:8px;
          cursor:pointer;font-size:.78rem;font-family:inherit;
          display:flex;align-items:center;gap:6px;transition:all .2s;
          backdrop-filter:blur(10px);
        }
        .cover-upload-btn:hover, .avatar-upload-btn:hover{background:rgba(0,0,0,.85)}

        .field-input{
          width:100%;padding:.85rem 1rem;background:rgba(255,255,255,.035);
          border:1px solid rgba(255,255,255,.09);border-radius:10px;
          color:#fff;font-size:.94rem;outline:none;font-family:inherit;
          transition:border-color .2s;
        }
        .field-input:focus{border-color:${GREEN}66}
        .field-input::placeholder{color:rgba(255,255,255,.2)}
        textarea.field-input{resize:vertical;min-height:90px;line-height:1.65}

        .btn-green{
          padding:.8rem 1.85rem;background:${GREEN};color:#000;border:none;
          border-radius:10px;font-weight:700;font-size:.9rem;cursor:pointer;
          font-family:inherit;transition:background .2s;
        }
        .btn-green:hover:not(:disabled){background:#00c853}
        .btn-green:disabled{opacity:.6;cursor:not-allowed}

        .btn-ghost{
          padding:.8rem 1.85rem;background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);
          border:1px solid rgba(255,255,255,.12);border-radius:10px;font-weight:600;
          font-size:.9rem;cursor:pointer;font-family:inherit;transition:all .2s;
        }
        .btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.06)}

        .stat-block{ text-align:center }
        .stat-num{ font-size:1.3rem; font-weight:800; letter-spacing:-.02em }
        .stat-label{ font-size:.7rem; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.06em; margin-top:3px }

        .section-card{
          background:#0a0a0a;border:1px solid rgba(255,255,255,.07);
          border-radius:16px;padding:1.5rem;
        }

        .settings-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.05);
        }
        .settings-row:last-child{ border-bottom:none }

        .signout-btn{
          width:100%;padding:.85rem;background:rgba(248,113,113,.06);
          border:1px solid rgba(248,113,113,.18);border-radius:10px;
          color:#fca5a5;font-weight:600;font-size:.88rem;cursor:pointer;
          font-family:inherit;transition:all .2s;
        }
        .signout-btn:hover{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.3)}
        .signout-btn:disabled{opacity:.6;cursor:not-allowed}

        @media(max-width:900px){ .app-sidebar{display:none!important} }
        @media(max-width:700px){ .profile-main{ padding-bottom:5.5rem!important } }
      `}</style>

      <Sidebar />

      <main className="profile-main" style={{ flex: 1, maxWidth: '780px', margin: '0 auto', paddingBottom: '4rem' }}>

        <div style={{
          marginTop: '1.5rem', marginLeft: '1.5rem', marginRight: '1.5rem',
          height: '230px', position: 'relative',
          background: profile?.coverPhoto
            ? `url(${profile.coverPhoto}) center/cover`
            : 'linear-gradient(135deg, #001f10 0%, #003d22 50%, #00552e 100%)',
          borderRadius: '20px', overflow: 'hidden',
          animation: 'fadeUp .5s ease',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(0,230,118,.12), transparent 60%)' }} />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
          />
          <button
            className="cover-upload-btn"
            style={{ bottom: '14px', right: '14px', padding: '.55rem .95rem' }}
            onClick={() => coverInputRef.current?.click()}
            disabled={coverUploading}
          >
            {coverUploading ? 'Uploading...' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Change cover
              </>
            )}
          </button>
        </div>

        <div style={{ padding: '0 1.5rem', marginTop: '-56px', position: 'relative', animation: 'fadeUp .6s ease' }}>
          <div style={{ position: 'relative', width: '112px' }}>
            <div style={{
              width: '112px', height: '112px', borderRadius: '50%',
              border: '4px solid #000', overflow: 'hidden',
              background: 'rgba(0,230,118,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,.5)',
            }}>
              {profile?.photo ? (
                <img src={profile.photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2.3rem', fontWeight: '700', color: GREEN }}>
                  {(profile?.name || user.email || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
            />
            <button
              className="avatar-upload-btn"
              style={{ bottom: '4px', right: '-4px', width: '34px', height: '34px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              aria-label="Change profile photo"
            >
              {avatarUploading ? (
                <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              )}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              {!editing && (
                <>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-.028em', display: 'flex', alignItems: 'center', gap: '9px' }}>
                    {profile?.name || 'User'}
                    <svg width="21" height="21" viewBox="0 0 24 24" fill={GREEN} aria-label="Verified">
                      <path d="M12 1l2.4 2.4L18 2.6l.8 3.6 3.6.8-.8 3.6L24 12l-2.4 2.4.8 3.6-3.6.8-.8 3.6-3.6-.8L12 24l-2.4-2.4L6 22.4l-.8-3.6-3.6-.8.8-3.6L0 12l2.4-2.4L1.6 6l3.6-.8L6 1.6l3.6.8z"/>
                      <path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,.42)', fontSize: '.9rem', marginTop: '.3rem' }}>{user.email}</p>
                  {memberSince && (
                    <p style={{ color: 'rgba(255,255,255,.28)', fontSize: '.8rem', marginTop: '.45rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Member since {memberSince}
                    </p>
                  )}
                </>
              )}
            </div>

            {!editing && (
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div className="stat-block">
                  <p className="stat-num">0</p>
                  <p className="stat-label">Listings</p>
                </div>
                <div className="stat-block">
                  <p className="stat-num">0</p>
                  <p className="stat-label">Sold</p>
                </div>
                <div className="stat-block">
                  <p className="stat-num">—</p>
                  <p className="stat-label">Rating</p>
                </div>
              </div>
            )}
          </div>

          {!editing ? (
            <>
              {profile?.bio && (
                <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.95rem', lineHeight: 1.8, marginTop: '1.35rem', maxWidth: '560px' }}>
                  {linkifyText(profile.bio, GREEN)}
                </p>
              )}
              <button className="btn-ghost" style={{ marginTop: '1.5rem' }} onClick={() => setEditing(true)}>
                Edit profile
              </button>
            </>
          ) : (
            <div style={{ maxWidth: '560px', marginTop: '1.25rem' }}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.45rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Name</label>
                <input className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.45rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                  Bio <span style={{ color: 'rgba(255,255,255,.2)', textTransform: 'none', fontWeight: '400' }}>({bio.length}/280)</span>
                </label>
                <textarea
                  className="field-input"
                  value={bio}
                  onChange={e => setBio(e.target.value.slice(0, 280))}
                  placeholder="Tell buyers and sellers a bit about yourself"
                />
              </div>

              {error && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '8px', color: '#fca5a5', fontSize: '.83rem', marginBottom: '1.1rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '.75rem' }}>
                <button className="btn-green" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditing(false)
                    setName(profile?.name || '')
                    setBio(profile?.bio || '')
                    setError('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {saved && (
            <p style={{ color: GREEN, fontSize: '.83rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Profile updated
            </p>
          )}
        </div>

        {!editing && (
          <div style={{ padding: '2.5rem 1.5rem 0' }}>
            <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '1rem' }}>
              Account
            </p>
            <div className="section-card">
              <div className="settings-row">
                <div>
                  <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Appearance & preferences</p>
                  <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.35)', marginTop: '2px' }}>Coming soon</p>
                </div>
                <span style={{ fontSize: '.65rem', color: 'rgba(0,230,118,.6)', background: 'rgba(0,230,118,.08)', padding: '3px 9px', borderRadius: '100px', fontWeight: '600' }}>soon</span>
              </div>
              <div className="settings-row">
                <div>
                  <p style={{ fontSize: '.9rem', fontWeight: '600' }}>Email</p>
                  <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.35)', marginTop: '2px' }}>{user.email}</p>
                </div>
              </div>
            </div>

            <button className="signout-btn" onClick={handleSignOut} disabled={signingOut} style={{ marginTop: '1.25rem' }}>
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
