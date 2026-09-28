'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../context/AuthContext'
import { db, storage } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

const CATEGORIES = [
  { value: 'website', label: 'Website', icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg> },
  { value: 'social', label: 'Social Media Account', icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg> },
  { value: 'store', label: 'Online Store', icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M3 9l1.5-5h15L21 9" /><path d="M3 9h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M9 21V13h6v8" /></svg> },
  { value: 'other', label: 'Other Digital Asset', icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg> },
]

const STEPS = ['Basics', 'Photos', 'Pricing', 'Review']

interface ListingDraft {
  category: string
  title: string
  description: string
  price: string
  images: string[]
}

export default function SellPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<ListingDraft>({ category: '', title: '', description: '', price: '', images: [] })
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const update = (field: keyof ListingDraft, value: any) => setDraft(prev => ({ ...prev, [field]: value }))

  const stepValid = (i: number) => {
    if (i === 0) return draft.category !== '' && draft.title.trim().length >= 5 && draft.description.trim().length >= 20
    if (i === 1) return draft.images.length >= 1
    if (i === 2) return Number(draft.price) > 0
    return true
  }

  const goNext = () => {
    if (!stepValid(step)) {
      setError(
        step === 0 ? 'Add a category, a title (5+ characters), and a description (20+ characters).'
        : step === 1 ? 'Add at least one photo.'
        : 'Enter a price greater than 0.'
      )
      return
    }
    setError('')
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => {
    if (step === 0) { router.back(); return }
    setError('')
    setStep(s => Math.max(s - 1, 0))
  }

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow picking the same file again later
    if (!file || !user) return
    if (draft.images.length >= 6) {
      setError('You can add up to 6 photos.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const path = `listings/draft_${user.uid}/${Date.now()}_${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setDraft(prev => ({ ...prev, images: [...prev.images, url] }))
    } catch {
      setError('Could not upload that photo. Please try again.')
    }
    setUploading(false)
  }

  const removeImage = (url: string) => setDraft(prev => ({ ...prev, images: prev.images.filter(i => i !== url) }))

  const handlePublish = async () => {
    if (!user) return
    setPublishing(true)
    setError('')
    try {
      const meSnap = await getDoc(doc(db, 'users', user.uid))
      const meData = meSnap.exists() ? meSnap.data() : {}

      const docRef = await addDoc(collection(db, 'listings'), {
        sellerId: user.uid,
        sellerName: meData?.name || user.displayName || 'User',
        sellerPhoto: meData?.photo || '',
        category: draft.category,
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        images: draft.images,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.replace(`/listing/${docRef.id}`)
    } catch {
      setError('Could not publish your listing. Please try again.')
      setPublishing(false)
    }
  }

  const categoryLabel = CATEGORIES.find(c => c.value === draft.category)?.label

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

        .sell-input{
          width:100%;border:1px solid var(--border-color);border-radius:10px;
          padding:.75rem .9rem;font-size:.92rem;background:var(--bg-input);color:var(--text-primary);
          font-family:inherit;min-height:44px;box-sizing:border-box;
        }
        .sell-input:focus{ outline:none;border-color:${GREEN}66 }
        .sell-input::placeholder{ color:var(--text-tertiary) }
        .sell-textarea{ min-height:130px;resize:vertical;line-height:1.5;padding-top:.75rem }

        .cat-tile{
          border:1px solid var(--border-color);border-radius:14px;padding:1rem;
          display:flex;flex-direction:column;gap:8px;cursor:pointer;transition:all .15s;
          background:var(--bg-card);text-align:left;font-family:inherit;min-height:44px;
        }
        .cat-tile:hover{ border-color:rgba(0,230,118,.3) }
        .cat-tile.selected{ border-color:${GREEN};background:rgba(0,230,118,.06) }

        .photo-tile{ position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden }
        .photo-tile img{ width:100%;height:100%;object-fit:cover;display:block }
        .photo-remove{
          position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;
          background:rgba(0,0,0,.7);border:none;color:#fff;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        }
        .photo-add{
          aspect-ratio:1;border-radius:12px;border:2px dashed var(--border-color-strong);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
          cursor:pointer;color:var(--text-tertiary);font-size:.72rem;background:none;
        }
        .photo-add:hover{ border-color:${GREEN}66 }

        .step-dot{
          width:24px;height:24px;border-radius:50%;border:2px solid var(--border-color-strong);
          display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;
          color:var(--text-tertiary);flex-shrink:0;
        }
        .step-dot.active{ border-color:${GREEN};color:${GREEN} }
        .step-dot.done{ background:${GREEN};border-color:${GREEN};color:#000 }

        .ghost-btn{
          border:1px solid var(--border-color);border-radius:10px;padding:.85rem 1.5rem;
          background:none;color:var(--text-secondary);font-weight:600;cursor:pointer;
          font-family:inherit;font-size:.9rem;min-height:44px;
        }
        .primary-btn{
          border:none;border-radius:10px;padding:.85rem 1.7rem;background:${GREEN};color:#000;
          font-weight:700;cursor:pointer;font-family:inherit;font-size:.9rem;min-height:44px;
        }
        .primary-btn:disabled{ opacity:.6;cursor:not-allowed }

        @media(max-width:900px){ .app-sidebar{display:none!important} .sell-main{padding-top:4.5rem!important} }
      `}</style>

      <Sidebar />

      <main className="sell-main" style={{ flex: 1, maxWidth: '640px', margin: '0 auto', padding: '2rem', animation: 'fadeUp .3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>List an asset</h1>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }} aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div className={`step-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                {i < step ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> : i + 1}
              </div>
              <span style={{ fontSize: '.68rem', fontWeight: i === step ? 700 : 500, color: i === step ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '.9rem', borderRadius: '10px', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', marginBottom: '1.2rem' }}>
            <p style={{ color: '#f87171', fontSize: '.85rem' }}>{error}</p>
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '.3rem' }}>What are you selling?</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--text-tertiary)', marginBottom: '1.3rem' }}>Choose a category, then describe your asset.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.7rem', marginBottom: '1.3rem' }}>
              {CATEGORIES.map(c => (
                <button key={c.value} className={`cat-tile${draft.category === c.value ? ' selected' : ''}`} onClick={() => update('category', c.value)}>
                  {c.icon(draft.category === c.value ? GREEN : 'var(--text-secondary)')}
                  <span style={{ fontWeight: '700', fontSize: '.85rem' }}>{c.label}</span>
                </button>
              ))}
            </div>

            <label style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.03em', color: 'var(--text-tertiary)', display: 'block', marginBottom: '.4rem' }}>TITLE</label>
            <input
              className="sell-input"
              value={draft.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Established fitness blog with 12k monthly visitors"
              style={{ marginBottom: '1rem' }}
            />

            <label style={{ fontSize: '.72rem', fontWeight: '700', letterSpacing: '.03em', color: 'var(--text-tertiary)', display: 'block', marginBottom: '.4rem' }}>
              DESCRIPTION ({draft.description.length} chars)
            </label>
            <textarea
              className="sell-input sell-textarea"
              value={draft.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe what's included, traffic/followers, revenue if any, and why you're selling."
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '.3rem' }}>Add photos</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--text-tertiary)', marginBottom: '1.3rem' }}>Screenshots of analytics, the site itself, or the account — up to 6 photos.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.7rem' }}>
              {draft.images.map(url => (
                <div key={url} className="photo-tile">
                  <img src={url} alt="" />
                  <button className="photo-remove" onClick={() => removeImage(url)} aria-label="Remove photo">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {draft.images.length < 6 && (
                <label className="photo-add">
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddPhoto} disabled={uploading} />
                  {uploading ? (
                    <div style={{ width: '16px', height: '16px', border: '2px solid var(--border-color-strong)', borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                      Add photo
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '.3rem' }}>Set your price</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--text-tertiary)', marginBottom: '1.3rem' }}>What are you asking for this asset?</p>

            <div style={{ position: 'relative', maxWidth: '220px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-tertiary)' }}>$</span>
              <input
                className="sell-input"
                value={draft.price}
                onChange={e => update('price', e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                style={{ paddingLeft: '28px' }}
                inputMode="decimal"
              />
            </div>
            <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', marginTop: '.7rem' }}>
              Listing is free — Merj only takes a fee when your asset sells.
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '.3rem' }}>Review your listing</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--text-tertiary)', marginBottom: '1.3rem' }}>Make sure everything looks right before publishing.</p>

            {draft.images[0] && (
              <img src={draft.images[0]} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1rem' }} />
            )}

            <div style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)', borderRadius: '14px', padding: '1.3rem' }}>
              <p style={{ fontSize: '.72rem', fontWeight: '700', color: GREEN, textTransform: 'uppercase', letterSpacing: '.04em' }}>{categoryLabel}</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '.5rem 0' }}>{draft.title}</h3>
              <p style={{ fontSize: '.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '.8rem' }}>{draft.description}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: GREEN }}>${Number(draft.price).toLocaleString()}</p>
              {draft.images.length > 1 && (
                <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', marginTop: '.5rem' }}>{draft.images.length} photos attached</p>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '.7rem', marginTop: '2rem' }}>
          <button className="ghost-btn" onClick={goBack} disabled={publishing}>Back</button>
          {step < STEPS.length - 1 ? (
            <button className="primary-btn" onClick={goNext}>Continue</button>
          ) : (
            <button className="primary-btn" onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publishing…' : 'Publish listing'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
