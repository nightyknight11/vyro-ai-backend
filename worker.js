// ============================================================
// VYRO AI — COMPLETE CLOUDFLARE WORKER
// Firebase Authentication + Chat + Image Studio + File Reader
// Public AI label: Y10
// ============================================================
//
// CLOUDFLARE REQUIREMENTS:
// 1. Set FIREBASE_API_KEY as a Worker secret/variable.
// 2. Bind Cloudflare Workers AI as AI.
// 3. Enable Email/Password in Firebase Authentication.
// 4. Authorize your Worker domain in Firebase Authentication.
// 5. Deploy this entire file as your Worker.
//
// IMPORTANT:
// Y10 is VYRO's public product/engine label.
// The actual models are the Cloudflare models configured below.
// ============================================================

const FIREBASE_CONFIG = {
  authDomain: "vyro-ai-43783.firebaseapp.com",
  projectId: "vyro-ai-43783",
  storageBucket: "vyro-ai-43783.firebasestorage.app",
  messagingSenderId: "1040345798514",
  appId: "1:1040345798514:web:017fc23087e9a6e5d42feb"
};

const CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const VISION_MODEL = "@cf/google/gemma-4-26b-a4b-it";

const SYSTEM_PROMPT = `
You are VYRO, a helpful AI assistant.
Your public product/engine label is Y10.
If asked what your engine is called, answer Y10.
Never falsely claim that you are ChatGPT or that the configured
underlying model is a different model.

Read and analyze the actual text or image content supplied by the user.
When a file's extracted contents are supplied, use those contents directly.
Never claim to have read a file whose contents were not provided.
If a file is empty, unreadable, or unsupported, explain the limitation.

For documents:
- Summarize the document accurately.
- Answer questions using its actual contents.
- For schoolwork, explain the method step by step.
- For code, explain errors and suggest fixes.
- For CSV and spreadsheet data, analyze columns, missing values,
  statistics, trends, and anomalies using the supplied values.
- Do not fabricate calculations or facts.
- Clearly identify uncertainty and missing information.

For images, inspect the visible content and explain what can be read.
For code, use fenced Markdown code blocks with language labels.
Be useful, friendly, accurate, and direct.
`;

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#08080b">
<title>VYRO AI</title>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>

