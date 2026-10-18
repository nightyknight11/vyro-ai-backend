const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101014">
<title>VYRO AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root{color-scheme:dark;--bg:#101014;--panel:#19191f;--line:#303039;--text:#f5f5f7;--muted:#a1a1ad;--purple:#a18aff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px system-ui,sans-serif}button,input,textarea{font:inherit}button{cursor:pointer;color:inherit}button:disabled{opacity:.55;cursor:wait}
.app{height:100dvh;display:flex;overflow:hidden}.sidebar{width:255px;background:#15151a;border-right:1px solid var(--line);padding:14px;display:flex;flex-direction:column;gap:12px}.brand{display:flex;align-items:center;gap:10px;font-size:19px;font-weight:800;padding:8px 3px}.logo{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#c6b4ff,#7550e9);display:grid;place-items:center;font-weight:900;color:#17121f}
button,.item{border:1px solid var(--line);background:transparent;border-radius:11px;padding:10px;text-align:left}button:hover{background:#27242f}.new,.nav{width:100%;color:var(--text)}.nav.active{background:#302747}.label{font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:12px}.history{overflow:auto;display:grid;gap:5px}.history button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ddd;border-color:transparent}.bottom{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere}.main{flex:1;min-width:0;display:flex;flex-direction:column}.top{height:58px;border-bottom:1px solid #292930;display:flex;align-items:center;padding:0 18px;gap:12px}.top button{background:#19191f}.topname{font-weight:700}.content{flex:1;overflow:auto}.welcome{min-height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:24px}.welcome h1{font-size:clamp(28px,5vw,42px);line-height:1.15;letter-spacing:-1px}.gradient{background:linear-gradient(90deg,#d6c8ff,#9b7bff);color:transparent;background-clip:text}.sub{color:var(--muted)}.suggestions{width:min(680px,100%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.suggestion{background:var(--panel);padding:15px;border-radius:14px;color:var(--text);border:1px solid var(--line)}.suggestion strong,.suggestion span{display:block}.suggestion span{font-size:12px;color:var(--muted);margin-top:5px}
.messages{width:min(800px,100%);margin:auto;padding:24px 18px;display:grid;gap:20px}.message{display:flex;gap:12px;align-items:flex-start}.message.user{flex-direction:row-reverse}.avatar{flex-shrink:0;width:32px;height:32px;border-radius:10px;background:#302747;display:grid;place-items:center;font-weight:800}.bubble{max-width:85%;background:var(--panel);border:1px solid #303039;padding:12px 15px;border-radius:15px;white-space:pre-wrap;overflow-wrap:anywhere}.message.user .bubble{background:#292333}.composer-wrap{padding:12px 15px max(12px,env(safe-area-inset-bottom))}.composer{width:min(800px,100%);margin:auto;background:#1b1b22;border:1px solid #393943;border-radius:20px;padding:10px}textarea{width:100%;resize:none;min-height:40px;max-height:170px;border:0;outline:0;background:transparent;color:white;padding:8px}.actions{display:flex;align-items:center;gap:8px}.actions button{border:0;color:#ccc;font-size:12px}.send{margin-left:auto;background:var(--purple)!important;color:#17121f!important;font-weight:900;font-size:18px!important}.note{text-align:center;font-size:10px;color:#777;padding-top:8px}.view{display:none}.view.active{display:block}.studio{max-width:800px;margin:auto;padding:25px}.studio textarea{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;min-height:110px}.primary{background:var(--purple);color:#17121f;border:0;border-radius:11px;padding:11px 15px;font-weight:750}.overlay{position:fixed;inset:0;background:#000b;display:flex;align-items:center;justify-content:center;padding:18px;z-index:20;overflow:auto}.card{width:min(420px,100%);background:#19191f;border:1px solid #383440;border-radius:23px;padding:25px;margin:auto}.card .brand{justify-content:center;margin-bottom:18px}.card h2{text-align:center;margin:0 0 5px}.card p{text-align:center;color:var(--muted);font-size:13px}.card label{display:block;font-size:12px;margin:13px 0 7px}.card input{width:100%;padding:12px;background:#101014;border:1px solid #41414b;border-radius:11px;color:white}.card .primary{width:100%;margin-top:14px;text-align:center}.auth-switch{display:flex;gap:8px;margin:18px 0 8px}.auth-switch button{flex:1;text-align:center}.auth-switch button.active{background:#302747;border-color:#7764a9}.secondary{width:100%;text-align:center;margin-top:9px}.status{text-align:center;color:#cbbdff;font-size:12px;min-height:20px;margin-top:12px;overflow-wrap:anywhere}.small{font-size:11px!important;line-height:1.5}.hidden{display:none!important}
@media(max-width:700px){.sidebar{position:fixed;z-index:10;top:0;bottom:0;left:0;width:min(280px,85vw);transform:translateX(-110%);transition:transform .2s;box-shadow:0 0 50px #0008}.sidebar.open{transform:translateX(0)}.top{padding:0 10px}.welcome{padding:20px 14px}.suggestions{grid-template-columns:1fr}.messages{padding:17px 10px}.composer-wrap{padding:8px 9px max(10px,env(safe-area-inset-bottom))}.studio{padding:20px 12px}}
/* VYRO AI — Premium UI Upgrade */
:root {
  --bg: #0d0d10;
  --panel: #17171c;
  --line: #2b2b33;
  --text: #f7f7fb;
  --muted: #9a9aa8;
  --purple: #b5a0ff;
  --purple-hover: #c7b7ff;
}
body { background: var(--bg); letter-spacing: -.15px; -webkit-font-smoothing: antialiased; }
button { transition: background .18s ease, border-color .18s ease, transform .18s ease; }
button:hover { background: #24242c; border-color: #494452; }
button:active { transform: scale(.98); }
.sidebar { background: #111114; border-color: #25252c; padding: 18px 13px; gap: 10px; }
.brand { letter-spacing: -.6px; padding: 10px 7px 18px; }
.logo { background: linear-gradient(140deg, #e0d5ff, #a18aff 55%, #7451df); color: #171220; box-shadow: 0 3px 22px #9878ff24; }
.new { background: #1b1b22; border-color: #35353e; padding: 13px; font-weight: 600; }
.nav { padding: 12px; color: #c8c8d2; border-color: transparent; }
.nav.active { background: #292333; border-color: #393044; color: #e4dcff; }
.label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; margin: 19px 8px 5px; }
.history button { padding: 10px 11px; border-radius: 9px; font-size: 13px; }
.history button:hover { background: #202026; }
.bottom { border-color: #292930; padding: 15px 5px 0; }
.main { background: radial-gradient(ellipse at 50% -30%, #8b6bff0b, transparent 55%), var(--bg); }
.top { height: 64px; border-color: #25252c; background: #0d0d10dd; backdrop-filter: blur(18px); }
.top button { border-radius: 10px; }
.topname { letter-spacing: -.3px; }
.welcome { padding: 32px 20px; }
.welcome h1 { font-weight: 750; letter-spacing: -1.8px; line-height: 1.12; margin: 22px 0 8px; }
.gradient { background: linear-gradient(100deg, #e2d8ff 0%, #b9a5ff 45%, #9574ff 100%); color: transparent; -webkit-background-clip: text; background-clip: text; }
.sub { color: #a4a4b2; }
.suggestions { margin-top: 25px; gap: 12px; }
.suggestion { min-height: 88px; background: linear-gradient(145deg, #19191f, #141418); border-color: #2c2c35; border-radius: 16px; padding: 18px; }
.suggestion:hover { background: #211e2b; border-color: #67558d; transform: translateY(-2px); }
.suggestion strong { font-size: 14px; font-weight: 650; }
.suggestion span { line-height: 1.5; margin-top: 7px; }
.messages { gap: 25px; padding-top: 30px; padding-bottom: 40px; }
.avatar { border-radius: 11px; background: linear-gradient(140deg, #d3c4ff, #8e6cf2); color: #171220; }
.message.user .avatar { background: #34313d; color: #f5f1ff; }
.bubble { border-radius: 17px; border-color: #303039; line-height: 1.75; padding: 13px 16px; }
.message.user .bubble { background: #292630; border-color: #393441; }
.composer-wrap { padding-top: 12px; }
.composer { background: #19191f; border: 1px solid #383842; border-radius: 23px; padding: 12px; box-shadow: 0 10px 40px #0002; transition: border-color .2s, box-shadow .2s; }
.composer:focus-within { border-color: #77659f; box-shadow: 0 0 0 3px #a18aff12; }
textarea { line-height: 1.6; }
.actions button { border-radius: 9px; padding: 9px 11px; }
.send { min-width: 39px; min-height: 39px; display: grid; place-items: center; border-radius: 13px !important; background: #c2b0ff !important; box-shadow: 0 3px 14px #a18aff22; }
.send:hover { background: #d4c7ff !important; }
.note { padding-top: 10px; color: #737380; }
.overlay { background: #08080bdc; backdrop-filter: blur(12px); }
.card { background: linear-gradient(155deg, #1c1b23, #121216 75%); border: 1px solid #35323f; border-radius: 25px; padding: 30px; box-shadow: 0 24px 90px #0008; }
.card .brand { font-size: 21px; padding: 5px 0 16px; }
.card h2 { font-size: 27px; letter-spacing: -1px; margin: 12px 0 8px; }
.card p { line-height: 1.6; }
.card label { font-weight: 600; color: #dedee7; margin-top: 19px; }
.card input { min-height: 47px; background: #101014; border-color: #383842; border-radius: 12px; outline: none; transition: border-color .2s, box-shadow .2s; }
.card input:focus { border-color: #a18aff; box-shadow: 0 0 0 3px #a18aff18; }
.card .primary { min-height: 47px; border-radius: 12px; background: linear-gradient(100deg, #c8b8ff, #a18aff); box-shadow: 0 5px 18px #a18aff20; }
.card .primary:hover { background: linear-gradient(100deg, #ded3ff, #b5a0ff); }
.status { line-height: 1.6; overflow-wrap: anywhere; }
@media (max-width: 700px) {
  .welcome h1 { letter-spacing: -1.2px; }
  .suggestion { min-height: 78px; padding: 15px; }
  .card { padding: 25px 21px; border-radius: 22px; }
  .composer { border-radius: 20px; }
}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar" id="sidebar">
<div class="brand"><div class="logo">V</div> VYRO AI</div>
<button class="new" id="new">＋ New chat</button><button class="nav active" id="chatTab">◫ Chat</button><button class="nav" id="studioTab">✧ Image Studio</button>
<div class="label">RECENT CHATS</div><div class="history" id="history"></div>
<div class="bottom"><div class="profile" id="profile">Not signed in</div><button id="logout">↪ Sign out</button></div>
</aside>
<main class="main">
<header class="top"><button id="menu" aria-label="Open menu">☰</button><div class="topname" id="pageTitle">VYRO AI</div></header>
<section class="content">
<div class="view active" id="chatView"><div class="welcome" id="welcome"><div class="logo">V</div><h1>What can I help with<br><span class="gradient">today?</span></h1><p class="sub">Your ideas, powered by VYRO.</p><div class="suggestions"><button class="suggestion" data-prompt="Explain a difficult topic in simple terms"><strong>▤ Learn something</strong><span>Get a simple explanation</span></button><button class="suggestion" data-prompt="Help me brainstorm creative ideas"><strong>✧ Brainstorm ideas</strong><span>Explore new possibilities</span></button><button class="suggestion" data-prompt="Help me write a message"><strong>✎ Write something</strong><span>Draft or improve text</span></button><button class="suggestion" data-prompt="Make a step-by-step learning plan"><strong>⌁ Make a plan</strong><span>Turn goals into steps</span></button></div></div><div class="messages" id="messages" hidden></div></div>
<div class="view" id="studioView"><div class="studio"><h1 class="gradient">Image Studio</h1><p class="sub">Describe an image to generate.</p><textarea id="imagePrompt" placeholder="A futuristic city at sunset..."></textarea><p><button class="primary" id="generate">✧ Generate image</button></p><div class="status" id="imageStatus"></div><div id="imageResult"></div></div></div>
</section>
<div class="composer-wrap" id="composerWrap"><div class="composer"><textarea id="prompt" rows="1" placeholder="Message VYRO AI..."></textarea><div class="actions"><button id="toStudio">▧ Image Studio</button><span class="sub">AI can make mistakes</span><button class="send" id="send" aria-label="Send">↑</button></div></div><div class="note">VYRO AI · Made to help you think, create, and explore</div></div>
</main></div>
<div class="overlay" id="login"><div class="card"><div class="brand"><div class="logo">V</div> VYRO AI</div><h2 id="authTitle">Welcome back</h2><p id="authSubtitle">Sign in or create your account with email.</p>
<div class="auth-switch"><button type="button" id="signInTab" class="active">Sign in</button><button type="button" id="signUpTab">Create account</button></div>
<form id="loginForm"><label for="email">Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" minlength="6" placeholder="At least 6 characters" required><button class="primary" id="loginButton" type="submit">Sign in</button></form>
<button type="button" class="secondary hidden" id="resend">Resend verification email</button><div class="status" id="loginStatus" role="status" aria-live="polite"></div><p class="small">New accounts must verify their email before signing in. Check your inbox and spam folder.</p></div></div>
<script>
(()=>{
const $=id=>document.getElementById(id);let sb,session=null,busy=false,chats=[],chatId=null,authMode='signin',pendingVerificationEmail='';const key='vyro_chat_history_v1';
function showStatus(t){$('loginStatus').textContent=t}function setAuthMode(mode){authMode=mode;const signup=mode==='signup';$('authTitle').textContent=signup?'Create your account':'Welcome back';$('authSubtitle').textContent=signup?'Sign up with your email and a password.':'Sign in securely with your email and password.';$('loginButton').textContent=signup?'Create account':'Sign in';$('signInTab').classList.toggle('active',!signup);$('signUpTab').classList.toggle('active',signup);$('password').autocomplete=signup?'new-password':'current-password';$('resend').classList.add('hidden');showStatus('')}
function callbackMessage(){const hash=new URLSearchParams(location.hash.slice(1));const params=new URLSearchParams(location.search);const err=hash.get('error_description')||params.get('error_description');if(err){showStatus(decodeURIComponent(err.replace(/\+/g,' ')));$('login').style.display='flex';history.replaceState(null,'',location.pathname);return true}if(hash.get('access_token')||params.get('token_hash')){showStatus('Checking your verification link…');return false}return false}
async function init(){try{const r=await fetch('/api/config',{cache:'no-store'});const c=await r.json();if(!r.ok||!c.supabaseUrl||!c.supabaseAnonKey)throw Error('Configure SUPABASE_URL and SUPABASE_ANON_KEY in Cloudflare Worker settings.');sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});const {data,error}=await sb.auth.getSession();if(error)throw error;applySession(data.session);sb.auth.onAuthStateChange((event,s)=>{applySession(s);if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){if(location.hash.includes('access_token')||location.search.includes('token_hash')){history.replaceState(null,'',location.pathname);showStatus('Email verified. You are signed in!')}}});if(!data.session&&callbackMessage())return;if(!data.session&&location.hash.includes('access_token')){const {data:sd,error:se}=await sb.auth.getSession();if(se)showStatus(se.message);else if(sd.session)applySession(sd.session)}}catch(e){$('login').style.display='flex';showStatus(e.message||'Could not initialize sign-in.')}}
function applySession(s){session=s;$('login').style.display=s?'none':'flex';$('profile').textContent=s?.user?.email||'Not signed in';if(s){load();if(!chatId&&chats.length)chatId=chats[chats.length-1].id;render()}}
function load(){try{chats=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(chats))chats=[]}catch{chats=[]}renderHistory()}function save(){try{localStorage.setItem(key,JSON.stringify(chats))}catch{}renderHistory()}
function renderHistory(){const el=$('history');el.replaceChildren();[...chats].reverse().forEach(c=>{const b=document.createElement('button');b.textContent=c.title||'New chat';b.onclick=()=>{chatId=c.id;render();closeMenu()};el.append(b)})}function current(){return chats.find(c=>c.id===chatId)}
function fresh(){chatId=String(Date.now());chats.push({id:chatId,title:'New chat',messages:[]});save();showChat();render();$('prompt').focus()}function closeMenu(){$('sidebar').classList.remove('open')}
function showChat(){$('chatView').classList.add('active');$('studioView').classList.remove('active');$('composerWrap').style.display='block';$('pageTitle').textContent='VYRO AI';$('chatTab').classList.add('active');$('studioTab').classList.remove('active');closeMenu()}function showStudio(){$('chatView').classList.remove('active');$('studioView').classList.add('active');$('composerWrap').style.display='none';$('pageTitle').textContent='Image Studio';$('studioTab').classList.add('active');$('chatTab').classList.remove('active');closeMenu()}
function render(){const c=current(),el=$('messages'),has=!!(c&&c.messages.length);$('welcome').style.display=has?'none':'flex';el.hidden=!has;el.replaceChildren();if(!has)return;c.messages.forEach(m=>{const row=document.createElement('div');row.className='message '+m.role;const av=document.createElement('div');av.className='avatar';av.textContent=m.role==='user'?'Y':'V';const b=document.createElement('div');b.className='bubble';b.textContent=m.content;row.append(av,b);el.append(row)});el.scrollTop=el.scrollHeight}
function add(role,content){let c=current();if(!c){chatId=String(Date.now());chats.push({id:chatId,title:'New chat',messages:[]});c=current()}c.messages.push({role,content});if(role==='user'&&c.title==='New chat')c.title=content.slice(0,35);save();render()}
async function send(prefill){if(busy)return;const text=(prefill??$('prompt').value).trim();if(!text)return;if(!session){$('login').style.display='flex';return}if(!current())fresh();$('prompt').value='';add('user',text);busy=true;$('send').disabled=true;const wait=document.createElement('div');wait.className='sub';wait.textContent='VYRO is thinking…';$('messages').append(wait);try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({messages:current().messages})});const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');wait.remove();add('assistant',d.response||d.text||'No response received.')}catch(e){wait.remove();add('assistant','Error: '+e.message)}finally{busy=false;$('send').disabled=false}}
async function generate(){const prompt=$('imagePrompt').value.trim();if(!prompt){$('imageStatus').textContent='Describe your image first.';return}if(!session){$('login').style.display='flex';return}$('generate').disabled=true;$('imageStatus').textContent='Generating…';$('imageResult').replaceChildren();try{const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({prompt})});if(!r.ok){let d={};try{d=await r.json()}catch{}throw Error(d.details||d.error||'Generation failed')}const url=URL.createObjectURL(await r.blob()),img=document.createElement('img');img.src=url;img.alt=prompt;img.style.cssText='display:block;width:100%;border-radius:14px;margin-top:18px';const a=document.createElement('a');a.href=url;a.download='vyro-image.png';a.textContent='Download image';a.className='primary';a.style.cssText='display:inline-block;margin-top:12px;text-decoration:none;padding:11px 15px;color:#17121f';$('imageResult').append(img,a);$('imageStatus').textContent='Image ready.'}catch(e){$('imageStatus').textContent=e.message}finally{$('generate').disabled=false}}
$('loginForm').onsubmit=async e=>{e.preventDefault();if(!sb)return showStatus('Sign-in is still loading. Try again in a moment.');const email=$('email').value.trim(),password=$('password').value;$('loginButton').disabled=true;$('resend').classList.add('hidden');showStatus(authMode==='signup'?'Creating account…':'Signing in…');try{if(authMode==='signup'){const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;if(data.session){applySession(data.session);showStatus('Account created and signed in.')}else{pendingVerificationEmail=email;$('resend').classList.remove('hidden');showStatus('Account created. Open the verification email we sent, then return here to sign in. Check spam if it is missing.')}}else{const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;if(data.session){applySession(data.session);showStatus('Signed in successfully.')}}}catch(e){const msg=e.message||'Authentication failed.';showStatus(msg);if(/confirm|not confirmed|email not verified/i.test(msg)){pendingVerificationEmail=email;$('resend').classList.remove('hidden')}}finally{$('loginButton').disabled=false}};
$('resend').onclick=async()=>{if(!sb||!pendingVerificationEmail){showStatus('Enter the email address you used to sign up.');return}$('resend').disabled=true;showStatus('Sending another verification email…');try{const {error}=await sb.auth.resend({type:'signup',email:pendingVerificationEmail,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;showStatus('Verification email requested. Check your inbox and spam folder.')}catch(e){showStatus(e.message||'Could not resend the email.')}finally{$('resend').disabled=false}};
$('signInTab').onclick=()=>setAuthMode('signin');$('signUpTab').onclick=()=>setAuthMode('signup');$('send').onclick=()=>send();$('prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};$('new').onclick=fresh;$('menu').onclick=()=>$('sidebar').classList.toggle('open');$('chatTab').onclick=showChat;$('studioTab').onclick=showStudio;$('toStudio').onclick=showStudio;$('generate').onclick=generate;document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.prompt));$('logout').onclick=async()=>{if(sb)await sb.auth.signOut();session=null;$('profile').textContent='Not signed in';$('login').style.display='flex';setAuthMode('signin')};init();
})();
</script>
</body></html>`;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

async function verifyUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  try {
    const r = await fetch(env.SUPABASE_URL.replace(/\/+$/, "") + "/auth/v1/user", {
      headers: { Authorization: "Bearer " + token, apikey: env.SUPABASE_ANON_KEY }
    });
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

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
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
        supabaseConfigured: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY)
      });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      if (!await verifyUser(request, env)) {
        return json({
          error: "Please sign in again. If your email is not verified, verify it first."
        }, 401);
      }

      if (!env.AI) {
        return json({ error: "Workers AI binding named AI is missing." }, 500);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON." }, 400);
      }

      const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
      if (!messages.length) {
        return json({ error: "Send a message first." }, 400);
      }

      try {
        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
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
        });

        return json({ response: result.response || "No response generated." });
      } catch (e) {
        console.error("VYRO CHAT ERROR:", e instanceof Error ? e.message : String(e));
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
        return json({ error: "Workers AI binding named AI is missing." }, 500);
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
          { prompt, num_steps: 4 }
        );

        // Handle supported Workers AI image response formats.
        if (result instanceof Response) {
          if (!result.ok) {
            const detail = await result.text().catch(() => "");
            console.error(
              "Workers AI image HTTP error:",
              result.status,
              detail.slice(0, 1200)
            );

            return json({
              error: "Workers AI image request failed.",
              details: detail.slice(0, 1200) || `Model returned HTTP ${result.status}.`
            }, 502);
          }

          return new Response(result.body, {
            headers: {
              "Content-Type": result.headers.get("Content-Type") || "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        if (result && typeof result.image === "string" && result.image.length) {
          const encoded = result.image.replace(/^data:image\/[^;]+;base64,/, "");
          const binary = atob(encoded);
          const bytes = new Uint8Array(binary.length);

          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          return new Response(bytes, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        if (result instanceof ArrayBuffer) {
          return new Response(result, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        if (ArrayBuffer.isView(result)) {
          return new Response(result, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "no-store"
            }
          });
        }

        console.error(
          "Unexpected Workers AI image response type:",
          typeof result,
          result ? Object.keys(result) : result
        );

        return json({
          error: "Unexpected image model response.",
          details: result && typeof result === "object"
            ? Object.keys(result).join(", ")
            : typeof result
        }, 502);

      } catch (e) {
        const details = e instanceof Error ? e.message : String(e);
        console.error("IMAGE GENERATION ERROR:", details);

        return json({
          error: "Image generation failed.",
          details: details.slice(0, 1200)
        }, 502);
      }
    }

    return json({ error: "Not found." }, 404);
  }
};
