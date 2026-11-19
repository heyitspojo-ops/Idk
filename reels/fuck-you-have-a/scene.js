// Fuck, You Have a Pimple — vertical toy-diorama reel. Brief: briefs/fuck-you-have-a.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildBathroom } from '../../bucket-shared/world-bathroom.js';
import { buildHouse } from '../../bucket-shared/world-house.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildHighway } from '../../bucket-shared/world-highway.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { buildCar } from '../../bucket-shared/car-toy.js';
import { pimple as buildPimple, safetyPinCrate, handMirror, smoke, sparkle, splat } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 500);
const { key } = toyLights(scene);
const OFF = { bath: new THREE.Vector3(), room: new THREE.Vector3(200, 0, 0), street: new THREE.Vector3(400, 0, 0), road: new THREE.Vector3(700, 0, 0) };
const SKY = { bath: '#efe2fb', room: '#f6e7d8', street: '#bfe7f5', road: '#bfe7f5' };
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));

// ---------- worlds ----------
const bath = buildBathroom(); scene.add(bath.group);
const room = buildHouse(); room.group.position.copy(OFF.room); scene.add(room.group);
const street = buildStreet(); street.group.position.copy(OFF.street); scene.add(street.group);
const road = buildHighway(); road.group.position.copy(OFF.road); scene.add(road.group);
// ---------- cast & props ----------
const you = buildToyPerson(); scene.add(you.group);
you.anchors.butt.visible = false; // the butt pimple replaces the yoga-ball butt
const zit = buildPimple(); scene.add(zit);
const crate = safetyPinCrate(); crate.rotation.y = Math.PI; crate.position.y = 0.05;
const truck = buildCar({ style: 'truck', body: '#5fa8d3', rust: false, cargo: crate }); scene.add(truck.group);
const mirrorProp = handMirror(); you.anchors.handR.add(mirrorProp); mirrorProp.rotation.set(Math.PI - 0.5, Math.PI, 0);
const goo = Array.from({ length: 3 }, (_, i) => { const s = splat(0.25, i); scene.add(s); return s; });
const dust = smoke({ n: 12, size: 2.4, color: '#e9dccb' }); scene.add(dust);
const boomPuff = smoke({ n: 18, size: 4, color: '#fff7e6' }); scene.add(boomPuff);
const sparks = Array.from({ length: 6 }, () => { const s = sparkle(0.3); scene.add(s); return s; });

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:40px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add('YOU HAVE<br>A PIMPLE', 'left:0;right:0;top:300px;text-align:center;font-size:130px;line-height:1.04;');
const popTxt = ui.add('POP!', 'left:0;right:0;top:330px;text-align:center;font-size:200px;color:#ffd166;');
const ball3 = ui.add(pill('PIMPLE BASKETBALL', '#f4a340'), 'left:0;right:0;top:300px;text-align:center;font-size:84px;');
const boom = ui.add('BOOM', 'left:0;right:0;top:360px;text-align:center;font-size:230px;color:#ffd166;');
const flash = ui.add('', 'inset:0;background:#fffaf0;');
const end = ui.add(`<div>${[...'CLEAR SKIN.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:120px;');
const endL = [...end.querySelectorAll('span')];

// ---------- the pimple: where it is and how big ----------
const POPS = [T.pop1, T.chinPop, T.legPop, T.backPop, T.buttPop];
const SPOTS = [ // [from, spot, size]
  [0, 'nose', 0.2], [T.cheek, 'cheek', 0.28], [T.chin, 'chin', 0.36], [T.legPop + 0.4, 'leg', 0.55], [T.backPop + 0.4, 'back', 0.8], [T.buttPop + 0.4, 'butt', 1.2]];
function placeZit(t) {
  const cur = [...SPOTS].reverse().find(s => t >= s[0]), [, spot, base] = cur;
  const justPopped = POPS.some(p => t > p && t < p + 0.4) && !(t >= cur[0] && t < cur[0] + 0.05);
  const appear = Math.min(1, pop(t, cur[0], 7, 13));
  let size = base * (cur[0] ? appear : 1);
  if (t > T.mirror && t < T.zit) return show(zit, false);
  if (t >= T.zit) { you.anchors.nose.add(zit); zit.position.set(0, 0, 0); zit.rotation.set(0, 0, 0); zit.set({ t, size: 0.18 * Math.min(1, pop(t, T.zit, 7, 13)) }); return show(zit, true); }
  show(zit, true);
  if (spot === 'butt') { you.anchors.hips.add(zit);
    if (t > T.grow[0]) size = lerp(1.2, 5.2, smooth(seg(t, ...T.grow)));
    zit.position.set(0, 0.15 + size * 0.15, -0.25 - size * 0.42); zit.rotation.set(0, Math.PI, 0);
    const sq = t > T.land && t < T.bounce[1] ? Math.max(0, Math.cos(((t - T.land) / 1.0) * Math.PI * 2)) : 0;
    zit.scale.set(size * (1 + sq * 0.15), size * (1 - sq * 0.2), size);
    zit.set({ t, size, throb: 1, popped: t > T.hit ? seg(t, T.hit, T.hit + 0.5) : 0 }); zit.scale.y *= 1 - sq * 0.2;
    if (t > T.hit + 0.5) show(zit, false);
    return; }
  you.anchors[spot].add(zit); zit.position.set(0, 0, 0); zit.rotation.set(0, 0, 0);
  zit.set({ t, size, popped: justPopped ? seg(t, POPS.find(p => t > p && t < p + 0.4), POPS.find(p => t > p && t < p + 0.4) + 0.4) : 0 });
}

// ---------- per-frame ----------
const bounceAt = t => { // you bouncing on the butt pimple across the street (x) then onto the highway
  const k = (t - T.land) / 1.0, h = Math.abs(Math.sin(k * Math.PI)) * (t < 31.5 ? 9 : 4);
  return h;
};
function stage(t) {
  const Y = you.group; Y.rotation.set(0, 0, 0);
  let yp = { t, mood: -0.4 };
  show(truck.group, t > T.truck[0] && t < 40.2); dust.set(0); boomPuff.set(0); goo.forEach(g => show(g, false)); sparks.forEach(s => show(s, false));
  show(mirrorProp, t > T.mirror);
  if (t < 19) { Y.position.set(0, 0, 1.4); Y.rotation.y = t > 15.3 ? Math.PI : 0;
    const squeezing = POPS.some(p => t > p - 0.6 && t < p + 0.2);
    Object.assign(yp, { mood: POPS.some(p => t > p && t < p + 1.0) ? 0.9 : -0.7, hold: squeezing && t < 13.5 ? 1 : 0, lather: squeezing && t < 13.5 ? 0.0 : 0 });
  }
  else if (t < 23) { Y.position.copy(OFF.room).add(new THREE.Vector3(1.4, 0, 0.8)); Y.rotation.y = -0.6;
    Object.assign(yp, { mood: -1, look: -1.0, tilt: Math.sin(t * 2) * 0.1 }); }
  else if (t < 31.5) { const S = OFF.street; Y.rotation.y = Math.PI / 2;
    if (t < T.jump) { const up = smooth(seg(t, T.roof, T.roof + 1.5)); Y.position.set(S.x - 1.0, lerp(0, 5.7, up), S.z - 8.6 + up * 0.6); Object.assign(yp, { mood: -1, walk: up < 1 ? 1 : 0 }); }
    else if (t < T.land) { const f = seg(t, T.jump, T.land); Y.position.set(S.x - 1.0 + f * 3, lerp(5.7, 2.6, easeIn(f)) + Math.sin(f * Math.PI) * 2, S.z - 8 + f * 6); Y.rotation.z = -f * 0.4; Object.assign(yp, { mood: -1, wave: 1 }); }
    else { const k = t - T.land; Y.position.set(S.x + 2 + k * 9, 2.6 + bounceAt(t), S.z - 2); Y.rotation.z = Math.sin(t * 3) * 0.3; Object.assign(yp, { laugh: 1, mood: -1, wave: 1 }); } }
  else if (t < 38.7) { const R = OFF.road, k = seg(t, 31.5, 35);
    Y.position.set(R.x + 1.2, 2.6 + (t < 35 ? bounceAt(t) * (1 - k) : 0), R.z + lerp(-2, 6, k)); Y.rotation.y = Math.PI;
    Object.assign(yp, { mood: -1, laugh: t > 35.5 ? 1 : 0.3, wave: t > 35.5 ? 1 : 0 });
    const tz = lerp(-70, 6 - 6.6, easeIn(seg(t, ...T.truck)));
    truck.group.position.set(R.x + 1.2, 0, tz); truck.set({ t, speed: 30 }); }
  else if (t < 42.5) { const f = seg(t, ...T.fly), R = OFF.road;
    Y.position.set(R.x + 1.2 - f * 8, 2.6 + Math.sin(f * Math.PI) * 40, R.z + 6 + f * 40); Y.rotation.set(f * 8, 0, f * 5);
    truck.group.position.set(R.x + 1.2, 0, 6 - 6.6 - f * 6); truck.set({ t, speed: 10 });
    boomPuff.position.set(R.x + 1.2, 2.6, R.z + 5.4); boomPuff.set(seg(t, T.hit, T.hit + 1.6));
    Object.assign(yp, { mood: -1, laugh: 1 }); }
  else { const O = OFF.room, f = seg(t, 42.5, T.crash);
    Y.position.copy(O).add(new THREE.Vector3(-1.4, lerp(14, 0.55, easeIn(f)), -2.1)); Y.rotation.y = 0;
    dust.position.copy(O).add(new THREE.Vector3(-1.4, 1, -2.1)); dust.set(seg(t, T.crash, T.crash + 1.5));
    Object.assign(yp, { sit: t > T.crash ? 1 : 0, mood: t > T.crash + 0.6 ? 1 : -1, hold: t > T.mirror ? 0.55 : 0, look: t > T.mirror ? 0.25 : 0 });
    sparks.forEach((s, i) => { show(s, t > T.crash + 0.8 && t < T.mirror); const a = t * 3 + i; s.position.copy(O).add(new THREE.Vector3(-1.4 + Math.cos(a) * 1.2, 3.6, -2.1 + Math.sin(a) * 0.4)); }); }
  you.pose(yp);
  scene.updateMatrixWorld(); placeZit(t);
}

function screen(t) {
  const pp = (el, a, b) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, 15))})`; };
  pp(title, T.title, 2.95);
  const lastPop = [...POPS].reverse().find(p => t > p);
  popTxt.style.opacity = lastPop !== undefined && t < lastPop + 0.9 ? 1 : 0; popTxt.style.transform = `scale(${Math.max(0.01, pop(t, lastPop ?? 0, 8, 15))}) rotate(${(POPS.indexOf(lastPop) % 2 ? 6 : -6)}deg)`;
  pp(ball3, T.basketball, 31.4); pp(boom, T.hit, T.hit + 1.4);
  flash.style.opacity = t > T.hit && t < T.hit + 0.4 ? 1 - seg(t, T.hit, T.hit + 0.4) : 0;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.05, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.05 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1], k = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = s.track === 'zit' ? zit.getWorldPosition(new THREE.Vector3()) : s.track === 'sky' ? you.group.position.clone() : s.track === 'you' ? you.group.position.clone().setY(0) : OFF[s.world].clone();
  const shake = t > T.hit && t < T.hit + 0.6 ? 0.25 : t > T.crash && t < T.crash + 0.4 ? 0.15 : 0;
  camera.position.copy(lerpV(a.p, b.p, k)).add(base); camera.position.x += Math.sin(t * 80) * shake; camera.position.y += Math.cos(t * 70) * shake;
  const look = lerpV(a.l, b.l, k).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  scene.background = new THREE.Color(SKY[s.world]);
  key.place(look, 12);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); scene.updateMatrixWorld(); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