<style>
:root {
  color-scheme: dark;
  --bg:#08080b;
  --panel:#101015;
  --panel2:#191920;
  --line:#30303a;
  --text:#f4f3fa;
  --muted:#a4a2b3;
  --accent:#7664cb;
}
* { box-sizing:border-box; }
body {
  margin:0;
  background:var(--bg);
  color:var(--text);
  font:14px system-ui,Arial,sans-serif;
}
button,input,textarea { font:inherit; }
button { cursor:pointer; }
button:disabled { opacity:.55; cursor:wait; }
button,input,textarea {
  border-radius:10px;
}
button:focus-visible,input:focus-visible,textarea:focus-visible {
  outline:2px solid var(--accent);
  outline-offset:2px;
}
.app { min-height:100dvh; display:flex; }
.sidebar {
  width:245px;
  flex-shrink:0;
  background:var(--panel);
  border-right:1px solid var(--line);
  padding:16px;
  display:flex;
  flex-direction:column;
  gap:9px;
}
.brand {
  display:flex;
  align-items:center;
  gap:10px;
  font-size:21px;
  font-weight:850;
  letter-spacing:2px;
  margin-bottom:12px;
}
.logo {
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  background:#171520;
  border:1px solid #514576;
  border-radius:12px;
}
.logo svg { width:27px;height:27px; }
button {
  padding:10px 12px;
  color:var(--text);
  background:var(--panel2);
  border:1px solid var(--line);
}
button:hover { border-color:var(--accent); }
.primary,.send {
  background:var(--accent);
  border-color:var(--accent);
  color:white;
}
.sidebar .sidebutton { text-align:left; }
.history {
  display:flex;
  flex-direction:column;
  gap:5px;
  overflow:auto;
  max-height:45vh;
}
.history button {
  text-align:left;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.bottom { margin-top:auto; }
.muted {
  color:var(--muted);
  font-size:12px;
  line-height:1.6;
  overflow-wrap:anywhere;
}
.main {
  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
  min-height:100dvh;
}
.top {
  height:58px;
  padding:0 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid var(--line);
}
.content {
  flex:1;
  width:100%;
  max-width:1000px;
  margin:auto;
  padding:20px;
}
.welcome { padding:30px 0 20px; }
.welcome h1 {
  font-size:clamp(28px,5vw,42px);
  margin:0 0 10px;
}
.accent { color:#b7a6ff; }
.grid {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:10px;
  margin:20px 0;
}
.quick {
  min-height:75px;
  text-align:left;
  padding:14px;
}
.quick strong,.quick span { display:block; }
.quick span { margin-top:5px;color:var(--muted);font-size:12px; }
.messages {
  display:flex;
  flex-direction:column;
  gap:12px;
  padding-bottom:14px;
}
.msg {
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:12px;
  padding:14px;
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  line-height:1.7;
}
.msg.user { background:#191622; }
.msg pre {
  white-space:pre;
  overflow:auto;
  background:#08080d;
  border:1px solid var(--line);
  padding:12px;
  border-radius:8px;
}
.msg code { font-family:ui-monospace,Consolas,monospace; }
.composer {
  position:sticky;
  bottom:0;
  display:flex;
  align-items:stretch;
  gap:8px;
  background:var(--bg);
  padding:10px 0;
}
textarea,input {
  width:100%;
  padding:12px;
  background:var(--panel);
  color:var(--text);
  border:1px solid var(--line);
}
textarea { resize:vertical;min-height:50px;max-height:220px; }
.send { min-width:75px; }
.attachments {
  max-height:180px;
  overflow:auto;
  margin-bottom:8px;
}
.file {
  padding:9px;
  margin:5px 0;
  border:1px solid var(--line);
  background:var(--panel);
  border-radius:9px;
  overflow-wrap:anywhere;
}
.file button { margin-left:8px;padding:4px 8px; }
.hidden { display:none!important; }
.overlay {
  position:fixed;
  inset:0;
  z-index:10;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:auto;
  padding:16px;
  background:#08080bf5;
}
.card {
  width:420px;
  max-width:100%;
  padding:24px;
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:16px;
}
.card input { margin:6px 0; }
.card button { width:100%;margin-top:8px; }
.status { margin-top:10px;overflow-wrap:anywhere;line-height:1.6; }
.err { color:#ff929b; }
.ok { color:#91d8b3; }
#imageResult img { display:block;width:100%;margin-top:15px;border:1px solid var(--line); }
@media(max-width:720px) {
  .sidebar { display:none; }
  .content { padding:12px; }
  .top { padding:0 12px; }
  .composer { gap:5px; }
  .grid { gap:8px; }
  .send { min-width:60px;padding:9px; }
}
</style>
</head>

<body>
<div class="app">
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M5 7L13 25L21 7M18 25L27 7"
            stroke="#c4b7ff" stroke-width="3.2"/>
        </svg>
      </div>
      VYRO
    </div>

    <button class="primary sidebutton" id="newChat">＋ New chat</button>
    <button class="sidebutton" id="chatTab">▤ Chat</button>
    <button class="sidebutton" id="studioTab">▧ Image Studio</button>

    <div class="muted">RECENT CHATS</div>
    <div class="history" id="history"></div>

    <div class="bottom">
      <p class="muted" id="profile">Not signed in</p>
      <button class="sidebutton" id="exportChats">Export chat history</button>
      <button class="sidebutton" id="clearChats">Clear chat history</button>
      <button class="sidebutton" id="logout">Sign out</button>
    </div>
  </aside>

  <main class="main">
    <header class="top">
      <div style="display:flex;align-items:center;gap:9px">
        <div class="logo" style="width:29px;height:29px">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M5 7L13 25L21 7M18 25L27 7"
              stroke="#c4b7ff" stroke-width="3.2"/>
          </svg>
        </div>
        <b>VYRO / Y10</b>
      </div>
      <span class="muted" id="topStatus">Ready</span>
    </header>

    <section class="content" id="chatView">
      <div class="welcome" id="welcome">
        <div class="muted">VYRO AI · Y10</div>
        <h1>Your questions.<br><span class="accent">My answers.</span></h1>
        <p class="muted">Ask anything. Read files. Build something. Learn something new.</p>
        <div class="grid">
          <button class="quick" data-prompt="Explain a difficult topic in simple words.">
            <strong>Learn</strong><span>Understand something new</span>
          </button>
          <button class="quick" data-prompt="Help me brainstorm creative ideas.">
            <strong>Brainstorm</strong><span>Explore possibilities</span>
          </button>
          <button class="quick" data-prompt="Help me write and improve something.">
            <strong>Write</strong><span>Draft and improve</span>
          </button>
          <button class="quick" data-prompt="Help me solve a problem step by step.">
            <strong>Solve</strong><span>Work through a problem</span>
          </button>
        </div>
      </div>

      <div class="messages" id="messages"></div>
      <div class="attachments" id="attachments"></div>

      <div class="composer">
        <div style="display:flex;flex-direction:column;gap:5px">
          <button id="attach">＋ Attach</button>
          <input id="fileInput" type="file" multiple hidden>
        </div>
        <textarea id="prompt" rows="2" maxlength="10000"
          placeholder="Message VYRO..."></textarea>
        <button class="send" id="send">Send</button>
      </div>

      <p class="muted">
        Attach documents, spreadsheets, presentations, code, text files,
        or images. Large files may need to be reduced.
      </p>
    </section>

    <section class="content hidden" id="studioView">
      <h1>Image Studio</h1>
      <p class="muted">Describe an image for VYRO to generate.</p>
      <textarea id="imagePrompt" maxlength="1500"
        placeholder="Describe the image you want..."></textarea>
      <button class="primary" id="generate" style="margin-top:10px">
        Generate image
      </button>
      <div class="status" id="imageStatus"></div>
      <div id="imageResult"></div>
    </section>
  </main>
</div>

<div class="overlay" id="login">
  <div class="card">
    <div class="brand">VYRO AI</div>
    <h1 id="authTitle">Sign in</h1>
    <p class="muted" id="authSubtitle">Sign in to continue.</p>
    <form id="authForm">
      <input id="email" type="email" autocomplete="email"
        placeholder="Email address" required>
      <input id="password" type="password" minlength="6"
        autocomplete="current-password"
        placeholder="Password (at least 6 characters)" required>
      <button class="primary" id="authSubmit">Sign in</button>
    </form>
    <button id="switchAuth">Create an account</button>
    <button id="resetPassword">Reset password</button>
    <div class="status" id="authStatus"></div>
  </div>
</div>

<script>
(function(){
"use strict";

const $ = id => document.getElementById(id);

let auth = null;
let user = null;
let authMode = "signin";
let attachments = [];
let chats = [];
let chatId = null;
let busy = false;

const CHAT_KEY = "vyro_chats_v3";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",
    '"':"&quot;","'":"&#39;"
  }[c]));
}

function renderMarkdown(text) {
  let s = escapeHTML(text);
  s = s.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      '<pre><code>' + code + '</code></pre>');
  s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/\n/g, "<br>");
  return s.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    '<pre><code>$1</code></pre>');
}

