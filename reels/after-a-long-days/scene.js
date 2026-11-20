// After a Long Day's Work, This Freak Climbs in Bed — vertical toy-diorama reel. Brief: briefs/after-a-long-days.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, pop, lerp, mesh, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildHouse } from '../../bucket-shared/world-house.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { bed as buildBed, slidingWindow, lockDoor, sawBlade, trashCan } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';
import { snap, hop, dynamicCamera } from '../../bucket-shared/motion-fx.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 600);
const { hemi, key } = toyLights(scene);
const OFF = { room: new THREE.Vector3(), street: new THREE.Vector3(400, 0, 0) };
const show = (o, v) => (o.visible = v);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const HALF = Math.PI / 2;

// ---------- worlds ----------
const house = buildHouse({ ceiling: true, furniture: false, wall: '#cfd7f0', accent: '#7b6fb0' }); scene.add(house.group);
const R = house.group, ceil = house.ceiling;
const street = buildStreet(); street.group.position.copy(OFF.street); scene.add(street.group);
const S = street.group;
const lamp = new THREE.PointLight('#ffc98a', 0, 9, 1.6); at(lamp, 2.6, 3.0, -2.6, R);
const fill = new THREE.PointLight('#c9d4ff', 0, 8, 1.4); at(fill, 0.2, 4.2, -1.0, R);   // lights faces seen from below the ceiling

// ---------- cast & props ----------
const you = buildToyPerson({ shirt: '#5fa8d3', pants: '#3b3f52', seed: 3 });
const creep = buildToyPerson({ creepy: true, shirt: '#e2577a', pants: '#2b2233', hair: '#1f1b2b', skin: '#f2d2b6', seed: 21 });
R.add(you.group, creep.group);
const bed = at(buildBed({ blanket: '#7b6fb0' }), 0, 0, -1.6, R); bed.scale.x = 1.4;
const win = at(slidingWindow(), -5.3, 1.2, -1.2, R); win.rotation.y = HALF;
const door = at(lockDoor(), 5.3, 0, 1.5, R); door.rotation.y = -HALF;
const saw = sawBlade(0.45); R.add(saw);
const can = at(trashCan(), 3.4, 0, 0.9, S);
const HOLE = { x: -0.6, z: -2.4, r: 0.9 };
const dust = Array.from({ length: 14 }, (_, i) => { const d = at(mesh(ball(0.06 + (i % 3) * 0.03, 0), '#efe4d0'), 0, 0, 0, R); d.userData = { a: i * 2.4, r: (i % 4) * 0.18, d: (i % 5) * 0.12 }; return d; });

