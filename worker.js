const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>VYRO</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
/* Minimal, neutral UI: square buttons, no glow, simple liquid-ish logo */
:root{
  --bg:#0f1113;
  --panel:#16171a;
  --muted:#9aa0a6;
  --text:#e7eaec;
  --accent:#6b5fb5;
  --muted-border:#2a2d31;
  --success:#2aa198;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  font-size:15px;
  line-height:1.4;
}
button,input,textarea{font:inherit}
button{cursor:pointer}
button:disabled{opacity:.6;cursor:not-allowed}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{
  width:260px;
  background:var(--panel);
  border-right:1px solid var(--muted-border);
  padding:16px;
  display:flex;
  flex-direction:column;
  gap:10px;
}
.brand{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:700;
  font-size:18px;
}
.logo{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  background:linear-gradient(180deg,#2b2650,#1f2030);
  border:1px solid var(--muted-border);
  /* keep square but slightly rounded internal orb for 'liquid' feel */
}
.logo .orb{
  width:70%;
  height:70%;
  background:linear-gradient(180deg,#8f7ed9,#6b5fb5);
  border-radius:40%;
  filter:contrast(.95);
}
.button{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px;
  border:1px solid var(--muted-border);
  background:transparent;
  color:var(--text);
  text-align:left;
  width:100%;
  box-shadow:none;
  border-radius:4px; /* square-ish */
}
.button:hover{background:#1b1c1f}
.button.primary{
  background:var(--accent);
  color:white;
  border-color:transparent;
}
.nav-list{display:flex;flex-direction:column;gap:6px}
.label{font-size:11px;color:var(--muted);letter-spacing:1.2px;margin-top:8px}
.history{overflow:auto;display:flex;flex-direction:column;gap:6px;padding-right:6px}
.history .item{padding:10px;border:1px solid var(--muted-border);background:transparent;border-radius:4px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bottom{margin-top:auto;display:flex;flex-direction:column;gap:8px}
.profile{font-size:12px;color:var(--muted);word-break:break-word}

/* main area */
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.top{height:60px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid var(--muted-border);background:transparent}
.content{flex:1;overflow:auto;padding:18px}
.views{display:grid;grid-template-columns:1fr 380px;gap:20px;align-items:start;max-width:1200px;margin:auto;width:100%}
.left-column{min-width:0}
.messages{background:var(--panel);border:1px solid var(--muted-border);padding:16px;border-radius:6px;min-height:300px;overflow:auto}
.message{padding:10px;border-radius:4px;margin-bottom:10px}
.message.user{text-align:right;background:#111214;border:1px solid #222427}
.message.assistant{text-align:left;background:#121316;border:1px solid #222427}
.composer{display:flex;gap:8px;margin-top:12px}
textarea{flex:1;padding:10px;border:1px solid var(--muted-border);background:transparent;color:var(--text);resize:none;border-radius:4px}
.send{width:70px;border:1px solid var(--muted-border);background:var(--accent);color:white;padding:10px;border-radius:4px}

/* studio */
.studio{background:var(--panel);border:1px solid var(--muted-border);padding:16px;border-radius:6px}
.studio textarea{min-height:120px}
#imageResult img{max-width:100%;display:block;border-radius:4px;border:1px solid var(--muted-border);margin-top:12px}
.image-actions{display:flex;gap:8px;margin-top:10px}

/* login overlay */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:18px;z-index:30}
.card{width:420px;background:#0d0e10;border:1px solid var(--muted-border);padding:20px;border-radius:8px}
.card h2{margin:0 0 6px}
.card p{color:var(--muted);margin:0 0 12px}
.card input{width:100%;padding:10px;border-radius:4px;border:1px solid var(--muted-border);background:transparent;color:var(--text)}
.card .primary{width:100%;padding:10px;background:var(--accent);color:#fff;border-radius:4px;border:0}

.small{font-size:12px;color:var(--muted);}

/* responsive */
@media(max-width:980px){
  .views{grid-template-columns:1fr;gap:12px}
  .sidebar{display:none}
  .top{padding:0 12px}
}
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <div class="logo" aria-hidden="true"><div class="orb"></div></div>
      VYRO
    </div>

    <button id="newChat" class="button">＋ New</button>

    <div class="label">MENUS</div>
    <div class="nav-list">
      <button id="chatTab" class="button">Chat</button>
      <button id="studioTab" class="button">Image Studio</button>
    </div>

    <div class="label">RECENT</div>
    <div class="history" id="history"></div>

    <div class="bottom">
      <div class="profile" id="profile">Not signed in</div>
      <button id="clearHistory" class="button">Clear</button>
      <button id="logout" class="button">Sign out</button>
    </div>
  </aside>

  <main class="main">
    <header class="top">
      <div style="font-weight:700">VYRO</div>
    </header>

    <div class="content">
      <div class="views">
        <div class="left-column">
          <div id="chatView" class="messages" aria-live="polite"></div>

          <div class="composer">
            <textarea id="prompt" placeholder="Message VYRO..." rows="2"></textarea>
            <button id="send" class="send">Send</button>
          </div>
        </div>

        <div class="studio" id="studioPanel" style="display:none">
          <h3>Image Studio</h3>
          <p class="small">Generate images from a prompt.</p>
          <textarea id="imagePrompt" placeholder="A cozy cabin by a lake at sunrise..." maxlength="1500"></textarea>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button id="generate" class="button primary">Generate</button>
            <button id="regen" class="button">Regenerate</button>
          </div>
          <div id="imageStatus" class="small" style="margin-top:8px;color:var(--muted)"></div>
          <div id="imageResult"></div>
        </div>
      </div>
    </div>
  </main>
</div>

<div id="login" class="overlay" style="display:flex">
  <div class="card">
    <h2 id="authTitle">Sign in</h2>
    <p id="authSubtitle">Sign in with email</p>
    <form id="loginForm">
      <input id="email" type="email" placeholder="you@example.com" required>
      <input id="password" type="password" placeholder="Password" style="margin-top:8px" required>
      <div style="margin-top:12px">
        <button id="loginButton" class="primary" type="submit">Sign in</button>
      </div>
    </form>
    <div id="loginStatus" class="small" style="margin-top:8px"></div>
  </div>
</div>

<script>
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let sb = null, session = null, busy = false, chats = [], chatId = null, authMode = 'signin', pendingVerificationEmail = '';

  const KEY = 'vyro_chat_history_v2';

  function showLogin(show){
    $('login').style.display = show ? 'flex' : 'none';
  }

  async function init(){
    try{
      const r = await fetch('/api/config', { cache: 'no-store' });
      const c = await r.json();
      if (!r.ok || !c.supabaseUrl || !c.supabaseAnonKey) throw Error('Missing Supabase config in worker.');
      if (!window.supabase) throw Error('Supabase client failed to load.');
      sb = window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      const { data } = await sb.auth.getSession();
      applySession(data.session);
      sb.auth.onAuthStateChange((event, s) => {
        applySession(s);
      });
    }catch(e){
      console.warn('init error', e);
      showLogin(true);
      $('loginStatus').textContent = e.message || 'Sign-in initialization failed.';
    }
  }

  function applySession(s){
    session = s;
    showLogin(!s);
    $('profile').textContent = s?.user?.email || 'Not signed in';
    if (s) loadHistory();
  }

  function loadHistory(){
    try{
      chats = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(chats)) chats = [];
    }catch{ chats = []; }
    renderHistory();
  }

  function saveHistory(){
    try{ localStorage.setItem(KEY, JSON.stringify(chats)); }catch(e){ console.warn(e); }
    renderHistory();
  }

  function renderHistory(){
    const el = $('history');
    el.replaceChildren();
    for (const c of chats.slice().reverse()){
      const b = document.createElement('button');
      b.className = 'item';
      b.textContent = c.title || 'Chat';
      b.onclick = () => { chatId = c.id; renderMessages(); };
      el.appendChild(b);
    }
  }

  function current(){ return chats.find(c => c.id === chatId); }

  function newChat(){
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2,7);
    chatId = id;
    chats.push({ id, title: 'New chat', messages: [] });
    saveHistory();
    renderMessages();
  }

  function renderMessages(){
    const view = $('chatView');
    view.replaceChildren();
    const c = current();
    if (!c) return;
    for (const m of c.messages){
      const d = document.createElement('div');
      d.className = 'message ' + (m.role === 'user' ? 'user' : 'assistant');
      d.textContent = m.content;
      view.appendChild(d);
    }
    view.scrollTop = view.scrollHeight;
  }

  function addMessage(role, content){
    let c = current();
    if (!c){
      newChat();
      c = current();
    }
    c.messages.push({ role, content });
    if (role === 'user' && c.title === 'New chat') c.title = content.slice(0,30);
    saveHistory();
    renderMessages();
  }

  function makeTyping(){
    const el = document.createElement('div');
    el.className = 'message assistant';
    el.textContent = 'VYRO is thinking…';
    return el;
  }

  async function send(prefill){
    if (busy) return;
    const text = (prefill ?? $('prompt').value).trim();
    if (!text) return;
    if (!session){ showLogin(true); return; }
    $('prompt').value = '';
    addMessage('user', text);
    busy = true;
    const waiting = makeTyping();
    $('chatView').appendChild(waiting);

    try{
      const r = await fetch('/api/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + session.access_token },
        body: JSON.stringify({ messages: current().messages })
      });
      const d = await r.json().catch(()=>({ error: 'Invalid response' }));
      if (!r.ok) throw Error(d.error || d.details || 'Chat request failed.');
      waiting.remove();
      addMessage('assistant', d.response || d.text || 'No response.');
    }catch(e){
      waiting.remove();
      addMessage('assistant', 'Failed to generate a response: ' + (e.message || 'unknown'));
      console.error('chat error', e);
    }finally{
      busy = false;
    }
  }

  function blobFromBase64(value){
    const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
    const mime = match ? match[1] : 'image/png';
    const raw = (match ? match[2] : value).replace(/\s/g,'');
    try{
      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes],{ type: mime });
    }catch(e){
      return null;
    }
  }

  async function generate(){
    const prompt = $('imagePrompt').value.trim();
    if (!prompt){ $('imageStatus').textContent = 'Please enter a prompt.'; return; }
    if (!session){ showLogin(true); return; }
    $('generate').disabled = true;
    $('imageStatus').textContent = 'Generating…';
    $('imageResult').replaceChildren();

    try{
      const r = await fetch('/api/image', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + session.access_token },
        body: JSON.stringify({ prompt })
      });

      const type = (r.headers.get('Content-Type') || '').toLowerCase();
      if (!r.ok){
        const d = type.includes('application/json') ? await r.json().catch(()=>({})) : { details: await r.text().catch(()=>'') };
        throw Error(d.error || d.details || 'Image endpoint error');
      }

      let blob;
      if (type.startsWith('image/')) {
        blob = await r.blob();
      } else if (type.includes('application/json')) {
        const d = await r.json();
        if (typeof d.image === 'string') blob = blobFromBase64(d.image);
        else if (typeof d.data === 'string') blob = blobFromBase64(d.data);
        else throw Error('No image in JSON response');
      } else {
        const text = await r.text();
        try{
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed.image === 'string') blob = blobFromBase64(parsed.image);
          else throw new Error('No image field in JSON');
        }catch{
          if (text.startsWith('data:image/')) blob = blobFromBase64(text);
          else {
            const trimmed = text.replace(/\s/g,'');
            if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 120) {
              blob = blobFromBase64('data:image/png;base64,' + trimmed);
            } else {
              throw Error('Unexpected response: ' + (type || 'unknown'));
            }
          }
        }
      }

      if (!blob || !blob.size) throw Error('Invalid image data returned.');
      const url = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = url;
      img.alt = prompt;
      img.onload = () => { $('imageStatus').textContent = 'Image ready.'; };
      img.onerror = () => { $('imageStatus').textContent = 'Could not display image.'; };
      const actions = document.createElement('div');
      actions.className = 'image-actions';
      const dl = document.createElement('a');
      dl.href = url;
      dl.download = 'vyro.png';
      dl.className = 'button primary';
      dl.textContent = 'Download';
      actions.appendChild(dl);
      $('imageResult').appendChild(img);
      $('imageResult').appendChild(actions);
    }catch(e){
      $('imageStatus').textContent = 'Generation failed: ' + (e.message || 'unknown');
      console.error('image ui error', e);
    }finally{
      $('generate').disabled = false;
    }
  }

  // event bindings
  $('send').onclick = () => send();
  $('prompt').onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); } };
  $('newChat').onclick = newChat;
  $('chatTab').onclick = () => { $('studioPanel').style.display = 'none'; };
  $('studioTab').onclick = () => { $('studioPanel').style.display = 'block'; };
  $('generate').onclick = generate;
  $('regen').onclick = generate;
  $('clearHistory').onclick = () => { if (confirm('Clear history?')){ chats=[]; chatId=null; saveHistory(); renderMessages(); } };
  $('logout').onclick = async () => {
    if (!sb) return;
    await sb.auth.signOut().catch(()=>{});
    session = null;
    showLogin(true);
    $('profile').textContent = 'Not signed in';
  };

  $('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    if (!sb) return $('loginStatus').textContent = 'Auth not ready';
    const email = $('email').value.trim();
    const password = $('password').value;
    $('loginButton').disabled = true;
    $('loginStatus').textContent = 'Signing in…';
    try{
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      applySession(data.session);
      $('login').style.display = 'none';
    }catch(err){
      $('loginStatus').textContent = err?.message || 'Sign in failed';
    }finally{
      $('loginButton').disabled = false;
    }
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
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

async function verifyUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;

  try {
    const r = await fetch(env.SUPABASE_URL.replace(/\/+$/, "") + "/auth/v1/user", {
      headers: {
        Authorization: "Bearer " + token,
        apikey: env.SUPABASE_ANON_KEY
      }
    });
    if (!r.ok) return null;
    const user = await r.json().catch(() => null);
    return user && user.id ? user : null;
  } catch (e) {
    console.error("VYRO AUTH ERROR:", e instanceof Error ? e.message : String(e));
    return null;
  }
}