function loadChats() {
  try {
    chats = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    if (!Array.isArray(chats)) chats = [];
  } catch {
    chats = [];
  }
}

function saveChats() {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
  } catch {
    $("topStatus").textContent = "Browser storage is full";
  }
}

function currentChat() {
  let c = chats.find(x => x.id === chatId);
  if (!c) {
    c = {id:crypto.randomUUID(), title:"New chat", messages:[]};
    chats.unshift(c);
    chatId = c.id;
  }
  return c;
}

function renderHistory() {
  const host = $("history");
  host.innerHTML = "";
  chats.slice(0,40).forEach(c => {
    const b = document.createElement("button");
    b.textContent = c.title || "New chat";
    b.title = c.title || "New chat";
    b.className = "sidebutton";
    if (c.id === chatId) b.style.borderColor = "var(--accent)";
    b.onclick = () => {
      chatId = c.id;
      renderHistory();
      renderMessages();
    };
    host.appendChild(b);
  });
}

function renderMessages() {
  const c = currentChat();
  $("welcome").classList.toggle("hidden", c.messages.length > 0);
  const host = $("messages");
  host.innerHTML = "";

  c.messages.forEach(m => {
    const el = document.createElement("div");
    el.className = "msg " + (m.role === "user" ? "user" : "assistant");
    const label = document.createElement("div");
    label.className = "muted";
    label.textContent = m.role === "user" ? "YOU" : "VYRO · Y10";

    const content = document.createElement("div");
    content.innerHTML = renderMarkdown(m.content || "");

    el.append(label, content);
    host.appendChild(el);
  });

  $("messages").scrollTop = $("messages").scrollHeight;
}

