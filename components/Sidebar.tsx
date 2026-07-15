'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

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
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
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

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [comingSoon, setComingSoon] = useState('')

  const navItems: NavItem[] = [
    { label: 'Home', path: '/dashboard', icon: <IconHome />, enabled: true },
    { label: 'Marketplace', path: '/listings', icon: <IconMarketplace />, enabled: false },
    { label: 'Messages', path: '/messages', icon: <IconMessages />, enabled: true },
    { label: 'Notifications', path: '/notifications', icon: <IconBell />, enabled: false },
    { label: 'Profile', path: '/profile', icon: <IconUser />, enabled: true },
  ]

  const handleNav = (item: NavItem) => {
    if (!item.enabled) {
      setComingSoon(item.label)
      setTimeout(() => setComingSoon(''), 2000)
      return
    }
    router.push(item.path)
  }

  return (
    <>
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
        @media(max-width:900px){
          .app-sidebar{display:none!important}
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
              {!item.enabled && (
                <span style={{ marginLeft: 'auto', fontSize: '.65rem', color: 'rgba(0,230,118,.6)', background: 'rgba(0,230,118,.08)', padding: '2px 7px', borderRadius: '100px', fontWeight: '600' }}>soon</span>
              )}
            </button>
          ))}

          <button className="sb-list-btn" onClick={() => handleNav({ label: 'Sell', path: '/sell', icon: <IconSell />, enabled: false })}>
            List an asset
          </button>

          {comingSoon && (
            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', textAlign: 'center', marginTop: '.5rem' }}>
              {comingSoon} is coming soon
            </p>
          )}
        </div>

        <button
          className="sb-item"
          onClick={() => router.push('/profile')}
          style={{ marginTop: 'auto' }}
        >
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
    </>
  )
}
