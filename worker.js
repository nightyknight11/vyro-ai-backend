// worker.js
// Full Cloudflare Worker with UI embedded (HTML), Supabase auth client, image & chat endpoints,
// robust Workers AI image handling, debug mode, and UI polish (sharp buttons, liquid logo).
// Paste this entire file into your Cloudflare Worker and deploy.

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101014">
<title>VYRO AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root{color-scheme:dark;--bg:#101014;--panel:#19191f;--line:#303039;--text:#f5f5f7;--muted:#a1a1ad;--accent:#8b6bff;--accent-strong:#a18aff}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
button,input,textarea{font:inherit}
button{cursor:pointer;color:inherit}
button:disabled{opacity:.55;cursor:wait}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--accent-strong);outline-offset:3px}
/* Sharp corners, human-made look */
button{border:1px solid var(--line);background:transparent;border-radius:0;padding:10px;text-align:left;transition:background .18s,border-color .18s,transform .12s,box-shadow .18s}
button:hover{background:#27242f;border-color:#494452}
button:active{transform:translateY(1px)}
.app{height:100dvh;display:flex;overflow:hidden}
.sidebar{width:260px;flex-shrink:0;background:#141418;border-right:1px solid #292930;padding:17px 13px;display:flex;flex-direction:column;gap:10px;z-index:10}
.brand{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:800;letter-spacing:-.6px;padding:8px 7px 17px}
/* Logo: square container with liquid orb inside */
.logo.liquid-logo{position:relative;isolation:isolate;overflow:hidden;width:42px;height:42px;flex-shrink:0;border-radius:6px;background:linear-gradient(135deg,#f7f4ff 0%,#e6ddff 18%,#d6c6ff 50%);box-shadow:0 6px 30px rgba(139,107,255,0.12), inset 0 -6px 30px rgba(0,0,0,0.25)}
.liquid-orb{position:absolute;inset:8%;border-radius:40% 60% 48% 52% / 45% 48% 52% 55%;background:radial-gradient(ellipse at 30% 20%,#ffffff 0%,#fff5ff 8%,#d7c1ff 28%,transparent 52%),linear-gradient(120deg,#c7adff,#8d6df4);filter:drop-shadow(0 4px 18px rgba(139,107,255,0.25));animation:liquidMorph 5s ease-in-out infinite}
.liquid-orb:before{content:"";position:absolute;width:36%;height:16%;top:12%;left:10%;border-radius:50%;background:#fff;filter:blur(2px);opacity:.95;transform:rotate(-35deg)}
.liquid-orb:after{content:"";position:absolute;width:22%;height:22%;right:10%;bottom:12%;border-radius:50%;background:#ffd9ff55;filter:blur(6px)}
@keyframes liquidMorph{0%,100%{border-radius:40% 60% 48% 52% / 45% 48% 52% 55%;transform:scale(.98)}50%{border-radius:58% 42% 38% 62% / 57% 61% 39% 43%;transform:scale(1.03)}}
.brand .logo{display:grid;place-items:center}
.new{width:100%;padding:12px;background:#1b1b22;border-color:#35353e;font-weight:650;border-radius:0}
.nav{width:100%;padding:12px;color:#c8c8d2;border-color:transparent}
.nav.active{background:#292333;border-color:#393044;color:#e4dcff}
.label{font-size:11px;font-weight:750;color:var(--muted);letter-spacing:1.4px;margin:18px 8px 6px}
.history{overflow:auto;display:grid;gap:6px}
.history button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ddd;border-color:transparent;padding:10px 11px;font-size:13px;border-radius:0}
.history button:hover{background:#202026}
.bottom{margin-top:auto;border-top:1px solid #292930;padding:15px 5px 0}
.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere;margin-bottom:8px}
.bottom button{width:100%;margin-top:6px}
.danger:hover{background:#3a2028;border-color:#75404b}
.main{flex:1;min-width:0;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% -30%,#8b6bff05,transparent 55%),var(--bg)}
.top{height:62px;flex-shrink:0;border-bottom:1px solid #25252c;background:linear-gradient(180deg,rgba(13,13,16,0.9),rgba(13,13,16,0.7));backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 18px;gap:12px;z-index:2}
.top button{background:#19191f;border-radius:0}
.topname{font-weight:750;letter-spacing:-.3px}
.content{flex:1;min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#393440 transparent}
.view{display:none;min-height:100%}
.view.active{display:block;animation:viewIn .22s ease both}
@keyframes viewIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.welcome{min-height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:32px 20px}
.welcome>.logo{width:64px;height:64px;border-radius:6px}
.welcome h1{font-size:clamp(26px,5vw,44px);font-weight:780;letter-spacing:-1.4px;line-height:1.08;margin:18px 0 8px}
.gradient{background:linear-gradient(100deg,#e2d8ff,#b9a5ff 45%,#9574ff);color:transparent;-webkit-background-clip:text;background-clip:text}
.sub{color:#a4a4b2}
.suggestions{width:min(720px,100%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:22px}
.suggestion{min-height:86px;background:linear-gradient(180deg,#161617,#19191f);border-color:#2c2c35;padding:16px;border-radius:6px}
.suggestion:hover{background:#1f1c24;border-color:#67558d;transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.6)}
.suggestion strong,.suggestion span{display:block}
.suggestion strong{font-size:14px;font-weight:700}
.suggestion span{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.45}
.messages{width:min(860px,100%);margin:auto;padding:26px 18px 40px;display:grid;gap:20px}
.message{display:flex;gap:12px;align-items:flex-start;animation:messageIn .18s ease both}
.message.user{flex-direction:row-reverse}
.avatar{flex-shrink:0;width:36px;height:36px;border-radius:6px;background:linear-gradient(140deg,#d3c4ff,#8e6cf2);color:#171220;display:grid;place-items:center;font-weight:850;font-size:13px}
.message.user .avatar{background:#34313d;color:#f5f1ff}
.bubble{max-width:85%;min-width:0;background:var(--panel);border:1px solid #303039;border-radius:6px;padding:12px 14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.message.user .bubble{background:#292630;border-color:#393441}
.typing{display:flex;align-items:center;gap:5px;padding:8px 3px}
.typing span{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:dotPulse 1.1s ease-in-out infinite}
.typing span:nth-child(2){animation-delay:.12s}
.typing span:nth-child(3){animation-delay:.24s}
@keyframes dotPulse{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
.composer-wrap{flex-shrink:0;padding:12px 15px max(12px,env(safe-area-inset-bottom))}
.composer{width:min(880px,100%);margin:auto;background:#19191f;border:1px solid #383842;border-radius:6px;padding:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6);transition:border-color .18s,box-shadow .18s}
.composer:focus-within{border-color:var(--accent);box-shadow:0 8px 40px rgba(139,107,255,0.08)}
textarea{width:100%;resize:none;min-height:44px;max-height:170px;border:0;outline:0;background:transparent;color:white;padding:8px;line-height:1.6}
.actions{display:flex;align-items:center;gap:8px}
.actions button{border:0;color:#ccc;font-size:13px;border-radius:0;padding:10px 12px}
.actions button:hover{background:#2b2736}
/* Primary button with glow */
.primary{background:linear-gradient(90deg,var(--accent-strong),var(--accent));color:#0f0b1b;border:0;border-radius:0;padding:10px 14px;font-weight:700;box-shadow:0 10px 40px rgba(139,107,255,0.14),0 0 18px rgba(161,138,255,0.08)}
.primary:hover{box-shadow:0 16px 50px rgba(139,107,255,0.22),0 0 28px rgba(161,138,255,0.12);transform:translateY(-1px)}
/* Send button emphasized */
.send{margin-left:auto;min-width:40px;min-height:40px;display:grid;place-items:center;border-radius:0;background:linear-gradient(90deg,#bfb0ff,#c8b8ff);color:#17121f;font-weight:900;font-size:18px;box-shadow:0 12px 40px rgba(161,138,255,0.12)}
.send:hover{box-shadow:0 18px 60px rgba(161,138,255,0.18)}
.note{text-align:center;font-size:10px;color:#737380;padding-top:10px}
.studio{max-width:860px;margin:auto;padding:24px 22px}
.studio h1{font-size:34px;letter-spacing:-1.2px;margin:6px 0}
.studio textarea{display:block;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:14px;min-height:120px;margin-top:20px}
#imageResult{margin-top:18px}
#imageResult img{display:block;width:100%;height:auto;max-height:650px;object-fit:contain;border-radius:8px;border:1px solid #303039;animation:viewIn .25s ease both}
.image-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.image-actions a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
.status{color:var(--accent);font-size:12px;min-height:20px;margin-top:12px;overflow-wrap:anywhere;line-height:1.6}
.overlay{position:fixed;inset:0;background:#06060bdc;backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:18px;z-index:30;overflow:auto;animation:overlayIn .22s ease both}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
.card{width:min(460px,100%);background:linear-gradient(180deg,#17171b,#0f0f12);border:1px solid #2c2a33;border-radius:8px;padding:28px;box-shadow:0 40px 120px rgba(0,0,0,0.7);margin:auto;animation:cardIn .22s ease both}
@keyframes cardIn{from{opacity:0;transform:translateY(12px) scale(.996)}to{opacity:1;transform:translateY(0) scale(1)}}
.card .brand{justify-content:center;font-size:20px;padding:4px 0 12px}
.card h2{text-align:center;font-size:26px;letter-spacing:-1px;margin:8px 0 10px}
.card p{text-align:center;color:var(--muted);font-size:13px;line-height:1.6}
.card label{display:block;font-size:13px;font-weight:700;color:#dedee7;margin:16px 0 8px}
.card input{width:100%;min-height:46px;padding:12px;background:#0f0f12;border:1px solid #2f2f35;border-radius:4px;color:white;outline:none;transition:border-color .12s,box-shadow .12s}
.card input:focus{border-color:var(--accent-strong);box-shadow:0 8px 30px rgba(139,107,255,0.06)}
.card .primary{width:100%;min-height:46px;margin-top:12px;text-align:center}
.auth-switch{display:flex;gap:8px;margin:14px 0 10px}
.auth-switch button{flex:1;text-align:center;border-radius:0}
.auth-switch button.active{background:#2b2338;border-color:#7764a9}
.secondary{width:100%;text-align:center;margin-top:9px}
.small{font-size:11px!important;line-height:1.6}
.hidden{display:none!important}
@media(max-width:700px){
.sidebar{position:fixed;top:0;bottom:0;left:0;width:min(285px,86vw);transform:translateX(-110%);transition:transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 0 50px #0008}
.sidebar.open{transform:translateX(0)}
.top{height:57px;padding:0 10px}
.welcome{padding:24px 14px}
.welcome h1{letter-spacing:-1.2px}
.suggestions{grid-template-columns:1fr;gap:9px;margin-top:18px}
.suggestion{min-height:75px;padding:14px}
.messages{padding:20px 10px 28px;gap:18px}
.bubble{max-width:90%;padding:10px 12px}
.composer-wrap{padding:8px 9px max(10px,env(safe-area-inset-bottom))}
.composer{border-radius:6px;padding:10px}
.studio{padding:20px 14px}
.studio h1{font-size:30px}
.card{padding:20px 16px;border-radius:10px}
.actions{gap:6px}
.actions button{padding:8px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar" id="sidebar">
<div class="brand"><div class="logo liquid-logo" aria-label="VYRO AI liquid logo"><span class="liquid-orb"></span></div> VYRO AI</div>
<button class="new" id="new">＋ New chat</button>
<button class="nav active" id="chatTab">◫ &nbsp; Chat</button>
<button class="nav" id="studioTab">✧ &nbsp; Image Studio</button>
<div class="label">RECENT CHATS</div>
<div class="history" id="history"></div>
<div class="bottom">
<div class="profile" id="profile">Not signed in</div>
<button id="clearHistory" class="danger">⌫ &nbsp; Clear chat history</button>
<button id="logout">↪ &nbsp; Sign out</button>
</div>
</aside>
<main class="main">
<header class="top"><button id="menu" aria-label="Open menu">☰</button><div class="topname" id="pageTitle">VYRO AI</div></header>
<section class="content">
<div class="view active" id="chatView">
<div class="welcome" id="welcome">
<div class="logo liquid-logo" aria-label="VYRO AI liquid logo"><span class="liquid-orb"></span></div>
<h1>What can I help with<br><span class="gradient">today?</span></h1>
<p class="sub">Your ideas, powered by VYRO.</p>
<div class="suggestions">
<button class="suggestion" data-prompt="Explain a difficult topic in simple terms"><strong>▤ &nbsp; Learn something</strong><span>Get a simple explanation</span></button>
<button class="suggestion" data-prompt="Help me brainstorm creative ideas"><strong>✧ &nbsp; Brainstorm ideas</strong><span>Explore new possibilities</span></button>
<button class="suggestion" data-prompt="Help me write a message"><strong>✎ &nbsp; Write something</strong><span>Draft or improve text</span></button>
<button class="suggestion" data-prompt="Make a step-by-step learning plan"><strong>⌁ &nbsp; Make a plan</strong><span>Turn goals into steps</span></button>
</div>
</div>
<div class="messages" id="messages" hidden></div>
</div>
<div class="view" id="studioView">
<div class="studio">
<h1 class="gradient">Image Studio</h1>
<p class="sub">Turn your ideas into images.</p>
<textarea id="imagePrompt" maxlength="1500" placeholder="A futuristic city at sunset, cinematic lighting..."></textarea>
<p><button class="primary" id="generate">✧ &nbsp; Generate image</button></p>
<div class="status" id="imageStatus" role="status" aria-live="polite"></div>
<div id="imageResult"></div>
</div>
</div>
</section>
<div class="composer-wrap" id="composerWrap">
<div class="composer">
<textarea id="prompt" rows="1" maxlength="10000" placeholder="Message VYRO AI..." aria-label="Message VYRO AI"></textarea>
<div class="actions"><button id="toStudio">▧ &nbsp; Image Studio</button><span class="sub">AI can make mistakes</span><button class="send" id="send" aria-label="Send message">↑</button></div>
</div>
<div class="note">VYRO AI · Made to help you think, create, and explore</div>
</div>
</main>
</div>
<div class="overlay" id="login">
<div class="card">
<div class="brand"><div class="logo liquid-logo" aria-label="VYRO AI liquid logo"><span class="liquid-orb"></span></div> VYRO AI</div>
<h2 id="authTitle">Welcome back</h2>
<p id="authSubtitle">Sign in or create your account with email.</p>
<div class="auth-switch"><button type="button" id="signInTab" class="active">Sign in</button><button type="button" id="signUpTab">Create account</button></div>
<form id="loginForm">
<label for="email">Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required>
<label for="password">Password</label><input id="password" type="password" autocomplete="current-password" minlength="6" placeholder="At least 6 characters" required>
<button class="primary" id="loginButton" type="submit">Sign in</button>
</form>
<button type="button" class="secondary hidden" id="resend">Resend verification email</button>
<button type="button" class="danger" id="wipeData">🧹 &nbsp; Wipe local data</button>
<div class="status" id="loginStatus" role="status" aria-live="polite"></div>
<p class="small">New accounts must verify their email before signing in. Check your inbox and spam folder.</p>
</div>
</div>
<script>
(()=>{ 
'use strict';
const $=id=>document.getElementById(id);
let sb=null,session=null,busy=false,chats=[],chatId=null,authMode='signin',pendingVerificationEmail='';
const key='vyro_chat_history_v1';

function showStatus(t){$('loginStatus').textContent=t}
function setAuthMode(mode){
 authMode=mode;
 const signup=mode==='signup';
 $('authTitle').textContent=signup?'Create your account':'Welcome back';
 $('authSubtitle').textContent=signup?'Sign up with your email and a password.':'Sign in securely with your email and password.';
 $('loginButton').textContent=signup?'Create account':'Sign in';
 $('signInTab').classList.toggle('active',!signup);
 $('signUpTab').classList.toggle('active',signup);
 $('password').autocomplete=signup?'new-password':'current-password';
 $('resend').classList.add('hidden');
 showStatus('');
}

async function init(){
 try{
  const r=await fetch('/api/config',{cache:'no-store'});
  const c=await r.json();
  if(!r.ok||!c.supabaseUrl||!c.supabaseAnonKey){
   throw Error('Configure SUPABASE_URL and SUPABASE_ANON_KEY in Cloudflare Worker settings.');
  }
  if(!window.supabase)throw Error('Supabase library failed to load. Refresh the page and try again.');
  sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{
   auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  // Force sign-out on page load so previously-verified sessions must re-login
  try{ await sb.auth.signOut(); }catch(e){ console.warn('Forced sign-out failed',e); }
  applySession(null);
  sb.auth.onAuthStateChange((event,s)=>{
   applySession(s);
   if(event==='SIGNED_IN'&&(location.hash.includes('access_token')||location.search.includes('token_hash'))){
    history.replaceState(null,'',location.pathname);
    showStatus('Email verified. You are signed in!');
   }
  });
 }catch(e){
  $('login').style.display='flex';
  showStatus(e.message||'Could not initialize sign-in.');
 }
}

function applySession(s){
 session=s;
 $('login').style.display=s?'none':'flex';
 $('profile').textContent=s?.user?.email||'Not signed in';
 if(s){
  load();
  if(!chatId&&chats.length)chatId=chats[chats.length-1].id;
  render();
 }
}

function load(){
 try{
  chats=JSON.parse(localStorage.getItem(key)||'[]');
  if(!Array.isArray(chats))chats=[];
  chats=chats.filter(c=>c&&typeof c.id==='string'&&Array.isArray(c.messages));
 }catch{chats=[]}
 renderHistory();
}

function save(){
 try{localStorage.setItem(key,JSON.stringify(chats))}
 catch(e){console.warn('VYRO history save error:',e)}
 renderHistory();
}

function renderHistory(){
 const el=$('history');
 el.replaceChildren();
 [...chats].reverse().forEach(c=>{
  const b=document.createElement('button');
  b.textContent=c.title||'New chat';
  b.onclick=()=>{chatId=c.id;render();showChat()};
  el.append(b);
 });
}

function current(){return chats.find(c=>c.id===chatId)}

function fresh(){
 chatId=String(Date.now())+'-'+Math.random().toString(36).slice(2,7);
 chats.push({id:chatId,title:'New chat',messages:[]});
 save();
 showChat();
 render();
 $('prompt').focus();
}

function closeMenu(){$('sidebar').classList.remove('open')}

function showChat(){
 $('chatView').classList.add('active');
 $('studioView').classList.remove('active');
 $('composerWrap').style.display='block';
 $('pageTitle').textContent='VYRO AI';
 $('chatTab').classList.add('active');
 $('studioTab').classList.remove('active');
 closeMenu();
}

function showStudio(){
 $('chatView').classList.remove('active');
 $('studioView').classList.add('active');
 $('composerWrap').style.display='none';
 $('pageTitle').textContent='Image Studio';
 $('studioTab').classList.add('active');
 $('chatTab').classList.remove('active');
 closeMenu();
}

function render(){
 const c=current(),el=$('messages'),has=!!(c&&c.messages.length);
 $('welcome').style.display=has?'none':'flex';
 el.hidden=!has;
 el.replaceChildren();
 if(!has)return;
 c.messages.forEach(m=>{
  const row=document.createElement('div');
  row.className='message '+(m.role==='user'?'user':'assistant');
  const av=document.createElement('div');
  av.className='avatar';
  av.textContent=m.role==='user'?'Y':'V';
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=m.content;
  row.append(av,b);
  el.append(row);
 });
 requestAnimationFrame(()=>{
  const content=document.querySelector('.content');
  if(content)content.scrollTo({top:content.scrollHeight,behavior:'smooth'});
 });
}

function add(role,content){
 let c=current();
 if(!c){
  chatId=String(Date.now());
  chats.push({id:chatId,title:'New chat',messages:[]});
  c=current();
 }
 c.messages.push({role,content});
 if(role==='user'&&c.title==='New chat')c.title=content.slice(0,35);
 save();
 render();
}

function makeTyping(){
 const row=document.createElement('div');
 row.className='message assistant';
 const av=document.createElement('div');
 av.className='avatar';
 av.textContent='V';
 const b=document.createElement('div');
 b.className='bubble';
 const dots=document.createElement('div');
 dots.className='typing';
 dots.setAttribute('aria-label','VYRO is thinking');
 for(let i=0;i<3;i++)dots.append(document.createElement('span'));
 b.append(dots);
 row.append(av,b);
 return row;
}

async function send(prefill){
 if(busy)return;
 const text=(prefill??$('prompt').value).trim();
 if(!text)return;
 if(!session){$('login').style.display='flex';return}
 if(!current())fresh();
 $('prompt').value='';
 $('prompt').style.height='auto';
 add('user',text);
 busy=true;
 $('send').disabled=true;
 const wait=makeTyping();
 $('messages').append(wait);
 try{
  const r=await fetch('/api/chat',{
   method:'POST',
   headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
   body:JSON.stringify({messages:current().messages})
  });
  const d=await r.json().catch(()=>({error:'The server returned an invalid response.'}));
  if(!r.ok)throw Error(d.details||d.error||'Request failed (HTTP '+r.status+').');
  wait.remove();
  add('assistant',d.response||d.text||'No response received.');
 }catch(e){
  wait.remove();
  add('assistant','I couldn’t complete that request. '+(e.message||'Please try again.'));
  console.error('VYRO chat error:',e);
 }finally{
  busy=false;
  $('send').disabled=false;
  $('prompt').focus();
 }
}

function blobFromBase64(value){
 const match=value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
 const mime=match?match[1]:'image/png';
 const raw=(match?match[2]:value).replace(/\s/g,'');
 try {
   const binary=atob(raw);
   const bytes=new Uint8Array(binary.length);
   for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
   return new Blob([bytes],{type:mime});
 } catch(e){
   return null;
 }
}

async function generate(){
 const prompt=$('imagePrompt').value.trim();
 if(!prompt){$('imageStatus').textContent='Describe your image first.';return}
 if(!session){$('login').style.display='flex';return}
 $('generate').disabled=true;
 $('generate').textContent='Generating…';
 $('imageStatus').textContent='Creating your image. This can take a little while…';
 $('imageResult').replaceChildren();

 try{
  const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({prompt})});
  const type=(r.headers.get('Content-Type')||'').toLowerCase();
  if(!r.ok){
   const d=type.includes('application/json')
    ?await r.json().catch(()=>({}))
    :{details:(await r.text().catch(()=>'' )).slice(0,700)};
   throw Error([d.error,d.details,d.requestId?'Request ID: '+d.requestId:''].filter(Boolean).join(' — ')||'Image generation failed (HTTP '+r.status+').');
  }

  let blob;
  if(type.startsWith('image/')){
   blob=await r.blob();
  }else if(type.includes('application/json')){
   const d=await r.json();
   if(typeof d.image==='string')blob=blobFromBase64(d.image);
   else if(typeof d.data==='string')blob=blobFromBase64(d.data);
   else if(typeof d.image_base64==='string')blob=blobFromBase64(d.image_base64);
   else if(d.debugMode && typeof d.preview === 'string'){
    throw Error('Debug: model returned: '+d.preview);
   } else throw Error(d.error||d.details||'Server returned JSON but no image data.');
  }else{
   const raw=await r.text().catch(()=>'' );
   throw Error('Unexpected image response ('+(type||'unknown type')+'). '+raw.slice(0,250));
  }

  if(!blob||!blob.size)throw Error('The image response was empty.');
  if(!blob.type.startsWith('image/'))throw Error('The server response is not a valid image.');

  const objectUrl=URL.createObjectURL(blob);
  const img=document.createElement('img');
  img.src=objectUrl;
  img.alt=prompt;
  img.onload=()=>{$('imageStatus').textContent='Your image is ready.'};
  img.onerror=()=>{URL.revokeObjectURL(objectUrl);$('imageStatus').textContent='The returned file could not be displayed as an image.';};

  const actions=document.createElement('div');
  actions.className='image-actions';
  const a=document.createElement('a');
  a.href=objectUrl;
  a.download='vyro-image.'+(blob.type.includes('jpeg')||blob.type.includes('jpg')?'jpg':blob.type.includes('webp')?'webp':'png');
  a.className='primary';
  a.textContent='↓ Download image';
  const again=document.createElement('button');
  again.className='primary';
  again.textContent='↻ Generate another';
  again.onclick=generate;
  actions.append(a,again);
  $('imageResult').append(img,actions);
  $('imageStatus').textContent='Image received. Loading preview…';
 }catch(e){
  $('imageStatus').textContent=(e.message||'Image generation failed.')+' Check Workers AI logs for details.';
  console.error('VYRO image UI error:',e);
 }finally{
  $('generate').disabled=false;
  $('generate').textContent='✧ Generate image';
 }
}

$('loginForm').onsubmit=async e=>{
 e.preventDefault();
 if(!sb)return showStatus('Sign-in is still loading. Try again in a moment.');
 const email=$('email').value.trim();
 const password=$('password').value;
 $('loginButton').disabled=true;
 $('resend').classList.add('hidden');
 showStatus(authMode==='signup'?'Creating account…':'Signing in…');
 try{
  if(authMode==='signup'){
   const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/' }});
   if(error)throw error;
   if(data.session){
    applySession(data.session);
    showStatus('Account created and signed in.');
   }else{
    pendingVerificationEmail=email;
    $('resend').classList.remove('hidden');
    showStatus('Account created. Open the verification email, then return here to sign in. Check spam if missing.');
   }
  }else{
   const {data,error}=await sb.auth.signInWithPassword({email,password});
   if(error)throw error;
   if(data.session){applySession(data.session);showStatus('Signed in successfully.')}
  }
 }catch(e){
  showStatus(e.message||'Authentication failed.');
  if(/confirm|not confirmed|email not verified/i.test(e.message||'')){
   pendingVerificationEmail=email;
   $('resend').classList.remove('hidden');
  }
 }finally{$('loginButton').disabled=false}
};

$('resend').onclick=async()=>{
 if(!sb||!pendingVerificationEmail){showStatus('Enter the email address you used to sign up.');return}
 $('resend').disabled=true;
 showStatus('Sending another verification email…');
 try{
  const {error}=await sb.auth.resend({type:'signup',email:pendingVerificationEmail,options:{emailRedirectTo:location.origin+'/' }});
  if(error)throw error;
  showStatus('Verification email requested. Check your inbox and spam folder.');
 }catch(e){showStatus(e.message||'Could not resend the email.')}
 finally{$('resend').disabled=false}
};

// Wipe local data button
$('wipeData').onclick=async()=>{
 if(!confirm('This will erase all local chat history and cached data in your browser. Continue?'))return;
 try{
  localStorage.clear();
  chats=[];chatId=null;
  renderHistory();render();
  showStatus('Local data cleared.');
 }catch(e){console.warn('Wipe failed',e);showStatus('Could not clear local data.');}
};

$('signInTab').onclick=()=>setAuthMode('signin');
$('signUpTab').onclick=()=>setAuthMode('signup');
$('send').onclick=()=>send();
$('prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
$('prompt').addEventListener('input',()=>{$('prompt').style.height='auto';$('prompt').style.height=Math.min($('prompt').scrollHeight,170)+'px';});
$('new').onclick=fresh;
$('menu').onclick=()=>$('sidebar').classList.toggle('open');
$('chatTab').onclick=showChat;
$('studioTab').onclick=showStudio;
$('toStudio').onclick=showStudio;
$('generate').onclick=generate;
document.querySelectorAll('[data-prompt]').forEach(b=>{b.onclick=()=>send(b.dataset.prompt)});

$('clearHistory').onclick=()=>{
 if(!confirm('Delete saved chat history from this browser? This cannot be undone.'))return;
 chats=[];chatId=null;
 try{localStorage.removeItem(key)}catch(e){console.warn('History storage clear failed:',e)}
 renderHistory();render();closeMenu();
};

$('logout').onclick=async()=>{
 if(sb){
  const {error}=await sb.auth.signOut();
  if(error)console.error('VYRO sign-out error:',error);
 }
 // clear local chat data on logout as requested
 try{localStorage.removeItem(key);}catch(e){console.warn('Failed to remove local history',e)}
 chats=[];chatId=null;
 session=null;
 $('profile').textContent='Not signed in';
 $('login').style.display='flex';
 setAuthMode('signin');
};

init();
})();
</script>
</body>
</html>`;

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "X-Content-Type-Options":"nosniff"
    }
  });
}

async function verifyUser(request,env){
  const auth=request.headers.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!token||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return null;
  try{
    const r=await fetch(env.SUPABASE_URL.replace(/\/+$/, '')+"/auth/v1/user",{
      headers:{Authorization:"Bearer "+token,apikey:env.SUPABASE_ANON_KEY}
    });
    if(!r.ok) return null;
    const user=await r.json();
    return user && user.id ? user : null;
  }catch(e){
    console.error("VYRO AUTH ERROR:", e instanceof Error ? e.message : String(e));
    return null;
  }
}

function imageResponse(bytes,mime="image/png"){
  // Accept ArrayBuffer or Uint8Array
  return new Response(bytes, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function pickImagePayload(result){
  // Return {mime, bytes:Uint8Array} or null
  if (result instanceof ArrayBuffer) return {mime:'image/png', bytes:new Uint8Array(result)};
  if (result instanceof Uint8Array) return {mime:'image/png', bytes:result};
  if (typeof result === 'string') {
    const match = result.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
    if (match) {
      const raw = match[2].replace(/\s/g,'');
      return {mime:match[1], bytes:Uint8Array.from(atob(raw), c => c.charCodeAt(0))};
    }
    const raw = result.replace(/\s/g,'');
    try { return {mime:'image/png', bytes:Uint8Array.from(atob(raw), c => c.charCodeAt(0))}; } catch { return null; }
  }
  if (result && typeof result === 'object') {
    const candidate = result.image ?? result.data ?? result.image_base64 ?? result.output ?? result.result ?? null;
    if (typeof candidate === 'string') {
      const match = candidate.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
      if (match) {
        const raw = match[2].replace(/\s/g,'');
        return {mime:match[1], bytes:Uint8Array.from(atob(raw), c => c.charCodeAt(0))};
      }
      const raw = candidate.replace(/\s/g,'');
      try { return {mime:'image/png', bytes:Uint8Array.from(atob(raw), c => c.charCodeAt(0))}; } catch { return null; }
    }
    if (candidate instanceof ArrayBuffer) return {mime:'image/png', bytes:new Uint8Array(candidate)};
    if (candidate instanceof Uint8Array) return {mime:'image/png', bytes:candidate};
  }
  return null;
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const started=Date.now();
    const requestId=crypto.randomUUID();
    const log=(event,details={})=>console.log(JSON.stringify({service:"VYRO AI",requestId,event,elapsedMs:Date.now()-started,...details}));

    if(request.method==="OPTIONS"){
      return new Response(null,{status:204,headers:{
        "Access-Control-Allow-Origin":url.origin,
        "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
        "Access-Control-Allow-Headers":"Content-Type,Authorization",
        "Access-Control-Max-Age":"86400"
      }});
    }

    if(request.method==="GET"&&(url.pathname==="/"||url.pathname==="/index.html")){
      return new Response(HTML,{headers:{
        "Content-Type":"text/html; charset=utf-8",
        "Cache-Control":"no-cache",
        "X-Content-Type-Options":"nosniff"
      }});
    }

    if(request.method==="GET"&&url.pathname==="/api/config"){
      return json({supabaseUrl:env.SUPABASE_URL||"",supabaseAnonKey:env.SUPABASE_ANON_KEY||""});
    }

    if(request.method==="GET"&&url.pathname==="/api/health"){
      return json({ok:true,service:"VYRO AI",ai:!!env.AI,supabaseConfigured:!!(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY)});
    }

    // Chat endpoint
    if(url.pathname==="/api/chat"&&request.method==="POST"){
      log("chat.request");
      try{
        if(!await verifyUser(request,env)){
          log("chat.auth_failed");
          return json({error:"Please sign in again. If your email is not verified, verify it first.",requestId},401);
        }
        if(!env.AI){
          log("chat.binding_missing");
          return json({error:"Workers AI binding named AI is missing.",requestId},500);
        }
        let body;
        try{ body = await request.json(); } catch { return json({error:"Invalid JSON.",requestId},400); }
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        if(!messages.length) return json({error:"Send a message first.",requestId},400);
        const clean = messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0,10000) }));
        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", { messages: [{role:"system",content:"You are VYRO AI, a helpful and accurate assistant. Explain clearly and naturally."}, ...clean], max_tokens:1200 });
        log("chat.success",{messageCount:messages.length});
        // result may be structured; reading .response is common
        return json({response: result?.response ?? (typeof result === 'string' ? result : 'No response generated.'), requestId});
      }catch(e){
        const details = e instanceof Error ? e.message : String(e);
        console.error(JSON.stringify({service:"VYRO AI",requestId,event:"chat.error",elapsedMs:Date.now()-started,details:details.slice(0,1200)}));
        return json({error:"AI request failed. Check Workers AI availability and limits.",details:details.slice(0,500),requestId},502);
      }
    }

    // Image endpoint with debug mode
    if(url.pathname==="/api/image"&&request.method==="POST"){
      const debug = url.searchParams.get('debug') === '1';
      log("image.request",{debug});
      try{
        if(!await verifyUser(request,env)){
          log("image.auth_failed");
          return json({error:"Please sign in again. If your email is not verified, verify it first.",requestId},401);
        }
        if(!env.AI){
          log("image.binding_missing");
          return json({error:"Workers AI binding named AI is missing.",requestId},500);
        }
        let body;
        try{ body = await request.json(); } catch { return json({error:"Invalid JSON.",requestId},400); }
        const prompt = String(body.prompt || '').trim().slice(0,1500);
        if(!prompt) return json({error:"Describe your image first.",requestId},400);

        log("image.model_start",{model:"@cf/black-forest-labs/flux-1-schnell",promptLength:prompt.length});
        const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", { prompt, steps: 4 });

        if(debug){
          const preview = typeof result === 'string' ? result.slice(0,400) : (() => { try { return JSON.stringify(result).slice(0,400) } catch { return String(result).slice(0,400) } })();
          return json({
            ok: false,
            debugMode: true,
            requestId,
            resultType: result === null ? 'null' : Array.isArray(result) ? 'array' : typeof result,
            constructorName: result && result.constructor ? result.constructor.name : 'none',
            preview,
            hasImageKey: !!(result && typeof result === 'object' && ('image' in result || 'data' in result || 'image_base64' in result || 'output' in result || 'result' in result)),
            keys: result && typeof result === 'object' ? Object.keys(result).slice(0,20) : null
          },200);
        }

        const payload = pickImagePayload(result);
        if(!payload){
          log('image.model_unexpected',{resultType: typeof result});
          return json({error:'Unexpected image model result',details: typeof result === 'string' ? result.slice(0,1000) : (()=>{ try{return JSON.stringify(result).slice(0,1000)}catch{return String(result).slice(0,1000)}})(), requestId},502);
        }

        log('image.model_success',{contentType:payload.mime,bytes:payload.bytes.length});
        return imageResponse(payload.bytes,payload.mime);
      }catch(e){
        const details=e instanceof Error?e.message:String(e);
        log('image.error',{details:details.slice(0,1200)});
        console.error(JSON.stringify({service:"VYRO AI",requestId,event:"image.error",elapsedMs:Date.now()-started,details:details.slice(0,1200)}));
        return json({error:"Image generation failed. Check Workers AI availability and limits.",details:details.slice(0,500),requestId},502);
      }
    }

    return json({error:'Not found'},404);
  }
};
