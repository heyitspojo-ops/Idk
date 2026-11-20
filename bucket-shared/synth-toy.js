// Toy synth: original music + SFX in pure JS, mixed with a voice-over (ducked). 48 kHz stereo.
//
//   node bucket-shared/synth-toy.js reels/<name>/audio.js out.wav
//
// audio.js default-exports a spec:
//   { duration, vo: { file, gain }, music: { bpm, key, gain, duck, sections: [{ from, to, style, key? }] },
//     sfx: [[name, time, { gain, pan, ...args }], ...] }
// Music styles: 'bouncy' | 'party' | 'march' | 'sad' | 'bright' | 'end'.
// SFX: pop, chirp, slam, whoosh, scratch, splash, bubbles, squish, cheer, ding, sparkle, wahwah, steps, hit,
//      splat, plop, fart ({ dur, wet }), gag, coo, squeak ({ dur, rate }), slap, rev, clang, rumble ({ dur }),
//      engine ({ dur, from, to } Hz), hiss ({ dur }), boing ({ pitch }), flush ({ dur }), bang, meow ({ pitch, dur }), bell ({ pitch }), snore ({ dur }), saw ({ dur }).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const SR = 48000;
const TAU = Math.PI * 2;
const midi = m => 440 * 2 ** ((m - 69) / 12);
const KEYS = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69 };
let seed = 12345;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x3fffffff) - 1;
const buf = s => new Float32Array(Math.max(1, Math.round(s * SR)));

// ---------- voices (return mono Float32Array) ----------
export function marimba(f, dur = 0.5, bright = 1) {
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) { const t = i / SR, a = Math.min(1, t / 0.002);
    b[i] = a * (Math.sin(TAU * f * t) * Math.exp(-t * 6) + 0.35 * bright * Math.sin(TAU * f * 4 * t) * Math.exp(-t * 28) + 0.12 * bright * Math.sin(TAU * f * 9.9 * t) * Math.exp(-t * 60)); }
  return b;
}
export function bass(f, dur = 0.4) {
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) { const t = i / SR, ph = (f * t) % 1;
    b[i] = (4 * Math.abs(ph - 0.5) - 1) * Math.exp(-t * 5) * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.02); }
  return b;
}
export function kick() {
  const b = buf(0.35); let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; ph += TAU * (45 + 110 * Math.exp(-t * 30)) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 9); }
  return b;
}
export function snare(len = 0.18) {
  const b = buf(len); let lp = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; lp += 0.6 * (noise() - lp);
    b[i] = (lp * 0.8 + Math.sin(TAU * 190 * t) * 0.4 * Math.exp(-t * 40)) * Math.exp(-t * 22); }
  return b;
}
export function hat(len = 0.05) {
  const b = buf(len); let prev = 0;
  for (let i = 0; i < b.length; i++) { const n = noise(); b[i] = (n - prev) * 0.5 * Math.exp(-(i / SR) * 70); prev = n; }
  return b;
}
export function clap() {
  const b = buf(0.2); let prev = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR, n = noise(), hp = n - prev; prev = n;
    const env = [0, 0.012, 0.024].reduce((s, o) => s + (t >= o ? Math.exp(-(t - o) * (o === 0.024 ? 25 : 120)) : 0), 0);
    b[i] = hp * env * 0.6; }
  return b;
}
export function pad(freqs, dur) {
  const b = buf(dur); let lp = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; let s = 0;
    for (const f of freqs) for (const d of [-0.12, 0.12]) s += ((f * (1 + d / 100) * t) % 1) * 2 - 1;
    lp += 0.04 * (s / (freqs.length * 2) - lp);
    b[i] = lp * Math.min(1, t / 0.6) * Math.min(1, (dur - t) / 0.8); }
  return b;
}

// ---------- SFX ----------
const sweep = (f0, f1, dur, k = 8, shape = 'sin') => { const b = buf(dur); let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur; ph += TAU * (f0 * (f1 / f0) ** x) / SR;
    b[i] = (shape === 'sq' ? Math.sign(Math.sin(ph)) * 0.5 : Math.sin(ph)) * Math.exp(-t * k) * Math.min(1, t / 0.003); }
  return b; };
const noiseBurst = (dur, cutoff = 0.2, k = 10, hp = false) => { const b = buf(dur); let lp = 0, prev = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR, n = noise(); lp += cutoff * (n - lp);
    b[i] = (hp ? n - prev : lp) * Math.exp(-t * k) * Math.min(1, t / 0.005); prev = n; }
  return b; };
