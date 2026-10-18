
const HTML = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#09090b">
<title>Vyro AI</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root{color-scheme:dark;--bg:#09090b;--panel:#121216;--line:#2b2b32;--text:#f5f5f7;--muted:#a1a1aa;--purple:#a78bfa}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input,textarea{font:inherit}button{cursor:pointer}button:disabled{opacity:.55;cursor:wait}.hidden{display:none!important}
#toast{position:fixed;z-index:99;left:50%;bottom:22px;transform:translate(-50%,15px);opacity:0;transition:.2s;background:#25252d;border:1px solid #444451;padding:11px 15px;border-radius:12px;max-width:90vw;text-align:center}#toast.show{opacity:1;transform:translate(-50%,0)}
.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;letter-spacing:-.7px}.logo{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(140deg,#c4b5fd,#7c3aed);box-shadow:0 5px 25px #8b5cf644;color:white}.grad{background:linear-gradient(100deg,#c4b5fd,#a78bfa,#f0abfc);background-clip:text;-webkit-background-clip:text;color:transparent}
#auth{min-height:100dvh;display:grid;grid-template-columns:1fr 1fr;background:radial-gradient(ellipse at 15% 30%,#26163d 0,transparent 48%),#09090b}.auth-art{padding:40px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid #28232f;overflow:hidden}.art-copy{max-width:500px;margin:auto 0}.art-copy h1{font-size:clamp(42px,5.5vw,68px);line-height:1.03;letter-spacing:-3px}.art-copy p{color:#bcb5c9;max-width:410px;line-height:1.8}.art-foot{font-size:11px;color:#8e879b;letter-spacing:1px}.auth-side{display:grid;place-items:center;padding:25px}.auth-card{width:100%;max-width:380px;animation:rise .4s ease both}.auth-card h2{font-size:30px;letter-spacing:-1px;margin:0 0 6px}.muted{color:var(--muted)}.auth-card>p{margin:0 0 25px;color:var(--muted)}.field{margin:15px 0}.field label,.label{display:block;font-size:12px;color:#d4d4d8;margin-bottom:7px}.field input{width:100%;background:#131317;border:1px solid #34343d;border-radius:11px;padding:13px;color:white;outline:none}.field input:focus,textarea:focus{border-color:var(--purple)!important;box-shadow:0 0 0 3px #a78bfa16}.primary{border:0;border-radius:11px;background:linear-gradient(110deg,#a78bfa,#8b5cf6);color:white;padding:12px 16px;font-weight:700;transition:.2s}.primary:hover{filter:brightness(1.1);transform:translateY(-1px)}.full{width:100%}.link{border:0;background:none;color:#c4b5fd;font-weight:700;padding:4px}.auth-switch{text-align:center;color:var(--muted);margin-top:20px;font-size:12px}.auth-note{font-size:11px;color:#777782;text-align:center;margin-top:20px;line-height:1.7}#authError{color:#fca5a5;font-size:12px;margin-top:12px;white-space:pre-wrap}#authSuccess{color:#86efac;font-size:12px;margin-top:12px}.mobile-brand{display:none}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
#app{height:100dvh;display:flex;overflow:hidden}.sidebar{width:255px;flex-shrink:0;background:#0d0d10;border-right:1px solid var(--line);padding:17px 13px;display:flex;flex-direction:column;transition:transform .22s}.sidebar .brand{padding:4px 6px 22px}.new-chat{display:flex;gap:9px;align-items:center;text-align:left;background:#18181d;color:white;border:1px solid #303038;border-radius:11px;padding:11px;width:100%}.section-label{font-size:10px;letter-spacing:1px;color:#777782;text-transform:uppercase;padding:23px 8px 9px}.side-btn{border:0;background:none;color:#c4c4cc;padding:10px;width:100%;border-radius:9px;text-align:left;font-size:12px}.side-btn:hover,.history-item:hover{background:#202027}.history{flex:1;overflow:auto}.history-item{padding:9px;border-radius:8px;font-size:12px;color:#bcbcc5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.history-item.active{background:#202027;color:white}.side-bottom{border-top:1px solid #292930;padding-top:9px}.profile{display:flex;align-items:center;gap:9px;padding:10px 6px}.avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(140deg,#a78bfa,#6d28d9);font-weight:700}.email{font-size:11px;color:#aaa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.main{min-width:0;flex:1;display:flex;flex-direction:column}.topbar{height:59px;flex-shrink:0;border-bottom:1px solid #24242b;display:flex;align-items:center;justify-content:space-between;padding:0 22px}.top-title{font-weight:700}.top-right{display:flex;gap:8px;align-items:center}.pill{border:1px solid #303038;border-radius:20px;padding:6px 10px;color:#c4c4cc;font-size:11px}.menu{display:none}
.view{display:none;flex:1;min-height:0;flex-direction:column}.view.active{display:flex}.scroll{flex:1;overflow:auto;scroll-behavior:smooth}.welcome{max-width:790px;margin:auto;padding:8vh 24px 30px;animation:rise .4s ease both}.mark{width:50px;height:50px;display:grid;place-items:center;border:1px solid #4c3b70;border-radius:17px;background:#1d1628;color:#c4b5fd;font-size:24px;margin-bottom:23px}.welcome h1{font-size:clamp(30px,4vw,44px);line-height:1.1;letter-spacing:-2px;margin:0 0 12px}.welcome p{color:var(--muted);line-height:1.8}.suggestions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:28px}.suggestion{background:#121216;border:1px solid #2b2b32;border-radius:13px;padding:15px;text-align:left;color:#eee;transition:.2s}.suggestion:hover{border-color:#7960a4;transform:translateY(-2px)}.suggestion b{display:block;font-size:12px;margin-bottom:6px}.suggestion span{font-size:11px;color:#9999a4;line-height:1.6}
.messages{max-width:790px;width:100%;margin:auto;padding:24px}.message{display:flex;gap:12px;margin-bottom:25px;animation:rise .2s ease}.msg-avatar{width:30px;height:30px;flex-shrink:0;border-radius:10px;background:#25202e;color:#c4b5fd;display:grid;place-items:center;font-weight:700}.message.user .msg-avatar{background:#29292f;color:white}.msg-body{min-width:0;flex:1}.msg-name{font-size:11px;color:#aaa;margin:3px 0 8px;font-weight:700}.msg-text{font-size:14px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}.typing{display:flex;gap:5px;padding:10px 0}.typing i{width:6px;height:6px;border-radius:50%;background:#a78bfa;animation:bounce 1s infinite}.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}@keyframes bounce{30%{transform:translateY(-5px);opacity:1}0%,60%,100%{opacity:.5}}
.composer-area{padding:12px 18px max(14px,env(safe-area-inset-bottom));background:linear-gradient(0deg,#09090b 80%,transparent)}.composer{max-width:790px;margin:auto;background:#141418;border:1px solid #373740;border-radius:16px;padding:10px 12px}.composer:focus-within{border-color:#8064ad}#prompt{width:100%;min-height:30px;max-height:150px;resize:none;background:none;border:0;outline:none;color:white;padding:5px;font-size:14px;line-height:1.6}#prompt::placeholder{color:#777782}.composer-bottom{display:flex;align-items:center;justify-content:space-between}.hint{font-size:10px;color:#777782}.send{width:34px;height:34px;border:0;border-radius:10px;background:#a78bfa;color:#171020;font-size:20px;font-weight:800}.disclaimer{text-align:center;font-size:10px;color:#686872;margin-top:9px}
.studio{max-width:850px;width:100%;margin:auto;padding:5vh 24px 35px}.studio h1{font-size:36px;letter-spacing:-1.5px;margin:0 0 8px}.studio>p{color:var(--muted);line-height:1.7;margin-bottom:24px}.tabs{display:flex;gap:7px;background:#121216;border:1px solid #292930;border-radius:12px;padding:5px;width:max-content;margin-bottom:18px}.tab{border:0;border-radius:8px;padding:9px 14px;color:#aaa;background:transparent;font-size:12px}.tab.active{background:#302542;color:#e9ddff}.studio-card{background:#121216;border:1px solid #2d2d34;border-radius:16px;padding:18px}.studio-card textarea{width:100%;min-height:105px;resize:vertical;background:#0b0b0e;border:1px solid #303038;border-radius:11px;padding:12px;color:white;outline:none;line-height:1.7}.studio-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px}.output{margin-top:20px}.output img,.output video{display:block;width:100%;max-height:600px;object-fit:contain;background:#08080a;border:1px solid #303038;border-radius:13px}.output a{display:inline-block;color:#c4b5fd;font-size:12px;margin-top:10px;margin-right:15px}.status{font-size:12px;color:#aaa;line-height:1.7;margin-top:12px}.small-note{font-size:11px;color:#777782;line-height:1.7;margin-top:12px}
@media(max-width:740px){#auth{grid-template-columns:1fr}.auth-art{display:none}.mobile-brand{display:flex;margin-bottom:32px}.auth-side{padding:25px}.sidebar{position:fixed;z-index:20;top:0;bottom:0;left:0;transform:translateX(-105%);box-shadow:15px 0 50px #0009}.sidebar.open{transform:translateX(0)}.menu{display:grid;place-items:center;width:34px;height:34px;border:1px solid #303038;background:#151519;color:white;border-radius:9px;margin-right:8px}.topbar{height:56px;padding:0 13px}.top-title{display:flex;align-items:center}.pill{display:none}.welcome{padding:7vh 18px 24px}.welcome h1{font-size:32px}.suggestions{grid-template-columns:1fr}.messages{padding:20px 16px}.composer-area{padding:10px 11px max(12px,env(safe-area-inset-bottom))}.studio{padding:5vh 16px 25px}.studio h1{font-size:32px}.studio-actions{align-items:flex-start;flex-direction:column}.studio-actions button{width:100%}}
</style>
</head>
<body>
<div id="toast"></div>
<section id="auth">
<div class="auth-art"><div class="brand"><div class="logo">V</div>vyro<span class="grad">.</span></div><div class="art-copy"><h1>Ideas become<br><span class="grad">something more.</span></h1><p>Your personal AI space to think, create, explore, and turn those late-night ideas into something real.</p></div><div class="art-foot">VYRO AI · YOUR SPACE TO CREATE</div></div>
<div class="auth-side"><div class="auth-card"><div class="brand mobile-brand"><div class="logo">V</div>vyro<span class="grad">.</span></div><h2 id="authTitle">Welcome back</h2><p id="authSubtitle">Sign in to continue where your ideas left off.</p>
<form id="authForm"><div class="field"><label for="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autocomplete="email" required></div><div class="field"><label for="password">Password</label><input id="password" type="password" placeholder="At least 6 characters" minlength="6" autocomplete="current-password" required></div><button class="primary full" id="authSubmit" type="submit">Sign in →</button></form>
<div id="authError"></div><div id="authSuccess"></div><div class="auth-switch"><span id="switchText">New to Vyro?</span> <button class="link" id="switchAuth" type="button">Create an account</button></div><div class="auth-note">Your account is protected by Supabase authentication.</div></div></div>
</section>
<section id="app" class="hidden">
<aside class="sidebar" id="sidebar"><div class="brand"><div class="logo">V</div>vyro<span class="grad">.</span></div><button class="new-chat" id="newChat">＋ &nbsp; New conversation</button><div class="section-label">Workspace</div><button class="side-btn" id="chatNav">✳ &nbsp; AI Chat</button><button class="side-btn" id="studioNav">▧ &nbsp; Image Studio</button><div class="section-label">Recent conversations</div><div class="history" id="history"></div><div class="side-bottom"><button class="side-btn" id="clearHistory">⌫ &nbsp; Clear history</button><div class="profile"><div class="avatar" id="avatar">V</div><div style="min-width:0;flex:1"><div style="font-size:12px;font-weight:700;margin-bottom:3px">Your account</div><div class="email" id="userEmail"></div></div></div><button class="side-btn" id="signOut">↪ &nbsp; Sign out</button></div></aside>
<main class="main"><header class="topbar"><div class="top-title"><button class="menu" id="menuBtn" aria-label="Open menu">☰</button><span id="pageTitle">AI Chat</span></div><div class="top-right"><span class="pill">✦ Vyro AI</span><span class="pill" style="color:#86efac">● Online</span></div></header>
<section class="view active" id="chatView"><div class="scroll" id="chatScroll"><div class="welcome" id="welcome"><div class="mark">✳</div><h1>What’s on your <span class="grad">mind?</span></h1><p>Ask anything, explore an idea, or just start somewhere. We’ll figure it out together.</p><div class="suggestions"><button class="suggestion" data-prompt="Help me build a website from scratch"><b>⌘ Build something</b><span>Turn an idea into a working website.</span></button><button class="suggestion" data-prompt="Explain a difficult topic in a simple way"><b>✧ Learn something</b><span>Make complicated things easier to understand.</span></button><button class="suggestion" data-prompt="Give me five creative project ideas I can build"><b>◈ Get inspired</b><span>Find your next interesting project.</span></button><button class="suggestion" data-prompt="Help me write a clear plan for my next goal"><b>↗ Make a plan</b><span>Break a big goal into steps.</span></button></div></div><div class="messages hidden" id="messages"></div></div>
<div class="composer-area"><div class="composer"><textarea id="prompt" rows="1" placeholder="Message Vyro..." aria-label="Message Vyro"></textarea><div class="composer-bottom"><span class="hint">Enter to send · Shift + Enter for a new line</span><button class="send" id="sendBtn" aria-label="Send message">↑</button></div></div><div class="disclaimer">Vyro can make mistakes. Check important information.</div></div></section>
<section class="view" id="studioView"><div class="scroll"><div class="studio"><div class="mark">✧</div><h1>Creative <span class="grad">Studio</span></h1><p>Create an image, then turn it into a short animated video with camera motion.</p><div class="tabs"><button class="tab active" id="imageTab">▧ Image</button><button class="tab" id="videoTab">▶ Animated video</button></div><div class="studio-card"><label class="label" id="studioLabel" for="imagePrompt">Describe your image</label><textarea id="imagePrompt" placeholder="A cinematic futuristic city at night, purple neon lights, misty rain, atmospheric digital art..."></textarea><div class="studio-actions"><span class="muted" style="font-size:11px" id="studioHint">Generate a still image using Workers AI.</span><button class="primary" id="generateBtn">Generate image ↗</button></div></div><div class="output" id="imageOutput"></div><div class="status" id="imageStatus"></div><div class="small-note" id="videoNote">Video mode generates an image first, then animates it into a downloadable WebM clip. This is browser-generated animation, not full AI text-to-video.</div></div></div></section>
</main></section>
<script>
const $=id=>document.getElementById(id);
let sb=null,user=null,signup=false,busy=false,items=[],activeId=null,messages=[],studioMode='image';
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>$('toast').classList.remove('show'),3000)}
function authMessage(err,suc){$('authError').textContent=err||'';$('authSuccess').textContent=suc||''}
function switchMode(v){signup=v;$('authTitle').textContent=v?'Create your account':'Welcome back';$('authSubtitle').textContent=v?'A new space for all your ideas.':'Sign in to continue where your ideas left off.';$('authSubmit').textContent=v?'Create account →':'Sign in →';$('switchText').textContent=v?'Already have an account?':'New to Vyro?';$('switchAuth').textContent=v?'Sign in':'Create an account';$('password').autocomplete=v?'new-password':'current-password';authMessage('','')}
$('switchAuth').onclick=()=>switchMode(!signup);
async function init(){try{const r=await fetch('/api/config');const c=await r.json();if(!r.ok||!c.supabaseUrl||!c.supabaseAnonKey)throw Error(c.error||'Supabase configuration is missing.');sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);const s=await sb.auth.getSession();if(s.data.session)applySession(s.data.session);sb.auth.onAuthStateChange((_e,sess)=>{if(sess&&!user)applySession(sess);else if(!sess&&user)showAuth()})}catch(e){authMessage(e.message||'Could not connect. Refresh and try again.','')}}
$('authForm').onsubmit=async e=>{e.preventDefault();if(!sb){authMessage('Authentication is not ready. Refresh the page.','');return}const b=$('authSubmit');b.disabled=true;b.textContent=signup?'Creating account...':'Signing in...';authMessage('','');try{const email=$('email').value.trim(),password=$('password').value;if(signup){const x=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});if(x.error)throw x.error;if(x.data.session)applySession(x.data.session);else authMessage('','Account created! Check your email for the verification link, then sign in.')}else{const x=await sb.auth.signInWithPassword({email,password});if(x.error)throw x.error;applySession(x.data.session)}}catch(e){authMessage(e.message||'Authentication failed.','')}finally{b.disabled=false;b.textContent=signup?'Create account →':'Sign in →'}};
function applySession(s){user=s.user;$('auth').classList.add('hidden');$('app').classList.remove('hidden');$('userEmail').textContent=user.email||'';$('avatar').textContent=(user.email||'V')[0].toUpperCase();loadHistory()}
function showAuth(){user=null;$('app').classList.add('hidden');$('auth').classList.remove('hidden')}
function storageKey(){return 'vyro_history_'+(user?.id||'guest')}
function loadHistory(){try{items=JSON.parse(localStorage.getItem(storageKey())||'[]')}catch{items=[]}drawHistory();freshChat()}
function saveHistory(){try{localStorage.setItem(storageKey(),JSON.stringify(items.slice(0,40)))}catch{}drawHistory()}
function drawHistory(){$('history').innerHTML='';items.forEach(it=>{const d=document.createElement('div');d.className='history-item'+(it.id===activeId?' active':'');d.textContent=it.title||'New conversation';d.onclick=()=>openHistory(it.id);$('history').append(d)})}
function freshChat(){activeId=Date.now().toString();messages=[];$('messages').innerHTML='';$('messages').classList.add('hidden');$('welcome').classList.remove('hidden');$('pageTitle').textContent='AI Chat';drawHistory();closeSidebar()}
function openHistory(id){const it=items.find(x=>x.id===id);if(!it)return;activeId=id;messages=it.messages||[];$('messages').innerHTML='';messages.forEach(m=>addMessage(m.role,m.content,false));$('welcome').classList.toggle('hidden',messages.length>0);$('messages').classList.toggle('hidden',!messages.length);$('pageTitle').textContent=it.title||'AI Chat';drawHistory();closeSidebar()}
function persist(){if(!messages.length)return;let it=items.find(x=>x.id===activeId);if(!it){it={id:activeId,title:(messages.find(m=>m.role==='user')?.content||'New conversation').slice(0,42),messages:[]};items.unshift(it)}it.messages=messages.slice(-60);saveHistory()}
function closeSidebar(){$('sidebar').classList.remove('open')}
function showView(which){const chat=which==='chat';$('chatView').classList.toggle('active',chat);$('studioView').classList.toggle('active',!chat);$('pageTitle').textContent=chat?'AI Chat':'Image Studio';$('chatNav').style.background=chat?'#202027':'transparent';$('studioNav').style.background=chat?'transparent':'#202027';closeSidebar()}
$('newChat').onclick=freshChat;$('chatNav').onclick=()=>showView('chat');$('studioNav').onclick=()=>showView('studio');$('menuBtn').onclick=()=>$('sidebar').classList.toggle('open');
$('clearHistory').onclick=()=>{if(confirm('Clear all saved conversations on this device?')){items=[];saveHistory();freshChat();toast('History cleared')}};
$('signOut').onclick=async()=>{if(sb)await sb.auth.signOut();showAuth()};
document.querySelectorAll('.suggestion').forEach(b=>b.onclick=()=>{showView('chat');$('prompt').value=b.dataset.prompt;sendMessage()});
function addMessage(role,content,scroll=true){$('welcome').classList.add('hidden');$('messages').classList.remove('hidden');const a=document.createElement('article');a.className='message '+(role==='user'?'user':'assistant');const av=document.createElement('div');av.className='msg-avatar';av.textContent=role==='user'?(user?.email||'U')[0].toUpperCase():'✳';const body=document.createElement('div');body.className='msg-body';const n=document.createElement('div');n.className='msg-name';n.textContent=role==='user'?'You':'Vyro';const t=document.createElement('div');t.className='msg-text';t.textContent=content;body.append(n,t);a.append(av,body);$('messages').append(a);if(scroll)$('chatScroll').scrollTop=$('chatScroll').scrollHeight;return{article:a,text:t}}
function addTyping(){const x=addMessage('assistant','');x.text.innerHTML='<div class="typing"><i></i><i></i><i></i></div>';return x}
async function sendMessage(){if(busy)return;const input=$('prompt'),content=input.value.trim();if(!content)return;if(!user){toast('Please sign in again');return}busy=true;$('sendBtn').disabled=true;input.value='';input.style.height='auto';showView('chat');messages.push({role:'user',content});addMessage('user',content);const wait=addTyping();try{const s=await sb.auth.getSession();if(!s.data.session)throw Error('Session expired. Sign in again.');const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.data.session.access_token},body:JSON.stringify({messages:messages.slice(-20)})});const d=await r.json();if(!r.ok)throw Error(d.error||'AI request failed');if(!d.reply)throw Error('AI returned an empty response');wait.text.textContent=d.reply;messages.push({role:'assistant',content:d.reply});persist();$('pageTitle').textContent=items.find(x=>x.id===activeId)?.title||'AI Chat'}catch(e){wait.article.remove();addMessage('assistant','Sorry, I couldn’t complete that request. '+(e.message||''));messages.pop();toast(e.message||'Request failed')}finally{busy=false;$('sendBtn').disabled=false;$('chatScroll').scrollTop=$('chatScroll').scrollHeight}}
$('sendBtn').onclick=sendMessage;$('prompt').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}});$('prompt').addEventListener('input',()=>{$('prompt').style.height='auto';$('prompt').style.height=Math.min($('prompt').scrollHeight,150)+'px'});
function setStudioMode(mode){studioMode=mode;$('imageTab').classList.toggle('active',mode==='image');$('videoTab').classList.toggle('active',mode==='video');$('studioLabel').textContent=mode==='image'?'Describe your image':'Describe the scene for your animated video';$('imagePrompt').placeholder=mode==='image'?'A cinematic futuristic city at night, purple neon lights...':'A dreamy floating island above the clouds, glowing sunset, slow cinematic camera movement...';$('studioHint').textContent=mode==='image'?'Generate a still image using Workers AI.':'Creates an image and animates it into a short WebM video.';$('generateBtn').textContent=mode==='image'?'Generate image ↗':'Create video ▶';$('videoNote').textContent=mode==='video'?'This creates a short animated video from an AI-generated image using browser canvas. It is not full AI text-to-video.':'Tip: describe subject, lighting, colors, mood, and visual style for better results.'}
$('imageTab').onclick=()=>setStudioMode('image');$('videoTab').onclick=()=>setStudioMode('video');
async function requestImage(prompt){const s=await sb.auth.getSession();if(!s.data.session)throw Error('Session expired. Sign in again.');const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.data.session.access_token},body:JSON.stringify({prompt})});const d=await r.json();if(!r.ok)throw Error((d.error||'Image generation failed')+(d.details?': '+d.details:''));if(!d.image)throw Error('No image was returned');return d.image}
$('generateBtn').onclick=async()=>{if(busy)return;const prompt=$('imagePrompt').value.trim();if(!prompt){toast('Describe what you want first');return}if(!user){toast('Please sign in again');return}busy=true;const b=$('generateBtn');b.disabled=true;b.textContent=studioMode==='video'?'Creating video...':'Generating...';$('imageOutput').innerHTML='';$('imageStatus').textContent='Generating your image. Please wait...';try{const image=await requestImage(prompt);if(studioMode==='image'){const img=document.createElement('img');img.alt=prompt;img.src=image;$('imageOutput').append(img);const link=document.createElement('a');link.href=image;link.download='vyro-image.png';link.textContent='Download image';$('imageOutput').append(link);$('imageStatus').textContent='Your image is ready.'}else{$('imageStatus').textContent='Image ready. Animating your video...';await makeVideo(image);$('imageStatus').textContent='Your animated video is ready. Play it or download it below.'}}catch(e){$('imageStatus').textContent='Could not create '+(studioMode==='video'?'video':'image')+': '+(e.message||'Please try again')}finally{busy=false;b.disabled=false;b.textContent=studioMode==='video'?'Create video ▶':'Generate image ↗'}};
function makeVideo(src){return new Promise((resolve,reject)=>{if(!HTMLCanvasElement.prototype.captureStream||typeof MediaRecorder==='undefined'){reject(Error('Video recording is not supported in this browser. Try a newer Chrome version.'));return}const img=new Image();img.onload=()=>{let stream,recorder;try{const canvas=document.createElement('canvas');canvas.width=720;canvas.height=720;const ctx=canvas.getContext('2d');stream=canvas.captureStream(24);let mime='video/webm;codecs=vp9';if(!MediaRecorder.isTypeSupported(mime))mime='video/webm';recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2500000});const chunks=[];recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};recorder.onerror=()=>reject(Error('Browser video recording failed'));recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:'video/webm'});const url=URL.createObjectURL(blob);const video=document.createElement('video');video.controls=true;video.playsInline=true;video.src=url;const link=document.createElement('a');link.href=url;link.download='vyro-original-video.webm';link.textContent='Download video (.webm)';$('imageOutput').innerHTML='';$('imageOutput').append(video,link);resolve()};const duration=6000,start=performance.now();recorder.start();function frame(now){const p=Math.min(1,(now-start)/duration);const zoom=1+.10*p;const scale=Math.max(canvas.width/img.width,canvas.height/img.height);const w=img.width*scale,h=img.height*scale;ctx.fillStyle='#08080b';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(canvas.width/2+(p-.5)*22,canvas.height/2+Math.sin(p*Math.PI*2)*8);ctx.scale(zoom,zoom);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();const shade=ctx.createLinearGradient(0,canvas.height*.55,0,canvas.height);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#00000055');ctx.fillStyle=shade;ctx.fillRect(0,0,canvas.width,canvas.height);if(p<1)requestAnimationFrame(frame);else setTimeout(()=>recorder.stop(),100)}requestAnimationFrame(frame)}catch(e){if(stream)stream.getTracks().forEach(t=>t.stop());reject(e)}};img.onerror=()=>reject(Error('Could not load generated image'));img.src=src})}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();freshChat();$('prompt').focus()}});
init();
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
  if (!auth.startsWith("Bearer ")) return null;

  const response = await fetch(env.SUPABASE_URL + "/auth/v1/user", {
    headers: {
      "Authorization": auth,
      "apikey": env.SUPABASE_ANON_KEY
    }
  });

  if (!response.ok) return null;
  return response.json();
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": url.origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    try {
      if (url.pathname === "/" && request.method === "GET") {
        return new Response(HTML, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache"
          }
        });
      }

      if (url.pathname === "/api/config" && request.method === "GET") {
        if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
          return json({ error: "Supabase environment variables are missing." }, 500);
        }
        return json({
          supabaseUrl: env.SUPABASE_URL,
          supabaseAnonKey: env.SUPABASE_ANON_KEY
        });
      }

      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({
          ok: true,
          service: "Vyro AI",
          aiBinding: Boolean(env.AI),
          supabaseConfigured: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY)
        });
      }

      if (url.pathname === "/api/chat" && request.method === "POST") {
        const user = await verifyUser(request, env);
        if (!user) return json({ error: "Please sign in again." }, 401);
        if (!env.AI) return json({ error: "Workers AI binding is not configured." }, 500);

        const body = await request.json();
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const safeMessages = messages
          .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
          .slice(-20)
          .map(m => ({ role: m.role, content: m.content.slice(0, 12000) }));

        if (!safeMessages.length) return json({ error: "Enter a message first." }, 400);

        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
          messages: [
            {
              role: "system",
              content: "You are Vyro, a friendly and helpful AI assistant. Be natural, clear, and useful. Match the user's tone respectfully. Use Markdown when helpful. If unsure, say so."
            },
            ...safeMessages
          ],
          max_tokens: 1200
        });

        const reply = result && (result.response || result.output_text);
        if (!reply) return json({ error: "The AI returned no text. Please try again." }, 502);
        return json({ reply });
      }

      if (url.pathname === "/api/image" && request.method === "POST") {
        const user = await verifyUser(request, env);
        if (!user) return json({ error: "Please sign in again." }, 401);
        if (!env.AI) return json({ error: "Workers AI binding is not configured." }, 500);

        const body = await request.json();
        const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 1500) : "";
        if (!prompt) return json({ error: "Enter an image description." }, 400);

        let result;
        try {
          result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
            prompt,
            steps: 4
          });
        } catch (error) {
          console.error("VYRO_IMAGE_ERROR:", error);
          return json({
            error: "Image generation failed.",
            details: error && error.message ? error.message : String(error)
          }, 502);
        }

        if (result && typeof result.image === "string") {
          return json({
            image: result.image.startsWith("data:")
              ? result.image
              : "data:image/png;base64," + result.image
          });
        }

        if (result instanceof Response) {
          const bytes = new Uint8Array(await result.arrayBuffer());
          return json({ image: "data:image/png;base64," + bytesToBase64(bytes) });
        }

        if (result instanceof ArrayBuffer) {
          return json({
            image: "data:image/png;base64," + bytesToBase64(new Uint8Array(result))
          });
        }

        if (ArrayBuffer.isView(result)) {
          const bytes = new Uint8Array(result.buffer, result.byteOffset, result.byteLength);
          return json({ image: "data:image/png;base64," + bytesToBase64(bytes) });
        }

        console.error("Unexpected image model result type:", typeof result);
        return json({
          error: "The image model returned an unexpected format.",
          details: "Check the Workers AI model response in Cloudflare logs."
        }, 502);
      }

      return json({ error: "Route not found." }, 404);
    } catch (error) {
      console.error("VYRO_WORKER_ERROR:", error);
      return json({
        error: error && error.message ? error.message : "Unexpected server error."
      }, 500);
    }
  }
};
