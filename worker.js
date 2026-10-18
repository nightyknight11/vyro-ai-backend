
const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#09090B">
<title>VYRO AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root{color-scheme:dark;--bg:#09090B;--panel:#111114;--line:#29292F;--text:#F2F2F5;--muted:#90909C;--accent:#8970D9;--accent2:#A38BEF}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
button,input,textarea{font:inherit}
button{cursor:pointer;color:inherit;border:1px solid #303037;border-radius:0!important;background:#141418;padding:10px;text-align:left;transition:background .12s,border-color .12s}
button:hover{background:#202025;border-color:#55505F}
button:active{transform:none}
button:disabled{opacity:.55;cursor:wait}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--accent2);outline-offset:2px}
input,textarea{border-radius:0!important}
.app{height:100dvh;display:flex;overflow:hidden}
.sidebar{width:260px;flex-shrink:0;background:#0D0D10;border-right:1px solid #242429;padding:17px 13px;display:flex;flex-direction:column;gap:10px;z-index:10}
.brand{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:800;letter-spacing:-.6px;padding:8px 7px 17px}
.logo.vyro-logo{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:#17131F;border:1px solid #51416F;overflow:hidden;border-radius:0!important;box-shadow:none!important}
.logo.vyro-logo svg{display:block;width:82%;height:82%}
.brand .logo{display:grid;place-items:center}
.new{width:100%;padding:12px;background:#17171B;border-color:#35353D;font-weight:700}
.nav{width:100%;padding:12px;color:#C8C8D2;border-color:transparent;background:transparent}
.nav.active,.auth-switch button.active{background:#211B30;border-color:#53436F;color:#E5DCFF}
.label{font-size:11px;font-weight:750;color:var(--muted);letter-spacing:1.4px;margin:18px 8px 6px}
.history{overflow:auto;display:grid;gap:5px}
.history button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#DDD;border-color:transparent;background:transparent;padding:10px 11px;font-size:13px}
.history button:hover{background:#202025}
.bottom{margin-top:auto;border-top:1px solid #29292F;padding:15px 5px 0}
.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere;margin-bottom:8px}
.bottom button{width:100%;margin-top:6px}
.danger:hover{background:#351D25;border-color:#75404B}
.main{flex:1;min-width:0;display:flex;flex-direction:column;background:var(--bg)}
.top{height:62px;flex-shrink:0;border-bottom:1px solid #242429;background:#0B0B0E;display:flex;align-items:center;padding:0 18px;gap:12px;z-index:2}
.top button{background:#141418}
.topname{font-weight:750;letter-spacing:-.3px}
.content{flex:1;min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#393440 transparent}
.view{display:none;min-height:100%}
.view.active{display:block}
.welcome{min-height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:32px 20px}
.welcome>.logo{width:68px;height:68px}
.welcome h1{font-size:clamp(26px,5vw,44px);font-weight:780;letter-spacing:-1.4px;line-height:1.12;margin:18px 0 8px}
.gradient{color:#B5A0FF}
.sub{color:#A0A0AC}
.suggestions{width:min(720px,100%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:22px}
.suggestion{min-height:86px;background:#111114;border-color:#29292F;padding:16px}
.suggestion:hover{background:#19191F;border-color:#625183}
.suggestion strong,.suggestion span{display:block}
.suggestion strong{font-size:14px;font-weight:700}
.suggestion span{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.45}
.messages{width:min(860px,100%);margin:auto;padding:26px 18px 40px;display:grid;gap:20px}
.message{display:flex;gap:12px;align-items:flex-start}
.message.user{flex-direction:row-reverse}
.avatar{flex-shrink:0;width:36px;height:36px;border-radius:0!important;background:#8970D9;color:white;display:grid;place-items:center;font-weight:850;font-size:13px}
.message.user .avatar{background:#29252F;color:#F5F1FF}
.bubble{max-width:85%;min-width:0;background:#131317;border:1px solid #29292F;border-radius:0!important;padding:12px 14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;box-shadow:none}
.message.user .bubble{background:#1C1923;border-color:#393044}
.typing{display:flex;align-items:center;gap:5px;padding:8px 3px}
.typing span{width:6px;height:6px;background:var(--accent2);opacity:.7}
.composer-wrap{flex-shrink:0;padding:12px 15px max(12px,env(safe-area-inset-bottom))}
.composer{width:min(880px,100%);margin:auto;background:#111114;border:1px solid #303037;border-radius:0!important;padding:12px;box-shadow:none}
.composer:focus-within{border-color:var(--accent);box-shadow:none}
textarea{width:100%;resize:vertical;min-height:44px;max-height:170px;border:0;outline:0;background:transparent;color:white;padding:8px;line-height:1.6}
.actions{display:flex;align-items:center;gap:8px}
.actions button{border:0;color:#CCC;font-size:13px;padding:10px 12px}
.actions button:hover{background:#25212E}
.primary{background:#8970D9!important;color:#FFF!important;border:1px solid #8970D9!important;border-radius:0!important;font-weight:700;box-shadow:none!important}
.primary:hover{background:#765BC7!important;border-color:#765BC7!important;box-shadow:none!important;transform:none!important}
.send{margin-left:auto;min-width:40px;min-height:40px;display:grid;place-items:center;text-align:center;background:#8970D9!important;color:#FFF!important;font-weight:900;font-size:18px;box-shadow:none!important}
.note{text-align:center;font-size:10px;color:#737380;padding-top:10px}
.studio{max-width:860px;margin:auto;padding:24px 22px}
.studio h1{font-size:34px;letter-spacing:-1.2px;margin:6px 0}
.studio textarea{display:block;width:100%;background:var(--panel);border:1px solid var(--line);padding:14px;min-height:140px;margin-top:20px;resize:vertical}
#imageResult{margin-top:18px}
#imageResult img{display:block;width:100%;height:auto;max-height:650px;object-fit:contain;border-radius:0!important;border:1px solid #303037;box-shadow:none}
.image-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.image-actions a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:10px 14px}
.image-actions button,.image-actions a{min-height:42px}
.status{color:var(--accent2);font-size:12px;min-height:20px;margin-top:12px;overflow-wrap:anywhere;line-height:1.6}
.overlay{position:fixed;inset:0;background:#070709;display:flex;align-items:center;justify-content:center;padding:18px;z-index:30;overflow:auto}
.card{width:min(440px,100%);background:#101013;border:1px solid #303037;border-radius:0!important;padding:28px;box-shadow:none;margin:auto}
.card .brand{justify-content:center;font-size:20px;padding:4px 0 18px}
.card h2{text-align:center;font-size:28px;letter-spacing:-.8px;margin:8px 0 10px}
.card p{text-align:center;color:var(--muted);font-size:13px;line-height:1.6}
.card label{display:block;font-size:13px;font-weight:700;color:#DEDEE7;margin:16px 0 8px}
.card input{width:100%;min-height:48px;padding:12px;background:#0A0A0D;border:1px solid #34343D;color:white;outline:none}
.card input:focus{border-color:var(--accent2);box-shadow:none}
.card .primary{width:100%;min-height:48px;margin-top:12px;text-align:center}
.auth-switch{display:flex;gap:0;margin:14px 0 10px;border:1px solid #303037}
.auth-switch button{flex:1;text-align:center;border:0;min-height:42px}
.auth-switch button+button{border-left:1px solid #303037}
.secondary{width:100%;text-align:center;margin-top:9px}
.small{font-size:11px!important;line-height:1.6}
.hidden{display:none!important}
@media(max-width:700px){
.sidebar{position:fixed;top:0;bottom:0;left:0;width:min(285px,86vw);transform:translateX(-110%);transition:transform .2s;box-shadow:none}
.sidebar.open{transform:translateX(0)}
.top{height:57px;padding:0 10px}
.welcome{padding:24px 14px}
.welcome h1{letter-spacing:-1.2px}
.suggestions{grid-template-columns:1fr;gap:9px;margin-top:18px}
.suggestion{min-height:75px;padding:14px}
.messages{padding:20px 10px 28px;gap:18px}
.bubble{max-width:90%;padding:10px 12px}
.composer-wrap{padding:8px 9px max(10px,env(safe-area-inset-bottom))}
.composer{padding:10px}
.studio{padding:20px 14px}
.studio h1{font-size:30px}
.card{padding:22px 18px}
.actions{gap:6px}
.actions button{padding:8px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar" id="sidebar">
<div class="brand">
<div class="logo vyro-logo" aria-label="VYRO AI logo">
<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 8H17L24 24L31 8H40L24 41L8 8Z" fill="#B5A0FF"/><path d="M17 8L24 24L31 8H24L17 8Z" fill="#F0EBFF"/><path d="M21 28L24 34L27 28L24 24Z" fill="#5E46B5"/></svg>
</div> VYRO AI
</div>
<button class="new" id="new">＋ New chat</button>
<button class="nav active" id="chatTab">◫ &nbsp; Chat</button>
<button class="nav" id="studioTab">▧ &nbsp; Image Studio</button>
<div class="label">RECENT CHATS</div>
<div class="history" id="history"></div>
<div class="bottom">
<div class="profile" id="profile">Not signed in</div>
<button id="clearHistory" class="danger">⌫ &nbsp; Clear chat history</button>
<button id="logout">↪ &nbsp; Sign out</button>
</div>
</aside>
<main class="main">
<header class="top">
<button id="menu" aria-label="Open menu">☰</button>
<div class="topname" id="pageTitle">VYRO AI</div>
</header>
<section class="content">
<div class="view active" id="chatView">
<div class="welcome" id="welcome">
<div class="logo vyro-logo" aria-label="VYRO AI logo">
<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 8H17L24 24L31 8H40L24 41L8 8Z" fill="#B5A0FF"/><path d="M17 8L24 24L31 8H24L17 8Z" fill="#F0EBFF"/><path d="M21 28L24 34L27 28L24 24Z" fill="#5E46B5"/></svg>
</div>
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
<textarea id="imagePrompt" maxlength="1500" placeholder="Describe the image you want to create..."></textarea>
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
<div class="brand">
<div class="logo vyro-logo" aria-label="VYRO AI logo">
<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 8H17L24 24L31 8H40L24 41L8 8Z" fill="#B5A0FF"/><path d="M17 8L24 24L31 8H24L17 8Z" fill="#F0EBFF"/><path d="M21 28L24 34L27 28L24 24Z" fill="#5E46B5"/></svg>
</div> VYRO AI
</div>
<div style="text-align:center;margin:14px 0 24px">
<div style="font-size:11px;letter-spacing:2px;color:#A38BEF;font-weight:800">YOUR AI WORKSPACE</div>
<h2 id="authTitle">Welcome back</h2>
<p id="authSubtitle">Sign in to continue creating with VYRO.</p>
</div>
<div class="auth-switch">
<button type="button" id="signInTab" class="active">Sign in</button>
<button type="button" id="signUpTab">Create account</button>
</div>
<form id="loginForm">
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" placeholder="you@example.com" required>
<label for="password">Password</label>
<input id="password" type="password" autocomplete="current-password" minlength="6" placeholder="At least 6 characters" required>
<button class="primary" id="loginButton" type="submit">Sign in</button>
</form>
<button type="button" class="secondary hidden" id="resend">Resend verification email</button>
<div class="status" id="loginStatus" role="status" aria-live="polite"></div>
<p class="small">New accounts may require email verification. Check your inbox and spam folder for the verification link.</p>
<div style="border-top:1px solid #29292F;margin-top:20px;padding-top:14px">
<button type="button" id="wipeData" class="secondary">Clear local browser data</button>
</div>
</div>
</div>

<script>
(()=>{
'use strict';
const $=id=>document.getElementById(id);
let sb=null,session=null,busy=false,chats=[],chatId=null,authMode='signin',pendingVerificationEmail='',imageBusy=false;
const key='vyro_chat_history_v1';

function showStatus(t){$('loginStatus').textContent=t}
function setAuthMode(mode){
 authMode=mode;
 const signup=mode==='signup';
 $('authTitle').textContent=signup?'Create your account':'Welcome back';
 $('authSubtitle').textContent=signup?'Create an account with your email and a password.':'Sign in to continue creating with VYRO.';
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
  if(!window.supabase)throw Error('Supabase library failed to load. Refresh and try again.');
  sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{
   auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });

  const {data,error}=await sb.auth.getSession();
  if(error)throw error;
  applySession(data.session);

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
  if(content)content.scrollTo({top:content.scrollHeight,behavior:'auto'});
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
  if(!r.ok)throw Error([d.error,d.details,d.requestId?'Request ID: '+d.requestId:''].filter(Boolean).join(' — ')||'Request failed (HTTP '+r.status+').');
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
 if(typeof value!=='string')return null;
 const match=value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
 const mime=match?match[1]:'image/png';
 const raw=(match?match[2]:value).replace(/\s/g,'');
 try{
  const binary=atob(raw);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return new Blob([bytes],{type:mime});
 }catch{return null}
}

async function generate(){
 if(imageBusy)return;
 const prompt=$('imagePrompt').value.trim();
 if(!prompt){$('imageStatus').textContent='Describe your image first.';return}
 if(!session){$('login').style.display='flex';return}

 imageBusy=true;
 $('generate').disabled=true;
 $('generate').textContent='Generating...';
 $('imageStatus').textContent='Creating your image. This may take a little while...';
 $('imageResult').replaceChildren();

 try{
  const r=await fetch('/api/image',{
   method:'POST',
   headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
   body:JSON.stringify({prompt})
  });
  const type=(r.headers.get('Content-Type')||'').toLowerCase();
  let blob;

  if(!r.ok){
   const d=type.includes('application/json')
    ?await r.json().catch(()=>({}))
    :{details:(await r.text().catch(()=>'' )).slice(0,500)};
   throw Error([d.error,d.details,d.requestId?'Request ID: '+d.requestId:''].filter(Boolean).join(' — ')||'Image generation failed (HTTP '+r.status+').');
  }

  if(type.startsWith('image/')){
   blob=await r.blob();
  }else if(type.includes('application/json')){
   const d=await r.json();
   if(typeof d.image==='string')blob=blobFromBase64(d.image);
   else if(typeof d.data==='string')blob=blobFromBase64(d.data);
   else if(typeof d.image_base64==='string')blob=blobFromBase64(d.image_base64);
   else throw Error(d.error||d.details||'The server returned no usable image data.');
  }else{
   throw Error('Unexpected image response content type: '+(type||'unknown'));
  }

  if(!blob||!blob.size)throw Error('The image response was empty.');
  if(!blob.type.startsWith('image/'))throw Error('The server response is not a valid image.');

  const objectUrl=URL.createObjectURL(blob);
  const img=document.createElement('img');
  img.src=objectUrl;
  img.alt=prompt;
  img.onload=()=>{$('imageStatus').textContent='Your image is ready.'};
  img.onerror=()=>{
   URL.revokeObjectURL(objectUrl);
   $('imageStatus').textContent='The returned file could not be displayed.';
  };

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
  $('imageStatus').textContent='Image received. Loading preview...';
 }catch(e){
  $('imageStatus').textContent=(e.message||'Image generation failed.')+' Check the Worker logs for details.';
  console.error('VYRO image UI error:',e);
 }finally{
  imageBusy=false;
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
 showStatus(authMode==='signup'?'Creating account...':'Signing in...');
 try{
  if(authMode==='signup'){
   const {data,error}=await sb.auth.signUp({
    email,password,
    options:{emailRedirectTo:location.origin+'/'}
   });
   if(error)throw error;
   if(data.session){
    applySession(data.session);
    showStatus('Account created and signed in.');
   }else{
    pendingVerificationEmail=email;
    $('resend').classList.remove('hidden');
    showStatus('Account created. Verify your email before signing in. Check your spam folder if needed.');
   }
  }else{
   const {data,error}=await sb.auth.signInWithPassword({email,password});
   if(error)throw error;
   if(data.session){
    applySession(data.session);
    showStatus('Signed in successfully.');
   }else{
    showStatus('No session returned. Check your email verification.');
   }
  }
 }catch(e){
  showStatus(e.message||'Authentication failed.');
  if(/confirm|not confirmed|email not verified/i.test(e.message||'')){
   pendingVerificationEmail=email;
   $('resend').classList.remove('hidden');
  }
 }finally{
  $('loginButton').disabled=false;
 }
};

$('resend').onclick=async()=>{
 if(!sb||!pendingVerificationEmail){
  showStatus('Enter the email address you used to sign up.');
  return;
 }
 $('resend').disabled=true;
 showStatus('Sending another verification email...');
 try{
  const {error}=await sb.auth.resend({
   type:'signup',
   email:pendingVerificationEmail,
   options:{emailRedirectTo:location.origin+'/'}
  });
  if(error)throw error;
  showStatus('Verification email requested. Check your inbox and spam folder.');
 }catch(e){
  showStatus(e.message||'Could not resend the email.');
 }finally{
  $('resend').disabled=false;
 }
};

$('wipeData').onclick=()=>{
 if(!confirm('This clears all local browser storage for this site, including saved chat history. Continue?'))return;
 try{
  localStorage.clear();
  sessionStorage.clear();
  chats=[];chatId=null;
  renderHistory();render();
  showStatus('Local browser data cleared. You may need to sign in again.');
 }catch(e){
  console.warn('Wipe failed:',e);
  showStatus('Could not clear all local browser data.');
 }
};

$('signInTab').onclick=()=>setAuthMode('signin');
$('signUpTab').onclick=()=>setAuthMode('signup');
$('send').onclick=()=>send();
$('prompt').onkeydown=e=>{
 if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}
};
$('prompt').addEventListener('input',()=>{
 $('prompt').style.height='auto';
 $('prompt').style.height=Math.min($('prompt').scrollHeight,170)+'px';
});
$('new').onclick=fresh;
$('menu').onclick=()=>$('sidebar').classList.toggle('open');
$('chatTab').onclick=showChat;
$('studioTab').onclick=showStudio;
$('toStudio').onclick=showStudio;
$('generate').onclick=generate;
document.querySelectorAll('[data-prompt]').forEach(b=>{
 b.onclick=()=>send(b.dataset.prompt);
});

$('clearHistory').onclick=()=>{
 if(!confirm('Delete saved chat history from this browser? This cannot be undone.'))return;
 chats=[];chatId=null;
 try{localStorage.removeItem(key)}catch(e){console.warn('History storage error:',e)}
 renderHistory();render();closeMenu();
};

$('logout').onclick=async()=>{
 if(sb){
  const {error}=await sb.auth.signOut();
  if(error)console.error('VYRO sign-out error:',error);
 }
 try{localStorage.removeItem(key)}catch(e){console.warn('History removal failed:',e)}
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
 if(!token||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY)return null;
 try{
  const r=await fetch(env.SUPABASE_URL.replace(/\/+$/,"")+"/auth/v1/user",{
   headers:{Authorization:"Bearer "+token,apikey:env.SUPABASE_ANON_KEY}
  });
  if(!r.ok)return null;
  const user=await r.json();
  return user&&user.id?user:null;
 }catch(e){
  console.error("VYRO AUTH ERROR:",e instanceof Error?e.message:String(e));
  return null;
 }
}

function imageResponse(bytes,mime="image/png"){
 return new Response(bytes,{
  headers:{
   "Content-Type":mime,
   "Cache-Control":"no-store",
   "X-Content-Type-Options":"nosniff",
   "Content-Disposition":"inline"
  }
 });
}

function pickImagePayload(result){
 const decodeBase64=value=>{
  if(typeof value!=="string")return null;
  const match=value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
  const raw=(match?match[2]:value).replace(/\s/g,"");
  if(!raw)return null;
  try{
   const binary=atob(raw);
   const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
   return {mime:match?match[1]:"image/png",bytes};
  }catch{return null}
 };
 const decodeBytes=value=>{
  if(value instanceof ArrayBuffer)return {mime:"image/png",bytes:new Uint8Array(value)};
  if(ArrayBuffer.isView(value)){
   return {mime:"image/png",bytes:new Uint8Array(value.buffer,value.byteOffset,value.byteLength)};
  }
  return null;
 };
 const direct=decodeBytes(result);
 if(direct)return direct;
 if(typeof result==="string")return decodeBase64(result);
 if(!result||typeof result!=="object")return null;
 for(const candidate of [result.image,result.image_base64,result.data,result.output,result.result]){
  const bytes=decodeBytes(candidate);
  if(bytes)return bytes;
  if(typeof candidate==="string"){
   const decoded=decodeBase64(candidate);
   if(decoded)return decoded;
  }
 }
 return null;
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const started=Date.now();
  const requestId=crypto.randomUUID();
  const log=(event,details={})=>console.log(JSON.stringify({
   service:"VYRO AI",
   requestId,
   event,
   elapsedMs:Date.now()-started,
   ...details
  }));

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
   return json({
    supabaseUrl:env.SUPABASE_URL||"",
    supabaseAnonKey:env.SUPABASE_ANON_KEY||""
   });
  }

  if(request.method==="GET"&&url.pathname==="/api/health"){
   return json({
    ok:true,
    service:"VYRO AI",
    ai:!!env.AI,
    supabaseConfigured:!!(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY)
   });
  }

  if(url.pathname==="/api/chat"&&request.method==="POST"){
   log("chat.request");
   try{
    if(!await verifyUser(request,env)){
     log("chat.auth_failed");
     return json({error:"Please sign in again. Verify your email if required.",requestId},401);
    }
    if(!env.AI){
     log("chat.binding_missing");
     return json({error:"Workers AI binding named AI is missing.",requestId},500);
    }

    let body;
    try{body=await request.json()}catch{
     return json({error:"Invalid JSON.",requestId},400);
    }

    const messages=Array.isArray(body.messages)?body.messages.slice(-20):[];
    if(!messages.length)return json({error:"Send a message first.",requestId},400);

    const clean=messages.map(m=>({
     role:m.role==="assistant"?"assistant":"user",
     content:String(m.content||"").slice(0,10000)
    }));

    const result=await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast",{
     messages:[
      {role:"system",content:"You are VYRO AI, a helpful and accurate assistant. Explain clearly and naturally."},
      ...clean
     ],
     max_tokens:1200
    });

    const response=result?.response??(typeof result==="string"?result:"");
    if(!response){
     log("chat.empty_response");
     return json({error:"The AI returned an empty response.",requestId},502);
    }

    log("chat.success",{messageCount:messages.length});
    return json({response,requestId});
   }catch(e){
    const details=e instanceof Error?e.message:String(e);
    log("chat.error",{details:details.slice(0,1000)});
    return json({
     error:"AI request failed. Check Workers AI availability and limits.",
     details:details.slice(0,500),
     requestId
    },502);
   }
  }

  if(url.pathname==="/api/image"&&request.method==="POST"){
   const debug=url.searchParams.get("debug")==="1";
   log("image.request",{debug});
   try{
    if(!await verifyUser(request,env)){
     log("image.auth_failed");
     return json({error:"Please sign in again. Verify your email if required.",requestId},401);
    }
    if(!env.AI){
     log("image.binding_missing");
     return json({error:"Workers AI binding named AI is missing.",requestId},500);
    }

    let body;
    try{body=await request.json()}catch{
     return json({error:"Invalid JSON.",requestId},400);
    }

    const prompt=String(body.prompt||"").trim().slice(0,1500);
    if(!prompt)return json({error:"Describe your image first.",requestId},400);

    const model="@cf/black-forest-labs/flux-1-schnell";
    log("image.model_start",{model,promptLength:prompt.length});

    const result=await env.AI.run(model,{prompt,steps:4});

    if(debug){
     let preview;
     try{
      preview=typeof result==="string"?result.slice(0,400):JSON.stringify(result).slice(0,400);
     }catch{preview=String(result).slice(0,400)}
     return json({
      ok:true,
      debugMode:true,
      requestId,
      resultType:result===null?"null":ArrayBuffer.isView(result)?"typed-array":typeof result,
      constructorName:result&&result.constructor?result.constructor.name:"none",
      preview,
      keys:result&&typeof result==="object"?Object.keys(result).slice(0,20):[]
     });
    }

    const payload=pickImagePayload(result);
    if(!payload||!payload.bytes||!payload.bytes.byteLength){
     let details;
     try{details=JSON.stringify(result).slice(0,700)}catch{details=String(result).slice(0,700)}
     log("image.model_unexpected",{
      resultType:result===null?"null":typeof result,
      resultKeys:result&&typeof result==="object"?Object.keys(result).slice(0,15):[]
     });
     return json({
      error:"The image model returned no usable image.",
      details:details||"Check the model output format and Workers AI logs.",
      requestId
     },502);
    }

    const allowed=["image/png","image/jpeg","image/webp"];
    const mime=allowed.includes(payload.mime)?payload.mime:"image/png";

    // Validate common image signatures before returning bytes.
    const b=payload.bytes;
    const png=b.length>=8&&b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71;
    const jpeg=b.length>=3&&b[0]===255&&b[1]===216&&b[2]===255;
    const webp=b.length>=12&&String.fromCharCode(...b.slice(0,4))==="RIFF"&&String.fromCharCode(...b.slice(8,12))==="WEBP";

    const actualMime=png?"image/png":jpeg?"image/jpeg":webp?"image/webp":null;
    if(!actualMime){
     log("image.invalid_bytes",{bytes:b.byteLength,declaredMime:mime});
     return json({
      error:"The image model returned data that is not a recognized image.",
      details:"The model response could not be validated as PNG, JPEG, or WebP.",
      requestId
     },502);
    }

    log("image.model_success",{contentType:actualMime,bytes:b.byteLength});
    return imageResponse(b,actualMime);
   }catch(e){
    const details=e instanceof Error?e.message:String(e);
    log("image.error",{details:details.slice(0,1200)});
    return json({
     error:"Image generation failed. Check Workers AI availability and limits.",
     details:details.slice(0,500),
     requestId
    },502);
   }
  }

  return json({error:"Not found",requestId},404);
 }
};
