'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import Sidebar from '../../../components/Sidebar'
import { linkifyText } from '../../../lib/linkify'

const GREEN = '#00e676'

interface ProfileData {
  name: string
  bio: string
  photo: string
  coverPhoto: string
  createdAt?: any
}

function conversationId(a: string, b: string) {
  return [a, b].sort().join('_')
}

export default function PublicProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const uid = params?.uid as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [messaging, setMessaging] = useState(false)
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!uid) return

    if (user && uid === user.uid) {
      router.replace('/profile')
      return
    }

    const fetchProfile = async () => {
      setFetching(true)
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          setProfile(snap.data() as ProfileData)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      }
      setFetching(false)
    }
    fetchProfile()
  }, [uid, user, router])

  const handleMessage = async () => {
    if (!user || !profile) return
    setMessaging(true)
    setMessageError('')

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject({ code: 'timeout' }), 10000)
    )

    try {
      await Promise.race([
        (async () => {
          const convId = conversationId(user.uid, uid)
          const convRef = doc(db, 'conversations', convId)
          const convSnap = await getDoc(convRef)

          if (!convSnap.exists()) {
            const meSnap = await getDoc(doc(db, 'users', user.uid))
            const meData = meSnap.exists() ? meSnap.data() : {}

            await setDoc(convRef, {
              participants: [user.uid, uid],
              participantInfo: {
                [user.uid]: { name: meData?.name || user.displayName || 'User', photo: meData?.photo || user.photoURL || '' },
                [uid]: { name: profile.name || 'User', photo: profile.photo || '' },
              },
              lastMessage: '',
              lastMessageAt: serverTimestamp(),
            })
          }

          router.push(`/messages?open=${convId}`)
        })(),
        timeout,
      ])
    } catch (e: any) {
      if (e?.code === 'timeout') {
        setMessageError('This is taking too long. Check your connection and try again.')
      } else if (e?.code === 'permission-denied') {
        setMessageError('Could not start conversation — permission denied. Check Firestore rules.')
      } else {
        setMessageError('Could not start conversation. Please try again.')
      }
      setMessaging(false)
    }
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

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,.4)' }}>This user doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ padding: '.6rem 1.5rem', background: GREEN, color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Back to dashboard
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:900px){ .app-sidebar{display:none!important} .pubprofile-main{padding-top:3.5rem!important} }
      `}</style>

      <Sidebar />

      <main className="pubprofile-main" style={{ flex: 1, maxWidth: '760px', margin: '0 auto', paddingBottom: '4rem' }}>
        <div style={{
          marginTop: '1.5rem', marginLeft: '1.5rem', marginRight: '1.5rem',
          height: '220px', position: 'relative',
          background: profile?.coverPhoto
            ? `url(${profile.coverPhoto}) center/cover`
            : 'linear-gradient(135deg, #001f10 0%, #003d22 55%, #00552e 100%)',
          borderRadius: '18px', overflow: 'hidden',
          animation: 'fadeUp .5s ease',
        }} />

        <div style={{ padding: '0 1.5rem', marginTop: '-52px', position: 'relative', animation: 'fadeUp .6s ease' }}>
          <div style={{
            width: '104px', height: '104px', borderRadius: '50%',
            border: '4px solid #000', overflow: 'hidden',
            background: 'rgba(0,230,118,.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile?.photo ? (
              <img src={profile.photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2.1rem', fontWeight: '700', color: GREEN }}>
                {(profile?.name || 'U')[0].toUpperCase()}
              </span>
            )}
          </div>

          <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-.025em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profile?.name || 'User'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill={GREEN} aria-label="Verified">
                  <path d="M12 1l2.4 2.4L18 2.6l.8 3.6 3.6.8-.8 3.6L24 12l-2.4 2.4.8 3.6-3.6.8-.8 3.6-3.6-.8L12 24l-2.4-2.4L6 22.4l-.8-3.6-3.6-.8.8-3.6L0 12l2.4-2.4L1.6 6l3.6-.8L6 1.6l3.6.8z"/>
                  <path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </h1>
              {memberSince && (
                <p style={{ color: 'rgba(255,255,255,.28)', fontSize: '.8rem', marginTop: '.4rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Member since {memberSince}
                </p>
              )}
            </div>

            <button
              onClick={handleMessage}
              disabled={messaging}
              style={{ padding: '.7rem 1.5rem', background: GREEN, color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', opacity: messaging ? .7 : 1 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              {messaging ? 'Opening...' : 'Message'}
            </button>
          </div>

          {messageError && (
            <p style={{ color: '#fca5a5', fontSize: '.83rem', marginTop: '.75rem' }}>{messageError}</p>
          )}

          {profile?.bio && (
            <p style={{ color: 'rgba(255,255,255,.62)', fontSize: '.94rem', lineHeight: 1.75, marginTop: '1.25rem', maxWidth: '520px' }}>
              {linkifyText(profile.bio, GREEN)}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
