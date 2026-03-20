'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

// ── Canvas avatar drawing ──
function drawTongari(canvas, size, emotion = 'normal', blink = false) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const s = size / 56
  ctx.clearRect(0, 0, size, size)

  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0, '#2a1200')
  grd.addColorStop(1, '#0f0600')
  ctx.fillStyle = grd
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.fill()

  ctx.save()
  ctx.translate(size / 2, size * 0.62)
  ctx.scale(s, s)

  ctx.fillStyle = '#3a2010'
  ctx.beginPath(); ctx.ellipse(0, 8, 12, 10, 0, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = '#c8865a'
  ctx.fillRect(-4, -2, 8, 8)

  ctx.fillStyle = '#c8865a'
  ctx.beginPath(); ctx.ellipse(0, -10, 11, 10, 0, 0, Math.PI * 2); ctx.fill()

  const spikeAnim = Math.sin(Date.now() / 400) * 1.5
  ctx.fillStyle = '#b87040'
  ctx.beginPath()
  ctx.moveTo(-6, -17)
  ctx.quadraticCurveTo(-3, -30 + spikeAnim, 0, -36 + spikeAnim)
  ctx.quadraticCurveTo(3, -30 + spikeAnim, 6, -17)
  ctx.closePath(); ctx.fill()

  const browAngle = emotion === 'angry' ? 3 : emotion === 'happy' ? -1 : 1
  ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 2; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(-9, -14); ctx.lineTo(-4, -14 + browAngle); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(9, -14); ctx.lineTo(4, -14 + browAngle); ctx.stroke()

  if (blink) {
    ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(-7, -10); ctx.lineTo(-3, -10); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(3, -10); ctx.lineTo(7, -10); ctx.stroke()
  } else {
    const eyeH = emotion === 'happy' ? 2 : 3.5
    ctx.fillStyle = '#1a0a00'
    ctx.beginPath(); ctx.ellipse(-5, -10, 2.5, eyeH, 0, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(5, -10, 2.5, eyeH, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(-4, -11, 1, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(6, -11, 1, 0, Math.PI * 2); ctx.fill()
  }

  ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
  if (emotion === 'happy') {
    ctx.beginPath(); ctx.arc(0, -5, 5, 0.2, Math.PI - 0.2); ctx.stroke()
  } else if (emotion === 'angry') {
    ctx.beginPath(); ctx.arc(0, -1, 5, Math.PI + 0.2, -0.2); ctx.stroke()
  } else {
    ctx.beginPath(); ctx.moveTo(-4, -5); ctx.lineTo(4, -5); ctx.stroke()
  }

  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(0, 0, 7, 0.4, Math.PI - 0.4); ctx.stroke()

  ctx.restore()
}

function getTime() {
  const now = new Date()
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
}

const EMOTION_LABELS = { happy: '😄 上機嫌', normal: '😤 強気', angry: '😡 激怒' }

export default function Home() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emotion, setEmotion] = useState('normal')
  const [blink, setBlink] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const chatRef = useRef(null)
  const mainAvatarRef = useRef(null)
  const animRef = useRef(null)
  const blinkTimerRef = useRef(0)

  // Animate avatar
  useEffect(() => {
    let blinkTimer = 0
    let isBlinking = false
    function animate() {
      blinkTimer++
      if (blinkTimer > 180 && !isBlinking) { isBlinking = true; blinkTimer = 0 }
      if (isBlinking && blinkTimer > 8) { isBlinking = false; blinkTimer = 0 }
      setBlink(isBlinking)
      if (mainAvatarRef.current) drawTongari(mainAvatarRef.current, 56, emotion, isBlinking)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [emotion])

  // Opening message
  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        role: 'char',
        text: 'おう、来たか。俺がとんがり親分だ。何でも話しかけてみろ。キュッ★',
        time: getTime(),
        emotion: 'normal'
      }])
    }, 600)
  }, [])

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isLoading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    setIsLoading(true)
    setTurnCount(c => c + 1)

    const userMsg = { role: 'user', text, time: getTime() }
    setMessages(prev => [...prev, userMsg])

    const newHistory = [...history, { role: 'user', content: text }]
    setHistory(newHistory)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      let reply = data.content[0].text
      const emotionMatch = reply.match(/\[EMOTION:(happy|normal|angry)\]/)
      const newEmotion = emotionMatch ? emotionMatch[1] : 'normal'
      reply = reply.replace(/\[EMOTION:(happy|normal|angry)\]/, '').trim()

      setEmotion(newEmotion)
      setMessages(prev => [...prev, { role: 'char', text: reply, time: getTime(), emotion: newEmotion }])
      setHistory(prev => [...prev, { role: 'assistant', content: reply }].slice(-20))
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'char',
        text: '「...なんか繋がらねえな。もう一回やってみろ。」',
        time: getTime(),
        emotion: 'normal',
        isError: true
      }])
      setHistory(prev => prev.slice(0, -1))
    }

    setIsLoading(false)
  }, [input, isLoading, history])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@400;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg:#0f0800; --panel:#1a1000; --border:#ff6a00; --accent:#ff6a00;
          --accent2:#ffd700; --text:#f5e6d0; --muted:rgba(245,230,208,0.4);
          --char-bubble:#1f1200; --user-bubble:#2a1800;
        }
        body {
          background: var(--bg); color: var(--text);
          font-family: 'Noto Sans JP', sans-serif;
          min-height: 100vh; display:flex; align-items:center; justify-content:center;
          padding:1rem; overflow:hidden;
        }
        body::before {
          content:''; position:fixed; inset:0;
          background: radial-gradient(ellipse at 20% 50%, rgba(255,106,0,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.04) 0%, transparent 50%);
          pointer-events:none;
        }
        #app {
          width:100%; max-width:440px; height:90vh; max-height:760px;
          display:flex; flex-direction:column;
          border:1px solid var(--border);
          box-shadow: 0 0 60px rgba(255,106,0,0.15), inset 0 0 40px rgba(0,0,0,0.5);
          position:relative;
        }
        .header {
          background:var(--panel); border-bottom:1px solid var(--border);
          padding:12px 16px; display:flex; align-items:center; gap:12px; flex-shrink:0;
        }
        .avatar-wrap { position:relative; width:56px; height:56px; flex-shrink:0; }
        .avatar-wrap canvas { border-radius:50%; border:2px solid var(--accent); box-shadow:0 0 12px rgba(255,106,0,0.4); }
        .online-dot {
          position:absolute; bottom:2px; right:2px;
          width:10px; height:10px; background:#00ff88; border-radius:50%; border:2px solid var(--bg);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,0.4)}
          50%{box-shadow:0 0 0 4px rgba(0,255,136,0)}
        }
        .char-name { font-family:'Dela Gothic One',cursive; font-size:1.1rem; color:var(--accent); text-shadow:0 0 10px rgba(255,106,0,0.5); }
        .char-status { font-family:'Share Tech Mono',monospace; font-size:0.6rem; color:var(--muted); letter-spacing:0.1em; margin-top:2px; }
        .nft-badge { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:var(--accent2); border:1px solid var(--accent2); padding:3px 8px; letter-spacing:0.1em; opacity:0.8; }
        .emotion-bar {
          display:flex; gap:6px; padding:6px 12px;
          border-top:1px solid rgba(255,106,0,0.1); background:rgba(0,0,0,0.3);
          font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:var(--muted); letter-spacing:0.08em; flex-shrink:0;
        }
        .emotion-val { color:var(--accent2); }
        .chat {
          flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:16px;
          scrollbar-width:thin; scrollbar-color:var(--border) transparent;
        }
        .chat::-webkit-scrollbar{width:4px}
        .chat::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
        .msg { display:flex; gap:10px; align-items:flex-end; }
        .msg.user { flex-direction:row-reverse; }
        .msg-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; overflow:hidden; border:1px solid var(--accent); }
        .bubble { max-width:75%; padding:10px 14px; line-height:1.7; font-size:0.88rem; position:relative; white-space:pre-wrap; }
        .msg.char .bubble { background:var(--char-bubble); border:1px solid rgba(255,106,0,0.3); border-radius:0 12px 12px 12px; }
        .msg.user .bubble { background:var(--user-bubble); border:1px solid rgba(255,215,0,0.2); border-radius:12px 0 12px 12px; }
        .bubble.error { background:rgba(255,0,0,0.1)!important; border-color:rgba(255,0,0,0.3)!important; color:#ff8888!important; }
        .msg-time { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:var(--muted); margin-top:4px; }
        .msg.char .msg-time { text-align:left; }
        .msg.user .msg-time { text-align:right; }
        .typing { display:flex; gap:10px; align-items:flex-end; }
        .typing-bubble { background:var(--char-bubble); border:1px solid rgba(255,106,0,0.3); border-radius:0 12px 12px 12px; padding:12px 16px; display:flex; gap:5px; align-items:center; }
        .dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:bounce 1.2s infinite; }
        .dot:nth-child(2){animation-delay:0.2s}
        .dot:nth-child(3){animation-delay:0.4s}
        @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-6px);opacity:1}}
        .inputbar { background:var(--panel); border-top:1px solid var(--border); padding:12px; display:flex; gap:10px; align-items:flex-end; flex-shrink:0; }
        textarea {
          flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,106,0,0.3);
          color:var(--text); font-family:'Noto Sans JP',sans-serif; font-size:0.88rem;
          padding:10px 14px; resize:none; outline:none; transition:border-color 0.2s;
          min-height:42px; max-height:100px; line-height:1.5;
        }
        textarea:focus{border-color:var(--accent)}
        textarea::placeholder{color:var(--muted)}
        .send-btn {
          background:var(--accent); border:none; color:#000;
          font-family:'Dela Gothic One',cursive; font-size:0.8rem;
          padding:10px 16px; cursor:pointer; transition:all 0.2s;
          letter-spacing:0.05em; flex-shrink:0; height:42px;
        }
        .send-btn:hover{background:var(--accent2);box-shadow:0 0 12px rgba(255,215,0,0.4)}
        .send-btn:disabled{opacity:0.4;cursor:not-allowed}
      `}</style>

      <div id="app">
        <div className="header">
          <div className="avatar-wrap">
            <canvas ref={mainAvatarRef} width={56} height={56} />
            <div className="online-dot" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="char-name">とんがり親分</div>
            <div className="char-status">ONLINE · 魂宿り済み · TOKEN #0001</div>
          </div>
          <div className="nft-badge">iNFT</div>
        </div>

        <div className="emotion-bar">
          EMOTION: <span className="emotion-val">{EMOTION_LABELS[emotion]}</span>
          &nbsp;|&nbsp; MEMORY: <span className="emotion-val">{turnCount}ターン目</span>
        </div>

        <div className="chat" ref={chatRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              {msg.role === 'char' && (
                <div className="msg-avatar">
                  <MiniAvatar emotion={msg.emotion} blink={blink} />
                </div>
              )}
              <div>
                <div className={`bubble ${msg.isError ? 'error' : ''}`}>{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="typing">
              <div style={{ width: 32, height: 32, flexShrink: 0 }} />
              <div className="typing-bubble">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}
        </div>

        <div className="inputbar">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="とんがり親分に話しかける..."
            rows={1}
          />
          <button className="send-btn" onClick={send} disabled={isLoading}>送信</button>
        </div>
      </div>
    </>
  )
}

function MiniAvatar({ emotion, blink }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) drawTongari(ref.current, 32, emotion, blink)
  }, [emotion, blink])
  return <canvas ref={ref} width={32} height={32} style={{ width: 32, height: 32 }} />
}
