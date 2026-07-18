'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

interface Notification {
  id: string
  type: 'message' | 'listing' | 'announcement'
  title: string
  body: string
  link?: string
  read: boolean
  createdAt: any
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function IconMessage() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
}
function IconMegaphone() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>
}
function IconTag() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2"><path d="M20.59 13.41L13.42 20.6a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/></svg>
}

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      snap => {
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification)))
        setFetching(false)
        setFetchError('')
      },
      (err) => {
        if (err.code === 'failed-precondition') {
          setFetchError('Notifications need a one-time Firestore index. Check the browser console for a "Create Index" link.')
        } else {
          setFetchError('Could not load notifications.')
        }
        setFetching(false)
      }
    )
    return () => unsub()
  }, [user])

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      try {
        await updateDoc(doc(db, 'notifications', n.id), { read: true })
      } catch {
        // Non-critical — clicking through still works even if marking read fails.
      }
    }
    if (n.link) router.push(n.link)
  }

  if (loading) {
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .notif-row{
          display:flex;align-items:flex-start;gap:12px;padding:1rem 1.25rem;
          cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(255,255,255,.05);
        }
        .notif-row:hover{background:rgba(255,255,255,.03)}
        .notif-row.unread{background:rgba(0,230,118,.04)}

        @media(max-width:900px){ .app-sidebar{display:none!important} }
        @media(max-width:700px){ .notif-main{ padding-bottom:5.5rem!important } }
      `}</style>

      <Sidebar />

      <main className="notif-main" style={{ flex: 1, maxWidth: '640px', margin: '0 auto', animation: 'fadeUp .4s ease' }}>
        <div style={{ padding: '1.75rem 1.5rem 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-.025em' }}>Notifications</h1>
        </div>

        {fetchError && (
          <p style={{ color: '#fca5a5', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1.5rem', lineHeight: 1.6 }}>{fetchError}</p>
        )}

        {!fetchError && !fetching && notifications.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.9rem', textAlign: 'center', padding: '3rem 1.5rem' }}>
            Nothing yet. New messages and announcements will show up here.
          </p>
        )}

        {notifications.map(n => {
          const created = n.createdAt?.toDate ? n.createdAt.toDate() : null
          return (
            <div
              key={n.id}
              className={`notif-row${!n.read ? ' unread' : ''}`}
              onClick={() => handleClick(n)}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,230,118,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n.type === 'message' && <IconMessage />}
                {n.type === 'announcement' && <IconMegaphone />}
                {n.type === 'listing' && <IconTag />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '.9rem', fontWeight: n.read ? '500' : '700', color: n.read ? 'rgba(255,255,255,.75)' : '#fff' }}>
                  {n.title}
                </p>
                <p style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.4)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {n.body}
                </p>
                {created && (
                  <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)', marginTop: '4px' }}>{timeAgo(created)}</p>
                )}
              </div>
              {!n.read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: GREEN, flexShrink: 0, marginTop: '6px' }} />
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
