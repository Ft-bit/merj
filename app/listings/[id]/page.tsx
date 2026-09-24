'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

interface Listing {
  id: string
  sellerName: string
  category: string
  title: string
  price: number
  images: string[]
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'website', label: 'Website' },
  { value: 'social', label: 'Social' },
  { value: 'store', label: 'Store' },
  { value: 'other', label: 'Other' },
]

export default function ListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const q = query(collection(db, 'listings'), where('status', '==', 'active'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      snap => {
        setListings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing)))
        setLoading(false)
        setError('')
      },
      err => {
        if (err.code === 'failed-precondition') {
          setError('Marketplace needs a one-time Firestore index. Check the browser console for a "Create Index" link.')
        } else {
          setError('Could not load listings.')
        }
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const filtered = listings.filter(l => {
    const matchesCategory = category === 'all' || l.category === category
    const matchesSearch = !search.trim() || l.title.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .listings-search{
          display:flex;align-items:center;gap:8px;padding:.7rem 1rem;border-radius:10px;
          border:1px solid var(--border-color);background:var(--bg-input);margin-bottom:1rem;min-height:44px;
        }
        .listings-search input{
          flex:1;border:none;background:none;outline:none;color:var(--text-primary);
          font-size:.9rem;font-family:inherit;
        }
        .listings-search input::placeholder{ color:var(--text-tertiary) }

        .chip-row{ display:flex;gap:8px;overflow-x:auto;margin-bottom:1.3rem;padding-bottom:2px }
        .chip{
          border:1px solid var(--border-color);border-radius:100px;padding:.5rem 1rem;
          font-size:.85rem;font-weight:600;cursor:pointer;background:none;color:var(--text-secondary);
          white-space:nowrap;font-family:inherit;min-height:36px;flex-shrink:0;
        }
        .chip.active{ background:${GREEN};border-color:${GREEN};color:#000 }

        .listing-card{
          border:1px solid var(--border-color);background:var(--bg-card);border-radius:14px;
          padding:.7rem;cursor:pointer;transition:all .15s;text-align:left;font-family:inherit;
        }
        .listing-card:hover{ border-color:rgba(0,230,118,.3);transform:translateY(-2px) }
        .listing-card-img{
          aspect-ratio:1;border-radius:10px;background:var(--bg-input);overflow:hidden;
          display:flex;align-items:center;justify-content:center;
        }
        .listing-card-img img{ width:100%;height:100%;object-fit:cover;display:block }

        @media(max-width:900px){ .app-sidebar{display:none!important} .listings-main{padding-top:4.5rem!important} }
      `}</style>

      <Sidebar />

      <main className="listings-main" style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '2rem', animation: 'fadeUp .3s ease' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.2rem' }}>Marketplace</h1>

        <div className="listings-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input placeholder="Search listings" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="chip-row">
          {CATEGORIES.map(c => (
            <button key={c.value} className={`chip${category === c.value ? ' active' : ''}`} onClick={() => setCategory(c.value)}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
            <div style={{ width: '36px', height: '36px', border: '2px solid rgba(0,230,118,.2)', borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <p style={{ color: '#f87171', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem', lineHeight: 1.6 }}>{error}</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '.9rem', textAlign: 'center', padding: '3rem 1rem' }}>
            {listings.length === 0 ? 'No listings yet. Be the first to sell something.' : 'No listings match your search.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '.9rem' }}>
            {filtered.map(item => (
              <button key={item.id} className="listing-card" onClick={() => router.push(`/listing/${item.id}`)}>
                <div className="listing-card-img">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" />
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
                  )}
                </div>
                <p style={{ fontSize: '.85rem', fontWeight: '700', marginTop: '.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                <p style={{ fontSize: '.95rem', fontWeight: '800', color: GREEN, marginTop: '.2rem' }}>${item.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
