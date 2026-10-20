
/*
 * VYRO AI — Complete Cloudflare Worker
 * Product: VYRO AI
 * Public engine label: Y10
 *
 * Required Cloudflare setup:
 * 1. Bind Workers AI with the binding name AI.
 * 2. Add FIREBASE_API_KEY as a Worker variable.
 * 3. Enable Email/Password in Firebase Authentication.
 * 4. Add your Worker hostname to Firebase Authorized domains.
 *
 * The Firebase web API key is a public client configuration value.
 * Never put service-account private keys or other secrets in frontend code.
 */

const FIREBASE_CONFIG = {
  authDomain: "vyro-ai-43783.firebaseapp.com",
  projectId: "vyro-ai-43783",
  storageBucket: "vyro-ai-43783.firebasestorage.app",
  messagingSenderId: "1040345798514",
  appId: "1:1040345798514:web:017fc23087e9a6e5d42feb"
};

const CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const VISION_MODEL = "@cf/google/gemma-4-26b-a4b-it";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_PROMPT_LENGTH = 30000;

function json(data, status = 200, request) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };

  const origin = request?.headers.get("Origin");
  if (origin && allowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  }

  return new Response(JSON.stringify(data), { status, headers });
}

function allowedOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.endsWith(".workers.dev") ||
      url.hostname === "vyro-ai-43783.web.app" ||
      url.hostname === "vyro-ai-43783.firebaseapp.com"
    );
  } catch {
    return false;
  }
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
}

async function readJson(request) {
  const declaredLength = Number(
    request.headers.get("Content-Length") || 0
  );

  if (declaredLength > MAX_BODY_BYTES) {
    throw new Error("Request is too large. Please attach smaller files.");
  }

  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    throw new Error("Request is too large. Please attach smaller files.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON request.");
  }
}

async function verifyFirebaseUser(request, env) {
  const apiKey = env.FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Firebase is not configured. Set FIREBASE_API_KEY in Cloudflare Worker variables."
    );
  }

  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    throw new Error("Please sign in to VYRO AI.");
  }

  const idToken = match[1];

  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
      encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    }
  );

  if (!response.ok) {
    throw new Error("Your session is invalid or expired. Please sign in again.");
  }

  const result = await response.json();
  const account = result.users?.[0];

  if (!account || account.disabled) {
    throw new Error("This Firebase account is unavailable.");
  }

  if (!account.emailVerified) {
    throw new Error("Please verify your email address before using VYRO AI.");
  }

  return account;
}

function systemPrompt() {
  return [
    "You are VYRO, a helpful AI assistant.",
    "Your public engine label is Y10.",
    "If asked what product you are, say VYRO AI.",
    "If asked for the public engine label, say Y10.",
    "Do not claim that Y10 is the underlying model name.",
    "Be honest about your capabilities and limitations.",
    "For coding tasks, provide complete working examples where practical.",
    "Use fenced Markdown code blocks with language labels for code.",
    "For spreadsheet or dataset analysis, calculate from supplied data.",
    "Explain the method, note missing values and data limitations, and never invent results.",
    "For screenshots, describe only what is visible and distinguish uncertainty from fact.",
    "Never claim to have deployed, tested, or changed external services unless that actually happened."
  ].join(" ");
}

function normaliseMessages(messages, prompt, imageData) {
  const history = Array.isArray(messages) ? messages.slice(-20) : [];

  const cleaned = history
    .filter(
      message =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
    )
    .map(message => ({
      role: message.role,
      content: message.content.slice(0, 12000)
    }));

  const lastUserIndex = cleaned.map(m => m.role).lastIndexOf("user");

  if (lastUserIndex >= 0 && cleaned[lastUserIndex].content === prompt) {
    cleaned.splice(lastUserIndex, 1);
  }

  let content = prompt;

  if (imageData) {
    content = [
      { type: "text", text: prompt || "Describe this image." },
      {
        type: "image_url",
        image_url: { url: imageData }
      }
    ];
  }

  cleaned.push({ role: "user", content });
  return cleaned;
}

