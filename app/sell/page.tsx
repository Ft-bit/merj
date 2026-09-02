'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

const GREEN = '#00e676'

const CATEGORIES = [
  { value: 'website', label: 'Website', icon: '🌐' },
  { value: 'social', label: 'Social Media Account', icon: '📱' },
  { value: 'store', label: 'Online Store', icon: '🛍️' },
  { value: 'other', label: 'Other Digital Asset', icon: '💾' },
]

interface ListingDraft {
  category: string
  title: string
  description: string
  price: string
  images: string[]
}

const STEPS = ['Basics', 'Photos', 'Pricing', 'Review']

export default function SellPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<ListingDraft>({
    category: '',
    title: '',
    description: '',
    price: '',
    images: [],
  })
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  const update = (field: keyof ListingDraft, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

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
    setError('')
    setStep(s => Math.max(s - 1, 0))
  }

  const handleImageUpload = async (files: FileList) => {
    if (!user) return
    if (!storage) {
      setError('Photo uploads need Storage enabled on this project.')
      return
    }
    if (draft.images.length + files.length > 6) {
      setError('You can add up to 6 photos.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        if (file.size > 8 * 1024 * 1024) {
          setError('Each photo must be smaller than 8MB.')
          continue
        }
        const path = `listings/draft_${user.uid}/${Date.now()}_${file.name}`
        const storageRef = ref(storage, path)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        uploaded.push(url)
      }
      setDraft(prev => ({ ...prev, images: [...prev.images, ...uploaded] }))
    } catch {
      setError('Could not upload one or more photos. Please try again.')
    }
    setUploading(false)
  }

  const removeImage = (url: string) => {
    setDraft(prev => ({ ...prev, images: prev.images.filter(i => i !== url) }))
  }

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
        sellerPhoto: meData?.photo || user.photoURL || '',
        category: draft.category,
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        images: draft.images,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push(`/listings/${docRef.id}`)
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        setError('Could not publish — permission denied. Check Firestore rules for the listings collection.')
      } else {
        setError('Could not publish your listing. Please try again.')
      }
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
  if (!user) return null

  const categoryLabel = CATEGORIES.find(c => c.value === draft.category)?.label

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .step-row{
          display:flex;align-items:center;gap:12px;padding:.85rem 0;
          font-size:.92rem;color:var(--text-tertiary);
        }
        .step-row.active{ color:var(--text-primary); font-weight:700; }
        .step-row.done{ color:${GREEN}; }
        .step-dot{
          width:24px;height:24px;border-radius:50%;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          border:2px solid var(--border-color-strong);font-size:.75rem;font-weight:700;
        }
        .step-row.active .step-dot{ border-color:${GREEN}; color:${GREEN}; }
        .step-row.done .step-dot{ background:${GREEN}; border-color:${GREEN}; color:#000; }

        .cat-tile{
          padding:1.1rem;border-radius:14px;border:1px solid var(--border-color);
          background:var(--bg-card);cursor:pointer;transition:all .15s;text-align:left;
        }
        .cat-tile.selected{ border-color:${GREEN}; background:rgba(0,230,118,.06); }
        .cat-tile:hover{ border-color:var(--border-color-strong); }

        .field-input{
          width:100%;padding:.85rem 1rem;background:var(--bg-input);
          border:1px solid var(--border-color);border-radius:10px;
          color:var(--text-primary);font-size:.94rem;outline:none;font-family:inherit;
          box-sizing:border-box;min-height:44px;
        }
        .field-input:focus{border-color:${GREEN}66}
        .field-input::placeholder{color:var(--text-tertiary)}
        textarea.field-input{resize:vertical;min-height:120px;line-height:1.65}

        .btn-green{
          padding:.85rem 2rem;background:${GREEN};color:#000;border:none;
          border-radius:10px;font-weight:700;font-size:.9rem;cursor:pointer;
          font-family:inherit;transition:background .2s;min-height:44px;
        }
        .btn-green:hover:not(:disabled){background:#00c853}
        .btn-green:disabled{opacity:.5;cursor:not-allowed}

        .btn-ghost{
          padding:.85rem 1.75rem;background:var(--bg-input);color:var(--text-secondary);
          border:1px solid var(--border-color);border-radius:10px;font-weight:600;
          font-size:.9rem;cursor:pointer;font-family:inherit;min-height:44px;
        }
        .btn-ghost:hover{ color:var(--text-primary); }

        .photo-tile{
          position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;
          background:var(--bg-input);border:1px solid var(--border-color);
        }
        .photo-remove{
          position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;
          background:rgba(0,0,0,.7);color:#fff;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        }
        .photo-add{
          aspect-ratio:1;border-radius:12px;border:2px dashed var(--border-color-strong);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
          cursor:pointer;color:var(--text-tertiary);font-size:.78rem;background:var(--bg-input);
        }
        .photo-add:hover{ border-color:${GREEN}66; color:${GREEN}; }

        @media(max-width:900px){ .app-sidebar{display:none!important} .sell-main{padding-top:4.5rem!important} }
        @media(max-width:700px){ .sell-main{ padding-bottom:6rem!important } .step-list{display:none!important} }
      `}</style>

      <Sidebar />

      <main className="sell-main" style={{ flex: 1, display: 'flex', maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '2.5rem 2rem', gap: '3rem', animation: 'fadeUp .4s ease' }}>

        <aside className="step-list" style={{ width: '200px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-.02em' }}>List an asset</h1>
          {STEPS.map((label, i) => (
            <div key={label} className={`step-row${i === step ? ' active' : i < step ? ' done' : ''}`}>
              <div className="step-dot">{i < step ? '✓' : i + 1}</div>
              {label}
            </div>
          ))}
        </aside>

        <div style={{ flex: 1, maxWidth: '620px' }}>
          {error && (
            <div style={{ padding: '.75rem 1rem', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: '8px', color: '#f87171', fontSize: '.83rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {step === 0 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '.4rem' }}>What are you selling?</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '.88rem', marginBottom: '1.5rem' }}>Choose a category, then describe your asset.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem', marginBottom: '1.75rem' }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} className={`cat-tile${draft.category === c.value ? ' selected' : ''}`} onClick={() => update('category', c.value)}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{c.icon}</div>
                    <p style={{ fontWeight: '700', fontSize: '.9rem' }}>{c.label}</p>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '.45rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>Title</label>
                <input className="field-input" value={draft.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Established fitness blog with 12k monthly visitors" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '.45rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                  Description <span style={{ textTransform: 'none', fontWeight: '400' }}>({draft.description.length} chars)</span>
                </label>
                <textarea className="field-input" value={draft.description} onChange={e => update('description', e.target.value)} placeholder="Describe what's included, traffic/followers, revenue if any, and why you're selling." />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '.4rem' }}>Add photos</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '.88rem', marginBottom: '1.5rem' }}>Screenshots of analytics, the site itself, or the account — up to 6 photos.</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => e.target.files && handleImageUpload(e.target.files)}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
                {draft.images.map(url => (
                  <div key={url} className="photo-tile">
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <button className="photo-remove" onClick={() => removeImage(url)} aria-label="Remove photo">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {draft.images.length < 6 && (
                  <button className="photo-add" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? (
                      <div style={{ width: '18px', height: '18px', border: '2px solid var(--border-color-strong)', borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                    ) : (
                      <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                        Add photo
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '.4rem' }}>Set your price</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '.88rem', marginBottom: '1.5rem' }}>What are you asking for this asset?</p>

              <div style={{ position: 'relative', maxWidth: '260px' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontWeight: '700' }}>$</span>
                <input
                  className="field-input"
                  style={{ paddingLeft: '2rem' }}
                  type="number"
                  min="1"
                  value={draft.price}
                  onChange={e => update('price', e.target.value)}
                  placeholder="0"
                />
              </div>
              <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', marginTop: '.75rem' }}>Listing is free — Merj only takes a fee when your asset sells.</p>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '.4rem' }}>Review your listing</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '.88rem', marginBottom: '1.5rem' }}>Make sure everything looks right before publishing.</p>

              {draft.images[0] && (
                <img src={draft.images[0]} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1.25rem' }} />
              )}

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                <span style={{ fontSize: '.72rem', fontWeight: '700', color: GREEN, textTransform: 'uppercase', letterSpacing: '.05em' }}>{categoryLabel}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '.4rem 0 .6rem' }}>{draft.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{draft.description}</p>
                <p style={{ fontSize: '1.4rem', fontWeight: '800', color: GREEN }}>${Number(draft.price).toLocaleString()}</p>
                {draft.images.length > 1 && (
                  <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', marginTop: '.5rem' }}>{draft.images.length} photos attached</p>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '.75rem', marginTop: '2.5rem' }}>
            {step > 0 && (
              <button className="btn-ghost" onClick={goBack} disabled={publishing}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn-green" onClick={goNext}>Continue</button>
            ) : (
              <button className="btn-green" onClick={handlePublish} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Publish listing'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