export const SFX = {
  pop: ({ pitch = 1 } = {}) => sweep(300 * pitch, 900 * pitch, 0.12, 25),
  chirp: ({ pitch = 1 } = {}) => sweep(900 * pitch, 1800 * pitch, 0.18, 10, 'sq'),
  hit: () => mixInto(sweep(120, 40, 0.6, 5), noiseBurst(0.3, 0.3, 14), 0.5),
  slam: () => mixInto(sweep(90, 30, 0.7, 6), noiseBurst(0.5, 0.15, 9), 0.9),
  whoosh: ({ dur = 0.5 } = {}) => { const b = buf(dur); let lp = 0;
    for (let i = 0; i < b.length; i++) { const x = i / b.length; lp += (0.02 + 0.25 * Math.sin(Math.PI * x)) * (noise() - lp); b[i] = lp * Math.sin(Math.PI * x) * 1.4; } return b; },
  scratch: ({ dur = 4, rate0 = 3, rate1 = 7 } = {}) => { const b = buf(dur); let ph = 0, lp = 0;
    for (let i = 0; i < b.length; i++) { const x = i / b.length; ph += TAU * (rate0 + (rate1 - rate0) * x) * 2 / SR;
      lp += 0.35 * (noise() - lp); b[i] = lp * Math.max(0, Math.sin(ph)) ** 2 * 0.9; } return b; },
  splash: () => mixInto(noiseBurst(0.9, 0.12, 4), sweep(600, 200, 0.3, 12), 0.3),
  bubbles: ({ dur = 3, n = 18 } = {}) => { const b = buf(dur);
    for (let k = 0; k < n; k++) { const at = Math.abs(noise()) * (dur - 0.1); mixInto(b, sweep(500 + Math.abs(noise()) * 700, 1400 + Math.abs(noise()) * 600, 0.07, 30), 0.5, at); } return b; },
  squish: ({ dur = 2 } = {}) => { const b = buf(dur); let lp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR; lp += 0.08 * (noise() - lp); b[i] = lp * (0.5 + 0.5 * Math.sin(TAU * 4 * t)) * 1.2; } return b; },
  cheer: ({ dur = 3, n = 40 } = {}) => { const b = buf(dur);
    for (let k = 0; k < n; k++) { const at = Math.abs(noise()) * (dur - 0.25), p = 1.4 + Math.abs(noise()) * 0.8;
      mixInto(b, sweep(500 * p, 900 * p, 0.22, 7, 'sq'), 0.12, at); } return b; },
  ding: () => { const b = buf(1.4); for (let i = 0; i < b.length; i++) { const t = i / SR;
    b[i] = (Math.sin(TAU * 1568 * t) + 0.5 * Math.sin(TAU * 3136 * t) * Math.exp(-t * 3) + 0.3 * Math.sin(TAU * 4702 * t)) * Math.exp(-t * 3.5) * 0.5; } return b; },
  sparkle: () => { const b = buf(1.2); [84, 88, 91, 96, 100].forEach((m, k) => mixInto(b, marimba(midi(m), 0.6, 1.5), 0.4, k * 0.06)); return b; },
  wahwah: () => { const b = buf(2.4); [[58, 0], [57, 0.5], [56, 1.0], [55, 1.5]].forEach(([m, at], k) => {
    const d = k === 3 ? 0.9 : 0.45, s = buf(d); let ph = 0, lp = 0;
    for (let i = 0; i < s.length; i++) { const t = i / SR; ph += TAU * midi(m) * (1 + (k === 3 ? 0.01 * Math.sin(TAU * 6 * t) : 0)) / SR;
      lp += (0.03 + 0.12 * (0.5 - 0.5 * Math.cos(TAU * 2 * t))) * (((ph / TAU) % 1) * 2 - 1 - lp); s[i] = lp * Math.min(1, t / 0.03) * Math.min(1, (d - t) / 0.05); }
    mixInto(b, s, 1, at); }); return b; },
  splat: () => mixInto(noiseBurst(0.35, 0.25, 16), sweep(220, 70, 0.18, 18), 0.6),
  plop: () => sweep(700, 160, 0.14, 22),
  fart: ({ dur = 1.0, wet = 0.5 } = {}) => { const b = buf(dur); let ph = 0, lp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur, f = 75 + 35 * Math.sin(TAU * 7 * t) + 25 * Math.sin(TAU * 2.3 * t) - 30 * x;
      ph += TAU * f / SR; lp += 0.3 * (noise() - lp);
      const env = Math.min(1, t / 0.02) * Math.min(1, (dur - t) / 0.08) * (0.7 + 0.3 * Math.sin(TAU * 11 * t));
      b[i] = (((ph / TAU) % 1) * 2 - 1) * 0.6 * env + lp * wet * env * 0.9; } return b; },
  gag: () => { const b = buf(0.6); let ph = 0, lp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR; ph += TAU * (260 - 180 * t) / SR; lp += 0.2 * (noise() - lp);
      b[i] = (Math.sign(Math.sin(ph)) * 0.25 + lp * 0.6) * Math.exp(-t * 4) * Math.min(1, t / 0.01); } return b; },
  squeak: ({ dur = 1, rate = 6 } = {}) => { const b = buf(dur);
    for (let k = 0; k * (1 / rate) < dur - 0.12; k++) mixInto(b, sweep(1900 + (k % 2) * 300, 2600, 0.1, 18, 'sq'), 0.3, k / rate); return b; },
  slap: () => mixInto(noiseBurst(0.18, 0.7, 28, true), sweep(400, 120, 0.08, 40), 0.5),
  rev: ({ dur = 1.2 } = {}) => { const b = buf(dur); let ph = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur; ph += TAU * (60 + 140 * x * x + 10 * Math.sin(TAU * 25 * t)) / SR;
      b[i] = (((ph / TAU) % 1) * 2 - 1) * 0.5 * Math.min(1, t / 0.05) * Math.min(1, (dur - t) / 0.1); } return b; },
  clang: ({ pitch = 1 } = {}) => { const b = buf(1.2);
    for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = [1, 2.76, 5.4, 8.93].reduce((v, h, k) => v + Math.sin(TAU * 520 * pitch * h * t) * Math.exp(-t * (4 + k * 3)) / (k + 1), 0) * 0.5 * Math.min(1, t / 0.002); }
    return mixInto(b, noiseBurst(0.05, 0.6, 60, true), 0.4); },
  rumble: ({ dur = 2 } = {}) => { const b = buf(dur); let lp = 0, lp2 = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR; lp += 0.01 * (noise() - lp); lp2 += 0.05 * (lp - lp2);
      b[i] = lp2 * 12 * (0.6 + 0.4 * Math.sin(TAU * 7 * t)) * Math.min(1, t / 0.3) * Math.min(1, (dur - t) / 0.4); } return b; },
  engine: ({ dur = 2, from = 50, to = 120 } = {}) => { const b = buf(dur); let ph = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur, f = from + (to - from) * x; ph += TAU * f / SR;
      const saw = ((ph / TAU) % 1) * 2 - 1, fire = Math.sin(ph * 0.5) > 0 ? 1 : 0.6;
      b[i] = saw * fire * 0.5 * Math.min(1, t / 0.08) * Math.min(1, (dur - t) / 0.12); } return b; },
  hiss: ({ dur = 1.5 } = {}) => { const b = buf(dur); let prev = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, n = noise(); b[i] = (n - prev * 0.6) * 0.45 * Math.min(1, t / 0.05) * Math.min(1, (dur - t) / 0.2); prev = n; } return b; },
  boing: ({ pitch = 1 } = {}) => { const b = buf(0.6); let ph = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR; ph += TAU * (180 * pitch * (1 + 0.6 * Math.exp(-t * 6) * Math.sin(TAU * 9 * t))) / SR;
      b[i] = Math.sin(ph) * Math.exp(-t * 5) * 0.8 * Math.min(1, t / 0.004); } return b; },
  flush: ({ dur = 2.2 } = {}) => { const b = buf(dur); let lp = 0, lp2 = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur; lp += (0.05 + 0.25 * (1 - x)) * (noise() - lp); lp2 += 0.03 * (noise() - lp2);
      b[i] = (lp * 0.9 + lp2 * 2) * Math.min(1, t / 0.05) * (1 - x) ** 0.6 * (0.8 + 0.2 * Math.sin(TAU * 7 * t)); }
    return mixInto(b, sweep(500, 140, 0.9, 3), 0.25, dur * 0.55); },
  bang: () => mixInto(sweep(110, 60, 0.35, 12), noiseBurst(0.2, 0.3, 30), 0.7),
  meow: ({ pitch = 1, dur = 0.6 } = {}) => { const b = buf(dur); let ph = 0, lp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur, f = pitch * (520 + 380 * Math.sin(Math.PI * Math.min(1, x * 1.4)) - 160 * x);
      ph += TAU * f / SR; const saw = ((ph / TAU) % 1) * 2 - 1; lp += (0.08 + 0.25 * Math.sin(Math.PI * x)) * (saw - lp);
      b[i] = lp * 0.9 * Math.min(1, t / 0.03) * Math.min(1, (dur - t) / 0.12); } return b; },
  bell: ({ pitch = 1 } = {}) => { const b = buf(2.5);
    for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = [1, 2.0, 2.4, 3.0, 4.2].reduce((v, h, k) => v + Math.sin(TAU * 220 * pitch * h * t) * Math.exp(-t * (1.2 + k * 0.8)) / (k + 1), 0) * 0.45 * Math.min(1, t / 0.003); }
    return b; },
  snore: ({ dur = 1.6 } = {}) => { const b = buf(dur); let lp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR, x = t / dur; lp += 0.06 * (noise() - lp);
      const buzz = Math.sign(Math.sin(TAU * (55 + 20 * x) * t)) * 0.3; b[i] = (lp * 2 + buzz * 0.4) * Math.sin(Math.PI * x) ** 1.5 * 0.8; } return b; },
  saw: ({ dur = 1.5 } = {}) => { const b = buf(dur); let ph = 0;
    for (let i = 0; i < b.length; i++) { const t = i / SR; ph += TAU * (900 + 120 * Math.sin(TAU * 13 * t)) / SR;
      b[i] = ((((ph / TAU) % 1) * 2 - 1) * 0.35 + noise() * 0.15) * Math.min(1, t / 0.05) * Math.min(1, (dur - t) / 0.1); } return b; },
  coo: () => { const b = buf(0.5); for (let i = 0; i < b.length; i++) { const t = i / SR;
    b[i] = Math.sin(TAU * (420 + 60 * Math.sin(TAU * 6 * t)) * t) * Math.sin(Math.PI * t / 0.5) * 0.5; } return b; },
  steps: ({ dur = 3, rate = 8 } = {}) => { const b = buf(dur);
    for (let t = 0; t < dur - 0.05; t += 1 / rate) mixInto(b, sweep(1400, 900, 0.03, 80), 0.5, t); return b; },
};