async function handleChat(request, env) {
  await verifyFirebaseUser(request, env);

  if (!env.AI) {
    return json(
      { error: "Workers AI is not bound. Add an AI binding in your Cloudflare Worker settings." },
      500,
      request
    );
  }

  const body = await readJson(request);
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return json({ error: "Enter a message first." }, 400, request);
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return json({ error: "Your message is too long. Shorten it and try again." }, 400, request);
  }

  let imageData = null;

  if (typeof body.image === "string" && body.image) {
    if (body.image.length > 4 * 1024 * 1024) {
      return json({ error: "That image is too large. Please resize it and try again." }, 413, request);
    }

    if (!/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(body.image)) {
      return json({ error: "Unsupported image format. Use PNG, JPEG, or WebP." }, 400, request);
    }

    imageData = body.image;
  }

  const messages = normaliseMessages(body.messages, prompt, imageData);

  try {
    const model = imageData ? VISION_MODEL : CHAT_MODEL;

    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: systemPrompt() },
        ...messages
      ],
      max_tokens: 4096,
      temperature: 0.6
    });

    const answer =
      result?.response ||
      result?.result?.response ||
      result?.choices?.[0]?.message?.content ||
      result?.output_text ||
      "";

    if (!answer) {
      return json(
        { error: "The AI model returned an empty response. Try again." },
        502,
        request
      );
    }

    return json(
      {
        answer: typeof answer === "string" ? answer : JSON.stringify(answer),
        product: "VYRO AI",
        engine: "Y10"
      },
      200,
      request
    );
  } catch (error) {
    return json(
      {
        error:
          "The AI request failed. Check that the selected model is available to your Cloudflare Workers AI account."
      },
      502,
      request
    );
  }
}

async function handleImage(request, env) {
  await verifyFirebaseUser(request, env);

  if (!env.AI) {
    return json({ error: "Workers AI is not configured." }, 500, request);
  }

  const body = await readJson(request);
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return json({ error: "Describe the image you want to generate." }, 400, request);
  }

  if (prompt.length > 4000) {
    return json({ error: "The image prompt is too long." }, 400, request);
  }

  try {
    const result = await env.AI.run(IMAGE_MODEL, {
      prompt,
      num_steps: 4
    });

    if (result?.image) {
      return json(
        { image: "data:image/png;base64," + result.image },
        200,
        request
      );
    }

    if (result instanceof ReadableStream) {
      return new Response(result, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      });
    }

    return json(
      { error: "The image model returned an unsupported response format." },
      502,
      request
    );
  } catch {
    return json(
      { error: "Image generation failed. Check the model availability in Cloudflare Workers AI." },
      502,
      request
    );
  }
}

function appPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#101018">
<title>VYRO AI</title>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
:root{color-scheme:dark;--bg:#101018;--panel:#191923;--panel2:#222231;--text:#f6f4ff;--muted:#aaa7bd;--accent:#a996ff;--line:#353348}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}
button,input,textarea{font:inherit}
button{cursor:pointer;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--text);padding:10px 14px}
button.primary{background:var(--accent);color:#151220;border-color:transparent;font-weight:750}
button:disabled{opacity:.5;cursor:wait}
input,textarea{width:100%;background:#11111a;color:var(--text);border:1px solid var(--line);border-radius:10px;padding:12px}
.shell{max-width:1100px;margin:auto;padding:20px;min-height:100vh;display:flex;flex-direction:column;gap:16px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line);padding-bottom:15px}
.brand{display:flex;align-items:center;gap:10px;font-weight:850;font-size:20px;letter-spacing:.5px}
.logo{width:38px;height:38px;border-radius:12px;background:#29243e;display:grid;place-items:center;color:var(--accent);font-weight:900}
.logo svg{width:27px;height:27px}
.sub{font-size:12px;color:var(--muted)}
main{flex:1;display:flex;flex-direction:column;gap:15px}
#auth{max-width:440px;margin:8vh auto;width:100%;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:24px}
#auth h2{margin-top:0}
#auth input{margin:7px 0}
#auth button{margin-top:8px}
#status{color:var(--muted);font-size:13px;white-space:pre-wrap}
#messages{display:flex;flex-direction:column;gap:14px}
.msg{background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:15px;overflow-wrap:anywhere}
.msg.user{background:#211f31}
.tag{font-size:11px;font-weight:800;letter-spacing:1px;color:var(--accent);margin-bottom:8px}
.msg p{margin:6px 0;white-space:pre-wrap}
.msg pre{overflow:auto;background:#0b0b12;padding:14px;border-radius:0 0 10px 10px;margin:0}
.msg code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px}
.code-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:7px 11px;background:#2a2937;color:#d8d3ed;border-radius:10px 10px 0 0;font-size:12px}
.copy{padding:4px 9px;font-size:12px}
.composer{position:sticky;bottom:0;background:var(--bg);padding:10px 0;display:grid;gap:10px}
.composer textarea{resize:vertical;min-height:90px;max-height:260px}
.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.file-list{color:var(--muted);font-size:12px;white-space:pre-wrap}
#preview img{max-width:100%;border-radius:12px;border:1px solid var(--line)}
.hidden{display:none!important}
a{color:var(--accent)}
@media(max-width:600px){.shell{padding:12px}.msg{padding:11px}header{align-items:flex-start}}
</style>
</head>
<body>
<div class="shell">
<header>
  <div class="brand">
    <div class="logo">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M5 7L13 25L21 7M18 25L27 7" stroke="#c4b7ff" stroke-width="3.2" stroke-linecap="square"/>
      </svg>
    </div>
    <div>VYRO AI<div class="sub">Powered by the Y10 experience</div></div>
  </div>
  <button id="signout" class="hidden">Sign out</button>
</header>

<section id="auth">
  <h2>Welcome to VYRO</h2>
  <p class="sub">Sign in or create an account to start chatting.</p>
  <input id="email" type="email" autocomplete="email" placeholder="Email address">
  <input id="password" type="password" autocomplete="current-password" placeholder="Password">
  <div class="actions">
    <button class="primary" id="login">Sign in</button>
    <button id="register">Create account</button>
  </div>
  <button id="reset">Reset password</button>
  <p id="authstatus" role="status"></p>
</section>

<main id="chat" class="hidden">
  <div class="actions">
    <button id="newchat">New chat</button>
    <button id="pickfiles">Attach files</button>
    <button id="imageMode">Generate image</button>
    <input id="files" type="file" multiple accept="image/*,.pdf,.docx,.xlsx,.xls,.ods,.csv,.tsv,.txt,.md,.json,.js,.ts,.html,.css,.py,.java,.xml,.yaml,.yml,.toml,.sql,.log" hidden>
  </div>
  <div id="filelist" class="file-list"></div>
  <div id="messages">
    <div class="msg"><div class="tag">VYRO · Y10</div>Hey! I'm VYRO. Ask a question, attach a screenshot, or upload a supported document.</div>
  </div>
  <div id="preview"></div>
  <div class="composer">
    <textarea id="prompt" placeholder="Message VYRO AI..." maxlength="30000"></textarea>
    <div class="actions">
      <button class="primary" id="send">Send message</button>
      <span id="status" role="status"></span>
    </div>
  </div>
</main>
</div>

<script>
(() => {
  const $ = id => document.getElementById(id);
  let auth = null;
  let user = null;
  let history = [];
  let attachments = [];
  let generatingImage = false;

  function status(message, error=false) {
    $('status').textContent = message || '';
    $('status').style.color = error ? '#ff9292' : '';
  }

  function authStatus(message, error=false) {
    $('authstatus').textContent = message || '';
    $('authstatus').style.color = error ? '#ff9292' : '';
  }

  async function api(path, data) {
    if (!user) throw new Error('Please sign in first.');
    const token = await user.getIdToken();
    const response = await fetch(path, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+token
      },
      body:JSON.stringify(data)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Request failed.');
    return result;
  }

  function renderText(container, text) {
    const fence = String.fromCharCode(96).repeat(3);
    const regex = new RegExp(fence+'([^\\\\n]*)\\\\n([\\\\s\\\\S]*?)'+fence,'g');
    let last = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        const p = document.createElement('p');
        p.textContent = text.slice(last, match.index);
        container.appendChild(p);
      }

      const language = (match[1] || 'code').trim() || 'code';
      const codeText = match[2].replace(/\\\\n$/, '');
      const wrapper = document.createElement('div');
      const header = document.createElement('div');
      const label = document.createElement('span');
      const copy = document.createElement('button');
      const pre = document.createElement('pre');
      const code = document.createElement('code');

      header.className = 'code-head';
      label.textContent = language;
      copy.className = 'copy';
      copy.textContent = 'Copy code';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeText);
          copy.textContent = 'Copied!';
          setTimeout(() => copy.textContent='Copy code', 1200);
        } catch {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          copy.textContent = 'Select code';
        }
      });

      code.textContent = codeText;
      const safeLanguage = language.toLowerCase().replace(/[^a-z0-9_+-]/g,'');
      if (window.hljs && safeLanguage && hljs.getLanguage(safeLanguage)) {
        code.className = 'language-' + safeLanguage;
        try { hljs.highlightElement(code); } catch {}
      }

      header.append(label, copy);
      pre.appendChild(code);
      wrapper.append(header, pre);
      container.appendChild(wrapper);
      last = regex.lastIndex;
    }

    if (last < text.length || !container.childNodes.length) {
      const p = document.createElement('p');
      p.textContent = text.slice(last);
      container.appendChild(p);
    }
  }

  function addMessage(role, text) {
    const box = document.createElement('div');
    box.className = 'msg' + (role === 'user' ? ' user' : '');
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = role === 'user' ? 'YOU' : 'VYRO · Y10';
    const body = document.createElement('div');
    renderText(body, text);
    box.append(tag, body);
    $('messages').appendChild(box);
    box.scrollIntoView({behavior:'smooth', block:'end'});
  }

  function showSignedIn(signedIn) {
    $('auth').classList.toggle('hidden', signedIn);
    $('chat').classList.toggle('hidden', !signedIn);
    $('signout').classList.toggle('hidden', !signedIn);
  }

  function updateFiles() {
    $('filelist').textContent = attachments.map(file =>
      file.name + (file.text ? ' — text extracted' : file.image ? ' — image attached' : '')
    ).join('\\n');
  }

  async function extractFile(file) {
    const name = file.name;
    if (file.type && file.type.startsWith('image/')) {
      if (file.size > 3 * 1024 * 1024) {
        throw new Error('Each image must be 3 MB or smaller.');
      }
      return {name, image:await new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Could not read image.'));
        reader.readAsDataURL(file);
      })};
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(name + ' is over the 5 MB document limit.');
    }

    if (/\\.pdf$/i.test(name) && window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
      const pages = [];
      for (let i=1; i<=Math.min(pdf.numPages,40); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push('[Page '+i+'] '+content.items.map(item=>item.str||'').join(' '));
      }
      return {name, text:pages.join('\\n').slice(0,45000)};
    }

    if (/\\.docx$/i.test(name) && window.mammoth) {
      const result = await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});
      return {name, text:result.value.slice(0,45000)};
    }

    if (/\\.(xlsx|xls|ods)$/i.test(name) && window.XLSX) {
      const workbook = XLSX.read(await file.arrayBuffer(), {type:'array'});
      const output = [];
      workbook.SheetNames.slice(0,8).forEach(sheetName => {
        output.push('Sheet: '+sheetName+'\\n'+XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]));
      });
      return {name, text:output.join('\\n\\n').slice(0,45000)};
    }

    if (/\\.(txt|md|csv|tsv|json|js|jsx|ts|tsx|html|css|py|java|xml|yaml|yml|toml|sql|log|sh|rs|go|php|rb)$/i.test(name) || /^text\\//i.test(file.type)) {
      return {name, text:(await file.text()).slice(0,45000)};
    }

    return {name, text:'This file type is not supported for text extraction.'};
  }

  async function attachSelected(files) {
    const list = Array.from(files || []);
    const total = attachments.reduce((sum,f)=>sum+(f.size||0),0) +
      list.reduce((sum,f)=>sum+f.size,0);

    if (total > 30 * 1024 * 1024) {
      status('The total selected file size exceeds 30 MB.', true);
      return;
    }

    for (const file of list) {
      try {
        const extracted = await extractFile(file);
        extracted.size = file.size;
        attachments.push(extracted);
      } catch (error) {
        status(error.message || 'Could not read a selected file.', true);
      }
    }

    updateFiles();
  }

  function buildPrompt() {
    const question = $('prompt').value.trim();
    const fileContext = attachments.filter(file => file.text).map(file =>
      '\\n\\n[Attached file: '+file.name+']\\n'+file.text
    ).join('');

    const combined = question + fileContext;
    if (!combined.trim() && !attachments.some(file=>file.image)) {
      throw new Error('Write a message or attach a file first.');
    }

    return combined.slice(0,30000);
  }

  async function send() {
    if (!user) return;
    const button = $('send');
    button.disabled = true;

    try {
      const prompt = buildPrompt();
      const image = attachments.find(file=>file.image)?.image || null;
      addMessage('user', prompt || 'Please describe the attached image.');
      $('prompt').value = '';
      status('VYRO is thinking...');

      const result = await api('/api/chat', {
        prompt:prompt || 'Describe the attached image.',
        image,
        messages:history
      });

      addMessage('assistant', result.answer);
      history.push({role:'user',content:prompt});
      history.push({role:'assistant',content:result.answer});
      if (history.length > 20) history = history.slice(-20);

      attachments = [];
      updateFiles();
      $('preview').replaceChildren();
      status('');
    } catch (error) {
      status(error.message || 'Something went wrong.', true);
    } finally {
      button.disabled = false;
    }
  }

  async function generateImage() {
    if (!user) return;
    const prompt = $('prompt').value.trim();
    if (!prompt) {
      status('Describe the image you want to create.', true);
      return;
    }

    $('imageMode').disabled = true;
    try {
      status('Generating image...');
      const result = await api('/api/image', {prompt});
      const image = document.createElement('img');
      image.alt = 'Image generated by VYRO AI';
      image.src = result.image;
      $('preview').replaceChildren(image);
      addMessage('assistant', 'Image generated for: ' + prompt);
      $('prompt').value = '';
      status('');
    } catch (error) {
      status(error.message || 'Image generation failed.', true);
    } finally {
      $('imageMode').disabled = false;
    }
  }

  $('login').addEventListener('click', async () => {
    try {
      authStatus('Signing in...');
      await auth.signInWithEmailAndPassword($('email').value.trim(), $('password').value);
      authStatus('');
    } catch (error) {
      authStatus(error.message || 'Sign in failed.', true);
    }
  });

  $('register').addEventListener('click', async () => {
    try {
      authStatus('Creating your account...');
      const credential = await auth.createUserWithEmailAndPassword(
        $('email').value.trim(), $('password').value
      );
      await credential.user.sendEmailVerification();
      authStatus('Account created. Check your email, verify your address, then sign in.');
      await auth.signOut();
    } catch (error) {
      authStatus(error.message || 'Account creation failed.', true);
    }
  });

  $('reset').addEventListener('click', async () => {
    try {
      await auth.sendPasswordResetEmail($('email').value.trim());
      authStatus('Password reset email sent if the account exists.');
    } catch (error) {
      authStatus(error.message || 'Could not send reset email.', true);
    }
  });

  $('signout').addEventListener('click', () => auth.signOut());
  $('newchat').addEventListener('click', () => {
    history = [];
    attachments = [];
    $('messages').replaceChildren();
    $('preview').replaceChildren();
    updateFiles();
    status('New chat started.');
  });

  $('pickfiles').addEventListener('click', () => $('files').click());
  $('files').addEventListener('change', async event => {
    await attachSelected(event.target.files);
    event.target.value = '';
  });

  $('send').addEventListener('click', send);
  $('imageMode').addEventListener('click', generateImage);
  $('prompt').addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  });

  async function boot() {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();

      if (!config.firebase || !config.firebase.apiKey) {
        throw new Error('Set FIREBASE_API_KEY in Cloudflare Worker variables.');
      }

      firebase.initializeApp(config.firebase);
      auth = firebase.auth();

      auth.onAuthStateChanged(async currentUser => {
        user = currentUser;

        if (currentUser && currentUser.emailVerified) {
          showSignedIn(true);
          authStatus('');
        } else {
          showSignedIn(false);
          if (currentUser) {
            authStatus('Verify your email address before signing in.');
            await auth.signOut();
          }
        }
      });
    } catch (error) {
      authStatus(error.message || 'Firebase setup failed.', true);
    }
  }

  boot();
})();
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (request.method === "GET" && url.pathname === "/api/config") {
      if (!env.FIREBASE_API_KEY) {
        return json({ error: "FIREBASE_API_KEY is not configured." }, 500, request);
      }

      return json(
        {
          firebase: {
            ...FIREBASE_CONFIG,
            apiKey: env.FIREBASE_API_KEY
          },
          product: "VYRO AI",
          engine: "Y10"
        },
        200,
        request
      );
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json(
        {
          status: "ok",
          product: "VYRO AI",
          engine: "Y10",
          aiConfigured: Boolean(env.AI),
          firebaseConfigured: Boolean(env.FIREBASE_API_KEY)
        },
        200,
        request
      );
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        return await handleChat(request, env);
      } catch (error) {
        const message = error?.message || "Request failed.";
        const status = /sign in|session|verify|FIREBASE_API_KEY|Firebase is not configured/i.test(message)
          ? 401
          : 500;

        return json({ error: message }, status, request);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/image") {
      try {
        return await handleImage(request, env);
      } catch (error) {
        const message = error?.message || "Request failed.";
        const status = /sign in|session|verify|FIREBASE_API_KEY|Firebase is not configured/i.test(message)
          ? 401
          : 500;

        return json({ error: message }, status, request);
      }
    }

    if (request.method === "GET" || request.method === "HEAD") {
      return html(appPage());
    }

    return json({ error: "Not found." }, 404, request);
  }
};
