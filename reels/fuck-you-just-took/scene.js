// Fuck, You Just Took a Shit at Your Girlfriend's House — vertical toy-diorama reel. Brief: briefs/fuck-you-just-took.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, mat, at } from '../../bucket-shared/toy-kit.js';
import { buildBathroom } from '../../bucket-shared/world-bathroom.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildUsaMap } from '../../bucket-shared/world-usa-map.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { toilet as buildToilet, plunger as buildPlunger, wrapper, shitTornado, sash as buildSash, bulb as buildBulb, smoke, sparkle, poopDrop } from '../../bucket-shared/props.js';
import { textCard } from '../../bucket-shared/toy-kit.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 600);
const { key } = toyLights(scene);
const OFF = { bath: new THREE.Vector3(), street: new THREE.Vector3(400, 0, 0), map: new THREE.Vector3(700, 0, 0) };
const SKY = { bath: '#efe2fb', street: '#bfe7f5', map: '#f6e7d8' };
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));
const brownM = mat('#7a4a2a', { roughness: 0.35 });

// ---------- worlds ----------
const bath = buildBathroom({ door: true }); scene.add(bath.group);
const street = buildStreet(); street.group.position.copy(OFF.street); scene.add(street.group);
const usa = buildUsaMap(); usa.group.position.copy(OFF.map); scene.add(usa.group);
const B = bath.group, door = bath.door;
// ---------- cast & props ----------
const BR = '#7a4a2a';
const you = buildToyPerson({ gooColor: BR }), dad = buildToyPerson({ gooColor: BR, bald: true, mustache: true, big: true, shirt: '#b84a4a', pants: '#3b3f52', hair: '#3b2f2a', skin: '#e8b48f', seed: 12 });
const gf = buildToyPerson({ gooColor: BR, longHair: true, shirt: '#c3b1e1', pants: '#5a4a7a', hair: '#6b4226', skin: '#f0c9a8', seed: 6 });
[you, dad, gf].forEach(p => B.add(p.group));
const loo = at(buildToilet(), 0.2, 0, -3.75, B);
const flood = at(mesh(new THREE.PlaneGeometry(11.6, 8.6), brownM), 0, 0.02, 0, B); flood.rotation.x = -Math.PI / 2;
const gordita = wrapper('GORDITA'); B.add(gordita);
const crunch = wrapper('CRUNCHWRAP'); dad.anchors.handR.add(crunch); crunch.rotation.x = Math.PI / 2; crunch.position.y = -0.15;
const plunge = buildPlunger(); B.add(plunge);
const idea = buildBulb(); B.add(idea);
const mayor = buildSash('MAYOR'); you.anchors.hips.add(mayor); mayor.position.set(0, 0.55, 0.68);
const steam = [-1, 1].map(s => { const sm = smoke({ n: 4, size: 0.5, seed: s + 5, color: '#ffffff' }); dad.anchors.head.add(sm); sm.position.set(s * 0.65, 0.2, 0); return sm; });
const blobs = Array.from({ length: 22 }, (_, i) => { const d = poopDrop(0.18 + (i % 3) * 0.08); d.traverse(o => o.material && (o.material = brownM)); B.add(d);
  d.userData = { x: Math.cos(i * 2.4) * (1.5 + (i % 5)), z: Math.sin(i * 2.4) * (1.2 + (i % 4)) - 0.5, y: 1 + (i % 6) * 0.9 }; return d; });