function mixInto(dst, src, gain = 1, at = 0) {
  const o = Math.round(at * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * gain;
  return dst;
}

// ---------- music ----------
const PROG = { major: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], march: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]], sad: [[9, 12, 16], [5, 9, 12]] };
const ARP = [0, 1, 2, 1, 3, 2, 1, 2];
export function music(spec, len) {
  const out = buf(len), { bpm = 120 } = spec, beat = 60 / bpm, bar = beat * 4;
  for (const s of spec.sections) {
    const root = KEYS[s.key ?? spec.key ?? 'C'], dur = s.to - s.from;
    const put = (b, t, g) => { if (t >= 0 && t < dur) mixInto(out, b, g, s.from + t); };
    if (s.style === 'end') {
      [0, 4, 7, 12, 16].forEach((n, k) => put(marimba(midi(root + n), 2.2), k * 0.05, 0.35));
      put(bass(midi(root - 24), 1.8), 0, 0.6); put(kick(), 0, 0.8); put(pad([0, 4, 7].map(n => midi(root + n)), dur), 0, 0.25);
      continue;
    }
    if (s.style === 'sad') {
      PROG.sad.forEach((ch, k) => put(pad(ch.map(n => midi(root - 12 + n)), dur / 2 + 0.5), k * dur / 2, 0.35));
      [16, 14, 12, 11, 9].forEach((n, k) => put(marimba(midi(root + n), 0.9, 0.6), 0.3 + k * 0.7, 0.3));
      continue;
    }
    const prog = s.style === 'march' ? PROG.march : PROG.major;
    for (let b = 0; b * bar < dur; b++) {
      const ch = prog[b % prog.length], t0 = b * bar, notes = [...ch.map(n => root + n), root + ch[0] + 12];
      put(bass(midi(root + ch[0] - 24), beat * 0.9), t0, 0.55); put(bass(midi(root + ch[0] - 24), beat * 0.9), t0 + beat * 2, 0.45);
      if (s.style === 'march') {
        for (let q = 0; q < 4; q++) put(marimba(midi(notes[q % 3] + 12), 0.25), t0 + q * beat, 0.32);
        for (let e = 0; e < 16; e++) put(snare(0.12), t0 + e * beat / 4, [0.5, 0.15, 0.3, 0.15][e % 4]);
        put(kick(), t0, 0.7); put(kick(), t0 + beat * 2, 0.6);
        continue;
      }
      const sub = s.style === 'party' ? 16 : 8, oct = s.style === 'party' ? 12 : 0;
      for (let e = 0; e < sub; e++) put(marimba(midi(notes[ARP[e % 8]] + oct), 0.4), t0 + e * bar / sub, s.style === 'party' ? 0.22 : 0.3);
      for (let q = 0; q < 4; q++) {
        if (q % 2 === 0 || s.style !== 'bouncy') put(kick(), t0 + q * beat, 0.6);
        put(hat(), t0 + q * beat + beat / 2, 0.35);
        if (q % 2 === 1) put(s.style === 'party' ? clap() : snare(0.1), t0 + q * beat, s.style === 'party' ? 0.5 : 0.25);
      }
    }
  }
  return out;
}

