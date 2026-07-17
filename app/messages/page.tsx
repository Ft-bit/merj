'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, setDoc, addDoc, serverTimestamp, getDocs, limit,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'
import { linkifyText } from '../../lib/linkify'

const GREEN = '#00e676'

interface Conversation {
  id: string
  participants: string[]
  participantInfo: Record<string, { name: string; photo: string }>
  lastMessage: string
  lastMessageAt: any
}

interface Message {
  id: string
  text?: string
  type?: 'image' | 'video'
  mediaUrl?: string
  senderId: string
  createdAt: any
}

interface DirectoryUser {
  uid: string
  name: string
  email: string
  photo: string
}

function conversationId(a: string, b: string) {
  return [a, b].sort().join('_')
}

function MessagesInner() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [inboxError, setInboxError] = useState('')
  const [focusedThread, setFocusedThread] = useState(false)
  const [liveInfo, setLiveInfo] = useState<Record<string, { name: string; photo: string }>>({})

  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [error, setError] = useState('')

  const [composeOpen, setComposeOpen] = useState(false)
  const [directory, setDirectory] = useState<DirectoryUser[]>([])
  const [directoryLoaded, setDirectoryLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [starting, setStarting] = useState(false)
  const [composeError, setComposeError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    const openId = searchParams.get('open')
    if (openId) {
      setActiveId(openId)
      setFocusedThread(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      snap => {
        setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversation)))
        setInboxError('')
      },
      (err) => {
        if (err.code === 'failed-precondition') {
          setInboxError('Your inbox needs a one-time Firestore index. Check the browser console for a "Create Index" link, click it, and this will fix itself in about a minute.')
        } else {
          setInboxError('Could not load your conversations. Please refresh.')
        }
      }
    )
    return () => unsub()
  }, [user])

  useEffect(() => {
    if (!user) return
    const uidsNeeded = new Set<string>()
    conversations.forEach(c => {
      const other = c.participants.find(p => p !== user.uid)
      if (other && !liveInfo[other]) uidsNeeded.add(other)
    })
    if (uidsNeeded.size === 0) return
    ;(async () => {
      const updates: Record<string, { name: string; photo: string }> = {}
      await Promise.all(Array.from(uidsNeeded).map(async uid => {
        try {
          const snap = await getDoc(doc(db, 'users', uid))
          if (snap.exists()) {
            const d = snap.data()
            updates[uid] = { name: d.name || 'User', photo: d.photo || '' }
          }
        } catch {}
      }))
      if (Object.keys(updates).length) setLiveInfo(prev => ({ ...prev, ...updates }))
    })()
  }, [conversations, user])

  const openCompose = async () => {
    setComposeOpen(true)
    setComposeError('')
    setSearchTerm('')
    if (directoryLoaded) return
    try {
      const snap = await getDocs(query(collection(db, 'users'), limit(200)))
      setDirectory(
        snap.docs
          .filter(d => d.id !== user?.uid)
          .map(d => ({
            uid: d.id,
            name: d.data().name || 'User',
            email: d.data().email || '',
            photo: d.data().photo || '',
          }))
      )
      setDirectoryLoaded(true)
    } catch {
      setComposeError('Could not load people. Please try again.')
    }
  }

  const startConversationWith = async (otherUid: string, otherName: string, otherPhoto: string) => {
    if (!user) return
    setStarting(true)
    setComposeError('')
    try {
      const convId = conversationId(user.uid, otherUid)
      const convRef = doc(db, 'conversations', convId)
      const convSnap = await getDoc(convRef)

      if (!convSnap.exists()) {
        const meSnap = await getDoc(doc(db, 'users', user.uid))
        const meData = meSnap.exists() ? meSnap.data() : {}
        await setDoc(convRef, {
          participants: [user.uid, otherUid],
          participantInfo: {
            [user.uid]: { name: meData?.name || user.displayName || 'User', photo: meData?.photo || user.photoURL || '' },
            [otherUid]: { name: otherName, photo: otherPhoto },
          },
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
        })
      }

      setActiveId(convId)
      setComposeOpen(false)
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        setComposeError('Could not start conversation — permission denied. Check Firestore rules.')
      } else {
        setComposeError('Could not start conversation. Please try again.')
      }
    }
    setStarting(false)
  }

  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }
    const q = query(collection(db, 'conversations', activeId, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
    })
    return () => unsub()
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!user || !activeId || !text.trim()) return
    const messageText = text.trim()
    setText('')
    setSending(true)
    try {
      await addDoc(collection(db, 'conversations', activeId, 'messages'), {
        text: messageText,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'conversations', activeId), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp(),
      }, { merge: true })
    } catch {
      setText(messageText)
      setError('Message failed to send. Please try again.')
    }
    setSending(false)
  }

  const handleMediaUpload = async (file: File) => {
    if (!user || !activeId) return
    if (!storage) {
      setError('Photo and video sharing needs Storage enabled on this project.')
      return
    }
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Only images and videos can be sent.')
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File must be smaller than 25MB.')
      return
    }
    setError('')
    setUploadingMedia(true)
    try {
      const path = `chat/${activeId}/${Date.now()}_${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'conversations', activeId, 'messages'), {
        type: isImage ? 'image' : 'video',
        mediaUrl: url,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'conversations', activeId), {
        lastMessage: isImage ? '📷 Photo' : '🎥 Video',
        lastMessageAt: serverTimestamp(),
      }, { merge: true })
    } catch {
      setError('Could not send that file. Please try again.')
    }
    setUploadingMedia(false)
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

  const activeConv = conversations.find(c => c.id === activeId)
  const otherUid = activeConv?.participants.find(p => p !== user.uid)
  const otherInfo = otherUid ? (liveInfo[otherUid] || activeConv?.participantInfo?.[otherUid]) : null

  const filteredDirectory = directory.filter(u => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
  })

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

        .conv-row, .dir-row{
          display:flex;align-items:center;gap:12px;padding:.85rem 1rem;
          cursor:pointer;border-radius:12px;transition:background .15s;
        }
        .conv-row:hover, .dir-row:hover{background:rgba(255,255,255,.04)}
        .conv-row.active{background:rgba(0,230,118,.07)}

        .msg-input{
          flex:1;padding:.8rem 1rem;background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.09);border-radius:100px;
          color:#fff;font-size:.9rem;outline:none;font-family:inherit;
        }
        .msg-input:focus{border-color:${GREEN}66}
        .msg-input::placeholder{color:rgba(255,255,255,.25)}

        .send-btn, .attach-btn, .compose-btn{
          border-radius:50%;border:none;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          flex-shrink:0;transition:background .2s;
        }
        .send-btn, .attach-btn{ width:42px;height:42px; }
        .send-btn{background:${GREEN}}
        .send-btn:hover:not(:disabled){background:#00c853}
        .send-btn:disabled{opacity:.5;cursor:not-allowed}
        .attach-btn{background:rgba(255,255,255,.06);color:rgba(255,255,255,.6)}
        .attach-btn:hover{background:rgba(255,255,255,.1);color:#fff}
        .compose-btn{ width:34px;height:34px;background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.25);color:${GREEN}; }
        .compose-btn:hover{background:rgba(0,230,118,.18)}

        .search-input{
          width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.09);border-radius:10px;
          color:#fff;font-size:.9rem;outline:none;font-family:inherit;
        }
        .search-input:focus{border-color:${GREEN}66}
        .search-input::placeholder{color:rgba(255,255,255,.25)}

        .back-mobile{ display:none }

        @media(max-width:900px){ .app-sidebar{display:none!important} }

        @media(max-width:700px){
          .msg-shell[data-thread-open="true"] .conv-list{display:none}
          .msg-shell[data-thread-open="false"] .thread-panel{display:none}
          .back-mobile{ display:inline-flex!important }
        }

        .msg-shell.focused .conv-list{ display:none!important }
        .msg-shell.focused .back-mobile{ display:inline-flex!important }
      `}</style>

      <Sidebar />

      <div className={`msg-shell${focusedThread ? ' focused' : ''}`} data-thread-open={!!activeId} style={{ flex: 1, display: 'flex', maxWidth: '1000px', margin: '0 auto', height: '100vh' }}>

        <div className="conv-list" style={{ width: '340px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column' }}>

          {!composeOpen ? (
            <>
              <div style={{ padding: '1.5rem 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Messages</h2>
                <button className="compose-btn" onClick={openCompose} aria-label="New message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
                {inboxError && (
                  <p style={{ color: '#fca5a5', fontSize: '.8rem', textAlign: 'center', padding: '1.5rem 1rem', lineHeight: 1.6 }}>
                    {inboxError}
                  </p>
                )}
                {!inboxError && conversations.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                    No conversations yet. Tap the pencil icon to message someone.
                  </p>
                )}
                {conversations.map(conv => {
                  const oUid = conv.participants.find(p => p !== user.uid) || ''
                  const info = liveInfo[oUid] || conv.participantInfo?.[oUid]
                  return (
                    <div
                      key={conv.id}
                      className={`conv-row${conv.id === activeId ? ' active' : ''}`}
                      onClick={() => setActiveId(conv.id)}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', fontWeight: '700', color: GREEN, flexShrink: 0, overflow: 'hidden' }}>
                        {info?.photo ? <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (info?.name || 'U')[0].toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <p style={{ fontSize: '.92rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info?.name || 'User'}</p>
                        <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.lastMessage || 'Say hello'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeUp .2s ease' }}>
              <div style={{ padding: '1.5rem 1rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setComposeOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>New message</h2>
              </div>
              <div style={{ padding: '0 1rem 1rem' }}>
                <input
                  className="search-input"
                  placeholder="Search people by name or email"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {composeError && (
                  <p style={{ color: '#fca5a5', fontSize: '.78rem', marginTop: '.5rem' }}>{composeError}</p>
                )}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
                {!directoryLoaded && !composeError && (
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>Loading people...</p>
                )}
                {directoryLoaded && filteredDirectory.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                    {directory.length === 0 ? 'No other Merj users yet.' : 'No matches found.'}
                  </p>
                )}
                {filteredDirectory.map(u => (
                  <div
                    key={u.uid}
                    className="dir-row"
                    onClick={() => !starting && startConversationWith(u.uid, u.name, u.photo)}
                    style={{ opacity: starting ? .6 : 1, pointerEvents: starting ? 'none' : 'auto' }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', fontWeight: '700', color: GREEN, flexShrink: 0, overflow: 'hidden' }}>
                      {u.photo ? <img src={u.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '.92rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                      <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="thread-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!activeId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.3)', fontSize: '.9rem' }}>
              Select a conversation or tap the pencil icon
            </div>
          ) : (
            <>
              <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className="back-mobile"
                  onClick={() => { setActiveId(null); setFocusedThread(false) }}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                  aria-label="Back to conversations"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: GREEN, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => otherUid && router.push(`/profile/${otherUid}`)}
                >
                  {otherInfo?.photo ? <img src={otherInfo.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (otherInfo?.name || 'U')[0].toUpperCase()}
                </div>
                <p
                  style={{ fontWeight: '700', fontSize: '.95rem', cursor: 'pointer' }}
                  onClick={() => otherUid && router.push(`/profile/${otherUid}`)}
                >
                  {otherInfo?.name || 'User'}
                </p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {messages.map(msg => {
                  const mine = msg.senderId === user.uid
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: msg.type ? '6px' : '.65rem 1rem', borderRadius: '16px',
                        background: mine ? GREEN : 'rgba(255,255,255,.06)',
                        color: mine ? '#000' : '#fff',
                        fontSize: '.9rem', lineHeight: 1.5,
                        borderBottomRightRadius: mine ? '4px' : '16px',
                        borderBottomLeftRadius: mine ? '16px' : '4px',
                        overflow: 'hidden',
                      }}>
                        {msg.type === 'image' && msg.mediaUrl && (
                          <img src={msg.mediaUrl} alt="" style={{ maxWidth: '260px', width: '100%', display: 'block', borderRadius: '12px' }} />
                        )}
                        {msg.type === 'video' && msg.mediaUrl && (
                          <video src={msg.mediaUrl} controls style={{ maxWidth: '260px', width: '100%', display: 'block', borderRadius: '12px' }} />
                        )}
                        {msg.text && (
                          <div style={{ padding: msg.type ? '.5rem .25rem 0' : 0 }}>
                            {linkifyText(msg.text, mine ? '#003d22' : GREEN)}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <p style={{ color: '#fca5a5', fontSize: '.8rem', padding: '0 1.5rem' }}>{error}</p>
              )}

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: '.6rem', alignItems: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                />
                <button
                  className="attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingMedia}
                  aria-label="Attach photo or video"
                >
                  {uploadingMedia ? (
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  )}
                </button>
                <input
                  className="msg-input"
                  placeholder="Message"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                />
                <button className="send-btn" onClick={handleSend} disabled={sending || !text.trim()} aria-label="Send">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <MessagesInner />
    </Suspense>
  )
}
