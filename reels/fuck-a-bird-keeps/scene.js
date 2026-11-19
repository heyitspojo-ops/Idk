// Fuck, a Bird Keeps Shitting on Me — vertical toy-diorama reel. Brief: briefs/fuck-a-bird-keeps.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildHouse } from '../../bucket-shared/world-house.js';
import { buildBunker } from '../../bucket-shared/world-bunker.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { buildBird } from '../../bucket-shared/rig-bird.js';
import { poopDrop, shovel, laxative, birdBowl, lawnChair, smoke, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 300);
const { key, hemi } = toyLights(scene);
const OFF = { street: new THREE.Vector3(0, 0, 0), house: new THREE.Vector3(200, 0, 0), bunker: new THREE.Vector3(400, 0, 0) };
const SKY = { street: new THREE.Color('#bfe7f5'), house: new THREE.Color('#f6e7d8'), bunker: new THREE.Color('#3b2a22') };
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));
const show = (o, v) => (o.visible = v);
const V = (x, y, z, w = 'street') => new THREE.Vector3(x, y, z).add(OFF[w]);

// ---------- worlds & cast ----------
const street = buildStreet(), house = buildHouse(), bunker = buildBunker();
house.group.position.copy(OFF.house); bunker.group.position.copy(OFF.bunker);
scene.add(street.group, house.group, bunker.group);
const you = buildToyPerson(), wife = buildToyPerson({ longHair: true, shirt: '#e2577a', pants: '#7a3d5a', hair: '#3b2f4a', skin: '#e8b48f', seed: 5 });
const bird = buildBird();
scene.add(you.group, wife.group, bird.group);
const spade = shovel(); you.anchors.handR.add(spade);
const bottle = laxative(); you.anchors.handR.add(bottle); bottle.scale.setScalar(0.55); bottle.rotation.set(Math.PI, 0, 0); bottle.position.y = -0.35;
const bowl = at(birdBowl(), 4.6, 0, -3.3, street.group);
const chair = at(lawnChair(), 2.4, 0, -2.0, street.group); chair.rotation.y = 0.35;
const hole = at(mesh(new THREE.CircleGeometry(0.9, 12), '#4b3226'), 3.4, 0.03, -3.2, street.group); hole.rotation.x = -Math.PI / 2;
const pile = at(mesh(ball(0.9, 1), '#8a5a44'), 4.7, 0, -4.2, street.group); pile.scale.set(1, 0.6, 1);
const dirt = Array.from({ length: 8 }, () => at(mesh(ball(0.12, 0), '#8a5a44'), 0, 0, 0, scene));
const drops = Array.from({ length: 4 }, () => { const d = poopDrop(0.26); scene.add(d); return d; });
const blast = Array.from({ length: 28 }, (_, i) => { const d = poopDrop(0.12 + (i % 3) * 0.05); scene.add(d);
  d.userData.v = new THREE.Vector3(Math.cos(i * 2.39) * (1 + (i % 4)), 1 + (i % 5) * 0.8, Math.sin(i * 2.39) * (1 + (i % 4)) + 2); return d; });
const poof = smoke({ n: 9, size: 1.4, seed: 7 }); scene.add(poof);
const trail = Array.from({ length: 10 }, (_, i) => { const s = smoke({ n: 5, size: 0.8, seed: i }); scene.add(s); return s; });
const lensDrop = poopDrop(0.5); scene.add(lensDrop);

// ---------- screen text ----------
const ui = overlay();
const bubbleCss = 'background:#fffaf0;color:#2b2233;text-shadow:none;border-radius:60px;padding:30px 46px;box-shadow:0 10px 0 rgba(43,34,64,.3);display:inline-block';
const title = ui.add('A BIRD KEEPS<br>SHITTING ON ME', 'left:0;right:0;top:640px;text-align:center;font-size:112px;line-height:1.04;');
const three = ui.add(`<span style="${bubbleCss}">THREE FUCKING<br>MONTHS!</span>`, 'left:0;right:0;top:330px;text-align:center;font-size:104px;line-height:1.05;');
const boom = ui.add('BOOM', 'left:0;right:0;top:360px;text-align:center;font-size:230px;color:#ffd166;');
const aah = ui.add(`<span style="${bubbleCss}">AAAAAH!</span>`, 'left:0;right:0;top:330px;text-align:center;font-size:110px;');
const flash = ui.add('', 'inset:0;background:#fffaf0;');
const sweet = ui.add(`<div>${[...'SWEET!'].map(c => `<span style="display:inline-block">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:320px;text-align:center;font-size:150px;');
const sweetL = [...sweet.querySelectorAll('span')];

// ---------- helpers ----------
const shotAt = t => SHOTS.find(s => t < s.to) ?? SHOTS[SHOTS.length - 1];
const headTop = p => p.anchors.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.75, 0));
const mouthOf = p => p.anchors.head.localToWorld(new THREE.Vector3(0, -0.24, 0.6));
const buttOf = () => bird.anchors.butt.getWorldPosition(new THREE.Vector3());
// a drop that leaves the bird at a, lands at b
function fall(d, t, a, b, from, A, B) { const p = seg(t, a, b); show(d, t > a && t < b);
  d.position.lerpVectors(A, B, easeIn(p)); d.rotation.z = p * 0.4; return p; }
