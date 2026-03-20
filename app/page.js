'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

function drawTongari(canvas, size, emotion, blink) {
  if (!canvas || size < 10) return
  const ctx = canvas.getContext('2d')
  const s = size / 120
  ctx.clearRect(0, 0, size, size)
  const bg = ctx.createRadialGradient(size/2,size*0.4,0,size/2,size/2,size*0.7)
  bg.addColorStop(0,'#2a1a0a'); bg.addColorStop(1,'#0a0806')
  ctx.fillStyle=bg; ctx.fillRect(0,0,size,size)
  ctx.strokeStyle='rgba(201,168,76,0.05)'; ctx.lineWidth=1
  const gs=size/12
  for(let i=0;i<size;i+=gs){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,size);ctx.stroke()}
  for(let i=0;i<size;i+=gs){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(size,i);ctx.stroke()}
  ctx.save()
  ctx.translate(size/2, size*0.68)
  ctx.scale(s,s)
  ctx.fillStyle='#1a0f0a'
  ctx.beginPath(); ctx.ellipse(0,20,30,26,0,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle='#c0392b'; ctx.lineWidth=3; ctx.lineCap='round'
  ctx.beginPath(); ctx.moveTo(-10,4); ctx.lineTo(0,16); ctx.lineTo(10,4); ctx.stroke()
  ctx.strokeStyle='rgba(192,57,43,0.15)'; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(-20,10); ctx.lineTo(-8,10); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(8,10); ctx.lineTo(20,10); ctx.stroke()
  ctx.fillStyle='#c8865a'; ctx.fillRect(-10,-4,20,16)
  ctx.fillStyle='#c8865a'
  ctx.beginPath(); ctx.ellipse(0,-20,26,24,0,0,Math.PI*2); ctx.fill()
  const sp=Math.sin(Date.now()/350)*3
  ctx.fillStyle='rgba(0,0,0,0.25)'
  ctx.beginPath(); ctx.moveTo(-10,-38); ctx.quadraticCurveTo(4,-68+sp,6,-84+sp)
  ctx.quadraticCurveTo(10,-68+sp,16,-38); ctx.closePath(); ctx.fill()
  const tg=ctx.createLinearGradient(-8,-84,8,-36)
  tg.addColorStop(0,'#e0a860'); tg.addColorStop(0.4,'#c07840'); tg.addColorStop(1,'#7a3810')
  ctx.fillStyle=tg
  ctx.beginPath(); ctx.moveTo(-12,-38)
  ctx.quadraticCurveTo(-8,-62+sp,0,-84+sp)
  ctx.quadraticCurveTo(8,-62+sp,12,-38)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle='rgba(255,210,160,0.3)'
  ctx.beginPath(); ctx.moveTo(-4,-42); ctx.quadraticCurveTo(-2,-66+sp,0,-84+sp)
  ctx.quadraticCurveTo(2,-66+sp,4,-42); ctx.closePath(); ctx.fill()
  ctx.strokeStyle='rgba(120,60,10,0.4)'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.moveTo(-12,-38)
  ctx.quadraticCurveTo(-8,-62+sp,0,-84+sp)
  ctx.quadraticCurveTo(8,-62+sp,12,-38); ctx.stroke()
  const ba=emotion==='angry'?8:emotion==='happy'?-4:3
  ctx.strokeStyle='#1a0a00'; ctx.lineWidth=5; ctx.lineCap='round'
  ctx.beginPath(); ctx.moveTo(-20,-30); ctx.lineTo(-8,-30+ba); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(20,-30); ctx.lineTo(8,-30+ba); ctx.stroke()
  if(blink){
    ctx.strokeStyle='#1a0a00'; ctx.lineWidth=4
    ctx.beginPath(); ctx.moveTo(-14,-20); ctx.lineTo(-6,-20); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(6,-20); ctx.lineTo(14,-20); ctx.stroke()
  } else {
    const eh=emotion==='happy'?3:8
    ctx.fillStyle='#0d0806'
    ctx.beginPath(); ctx.ellipse(-10,-20,6,eh,0,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(10,-20,6,eh,0,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='rgba(255,255,255,0.85)'
    ctx.beginPath(); ctx.arc(-8,-23,2.5,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(12,-23,2.5,0,Math.PI*2); ctx.fill()
    if(emotion==='angry'){
      ctx.fillStyle='rgba(192,57,43,0.35)'
      ctx.beginPath(); ctx.ellipse(-10,-20,7,9,0,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(10,-20,7,9,0,0,Math.PI*2); ctx.fill()
      ctx.strokeStyle='rgba(192,57,43,0.6)'; ctx.lineWidth=2
      ctx.beginPath(); ctx.moveTo(-24,-40); ctx.lineTo(-20,-32); ctx.lineTo(-16,-40); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(16,-40); ctx.lineTo(20,-32); ctx.lineTo(24,-40); ctx.stroke()
    }
  }
  ctx.strokeStyle='#1a0a00'; ctx.lineWidth=3; ctx.lineCap='round'
  if(emotion==='happy'){
    ctx.beginPath(); ctx.arc(0,-8,10,0.2,Math.PI-0.2); ctx.stroke()
    ctx.fillStyle='rgba(255,255,255,0.65)'
    ctx.beginPath(); ctx.ellipse(0,-2,6,3,0,0,Math.PI); ctx.fill()
  } else if(emotion==='angry'){
    ctx.beginPath(); ctx.arc(0,-2,9,Math.PI+0.3,-0.3); ctx.stroke()
    ctx.fillStyle='rgba(255,255,255,0.4)'
    ctx.fillRect(-6,-4,4,4); ctx.fillRect(0,-4,4,4)
  } else {
    ctx.beginPath(); ctx.moveTo(-10,-8); ctx.lineTo(10,-8); ctx.stroke()
  }
  if(emotion==='happy'){
    ctx.fillStyle='rgba(220,100,80,0.18)'
    ctx.beginPath(); ctx.ellipse(-18,-16,8,5,0,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(18,-16,8,5,0,0,Math.PI*2); ctx.fill()
  }
  ctx.strokeStyle='#c9a84c'; ctx.lineWidth=4
  ctx.beginPath(); ctx.arc(0,2,16,0.5,Math.PI-0.5); ctx.stroke()
  const pg=ctx.createRadialGradient(0,18,0,0,18,6)
  pg.addColorStop(0,'#f0d080'); pg.addColorStop(1,'#c9a84c')
  ctx.fillStyle=pg
  ctx.beginPath(); ctx.arc(0,18,5,0,Math.PI*2); ctx.fill()
  ctx.restore()
  if(emotion==='angry'){
    ctx.strokeStyle='rgba(192,57,43,0.2)'; ctx.lineWidth=1.5
    const cx=size/2, cy=size*0.2
    for(let i=0;i<8;i++){
      const a=i*(Math.PI/4)+Date.now()/600
      ctx.beginPath()
      ctx.moveTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14)
      ctx.lineTo(cx+Math.cos(a)*28,cy+Math.sin(a)*28)
      ctx.stroke()
    }
  }
}

function getTime(){
  const n=new Date()
  return n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0')
}

const EM={
  happy:{label:'😄 上機嫌ごわす',inline:'上機嫌'},
  normal:{label:'😤 強気ごわす',inline:'強気'},
  angry:{label:'😡 激おこごわす',inline:'激おこ'}
}

export default function Home(){
  const [messages,setMessages]=useState([])
  const [history,setHistory]=useState([])
  const [input,setInput]=useState('')
  const [isLoading,setIsLoading]=useState(false)
  const [emotion,setEmotion]=useState('normal')
  const [blink,setBlink]=useState(false)
  const [turnCount,setTurnCount]=useState(0)
  const [canvasSize,setCanvasSize]=useState(200)
  const chatRef=useRef(null)
  const mainRef=useRef(null)
  const stageRef=useRef(null)
  const animRef=useRef(null)

  useEffect(()=>{
    function updateSize(){
      if(stageRef.current){
        const h=stageRef.current.clientHeight
        setCanvasSize(Math.floor(h*0.82))
      }
    }
    updateSize()
    window.addEventListener('resize',updateSize)
    return ()=>window.removeEventListener('resize',updateSize)
  },[])

  useEffect(()=>{
    let bt=0,isB=false
    function animate(){
      bt++; if(bt>200&&!isB){isB=true;bt=0} if(isB&&bt>6){isB=false;bt=0}
      setBlink(isB)
      if(mainRef.current) drawTongari(mainRef.current,canvasSize,emotion,isB)
      animRef.current=requestAnimationFrame(animate)
    }
    animRef.current=requestAnimationFrame(animate)
    return ()=>cancelAnimationFrame(animRef.current)
  },[emotion,canvasSize])

  useEffect(()=>{
    setTimeout(()=>setMessages([{
      role:'char',
      text:'…来たでごわすか。\nおれがとんがり親分ごわす。\nこのとんがりが目に入らぬでごわすか。\n何でも申してみるごわす。キュッ★',
      time:getTime(),emotion:'normal'
    }]),700)
  },[])

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight },[messages,isLoading])

  const send=useCallback(async()=>{
    const text=input.trim(); if(!text||isLoading)return
    setInput(''); setIsLoading(true)
    const nt=turnCount+1; setTurnCount(nt)
    setMessages(prev=>[...prev,{role:'user',text,time:getTime()}])
    const nh=[...history,{role:'user',content:text}]; setHistory(nh)
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:nh})})
      const data=await res.json()
      if(data.error)throw new Error(data.error)
      let reply=data.content[0].text
      const em=reply.match(/\[EMOTION:(happy|normal|angry)\]/)
      const ne=em?em[1]:'normal'; reply=reply.replace(/\[EMOTION:(happy|normal|angry)\]/,'').trim()
      setEmotion(ne)
      setMessages(prev=>{
        const msgs=[...prev,{role:'char',text:reply,time:getTime(),emotion:ne}]
        if(nt===5) msgs.push({role:'divider',text:'── 五回目の問答 ──'})
        if(nt===10) msgs.push({role:'divider',text:'── 十回目の問答 ──'})
        return msgs
      })
      setHistory(prev=>[...prev,{role:'assistant',content:reply}].slice(-20))
    }catch(e){
      setMessages(prev=>[...prev,{role:'char',text:'…繋がらぬごわす。もう一度申してみるごわす。',time:getTime(),emotion:'normal',isError:true}])
      setHistory(prev=>prev.slice(0,-1))
    }
    setIsLoading(false)
  },[input,isLoading,history,turnCount])

  const handleKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}
  const em=EM[emotion]||EM.normal

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Zen+Antique+Soft&family=Shippori+Mincho:wght@400;600;800&family=Share+Tech+Mono&display=swap');
      *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
      :root{--ink:#0d0a06;--paper:#12100a;--red:#c0392b;--red-glow:#e74c3c;--gold:#c9a84c;--gold-light:#f0d080;--ash:#8a7a6a;--text:#e8dcc8;--muted:rgba(232,220,200,0.35);--char-bubble:#1a1510;--user-bubble:#160e08;--border-red:rgba(192,57,43,0.5);--border-gold:rgba(201,168,76,0.4)}
      body{background:var(--ink);color:var(--text);font-family:'Shippori Mincho',serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:0.5rem;overflow:hidden}
      body::before{content:'';position:fixed;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(201,168,76,0.012) 2px,rgba(201,168,76,0.012) 4px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(201,168,76,0.008) 2px,rgba(201,168,76,0.008) 4px);pointer-events:none}
      body::after{content:'卍';position:fixed;font-size:28rem;color:rgba(192,57,43,0.018);top:50%;left:50%;transform:translate(-50%,-50%) rotate(15deg);pointer-events:none;font-family:serif}
      #app{position:relative;z-index:1;width:100%;max-width:420px;height:96vh;max-height:820px;display:flex;flex-direction:column;background:var(--paper);border-top:3px solid var(--red);border-bottom:3px solid var(--red);border-left:1px solid var(--border-gold);border-right:1px solid var(--border-gold);box-shadow:0 0 80px rgba(192,57,43,0.12),0 0 160px rgba(0,0,0,0.8),inset 0 0 60px rgba(0,0,0,0.4);overflow:hidden}
      .stage{flex-shrink:0;position:relative;height:42%;background:linear-gradient(180deg,#0d0906 0%,#1a1208 60%,var(--paper) 100%);border-bottom:2px solid var(--border-gold);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden;padding-bottom:8px}
      .stage::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(192,57,43,0.08) 0%,transparent 70%);pointer-events:none}
      .nameplate{display:flex;align-items:center;gap:10px;margin-top:6px}
      .cn{font-family:'Zen Antique Soft',serif;font-size:1.1rem;color:var(--gold-light);text-shadow:0 0 16px rgba(201,168,76,0.5);letter-spacing:0.2em}
      .opill{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:var(--red);border:1px solid var(--red);padding:2px 6px;letter-spacing:0.1em;opacity:0.8}
      .ebar{display:flex;justify-content:space-between;align-items:center;padding:4px 14px;background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(201,168,76,0.08);flex-shrink:0;font-family:'Share Tech Mono',monospace;font-size:0.55rem;color:var(--muted)}
      .ev{color:var(--gold)}
      .chat{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:14px;scrollbar-width:thin;scrollbar-color:var(--border-red) transparent}
      .chat::-webkit-scrollbar{width:3px}.chat::-webkit-scrollbar-thumb{background:var(--red);border-radius:2px}
      .msg{display:flex;gap:8px;align-items:flex-end}.msg.user{flex-direction:row-reverse}
      .mav{width:32px;height:32px;flex-shrink:0;border-radius:3px;border:1px solid var(--border-gold);overflow:hidden;box-shadow:0 0 6px rgba(192,57,43,0.2)}
      .bw{display:flex;flex-direction:column;max-width:80%}.msg.user .bw{align-items:flex-end}
      .bbl{padding:9px 13px;line-height:1.8;font-size:0.88rem;position:relative;white-space:pre-wrap}
      .msg.char .bbl{background:var(--char-bubble);border:1px solid var(--border-red);border-radius:0 6px 6px 6px;color:var(--text);border-left:2px solid var(--red)}
      .msg.char .bbl::before{content:'';position:absolute;left:-7px;top:10px;width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-right:5px solid var(--red)}
      .msg.user .bbl{background:var(--user-bubble);border:1px solid var(--border-gold);border-radius:6px 0 6px 6px;color:rgba(232,220,200,0.8);font-size:0.85rem}
      .bbl.err{border-color:rgba(100,100,100,0.3)!important;color:var(--ash)!important;font-style:italic}
      .mt{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:var(--muted);margin-top:3px}
      .msg.user .mt{text-align:right}
      .dvd{display:flex;align-items:center;gap:8px;font-size:0.52rem;color:var(--muted);font-family:'Share Tech Mono',monospace;letter-spacing:0.1em}
      .dvd::before,.dvd::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border-gold),transparent)}
      .typ{display:none;gap:8px;align-items:flex-end;padding:0 14px 6px}.typ.show{display:flex}
      .tbbl{background:var(--char-bubble);border:1px solid var(--border-red);border-left:2px solid var(--red);border-radius:0 6px 6px 6px;padding:9px 13px;display:flex;gap:5px;align-items:center}
      .dot{width:5px;height:5px;background:var(--red);border-radius:50%;animation:bnc 1.4s infinite}
      .dot:nth-child(2){animation-delay:0.2s}.dot:nth-child(3){animation-delay:0.4s}
      @keyframes bnc{0%,60%,100%{transform:translateY(0);opacity:0.3}30%{transform:translateY(-5px);opacity:1}}
      .ibar{background:linear-gradient(0deg,#0d0906 0%,var(--paper) 100%);border-top:1px solid var(--border-gold);padding:10px 12px;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;position:relative}
      .ibar::before{content:'申し上げる';position:absolute;top:-9px;left:50%;transform:translateX(-50%);font-size:0.48rem;color:var(--gold);opacity:0.4;letter-spacing:0.3em;background:var(--paper);padding:0 6px}
      textarea{flex:1;background:rgba(255,255,255,0.03);border:1px solid var(--border-gold);border-bottom:1px solid var(--red);color:var(--text);font-family:'Shippori Mincho',serif;font-size:0.88rem;padding:8px 11px;resize:none;outline:none;transition:border-color 0.2s;min-height:38px;max-height:90px;line-height:1.6}
      textarea:focus{border-color:var(--red);box-shadow:0 0 8px rgba(192,57,43,0.15)}
      textarea::placeholder{color:var(--muted);font-size:0.78rem}
      .sbtn{background:var(--red);border:none;color:var(--gold-light);font-family:'Zen Antique Soft',serif;font-size:0.85rem;letter-spacing:0.2em;padding:8px 13px;cursor:pointer;transition:all 0.2s;flex-shrink:0;height:38px;border-radius:2px;box-shadow:0 2px 8px rgba(192,57,43,0.3)}
      .sbtn:hover{background:var(--red-glow);box-shadow:0 0 16px rgba(231,76,60,0.5);color:#fff}
      .sbtn:disabled{opacity:0.35;cursor:not-allowed}
    `}</style>
    <div id="app">
      <div className="stage" ref={stageRef}>
        <canvas ref={mainRef} width={canvasSize} height={canvasSize} style={{width:canvasSize,height:canvasSize,filter:'drop-shadow(0 0 20px rgba(192,57,43,0.3))'}}/>
        <div className="nameplate">
          <div className="cn">とんがり親分</div>
          <div className="opill">● ONLINE</div>
        </div>
      </div>
      <div className="ebar">
        <span>心の内：<span className="ev">{em.label}</span></span>
        <span>問答：<span className="ev">{turnCount>0?`${turnCount}回目`:'未だ'}</span></span>
      </div>
      <div className="chat" ref={chatRef}>
        {messages.map((msg,i)=>{
          if(msg.role==='divider') return <div key={i} className="dvd">{msg.text}</div>
          return(
            <div key={i} className={`msg ${msg.role}`}>
              {msg.role==='char'&&<div className="mav"><MiniAv emotion={msg.emotion} blink={blink} size={32}/></div>}
              <div className="bw">
                <div className={`bbl${msg.isError?' err':''}`}>{msg.text}</div>
                <div className="mt">{msg.time}</div>
              </div>
            </div>
          )
        })}
        {isLoading&&(
          <div className="typ show">
            <div style={{width:32,height:32,flexShrink:0}}/>
            <div className="tbbl"><div className="dot"/><div className="dot"/><div className="dot"/></div>
          </div>
        )}
      </div>
      <div className="ibar">
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="親分に物申す…" rows={1}/>
        <button className="sbtn" onClick={send} disabled={isLoading}>申す</button>
      </div>
    </div>
  </>)
}

function MiniAv({emotion,blink,size=32}){
  const ref=useRef(null)
  useEffect(()=>{if(ref.current)drawTongari(ref.current,size,emotion,blink)},[emotion,blink,size])
  return <canvas ref={ref} width={size} height={size} style={{width:size,height:size,display:'block'}}/>
}
