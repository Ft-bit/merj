'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

interface Listing {
  id: string
  sellerId: string
  sellerName: string
  sellerPhoto: string
  category: string
  title: string
  description: string
  price: number
  images: string[]
  status: string
  createdAt: any
}

// Simple inline SVG icons — no external package needed
function IconAll({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  )
}
function IconWebsite({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
    </svg>
  )
}
function IconSocial({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </svg>
  )
}
function IconStore({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5 9v10h14V9" />
    </svg>
  )
}
function IconOther({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

type IconComponent = (props: { size?: number }) => JSX.Element

interface Category {
  value: string
  label: string
  Icon: IconComponent
}

const CATEGORIES: Category[] = [
  { value: 'all', label: 'All', Icon: IconAll },
  { value: 'website', label: 'Websites', Icon: IconWebsite },
  { value: 'social', label: 'Social Accounts', Icon: IconSocial },
  { value: 'store', label: 'Stores', Icon: IconStore },
  { value: 'other', label: 'Other', Icon: IconOther },
]

export default function ListingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [listings, setListings] = useState<Listing[]>([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      snap => {
        setListings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing)))
        setFetching(false)
        setFetchError('')
      },
      (err) => {
        if (err.code === 'failed-precondition') {
          setFetchError('The marketplace needs a one-time Firestore index. Check the browser console for a "Create Index" link.')
        } else {
          setFetchError('Could not load listings. Please refresh.')
        }
        setFetching(false)
      }
    )
    return () => unsub()
  }, [user])

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
  if (!user) return null

  const filtered = listings.filter(l => {
    if (category !== 'all' && l.category !== category) return false
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return l.title.toLowerCase().includes(term) || l.description.toLowerCase().includes(term)
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .search-input{
          width:100%;padding:.85rem 1rem;background:var(--bg-input);
          border:1px solid var(--border-color);border-radius:10px;
          color:var(--text-primary);font-size:.92rem;outline:none;font-family:inherit;
          min-height:44px;box-sizing:border-box;
        }
        .search-input:focus{border-color:${GREEN}66}
        .search-input::placeholder{color:var(--text-tertiary)}

        .cat-chip{
          padding:.55rem 1rem;border-radius:100px;border:1px solid var(--border-color);
          background:var(--bg-card);color:var(--text-secondary);font-size:.85rem;font-weight:600;
          cursor:pointer;white-space:nowrap;transition:all .15s;min-height:40px;
          display:flex;align-items:center;gap:6px;flex-shrink:0;
        }
        .cat-chip.active{ border-color:${GREEN}; background:rgba(0,230,118,.1); color:${GREEN}; }

        .listing-card{
          background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;
          overflow:hidden;cursor:pointer;transition:all .2s;
        }
        .listing-card:hover{ border-color:rgba(0,230,118,.3); transform:translateY(-2px); }

        .chip-scroll{ scrollbar-width:none;-ms-overflow-style:none; }
        .chip-scroll::-webkit-scrollbar{ display:none; }

        @media(max-width:900px){ .app-sidebar{display:none!important} .listings-main{padding-top:4.5rem!important} }
        @media(max-width:700px){ .listings-main{ padding-bottom:6rem!important } }
      `}</style>

      <Sidebar />

      <main className="listings-main" style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeUp .4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-.025em' }}>Marketplace</h1>
          <button
            onClick={() => router.push('/sell')}
            style={{ padding: '.7rem 1.5rem', background: GREEN, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', minHeight: '44px' }}
          >
            List an asset
          </button>
        </div>

        <input
          className="search-input"
          placeholder="Search listings"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />

        <div className="chip-scroll" style={{ display: 'flex', gap: '.6rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '.25rem' }}>
          {CATEGORIES.map(c => (
            <button key={c.value} className={`cat-chip${category === c.value ? ' active' : ''}`} onClick={() => setCategory(c.value)}>
              <c.Icon size={15} /> {c.label}
            </button>
          ))}
        </div>

        {fetchError && (
          <p style={{ color: '#f87171', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1.5rem', lineHeight: 1.6 }}>{fetchError}</p>
        )}

        {!fetchError && !fetching && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '.95rem', marginBottom: '.4rem' }}>
              {listings.length === 0 ? 'No listings yet' : 'No matches found'}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem' }}>
              {listings.length === 0 ? 'Be the first to list something on Merj.' : 'Try a different search or category.'}
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.1rem' }}>
            {filtered.map(listing => {
              const CategoryIcon = CATEGORIES.find(c => c.value === listing.category)?.Icon || IconOther
              return (
                <div key={listing.id} className="listing-card" onClick={() => router.push(`/listings/${listing.id}`)}>
                  <div style={{ aspectRatio: '4/3', background: 'var(--bg-input)', position: 'relative', overflow: 'hidden' }}>
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                        <CategoryIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '.92rem', fontWeight: '700', marginBottom: '.35rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {listing.title}
                    </p>
                    <p style={{ fontSize: '1.05rem', fontWeight: '800', color: GREEN }}>${listing.price.toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