function youGoo(t) {
  if (t > T.boom + 0.12 && t < T.chair) return 1;
  if (t >= T.chair) return 0.7;
  if (t > 13.5) return 0.7;
  return [T.splat1, ...T.drops.map(x => x + 0.45), T.splatHouse].reduce((g, x, i) => (t > x ? [0.06, 0.12, 0.17, 0.22, 0.3][i] : g), 0);
}

// ---------- per-frame ----------
function stage(t) {
  const Y = you.group, W = wife.group, Bd = bird.group;
  let you_ = {}, wife_ = {}, bird_ = {};
  [Y, W, Bd].forEach(o => o.rotation.set(0, 0, 0)); Bd.scale.setScalar(1); poof.set(0);
  show(spade, t > T.dig[0] && t < T.dig[1]); show(bottle, t > 31 && t < T.peck[0]);
  dirt.forEach(d => show(d, false)); drops.forEach(d => show(d, false)); blast.forEach(d => show(d, false));
  trail.forEach(s => s.set(0)); show(lensDrop, false);
  show(W, t > T.wifeIn && t < 21 || t > 44); show(Bd, true);
  if (t < 7) { // --- street walk
    const x = t < 3 ? lerp(-6, -3.6, t / 3) : lerp(-3.6, 1.0, smooth(seg(t, 3, 7)));
    Y.position.set(x, 0, 0); Y.rotation.y = Math.PI / 2;
    you_ = { walk: 1, walkRate: t < 3 ? 2.2 : 3.2, mood: t > T.splat1 ? -0.8 : 0.4, wave: Math.abs(t - T.fist - 0.4) < 0.5 ? 1 : 0 };
    const glide = seg(t, ...T.glide);
    Bd.position.set(lerp(x + 6, x + 0.4, easeOut(glide)), 5.4 + Math.sin(t * 3) * 0.15, 0.3); Bd.rotation.set(0, t > 1.0 && t < 1.8 ? 0 : -Math.PI / 2, 0);
    bird_ = { flap: 1, smug: 1 };
  } else if (t < 21) { // --- house
    const o = OFF.house;
    const walkIn = seg(t, T.enter, T.enter + 1.2);
    Y.position.copy(o).add(new THREE.Vector3(lerp(4.0, 0.6, smooth(walkIn)), 0, lerp(1.5, 0.6, walkIn)));
    Y.rotation.y = t < T.enter + 1.2 ? -Math.PI / 2 : t < 13.5 ? 0.3 : 1.0;
    you_ = { walk: walkIn < 1 ? 1 : 0, mood: t < T.couch ? 0.6 : -0.9, double: t > 13.5 && t < 19.5 ? 0.25 : 0 };
    // the bird appears out of nowhere above your head (poof), splats you, then flies to the lamp
    const onLamp = t > 11.2, toLamp = seg(t, 10.6, 11.2), above = new THREE.Vector3(0.75, 3.95 + Math.sin(t * 3) * 0.08, 0.6);
    Bd.position.copy(o).add(onLamp ? new THREE.Vector3(2.6, 3.25, -2.6) : above.lerp(new THREE.Vector3(2.6, 3.25, -2.6), smooth(toLamp)));
    show(Bd, t > T.couch); if (!onLamp) P(Bd, pop(t, T.couch, 7, 13));
    poof.position.copy(o).add(new THREE.Vector3(0.75, 3.7, 0.6)); poof.set(seg(t, T.couch - 0.05, T.couch + 0.7));
    Bd.rotation.set(0, onLamp ? -0.8 : toLamp > 0 ? -0.9 : 0.4, 0);
    bird_ = { smug: 1, flap: !onLamp ? 1 : 0, shrug: onLamp ? seg(t, T.shrug, T.shrug + 0.3) * (1 - seg(t, 12.8, 13.1)) : 0 };
    const wIn = seg(t, T.wifeIn, T.wifeIn + 1.4);
    W.position.copy(o).add(new THREE.Vector3(lerp(4.6, 2.0, smooth(wIn)), 0, lerp(1.5, 1.5, wIn))); W.rotation.y = wIn < 1 ? -Math.PI / 2 : -2.1;
    wife_ = { walk: wIn < 1 ? 1 : 0, laugh: wIn >= 1 ? 1 : 0, mood: -1, wave: wIn >= 1 ? 1 : 0, scratch: t > 19.5 ? 1 : 0, scratchRate: 6 };
  } else if (t < 31 && t >= 23) { // --- bunker
    const o = OFF.bunker;
    if (t < 25.5) { const c = seg(t, ...T.climb);
      Y.position.copy(o).add(new THREE.Vector3(2.7, lerp(5.2, 0.1, c), 0.7)); Y.rotation.y = c < 1 ? Math.PI : 0;
      you_ = { mood: -1, wave: t > T.fistUp ? 1 : 0, swingUp: c > 0 && c < 1 ? 1 : 0 };
    } else if (t < 29.5) { Y.position.copy(o).add(new THREE.Vector3(0.3, 1.3, -0.8)); Y.rotation.set(0, 0, Math.PI / 2);
      you_ = { laugh: 1, mood: 0.2 };
    } else { Y.position.copy(o).add(new THREE.Vector3(-1.2, 0.15, -0.35)); Y.rotation.set(0, 0, 0);
      you_ = { sit: 1, double: 0.6, mood: -1, laugh: 0.6 }; }
    const out = seg(t, T.ventOut, T.ventOut + 0.6), vent = V(-2.4, 4.0, -1.9, 'bunker');
    const hover = V(-2.1, 2.55, 0.15, 'bunker');
    Bd.position.lerpVectors(vent, hover, smooth(out)); Bd.rotation.set(0, Math.PI / 2, 0);
    show(Bd, t > T.ventOut); bird_ = { flap: 1, smug: 1 };
    bunker.group.children.forEach(c => c.position.x === -2.4 && (c.position.z = -2.35 + (t > T.vent && t < T.ventOut ? Math.sin(t * 60) * 0.05 : 0)));
  } else { // --- yard (dig, feeder, boom, ending)
    const o = OFF.street;
    if (t < 23) { Y.position.set(3.0, 0, -2.6); Y.rotation.y = 2.2;
      const k = (t * 3) % 1; you_ = { swingUp: 1, swing: k < 0.5 ? k * 2 : 2 - k * 2, mood: -1 };
      dirt.forEach((d, i) => { const p = ((t * 3 + i / 8) % 1); show(d, true); d.position.set(3.6 + p * 1.4, 0.2 + Math.sin(p * Math.PI) * 2, -3.2 - p * 1.0); });
    } else if (t < 44) { Y.position.set(t < 35.5 ? 3.1 : 3.5, 0, t < 35.5 ? -2.2 : -2.5); Y.rotation.y = lerp(2.35, 0.6, smooth(seg(t, T.boom + 1.0, T.boom + 1.8)));
      you_ = { hold: t < T.peck[0] ? 1 : 0, fold: t > T.rub && t < 35.5 ? 1 : 0, smug: t > T.rub && t < 35.5 ? 1 : 0, slump: t > 35.5 && t < T.boom ? 0.5 : 0,
        mood: t > T.boom ? -1 : 0.5 };
      bottle.rotation.z = t > T.pour[0] && t < T.pour[1] ? -1.6 : 0;
      const land = seg(t, 32.6, 33.3), food = V(4.6, 1.4, -3.3);
      Bd.position.lerpVectors(V(7, 6, -5), food, smooth(land)); Bd.rotation.set(0, -2.2, 0);
      const bl = smooth(seg(t, ...T.bloat));
      bird_ = { flap: land < 1 ? 1 : 0, peck: t > T.peck[0] && t < T.peck[1] ? 1 : 0, bloat: t < T.boom ? bl : 0, shake: bl, smug: t < 35.5 ? 1 : 0 };
      if (t > T.launch) { const l = seg(t, T.launch, T.launch + 0.8); Bd.position.copy(food).add(new THREE.Vector3(0, easeIn(l) * 14, 0)); }
      blast.forEach(d => { const p = seg(t, T.boom, T.boom + 0.9); show(d, p > 0 && p < 1);
        d.position.copy(food).addScaledVector(d.userData.v, p * 1.6).add(new THREE.Vector3(-p * 1.5, -4.9 * p * p, 0)); });
    } else if (t < 48) { // sky -> wife
      const f = seg(t, ...T.fly), wifeHead = V(-3.2, 3.15, -2.6);
      W.position.set(-3.2, 0, -2.6); W.rotation.y = 0.3;
      if (t < T.land) { Bd.position.lerpVectors(V(9, 12, -3), wifeHead, smooth(f)); Bd.rotation.set(0, -Math.PI / 2, 0.4);
        trail.forEach((s, i) => { s.position.lerpVectors(V(9, 12, -3), wifeHead, Math.max(0, smooth(f) - 0.1 - i * 0.05)); s.set(0.3 + i * 0.05); }); }
      const run = seg(t, 46.6, 48), a = run * Math.PI * 2;
      if (t > 46.6) { W.position.set(-3.2 + Math.cos(a) * 1.2, 0, -2.6 + Math.sin(a) * 1.0); W.rotation.y = -a; }
      if (t >= T.land) { Bd.position.copy(headTop(wife)); Bd.rotation.set(0, W.rotation.y, 0); }
      bird_ = { flap: t < T.land ? 1 : 0, smug: 1 };
      wife_ = { laugh: t > 46.3 ? 1 : 0, mood: -1, walk: t > 46.6 ? 1 : 0, walkRate: 5, wave: t > 46.3 ? 1 : 0, goo: T.wifeSplats.reduce((g, x, i) => (t > x ? 0.1 + i * 0.1 : g), 0) };
      Y.position.set(3.0, 0, -2.4); Y.rotation.y = -1.2; you_ = { mood: 0.2 };
    } else { // ending: lawn chair
      Y.position.set(2.4, 0.0, -1.95); Y.rotation.y = 0.35; you_ = { sit: 1, lean: 1, shades: 1, mood: 1 };
      const a = (t - 48) * 2.2; W.position.set(0.4 + Math.cos(a) * 1.1, 0, -4.9 + Math.sin(a) * 0.6); W.rotation.y = -a;
      wife_ = { laugh: 1, mood: -1, walk: 1, walkRate: 5, wave: 1, goo: 0.35 }; Bd.position.copy(headTop(wife)); Bd.rotation.set(0, W.rotation.y, 0); bird_ = { smug: 1 };
    }
    show(hole, t >= 21); P(pile, t < 21 ? 0.001 : t < 23 ? seg(t, 21, 23) : 1); pile.scale.y *= 0.6;
  }
  you.pose({ t, goo: youGoo(t), ...you_ }); wife.pose({ t, ...wife_ }); bird.pose({ t, ...bird_ });
  scene.updateMatrixWorld();
  // drops onto you (street + house)
  const head = headTop(you);
  [[T.drop1, T.splat1], ...T.drops.map(x => [x, x + 0.45]), [T.splatHouse - 0.4, T.splatHouse]].forEach(([a, b], i) => {
    if (t > a && t < b) { const d = drops[i % 4]; fall(d, t, a, b, 0, buttOf(), head); } });
  if (t > T.dropLamp && t < T.dropLamp + 0.6) fall(drops[0], t, T.dropLamp, T.dropLamp + 0.6, 0, buttOf(), V(2.6, 0, -1.4, 'house'));
  if (t > T.mouth - 0.45 && t < T.mouth) fall(drops[1], t, T.mouth - 0.45, T.mouth, 0, buttOf(), mouthOf(you));
  T.wifeSplats.forEach((x, i) => { if (t > x - 0.25 && t < x) fall(drops[2], t, x - 0.25, x, 0, buttOf(), headTop(wife)); });
}