// street: rocket toilet + jet, tornado; map: little tornado + Detroit label
const rocket = buildToilet(); street.group.add(rocket);
const jet = Array.from({ length: 8 }, (_, i) => { const s = smoke({ n: 4, size: 1.0, seed: i, color: '#7a4a2a' }); street.group.add(s); return s; });
const tornado = shitTornado({ h: 16 }); street.group.add(tornado); tornado.position.set(0, 4, -8);
const miniT = shitTornado({ h: 16 }); usa.group.add(miniT); miniT.scale.setScalar(0.18);
const detroit = at(textCard('DETROIT', 2.6, { w: 1024, h: 260, bg: '#fffaf0', color: '#7b3fa0', size: 170, radius: 40 }), 3.0, 1.6, -3.6, usa.group); detroit.rotation.x = -0.9;
const sparks = Array.from({ length: 6 }, () => { const s = sparkle(0.25); B.add(s); return s; });

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:44px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add("IT WON'T<br>GO DOWN", 'left:0;right:0;top:300px;text-align:center;font-size:130px;line-height:1.04;');
const bang = ui.add('BANG! BANG!', 'left:0;right:0;top:330px;text-align:center;font-size:140px;color:#ffd166;');
const noTime = ui.add(pill('NO TIME!', '#fffaf0', '#2b2233'), 'left:0;right:0;top:330px;text-align:center;font-size:110px;');
const boom = ui.add('BOOM', 'left:0;right:0;top:360px;text-align:center;font-size:230px;color:#ffd166;');
const dots = ui.add(pill('…', '#fffaf0', '#2b2233'), 'left:0;right:0;top:330px;text-align:center;font-size:140px;');
const flash = ui.add('', 'inset:0;background:#fffaf0;');
const end = ui.add(`<div>${[...'IT FLUSHED.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:120px;');
const endL = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
function stage(t) {
  const Y = you.group, D = dad.group, G = gf.group;
  [Y, D, G].forEach(o => o.rotation.set(0, 0, 0));
  steam.forEach(s => s.set(0)); jet.forEach(s => s.set(0)); sparks.forEach(s => show(s, false));
  let yp = { t, mood: -0.4 }, dp = { t, mood: -1 }, gp = { t, mood: 0 };
  // --- toilet state
  const backHome = t > T.drop[1], away = t > T.launch && !backHome;
  show(loo, !away);
  const level = t < T.press1 ? 0 : t < 3.4 ? smooth(seg(t, T.press1, 2.6)) : 1;
  const drained = seg(t, ...T.drain);
  loo.position.y = t > T.drop[0] && t < T.drop[1] ? lerp(14, 0, easeIn(seg(t, ...T.drop))) : 0;
  loo.set({ t, level: backHome ? 1 - drained : level, dirty: backHome ? 1 - drained : Math.min(1, level * 1.5),
    swirl: (t > T.press1 && t < 2.4) || (t > T.flushFinal && t < T.flushFinal + 1.4), overflow: t > T.overflow[0] && t < T.launch ? smooth(seg(t, ...T.overflow)) : 0,
    press: Math.abs(t - T.press1) < 0.3 || Math.abs(t - T.press2) < 0.3 || Math.abs(t - T.flushFinal) < 0.3 ? 1 : 0 });
  // --- the flood: rises with the overflow, peaks after the launch, drains at the end
  const fl = t < T.overflow[0] ? 0 : t < T.launch ? smooth(seg(t, ...T.overflow)) * 0.6 : t < T.drop[1] ? 1 : 1 - drained;
  show(flood, fl > 0.01); flood.position.y = 0.02 + fl * 0.25; flood.scale.set(0.3 + fl * 0.7, 0.3 + fl * 0.7, 1); flood.position.z = -3.0 * (1 - fl) + 0;
  show(gordita, t > T.gordita && t < 29); gordita.position.set(lerp(0.4, 1.8, seg(t, T.gordita, 10)), flood.position.y + 0.08, -2.4 + Math.sin(t * 2) * 0.2); gordita.rotation.y = t * 0.6;
  // --- mess blobs everywhere after the launch
  blobs.forEach((d, i) => { const p = seg(t, T.launch, T.launch + 0.8); show(d, p > 0 && !backHome);
    d.position.set(d.userData.x * p, lerp(1.2, d.userData.y, Math.sin(Math.min(p, 1) * Math.PI / 2)) * (t > 33 ? 0.4 : 1), d.userData.z * p); });
  // --- you
  Y.position.set(1.5, 0, -2.9); Y.rotation.y = -Math.PI / 2 - 0.35;
  if (t < 7.5) Object.assign(yp, { hold: Math.abs(t - T.press1) < 0.4 || Math.abs(t - T.press2) < 0.4 ? 1 : 0, mood: t > 1.5 ? -1 : 0.2 });
  else if (t < 14) Object.assign(yp, { swingUp: 1, swing: Math.abs(Math.sin(t * 3)) * 0.4, mood: -0.8, look: t > T.bangs[0] ? 1.1 : 0 });
  else if (t < 20.5) { if (t > 17.5) Y.rotation.y = 0.5; Object.assign(yp, { swing: t > T.plunge - 0.3 && t < T.suck[1] ? 1 : 0, swingUp: t < T.suck[0] ? 1 : 0, mood: t > T.suck[0] && t < T.bulb ? -1 : t > T.bulb ? 1 : 0, laugh: t > T.suck[0] && t < 17.5 ? 0.7 : 0 }); }
  else if (t < 29) { const sh = seg(t, T.shove, T.shove + 0.6); Y.position.set(lerp(1.5, 3.6, easeOut(sh)), 0, lerp(-2.9, -1.6, sh)); Y.rotation.y = -1.0;
    Object.assign(yp, { mood: -1, wave: t > T.rage && t < T.shove ? 1 : 0, double: sh * 0.3 }); }
  else { Y.position.set(t < 37 ? 2.6 : 2.4, 0, t < 37 ? -0.6 : 0.2); Y.rotation.y = t < 37 ? -0.2 : -1.0;
    Object.assign(yp, { goo: 1, mood: t > T.flushFinal ? 1 : -0.6, smug: t > 33 && t < 37 ? 1 : 0, wave: t > 33 && t < 37 ? 1 : 0 }); }
  if (t > 49.5) { Y.position.set(1.9, 0, -1.4); Y.rotation.y = -0.6; }
  you.pose(yp); show(mayor, t > T.mayor - 0.3);
  // plunger: in your hands, then sucked into the bowl
  const sucked = seg(t, ...T.suck);
  show(plunge, t > T.plunger && sucked < 1 && t < 20.5);
  if (t < T.suck[0]) { you.anchors.handR.add(plunge); plunge.position.set(0, 0, 0); plunge.rotation.set(0, 0, 0); P(plunge, 1); }
  else { B.add(plunge); const bowl = new THREE.Vector3(0.2, 1.0, -3.5); plunge.position.lerpVectors(new THREE.Vector3(0.6, 2.6, -3.1), bowl, easeIn(sucked)); plunge.rotation.set(Math.PI, sucked * 10, 0); P(plunge, 1 - sucked * 0.9); }
  show(idea, t > T.bulb && t < 20.6); idea.position.set(1.5, 3.9, -2.9); P(idea, pop(t, T.bulb, 6, 12) * 0.9);
  // --- door: bangs, then bursts open
  if (t > T.bangs[0] && t < T.door) door.shake(t, T.bangs.some(b => Math.abs(t - b) < 0.12) ? 3 : 0.4); else door.open(t > T.door ? easeOut(seg(t, T.door, T.door + 0.4)) : 0);
  // --- dad
  show(D, t > T.door && t < 29 || t > 33);
  if (t < 24.5) { const w = seg(t, ...T.dadIn); D.position.set(lerp(-5.6, -3.0, w), 0, -0.2); D.rotation.y = Math.PI / 2;
    Object.assign(dp, { walk: w < 1 ? 1 : 0, wave: t > T.rage ? 1 : 0, laugh: t > T.rage ? 1 : 0 });
    steam.forEach(s => { s.set(t > T.rage ? (t * 1.4) % 1 : 0); }); }
  else if (t < 29) { const s = seg(t, ...T.sit), w = seg(t, T.crunch, T.sit[0]);
    const wx = smooth(Math.min(1, w * 2)), wz = smooth(Math.max(0, w * 2 - 1)); // along the room first, then to the toilet (around the tub)
    D.position.set(lerp(-3.0, 0.2, wx), s > 0 ? lerp(0, 0.35, s) : 0, lerp(-0.2, -3.45, wz)); D.rotation.y = w < 0.5 ? Math.PI / 2 : w < 1 ? Math.PI : 0;
    Object.assign(dp, { walk: w > 0 && w < 1 ? 1 : 0, sit: s, double: t < T.sit[0] ? 0.4 : 0, hold: t > T.crunch && t < T.sit[0] ? 1 : 0, mood: -1 }); }
  else { D.position.set(-1.0, 0, -2.6); D.rotation.y = 0.5; Object.assign(dp, { goo: 1, sit: t < 49.5 ? 1 : 0, mood: t > T.flushFinal ? 0.4 : -1, tilt: Math.sin(t * 2) * 0.1 }); }
  show(crunch, t > T.crunch && t < T.sit[1]);
  dad.pose(dp);
  // --- girlfriend
  show(G, t > T.gf);
  if (t < 49.5) { const w = seg(t, T.gf, T.gf + 0.8); G.position.set(lerp(-5.6, -4.2, w), 0, -0.2); G.rotation.y = Math.PI / 2; Object.assign(gp, { walk: w < 1 ? 1 : 0, mood: -1, slump: t > T.dots ? 0 : 0 }); }
  else { G.position.set(-2.6, 0, -0.6); G.rotation.y = 0.9; Object.assign(gp, { goo: 0.35, mood: -0.6 }); }
  gf.pose(gp);
  // --- street: the launch
  const L = seg(t, T.launch, T.launch + 3.6);
  show(rocket, t > T.launch && t < 33); rocket.position.set(0, 5 + easeOut(L) * 13, -8); rocket.rotation.set(L * 3, L * 6, 0); rocket.set({ t, dirty: 1, level: 1 });
  jet.forEach((s, i) => { s.position.set(0, rocket.position.y - 2 - i * 2.2, -8); s.set(t > T.launch && t < 33 ? 0.3 + (i / 8) * 0.5 : 0); });
  // --- tornado over town, then over the map to Detroit
  const grow = smooth(seg(t, ...T.tornado));
  tornado.set({ t, size: t > T.tornado[0] && t < 45.5 ? grow : 0, rain: t > T.rain ? 1 : 0 });
  const dk = smooth(seg(t, ...T.detroit));
  miniT.position.set(lerp(-2.0, 3.0, dk), 0.6, lerp(1.4, -3.6, dk)); miniT.set({ t, size: t > 45.5 && t < 49.5 ? 1 : 0, rain: 1 });
  show(detroit, t > 45.5); P(detroit, Math.min(1, pop(t, 45.8, 7, 13)));
  // --- clean sparkle at the end
  sparks.forEach((s, i) => { show(s, t > T.flushFinal + 0.4); const a = t * 2 + i; s.position.set(0.2 + Math.cos(a) * 0.9, 1.6 + (i % 3) * 0.4, -3.5 + Math.sin(a) * 0.5); });
}

function screen(t) {
  const pp = (el, a, b, w = 15) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, w))})`; };
  pp(title, T.title, 3.45); pp(bang, T.bangs[0], 13.9); pp(noTime, T.noTime, T.sit[1]); pp(boom, T.boom, T.boom + 1.5); pp(dots, T.dots, 40.4);
  bang.style.transform += ` rotate(${Math.sin(t * 30) * 4}deg)`;
  flash.style.opacity = t > T.boom && t < T.boom + 0.4 ? 1 - seg(t, T.boom, T.boom + 0.4) : 0;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.05, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.05 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1], k = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = OFF[s.world].clone();
  const shake = (t > T.boom && t < T.boom + 0.7) ? 0.25 : t > T.drop[1] && t < T.drop[1] + 0.4 ? 0.15 : 0;
  camera.position.copy(lerpV(a.p, b.p, k)).add(base); camera.position.x += Math.sin(t * 80) * shake; camera.position.y += Math.cos(t * 70) * shake;
  const look = lerpV(a.l, b.l, k).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  scene.background = new THREE.Color(SKY[s.world]);
  key.place(look, s.world === 'map' ? 16 : 12);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); scene.updateMatrixWorld(); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