function addMessage(role, content) {
  const c = currentChat();
  c.messages.push({role,content});
  if (c.title === "New chat" && role === "user") {
    c.title = content.slice(0,45) || "New chat";
  }
  saveChats();
  renderHistory();
  renderMessages();
}

function newChat() {
  chatId = crypto.randomUUID();
  chats.unshift({id:chatId,title:"New chat",messages:[]});
  saveChats();
  renderHistory();
  renderMessages();
  $("prompt").focus();
}

function showLogin(show) {
  $("login").classList.toggle("hidden", !show);
}

function authMessage(message, type) {
  $("authStatus").textContent = message;
  $("authStatus").className = "status " + (type || "");
}

function switchAuthMode(mode) {
  authMode = mode;
  $("authTitle").textContent = mode === "signup"
    ? "Create an account" : "Sign in";
  $("authSubtitle").textContent = mode === "signup"
    ? "Create your VYRO account." : "Sign in to continue.";
  $("authSubmit").textContent = mode === "signup"
    ? "Create account" : "Sign in";
  $("switchAuth").textContent = mode === "signup"
    ? "Already have an account? Sign in" : "Create an account";
  $("authStatus").textContent = "";
}

async function getToken() {
  if (!auth || !user) throw new Error("Please sign in again.");
  return await user.getIdToken(true);
}

async function api(path, payload) {
  const token = await getToken();
  const response = await fetch(path, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + token
    },
    body:JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed (" + response.status + ").");
  }
  return data;
}

// ============================================================
// FILE READING
// The extracted text is sent to the AI, not merely the filename.
// ============================================================

function loadScript(src) {
  return new Promise((resolve,reject) => {
    const existing = [...document.scripts].find(s => s.src === src);
    if (existing) {
      if (existing.dataset.loaded === "yes") return resolve();
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",reject,{once:true});
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "yes";
      resolve();
    };
    script.onerror = () => reject(new Error(
      "Could not load the document reader library. Check your internet connection."
    ));
    document.head.appendChild(script);
  });
}

async function readPDF(file) {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
  );

  if (!window.pdfjsLib) throw new Error("PDF reader failed to initialize.");

  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({data:buffer}).promise;
  const output = [];

  for (let i=1; i<=pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const data = await page.getTextContent();
    const text = data.items.map(x => x.str || "").join(" ");
    output.push("PAGE " + i + "\n" + text);
    if (output.join("\n").length >= 90000) break;
  }

  const result = output.join("\n\n").slice(0,90000);
  if (!result.trim()) {
    throw new Error(
      "This PDF contains no selectable text. It may be scanned; attach screenshots of its pages instead."
    );
  }
  return result;
}

async function readDOCX(file) {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js"
  );

  if (!window.mammoth) throw new Error("DOCX reader failed to initialize.");

  const result = await window.mammoth.extractRawText({
    arrayBuffer:await file.arrayBuffer()
  });

  const text = (result.value || "").trim();
  if (!text) throw new Error("No readable text was found in this DOCX.");
  return text.slice(0,90000);
}

async function readSpreadsheet(file) {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
  );

  if (!window.XLSX) throw new Error("Spreadsheet reader failed to initialize.");

  const workbook = window.XLSX.read(await file.arrayBuffer(), {
    type:"array"
  });

  const parts = [];

  workbook.SheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    const csv = window.XLSX.utils.sheet_to_csv(sheet);
    parts.push("SHEET: " + name + "\n" + csv);
  });

  const result = parts.join("\n\n").slice(0,90000);
  if (!result.trim()) throw new Error("The spreadsheet contains no readable data.");
  return result;
}

async function readPPTX(file) {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
  );

  if (!window.JSZip) throw new Error("Presentation reader failed to initialize.");

  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const slideNames = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/i.test(n))
    .sort((a,b) => {
      const na = Number(a.match(/slide(\d+)/i)[1]);
      const nb = Number(b.match(/slide(\d+)/i)[1]);
      return na-nb;
    });

  const slides = [];

  for (let i=0; i<slideNames.length; i++) {
    const xml = await zip.files[slideNames[i]].async("text");
    const doc = new DOMParser().parseFromString(xml,"application/xml");
    const text = [...doc.getElementsByTagName("a:t")]
      .map(n => n.textContent || "")
      .join(" ");

    slides.push("SLIDE " + (i+1) + "\n" + text);
    if (slides.join("\n").length >= 90000) break;
  }

  const result = slides.join("\n\n").slice(0,90000);
  if (!result.trim()) throw new Error("No readable slide text was found.");
  return result;
}