// ---------- WAV io ----------
export function readWav(file) {
  const d = fs.readFileSync(file); let p = 12, fmt, data;
  while (p < d.length) { const id = d.toString('ascii', p, p + 4), sz = d.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = { ch: d.readUInt16LE(p + 10), sr: d.readUInt32LE(p + 12), bits: d.readUInt16LE(p + 22), tag: d.readUInt16LE(p + 8) };
    if (id === 'data') data = d.subarray(p + 8, p + 8 + sz); p += 8 + sz + (sz & 1); }
  if (fmt.sr !== SR) throw new Error(`${file}: expected ${SR} Hz, got ${fmt.sr}`);
  const n = data.length / (fmt.bits / 8) / fmt.ch, out = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let c = 0; c < fmt.ch; c++) { const o = (i * fmt.ch + c) * fmt.bits / 8;
    s += fmt.bits === 16 ? d.readInt16LE(o) / 32768 : d.readFloatLE(o); } out[i] = s / fmt.ch; }
  return out;
}
export function writeWav(file, L, R) {
  const n = L.length, b = Buffer.alloc(44 + n * 8);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 8, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(3, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 8, 28); b.writeUInt16LE(8, 32); b.writeUInt16LE(32, 34); b.write('data', 36); b.writeUInt32LE(n * 8, 40);
  for (let i = 0; i < n; i++) { b.writeFloatLE(L[i], 44 + i * 8); b.writeFloatLE(R[i], 48 + i * 8); }
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, b);
}