// lying in bed: head on the pillow (-z), feet to +z; roll turns them on their side
const YOU_BED = V(-0.6, 1.2, -0.7), CREEP_BED = V(0.7, 1.25, -0.7);
const lie = (o, p, roll = 0) => { o.position.copy(p); o.rotation.set(-HALF, roll, 0); };
const stand = (o, p, ry = 0) => { o.position.copy(p); o.rotation.set(0, ry, 0); };
const squash = (o, q) => o.scale.set(q.xz, q.y, q.xz);
// hop between standing (rot 0) and lying (rot -90°): tips over while in the air
function hopTo(o, t, t0, dur, a, b, h, { toBed = true, ry = 0, roll = 0 } = {}) {
  const q = hop(t, t0, dur, a, b, h), k = smooth(seg(t, t0 + dur * 0.18, t0 + dur * 0.8));
  o.position.copy(q.pos); o.rotation.set(-HALF * (toBed ? k : 1 - k), lerp(ry, roll, toBed ? k : 1 - k), 0); squash(o, q.squash);
}

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:44px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add("WHO'S IN<br>MY BED", 'left:0;right:0;top:300px;text-align:center;font-size:130px;line-height:1.04;');
const cards = ['NIGHT 2', 'NIGHT 3', 'NIGHT 4'].map(s => ui.add(pill(s, '#2b2233', '#ffd166'), 'left:0;right:0;top:300px;text-align:center;font-size:110px;'));
const boot = ui.add('BOOT!', 'left:0;right:0;top:330px;text-align:center;font-size:220px;color:#ffd166;');
const end = ui.add(`<div>${[...'NOT SWEET.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:130px;');
const endL = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
function stage(t) {
  const Y = you.group, C = creep.group;
  [Y, C].forEach(o => { o.scale.setScalar(1); o.rotation.set(0, 0, 0); });
  let yp = { t, mood: -0.8 }, cp = { t, mood: 1 };
  R.add(Y); R.add(C); show(Y, true); show(C, true);

  // ---- you
  if (t < T.scream) { lie(Y, YOU_BED); Object.assign(yp, { sleep: t < T.eyesOpen ? 1 : 0, mood: t < T.eyesOpen ? 0 : -0.8, stare: snap(t, T.eyesOpen, 0.25) * (t < T.grin + 1.5 ? 1 : 0.3) }); }
  else if (t < 12) { stand(Y, V(-0.4, 0.62, -1.0), HALF); Y.scale.setScalar(Math.min(1.15, 0.85 + snap(t, T.scream, 0.3) * 0.15));
    Object.assign(yp, { sit: 1, hold: t < T.climbOut + 0.4 ? 1 : 0, fold: t > T.climbOut + 0.4 ? 1 : 0, mood: -1 }); }
  else if (t < T.bedHop2) { stand(Y, V(3.6, 0, 1.9), HALF); Object.assign(yp, { hold: 1, mood: -1 }); Y.position.x += T.locks.reduce((s, e) => s + (t > e && t < e + 0.15 ? 0.12 : 0), 0); }
  else if (t < T.jumpUp) { hopTo(Y, t, T.bedHop2, 0.6, V(3.6, 0, 1.9), YOU_BED, 2.0, { ry: HALF });
    Object.assign(yp, { sleep: t < T.spoon + 0.2 ? 1 : 0, mood: t < T.spoon ? 0 : -1, stare: snap(t, T.spoon + 0.2, 0.3) * 0.5 }); }
  else if (t < 23) { hopTo(Y, t, T.jumpUp, 0.5, YOU_BED, V(0.8, 0, 1.6), 1.6, { toBed: false, ry: HALF });
    if (t > T.jumpUp + 0.5) Y.rotation.set(0, HALF, 0);
    Object.assign(yp, { mood: -1, kick: smooth(seg(t, T.kick - 0.15, T.kick)) * (1 - seg(t, T.kick + 0.35, T.kick + 0.6)), kickReach: 1.6 }); }
  else if (t < 24.5) show(Y, false);
  else if (t < T.bedHop4) { stand(Y, V(-4.3, 0, -1.2), -HALF); const b = T.bolts.find(e => t > e - 0.2 && t < e + 0.1);
    Object.assign(yp, { mood: -1, swing: b ? smooth(seg(t, b - 0.2, b)) : 0 }); }
  else if (t < 32) { hopTo(Y, t, T.bedHop4, 0.6, V(-4.3, 0, -1.2), YOU_BED, 2.0, { ry: -HALF });
    Object.assign(yp, { sleep: t < T.dust + 0.4 ? 1 : 0, mood: t < T.dust + 0.4 ? 0 : -1, stare: t > T.peek ? snap(t, T.peek, 0.25) : 0 }); }
  else if (t < 36) { S.add(Y); stand(Y, V(0, 0, -4.4), 0.4); Object.assign(yp, { mood: -1, swing: t < T.fling ? 0 : smooth(seg(t, T.fling, T.fling + 0.15)) }); }
  else if (t < T.flop) { const top = V(-0.6, 0.9, -1.6); hopTo(Y, t, T.patch - 0.25, 0.5, top, top, 2.8, { toBed: false }); Y.rotation.set(0, 0, 0);
    Object.assign(yp, { mood: -1, swing: t < T.patch ? 0 : smooth(seg(t, T.patch, T.patch + 0.1)) * 0.4 }); }
  else { hopTo(Y, t, T.flop, 0.5, V(-0.6, 0.9, -1.6), YOU_BED, 1.0);
    Object.assign(yp, { mood: t < T.doorBurst ? 0 : -1, sleep: t < T.doorBurst ? 0.8 : 0, stare: t < T.dive[1] ? 0.5 * snap(t, T.doorBurst, 0.2) : t < 44 ? 0.6 : 1 }); }
  you.pose(yp);

  // ---- the creep
  const BED_SIDE = V(3.0, 0, -1.0);
  if (t < T.creepIn[0] - 0.4) show(C, false);
  else if (t < T.climbOut) { hopTo(C, t, T.creepIn[0], 0.7, BED_SIDE, CREEP_BED, 1.6, { ry: -HALF, roll: -HALF });
    Object.assign(cp, { hug: t > T.grin ? 0.35 : 0 }); if (t > T.grin && t < 6) C.position.x -= 0.15 * snap(t, T.grin, 0.3); }
  else if (t < T.backOut[0]) { hopTo(C, t, T.climbOut, 0.55, CREEP_BED, V(2.4, 0, 0.4), 1.4, { toBed: false, ry: -HALF, roll: -HALF }); if (t > T.climbOut + 0.55) C.rotation.set(0, -HALF, 0); }
  else if (t < 11.4) { const k = seg(t, ...T.backOut); stand(C, V(lerp(2.4, 6.6, k * k), Math.abs(Math.sin(k * 14)) * 0.25, lerp(0.4, 1.5, k)), -HALF); Object.assign(cp, { wave: 1 }); }
  else if (t < T.slither[0]) show(C, false);
  else if (t < T.jumpUp + 0.4) {
    if (t < T.bedHop3) { const q = hop(t, T.slither[0], 0.8, V(-7.0, 1.4, -1.2), V(-4.0, 0, -1.2), 0.9); C.position.copy(q.pos); C.rotation.set(0, HALF, -0.6 * (1 - seg(t, T.slither[0], T.slither[1]))); squash(C, q.squash); }
    else hopTo(C, t, T.bedHop3, 0.6, V(-4.0, 0, -1.2), CREEP_BED, 2.4, { ry: HALF, roll: -HALF });
    Object.assign(cp, { hug: snap(t, T.spoon, 0.3) }); }
  else if (t < 23) {
    if (t < T.kick) { hopTo(C, t, T.jumpUp + 0.4, 0.5, CREEP_BED, V(2.6, 0, 1.6), 1.4, { toBed: false, roll: -HALF, ry: -HALF }); if (t > T.jumpUp + 0.9) C.rotation.set(0, -HALF, 0); Object.assign(cp, { wave: 1 }); }
    else { const k = t - T.kick; stand(C, V(2.6 + k * 14, 1 + k * 6 - k * k * 6, 1.6), -HALF); C.rotation.z = -k * 16; } }
  else if (t < 24.5) { S.add(C); const k = seg(t, ...T.fly), bx = [6, 11, 14.5, 17], bi = T.bounces.findIndex((e, i) => t < (T.bounces[i + 1] ?? 99));
    if (t < T.fly[1]) C.position.set(lerp(0, 6, k), 1.2 + Math.sin(k * Math.PI) * 4, lerp(-5.4, 1.0, k));
    else { const e0 = T.bounces[bi], e1 = T.bounces[bi + 1] ?? e0 + 0.3, u = seg(t, e0, e1); C.position.set(lerp(bx[bi], bx[bi + 1], u), Math.sin(u * Math.PI) * (1.6 / (bi + 1)), 1.0); }
    C.rotation.set(0, 0, -t * 14); }
  else if (t < T.peek) show(C, false);
  else if (t < 32) { C.position.set(HOLE.x, lerp(10.4, 8.7, Math.min(1.1, snap(t, T.peek, 0.3))), HOLE.z); C.rotation.set(0, 0, Math.PI); }
  else if (t < 36) { S.add(C);
    if (t < T.fling) { C.position.set(0.2, 3.9 + Math.sin(t * 20) * 0.08, -4.2); C.rotation.set(0, 0, HALF); Object.assign(cp, { wave: 1 }); }
    else { const k = seg(t, T.fling, T.can); C.position.set(lerp(0.2, 3.4, k), lerp(3.9, 3.0, k) + Math.sin(k * Math.PI) * 4, lerp(-4.2, 0.9, k)); C.rotation.set(0, 0, HALF + k * (HALF + Math.PI * 2)); } }
  else if (t < T.doorBurst) show(C, false);
  else if (t < T.dive[0]) { stand(C, V(4.4, 0, 1.4), -HALF); C.scale.setScalar(Math.min(1.1, snap(t, T.doorBurst, 0.25))); Object.assign(cp, { wave: 1 }); }
  else { hopTo(C, t, T.dive[0], 0.8, V(4.4, 0, 1.4), CREEP_BED, 2.6, { ry: -HALF, roll: -HALF });
    const pat = t > T.timelapse[0] && t < T.morning ? 0.15 * Math.sin(t * 9) : 0;
    Object.assign(cp, { hug: Math.min(1, snap(t, T.dive[1], 0.3)) - Math.abs(pat), sleep: t > T.morning && t < T.creepEyes ? 1 : 0 });
    if (t > T.creepEyes) cp.hug = 0.3;
    if (t > T.hold && t < 44) C.position.x -= 0.12 + Math.sin(t * 5) * 0.04;
    if (t > T.creepEyes) C.rotation.y = lerp(-HALF, -0.5, Math.min(1, snap(t, T.creepEyes, 0.15))); }
  creep.pose(cp);

  // ---- door, window, ceiling, saw, dust, trash can
  const shut = t > T.doorShut && t < T.kick || t > T.kick + 0.6 && t < T.doorBurst || t > T.doorBurst + 1;
  const opn = t > T.doorOpen && t < T.doorShut ? Math.min(1, snap(t, T.doorOpen, 0.25)) : t > T.kick && t < T.kick + 0.6 ? 1 : t > T.doorBurst && t < T.doorBurst + 1 ? Math.min(1.1, snap(t, T.doorBurst, 0.2)) : 0;
  door.set({ open: shut ? 0 : opn, locks: T.locks.filter(e => t > e).length });
  win.set({ open: t > T.winOpen && t < T.bedHop3 + 0.3 ? Math.min(1, snap(t, T.winOpen, 0.2)) : 0, bolts: T.bolts.filter(e => t > e).length / 4 + 0.01,
    moonX: lerp(-0.8, 0.8, smooth(seg(t, ...T.timelapse))) });
  const cut = seg(t, ...T.cut);
  ceil.hole({ ...HOLE, cut: t < T.cut[1] ? cut : 0, open: t > T.plug ? Math.min(1, seg(t, T.plug, T.plug + 0.3)) : 0, patched: t > T.patch });
  show(saw, t > T.cut[0] && t < T.cut[1]); const a = cut * Math.PI * 2;
  saw.position.set(HOLE.x + Math.cos(a) * HOLE.r, 6.85, HOLE.z + Math.sin(a) * HOLE.r); saw.rotation.set(HALF, 0, -a); saw.set({ t });
  dust.forEach(d => { const u = (t - T.dust - d.userData.d) / 0.8; show(d, u > 0 && u < 1 && t < 32);
    d.position.set(HOLE.x + Math.cos(d.userData.a) * d.userData.r, lerp(6.9, 1.5, u), HOLE.z + 0.2 + Math.sin(d.userData.a) * d.userData.r); });
  can.rotation.z = t > T.can ? Math.sin((t - T.can) * 25) * 0.25 * Math.exp(-(t - T.can) * 3) : 0;

  // ---- night / morning light
  const morning = smooth(seg(t, T.morning - 0.1, T.morning + 0.3));
  hemi.color.set('#7f8fd0').lerp(new THREE.Color('#fff2dc'), morning); hemi.intensity = lerp(0.9, 1.5, morning);
  key.color.set('#9fb4ff').lerp(new THREE.Color('#ffd7a8'), morning); key.intensity = lerp(1.6, 2.6, morning);
  lamp.intensity = (1 - morning) * 14;
  fill.intensity = t > T.cut[0] - 0.2 && t < 32 || t > 36 && t < T.flop ? 18 : 0;
}

function screen(t) {
  const pp = (el, a, b, w = 15) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, w))})`; };
  pp(title, T.title, 3.45); pp(boot, T.boot, T.boot + 1.0);
  [T.night2, T.night3, T.night4].forEach((a, i) => pp(cards[i], a, a + 1.4));
  boot.style.transform += ` rotate(${-8 + Math.sin(t * 30) * 4}deg)`;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.05, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.05 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

const HITS = [T.eyesOpen, T.grin, T.scream, ...T.locks, T.spoon, T.kick, ...T.bounces, ...T.bolts, T.peek, T.can, T.patch, T.doorBurst, T.dive[1], T.creepEyes];
const SKY = { room: '#151a33', street: '#1d2547' };
function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1];
  const look = dynamicCamera(camera, t, s, OFF[s.world].clone(), HITS);
  scene.background = new THREE.Color(SKY[s.world]).lerp(new THREE.Color('#ffd9b0'), smooth(seg(t, T.morning - 0.1, T.morning + 0.3)));
  key.place(look, 12);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); scene.updateMatrixWorld(); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
