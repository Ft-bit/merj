'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, setDoc, addDoc, serverTimestamp, getDocs, limit,
  updateDoc, deleteDoc, arrayUnion, writeBatch,
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

interface ReplyRef { id: string; text: string; senderName: string }

interface Message {
  id: string
  text?: string
  type?: 'image' | 'video'
  mediaUrl?: string
  senderId: string
  createdAt: any
  deletedFor?: string[]
  replyTo?: ReplyRef
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

function formatMsgTime(createdAt: any) {
  if (!createdAt?.toDate) return ''
  return createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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

  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [menuMessage, setMenuMessage] = useState<Message | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkDeleteSheet, setShowBulkDeleteSheet] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const notifyRecipient = async (preview: string) => {
    if (!user || !activeId) return
    const conv = conversations.find(c => c.id === activeId)
    const recipientUid = conv?.participants.find(p => p !== user.uid)
    if (!recipientUid) return
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: recipientUid,
        type: 'message',
        title: user.displayName || 'New message',
        body: preview,
        link: `/messages?open=${activeId}`,
        read: false,
        createdAt: serverTimestamp(),
      })
    } catch {
      // Notification failing to write should never block the message itself.
    }
    // Push notification — best-effort, only fires if the recipient has a
    // saved Expo push token (i.e. granted permission on the native app).
    try {
      const recipientSnap = await getDoc(doc(db, 'users', recipientUid))
      const pushToken = recipientSnap.exists() ? recipientSnap.data()?.expoPushToken : null
      if (pushToken) {
        fetch('/api/notifications/send-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: pushToken,
            title: user.displayName || 'New message',
            body: preview,
            data: { link: `/messages?open=${activeId}` },
          }),
        }).catch(() => {})
      }
    } catch {}
  }

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
    setReplyingTo(null)
    setMenuMessage(null)
    setSelectionMode(false)
    setSelectedIds(new Set())
    if (!activeId || !user) {
      setMessages([])
      return
    }
    const q = query(collection(db, 'conversations', activeId, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message))
      setMessages(all.filter(m => !m.deletedFor?.includes(user.uid)))
    })
    return () => unsub()
  }, [activeId, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!user || !activeId || !text.trim()) return
    const messageText = text.trim()
    const reply = replyingTo
    setText('')
    setReplyingTo(null)
    setSending(true)
    try {
      const payload: any = { text: messageText, senderId: user.uid, createdAt: serverTimestamp() }
      if (reply) {
        payload.replyTo = {
          id: reply.id,
          text: reply.text || (reply.type === 'image' ? '📷 Photo' : reply.type === 'video' ? '🎥 Video' : ''),
          senderName: reply.senderId === user.uid ? 'You' : (otherInfoOf(reply) || 'User'),
        }
      }
      await addDoc(collection(db, 'conversations', activeId, 'messages'), payload)
      await setDoc(doc(db, 'conversations', activeId), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp(),
      }, { merge: true })
      notifyRecipient(messageText.slice(0, 80))
    } catch {
      setText(messageText)
      setError('Message failed to send. Please try again.')
    }
    setSending(false)
  }

  // Helper for reply attribution — mirrors the app's use of otherInfo.name.
  function otherInfoOf(_reply: Message) {
    const activeConv = conversations.find(c => c.id === activeId)
    const otherUid = activeConv?.participants.find(p => p !== user?.uid)
    const info = otherUid ? (liveInfo[otherUid] || activeConv?.participantInfo?.[otherUid]) : null
    return info?.name
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
      notifyRecipient(isImage ? '📷 Sent a photo' : '🎥 Sent a video')
    } catch {
      setError('Could not send that file. Please try again.')
    }
    setUploadingMedia(false)
  }

  const runDelete = async (mode: 'me' | 'everyone') => {
    if (!menuMessage || !activeId || !user) return
    const msgId = menuMessage.id
    setMenuMessage(null)
    try {
      if (mode === 'everyone') {
        await deleteDoc(doc(db, 'conversations', activeId, 'messages', msgId))
      } else {
        await updateDoc(doc(db, 'conversations', activeId, 'messages', msgId), { deletedFor: arrayUnion(user.uid) })
      }
    } catch {
      setError('Could not delete that message. Please try again.')
    }
  }

  const toggleSelected = (msgId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(msgId)) next.delete(msgId); else next.add(msgId)
      return next
    })
  }

  const exitSelection = () => { setSelectionMode(false); setSelectedIds(new Set()) }

  const allSelectedAreMine = user
    ? Array.from(selectedIds).every(sid => messages.find(m => m.id === sid)?.senderId === user.uid)
    : false

  const runBulkDelete = async (mode: 'me' | 'everyone') => {
    if (!activeId || !user || selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    setShowBulkDeleteSheet(false)
    exitSelection()
    try {
      const batch = writeBatch(db)
      ids.forEach(msgId => {
        if (mode === 'everyone') {
          batch.delete(doc(db, 'conversations', activeId, 'messages', msgId))
        } else {
          batch.update(doc(db, 'conversations', activeId, 'messages', msgId), { deletedFor: arrayUnion(user.uid) })
        }
      })
      await batch.commit()
    } catch {
      setError('Could not delete some messages. Please try again.')
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

  const activeConv = conversations.find(c => c.id === activeId)
  const otherUid = activeConv?.participants.find(p => p !== user.uid)
  const otherInfo = otherUid ? (liveInfo[otherUid] || activeConv?.participantInfo?.[otherUid]) : null

  const filteredDirectory = directory.filter(u => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', display: 'flex' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes popIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}

        .conv-row, .dir-row{
          display:flex;align-items:center;gap:12px;padding:.85rem 1rem;
          cursor:pointer;border-radius:12px;transition:background .15s;
          min-height:44px;
        }
        .conv-row:hover, .dir-row:hover{background:var(--bg-input)}
        .conv-row.active{background:rgba(0,230,118,.08)}

        .scroll-hidden{ scrollbar-width:none;-ms-overflow-style:none; }
        .scroll-hidden::-webkit-scrollbar{ display:none; }

        .msg-input{
          flex:1;padding:.8rem 1rem;background:var(--bg-input);
          border:1px solid var(--border-color);border-radius:100px;
          color:var(--text-primary);font-size:.9rem;outline:none;font-family:inherit;
          min-height:44px;box-sizing:border-box;
        }
        .msg-input:focus{border-color:${GREEN}66}
        .msg-input::placeholder{color:var(--text-tertiary)}

        .send-btn, .attach-btn, .compose-btn{
          border-radius:50%;border:none;padding:0;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          flex-shrink:0;transition:background .2s;box-sizing:border-box;
        }
        .send-btn, .attach-btn{ width:44px;height:44px; }
        .send-btn{background:${GREEN}}
        .send-btn:hover:not(:disabled){background:#00c853}
        .send-btn:disabled{opacity:.5;cursor:not-allowed}
        .attach-btn{background:var(--bg-input);color:var(--text-secondary)}
        .attach-btn:hover{background:var(--border-color);color:var(--text-primary)}
        .compose-btn{ width:38px;height:38px;background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.3);color:${GREEN}; }
        .compose-btn:hover{background:rgba(0,230,118,.18)}

        .search-input{
          width:100%;padding:.75rem 1rem;background:var(--bg-input);
          border:1px solid var(--border-color);border-radius:10px;
          color:var(--text-primary);font-size:.9rem;outline:none;font-family:inherit;
          min-height:44px;box-sizing:border-box;
        }
        .search-input:focus{border-color:${GREEN}66}
        .search-input::placeholder{color:var(--text-tertiary)}

        .back-mobile{ display:none }

        .conv-list{
          width:340px;flex-shrink:0;
          border-right:1px solid var(--border-color);
          display:flex;flex-direction:column;
        }
        .thread-panel{
          flex:1;display:flex;flex-direction:column;min-width:0;
        }

        .msg-row-wrap{ display:flex;align-items:flex-end;gap:6px; }
        .msg-actions-btn{
          background:none;border:none;cursor:pointer;color:var(--text-tertiary);
          opacity:0;transition:opacity .15s;padding:4px;display:flex;align-items:center;justify-content:center;
          border-radius:6px;flex-shrink:0;
        }
        .msg-row-wrap:hover .msg-actions-btn{ opacity:1 }
        .msg-actions-btn:hover{ background:var(--bg-input);color:var(--text-primary) }

        .msg-checkbox{
          width:20px;height:20px;border-radius:50%;border:2px solid var(--border-color-strong);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;
        }
        .msg-checkbox.checked{ background:${GREEN};border-color:${GREEN} }

        .menu-backdrop{ position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;z-index:50 }
        .menu-sheet{
          background:var(--bg-elevated,var(--bg-card));width:100%;max-width:420px;border-radius:20px 20px 0 0;
          padding:1.25rem 0 1.5rem;animation:popIn .15s ease;
        }
        .menu-row{
          display:flex;align-items:center;gap:14px;padding:.9rem 1.4rem;cursor:pointer;
          font-size:.95rem;font-weight:600;min-height:44px;transition:background .1s;
        }
        .menu-row:hover{ background:var(--bg-input) }

        @media(max-width:900px){ .app-sidebar{display:none!important} .msg-shell{padding-top:3.5rem!important;padding-bottom:4.75rem!important;height:calc(100dvh - 3.5rem)!important;box-sizing:border-box!important} }

        @media(max-width:700px){
          .msg-shell[data-thread-open="true"] .conv-list{display:none!important}
          .msg-shell[data-thread-open="false"] .thread-panel{display:none!important}
          .back-mobile{ display:inline-flex!important }
          .conv-list{ width:100%!important }
        }

        .msg-shell.focused .conv-list{ display:none!important }
        .msg-shell.focused .back-mobile{ display:inline-flex!important }
      `}</style>

      <Sidebar />

      <div className={`msg-shell${focusedThread ? ' focused' : ''}`} data-thread-open={!!activeId} style={{ flex: 1, display: 'flex', maxWidth: '1000px', margin: '0 auto', height: '100dvh' }}>

        <div className="conv-list">

          {!composeOpen ? (
            <>
              <div style={{ padding: '1.5rem 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Messages</h2>
                <button className="compose-btn" onClick={openCompose} aria-label="New message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              <div className="scroll-hidden" style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
                {inboxError && (
                  <p style={{ color: '#f87171', fontSize: '.8rem', textAlign: 'center', padding: '1.5rem 1rem', lineHeight: 1.6 }}>
                    {inboxError}
                  </p>
                )}
                {!inboxError && conversations.length === 0 && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
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
                        {info?.photo ? <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (info?.name || 'U')[0].toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <p style={{ fontSize: '.92rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info?.name || 'User'}</p>
                        <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', minWidth: '44px', minHeight: '44px' }}
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
                  <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '.5rem' }}>{composeError}</p>
                )}
              </div>
              <div className="scroll-hidden" style={{ flex: 1, overflowY: 'auto', padding: '0 .5rem' }}>
                {!directoryLoaded && !composeError && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>Loading people...</p>
                )}
                {directoryLoaded && filteredDirectory.length === 0 && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
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
                      {u.photo ? <img src={u.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : u.name[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '.92rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                      <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="thread-panel">
          {!activeId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '.9rem' }}>
              Select a conversation or tap the pencil icon
            </div>
          ) : (
            <>
              {!selectionMode ? (
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="back-mobile"
                    onClick={() => { setActiveId(null); setFocusedThread(false) }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', minWidth: '44px', minHeight: '44px' }}
                    aria-label="Back to conversations"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  </button>
                  <div
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,230,118,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: GREEN, overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => otherUid && router.push(`/profile/${otherUid}`)}
                  >
                    {otherInfo?.photo ? <img src={otherInfo.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (otherInfo?.name || 'U')[0].toUpperCase()}
                  </div>
                  <p
                    style={{ fontWeight: '700', fontSize: '.95rem', cursor: 'pointer' }}
                    onClick={() => otherUid && router.push(`/profile/${otherUid}`)}
                  >
                    {otherInfo?.name || 'User'}
                  </p>
                </div>
              ) : (
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={exitSelection}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', minWidth: '44px', minHeight: '44px' }}
                    aria-label="Cancel selection"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                  <p style={{ flex: 1, fontWeight: '700', fontSize: '.95rem' }}>{selectedIds.size} selected</p>
                  <button
                    onClick={() => setShowBulkDeleteSheet(true)}
                    disabled={selectedIds.size === 0}
                    style={{ background: 'none', border: 'none', cursor: selectedIds.size ? 'pointer' : 'not-allowed', padding: '6px', color: selectedIds.size ? '#f87171' : 'var(--text-tertiary)' }}
                    aria-label="Delete selected"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                  </button>
                </div>
              )}

              <div className="scroll-hidden" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {messages.map(msg => {
                  const mine = msg.senderId === user.uid
                  const isSelected = selectedIds.has(msg.id)
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <div className="msg-row-wrap" style={{ flexDirection: mine ? 'row-reverse' : 'row', maxWidth: '78%' }}>
                        {selectionMode && (
                          <div
                            className={`msg-checkbox${isSelected ? ' checked' : ''}`}
                            onClick={() => toggleSelected(msg.id)}
                          >
                            {isSelected && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                          </div>
                        )}
                        <div>
                          <div
                            onClick={() => { if (selectionMode) toggleSelected(msg.id) }}
                            style={{
                              padding: msg.type ? '6px' : '.65rem 1rem', borderRadius: '16px',
                              background: mine ? GREEN : 'var(--bg-card)',
                              color: mine ? '#000' : 'var(--text-primary)',
                              border: mine ? 'none' : '1px solid var(--border-color)',
                              fontSize: '.9rem', lineHeight: 1.5,
                              borderBottomRightRadius: mine ? '4px' : '16px',
                              borderBottomLeftRadius: mine ? '16px' : '4px',
                              overflow: 'hidden',
                              boxSizing: 'border-box',
                              cursor: selectionMode ? 'pointer' : 'default',
                            }}
                          >
                            {msg.replyTo && (
                              <div style={{ borderLeft: `3px solid ${mine ? 'rgba(0,0,0,.3)' : GREEN}`, paddingLeft: '8px', marginBottom: '6px', padding: '2px 0 2px 8px' }}>
                                <p style={{ fontSize: '.72rem', fontWeight: '700', color: mine ? 'rgba(0,0,0,.6)' : GREEN }}>{msg.replyTo.senderName}</p>
                                <p style={{ fontSize: '.78rem', color: mine ? 'rgba(0,0,0,.55)' : 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.replyTo.text}</p>
                              </div>
                            )}
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
                          <p style={{ fontSize: '.7rem', color: 'var(--text-tertiary)', margin: '3px 4px 0', textAlign: mine ? 'right' : 'left' }}>
                            {formatMsgTime(msg.createdAt)}
                          </p>
                        </div>
                        {!selectionMode && (
                          <button className="msg-actions-btn" onClick={() => setMenuMessage(msg)} aria-label="Message actions">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <p style={{ color: '#f87171', fontSize: '.8rem', padding: '0 1.5rem' }}>{error}</p>
              )}

              {replyingTo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '.6rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                  <div style={{ width: '3px', alignSelf: 'stretch', background: GREEN, borderRadius: '2px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '.78rem', fontWeight: '700', color: GREEN }}>
                      {replyingTo.senderId === user.uid ? 'You' : (otherInfo?.name || 'User')}
                    </p>
                    <p style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {replyingTo.text || (replyingTo.type === 'image' ? '📷 Photo' : '🎥 Video')}
                    </p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }} aria-label="Cancel reply">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )}

              {!selectionMode && (
                <div style={{ padding: '1rem 1.5rem', borderTop: replyingTo ? 'none' : '1px solid var(--border-color)', display: 'flex', gap: '.6rem', alignItems: 'center' }}>
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
                      <div style={{ width: '14px', height: '14px', border: '2px solid var(--border-color-strong)', borderTop: '2px solid var(--text-primary)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
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
              )}
            </>
          )}
        </div>
      </div>

      {menuMessage && (
        <div className="menu-backdrop" onClick={() => setMenuMessage(null)}>
          <div className="menu-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border-color-strong)', margin: '0 auto 8px' }} />
            <div className="menu-row" onClick={() => { setReplyingTo(menuMessage); setMenuMessage(null) }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 015.5 5.5v0a5.5 5.5 0 01-5.5 5.5H11"/></svg>
              Reply
            </div>
            <div className="menu-row" onClick={() => { setSelectionMode(true); setSelectedIds(new Set([menuMessage.id])); setMenuMessage(null) }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              Select
            </div>
            <div className="menu-row" onClick={() => runDelete('me')}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
              Delete for me
            </div>
            {menuMessage.senderId === user.uid && (
              <div className="menu-row" style={{ color: '#f87171' }} onClick={() => runDelete('everyone')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                Delete for everyone
              </div>
            )}
            <div className="menu-row" style={{ color: 'var(--text-tertiary)' }} onClick={() => setMenuMessage(null)}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Cancel
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteSheet && (
        <div className="menu-backdrop" onClick={() => setShowBulkDeleteSheet(false)}>
          <div className="menu-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border-color-strong)', margin: '0 auto 8px' }} />
            <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '.9rem', padding: '.4rem 0 .2rem' }}>
              Delete {selectedIds.size} message{selectedIds.size === 1 ? '' : 's'}
            </p>
            <div className="menu-row" onClick={() => runBulkDelete('me')}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
              Delete for me
            </div>
            {allSelectedAreMine && (
              <div className="menu-row" style={{ color: '#f87171' }} onClick={() => runBulkDelete('everyone')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                Delete for everyone
              </div>
            )}
            <div className="menu-row" style={{ color: 'var(--text-tertiary)' }} onClick={() => setShowBulkDeleteSheet(false)}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid rgba(0,230,118,.2)`, borderTop: `2px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <MessagesInner />
    </Suspense>
  )
}
