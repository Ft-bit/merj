'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, setDoc, addDoc, serverTimestamp, getDocs, limit,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Sidebar from '../../components/Sidebar'

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
  text: string
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const [showNew, setShowNew] = useState(false)
  const [directory, setDirectory] = useState<DirectoryUser[]>([])
  const [directoryLoading, setDirectoryLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [starting, setStarting] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    const openId = searchParams.get('open')
    if (openId) setActiveId(openId)
  }, [searchParams])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    )
    const unsub = onSnapshot(q, snap => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversation)))
    })
    return () => unsub()
  }, [user])

  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }
    const q = query(
      collection(db, 'conversations', activeId, 'messages'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
    })
    return () => unsub()
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openDirectory = async () => {
    setShowNew(true)
    if (directory.length > 0) return
    setDirectoryLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'users'), limit(100)))
      const users: DirectoryUser[] = snap.docs
        .filter(d => d.id !== user?.uid)
        .map(d => ({
          uid: d.id,
          name: d.data().name || 'User',
          email: d.data().email || '',
          photo: d.data().photo || '',
        }))
      setDirectory(users)
    } catch {
      // Directory stays empty; the list below shows nothing to search.
    }
    setDirectoryLoading(false)
  }

  const startConversationWith = async (otherUid: string, otherName: string, otherPhoto: string) => {
    if (!user) return
    setStarting(true)
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
      setShowNew(false)
      setSearchTerm('')
    } catch {
      // If this fails, the directory stays open so the user can retry.
    }
    setStarting(false)
  }

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
    }
    setSending(false)
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
  const otherInfo = otherUid ? activeConv?.participantInfo?.[otherUid] : null

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

        .send-btn{
          width:42px;height:42px;border-radius:50%;background:${GREEN};border:none;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          flex-shrink:0;transition:background .2s;
        }
        .send-btn:hover:not(:disabled){background:#00c853}
        .send-btn:disabled{opacity:.5;cursor:not-allowed}

        .new-chat-input{
          width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.09);border-radius:10px;
          color:#fff;font-size:.9rem;outline:none;font-family:inherit;
        }
        .new-chat-input:focus{border-color:${GREEN}66}
        .new-chat-input::placeholder{color:rgba(255,255,255,.25)}

        @media(max-width:900px){ .app-sidebar{display:none!important} }
        @media(max-width:700px){ .conv-list{display:none} }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', maxWidth: '1000px', margin: '0 auto', height: '100vh' }}>

        <div className="conv-list" style={{ width: '320px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Messages</h2>
            <button
              onClick={() => (showNew ? setShowNew(false) : openDirectory())}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,230,118,.1)', border: '1px solid rgba(0,230,118,.25)', color: GREEN, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="New message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          {showNew ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', animation: 'fadeUp .2s ease' }}>
              <div style={{ padding: '0 1rem 1rem' }}>
                <input
                  className="new-chat-input"
                  placeholder="Search people by name or email"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
                {directoryLoading && (
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>Loading people...</p>
                )}
                {!directoryLoading && filteredDirectory.length === 0 && (
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
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', fontWeight: '700', color: GREEN, flexShrink: 0, overflow: 'hidden' }}>
                      {u.photo ? <img src={u.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                      <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
              {conversations.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                  No conversations yet. Tap + to find someone to message.
                </p>
              )}
              {conversations.map(conv => {
                const cOtherUid = conv.participants.find(p => p !== user.uid)
                const info = cOtherUid ? conv.participantInfo?.[cOtherUid] : null
                return (
                  <div
                    key={conv.id}
                    className={`conv-row${conv.id === activeId ? ' active' : ''}`}
                    onClick={() => setActiveId(conv.id)}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', fontWeight: '700', color: GREEN, flexShrink: 0, overflow: 'hidden' }}>
                      {info?.photo ? <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (info?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <p style={{ fontSize: '.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info?.name || 'User'}</p>
                      <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.lastMessage || 'Say hello'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!activeId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.3)', fontSize: '.9rem' }}>
              Select a conversation or start a new one
            </div>
          ) : (
            <>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: GREEN, overflow: 'hidden', cursor: otherUid ? 'pointer' : 'default' }}
                  onClick={() => otherUid && router.push(`/profile/${otherUid}`)}
                >
                  {otherInfo?.photo ? <img src={otherInfo.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (otherInfo?.name || 'U')[0].toUpperCase()}
                </div>
                <p
                  style={{ fontWeight: '700', fontSize: '.95rem', cursor: otherUid ? 'pointer' : 'default' }}
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
                        maxWidth: '65%', padding: '.65rem 1rem', borderRadius: '16px',
                        background: mine ? GREEN : 'rgba(255,255,255,.06)',
                        color: mine ? '#000' : '#fff',
                        fontSize: '.9rem', lineHeight: 1.5,
                        borderBottomRightRadius: mine ? '4px' : '16px',
                        borderBottomLeftRadius: mine ? '16px' : '4px',
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: '.75rem' }}>
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
