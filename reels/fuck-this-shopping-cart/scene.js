// Fuck, This Shopping Cart — vertical toy-diorama reel. Brief: briefs/fuck-this-shopping-cart.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, rbox, ball, at, rng } from '../../bucket-shared/toy-kit.js';
import { buildStore } from '../../bucket-shared/world-store.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { cart as buildCart, ghost as buildGhost, tpPyramid, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';
import { snap, hop, dynamicCamera } from '../../bucket-shared/motion-fx.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
scene.background = new THREE.Color('#fbeedd');
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 200);
const { key } = toyLights(scene);
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));
const R = rng(5);

// ---------- world & cast ----------
const store = buildStore(); scene.add(store.group);
const you = buildToyPerson(), lady = buildToyPerson({ longHair: true, glasses: true, hair: '#d6d3dc', shirt: '#c3b1e1', pants: '#8a7fa8', skin: '#f0c9a8', seed: 8 });
const cartG = buildCart(), spook = buildGhost();
scene.add(you.group, lady.group, cartG, spook);
const handprint = at(mesh(ball(0.16, 1), '#e2574a'), 0.36, -0.08, 0.5, you.anchors.head); handprint.scale.set(1, 1.2, 0.3);
const tp = tpPyramid(); tp.group.position.set(0.4, 0, -20.6); scene.add(tp.group);
const stars = Array.from({ length: 4 }, () => { const s = sparkle(0.22); scene.add(s); return s; });
const box = (c) => { const m = mesh(rbox(0.6, 0.7, 0.55, 0.06), c); scene.add(m); return m; };
const tumble = Array.from({ length: 5 }, (_, i) => box(['#ef7b6c', '#ffd166', '#7cc6a4', '#5fa8d3', '#f4a3b5'][i]));
const fliers = Array.from({ length: 10 }, (_, i) => { const b = box(['#c3b1e1', '#ffd166', '#ef7b6c', '#7cc6a4', '#f4a340'][i % 5]);
  b.userData = { s: i % 2 ? 1 : -1, z: 1 - i * 2.0, sp: R() * 6 }; return b; });

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:40px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add('THIS SHOPPING CART<br>HAS A WOBBLY WHEEL', 'left:0;right:0;top:300px;text-align:center;font-size:100px;line-height:1.05;');
const meR = ui.add(pill('ME: →', '#5fa8d3'), 'left:0;right:0;top:300px;text-align:center;font-size:96px;');
const cartL = ui.add(pill('CART: ←', '#e2577a'), 'left:0;right:0;top:450px;text-align:center;font-size:96px;');
const slap = ui.add('SLAP!', 'left:0;right:0;top:360px;text-align:center;font-size:190px;color:#ffd166;');
const bonk = ui.add('BONK!', 'left:0;right:0;top:360px;text-align:center;font-size:190px;color:#ffd166;');
const mph = ui.add(pill('50 MPH', '#ef7b6c'), 'left:0;right:0;top:300px;text-align:center;font-size:120px;');
const huss = ui.add(pill('HUSS! HUSS! HUSS!', '#fffaf0', '#2b2233'), 'left:0;right:0;top:330px;text-align:center;font-size:92px;');
const boom = ui.add('BOOM', 'left:0;right:0;top:360px;text-align:center;font-size:230px;color:#ffd166;');
const flash = ui.add('', 'inset:0;background:#fffaf0;');
const lines = ui.add(`<svg width="1080" height="1920" viewBox="0 0 1080 1920"><g stroke="#fffaf0" stroke-width="10" stroke-linecap="round" opacity=".75">${
  Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2, r0 = 380 + (i % 3) * 90, r1 = r0 + 260;
    return `<line x1="${540 + Math.cos(a) * r0}" y1="${960 + Math.sin(a) * r0 * 1.5}" x2="${540 + Math.cos(a) * r1}" y2="${960 + Math.sin(a) * r1 * 1.5}"/>`; }).join('')}</g></svg>`, 'inset:0;');