async function readFileContents(file) {
  const name = file.name || "unnamed file";
  const ext = (name.split(".").pop() || "").toLowerCase();

  if (file.size > 15*1024*1024) {
    throw new Error("File is over 15 MB. Please attach a smaller file.");
  }

  if (file.type.startsWith("image/") ||
      ["png","jpg","jpeg","webp","gif"].includes(ext)) {
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(file.type) &&
        !["png","jpg","jpeg","webp","gif"].includes(ext)) {
      throw new Error("Unsupported image format.");
    }

    if (file.size > 3*1024*1024) {
      throw new Error("Images must be 3 MB or smaller. Resize the image and try again.");
    }

    return {
      type:"image",
      data:await new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read image."));
        reader.readAsDataURL(file);
      })
    };
  }

  if (["pdf"].includes(ext)) {
    return {type:"text",text:await readPDF(file)};
  }

  if (["docx"].includes(ext)) {
    return {type:"text",text:await readDOCX(file)};
  }

  if (["xlsx","xls","xlsm","ods"].includes(ext)) {
    return {type:"text",text:await readSpreadsheet(file)};
  }

  if (["pptx"].includes(ext)) {
    return {type:"text",text:await readPPTX(file)};
  }

  const textExtensions = [
    "txt","md","csv","tsv","json","jsonl","xml","html","htm",
    "css","js","mjs","cjs","ts","tsx","jsx","py","java","c",
    "cpp","h","hpp","cs","go","rs","php","rb","swift","kt",
    "sql","sh","bash","yaml","yml","toml","ini","conf","log",
    "env.example","diff","patch","r","ipynb","svg","rtf"
  ];

  if (textExtensions.includes(ext) ||
      file.type.startsWith("text/") ||
      /json|javascript|xml|csv|yaml/i.test(file.type)) {
    const text = (await file.text()).slice(0,90000);
    if (!text.trim()) throw new Error("This file is empty.");
    return {type:"text",text};
  }

  throw new Error(
    "Unsupported file type: ." + ext +
    ". Supported formats include PDF, DOCX, PPTX, XLSX, XLS, ODS, TXT, CSV, JSON, code files, and images."
  );
}

function renderAttachments() {
  const host = $("attachments");
  host.innerHTML = "";

  attachments.forEach((a,index) => {
    const row = document.createElement("div");
    row.className = "file";

    const status = a.error
      ? " — ERROR: " + a.error
      : a.loading ? " — Reading..."
      : a.text ? " — Content read"
      : a.imageData ? " — Image ready"
      : " — Not read";

    const label = document.createElement("span");
    label.textContent = a.name + status;
    row.appendChild(label);

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => {
      attachments.splice(index,1);
      renderAttachments();
    };
    row.appendChild(remove);
    host.appendChild(row);
  });
}

async function acceptFiles(fileList) {
  const files = [...(fileList || [])];

  for (const file of files) {
    if (attachments.length >= 8) {
      alert("You can attach up to 8 files at a time.");
      break;
    }

    const item = {
      name:file.name,
      size:file.size,
      loading:true,
      text:"",
      imageData:"",
      error:""
    };

    attachments.push(item);
    renderAttachments();

    try {
      const result = await readFileContents(file);
      item.loading = false;

      if (result.type === "image") {
        item.imageData = result.data;
      } else {
        item.text = result.text;
      }
    } catch (error) {
      item.loading = false;
      item.error = error.message || "Unable to read this file.";
    }

    renderAttachments();
  }

  const good = attachments.filter(a => a.text || a.imageData).length;
  const bad = attachments.filter(a => a.error).length;

  $("topStatus").textContent =
    good + " readable file(s)" + (bad ? ", " + bad + " error(s)" : "");
}

// ============================================================
// CHAT
// ============================================================

