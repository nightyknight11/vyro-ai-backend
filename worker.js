
const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#111113">
<meta name="description" content="VYRO AI — think, create, and explore.">
<title>VYRO AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root {
  color-scheme: dark;
  --bg:#111113;
  --panel:#19191d;
  --panel2:#222226;
  --line:#303036;
  --text:#f4f3f1;
  --muted:#a09faa;
  --accent:#c3b3ff;
  --accentText:#211a32;
  --radius:16px;
}
*{box-sizing:border-box}
html{height:100%;scroll-behavior:smooth}
body{
  margin:0;min-height:100%;background:var(--bg);color:var(--text);
  font:15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  letter-spacing:-.12px;-webkit-font-smoothing:antialiased
}
button,input,textarea{font:inherit}
button{cursor:pointer;color:inherit;-webkit-tap-highlight-color:transparent}
button:disabled{opacity:.55;cursor:wait}
button:focus-visible,input:focus-visible,textarea:focus-visible{
  outline:2px solid var(--accent);outline-offset:3px
}
.app{height:100dvh;min-height:440px;display:flex;overflow:hidden}
.sidebar{
  position:relative;z-index:20;width:258px;flex:0 0 258px;
  background:#151517;border-right:1px solid #29292e;padding:15px 12px;
  display:flex;flex-direction:column;gap:8px;
  transition:transform .25s cubic-bezier(.2,.7,.2,1)
}
.brand{
  display:flex;align-items:center;gap:10px;font-size:19px;
  font-weight:780;letter-spacing:-.7px;padding:8px 7px 18px
}
.logo{
  width:35px;height:35px;flex:0 0 35px;border-radius:12px;
  background:var(--accent);display:grid;place-items:center;
  color:var(--accentText);font-weight:900;letter-spacing:-1px;
  box-shadow:0 4px 20px #c3b3ff16
}
button{
  border:1px solid var(--line);background:transparent;
  border-radius:11px;padding:10px;text-align:left;
  transition:background .18s,border-color .18s,transform .18s,box-shadow .18s
}
button:hover{background:#252529;border-color:#484850}
button:active{transform:scale(.985)}
.new{
  width:100%;padding:12px;background:#202024;border-color:#393940;
  font-weight:650
}
.nav{
  width:100%;padding:11px 12px;color:#c6c5ce;
  border-color:transparent;display:flex;align-items:center;gap:10px
}
.nav-icon{width:19px;text-align:center;font-size:16px;color:#aaa7b6}
.nav.active{background:#2a2633;border-color:#393342;color:#f0eaff}
.nav.active .nav-icon{color:var(--accent)}
.label{
  font-size:10px;color:#898893;font-weight:750;letter-spacing:1.4px;
  margin:18px 8px 5px
}
.history{overflow:auto;display:grid;gap:3px;align-content:start}
.history button{
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  color:#c8c7ce;border-color:transparent;padding:9px 10px;
  border-radius:9px;font-size:13px
}
.history button:hover{background:#222226}
.bottom{
  margin-top:auto;border-top:1px solid #2a2a30;padding:13px 4px 0;
  display:grid;gap:9px
}
.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere;padding:0 6px}
#logout{font-size:13px;color:#c8c6d0;border-color:transparent}
.main{
  flex:1;min-width:0;display:flex;flex-direction:column;
  background:radial-gradient(ellipse at 50% -40%,#b8a3ff0b,transparent 62%),var(--bg)
}
.top{
  height:60px;flex:0 0 60px;border-bottom:1px solid #27272c;
  display:flex;align-items:center;padding:0 20px;gap:12px;
  background:#111113e8;backdrop-filter:blur(14px)
}
.top button{
  background:#1a1a1e;border-color:#303036;width:36px;height:36px;
  padding:0;text-align:center;display:grid;place-items:center
}
.topname{font-weight:680;letter-spacing:-.3px}
.topright{margin-left:auto;font-size:12px;color:#85848e}
.content{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}
.view{display:none;min-height:100%}
.view.active{display:block;animation:view-in .24s ease both}
.welcome{
  min-height:100%;display:flex;flex-direction:column;
  justify-content:center;align-items:center;text-align:center;
  padding:34px 22px 42px
}
.welcome-mark{margin-bottom:5px;animation:float 5s ease-in-out infinite}
.welcome h1{
  font-size:clamp(31px,4.5vw,45px);font-weight:740;
  letter-spacing:-2px;line-height:1.1;margin:17px 0 10px
}
.accent{color:var(--accent)}
.sub{color:var(--muted)}
.welcome .sub{margin:0}
.suggestions{
  width:min(690px,100%);display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:10px;margin-top:30px
}
.suggestion{
  min-height:92px;background:#19191d;border-color:#2e2e34;
  border-radius:15px;padding:16px;text-align:left;
  display:flex;flex-direction:column;justify-content:center;gap:5px
}
.suggestion:hover{
  background:#211f27;border-color:#5b506e;transform:translateY(-2px)
}
.suggestion strong{font-size:13px;font-weight:680}
.suggestion span{font-size:12px;line-height:1.5;color:var(--muted)}
.messages{
  width:min(800px,100%);margin:auto;padding:28px 22px 38px;
  display:grid;gap:23px
}
.message{
  display:flex;gap:11px;align-items:flex-start;
  animation:message-in .25s ease both
}
.message.user{flex-direction:row-reverse}
.avatar{
  flex:0 0 31px;width:31px;height:31px;border-radius:10px;
  background:var(--accent);color:var(--accentText);
  display:grid;place-items:center;font-size:12px;font-weight:850
}
.message.user .avatar{background:#35343b;color:#f0eef5}
.bubble{
  max-width:calc(100% - 42px);background:#1b1b1f;
  border:1px solid #303036;padding:12px 15px;
  border-radius:5px 16px 16px 16px;white-space:pre-wrap;
  overflow-wrap:anywhere;line-height:1.75
}
.message.user .bubble{
  background:#29272e;border-color:#39373f;
  border-radius:16px 5px 16px 16px
}
.thinking{
  display:flex;align-items:center;gap:9px;
  color:#aaa7b5;font-size:13px;padding:7px 2px
}
.dots{display:flex;gap:4px}
.dots i{
  width:5px;height:5px;border-radius:50%;background:var(--accent);
  animation:pulse 1s infinite ease-in-out
}
.dots i:nth-child(2){animation-delay:.15s}
.dots i:nth-child(3){animation-delay:.3s}
.composer-wrap{
  padding:12px 18px max(12px,env(safe-area-inset-bottom));
  background:linear-gradient(180deg,transparent,#111113 22%)
}
.composer{
  width:min(800px,100%);margin:auto;background:#1b1b1f;
  border:1px solid #38383f;border-radius:20px;padding:10px 11px 9px;
  transition:border-color .2s,box-shadow .2s
}
.composer:focus-within{
  border-color:#75678f;box-shadow:0 0 0 3px #c3b3ff0c
}
textarea{
  width:100%;resize:none;min-height:42px;max-height:170px;
  border:0;outline:0;background:transparent;color:var(--text);
  padding:8px;line-height:1.55
}
textarea::placeholder{color:#85848f}
.actions{display:flex;align-items:center;gap:7px}
.actions button{
  border:0;color:#c2c0ca;font-size:12px;padding:8px 10px;border-radius:9px
}
.actions .sub{font-size:11px;margin-left:2px}
.send{
  margin-left:auto!important;width:38px;height:38px;padding:0!important;
  display:grid;place-items:center;background:var(--accent)!important;
  color:var(--accentText)!important;font-size:21px!important;
  font-weight:850;border-radius:12px!important
}
.send:hover{background:#d4caff!important;box-shadow:0 3px 15px #c3b3ff20}
.note{text-align:center;font-size:10px;color:#777680;padding-top:9px}
.studio{width:min(820px,100%);margin:auto;padding:34px 24px 45px}
.studio h1{font-size:32px;letter-spacing:-1.2px;margin:0 0 5px}
.studio .intro{margin:0 0 23px;color:var(--muted)}
.studio textarea{
  display:block;width:100%;min-height:125px;background:#19191d;
  border:1px solid #33333b;border-radius:15px;padding:15px;
  transition:border-color .2s,box-shadow .2s
}
.studio textarea:focus{
  border-color:#75678f;box-shadow:0 0 0 3px #c3b3ff0c
}
.studio-controls{display:flex;align-items:center;gap:12px;margin-top:13px}
.primary{
  background:var(--accent);color:var(--accentText);border:0;
  border-radius:11px;padding:11px 15px;font-weight:750;text-align:center
}
.primary:hover{background:#d5caff;box-shadow:0 4px 18px #c3b3ff17}
.status{
  color:#c9baff;font-size:12px;line-height:1.6;min-height:20px;
  margin-top:12px;overflow-wrap:anywhere
}
#imageResult img{
  display:block;width:100%;height:auto;border-radius:15px;
  margin-top:18px;border:1px solid #33333b;animation:view-in .35s ease both
}
#imageResult a{display:inline-block;margin-top:12px;text-decoration:none}
.overlay{
  position:fixed;inset:0;background:#08080bdc;backdrop-filter:blur(14px);
  display:flex;align-items:center;justify-content:center;padding:18px;
  z-index:30;overflow:auto;animation:fade-in .22s ease both
}
.card{
  width:min(420px,100%);background:#1a1a1e;border:1px solid #37363e;
  border-radius:22px;padding:27px;margin:auto;
  box-shadow:0 24px 90px #0007;animation:card-in .3s ease both
}
.card .brand{justify-content:center;margin-bottom:13px;padding:3px 0 13px;font-size:20px}
.card h2{text-align:center;font-size:27px;letter-spacing:-1px;margin:7px 0 5px}
.card p{text-align:center;color:var(--muted);font-size:13px;margin:0 0 15px;line-height:1.6}
.card label{display:block;font-size:12px;font-weight:650;color:#dedde5;margin:15px 0 7px}
.card input{
  width:100%;min-height:46px;padding:11px 12px;background:#111113;
  border:1px solid #3b3b43;border-radius:11px;color:white;outline:0;
  transition:border-color .2s,box-shadow .2s
}
.card input:focus{border-color:#a996e8;box-shadow:0 0 0 3px #c3b3ff12}
.card .primary{width:100%;min-height:46px;margin-top:16px}
.auth-switch{
  display:flex;gap:5px;padding:4px;background:#111113;
  border:1px solid #29292f;border-radius:12px;margin:18px 0 10px
}
.auth-switch button{
  flex:1;text-align:center;border:0;padding:9px;border-radius:9px;
  font-size:13px;color:#aaa8b3
}
.auth-switch button.active{background:#302b3a;color:#eee7ff}
.secondary{width:100%;text-align:center;margin-top:10px}
.card .small{font-size:11px;line-height:1.5;margin:14px 0 0;color:#85848e}
.hidden{display:none!important}
.scrim{
  display:none;position:fixed;inset:0;background:#0009;z-index:15;
  opacity:0;pointer-events:none;transition:opacity .22s
}
.scrim.open{opacity:1;pointer-events:auto}
@keyframes view-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes message-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes card-in{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes pulse{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
@media(max-width:700px){
  .sidebar{
    position:fixed;top:0;bottom:0;left:0;width:min(285px,86vw);
    flex-basis:auto;z-index:25;transform:translateX(-105%);
    box-shadow:15px 0 50px #0005;padding-top:max(15px,env(safe-area-inset-top))
  }
  .sidebar.open{transform:translateX(0)}
  .scrim{display:block}
  .top{height:55px;flex-basis:55px;padding:0 11px}
  .topright{display:none}
  .welcome{padding:27px 14px 32px}
  .welcome h1{font-size:34px;letter-spacing:-1.5px}
  .suggestions{grid-template-columns:1fr;gap:8px;margin-top:24px;max-width:420px}
  .suggestion{min-height:70px;padding:13px 15px}
  .messages{padding:20px 11px 28px;gap:19px}
  .bubble{padding:11px 12px;font-size:14px}
  .composer-wrap{padding:8px 9px max(9px,env(safe-area-inset-bottom))}
  .composer{border-radius:18px;padding:8px}
  .actions button{padding:8px}
  .actions .sub{display:none}
  .studio{padding:25px 14px 35px}
  .studio h1{font-size:29px}
  .card{padding:24px 20px;border-radius:21px}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    scroll-behavior:auto!important;animation-duration:.01ms!important;
    animation-iteration-count:1!important;transition-duration:.01ms!important
  }
}
</style>
</head>
<body>
<div class="app">
 <aside class="sidebar" id="sidebar" aria-label="Main navigation">
  <div class="brand"><div class="logo">V</div><span>VYRO AI</span></div>
  <button class="new" id="new">＋ &nbsp;New chat</button>
  <button class="nav active" id="chatTab"><span class="nav-icon">◫</span>Chat</button>
  <button class="nav" id="studioTab"><span class="nav-icon">✧</span>Image Studio</button>
  <div class="label">RECENT CHATS</div>
  <div class="history" id="history"></div>
  <div class="bottom">
   <div class="profile" id="profile">Not signed in</div>
   <button id="logout">↪ &nbsp;Sign out</button>
  </div>
 </aside>
 <div class="scrim" id="scrim"></div>
 <main class="main">
  <header class="top">
   <button id="menu" aria-label="Open menu">☰</button>
   <div class="topname" id="pageTitle">VYRO AI</div>
   <div class="topright">A little space to think</div>
  </header>
  <section class="content" id="content">
   <div class="view active" id="chatView">
    <div class="welcome" id="welcome">
     <div class="logo welcome-mark">V</div>
     <h1>What’s on your mind<br><span class="accent">today?</span></h1>
     <p class="sub">A place to think things through, make things, and explore.</p>
     <div class="suggestions">
      <button class="suggestion" data-prompt="Explain a difficult topic in simple terms"><strong>▤ &nbsp;Learn something</strong><span>Make a complicated idea feel simple</span></button>
      <button class="suggestion" data-prompt="Help me brainstorm creative ideas"><strong>✧ &nbsp;Brainstorm ideas</strong><span>Start with a thought and see where it goes</span></button>
      <button class="suggestion" data-prompt="Help me write a message"><strong>✎ &nbsp;Write something</strong><span>Find the right words for what you mean</span></button>
      <button class="suggestion" data-prompt="Make a step-by-step learning plan"><strong>⌁ &nbsp;Make a plan</strong><span>Turn a big goal into smaller steps</span></button>
     </div>
    </div>
    <div class="messages" id="messages" hidden></div>
   </div>
   <div class="view" id="studioView">
    <div class="studio">
     <h1 class="accent">Image Studio</h1>
     <p class="intro">Give an idea a visual shape. Describe what you want to see.</p>
     <textarea id="imagePrompt" placeholder="A quiet little bookshop on a rainy evening, warm window light…" aria-label="Describe an image"></textarea>
     <div class="studio-controls">
      <button class="primary" id="generate">✧ &nbsp;Generate image</button>
      <span class="sub" style="font-size:12px">Your imagination, in pixels.</span>
     </div>
     <div class="status" id="imageStatus" role="status" aria-live="polite"></div>
     <div id="imageResult"></div>
    </div>
   </div>
  </section>
  <div class="composer-wrap" id="composerWrap">
   <div class="composer">
    <textarea id="prompt" rows="1" placeholder="Message VYRO AI…" aria-label="Message VYRO AI"></textarea>
    <div class="actions">
     <button id="toStudio">▧ &nbsp;Image Studio</button>
     <span class="sub">AI can make mistakes</span>
     <button class="send" id="send" aria-label="Send message">↑</button>
    </div>
   </div>
   <div class="note">VYRO AI · Made to help you think, create, and explore</div>
  </div>
 </main>
</div>

<div class="overlay" id="login">
 <div class="card">
  <div class="brand"><div class="logo">V</div><span>VYRO AI</span></div>
  <h2 id="authTitle">Welcome back</h2>
  <p id="authSubtitle">Sign in or create your account with email.</p>
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
  <p class="small">New accounts must verify their email before signing in. Check your inbox and spam folder.</p>
 </div>
</div>

<script>
(()=>{
const $=id=>document.getElementById(id);
let sb=null,session=null,busy=false,chats=[],chatId=null;
let authMode='signin',pendingVerificationEmail='';
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

function callbackMessage(){
  const hash=new URLSearchParams(location.hash.slice(1));
  const params=new URLSearchParams(location.search);
  const err=hash.get('error_description')||params.get('error_description');
  if(err){
    showStatus(err.replace(/\+/g,' '));
    $('login').style.display='flex';
    history.replaceState(null,'',location.pathname);
    return true;
  }
  if(hash.get('access_token')||params.get('token_hash')){
    showStatus('Checking your verification link…');
  }
  return false;
}

async function init(){
  try{
    const r=await fetch('/api/config',{cache:'no-store'});
    const c=await r.json();
    if(!r.ok||!c.supabaseUrl||!c.supabaseAnonKey){
      throw Error('Configure SUPABASE_URL and SUPABASE_ANON_KEY in Cloudflare Worker settings.');
    }
    sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    const {data,error}=await sb.auth.getSession();
    if(error)throw error;
    applySession(data.session);
    sb.auth.onAuthStateChange((event,s)=>{
      applySession(s);
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){
        if(location.hash.includes('access_token')||location.search.includes('token_hash')){
          history.replaceState(null,'',location.pathname);
          showStatus('Email verified. You are signed in!');
        }
      }
    });
    if(!data.session&&callbackMessage())return;
    if(!data.session&&location.hash.includes('access_token')){
      const {data:sd,error:se}=await sb.auth.getSession();
      if(se)showStatus(se.message);
      else if(sd.session)applySession(sd.session);
    }
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
  }catch{chats=[]}
  renderHistory();
}

function save(){
  try{localStorage.setItem(key,JSON.stringify(chats))}catch{}
  renderHistory();
}

function renderHistory(){
  const el=$('history');
  el.replaceChildren();
  [...chats].reverse().forEach(c=>{
    const b=document.createElement('button');
    b.textContent=c.title||'New chat';
    b.onclick=()=>{
      chatId=c.id;
      render();
      showChat();
    };
    el.append(b);
  });
}

function current(){return chats.find(c=>c.id===chatId)}

function fresh(){
  chatId=String(Date.now());
  chats.push({id:chatId,title:'New chat',messages:[]});
  save();
  showChat();
  render();
  $('prompt').focus();
}

function closeMenu(){
  $('sidebar').classList.remove('open');
  $('scrim').classList.remove('open');
}

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
  const c=current(),el=$('messages');
  const has=!!(c&&c.messages.length);
  $('welcome').style.display=has?'none':'flex';
  el.hidden=!has;
  el.replaceChildren();
  if(!has)return;

  c.messages.forEach(m=>{
    const row=document.createElement('div');
    row.className='message '+m.role;
    const av=document.createElement('div');
    av.className='avatar';
    av.textContent=m.role==='user'?'Y':'V';
    const b=document.createElement('div');
    b.className='bubble';
    b.textContent=m.content;
    row.append(av,b);
    el.append(row);
  });
  requestAnimationFrame(()=>{$('content').scrollTop=$('content').scrollHeight});
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

  const wait=document.createElement('div');
  wait.className='thinking';
  wait.innerHTML='<span>VYRO is thinking</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  $('messages').append(wait);

  try{
    const r=await fetch('/api/chat',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+session.access_token
      },
      body:JSON.stringify({messages:current().messages})
    });
    const d=await r.json();
    if(!r.ok)throw Error(d.error||'Request failed');
    wait.remove();
    add('assistant',d.response||d.text||'No response received.');
  }catch(e){
    wait.remove();
    add('assistant','Error: '+e.message);
  }finally{
    busy=false;
    $('send').disabled=false;
  }
}

async function generate(){
  const prompt=$('imagePrompt').value.trim();
  if(!prompt){$('imageStatus').textContent='Describe your image first.';return}
  if(!session){$('login').style.display='flex';return}

  $('generate').disabled=true;
  $('imageStatus').textContent='Creating your image…';
  $('imageResult').replaceChildren();

  try{
    const r=await fetch('/api/image',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+session.access_token
      },
      body:JSON.stringify({prompt})
    });

    if(!r.ok){
      let d={};
      try{d=await r.json()}catch{}
      throw Error(d.error||'Generation failed');
    }

    const blob=await r.blob();
    if(!blob.type.startsWith('image/')){
      throw Error('The image service returned an unexpected response.');
    }

    const url=URL.createObjectURL(blob);
    const img=document.createElement('img');
    img.src=url;
    img.alt=prompt;

    const a=document.createElement('a');
    a.href=url;
    a.download='vyro-image.png';
    a.textContent='↓  Download image';
    a.className='primary';

    $('imageResult').append(img,a);
    $('imageStatus').textContent='Image ready.';
  }catch(e){
    $('imageStatus').textContent=e.message||'Could not generate the image.';
  }finally{
    $('generate').disabled=false;
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
        showStatus('Account created. Open the verification email we sent, then return here to sign in. Check spam if it is missing.');
      }
    }else{
      const {data,error}=await sb.auth.signInWithPassword({email,password});
      if(error)throw error;
      if(data.session){
        applySession(data.session);
        showStatus('Signed in successfully.');
      }
    }
  }catch(e){
    const msg=e.message||'Authentication failed.';
    showStatus(msg);
    if(/confirm|not confirmed|email not verified/i.test(msg)){
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
  showStatus('Sending another verification email…');

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

$('signInTab').onclick=()=>setAuthMode('signin');
$('signUpTab').onclick=()=>setAuthMode('signup');
$('send').onclick=()=>send();

$('prompt').onkeydown=e=>{
  if(e.key==='Enter'&&!e.shiftKey){
    e.preventDefault();
    send();
  }
};

$('prompt').addEventListener('input',()=>{
  const el=$('prompt');
  el.style.height='auto';
  el.style.height=Math.min(el.scrollHeight,170)+'px';
});

$('imagePrompt').addEventListener('input',()=>{
  const el=$('imagePrompt');
  el.style.height='auto';
  el.style.height=Math.min(Math.max(el.scrollHeight,125),260)+'px';
});

$('new').onclick=fresh;
$('menu').onclick=()=>{
  const open=!$('sidebar').classList.contains('open');
  $('sidebar').classList.toggle('open',open);
  $('scrim').classList.toggle('open',open);
};
$('scrim').onclick=closeMenu;
$('chatTab').onclick=showChat;
$('studioTab').onclick=showStudio;
$('toStudio').onclick=showStudio;
$('generate').onclick=generate;

document.querySelectorAll('[data-prompt]').forEach(b=>{
  b.onclick=()=>send(b.dataset.prompt);
});

$('logout').onclick=async()=>{
  if(sb)await sb.auth.signOut();
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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function verifyUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const r = await fetch(
      env.SUPABASE_URL.replace(/\/+$/, "") + "/auth/v1/user",
      {
        headers: {
          Authorization: "Bearer " + token,
          apikey: env.SUPABASE_ANON_KEY
        }
      }
    );

    if (!r.ok) return null;

    const user = await r.json();
    return user && user.id ? user : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": url.origin,
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    if (
      request.method === "GET" &&
      (url.pathname === "/" || url.pathname === "/index.html")
    ) {
      return new Response(HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache"
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/api/config") {
      return json({
        supabaseUrl: env.SUPABASE_URL || "",
        supabaseAnonKey: env.SUPABASE_ANON_KEY || ""
      });
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "VYRO AI",
        ai: !!env.AI,
        supabaseConfigured: !!(
          env.SUPABASE_URL && env.SUPABASE_ANON_KEY
        )
      });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      if (!await verifyUser(request, env)) {
        return json({
          error: "Please sign in again. If your email is not verified, verify it first."
        }, 401);
      }

      if (!env.AI) {
        return json({
          error: "Workers AI binding named AI is missing."
        }, 500);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON." }, 400);
      }

      const messages = Array.isArray(body.messages)
        ? body.messages.slice(-20)
        : [];

      if (!messages.length) {
        return json({ error: "Send a message first." }, 400);
      }

      try {
        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content: "You are VYRO AI, a helpful and accurate assistant. Explain clearly and naturally."
              },
              ...messages.map(m => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: String(m.content || "").slice(0, 10000)
              }))
            ],
            max_tokens: 1200
          }
        );

        return json({
          response: result.response || "No response generated."
        });
      } catch {
        return json({
          error: "AI request failed. Check Workers AI availability and limits."
        }, 502);
      }
    }

    if (url.pathname === "/api/image" && request.method === "POST") {
      if (!await verifyUser(request, env)) {
        return json({
          error: "Please sign in again. If your email is not verified, verify it first."
        }, 401);
      }

      if (!env.AI) {
        return json({
          error: "Workers AI binding named AI is missing."
        }, 500);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON." }, 400);
      }

      const prompt = String(body.prompt || "").trim().slice(0, 1500);

      if (!prompt) {
        return json({ error: "Describe your image first." }, 400);
      }

      try {
        const result = await env.AI.run(
          "@cf/black-forest-labs/flux-1-schnell",
          {
            prompt,
            num_steps: 4
          }
        );

        if (result instanceof Response) {
          return new Response(result.body, {
            headers: {
              "Content-Type": result.headers.get("Content-Type") || "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        if (result && result.image) {
          const bytes = Uint8Array.from(
            atob(result.image),
            c => c.charCodeAt(0)
          );

          return new Response(bytes, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        if (result instanceof ArrayBuffer || ArrayBuffer.isView(result)) {
          return new Response(result, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        return json({
          error: "Unexpected image model response."
        }, 502);
      } catch {
        return json({
          error: "Image generation failed. Check Workers AI availability and limits."
        }, 502);
      }
    }

    return json({ error: "Not found." }, 404);
  }
};