const end = ui.add(`<div>${[...'CLEANUP ON AISLE 5.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:92px;');
const endL = [...end.querySelectorAll('span')];

// ---------- choreography ----------
const path = (t, pts) => { // pts: [[time, x, z, ry], ...] -> smooth piecewise
  if (t <= pts[0][0]) return pts[0].slice(1);
  for (let i = 0; i < pts.length - 1; i++) { const [a, ...A] = pts[i], [b, ...B] = pts[i + 1];
    if (t <= b) { const k = smooth((t - a) / (b - a)); return A.map((v, j) => lerp(v, B[j], k)); } }
  return pts[pts.length - 1].slice(1);
};
function cartAt(t) {
  if (t < 13.5) return path(t, [[0, 0, 8.4, 0], [T.swerve, 0, 7.6, 0], [2.6, -0.3, 7.3, 0.45], [3.0, 0, 7.2, 0], [T.yank[0], 0, 7.0, 0],
    [T.yank[1], -1.5, 5.2, 0.5], [7.2, 0, 4.6, 0], [8.6, 0.2, 3.0, 0.6], [T.bump, -0.38, 1.5, Math.PI / 2],
    [10.3, -0.2, 0.7, Math.PI / 2 - 0.3], [11.0, -0.1, -0.3, Math.PI / 2 - 0.45]]);  // stops at her butt, bounces aside
  if (t < 17) return [0, 4, 0];
  if (t < 21) { const r = t > T.rev[0] && t < T.rev[1] ? Math.sin(t * 60) * 0.06 : 0;
    const [x, z, ry] = path(t, [[17, 0, 0.6, Math.PI], [T.backUp[0], 0, 0.6, Math.PI], [T.backUp[1], 0, -1.6, Math.PI], [T.rev[1], 0, -1.6, Math.PI],
      [T.ram, 0, 1.85, Math.PI], [T.ram + 0.4, 0, 1.3, Math.PI]]); return [x + r, z, ry]; }
  if (t < 26) return [0, 0.6, Math.PI];
  if (t < T.launch) return [t > T.shudder[0] ? Math.sin(t * 50) * 0.05 : 0, 4, 0];
  if (t < T.boom) { const p = seg(t, ...T.run); return [Math.sin(t * 7) * 0.25 * p, 4 - 21.5 * p ** 1.6, Math.sin(t * 5) * 0.08]; }
  if (t < T.rollAway[0]) return [0, lerp(-17.5, -17.0, easeOut(seg(t, T.boom, T.boom + 0.4))), 0];
  return path(t, [[T.rollAway[0], 0, -17.0, 0], [43.4, 0.9, -18.8, -0.5], [45, 2.0, -20.6, -0.9]]);
}

// n quick overshooting pops spread over [a, b] (0..1) instead of one slow swell
const pulses = (t, a, b, n) => { const d = (b - a) / n, i = Math.min(n - 1, Math.floor((t - a) / d)); return Math.min(1.05, (i + Math.min(1.1, snap(t, a + i * d, 0.25))) / n); };
const CHASE = [[0, 6.4], [0.35, 5.4], [0.7, 4.4], [1.0, 3.4]].map(([x, z]) => new THREE.Vector3(x, 0, z));
function stage(t) {
  const Y = you.group, L = lady.group, C = cartG;
  [Y, L].forEach(o => { o.rotation.set(0, 0, 0); o.position.set(0, 0, 0); o.scale.setScalar(1); });
  const [cx, cz, cry] = cartAt(t); C.position.set(cx, 0, cz); C.rotation.set(0, cry, 0);
  const running = t >= T.launch && t < T.boom;
  C.set({ t, wobble: t < T.ghostIn[1] ? 1 : 0, eyes: (t > T.eyes && t < T.ghostOut[0]) ? Math.min(1, pop(t, T.eyes, 7, 13)) : 0,
    squint: (t > T.squint && t < 29) ? 0.6 : t > T.huss - 0.2 && t < 33.5 ? 1 : 0, spin: running ? t * 40 : -cz * 4 });
  const behind = () => { Y.position.set(cx - Math.sin(cry) * 1.75, 0, cz + Math.cos(cry) * 1.75); Y.rotation.y = Math.PI + cry; };
  let yp = { t, butt: t > T.inflate[0] ? pulses(t, T.inflate[0], T.inflate[1], 3) * (1 + Math.sin(t * 12) * 0.03 * (1 - seg(t, 23.6, 24.4))) : 0 };
  let lp = { t, mood: -0.6 };
  // --- you
  if (t < 6.5) { behind(); Object.assign(yp, { push: 1, walk: t < T.yank[1] ? 1 : 0, mood: t > T.swerve ? -0.6 : 0.3 }); }
  else if (t < 10.5) { const i = Math.max(0, Math.min(2, Math.floor((t - 7.0) / 1.0))), q = hop(t, 7.0 + i, 0.5, CHASE[i], CHASE[i + 1], 0.8);
    Y.position.copy(t < 7.0 ? CHASE[0] : q.pos); Y.scale.set(q.squash.xz, q.squash.y, q.squash.xz); Y.rotation.y = Math.PI; Object.assign(yp, { mood: 0 }); }
  else if (t < 13.5) { Y.position.set(0.9, 0, 1.6); Y.rotation.y = -Math.PI / 2;
    Object.assign(yp, { look: t > T.slap ? seg(t, T.slap, T.slap + 0.45) * Math.PI * 2 : 0, mood: t > T.slap ? -1 : 0.2, tilt: t > T.slap + 0.5 ? Math.sin(t * 5) * 0.15 : 0 }); }
  else if (t < 17 || (t >= 26 && t < T.launch)) { behind(); Object.assign(yp, { push: 1, mood: -1, smug: t > T.squint ? 0 : 0.5 }); }
  else if (t < 21) { const hit = seg(t, T.ram, T.ram + 0.35); Y.position.set(0, 0, 3.0 + easeOut(hit) * 0.9); Y.rotation.y = 0;
    Object.assign(yp, { double: hit, mood: t > T.ram ? -1 : -0.3, look: t < T.ram ? -0.6 : 0 }); }
  else if (t < 26) { Y.position.set(0, 0, 3.9); Y.rotation.y = 0.2;
    Object.assign(yp, { look: t > T.lookBack[0] && t < T.proud ? -1.2 * Math.min(1.1, snap(t, T.lookBack[0], 0.25)) : 0, mood: t > T.proud ? 1 : -0.4, smug: t > T.proud ? 1 : 0 }); }
  else if (running) { Y.rotation.set(1.15 + Math.sin(t * 9) * 0.08, Math.PI + cry, Math.sin(t * 13) * 0.1, 'YXZ');
    Y.position.set(cx, 0.55 + Math.sin(t * 11) * 0.12, cz + 1.2 + 2.45); Object.assign(yp, { push: 1, laugh: 1, mood: -1 }); }
  else if (t < 41) { const fly = seg(t, T.boom, T.boom + 0.8); Y.position.set(lerp(0, -1.5, fly), Math.sin(fly * Math.PI) * 2.2, lerp(-15.2, -16.2, fly)); Y.rotation.y = Math.PI - 0.6;
    Object.assign(yp, { mood: -0.8, tilt: Math.sin(t * 4) * 0.12 }); }
  else { const sh = seg(t, T.ghostIn[1], 45); Y.position.set(-1.4 + Math.sin(t * 10) * 0.35 * Math.min(1, sh * 3), 0, lerp(-16.2, -14.8, sh)); Y.rotation.y = -2.4 + Math.sin(t * 10) * 0.25 * sh;
    Object.assign(yp, { mood: t > T.ghostIn[1] ? -0.5 : 0.4, buttEyes: t > T.buttEyes ? Math.min(1, pop(t, T.buttEyes, 7, 13)) : 0, tilt: Math.sin(t * 10) * 0.1 * sh }); }
  you.pose(yp);
  show(handprint, t > T.slap + 0.05 && t < 29);
  // --- old lady
  show(L, t < 13.5 || t > 33.5);
  if (t < 13.5) { const jolt = seg(t, T.bump, T.bump + 0.3);
    L.position.set(-1.75, Math.sin(jolt * Math.PI) * 0.35, 1.5); L.rotation.y = lerp(-Math.PI / 2, Math.PI / 2, Math.min(1.08, snap(t, T.turn[0], 0.3)));
    Object.assign(lp, { wave: t < T.bump ? 0.7 : t > T.slap - 0.25 && t < T.slap + 0.2 ? 1 : 0, mood: t > T.bump ? -1 : 0.3, laugh: t > T.turn[1] && t < T.slap ? 1 : 0 }); }
  else { const fly = seg(t, T.boom, T.landPile);
    L.position.set(0.4, t > T.boom ? Math.sin(fly * Math.PI) * 2 + fly * 0.6 : 0, lerp(-18.4, -20.0, easeOut(fly))); L.rotation.y = 0;
    Object.assign(lp, { sit: t > T.landPile ? 1 : 0, mood: t > T.boom ? -1 : -0.2, tilt: t > T.landPile ? Math.sin(t * 3) * 0.2 : 0 }); }
  lady.pose(lp);
  // --- stars (you after the slap, her after the crash)
  stars.forEach((s, i) => { const a = t * 6 + i * 1.57, onYou = t > T.slap && t < 13.5, onHer = t > T.landPile;
    show(s, onYou || onHer); const h = (onYou ? you : lady).anchors.head.getWorldPosition(new THREE.Vector3());
    s.position.set(h.x + Math.cos(a) * 0.8, h.y + 0.8, h.z + Math.sin(a) * 0.6); s.rotation.z = t * 4; });
  // --- boxes: tumble off the shelf in beat 2; fly as the cart passes in the run
  tumble.forEach((b, i) => { const p = seg(t, T.tumble + i * 0.08, T.tumble + 0.6 + i * 0.08); show(b, t > 3 && t < 13.5);
    b.position.set(-2.3 + p * (0.4 + i * 0.15), lerp(1.3 + (i % 3) * 0.9, 0.35, easeIn(p)), 5.6 + (i - 2) * 0.55); b.rotation.set(p * 2 + i, i, p * 3); });
  fliers.forEach(b => { const { s, z, sp } = b.userData, p = running && cz < z ? seg(z - cz, 0, 4) : 0; show(b, running && t < 33.5);
    b.position.set(s * lerp(2.3, 0.6, p), 1.4 + Math.sin(p * Math.PI) * 2.5, z - p * 2); b.rotation.set(p * sp, p * 3, 0); });
  // --- toilet paper explosion
  tp.rolls.forEach((r, i) => { const p = seg(t, T.boom + 0.15, T.boom + 1.4), a = i * 2.4;
    const v = new THREE.Vector3(Math.cos(a) * (1 + (i % 3)), 0, Math.sin(a) * 1.2 + 1.5);
    r.position.copy(r.userData.home).addScaledVector(v, p * 1.6).add(new THREE.Vector3(0, Math.sin(p * Math.PI) * (2 + (i % 4)) - r.userData.home.y * p + 0.25 * p, 0));
    r.rotation.set(p * (3 + i), p * 2, 0); });
  // --- ghost leaves the cart and dives into your butt
  const out = seg(t, ...T.ghostOut), dive = seg(t, ...T.ghostIn);
  show(spook, out > 0 && dive < 1);
  const from = new THREE.Vector3(cx, 1.6, cz), up = from.clone().add(new THREE.Vector3(0, 1.8, 0)), to = you.anchors.butt.getWorldPosition(new THREE.Vector3());
  spook.position.copy(dive > 0 ? up.clone().lerp(to, easeIn(dive)) : from.clone().lerp(up, easeOut(out)));
  P(spook, lerp(0.2, 1.2, out) * (1 - dive * 0.8)); spook.rotation.set(dive * 1.2, t * 0.5, 0); spook.set({ t });
}

function screen(t) {
  const pp = (el, a, b, k = 8, w = 15) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, k, w))})`; };
  pp(title, T.title, 2.95); pp(meR, T.yank[0], 6.4); pp(cartL, T.yank[0] + 0.5, 6.4); pp(slap, T.slap, 13.2); pp(bonk, T.ram, 20.6);
  pp(mph, T.launch + 0.2, 31.5); pp(huss, T.huss, 33.5); pp(boom, T.boom, T.boom + 1.4);
  huss.style.transform += ` translateY(${Math.sin(t * 20) * 6}px)`;
  lines.style.opacity = t > T.launch && t < T.boom ? 0.8 : 0; lines.style.transform = `scale(${1 + ((t * 3) % 1) * 0.15})`;
  flash.style.opacity = t > T.boom && t < T.boom + 0.4 ? 1 - seg(t, T.boom, T.boom + 0.4) : 0;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.04, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.04 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

const HITS = [T.title, T.swerve, T.yank[1], T.tumble, T.bump, T.slap, T.grip, T.eyes, T.ram, T.inflate[1], T.proud, T.squint, T.launch, T.huss, T.boom, T.landPile, T.ghostIn[1], T.endCard, T.buttEyes];
function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1];
  const base = s.track === 'cart' ? cartG.position.clone() : new THREE.Vector3();
  const look = dynamicCamera(camera, t, s, base, HITS);
  if (t > T.launch && t < T.boom) camera.position.add(new THREE.Vector3(Math.sin(t * 80), Math.cos(t * 70), 0).multiplyScalar(0.04));
  key.place(look, 10);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
