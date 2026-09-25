'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../lib/firebase'
import Sidebar from '../../../components/Sidebar'

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

const CATEGORY_LABELS: Record<string, string> = {
  website: 'Website',
  social: 'Social Media Account',
  store: 'Online Store',
  other: 'Other Digital Asset',
}

function conversationId(a: string, b: string) {
  return [a, b].sort().join('_')
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { user } = useAuth()
  const router = useRouter()

  const [listing, setListing] = useState<Listing | null>(null)
  const [fetching, setFetching] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [messaging, setMessaging] = useState(false)
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setFetching(true)
      try {
        const snap = await getDoc(doc(db, 'listings', id))
        if (snap.exists()) setListing({ id: snap.id, ...snap.data() } as Listing)
        else setNotFound(true)
      } catch {
        setNotFound(true)
      }
      setFetching(false)
    })()
  }, [id])

  const handleMessageSeller = async () => {
    if (!user || !listing) return
    if (listing.sellerId === user.uid) {
      router.push('/messages')
      return
    }
    setMessaging(true)
    setMessageError('')
    try {
      const convId = conversationId(user.uid, listing.sellerId)
      const convRef = doc(db, 'conversations', convId)
      const convSnap = await getDoc(convRef)

      if (!convSnap.exists()) {
        const meSnap = await getDoc(doc(db, 'users', user.uid))
        const meData = meSnap.exists() ? meSnap.data() : {}
        await setDoc(convRef, {
          participants: [user.uid, listing.sellerId],
          participantInfo: {
            [user.uid]: { name: meData?.name || user.displayName || 'User', photo: meData?.photo || '' },
            [listing.sellerId]: { name: listing.sellerName || 'User', photo: listing.sellerPhoto || '' },
          },
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
        })
      }

      router.push(`/messages?open=${convId}`)
    } catch {
      setMessageError('Could not start conversation. Please try again.')
    }
    setMessaging(false)
  }

  if (fetching) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(0,230,118,.2)', borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (notFound || !listing) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>This listing doesn't exist or was removed.</p>
          <button
            onClick={() => router.push('/listings')}
            style={{ background: GREEN, border: 'none', borderRadius: '10px', padding: '.85rem 1.7rem', color: '#000', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Back to marketplace
          </button>
        </div>
      </div>
    )
  }

  const isOwnListing = user && listing.sellerId === user.uid
  const postedDate = listing.createdAt?.toDate
    ? listing.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @media(max-width:900px){ .app-sidebar{display:none!important} .listing-main{padding-top:4.5rem!important} }
      `}</style>

      <Sidebar />

      <main className="listing-main" style={{ flex: 1, maxWidth: '640px', margin: '0 auto', padding: '2rem', animation: 'fadeUp .3s ease' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', marginBottom: '1rem', display: 'flex' }}
          aria-label="Back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>

        <div style={{ aspectRatio: '4/3', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '.7rem' }}>
          {listing.images?.[activeImage] ? (
            <img src={listing.images[activeImage]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
          )}
        </div>

        {listing.images && listing.images.length > 1 && (
          <div style={{ display: 'flex', gap: '.5rem', overflowX: 'auto', marginBottom: '1.2rem' }}>
            {listing.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                style={{ padding: 0, border: `2px solid ${i === activeImage ? GREEN : 'transparent'}`, borderRadius: '10px', cursor: 'pointer', flexShrink: 0, background: 'none' }}
              >
                <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
              </button>
            ))}
          </div>
        )}

        <p style={{ fontSize: '.75rem', fontWeight: '700', color: GREEN, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: '.3rem' }}>
          {CATEGORY_LABELS[listing.category] || 'Digital Asset'}
        </p>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '.4rem', marginBottom: '.5rem', letterSpacing: '-.02em' }}>{listing.title}</h1>
        <p style={{ fontSize: '1.7rem', fontWeight: '800', color: GREEN, marginBottom: '1.2rem' }}>${listing.price.toLocaleString()}</p>

        <div
          onClick={() => router.push(`/profile/${listing.sellerId}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.9rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', marginBottom: '.9rem', cursor: 'pointer', minHeight: '44px' }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {listing.sellerPhoto ? (
              <img src={listing.sellerPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: GREEN, fontWeight: '700' }}>{(listing.sellerName || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <p style={{ fontSize: '.9rem', fontWeight: '700' }}>{listing.sellerName}</p>
            <p style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>Seller</p>
          </div>
        </div>

        {!isOwnListing ? (
          <button
            onClick={handleMessageSeller}
            disabled={messaging}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: GREEN, border: 'none', borderRadius: '10px', padding: '.9rem', color: '#000', fontWeight: '700', fontSize: '.9rem', cursor: 'pointer', fontFamily: 'inherit', minHeight: '44px', opacity: messaging ? .7 : 1 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            {messaging ? 'Opening…' : 'Message seller'}
          </button>
        ) : (
          <div style={{ padding: '.9rem', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.25)', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ color: GREEN, fontSize: '.85rem' }}>This is your listing</span>
          </div>
        )}

        {messageError && <p style={{ color: '#f87171', fontSize: '.85rem', marginTop: '.6rem' }}>{messageError}</p>}
        {postedDate && <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', marginTop: '.7rem' }}>Listed on {postedDate}</p>}

        <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.04em', color: 'var(--text-tertiary)', marginTop: '1.8rem', marginBottom: '.7rem' }}>DESCRIPTION</p>
        <p style={{ fontSize: '.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{listing.description}</p>
      </main>
    </div>
  )
}