function screen(t) {
  title.style.opacity = t < T.title ? 0 : 1 - seg(t, 2.75, 2.95);
  title.style.transform = `scale(${Math.max(0.01, lerp(2.2, 1, Math.min(1, pop(t, T.title, 8, 16))))})`;
  const pp = (el, a, b) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, 15))})`; };
  pp(three, T.bubble, 21); pp(boom, T.boom, T.boom + 1.4); pp(aah, 46.4, 48);
  flash.style.opacity = t > T.boom && t < T.boom + 0.4 ? 1 - seg(t, T.boom, T.boom + 0.4) : 0;
  sweetL.forEach((s, i) => { const p = pop(t, T.sweet + i * 0.07, 8, 15);
    s.style.opacity = t < T.sweet + i * 0.07 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = shotAt(t), x = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = s.followBird ? bird.group.position.clone() : s.follow ? new THREE.Vector3(you.group.position.x, 0, 0) : OFF[s.world].clone();
  const shake = t > T.boom && t < T.boom + 0.6 ? (1 - seg(t, T.boom, T.boom + 0.6)) * 0.2 : 0;
  camera.position.copy(lerpV(a.p, b.p, x)).add(base); camera.position.y += Math.sin(t * 90) * shake;
  const look = lerpV(a.l, b.l, x).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  scene.background = SKY[s.world]; scene.fog = null;
  hemi.intensity = s.world === 'bunker' ? 0.9 : 1.5; key.intensity = s.world === 'bunker' ? 1.2 : 2.6;
  key.place(look, 10);
  const p = seg(t, T.finalDrop, 51); show(lensDrop, p > 0 && p < 1);
  lensDrop.position.copy(camera.position).addScaledVector(camera.getWorldDirection(new THREE.Vector3()), 2.2).add(new THREE.Vector3(0, lerp(1.4, -0.3, easeIn(p)), 0));
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
