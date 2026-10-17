
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
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px system-ui,sans-serif}
button,input,textarea{font:inherit}
button{cursor:pointer;color:inherit}
.app{height:100dvh;display:flex;overflow:hidden}
.sidebar{width:255px;background:#15151a;border-right:1px solid var(--line);padding:14px;display:flex;flex-direction:column;gap:12px}
.brand{display:flex;align-items:center;gap:10px;font-size:19px;font-weight:800;padding:8px 3px}
.logo{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#c6b4ff,#7550e9);display:grid;place-items:center;font-weight:900}
button,.item{border:1px solid var(--line);background:transparent;border-radius:11px;padding:10px;text-align:left}
button:hover{background:#27242f}
.new,.nav{width:100%;color:var(--text)}
.nav.active{background:#302747}
.label{font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:12px}
.history{overflow:auto;display:grid;gap:5px}
.history button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ddd;border-color:transparent}
.bottom{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}
.profile{font-size:12px;color:var(--muted);overflow-wrap:anywhere}
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.top{height:58px;border-bottom:1px solid #292930;display:flex;align-items:center;padding:0 18px;gap:12px}
.top button{background:#19191f}
.topname{font-weight:700}
.content{flex:1;overflow:auto}
.welcome{min-height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:24px}
.welcome h1{font-size:clamp(28px,5vw,42px);line-height:1.15;letter-spacing:-1px}
.gradient{background:linear-gradient(90deg,#d6c8ff,#9b7bff);color:transparent;background-clip:text}
.sub{color:var(--muted)}
.suggestions{width:min(680px,100%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.suggestion{background:var(--panel);padding:15px;border-radius:14px;color:var(--text);border:1px solid var(--line)}
.suggestion strong,.suggestion span{display:block}
.suggestion span{font-size:12px;color:var(--muted);margin-top:5px}
.messages{width:min(800px,100%);margin:auto;padding:24px 18px;display:grid;gap:20px}
.message{display:flex;gap:12px;align-items:flex-start}
.message.user{flex-direction:row-reverse}
.avatar{flex-shrink:0;width:32px;height:32px;border-radius:10px;background:#302747;display:grid;place-items:center;font-weight:800}
.bubble{max-width:85%;background:var(--panel);border:1px solid #303039;padding:12px 15px;border-radius:15px;white-space:pre-wrap;overflow-wrap:anywhere}
.message.user .bubble{background:#292333}
.composer-wrap{padding:12px 15px max(12px,env(safe-area-inset-bottom))}
.composer{width:min(800px,100%);margin:auto;background:#1b1b22;border:1px solid #393943;border-radius:20px;padding:10px}
textarea{width:100%;resize:none;min-height:40px;max-height:170px;border:0;outline:0;background:transparent;color:white;padding:8px}
.actions{display:flex;align-items:center;gap:8px}
.actions button{border:0;color:#ccc;font-size:12px}
.send{margin-left:auto;background:var(--purple)!important;color:#17121f!important;font-weight:900;font-size:18px!important}
.note{text-align:center;font-size:10px;color:#777;padding-top:8px}
.view{display:none}.view.active{display:block}
.studio{max-width:800px;margin:auto;padding:25px}
.studio textarea{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;min-height:110px}
.primary{background:var(--purple);color:#17121f;border:0;border-radius:11px;padding:11px 15px;font-weight:750}
.overlay{position:fixed;inset:0;background:#000b;display:flex;align-items:center;justify-content:center;padding:18px;z-index:20}
.card{width:min(420px,100%);background:#19191f;border:1px solid #383440;border-radius:23px;padding:27px}
.card .brand{justify-content:center;margin-bottom:22px}
.card h2{text-align:center;margin-bottom:5px}
.card p{text-align:center;color:var(--muted);font-size:13px}
.card label{display:block;font-size:12px;margin:15px 0 7px}
.card input{width:100%;padding:12px;background:#101014;border:1px solid #41414b;border-radius:11px;color:white}
.card .primary{width:100%;margin-top:14px}
.status{text-align:center;color:#cbbdff;font-size:12px;min-height:20px;margin-top:12px}
@media(max-width:700px){
.sidebar{position:fixed;z-index:10;top:0;bottom:0;left:0;width:min(280px,85vw);transform:translateX(-110%);transition:transform .2s;box-shadow:0 0 50px #0008}
.sidebar.open{transform:translateX(0)}
.top{padding:0 10px}
.welcome{padding:20px 14px}
.suggestions{grid-template-columns:1fr}
.messages{padding:17px 10px}
.composer-wrap{padding:8px 9px max(10px,env(safe-area-inset-bottom))}
.studio{padding:20px 12px}
}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar" id="sidebar">
<div class="brand"><div class="logo">V</div> VYRO AI</div>
<button class="new" id="new">＋ New chat</button>
<button class="nav active" id="chatTab">◫ Chat</button>
<button class="nav" id="studioTab">✧ Image Studio</button>
<div class="label">RECENT CHATS</div>
<div class="history" id="history"></div>
<div class="bottom"><div class="profile" id="profile">Not signed in</div><button id="logout">↪ Sign out</button></div>
</aside>
<main class="main">
<header class="top"><button id="menu">☰</button><div class="topname" id="pageTitle">VYRO AI</div></header>
<section class="content">
<div class="view active" id="chatView">
<div class="welcome" id="welcome">
<div class="logo">V</div>
<h1>What can I help with<br><span class="gradient">today?</span></h1>
<p class="sub">Your ideas, powered by VYRO.</p>
<div class="suggestions">
<button class="suggestion" data-prompt="Explain a difficult topic in simple terms"><strong>▤ Learn something</strong><span>Get a simple explanation</span></button>
<button class="suggestion" data-prompt="Help me brainstorm creative ideas"><strong>✧ Brainstorm ideas</strong><span>Explore new possibilities</span></button>
<button class="suggestion" data-prompt="Help me write a message"><strong>✎ Write something</strong><span>Draft or improve text</span></button>
<button class="suggestion" data-prompt="Make a step-by-step learning plan"><strong>⌁ Make a plan</strong><span>Turn goals into steps</span></button>
</div>
</div>
<div class="messages" id="messages" hidden></div>
</div>
<div class="view" id="studioView"><div class="studio">
<h1 class="gradient">Image Studio</h1><p class="sub">Describe an image to generate.</p>
<textarea id="imagePrompt" placeholder="A futuristic city at sunset..."></textarea>
<p><button class="primary" id="generate">✧ Generate image</button></p>
<div class="status" id="imageStatus"></div><div id="imageResult"></div>
</div></div>
</section>
<div class="composer-wrap" id="composerWrap">
<div class="composer"><textarea id="prompt" rows="1" placeholder="Message VYRO AI..."></textarea>
<div class="actions"><button id="toStudio">▧ Image Studio</button><span class="sub">AI can make mistakes</span><button class="send" id="send">↑</button></div></div>
<div class="note">VYRO AI · Made to help you think, create, and explore</div>
</div>
</main>
</div>
<div class="overlay" id="login">
<div class="card"><div class="brand"><div class="logo">V</div> VYRO AI</div>
<h2>Welcome back</h2><p>Sign in securely with your email.</p>
<form id="loginForm"><label for="email">Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required><button class="primary" id="loginButton">Continue with email</button></form>
<div class="status" id="loginStatus"></div>
</div>
</div>
<script>
(()=>{
const $=id=>document.getElementById(id);
let sb,session=null,busy=false,chats=[],chatId=null;
const key='vyro_chat_history_v1';
function showStatus(t){$('loginStatus').textContent=t}
async function init(){
 try{
  const r=await fetch('/api/config');const c=await r.json();
  if(!c.supabaseUrl||!c.supabaseAnonKey)throw Error('Configure Supabase URL and publishable key in Worker variables.');
  sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);
  const {data}=await sb.auth.getSession();applySession(data.session);
  sb.auth.onAuthStateChange((event,s)=>applySession(s));
 }catch(e){showStatus(e.message)}
}
function applySession(s){
 session=s;$('login').style.display=s?'none':'flex';
 $('profile').textContent=s?.user?.email||'Not signed in';
 if(s){load();if(!chatId&&chats.length)chatId=chats[chats.length-1].id;render()}
}
function load(){try{chats=JSON.parse(localStorage.getItem(key)||'[]')}catch{chats=[]}renderHistory()}
function save(){try{localStorage.setItem(key,JSON.stringify(chats))}catch{}renderHistory()}
function renderHistory(){
 const el=$('history');el.replaceChildren();
 [...chats].reverse().forEach(c=>{const b=document.createElement('button');b.textContent=c.title||'New chat';b.onclick=()=>{chatId=c.id;render();closeMenu()};el.append(b)})
}
function current(){return chats.find(c=>c.id===chatId)}
function fresh(){chatId=String(Date.now());chats.push({id:chatId,title:'New chat',messages:[]});save();showChat();render();$('prompt').focus()}
function closeMenu(){$('sidebar').classList.remove('open')}
function showChat(){$('chatView').classList.add('active');$('studioView').classList.remove('active');$('composerWrap').style.display='block';$('pageTitle').textContent='VYRO AI';$('chatTab').classList.add('active');$('studioTab').classList.remove('active');closeMenu()}
function showStudio(){$('chatView').classList.remove('active');$('studioView').classList.add('active');$('composerWrap').style.display='none';$('pageTitle').textContent='Image Studio';$('studioTab').classList.add('active');$('chatTab').classList.remove('active');closeMenu()}
function render(){
 const c=current(),el=$('messages'),has=!!(c&&c.messages.length);
 $('welcome').style.display=has?'none':'flex';el.hidden=!has;el.replaceChildren();
 if(!has)return;
 c.messages.forEach(m=>{const row=document.createElement('div');row.className='message '+m.role;const av=document.createElement('div');av.className='avatar';av.textContent=m.role==='user'?'Y':'V';const b=document.createElement('div');b.className='bubble';b.textContent=m.content;row.append(av,b);el.append(row)});
 el.scrollTop=el.scrollHeight;
}
function add(role,content){
 let c=current();if(!c){fresh();c=current()}
 c.messages.push({role,content});
 if(role==='user'&&c.title==='New chat')c.title=content.slice(0,35);
 save();render();
}
async function send(prefill){
 if(busy)return;
 const text=(prefill??$('prompt').value).trim();if(!text)return;
 if(!session){$('login').style.display='flex';return}
 if(!current())fresh();
 $('prompt').value='';add('user',text);busy=true;$('send').disabled=true;
 const wait=document.createElement('div');wait.className='sub';wait.textContent='VYRO is thinking…';$('messages').append(wait);
 try{
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({messages:current().messages})});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');
  wait.remove();add('assistant',d.response||d.text||'No response received.');
 }catch(e){wait.remove();add('assistant','Error: '+e.message)}
 finally{busy=false;$('send').disabled=false}
}
async function generate(){
 const prompt=$('imagePrompt').value.trim();if(!prompt)return $('imageStatus').textContent='Describe your image first.';
 if(!session)return $('login').style.display='flex';
 $('generate').disabled=true;$('imageStatus').textContent='Generating…';$('imageResult').replaceChildren();
 try{
  const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({prompt})});
  if(!r.ok){const d=await r.json();throw Error(d.error||'Generation failed')}
  const url=URL.createObjectURL(await r.blob()),img=document.createElement('img');img.src=url;img.alt=prompt;img.style.cssText='display:block;width:100%;border-radius:14px;margin-top:18px';
  const a=document.createElement('a');a.href=url;a.download='vyro-image.png';a.textContent='Download image';a.className='primary';a.style.cssText='display:inline-block;margin-top:12px;text-decoration:none';
  $('imageResult').append(img,a);$('imageStatus').textContent='Image ready.';
 }catch(e){$('imageStatus').textContent=e.message}
 finally{$('generate').disabled=false}
}
$('loginForm').onsubmit=async e=>{
 e.preventDefault();$('loginButton').disabled=true;showStatus('Sending sign-in link…');
 try{const {error}=await sb.auth.signInWithOtp({email:$('email').value.trim(),options:{emailRedirectTo:location.origin}});if(error)throw error;showStatus('Check your email for the sign-in link.')}
 catch(e){showStatus(e.message)}
 finally{$('loginButton').disabled=false}
};
$('send').onclick=()=>send();
$('prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
$('new').onclick=fresh;$('menu').onclick=()=>$('sidebar').classList.toggle('open');
$('chatTab').onclick=showChat;$('studioTab').onclick=showStudio;$('toStudio').onclick=showStudio;$('generate').onclick=generate;
document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.prompt));
$('logout').onclick=async()=>{if(sb)await sb.auth.signOut();session=null;$('login').style.display='flex'};
init();
})();
</script>
</body>
</html>`;

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
  const r = await fetch(env.SUPABASE_URL.replace(/\/+$/, "") + "/auth/v1/user", {
    headers: { Authorization: "Bearer " + token, apikey: env.SUPABASE_ANON_KEY }
  });
  if (!r.ok) return null;
  return r.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": url.origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      }
    });

    if (url.pathname === "/" || url.pathname === "/index.html")
      return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });

    if (url.pathname === "/api/config")
      return json({ supabaseUrl: env.SUPABASE_URL || "", supabaseAnonKey: env.SUPABASE_ANON_KEY || "" });

    if (url.pathname === "/api/health")
      return json({ ok: true, service: "VYRO AI", ai: !!env.AI });

    if (url.pathname === "/api/chat" && request.method === "POST") {
      if (!await verifyUser(request, env)) return json({ error: "Please sign in again." }, 401);
      if (!env.AI) return json({ error: "Workers AI binding named AI is missing." }, 500);
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
      const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
      if (!messages.length) return json({ error: "Send a message first." }, 400);
      try {
        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
          messages: [
            { role: "system", content: "You are VYRO AI, a helpful and accurate assistant. Explain clearly and naturally." },
            ...messages.map(m => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: String(m.content || "").slice(0, 10000)
            }))
          ],
          max_tokens: 1200
        });
        return json({ response: result.response || "No response generated." });
      } catch {
        return json({ error: "AI request failed. Check Workers AI availability and limits." }, 502);
      }
    }

    if (url.pathname === "/api/image" && request.method === "POST") {
      if (!await verifyUser(request, env)) return json({ error: "Please sign in again." }, 401);
      if (!env.AI) return json({ error: "Workers AI binding named AI is missing." }, 500);
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
      const prompt = String(body.prompt || "").trim().slice(0, 1500);
      if (!prompt) return json({ error: "Describe your image first." }, 400);
      try {
        const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
          prompt,
          num_steps: 4
        });
        if (result instanceof Response)
          return new Response(result.body, { headers: { "Content-Type": result.headers.get("Content-Type") || "image/png" } });
        if (result.image) {
          const bytes = Uint8Array.from(atob(result.image), c => c.charCodeAt(0));
          return new Response(bytes, { headers: { "Content-Type": "image/png" } });
        }
        if (result instanceof ArrayBuffer || ArrayBuffer.isView(result))
          return new Response(result, { headers: { "Content-Type": "image/png" } });
        return json({ error: "Unexpected image model response." }, 502);
      } catch {
        return json({ error: "Image generation failed. Check Workers AI availability and limits." }, 502);
      }
    }

    return json({ error: "Not found." }, 404);
  }
};
