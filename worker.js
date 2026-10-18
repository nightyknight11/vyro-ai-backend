

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101014">
<title>VYRO AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root{color-scheme:dark;--bg:#101014;--panel:#19191f;--line:#303039;--text:#f5f5f7;--muted:#a1a1ad;--purple:#b5a0ff;--purple2:#8866f5}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
button,input,textarea{font:inherit}
button{cursor:pointer;color:inherit}
button:disabled{opacity:.55;cursor:wait}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--purple);outline-offset:3px}
button{border:1px solid var(--line);background:transparent;border-radius:12px;padding:10px;text-align:left;transition:background .2s,border-color .2s,transform .2s,box-shadow .2s}
button:hover{background:#27242f;border-color:#494452}
button:active{transform:scale(.98)}
.app{height:100dvh;display:flex;overflow:hidden}
.sidebar{width:260px;flex-shrink:0;background:#141418;border-right:1px solid #292930;padding:17px 13px;display:flex;flex-direction:column;gap:10px;z-index:10}
.brand{display:flex;align-items:center;gap:10px;font-size:19px;font-weight:800;letter-spacing:-.6px;padding:8px 7px 17px}
.logo{width:39px;height:39px;flex-shrink:0;border-radius:14px;display:grid;place-items:center;background:linear-gradient(145deg,#e8dfff,#b5a0ff 48%,#7450dd);color:#171220;box-shadow:0 4px 24px #9878ff25;animation:logoGlow 4s ease-in-out infinite}
.logo svg{width:29px;height:29px}
@keyframes logoGlow{0%,100%{box-shadow:0 4px 20px #9878ff20}50%{box-shadow:0 4px 32px #9878ff65}}
.new{width:100%;padding:13px;background:#1b1b22;border-color:#35353e;font-weight:650}
.nav{width:100%;padding:12px;color:#c8c8d2;border-color:transparent}
.nav.active{background:#292333;border-color:#393044;color:#e4dcff}
.label{font-size:10px;font-weight:750;color:var(--muted);letter-spacing:1.5px;margin:18px 8px 5px}
.history{overflow:auto;display:grid;gap:5px}
.history button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ddd;border-color:transparent;padding:10px 11px;font-size:13px}
.history button:hover{background:#202026}
.bottom{margin-top:auto;border-top:1px solid #292930;padding:15px 5px 0}
.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere;margin-bottom:8px}
.bottom button{width:100%;margin-top:6px}
.danger:hover{background:#3a2028;border-color:#75404b}
.main{flex:1;min-width:0;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% -30%,#8b6bff0b,transparent 55%),var(--bg)}
.top{height:62px;flex-shrink:0;border-bottom:1px solid #25252c;background:#0d0d10dd;backdrop-filter:blur(18px);display:flex;align-items:center;padding:0 18px;gap:12px;z-index:2}
.top button{background:#19191f;border-radius:10px}
.topname{font-weight:750;letter-spacing:-.3px}
.content{flex:1;min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#393440 transparent}
.view{display:none;min-height:100%}
.view.active{display:block;animation:viewIn .3s ease both}
@keyframes viewIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.welcome{min-height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:32px 20px}
.welcome>.logo{width:60px;height:60px;border-radius:20px}
.welcome>.logo svg{width:43px;height:43px}
.welcome h1{font-size:clamp(29px,5vw,45px);font-weight:780;letter-spacing:-1.8px;line-height:1.12;margin:22px 0 8px}
.gradient{background:linear-gradient(100deg,#e2d8ff,#b9a5ff 45%,#9574ff);color:transparent;-webkit-background-clip:text;background-clip:text}
.sub{color:#a4a4b2}
.suggestions{width:min(680px,100%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:25px}
.suggestion{min-height:90px;background:linear-gradient(145deg,#19191f,#141418);border-color:#2c2c35;border-radius:16px;padding:18px}
.suggestion:hover{background:#211e2b;border-color:#67558d;transform:translateY(-3px);box-shadow:0 8px 24px #0002}
.suggestion strong,.suggestion span{display:block}
.suggestion strong{font-size:14px;font-weight:680}
.suggestion span{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.5}
.messages{width:min(820px,100%);margin:auto;padding:30px 18px 40px;display:grid;gap:25px}
.message{display:flex;gap:12px;align-items:flex-start;animation:messageIn .3s ease both}
.message.user{flex-direction:row-reverse}
@keyframes messageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.avatar{flex-shrink:0;width:34px;height:34px;border-radius:11px;background:linear-gradient(140deg,#d3c4ff,#8e6cf2);color:#171220;display:grid;place-items:center;font-weight:850;font-size:13px}
.message.user .avatar{background:#34313d;color:#f5f1ff}
.bubble{max-width:85%;min-width:0;background:var(--panel);border:1px solid #303039;border-radius:17px;padding:13px 16px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}
.message.user .bubble{background:#292630;border-color:#393441}
.typing{display:flex;align-items:center;gap:5px;padding:8px 3px}
.typing span{width:6px;height:6px;border-radius:50%;background:#b5a0ff;animation:dotPulse 1.1s ease-in-out infinite}
.typing span:nth-child(2){animation-delay:.15s}
.typing span:nth-child(3){animation-delay:.3s}
@keyframes dotPulse{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
.composer-wrap{flex-shrink:0;padding:12px 15px max(12px,env(safe-area-inset-bottom))}
.composer{width:min(820px,100%);margin:auto;background:#19191f;border:1px solid #383842;border-radius:23px;padding:12px;box-shadow:0 10px 40px #0002;transition:border-color .2s,box-shadow .2s}
.composer:focus-within{border-color:#77659f;box-shadow:0 0 0 3px #a18aff12}
textarea{width:100%;resize:none;min-height:42px;max-height:170px;border:0;outline:0;background:transparent;color:white;padding:8px;line-height:1.6}
.actions{display:flex;align-items:center;gap:8px}
.actions button{border:0;color:#ccc;font-size:12px;border-radius:9px;padding:9px 11px}
.actions button:hover{background:#2b2736}
.send{margin-left:auto;min-width:40px;min-height:40px;display:grid;place-items:center;border-radius:13px!important;background:#c2b0ff!important;color:#17121f!important;font-weight:900;font-size:19px!important;box-shadow:0 3px 14px #a18aff22}
.send:hover{background:#d4c7ff!important}
.note{text-align:center;font-size:10px;color:#737380;padding-top:10px}
.studio{max-width:820px;margin:auto;padding:30px 22px}
.studio h1{font-size:35px;letter-spacing:-1.2px;margin:5px 0}
.studio textarea{display:block;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;min-height:120px;margin-top:20px}
.primary{background:linear-gradient(100deg,#c8b8ff,#a18aff);color:#17121f;border:0;border-radius:12px;padding:12px 16px;font-weight:750}
.primary:hover{background:linear-gradient(100deg,#ded3ff,#b5a0ff);box-shadow:0 5px 20px #a18aff20}
#imageResult{margin-top:18px}
#imageResult img{display:block;width:100%;height:auto;max-height:650px;object-fit:contain;border-radius:16px;border:1px solid #303039;animation:viewIn .35s ease both}
.image-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.image-actions a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
.status{color:#cbbdff;font-size:12px;min-height:20px;margin-top:12px;overflow-wrap:anywhere;line-height:1.6}
.overlay{position:fixed;inset:0;background:#08080bdc;backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:18px;z-index:20;overflow:auto;animation:overlayIn .25s ease both}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
.card{width:min(420px,100%);background:linear-gradient(155deg,#1c1b23,#121216 75%);border:1px solid #35323f;border-radius:25px;padding:30px;box-shadow:0 24px 90px #0008;margin:auto;animation:cardIn .35s cubic-bezier(.2,.8,.2,1) both}
@keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.card .brand{justify-content:center;font-size:21px;padding:5px 0 16px}
.card h2{text-align:center;font-size:27px;letter-spacing:-1px;margin:12px 0 8px}
.card p{text-align:center;color:var(--muted);font-size:13px;line-height:1.6}
.card label{display:block;font-size:12px;font-weight:650;color:#dedee7;margin:19px 0 7px}
.card input{width:100%;min-height:47px;padding:12px;background:#101014;border:1px solid #383842;border-radius:12px;color:white;outline:none;transition:border-color .2s,box-shadow .2s}
.card input:focus{border-color:#a18aff;box-shadow:0 0 0 3px #a18aff18}
.card .primary{width:100%;min-height:47px;margin-top:14px;text-align:center}
.auth-switch{display:flex;gap:8px;margin:18px 0 8px}
.auth-switch button{flex:1;text-align:center}
.auth-switch button.active{background:#302747;border-color:#7764a9}
.secondary{width:100%;text-align:center;margin-top:9px}
.small{font-size:11px!important;line-height:1.6}
.hidden{display:none!important}
@media(max-width:700px){
.sidebar{position:fixed;top:0;bottom:0;left:0;width:min(285px,86vw);transform:translateX(-110%);transition:transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 0 50px #0008}
.sidebar.open{transform:translateX(0)}
.top{height:57px;padding:0 10px}
.welcome{padding:24px 14px}
.welcome h1{letter-spacing:-1.2px}
.suggestions{grid-template-columns:1fr;gap:9px;margin-top:20px}
.suggestion{min-height:75px;padding:15px}
.messages{padding:20px 10px 28px;gap:19px}
.bubble{max-width:90%;padding:11px 13px}
.composer-wrap{padding:8px 9px max(10px,env(safe-area-inset-bottom))}
.composer{border-radius:20px;padding:9px}
.studio{padding:23px 14px}
.studio h1{font-size:30px}
.card{padding:25px 21px;border-radius:22px}
.actions{gap:4px}
.actions button{padding:8px}
}
@media(prefers-reduced-motion:reduce){
*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}
}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar" id="sidebar">
<div class="brand"><div class="logo"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 9L15 31L21 19L27 31L35 9" stroke="#20152e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div> VYRO AI</div>
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
<div class="logo"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 9L15 31L21 19L27 31L35 9" stroke="#20152e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
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
<div class="brand"><div class="logo"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 9L15 31L21 19L27 31L35 9" stroke="#20152e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div> VYRO AI</div>
<h2 id="authTitle">Welcome back</h2>
<p id="authSubtitle">Sign in or create your account with email.</p>
<div class="auth-switch"><button type="button" id="signInTab" class="active">Sign in</button><button type="button" id="signUpTab">Create account</button></div>
<form id="loginForm">
<label for="email">Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required>
<label for="password">Password</label><input id="password" type="password" autocomplete="current-password" minlength="6" placeholder="At least 6 characters" required>
<button class="primary" id="loginButton" type="submit">Sign in</button>
</form>
<button type="button" class="secondary hidden" id="resend">Resend verification email</button>
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
authMode=mode;const signup=mode==='signup';
$('authTitle').textContent=signup?'Create your account':'Welcome back';
$('authSubtitle').textContent=signup?'Sign up with your email and a password.':'Sign in securely with your email and password.';
$('loginButton').textContent=signup?'Create account':'Sign in';
$('signInTab').classList.toggle('active',!signup);$('signUpTab').classList.toggle('active',signup);
$('password').autocomplete=signup?'new-password':'current-password';
$('resend').classList.add('hidden');showStatus('');
}
async function init(){
try{
const r=await fetch('/api/config',{cache:'no-store'});const c=await r.json();
if(!r.ok||!c.supabaseUrl||!c.supabaseAnonKey)throw Error('Configure SUPABASE_URL and SUPABASE_ANON_KEY in Cloudflare Worker settings.');
sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const {data,error}=await sb.auth.getSession();if(error)throw error;
applySession(data.session);
sb.auth.onAuthStateChange((event,s)=>{
applySession(s);
if(event==='SIGNED_IN'&&(location.hash.includes('access_token')||location.search.includes('token_hash'))){
history.replaceState(null,'',location.pathname);showStatus('Email verified. You are signed in!');
}
});
}catch(e){$('login').style.display='flex';showStatus(e.message||'Could not initialize sign-in.')}
}
function applySession(s){
session=s;$('login').style.display=s?'none':'flex';
$('profile').textContent=s?.user?.email||'Not signed in';
if(s){load();if(!chatId&&chats.length)chatId=chats[chats.length-1].id;render()}
}
function load(){
try{chats=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(chats))chats=[];chats=chats.filter(c=>c&&typeof c.id==='string'&&Array.isArray(c.messages))}
catch{chats=[]}
renderHistory();
}
function save(){
try{localStorage.setItem(key,JSON.stringify(chats))}
catch(e){console.warn('VYRO history save error:',e)}
renderHistory();
}
function renderHistory(){
const el=$('history');el.replaceChildren();
[...chats].reverse().forEach(c=>{
const b=document.createElement('button');b.textContent=c.title||'New chat';
b.onclick=()=>{chatId=c.id;render();showChat()};el.append(b);
});
}
function current(){return chats.find(c=>c.id===chatId)}
function fresh(){
chatId=String(Date.now())+'-'+Math.random().toString(36).slice(2,7);
chats.push({id:chatId,title:'New chat',messages:[]});
save();showChat();render();$('prompt').focus();
}
function closeMenu(){$('sidebar').classList.remove('open')}
function showChat(){
$('chatView').classList.add('active');$('studioView').classList.remove('active');
$('composerWrap').style.display='block';$('pageTitle').textContent='VYRO AI';
$('chatTab').classList.add('active');$('studioTab').classList.remove('active');closeMenu();
}
function showStudio(){
$('chatView').classList.remove('active');$('studioView').classList.add('active');
$('composerWrap').style.display='none';$('pageTitle').textContent='Image Studio';
$('studioTab').classList.add('active');$('chatTab').classList.remove('active');closeMenu();
}
function render(){
const c=current(),el=$('messages'),has=!!(c&&c.messages.length);
$('welcome').style.display=has?'none':'flex';el.hidden=!has;el.replaceChildren();
if(!has)return;
c.messages.forEach(m=>{
const row=document.createElement('div');row.className='message '+(m.role==='user'?'user':'assistant');
const av=document.createElement('div');av.className='avatar';av.textContent=m.role==='user'?'Y':'V';
const b=document.createElement('div');b.className='bubble';b.textContent=m.content;
row.append(av,b);el.append(row);
});
requestAnimationFrame(()=>{$('.content')?.scrollTo({top:$('.content').scrollHeight,behavior:'smooth'})});
}
function add(role,content){
let c=current();
if(!c){chatId=String(Date.now());chats.push({id:chatId,title:'New chat',messages:[]});c=current()}
c.messages.push({role,content});
if(role==='user'&&c.title==='New chat')c.title=content.slice(0,35);
save();render();
}
function makeTyping(){
const row=document.createElement('div');row.className='message assistant';
const av=document.createElement('div');av.className='avatar';av.textContent='V';
const b=document.createElement('div');b.className='bubble';
const dots=document.createElement('div');dots.className='typing';dots.setAttribute('aria-label','VYRO is thinking');
for(let i=0;i<3;i++)dots.append(document.createElement('span'));
b.append(dots);row.append(av,b);return row;
}
async function send(prefill){
if(busy)return;
const text=(prefill??$('prompt').value).trim();if(!text)return;
if(!session){$('login').style.display='flex';return}
if(!current())fresh();
$('prompt').value='';$('prompt').style.height='auto';
add('user',text);busy=true;$('send').disabled=true;
const wait=makeTyping();$('messages').append(wait);
try{
const r=await fetch('/api/chat',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
body:JSON.stringify({messages:current().messages})
});
const d=await r.json().catch(()=>({error:'The server returned an invalid response.'}));
if(!r.ok)throw Error(d.error||'Request failed (HTTP '+r.status+').');
wait.remove();add('assistant',d.response||d.text||'No response received.');
}catch(e){
wait.remove();add('assistant','I couldn’t complete that request. '+(e.message||'Please try again.'));
console.error('VYRO chat error:',e);
}finally{busy=false;$('send').disabled=false;$('prompt').focus()}
}
async function generate(){
const prompt=$('imagePrompt').value.trim();
if(!prompt){$('imageStatus').textContent='Describe your image first.';return}
if(!session){$('login').style.display='flex';return}
$('generate').disabled=true;$('generate').textContent='Generating…';
$('imageStatus').textContent='Creating your image. This can take a little while…';
$('imageResult').replaceChildren();
try{
const r=await fetch('/api/image',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
body:JSON.stringify({prompt})
});
if(!r.ok){
const d=await r.json().catch(()=>({}));
throw Error([d.error,d.details].filter(Boolean).join(' — ')||'Image generation failed (HTTP '+r.status+').');
}
const type=(r.headers.get('Content-Type')||'').toLowerCase();
if(type.includes('application/json')||type.includes('text/html')){
const d=await r.json().catch(()=>({}));throw Error(d.details||d.error||'Server did not return an image.');
}
const blob=await r.blob();if(!blob.size)throw Error('The image response was empty.');
const objectUrl=URL.createObjectURL(blob);
const img=document.createElement('img');img.src=objectUrl;img.alt=prompt;
const actions=document.createElement('div');actions.className='image-actions';
const a=document.createElement('a');a.href=objectUrl;a.download='vyro-image.png';a.className='primary';a.textContent='↓ Download image';
const again=document.createElement('button');again.className='primary';again.textContent='↻ Generate another';again.onclick=generate;
actions.append(a,again);$('imageResult').append(img,actions);
$('imageStatus').textContent='Your image is ready.';
}catch(e){
$('imageStatus').textContent=e.message||'Image generation failed.';
console.error('VYRO image UI error:',e);
}finally{$('generate').disabled=false;$('generate').textContent='✧ Generate image'}
}
$('loginForm').onsubmit=async e=>{
e.preventDefault();
if(!sb)return showStatus('Sign-in is still loading. Try again in a moment.');
const email=$('email').value.trim(),password=$('password').value;
$('loginButton').disabled=true;$('resend').classList.add('hidden');
showStatus(authMode==='signup'?'Creating account…':'Signing in…');
try{
if(authMode==='signup'){
const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;
if(data.session){applySession(data.session);showStatus('Account created and signed in.')}
else{pendingVerificationEmail=email;$('resend').classList.remove('hidden');showStatus('Account created. Open the verification email, then return here to sign in. Check spam if missing.')}
}else{
const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;
if(data.session){applySession(data.session);showStatus('Signed in successfully.')}
}
}catch(e){
showStatus(e.message||'Authentication failed.');
if(/confirm|not confirmed|email not verified/i.test(e.message||'')){pendingVerificationEmail=email;$('resend').classList.remove('hidden')}
}finally{$('loginButton').disabled=false}
};
$('resend').onclick=async()=>{
if(!sb||!pendingVerificationEmail){showStatus('Enter the email address you used to sign up.');return}
$('resend').disabled=true;showStatus('Sending another verification email…');
try{
const {error}=await sb.auth.resend({type:'signup',email:pendingVerificationEmail,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;
showStatus('Verification email requested. Check your inbox and spam folder.');
}catch(e){showStatus(e.message||'Could not resend the email.')}
finally{$('resend').disabled=false}
};
$('signInTab').onclick=()=>setAuthMode('signin');
$('signUpTab').onclick=()=>setAuthMode('signup');
$('send').onclick=()=>send();
$('prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
$('prompt').addEventListener('input',()=>{
$('prompt').style.height='auto';$('prompt').style.height=Math.min($('prompt').scrollHeight,170)+'px';
});
$('new').onclick=fresh;
$('menu').onclick=()=>$('sidebar').classList.toggle('open');
$('chatTab').onclick=showChat;$('studioTab').onclick=showStudio;$('toStudio').onclick=showStudio;$('generate').onclick=generate;
document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.prompt));
$('clearHistory').onclick=()=>{
if(!confirm('Delete saved chat history from this browser? This cannot be undone.'))return;
chats=[];chatId=null;
try{localStorage.removeItem(key)}catch(e){console.warn('History storage clear failed:',e)}
renderHistory();render();closeMenu();
};
$('logout').onclick=async()=>{
if(sb){const {error}=await sb.auth.signOut();if(error)console.error('VYRO sign-out error:',error)}
session=null;$('profile').textContent='Not signed in';$('login').style.display='flex';setAuthMode('signin');
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
      "Cache-Control":"no-store"
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

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const started=Date.now();
    const requestId=crypto.randomUUID();
    const log=(event,details={})=>console.log(JSON.stringify({
      service:"VYRO AI",requestId,event,
      elapsedMs:Date.now()-started,...details
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
        ok:true,service:"VYRO AI",
        ai:!!env.AI,
        supabaseConfigured:!!(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY)
      });
    }

    if(url.pathname==="/api/chat"&&request.method==="POST"){
      log("chat.request");
      try{
        if(!await verifyUser(request,env)){
          log("chat.auth_failed");
          return json({error:"Please sign in again. If your email is not verified, verify it first."},401);
        }
        if(!env.AI){
          log("chat.binding_missing");
          return json({error:"Workers AI binding named AI is missing."},500);
        }

        let body;
        try{body=await request.json()}
        catch{return json({error:"Invalid JSON."},400)}

        const messages=Array.isArray(body.messages)?body.messages.slice(-20):[];
        if(!messages.length)return json({error:"Send a message first."},400);

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

        log("chat.success",{messageCount:messages.length});
        return json({response:result?.response||"No response generated."});
      }catch(e){
        const details=e instanceof Error?e.message:String(e);
        console.error(JSON.stringify({
          service:"VYRO AI",requestId,event:"chat.error",
          elapsedMs:Date.now()-started,details:details.slice(0,1200)
        }));
        return json({error:"AI request failed. Check Workers AI availability and limits.",requestId},502);
      }
    }

    if(url.pathname==="/api/image"&&request.method==="POST"){
      log("image.request");
      try{
        if(!await verifyUser(request,env)){
          log("image.auth_failed");
          return json({error:"Please sign in again. If your email is not verified, verify it first."},401);
        }
        if(!env.AI){
          log("image.binding_missing");
          return json({error:"Workers AI binding named AI is missing."},500);
        }

        let body;
        try{body=await request.json()}
        catch{return json({error:"Invalid JSON."},400)}

        const prompt=String(body.prompt||"").trim().slice(0,1500);
        if(!prompt)return json({error:"Describe your image first."},400);

        log("image.model_start",{
          model:"@cf/black-forest-labs/flux-1-schnell",
          promptLength:prompt.length
        });

        const result=await env.AI.run(
          "@cf/black-forest-labs/flux-1-schnell",
          {prompt,num_steps:4}
        );

        if(result instanceof Response){
          if(!result.ok){
            const detail=await result.text().catch(()=>"");
            log("image.model_http_error",{
              status:result.status,details:detail.slice(0,1200)
            });
            return json({
              error:"Workers AI image request failed.",
              details:detail.slice(0,1200)||`Model returned HTTP ${result.status}.`,
              requestId
            },502);
          }
          log("image.success",{format:"response"});
          return new Response(result.body,{headers:{
            "Content-Type":result.headers.get("Content-Type")||"image/png",
            "Cache-Control":"no-store",
            "X-Content-Type-Options":"nosniff"
          }});
        }

        if(result&&typeof result.image==="string"&&result.image.length){
          const encoded=result.image.replace(/^data:image\/[^;]+;base64,/,"").replace(/\s/g,"");
          const binary=atob(encoded);
          const bytes=new Uint8Array(binary.length);
          for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
          log("image.success",{format:"base64",bytes:bytes.length});
          return new Response(bytes,{headers:{
            "Content-Type":"image/png","Cache-Control":"no-store"
          }});
        }

        if(result&&result.image&&(result.image instanceof ArrayBuffer||ArrayBuffer.isView(result.image))){
          const bytes=result.image instanceof ArrayBuffer
            ?new Uint8Array(result.image)
            :new Uint8Array(result.image.buffer,result.image.byteOffset,result.image.byteLength);
          log("image.success",{format:"image-buffer",bytes:bytes.byteLength});
          return new Response(bytes,{headers:{
            "Content-Type":"image/png","Cache-Control":"no-store"
          }});
        }

        if(result instanceof ArrayBuffer){
          log("image.success",{format:"array-buffer",bytes:result.byteLength});
          return new Response(result,{headers:{
            "Content-Type":"image/png","Cache-Control":"no-store"
          }});
        }

        if(ArrayBuffer.isView(result)){
          const bytes=new Uint8Array(result.buffer,result.byteOffset,result.byteLength);
          log("image.success",{format:"typed-array",bytes:bytes.length});
          return new Response(bytes,{headers:{
            "Content-Type":"image/png","Cache-Control":"no-store"
          }});
        }

        log("image.unexpected_result",{
          resultType:typeof result,
          keys:result&&typeof result==="object"?Object.keys(result):[]
        });
        return json({
          error:"Unexpected image model response.",
          details:result&&typeof result==="object"?Object.keys(result).join(", "):typeof result,
          requestId
        },502);
      }catch(e){
        const details=e instanceof Error?e.message:String(e);
        console.error(JSON.stringify({
          service:"VYRO AI",requestId,event:"image.error",
          elapsedMs:Date.now()-started,details:details.slice(0,1200)
        }));
        return json({
          error:"Image generation failed.",
          details:details.slice(0,1200),
          requestId
        },502);
      }
    }

    return json({error:"Not found."},404);
  }
};