// ---------- mix ----------
export function render(spec) {
  const len = spec.duration, n = Math.round(len * SR), L = new Float32Array(n), R = new Float32Array(n);
  const vo = spec.vo ? readWav(spec.vo.file) : new Float32Array(0);
  // voice envelope for ducking (fast attack, slow release)
  const env = new Float32Array(n); let e = 0;
  for (let i = 0; i < n; i++) { const a = Math.abs(vo[i] ?? 0); e = a > e ? e + (a - e) * 0.01 : e * 0.99985; env[i] = Math.min(1, e * 6); }
  const mus = spec.music ? music(spec.music, len) : buf(len), mg = spec.music?.gain ?? 0.4, duck = spec.music?.duck ?? 0.6;
  for (let i = 0; i < n; i++) { const m = mus[i] * mg * (1 - duck * env[i]), v = (vo[i] ?? 0) * (spec.vo?.gain ?? 1); L[i] += m + v; R[i] += m + v; }
  for (const [name, t, o = {}] of spec.sfx ?? []) {
    if (!SFX[name]) throw new Error(`unknown sfx "${name}"`);
    const s = SFX[name](o), g = o.gain ?? 0.5, pan = o.pan ?? 0, at = Math.round(t * SR);
    for (let i = 0; i < s.length && at + i < n; i++) if (at + i >= 0) { L[at + i] += s[i] * g * (1 - Math.max(0, pan)); R[at + i] += s[i] * g * (1 + Math.min(0, pan)); }
  }
  return { L, R };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [specPath, out] = process.argv.slice(2);
  const spec = (await import(pathToFileURL(path.resolve(specPath)).href)).default;
  const { L, R } = render(spec);
  writeWav(out, L, R);
  console.log(`Wrote ${out} (${spec.duration}s, ${spec.sfx?.length ?? 0} sfx, ${spec.music?.sections.length ?? 0} music sections)`);
}
