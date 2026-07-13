'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile as updateFirebaseProfile } from 'firebase/auth'
import { db, storage, auth } from '../../lib/firebase'

const GREEN = '#00e676'

interface ProfileData {
  name: string
  bio: string
  photo: string
  coverPhoto: string
  createdAt?: any
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing] = useState(false)

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data() as ProfileData
        setProfile(data)
        setName(data.name || '')
        setBio(data.bio || '')
      }
      setFetching(false)
    }
    fetchProfile()
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
      const path = kind === 'avatar'
        ? `avatars/${user.uid}`
        : `covers/${user.uid}`
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

  if (loading || fetching) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user) return null

  const memberSince = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .back-btn{
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
          border-radius:8px;color:rgba(255,255,255,.6);cursor:pointer;
          font-size:.83rem;font-family:inherit;padding:.5rem 1rem;
          display:flex;align-items:center;gap:6px;transition:all .2s;
        }
        .back-btn:hover{color:#fff;background:rgba(255,255,255,.1)}

        .cover-upload-btn, .avatar-upload-btn{
          position:absolute;background:rgba(0,0,0,.6);color:#fff;
          border:1px solid rgba(255,255,255,.2);border-radius:8px;
          cursor:pointer;font-size:.78rem;font-family:inherit;
          display:flex;align-items:center;gap:6px;transition:all .2s;
          backdrop-filter:blur(8px);
        }
        .cover-upload-btn:hover, .avatar-upload-btn:hover{background:rgba(0,0,0,.8)}

        .field-input{
          width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);border-radius:10px;
          color:#fff;font-size:.92rem;outline:none;font-family:inherit;
          transition:border-color .2s;
        }
        .field-input:focus{border-color:${GREEN}66}
        .field-input::placeholder{color:rgba(255,255,255,.22)}

        textarea.field-input{resize:vertical;min-height:80px;line-height:1.6}

        .btn-green{
          padding:.75rem 1.75rem;background:${GREEN};color:#000;border:none;
          border-radius:8px;font-weight:700;font-size:.88rem;cursor:pointer;
          font-family:inherit;transition:all .2s;
        }
        .btn-green:hover:not(:disabled){background:#00c853}
        .btn-green:disabled{opacity:.6;cursor:not-allowed}

        .btn-ghost{
          padding:.75rem 1.75rem;background:transparent;color:rgba(255,255,255,.5);
          border:1px solid rgba(255,255,255,.14);border-radius:8px;font-weight:600;
          font-size:.88rem;cursor:pointer;font-family:inherit;transition:all .2s;
        }
        .btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,.3)}
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '3rem' }}>

        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <button className="back-btn" onClick={() => router.push('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Dashboard
          </button>
        </div>

        <div style={{
          marginTop: '1.5rem', height: '200px', position: 'relative',
          background: profile?.coverPhoto
            ? `url(${profile.coverPhoto}) center/cover`
            : 'linear-gradient(135deg, #001f10, #003d22, #006633)',
          borderRadius: '16px', overflow: 'hidden',
          animation: 'fadeUp .5s ease',
        }}>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
          />
          <button
            className="cover-upload-btn"
            style={{ bottom: '12px', right: '12px', padding: '.5rem .9rem' }}
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

        <div style={{ padding: '0 1.5rem', marginTop: '-48px', position: 'relative', animation: 'fadeUp .6s ease' }}>
          <div style={{ position: 'relative', width: '96px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              border: '4px solid #000', overflow: 'hidden',
              background: `rgba(0,230,118,.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {profile?.photo ? (
                <img src={profile.photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: '700', color: GREEN }}>
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
              style={{ bottom: '2px', right: '-6px', width: '30px', height: '30px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              aria-label="Change profile photo"
            >
              {avatarUploading ? (
                <div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              )}
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {!editing ? (
              <>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-.02em' }}>{profile?.name || 'User'}</h1>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.88rem', marginTop: '.2rem' }}>{user.email}</p>
                {memberSince && (
                  <p style={{ color: 'rgba(255,255,255,.28)', fontSize: '.8rem', marginTop: '.4rem' }}>Member since {memberSince}</p>
                )}
                {profile?.bio && (
                  <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.92rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '520px' }}>{profile.bio}</p>
                )}
                <button
                  className="btn-ghost"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setEditing(true)}
                >
                  Edit profile
                </button>
              </>
            ) : (
              <div style={{ maxWidth: '520px' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Name</label>
                  <input className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'rgba(255,255,255,.35)', marginBottom: '.4rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>
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
                  <div style={{ padding: '.7rem 1rem', background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '8px', color: '#fca5a5', fontSize: '.83rem', marginBottom: '1rem' }}>
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
        </div>
      </div>
    </div>
  )
}