function imageResponse(bytes, mime = "image/png") {
  let body = bytes;
  if (bytes instanceof Uint8Array) body = bytes.buffer;
  return new Response(body, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function pickImagePayload(result) {
  const fromBase64 = (b64) => {
    const match = b64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
    const mime = match ? match[1] : "image/png";
    const raw = match ? match[2] : b64;
    try {
      const bin = atob(raw.replace(/\s/g, ""));
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return { mime, bytes: arr };
    } catch {
      return null;
    }
  };

  if (result instanceof ArrayBuffer) return { mime: "image/png", bytes: new Uint8Array(result) };
  if (result instanceof Uint8Array) return { mime: "image/png", bytes: result };
  if (typeof result === "string") return fromBase64(result);

  if (result && typeof result === "object") {
    const keys = ["image", "data", "image_base64", "output", "result", "preview"];
    for (const k of keys) {
      if (!(k in result)) continue;
      const v = result[k];
      if (v instanceof ArrayBuffer) return { mime: "image/png", bytes: new Uint8Array(v) };
      if (v instanceof Uint8Array) return { mime: "image/png", bytes: v };
      if (typeof v === "string") {
        const p = fromBase64(v);
        if (p) return p;
      }
    }
  }

  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const started = Date.now();
    const requestId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(36).slice(2,8);

    const log = (event, details = {}) => {
      try {
        console.log(JSON.stringify({
          service: "VYRO",
          requestId,
          event,
          elapsedMs: Date.now() - started,
          details
        }));
      } catch (err) {
        console.log(JSON.stringify({
          service: "VYRO",
          requestId,
          event,
          elapsedMs: Date.now() - started,
          details: String(details),
          logError: String(err)
        }));
      }
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
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
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff"
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
        service: "VYRO",
        aiBound: !!env.AI,
        supabaseConfigured: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
        requestId
      });
    }

    // Chat endpoint
    if (url.pathname === "/api/chat" && request.method === "POST") {
      log("chat.request");
      try {
        const user = await verifyUser(request, env);
        if (!user) {
          log("chat.auth_failed");
          return json({ error: "Unauthorized", requestId }, 401);
        }
        if (!env.AI) {
          log("chat.no_ai");
          return json({ error: "AI binding missing", requestId }, 500);
        }

        let body;
        try { body = await request.json(); } catch { return json({ error: "Invalid JSON", requestId }, 400); }
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        if (!messages.length) return json({ error: "No messages", requestId }, 400);

        const clean = messages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || "").slice(0, 10000)
        }));

        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
          messages: [
            { role: "system", content: "You are VYRO, a helpful assistant. Be concise." },
            ...clean
          ],
          max_tokens: 1200
        });

        log("chat.success", { from: user.id });
        return json({ response: result?.response || result?.output || "No response", requestId });
      } catch (e) {
        const details = e instanceof Error ? e.message : String(e);
        console.error("chat.error", details);
        return json({ error: "Chat failed", details: details.slice(0, 500), requestId }, 502);
      }
    }

    // Image endpoint
    if (url.pathname === "/api/image" && request.method === "POST") {
      log("image.request");
      try {
        const user = await verifyUser(request, env);
        if (!user) {
          log("image.auth_failed");
          return json({ error: "Unauthorized", requestId }, 401);
        }
        if (!env.AI) {
          log("image.no_ai");
          return json({ error: "AI binding missing", requestId }, 500);
        }

        let body;
        try { body = await request.json(); } catch { return json({ error: "Invalid JSON", requestId }, 400); }

        const prompt = String(body.prompt || "").trim().slice(0, 1500);
        if (!prompt) return json({ error: "Empty prompt", requestId }, 400);

        log("image.model_call", { model: "@cf/black-forest-labs/flux-1-schnell", promptLength: prompt.length });

        const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
          prompt,
          steps: 4
        });

        // If the result is a Response (Workers AI sometimes returns Response)
        if (result instanceof Response) {
          if (!result.ok) {
            const detail = await result.text().catch(() => "");
            log("image.model_http_error", { status: result.status });
            return json({ error: "Model returned error", details: detail.slice(0, 1000), requestId }, 502);
          }
          const ct = (result.headers.get("Content-Type") || "").toLowerCase();
          if (ct.startsWith("image/")) {
            const buf = await result.arrayBuffer();
            return imageResponse(new Uint8Array(buf), ct);
          }
          if (ct.includes("application/json")) {
            const jsonBody = await result.json().catch(() => ({}));
            const payload = pickImagePayload(jsonBody);
            if (payload) return imageResponse(payload.bytes, payload.mime);
            return json({ error: "Model returned JSON but no image", details: jsonBody, requestId }, 502);
          }
          const raw = await result.text().catch(() => "");
          const payload = pickImagePayload(raw);
          if (payload) return imageResponse(payload.bytes, payload.mime);
          return json({ error: "Unexpected model response", details: raw.slice(0, 1000), requestId }, 502);
        }

        // result is not a Response
        const payload = pickImagePayload(result);
        if (payload) {
          return imageResponse(payload.bytes, payload.mime);
        }

        // fallback debug
        log("image.unexpected_result", {
          type: typeof result,
          constructor: result && result.constructor ? result.constructor.name : null,
          keys: result && typeof result === 'object' ? Object.keys(result).slice(0, 20) : null
        });

        return json({ error: "Unexpected image response shape", details: typeof result === 'string' ? result.slice(0, 1000) : null, requestId }, 502);
      } catch (e) {
        const details = e instanceof Error ? e.message : String(e);
        console.error("image.error", details);
        return json({ error: "Image generation failed", details: details.slice(0, 500), requestId }, 502);
      }
    }

    return json({ error: "Not found" }, 404);
  }
};
