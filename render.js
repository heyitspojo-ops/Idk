#!/usr/bin/env node
// Render vertical 3D reels (1080x1920) from reels/<name>/scene.js.
//
//   node render.js sheet  reels/<name>                    labeled contact sheet  -> build/<name>-sheet.png
//   node render.js stills reels/<name> 2 8 14             single PNGs            -> build/<name>-stills/t02.00.png ...
//   node render.js reels/<name> --draft --from 20 --to 26 small fast draft       -> build/<name>-draft.mp4
//   node render.js reels/<name>                           final video            -> build/<name>.mp4
//
// Options: --from <s> --to <s> (any mode that renders a range), --fps <n>, --frames <n> (sheet cell count).
//
// Scene contract (reels/<name>/scene.js, an ES module, `import * as THREE from 'three'` works):
//   export const duration = 12;                 // seconds (required for sheet / video)
//   window.renderFrame = (t) => { ... };        // draw the frame at time t (seconds); may be async
// Page size is 1080x1920 CSS px. Use renderer.setPixelRatio(window.devicePixelRatio) so drafts
// (rendered at half scale) stay sharp and cheap. If reels/<name>/audio.(mp3|wav|m4a|aac) exists it is muxed in.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const BUILD = path.join(ROOT, 'build');
const WIDTH = 1080, HEIGHT = 1920;

// ---------- args ----------
function parseArgs(argv) {
  const opts = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--draft') opts.draft = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[++i];
      if (val === undefined) die(`Missing value for ${a}`);
      opts[key] = Number(val);
      if (!Number.isFinite(opts[key])) die(`${a} expects a number, got "${val}"`);
    } else opts.positional.push(a);
  }
  return opts;
}

function die(msg) {
  console.error(`render.js: ${msg}`);
  process.exit(1);
}

function usage() {
  console.log(`Usage:
  node render.js sheet  reels/<name>
  node render.js stills reels/<name> <t> [<t> ...]
  node render.js reels/<name> [--draft] [--from <s>] [--to <s>] [--fps <n>]`);
  process.exit(1);
}

// ---------- chrome / ffmpeg discovery ----------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/opt/pw-browsers/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      const st = fs.statSync(c);
      if (st.isFile()) return c;
      if (st.isDirectory()) { // playwright-style folder: find chrome binary inside
        const found = execFileSync('find', [c, '-type', 'f', '-name', 'chrome'], { encoding: 'utf8' }).split('\n')[0];
        if (found) return found;
      }
    } catch {}
  }
  die('Google Chrome not found. Set CHROME_PATH=/path/to/chrome');
}

function checkFfmpeg() {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); }
  catch { die('ffmpeg not found on PATH'); }
}

// ---------- static server ----------
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.gif': 'image/gif', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream', '.hdr': 'application/octet-stream', '.ktx2': 'image/ktx2',
  '.wasm': 'application/wasm', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.mp4': 'video/mp4',
};