async function send() {
  if (busy) return;

  const prompt = $("prompt").value.trim();
  const ready = attachments.filter(a => a.text || a.imageData);
  const pending = attachments.some(a => a.loading);
  const errors = attachments.filter(a => a.error);

  if (pending) {
    alert("Please wait until file reading finishes.");
    return;
  }

  if (!prompt && !ready.length) return;

  if (!ready.length && errors.length && !prompt) {
    alert("Your attachments could not be read. Choose a supported file or enter a message.");
    return;
  }

  let userText = prompt;

  if (ready.length) {
    userText += "\n\nATTACHED FILE CONTENTS:\n";

    ready.forEach(file => {
      if (file.text) {
        userText += "\n--- BEGIN FILE: " + file.name + " ---\n";
        userText += file.text;
        userText += "\n--- END FILE: " + file.name + " ---\n";
      } else if (file.imageData) {
        userText += "\nImage attached: " + file.name + ". Please inspect the image.\n";
      }
    });
  }

  if (errors.length) {
    userText += "\n\nFILES THAT COULD NOT BE READ:\n" +
      errors.map(a => a.name + ": " + a.error).join("\n") +
      "\nDo not claim to have analyzed the contents of these unreadable files.";
  }

  if (userText.length > 110000) {
    alert("The extracted content is too large. Remove some attachments or use smaller files.");
    return;
  }

  $("prompt").value = "";
  attachments = [];
  renderAttachments();

  addMessage("user",userText);

  busy = true;
  $("send").disabled = true;
  $("topStatus").textContent = "VYRO is thinking...";

  try {
    const c = currentChat();
    const recent = c.messages.slice(-12).map(m => ({
      role:m.role,
      content:m.content.slice(0,10000)
    }));

    const images = ready
      .filter(a => a.imageData)
      .slice(0,3)
      .map(a => ({name:a.name,data:a.imageData}));

    const result = await api("/api/chat",{
      messages:recent,
      images
    });

    addMessage("assistant",result.reply || "I couldn't generate a response.");
    $("topStatus").textContent = "Ready";
  } catch (error) {
    addMessage("assistant","Request failed: " + (error.message || "Unknown error"));
    $("topStatus").textContent = "Error";
  } finally {
    busy = false;
    $("send").disabled = false;
    $("prompt").focus();
  }
}

// ============================================================
// IMAGE GENERATION
// ============================================================

async function generateImage() {
  const prompt = $("imagePrompt").value.trim();
  if (!prompt) {
    $("imageStatus").textContent = "Enter an image description first.";
    return;
  }

  $("generate").disabled = true;
  $("imageStatus").textContent = "Generating image...";
  $("imageResult").innerHTML = "";

  try {
    const result = await api("/api/image",{prompt});

    if (!result.image) throw new Error("No image was returned.");

    const img = document.createElement("img");
    img.alt = "Image generated by VYRO";
    img.src = result.image;
    $("imageResult").appendChild(img);

    $("imageStatus").textContent = "Image generated successfully.";
  } catch (error) {
    $("imageStatus").textContent = error.message || "Image generation failed.";
  } finally {
    $("generate").disabled = false;
  }
}

// ============================================================
// AUTHENTICATION
// ============================================================

$("authForm").addEventListener("submit",async event => {
  event.preventDefault();
  if (!auth) return;

  const email = $("email").value.trim();
  const password = $("password").value;

  $("authSubmit").disabled = true;
  authMessage("Please wait...");

  try {
    if (authMode === "signup") {
      const credential = await auth.createUserWithEmailAndPassword(email,password);
      await credential.user.sendEmailVerification();
      await auth.signOut();

      authMessage(
        "Account created. Check your email, verify your address, then sign in.",
        "ok"
      );
      switchAuthMode("signin");
      $("email").value = email;
    } else {
      const credential = await auth.signInWithEmailAndPassword(email,password);

      if (!credential.user.emailVerified) {
        await auth.signOut();
        authMessage("Verify your email before signing in.","err");
        return;
      }

      user = credential.user;
      showLogin(false);
    }
  } catch (error) {
    authMessage(error.message || "Authentication failed.","err");
  } finally {
    $("authSubmit").disabled = false;
  }
});

$("switchAuth").onclick = () => {
  switchAuthMode(authMode === "signin" ? "signup" : "signin");
};

$("resetPassword").onclick = async () => {
  const email = $("email").value.trim();

  if (!email) {
    authMessage("Enter your email address first.","err");
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    authMessage("Password reset email sent. Check your inbox.","ok");
  } catch (error) {
    authMessage(error.message || "Could not send reset email.","err");
  }
};

