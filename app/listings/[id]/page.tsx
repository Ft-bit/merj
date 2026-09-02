'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
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
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [fetching, setFetching] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [messaging, setMessaging] = useState(false)
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!listingId) return
    const fetchListing = async () => {
      setFetching(true)
      try {
        const snap = await getDoc(doc(db, 'listings', listingId))
        if (snap.exists()) {
          setListing({ id: snap.id, ...snap.data() } as Listing)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      }
      setFetching(false)
    }
    fetchListing()
  }, [listingId])

  const handleMessageSeller = async () => {
    if (!user || !listing) return
    if (listing.sellerId === user.uid) {
      router.push('/messages')
      return
    }
    setMessaging(true)
    setMessageError('')

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject({ code: 'timeout' }), 10000)
    )

    try {
      await Promise.race([
        (async () => {
          const convId = conversationId(user.uid, listing.sellerId)
          const convRef = doc(db, 'conversations', convId)
          const convSnap = await getDoc(convRef)

          if (!convSnap.exists()) {
            const meSnap = await getDoc(doc(db, 'users', user.uid))
            const meData = meSnap.exists() ? meSnap.data() : {}

            await setDoc(convRef, {
              participants: [user.uid, listing.sellerId],
              participantInfo: {
                [user.uid]: { name: meData?.name || user.displayName || 'User', photo: meData?.photo || user.photoURL || '' },
                [listing.sellerId]: { name: listing.sellerName || 'User', photo: listing.sellerPhoto || '' },
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
      } else {
        setMessageError('Could not start conversation. Please try again.')
      }
      setMessaging(false)
    }
  }

  if (loading || fetching) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
  if (!user) return null

  if (notFound || !listing) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>This listing doesn't exist or was removed.</p>
          <button
            onClick={() => router.push('/listings')}
            style={{ padding: '.6rem 1.5rem', background: GREEN, color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', minHeight: '44px' }}
          >
            Back to marketplace
          </button>
        </div>
      </div>
    )
  }

  const isOwnListing = listing.sellerId === user.uid
  const postedDate = listing.createdAt?.toDate
    ? listing.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .thumb{
          width:64px;height:64px;border-radius:10px;overflow:hidden;cursor:pointer;
          border:2px solid transparent;flex-shrink:0;
        }
        .thumb.active{ border-color:${GREEN}; }

        @media(max-width:900px){ .app-sidebar{display:none!important} .detail-main{padding-top:4.5rem!important} }
        @media(max-width:700px){ .detail-main{ padding-bottom:6rem!important } .detail-grid{ grid-template-columns:1fr!important } }
      `}</style>

      <Sidebar />

      <main className="detail-main" style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeUp .4s ease' }}>
        <button
          onClick={() => router.push('/listings')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: '1.5rem', minHeight: '44px' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Marketplace
        </button>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ aspectRatio: '4/3', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', marginBottom: '.75rem' }}>
              {listing.images?.[activeImage] ? (
                <img src={listing.images[activeImage]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>💾</div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div style={{ display: 'flex', gap: '.5rem' }}>
                {listing.images.map((img, i) => (
                  <div key={img} className={`thumb${i === activeImage ? ' active' : ''}`} onClick={() => setActiveImage(i)}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span style={{ fontSize: '.75rem', fontWeight: '700', color: GREEN, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {CATEGORY_LABELS[listing.category] || 'Digital Asset'}
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '.5rem 0 .75rem', letterSpacing: '-.02em' }}>{listing.title}</h1>
            <p style={{ fontSize: '1.9rem', fontWeight: '800', color: GREEN, marginBottom: '1.25rem' }}>${listing.price.toLocaleString()}</p>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', marginBottom: '1.25rem', cursor: 'pointer' }}
              onClick={() => router.push(`/profile/${listing.sellerId}`)}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: GREEN, overflow: 'hidden', flexShrink: 0 }}>
                {listing.sellerPhoto ? <img src={listing.sellerPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (listing.sellerName || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.sellerName}</p>
                <p style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>Seller</p>
              </div>
            </div>

            {!isOwnListing ? (
              <button
                onClick={handleMessageSeller}
                disabled={messaging}
                style={{ width: '100%', padding: '.9rem', background: GREEN, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '.92rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: messaging ? .7 : 1, minHeight: '44px', marginBottom: '.75rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                {messaging ? 'Opening...' : 'Message seller'}
              </button>
            ) : (
              <div style={{ padding: '.85rem', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.25)', borderRadius: '10px', color: GREEN, fontSize: '.85rem', textAlign: 'center', marginBottom: '.75rem' }}>
                This is your listing
              </div>
            )}

            {messageError && (
              <p style={{ color: '#f87171', fontSize: '.8rem', marginBottom: '.75rem' }}>{messageError}</p>
            )}

            {postedDate && (
              <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)' }}>Listed on {postedDate}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', maxWidth: '700px' }}>
          <p style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '.85rem' }}>
            Description
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
        </div>
      </main>
    </div>
  )
}