function playerHtml(reelUrl) {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#000}
canvas{display:block}</style>
<script type="importmap">{"imports":{
  "three":"/node_modules/three/build/three.module.js",
  "three/addons/":"/node_modules/three/examples/jsm/"
}}</script></head>
<body><script type="module">
try {
  const mod = await import(${JSON.stringify(reelUrl + '/scene.js')});
  window.__duration = mod.duration ?? window.duration ?? null;
  if (mod.ready) await mod.ready;
  if (window.ready) await window.ready;
  if (typeof window.renderFrame !== 'function') throw new Error('scene.js must set window.renderFrame = (t) => {...}');
  window.__sceneReady = true;
} catch (e) {
  window.__sceneError = String(e && e.stack || e);
}
</script></body></html>`;
}

function sheetHtml(cells, title, cols) {
  const items = cells.map(c => `<figure><img src="data:image/png;base64,${c.png.toString('base64')}"><figcaption>${c.label}</figcaption></figure>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#16161a;color:#eee;font:600 22px/1.2 system-ui,-apple-system,"DejaVu Sans",sans-serif;padding:24px;width:max-content}
h1{font-size:30px;margin:0 0 20px}
.grid{display:grid;grid-template-columns:repeat(${cols},270px);gap:16px}
figure{margin:0}img{width:270px;height:480px;display:block;border-radius:6px;background:#000}
figcaption{margin-top:6px;font-variant-numeric:tabular-nums;color:#bbb}
</style></head><body><h1>${title}</h1><div class="grid">${items}</div></body></html>`;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    if (url.pathname === '/__player') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(playerHtml(url.searchParams.get('reel')));
    }
    const file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------- browser ----------
async function openReel(browser, port, reelDir, scale) {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) console.error(`[page ${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => console.error(`[page error] ${e.message}`));
  page.on('requestfailed', r => console.error(`[page] failed to load ${r.url()}`));
  page.on('response', r => { if (r.status() >= 400) console.error(`[page] ${r.status()} ${r.url()}`); });
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: scale });
  const reelUrl = '/' + path.relative(ROOT, reelDir).split(path.sep).join('/');
  await page.goto(`http://127.0.0.1:${port}/__player?reel=${encodeURIComponent(reelUrl)}`, { waitUntil: 'load' });
  await page.waitForFunction('window.__sceneReady || window.__sceneError', { timeout: 120000 });
  const err = await page.evaluate('window.__sceneError');
  if (err) die(`scene failed to load:\n${err}`);
  const duration = await page.evaluate('window.__duration');
  return { page, duration };
}

async function grab(page, t) {
  await page.evaluate(async (t) => {
    await window.renderFrame(t);
    // wait for the compositor to present the new frame
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, t);
  return page.screenshot({ type: 'png', optimizeForSpeed: true });
}

// ---------- modes ----------
function resolveRange(opts, duration, needDuration) {
  const from = opts.from ?? 0;
  const to = opts.to ?? duration;
  if (to == null) die('scene.js must `export const duration = <seconds>` (or pass --to)');
  if (!(to > from)) die(`empty range: --from ${from} --to ${to}`);
  return { from, to };
}

const fmt = t => t.toFixed(2).padStart(5, '0');
const timecode = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;

function findAudio(reelDir) {
  for (const ext of ['mp3', 'wav', 'm4a', 'aac']) {
    const p = path.join(reelDir, `audio.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function renderVideo(ctx, opts) {
  const { page, duration, name, reelDir } = ctx;
  const fps = opts.fps ?? 30;
  const { from, to } = resolveRange(opts, duration);
  const total = Math.round((to - from) * fps);
  const out = path.join(BUILD, opts.draft ? `${name}-draft.mp4` : `${name}.mp4`);
  const audio = findAudio(reelDir);

  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-'];
  if (audio) args.push('-ss', String(from), '-t', String(to - from), '-i', audio);
  args.push('-map', '0:v');
  if (audio) args.push('-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', String(fps));
  if (opts.draft) args.push('-preset', 'ultrafast', '-crf', '28');
  else args.push('-preset', 'slow', '-crf', '16', '-profile:v', 'high');
  args.push('-movflags', '+faststart', out);

  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((resolve, reject) => ff.on('close', c => c === 0 ? resolve() : reject(new Error(`ffmpeg exited ${c}`))));
  ff.stdin.on('error', () => {}); // surfaced via ffDone

  console.log(`Rendering ${name} ${opts.draft ? 'DRAFT ' : ''}${timecode(from)} -> ${timecode(to)}, ${total} frames @ ${fps}fps${audio ? ' + audio' : ''}`);
  const start = Date.now();
  for (let i = 0; i < total; i++) {
    const png = await grab(page, from + i / fps);
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 10 === 0 || i === total - 1) {
      const el = (Date.now() - start) / 1000, rate = (i + 1) / el;
      process.stdout.write(`\r  frame ${i + 1}/${total}  ${rate.toFixed(1)} fps  eta ${Math.ceil((total - i - 1) / rate)}s   `);
    }
  }
  ff.stdin.end();
  await ffDone;
  console.log(`\nWrote ${path.relative(process.cwd(), out)} (${((Date.now() - start) / 1000).toFixed(1)}s)`);
}

async function renderStills(ctx, times) {
  const { page, duration, name } = ctx;
  if (!times.length) die('stills needs at least one time, e.g. `node render.js stills reels/x 2 8 14`');
  const dir = path.join(BUILD, `${name}-stills`);
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) {
    if (duration != null && (t < 0 || t > duration)) console.warn(`  note: t=${t} is outside 0..${duration}`);
    const out = path.join(dir, `t${fmt(t)}.png`);
    fs.writeFileSync(out, await grab(page, t));
    console.log(`Wrote ${path.relative(process.cwd(), out)}`);
  }
}

async function renderSheet(ctx, opts, browser) {
  const { page, duration, name } = ctx;
  const { from, to } = resolveRange(opts, duration);
  const n = opts.frames ?? 12;
  const cols = Math.min(n, 6);
  const cells = [];
  for (let i = 0; i < n; i++) {
    // centre of each slice so we never sample the exact end
    const t = from + (to - from) * (i + 0.5) / n;
    process.stdout.write(`\r  still ${i + 1}/${n}`);
    cells.push({ png: await grab(page, t), label: `#${i + 1} · ${timecode(t)} · f${Math.round(t * 30)}` });
  }
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: 800, height: 600, deviceScaleFactor: 1 });
  await sheet.setContent(sheetHtml(cells, `${name} — ${timecode(from)}–${timecode(to)} (${n} frames)`, cols), { waitUntil: 'load' });
  const out = path.join(BUILD, `${name}-sheet.png`);
  await sheet.screenshot({ path: out, fullPage: true });
  console.log(`\nWrote ${path.relative(process.cwd(), out)}`);
}

// ---------- main ----------
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let [mode, reel, ...rest] = opts.positional;
  if (!mode) usage();
  if (mode !== 'sheet' && mode !== 'stills') { rest = [reel, ...rest].filter(Boolean); reel = mode; mode = 'video'; }
  if (!reel) usage();
  if (mode === 'video' && rest.length) die(`unexpected arguments: ${rest.join(' ')}`);

  const reelDir = path.resolve(reel);
  if (!fs.existsSync(path.join(reelDir, 'scene.js'))) die(`${reel}/scene.js not found`);
  if (!reelDir.startsWith(ROOT)) die('reel folder must be inside the project');
  const name = path.basename(reelDir);
  fs.mkdirSync(BUILD, { recursive: true });
  if (mode === 'video') checkFfmpeg();

  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
      '--hide-scrollbars', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
  });
  try {
    const scale = mode === 'video' && opts.draft ? 0.5 : 1; // draft = 540x960
    const { page, duration } = await openReel(browser, server.address().port, reelDir, scale);
    const ctx = { page, duration, name, reelDir };
    if (mode === 'sheet') await renderSheet(ctx, opts, browser);
    else if (mode === 'stills') await renderStills(ctx, rest.map(Number).filter(x => { if (!Number.isFinite(x)) die(`bad time: ${x}`); return true; }));
    else await renderVideo(ctx, opts);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