$("logout").onclick = async () => {
  if (auth) await auth.signOut();
  user = null;
  showLogin(true);
};

$("newChat").onclick = newChat;
$("send").onclick = send;
$("generate").onclick = generateImage;

$("prompt").addEventListener("keydown",event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    send();
  }
});

$("attach").onclick = () => $("fileInput").click();

$("fileInput").addEventListener("change",event => {
  acceptFiles(event.target.files);
  event.target.value = "";
});

$("chatTab").onclick = () => {
  $("chatView").classList.remove("hidden");
  $("studioView").classList.add("hidden");
};

$("studioTab").onclick = () => {
  $("studioView").classList.remove("hidden");
  $("chatView").classList.add("hidden");
};

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.onclick = () => {
    $("prompt").value = button.dataset.prompt;
    $("prompt").focus();
  };
});

$("clearChats").onclick = () => {
  if (!confirm("Delete all locally saved VYRO chats?")) return;
  chats = [];
  chatId = null;
  saveChats();
  newChat();
};

$("exportChats").onclick = () => {
  const blob = new Blob([JSON.stringify(chats,null,2)],{
    type:"application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vyro-chat-history.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
};

async function boot() {
  loadChats();

  try {
    const response = await fetch("/api/config");
    const config = await response.json();

    if (!config.firebase || !config.firebase.apiKey) {
      throw new Error(
        "FIREBASE_API_KEY is missing from Cloudflare Worker variables."
      );
    }

    firebase.initializeApp(config.firebase);
    auth = firebase.auth();

    auth.onAuthStateChanged(async currentUser => {
      if (currentUser && currentUser.emailVerified) {
        user = currentUser;
        $("profile").textContent =
          currentUser.displayName || currentUser.email || "Signed in";

        showLogin(false);

        if (!chatId || !chats.some(c => c.id === chatId)) {
          chatId = chats.length ? chats[0].id : null;
        }

        if (!chatId) newChat();

        renderHistory();
        renderMessages();
      } else {
        if (currentUser) await auth.signOut();
        user = null;
        showLogin(true);
      }
    });
  } catch (error) {
    showLogin(true);
    authMessage("Firebase setup error: " + error.message,"err");
  }
}

boot();
})();
</script>
</body>
</html>`;

function json(data, status = 200, request) {
  const headers = {
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store"
  };

  if (request) Object.assign(headers,corsHeaders(request));

  return new Response(JSON.stringify(data),{status,headers});
}

function corsHeaders(request) {
  return {
    "Access-Control-Allow-Origin":request.headers.get("Origin") || "*",
    "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type, Authorization",
    "Vary":"Origin"
  };
}

async function verifyFirebaseToken(request,env) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) throw new Error("Please sign in again.");

  const apiKey = env.FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_API_KEY is not configured in Cloudflare.");
  }

  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
      encodeURIComponent(apiKey),
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({idToken:match[1]})
    }
  );

  const data = await response.json().catch(() => ({}));
  const account = data.users && data.users[0];

  if (!response.ok || !account) {
    throw new Error("Your session is invalid. Sign in again.");
  }

  if (!account.emailVerified) {
    throw new Error("Verify your email before using VYRO.");
  }

  return account;
}

export default {
  async fetch(request,env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null,{headers:corsHeaders(request)});
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML,{
        headers:{
          "Content-Type":"text/html; charset=utf-8",
          "Cache-Control":"no-store"
        }
      });
    }

    if (url.pathname === "/api/health") {
      return json({
        ok:true,
        service:"VYRO AI",
        engine:"Y10",
        ai:!!env.AI
      },200,request);
    }

    if (url.pathname === "/api/config") {
      return json({
        ok:true,
        firebase:{
          ...FIREBASE_CONFIG,
          apiKey:env.FIREBASE_API_KEY || ""
        },
        engine:"Y10"
      },200,request);
    }

    if (request.method !== "POST") {
      return json({error:"Not found."},404,request);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({error:"Invalid JSON request."},400,request);
    }

    try {
      await verifyFirebaseToken(request,env);

      if (!env.AI) {
        return json({
          error:"Cloudflare Workers AI binding named AI is missing."
        },500,request);
      }

      if (url.pathname === "/api/chat") {
        const incoming = Array.isArray(body.messages)
          ? body.messages.slice(-12)
          : [];

        const messages = [{
          role:"system",
          content:SYSTEM_PROMPT
        }];

        for (const m of incoming) {
          if (!m || !["user","assistant"].includes(m.role)) continue;

          messages.push({
            role:m.role,
            content:String(m.content || "").slice(0,12000)
          });
        }

        const images = Array.isArray(body.images)
          ? body.images.slice(0,3)
          : [];

        let result;

        if (images.length) {
          const totalChars = images.reduce(
            (sum,image) => sum + String(image.data || "").length,0
          );

          if (totalChars > 8*1024*1024) {
            return json({
              error:"Images are too large. Resize them and try again."
            },413,request);
          }

          const validImages = images.filter(image =>
            typeof image.data === "string" &&
            /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(image.data)
          );

          if (!validImages.length) {
            return json({
              error:"No supported image data was received. Attach the image again."
            },400,request);
          }

          const lastUser = messages.map(m => m.role).lastIndexOf("user");

          if (lastUser < 0) {
            return json({
              error:"Please enter a message with your image."
            },400,request);
          }

          const originalText = String(messages[lastUser].content || "");

          messages[lastUser] = {
            role:"user",
            content:[
              ...validImages.map(image => ({
                type:"image_url",
                image_url:{url:image.data}
              })),
              {type:"text",text:originalText}
            ]
          };

          result = await env.AI.run(VISION_MODEL,{
            messages,
            max_tokens:1500,
            temperature:0.3,
            top_p:0.9
          });
        } else {
          result = await env.AI.run(CHAT_MODEL,{
            messages,
            max_tokens:1800,
            temperature:0.45,
            top_p:0.9,
            repetition_penalty:1.08
          });
        }

        function extractText(value) {
          if (typeof value === "string") return value.trim();

          if (Array.isArray(value)) {
            return value.map(extractText).filter(Boolean).join("\n").trim();
          }

          if (value && typeof value === "object") {
            for (const key of ["response","output_text","description","text"]) {
              if (typeof value[key] === "string" && value[key].trim()) {
                return value[key].trim();
              }
            }

            const choice = value.choices && value.choices[0];

            if (choice) {
              const content = choice.message && choice.message.content;

              if (typeof content === "string") return content.trim();

              if (Array.isArray(content)) {
                return content.map(part => part.text || part.content || "")
                  .filter(Boolean).join("\n").trim();
              }

              if (typeof choice.text === "string") return choice.text.trim();
            }

            if (value.result !== undefined && value.result !== value) {
              return extractText(value.result);
            }

            if (value.message && typeof value.message.content === "string") {
              return value.message.content.trim();
            }
          }

          return "";
        }

        const reply = extractText(result);

        if (!reply) {
          return json({
            error:"The AI model returned no text. Please retry once."
          },502,request);
        }

        return json({reply},200,request);
      }

      if (url.pathname === "/api/image") {
        const prompt = String(body.prompt || "").trim().slice(0,1500);

        if (!prompt) {
          return json({error:"Enter an image description first."},400,request);
        }

        const result = await env.AI.run(IMAGE_MODEL,{
          prompt,
          num_steps:4
        });

        let imageData = result && (result.image || result.data);

        if (Array.isArray(imageData)) imageData = imageData[0];

        if (typeof imageData === "string") {
          return json({
            image:imageData.startsWith("data:")
              ? imageData
              : "data:image/png;base64," + imageData
          },200,request);
        }

        if (imageData instanceof Uint8Array ||
            imageData instanceof ArrayBuffer) {
          const bytes = imageData instanceof Uint8Array
            ? imageData
            : new Uint8Array(imageData);

          let binary = "";

          for (let i=0;i<bytes.length;i+=0x8000) {
            binary += String.fromCharCode(...bytes.subarray(i,i+0x8000));
          }

          return json({
            image:"data:image/png;base64," + btoa(binary)
          },200,request);
        }

        return json({
          error:"The image model returned an unsupported image format."
        },502,request);
      }

      return json({error:"Not found."},404,request);
    } catch (error) {
      const message = error && error.message
        ? error.message
        : "Request failed.";

      const status = /sign in|session|verify|FIREBASE_API_KEY/i.test(message)
        ? 401
        : 500;

      return json({error:message},status,request);
    }
  }
};