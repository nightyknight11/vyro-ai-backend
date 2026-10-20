// ============================================================
// VYRO AI — Cloudflare Worker
// Firebase email/password auth + AI chat + image generation
// ============================================================
// Cloudflare setup:
// 1) Add FIREBASE_API_KEY as a Worker variable (your Firebase Web API key).
// 2) Bind Workers AI as `AI` in wrangler.toml.
// 3) Enable Email/Password in Firebase Authentication.
// 4) Add your Worker hostname to Firebase Authentication > Authorized domains.
//
// Product branding: VYRO AI / public engine label: Y10.
// The configured model below is the actual backend model; Y10 is the public
// product label. This code does not connect to the ChatGPT consumer app.

const FIREBASE_CONFIG = {
  authDomain: "vyro-ai-43783.firebaseapp.com",
  projectId: "vyro-ai-43783",
  storageBucket: "vyro-ai-43783.firebasestorage.app",
  messagingSenderId: "1040345798514",
  appId: "1:1040345798514:web:017fc23087e9a6e5d42feb"
};

// Change this to another model available to your Cloudflare account if needed.
const CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

const HTML = String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#08080b"><title>VYRO AI</title>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script><script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<style>
:root{color-scheme:dark;--bg:#08080b;--panel:#101015;--panel2:#17171e;--line:#2b2b35;--text:#f4f3fa;--muted:#9997a8;--accent:#7664cb}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px system-ui,Arial,sans-serif}button,input,textarea{font:inherit;border-radius:0!important}button{cursor:pointer}button:disabled{opacity:.5;cursor:wait}.app{height:100dvh;display:flex;overflow:hidden}.side{width:235px;flex-shrink:0;background:var(--panel);border-right:1px solid var(--line);padding:15px;display:flex;flex-direction:column;gap:8px}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:850;letter-spacing:2px;padding-bottom:16px}.logo{width:38px;height:38px;border:1px solid #514576;background:#171520;display:grid;place-items:center}.logo svg{width:27px;height:27px}.btn{padding:11px 12px;background:transparent;color:var(--text);border:1px solid var(--line);text-align:left}.btn:hover{background:var(--panel2)}.primary{background:var(--accent);border-color:var(--accent);color:white}.section{font-size:10px;color:var(--muted);letter-spacing:1.5px;margin-top:14px}.history{display:flex;flex-direction:column;gap:5px;overflow:auto}.hist{padding:9px;border:1px solid transparent;background:transparent;color:var(--muted);text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hist.active,.hist:hover{background:var(--panel2);border-color:var(--line);color:var(--text)}.bottom{margin-top:auto;display:flex;flex-direction:column;gap:7px}.muted{color:var(--muted);font-size:12px;line-height:1.7;overflow-wrap:anywhere}.main{flex:1;min-width:0;display:flex;flex-direction:column}.top{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid var(--line)}.content{padding:18px;overflow:auto;flex:1}.work{max-width:900px;margin:auto}.welcome{padding:30px 0 20px}.welcome h1{font-size:clamp(28px,5vw,40px);margin:0 0 8px;letter-spacing:-1px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:20px 0}.quick{padding:14px;background:var(--panel);border:1px solid var(--line);color:var(--text);text-align:left}.quick strong,.quick span{display:block}.quick span{font-size:12px;color:var(--muted);margin-top:5px}.messages{display:flex;flex-direction:column;gap:10px;padding-bottom:14px}.msg{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;padding:14px;border:1px solid var(--line);background:var(--panel)}.msg.user{background:#17151f}.tag{font-size:10px;color:var(--muted);letter-spacing:1px;margin-bottom:6px}.composer{display:flex;gap:7px;position:sticky;bottom:0;background:var(--bg);padding:8px 0}textarea,input{width:100%;padding:12px;background:#101014;border:1px solid var(--line);color:var(--text);outline:none}textarea{resize:vertical;min-height:48px;max-height:220px}.send{padding:10px 16px;border:1px solid var(--accent);background:var(--accent);color:white}.panel{padding:18px;background:var(--panel);border:1px solid var(--line);margin-bottom:15px}.panel h2{margin-top:0}.hidden{display:none!important}.overlay{position:fixed;z-index:5;inset:0;background:#07070b;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.card{width:420px;max-width:100%;padding:24px;background:var(--panel);border:1px solid #35313f}.card h1{margin:18px 0 8px}.card input{margin:5px 0}.authbtn{width:100%;padding:12px;margin-top:8px;background:var(--accent);border:1px solid var(--accent);color:white}.card .btn{width:100%;text-align:center;margin-top:8px}.status{margin-top:10px;font-size:12px;line-height:1.6;overflow-wrap:anywhere}.err{color:#ff929b}.ok{color:#91d8b3}.image-result img{display:block;width:100%;height:auto;margin-top:12px;border:1px solid var(--line)}@media(max-width:720px){.side{display:none}.content{padding:13px}.top{padding:0 13px}}@media(max-width:380px){.grid{grid-template-columns:1fr}}
</style></head><body>
<div class="app"><aside class="side"><div class="brand"><div class="logo"><svg viewBox="0 0 32 32" fill="none"><path d="M5 7L13 25L21 7M18 25L27 7" stroke="#c4b7ff" stroke-width="3.2" stroke-linecap="square"/></svg></div>VYRO</div><button class="btn primary" id="new">＋ New chat</button><div class="section">WORKSPACE</div><button class="btn" id="chatTab">▤ &nbsp; Chat</button><button class="btn" id="studioTab">▧ &nbsp; Image Studio</button><div class="section">RECENT CHATS</div><div class="history" id="history"></div><div class="bottom"><div class="muted" id="profile">Not signed in</div><button class="btn" id="clear">Clear chat history</button><button class="btn" id="logout">Sign out</button></div></aside>
<main class="main"><header class="top"><div style="display:flex;align-items:center;gap:9px"><div class="logo" style="width:28px;height:28px"><svg viewBox="0 0 32 32" fill="none"><path d="M5 7L13 25L21 7M18 25L27 7" stroke="#c4b7ff" stroke-width="3.2" stroke-linecap="square"/></svg></div><b>VYRO / Y10</b></div><div class="muted" id="topStatus">Ready</div></header><div class="content"><div class="work">
<section id="chatView"><div class="welcome" id="welcome"><h1>What can I help with?</h1><p class="muted">Welcome to VYRO. Ask questions, explore ideas, write, learn, and create.</p><div class="grid"><button class="quick" data-p="Explain a difficult topic in simple words."><strong>Learn</strong><span>Understand something new</span></button><button class="quick" data-p="Help me brainstorm creative ideas."><strong>Brainstorm</strong><span>Explore possibilities</span></button><button class="quick" data-p="Help me write and improve a piece of writing."><strong>Write</strong><span>Draft, edit, improve</span></button><button class="quick" data-p="Help me make a clear step-by-step plan."><strong>Plan</strong><span>Organize next steps</span></button></div></div><div class="messages" id="messages"></div><div class="composer"><textarea id="prompt" rows="1" maxlength="10000" placeholder="Message VYRO..."></textarea><button class="send" id="send">Send</button></div><p class="muted" style="text-align:center">VYRO can make mistakes. Check important information.</p></section>
<section id="studioView" class="hidden"><div class="welcome"><h1>Image Studio</h1><p class="muted">Turn a text prompt into an image.</p></div><div class="panel"><h2>Describe your image</h2><textarea id="imagePrompt" maxlength="1500" placeholder="Describe the image you want to create..."></textarea><button class="btn primary" id="generate" style="margin-top:10px">Generate image</button><button class="btn" id="regen" style="margin:10px 0 0 8px">Regenerate</button><div class="status" id="imageStatus"></div><div class="image-result" id="imageResult"></div></div></section>
</div></div></main></div>
<div class="overlay" id="login"><div class="card"><div class="brand"><div class="logo"><svg viewBox="0 0 32 32" fill="none"><path d="M5 7L13 25L21 7M18 25L27 7" stroke="#c4b7ff" stroke-width="3.2" stroke-linecap="square"/></svg></div>VYRO AI</div><h1 id="authTitle">Sign in</h1><p class="muted" id="authSub">Sign in to continue.</p><form id="authForm"><input id="email" type="email" autocomplete="email" placeholder="Email address" required><input id="password" type="password" autocomplete="current-password" minlength="6" placeholder="Password (at least 6 characters)" required><button class="authbtn" id="authSubmit">Sign in</button></form><button class="btn" id="switch">Create an account</button><button class="btn" id="resend">Resend verification email</button><div class="status" id="authStatus"></div></div></div>
<script>
(()=>{'use strict';const $=id=>document.getElementById(id);let auth,user=null,mode='signin',busy=false,chats=[],chatId=null,lastImage='';const KEY='vyro_chat_history_v1';
function authStatus(s,type=''){ $('authStatus').textContent=s;$('authStatus').className='status '+(type==='error'?'err':type==='ok'?'ok':'');}function status(s,type=''){ $('imageStatus').textContent=s;$('imageStatus').className='status '+(type==='error'?'err':type==='ok'?'ok':'');}function showLogin(v){$('login').classList.toggle('hidden',!v);}function setMode(m){mode=m;const up=m==='signup';$('authTitle').textContent=up?'Create your account':'Sign in';$('authSub').textContent=up?'Create a VYRO account with your email.':'Sign in to continue to VYRO.';$('authSubmit').textContent=up?'Create account':'Sign in';$('switch').textContent=up?'Already have an account? Sign in':'Create an account';$('password').autocomplete=up?'new-password':'current-password';authStatus('');}
function loadChats(){try{chats=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(chats))chats=[];}catch{chats=[];}renderHistory();}function saveChats(){localStorage.setItem(KEY,JSON.stringify(chats.slice(0,40)));renderHistory();}function current(){return chats.find(c=>c.id===chatId);}function newChat(){const c={id:Date.now().toString(),title:'New chat',messages:[]};chats.unshift(c);chatId=c.id;saveChats();renderMessages();$('welcome').classList.remove('hidden');$('prompt').focus();}
function renderHistory(){const h=$('history');h.replaceChildren();chats.forEach(c=>{const b=document.createElement('button');b.className='hist'+(c.id===chatId?' active':'');b.textContent=c.title||'New chat';b.onclick=()=>{chatId=c.id;renderHistory();renderMessages();};h.appendChild(b);});}function addMsg(role,text){const c=current();if(!c)return;c.messages.push({role,text});if(role==='user'&&c.title==='New chat')c.title=text.slice(0,34)||'New chat';saveChats();renderMessages();}
function renderMessages(){const root=$('messages');root.replaceChildren();const c=current();$('welcome').classList.toggle('hidden',!!(c&&c.messages.length));if(!c)return;c.messages.forEach(m=>{const d=document.createElement('div');d.className='msg '+(m.role==='user'?'user':'');const tag=document.createElement('div');tag.className='tag';tag.textContent=m.role==='user'?'YOU':'VYRO · Y10';const body=document.createElement('div');body.textContent=m.text;d.append(tag,body);root.appendChild(d);});root.scrollTop=root.scrollHeight;}
async function api(path,body){const token=await user.getIdToken();const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(body)});const data=await res.json().catch(()=>({error:'Server returned an invalid response.'}));if(!res.ok)throw new Error(data.error||'Request failed ('+res.status+').');return data;}
async function send(){const text=$('prompt').value.trim();if(!text||busy||!user)return;if(!chatId)newChat();$('prompt').value='';addMsg('user',text);busy=true;$('send').disabled=true;$('topStatus').textContent='Y10 is thinking…';try{const c=current();const history=c.messages.slice(-16).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));const result=await api('/api/chat',{messages:history});addMsg('assistant',result.reply||'I could not generate a reply.');}catch(e){addMsg('assistant','Sorry, the request failed: '+e.message);}finally{busy=false;$('send').disabled=false;$('topStatus').textContent='Ready';$('prompt').focus();}}
async function generate(){const prompt=$('imagePrompt').value.trim()||lastImage;if(!prompt||busy||!user){status('Enter a prompt and sign in first.','error');return;}lastImage=prompt;busy=true;$('generate').disabled=true;status('Creating your image…');$('imageResult').replaceChildren();try{const result=await api('/api/image',{prompt});if(!result.image)throw new Error('The image service returned no image.');const img=document.createElement('img');img.alt='Image generated by VYRO';img.src=result.image;$('imageResult').appendChild(img);status('Image created.','ok');}catch(e){status('Image generation failed: '+e.message,'error');}finally{busy=false;$('generate').disabled=false;}}
$('authForm').addEventListener('submit',async e=>{e.preventDefault();if(!auth)return;const email=$('email').value.trim(),password=$('password').value;authStatus('Please wait…');$('authSubmit').disabled=true;try{if(mode==='signup'){const cred=await auth.createUserWithEmailAndPassword(email,password);await cred.user.sendEmailVerification();await auth.signOut();authStatus('Account created. Check your inbox and spam folder, verify your email, then sign in.','ok');setMode('signin');$('email').value=email;}else{const cred=await auth.signInWithEmailAndPassword(email,password);if(!cred.user.emailVerified){await auth.signOut();authStatus('Please verify your email before signing in.','error');return;}user=cred.user;showLogin(false);$('profile').textContent=user.email||'Signed in';loadChats();if(!chatId&&chats.length)chatId=chats[0].id;renderHistory();renderMessages();}}catch(err){authStatus(err.message||'Authentication failed.','error');}finally{$('authSubmit').disabled=false;}});
$('switch').onclick=()=>setMode(mode==='signin'?'signup':'signin');$('resend').onclick=async()=>{try{const email=$('email').value.trim(),password=$('password').value;if(!email||!password)throw new Error('Enter your email and password first.');const cred=await auth.signInWithEmailAndPassword(email,password);if(cred.user.emailVerified){await auth.signOut();throw new Error('This email is already verified. You can sign in.');}await cred.user.sendEmailVerification();await auth.signOut();authStatus('Verification email sent. Check your inbox and spam folder.','ok');}catch(e){authStatus(e.message||'Could not resend verification email.','error');}};
$('send').onclick=send;$('prompt').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});$('new').onclick=newChat;$('chatTab').onclick=()=>{$('chatView').classList.remove('hidden');$('studioView').classList.add('hidden');};$('studioTab').onclick=()=>{$('studioView').classList.remove('hidden');$('chatView').classList.add('hidden');};$('generate').onclick=generate;$('regen').onclick=generate;$('clear').onclick=()=>{if(confirm('Clear all locally saved chat history?')){chats=[];chatId=null;saveChats();renderMessages();}};$('logout').onclick=async()=>{if(auth)await auth.signOut();user=null;showLogin(true);$('profile').textContent='Not signed in';};document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{$('prompt').value=b.dataset.p;send();});
async function boot(){try{const r=await fetch('/api/config');const cfg=await r.json();if(!cfg.firebase||!cfg.firebase.apiKey)throw new Error('Set FIREBASE_API_KEY in Cloudflare Worker variables, then reload.');firebase.initializeApp(cfg.firebase);auth=firebase.auth();auth.onAuthStateChanged(async u=>{user=u;if(u&&u.emailVerified){showLogin(false);$('profile').textContent=u.email||'Signed in';loadChats();if(!chatId&&chats.length)chatId=chats[0].id;renderHistory();renderMessages();}else{if(u)await auth.signOut();showLogin(true);}});}catch(e){showLogin(true);authStatus('Firebase setup: '+e.message,'error');}}boot();
})();
</script></body></html>`;

function json(data, status = 200, request) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (request) Object.assign(headers, corsHeaders(request));
  return new Response(JSON.stringify(data), { status, headers });
}
function corsHeaders(request) {
  return { "Access-Control-Allow-Origin": request.headers.get("Origin") || "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Vary": "Origin" };
}
async function verifyFirebaseToken(request, env) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error("Please sign in again.");
  const apiKey = env.FIREBASE_API_KEY;
  if (!apiKey) throw new Error("FIREBASE_API_KEY is not set in Cloudflare Worker variables.");
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: match[1] }) });
  const data = await response.json().catch(() => ({}));
  const account = data.users && data.users[0];
  if (!response.ok || !account) throw new Error("Your session is invalid. Sign in again.");
  if (!account.emailVerified) throw new Error("Verify your email before using VYRO.");
  return account;
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });
    if (url.pathname === "/api/health") return json({ ok: true, service: "VYRO AI", engine: "Y10", ai: !!env.AI }, 200, request);
    if (url.pathname === "/" || url.pathname === "/index.html") return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    if (url.pathname === "/api/config") return json({ ok: true, firebase: { ...FIREBASE_CONFIG, apiKey: env.FIREBASE_API_KEY || "" }, engine: "Y10" }, 200, request);
    if (request.method !== "POST") return json({ error: "Not found." }, 404, request);
    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON request." }, 400, request); }
    try {
      await verifyFirebaseToken(request, env);
      if (url.pathname === "/api/chat") {
        if (!env.AI) return json({ error: "Cloudflare Workers AI binding named AI is missing." }, 500, request);
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        const safeMessages = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 10000) }));
        safeMessages.unshift({ role: "system", content: "You are VYRO, a capable, thoughtful, high-quality AI assistant. Your product/engine label is Y10. If asked what your engine is called, say Y10; never falsely claim that you are ChatGPT or that you use a model you do not use. Be direct, intelligent, warm, and useful. Answer the actual question first; do not pad answers with generic filler, apologies, or vague offers. Use your knowledge to make a reasonable attempt instead of saying you do not have information whenever a question is unusual. For ambiguous questions, briefly explain the ambiguity and give the best-supported answer or examples. Never invent facts: clearly distinguish established facts, likely answers, and uncertainty. For language questions, account for spelling, dialect, dictionary conventions, and whether the user means common usage or a technical definition. For Urdu questions, you may answer in simple English unless the user writes in Urdu; if helpful, include Urdu script and a transliteration/meaning. Use clear structure and an appropriate amount of detail; simple questions usually need a short answer, while complex questions deserve step-by-step reasoning and examples. Follow the user's requested language and level. For coding tasks, provide complete, working solutions when enough context is available and explain any required setup honestly. Do not claim to browse the live internet or access information you do not have. If you are unsure, say exactly what is uncertain and still provide the most useful supported answer." });
        const result = await env.AI.run(CHAT_MODEL, { messages: safeMessages, max_tokens: 1800, temperature: 0.55, top_p: 0.9, repetition_penalty: 1.08 });
        const reply = result.response || result.result || result.output_text;
        if (!reply) return json({ error: "The AI model returned an empty response." }, 502, request);
        return json({ reply: String(reply) }, 200, request);
      }
      if (url.pathname === "/api/image") {
        if (!env.AI) return json({ error: "Cloudflare Workers AI binding named AI is missing." }, 500, request);
        const prompt = String(body.prompt || "").trim().slice(0, 1500);
        if (!prompt) return json({ error: "Please enter an image prompt." }, 400, request);
        const result = await env.AI.run(IMAGE_MODEL, { prompt, num_steps: 4 });
        let imageData = result && (result.image || result.data);
        if (Array.isArray(imageData)) imageData = imageData[0];
        if (typeof imageData === "string") return json({ image: imageData.startsWith("data:") ? imageData : "data:image/png;base64," + imageData }, 200, request);
        if (imageData instanceof Uint8Array || imageData instanceof ArrayBuffer) {
          const bytes = imageData instanceof Uint8Array ? imageData : new Uint8Array(imageData);
          let binary = "";
          for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
          return json({ image: "data:image/png;base64," + btoa(binary) }, 200, request);
        }
        return json({ error: "The image model returned an unsupported image format." }, 502, request);
      }
      return json({ error: "Not found." }, 404, request);
    } catch (error) {
      const message = error && error.message ? error.message : "Request failed.";
      const status = /sign in|session|verify|FIREBASE_API_KEY/i.test(message) ? 401 : 500;
      return json({ error: message }, status, request);
    }
  }
};
