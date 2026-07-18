'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import UsernameGate from './UsernameGate'

const GREEN = '#00e676'

interface NavItem {
  label: string
  path: string
  icon: JSX.Element
  enabled: boolean
}

function IconHome() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
}
function IconMarketplace() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21V13h6v8"/></svg>
}
function IconSell() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
}
function IconMessages() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
}
function IconBell() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
}
function IconUser() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconSettings() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/dashboard', icon: <IconHome />, enabled: true },
  { label: 'Marketplace', path: '/listings', icon: <IconMarketplace />, enabled: false },
  { label: 'Messages', path: '/messages', icon: <IconMessages />, enabled: true },
  { label: 'Notifications', path: '/notifications', icon: <IconBell />, enabled: true },
  { label: 'Profile', path: '/profile', icon: <IconUser />, enabled: true },
  { label: 'Settings', path: '/settings', icon: <IconSettings />, enabled: true },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [comingSoon, setComingSoon] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    )
    const unsub = onSnapshot(q, snap => setUnreadCount(snap.size), () => {
      // If this fails (e.g. missing index), just show no badge rather
      // than breaking navigation.
    })
    return () => unsub()
  }, [user])

  const showComingSoon = (label: string) => {
    setComingSoon(label)
    setTimeout(() => setComingSoon(''), 2000)
  }

  const handleNav = (item: NavItem) => {
    if (!item.enabled) {
      showComingSoon(item.label)
      return
    }
    router.push(item.path)
  }

  return (
    <>
      <UsernameGate />
      <style>{`
        .sb-item{
          display:flex;align-items:center;gap:14px;padding:.75rem 1rem;
          border-radius:100px;cursor:pointer;transition:background .15s;
          color:rgba(255,255,255,.75);font-size:.95rem;font-weight:500;
          width:100%;background:none;border:none;font-family:inherit;text-align:left;
        }
        .sb-item:hover{background:rgba(255,255,255,.06)}
        .sb-item.active{color:#fff;font-weight:700}
        .sb-list-btn{
          width:100%;padding:.85rem;background:${GREEN};color:#000;border:none;
          border-radius:100px;font-weight:700;font-size:.95rem;cursor:pointer;
          font-family:inherit;transition:background .2s;margin-top:.5rem;
        }
        .sb-list-btn:hover{background:#00c853}

        .mobile-nav{ display:none }

        @media(max-width:900px){
          .app-sidebar{display:none!important}
          .mobile-nav{
            display:flex!important;
            position:fixed;bottom:0;left:0;right:0;z-index:200;
            background:rgba(5,5,5,.92);backdrop-filter:blur(20px);
            border-top:1px solid rgba(255,255,255,.08);
            padding:.5rem .5rem calc(.5rem + env(safe-area-inset-bottom));
            align-items:center;
          }
          .mnav-item{
            display:flex;flex-direction:column;align-items:center;gap:2px;
            background:none;border:none;color:rgba(255,255,255,.4);
            font-size:.58rem;font-family:inherit;cursor:pointer;
            padding:.3rem .3rem;flex:1;min-width:0;
          }
          .mnav-item.active{color:${GREEN}}
          .mnav-plus{
            width:50px;height:50px;border-radius:50%;background:${GREEN};
            display:flex;align-items:center;justify-content:center;color:#000;
            border:none;cursor:pointer;flex-shrink:0;
            box-shadow:0 4px 16px rgba(0,230,118,.4);
            position:absolute;left:50%;top:-22px;transform:translateX(-50%);
          }
        }
      `}</style>

      <nav className="app-sidebar" style={{
        width: '250px', flexShrink: 0, position: 'sticky', top: 0,
        height: '100vh', display: 'flex', flexDirection: 'column',
        padding: '1.25rem .75rem', borderRight: '1px solid rgba(255,255,255,.06)',
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '.5rem 1rem 1.5rem', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <div style={{ width: '28px', height: '28px', background: GREEN, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#000' }}>M</div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', letterSpacing: '-.03em' }}>Merj</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`sb-item${pathname === item.path ? ' active' : ''}`}
              onClick={() => handleNav(item)}
            >
              {item.icon}
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '.7rem', fontWeight: '700', color: '#000', background: GREEN, minWidth: '18px', height: '18px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {!item.enabled && (
                <span style={{ marginLeft: 'auto', fontSize: '.65rem', color: 'rgba(0,230,118,.6)', background: 'rgba(0,230,118,.08)', padding: '2px 7px', borderRadius: '100px', fontWeight: '600' }}>soon</span>
              )}
            </button>
          ))}

          <button className="sb-list-btn" onClick={() => showComingSoon('Selling')}>
            List an asset
          </button>

          {comingSoon && (
            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', textAlign: 'center', marginTop: '.5rem' }}>
              {comingSoon} is coming soon
            </p>
          )}
        </div>

        <button className="sb-item" onClick={() => router.push('/profile')} style={{ marginTop: 'auto' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: GREEN,
            overflow: 'hidden',
          }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (user?.displayName || user?.email || 'U')[0].toUpperCase()
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '.85rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.displayName || 'User'}
            </p>
          </div>
        </button>
        <button
          onClick={async () => { await logout(); router.push('/login') }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit', padding: '.4rem 1rem', textAlign: 'left' }}
        >
          Sign out
        </button>
      </nav>

      <nav className="mobile-nav">
        <button
          className={`mnav-item${pathname === '/dashboard' ? ' active' : ''}`}
          onClick={() => router.push('/dashboard')}
        >
          <IconHome />
          Home
        </button>
        <button
          className={`mnav-item${pathname === '/notifications' ? ' active' : ''}`}
          onClick={() => router.push('/notifications')}
          style={{ position: 'relative' }}
        >
          <IconBell />
          Alerts
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '22%', fontSize: '.6rem', fontWeight: '700', color: '#000', background: GREEN, minWidth: '15px', height: '15px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button
          className={`mnav-item${pathname === '/messages' ? ' active' : ''}`}
          onClick={() => router.push('/messages')}
        >
          <IconMessages />
          Chats
        </button>
        <button
          className={`mnav-item${pathname === '/profile' ? ' active' : ''}`}
          onClick={() => router.push('/profile')}
        >
          <IconUser />
          Profile
        </button>
        <button
          className={`mnav-item${pathname === '/settings' ? ' active' : ''}`}
          onClick={() => router.push('/settings')}
        >
          <IconSettings />
          Settings
        </button>

        <button className="mnav-plus" onClick={() => showComingSoon('Selling')} aria-label="List an asset">
          <IconSell />
        </button>

        {comingSoon && (
          <div style={{ position: 'fixed', bottom: '78px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.9)', color: 'rgba(255,255,255,.8)', fontSize: '.78rem', padding: '.5rem 1rem', borderRadius: '100px', whiteSpace: 'nowrap' }}>
            {comingSoon} is coming soon
          </div>
        )}
      </nav>
    </>
  )
}
