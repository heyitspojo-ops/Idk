// Your Reflection in the Mirror — vertical toy-diorama reel. Brief: briefs/your-reflection-in-the.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, rbox, ball, at, textCard, rng } from '../../bucket-shared/toy-kit.js';
import { buildBathroom } from '../../bucket-shared/world-bathroom.js';
import { buildOcean } from '../../bucket-shared/world-ocean.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { mirrorBox, hammer, chainsaw, bomb, smoke, handMirror, boat, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 400);
const { key, hemi } = toyLights(scene);
const SKY = { bath: new THREE.Color('#efe2fb'), sea: new THREE.Color('#bfe7f5'), sunset: new THREE.Color('#f6b089'), deep: new THREE.Color('#2a6f9e') };
const FOG = { sea: new THREE.Fog('#bfe7f5', 30, 90), sunset: new THREE.Fog('#f6b089', 30, 90), deep: new THREE.Fog('#2a6f9e', 9, 30) };
const OX = 600; // ocean world offset
const show = (o, v) => (o.visible = v);
const P = (o, s) => { const v = Math.max(0.001, s); o.scale.set(Math.sign(o.scale.x || 1) * v, v, v); }; // keeps a mirror flip
const hash = k => { const x = Math.sin(k * 127.1) * 43758.5453; return x - Math.floor(x); };
const R = rng(9);

// ---------- bathroom ----------
const bath = buildBathroom(); scene.add(bath.group);
const B = bath.group;
const mirror = at(mirrorBox(), 0.2, 0, -2.5, B);
const you = buildToyPerson(); B.add(you.group);
const refl = buildToyPerson({ mirrored: true }); mirror.add(refl.group); refl.group.position.copy(mirror.anchors.inside.position);
const tools = { hammer: hammer(), sledge: hammer({ sledge: true }), saw: chainsaw() };
Object.values(tools).forEach(o => you.anchors.handR.add(o));
const nailFile = at(mesh(rbox(0.05, 0.4, 0.02, 0.01), '#e2577a'), 0, -0.15, 0.05, refl.anchors.handR);
const kaboom = at(bomb(), 0.2, 0, -1.4, B), puff = at(smoke({ size: 2.4 }), 0.2, 0.2, -1.6, B);
const stars = Array.from({ length: 4 }, () => at(sparkle(0.2), 0, 0, 0, B));
const sparks = Array.from({ length: 10 }, () => at(sparkle(0.12), 0, 0, 0, B));

// ---------- ocean ----------
const sea = buildOcean({ opacity: 0.45 }); sea.group.position.x = OX; scene.add(sea.group);
const S = sea.group;
const ship = at(boat(), 0, 0, 0, S);
const sailor = buildToyPerson(); ship.add(sailor.group); sailor.group.position.copy(ship.anchors.seat.position);
const mirrorInHand = handMirror(); sailor.anchors.handR.add(mirrorInHand); mirrorInHand.rotation.set(Math.PI - 0.9, Math.PI, 0); mirrorInHand.position.y = -0.1;
const route = Array.from({ length: 26 }, (_, i) => at(mesh(rbox(0.25, 0.05, 0.6, 0.02), '#ffffff'), 0, 0.05, -14 + i * 0.6, S));
const faceUp = o => { const r = buildToyPerson({ mirrored: true, ...o }); r.group.rotation.x = -Math.PI / 2; S.add(r.group); return r; };
const wet = faceUp(); P(wet.group, 0.9);
const ring = Array.from({ length: 9 }, () => faceUp());
// underwater duel + infinite tunnel (world 'deep', ~y = -4.6 feet)
const duelA = buildToyPerson({ mirrored: true }), duelB = buildToyPerson();
[duelA, duelB].forEach(d => S.add(d.group));
const tunnel = Array.from({ length: 8 }, (_, i) => { const d = buildToyPerson({ mirrored: i % 2 === 0 }); S.add(d.group); return d; });
const shards = Array.from({ length: 70 }, () => {
  const g = new THREE.BufferGeometry().setFromPoints([0, 1, 2].map(() => new THREE.Vector3((R() - 0.5) * 1.2, (R() - 0.5) * 1.2, 0)));
  g.setIndex([0, 1, 2]); g.computeVertexNormals();
  const m = at(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#d8f1fb', metalness: 0.4, roughness: 0.1, side: THREE.DoubleSide })), 0, 0, 0, S);
  m.userData = { d: new THREE.Vector3(R() - 0.5, R() - 0.5, R() * 0.8).normalize().multiplyScalar(3 + R() * 6), s: R() * 6 };
  return m;
});
const endSparks = Array.from({ length: 10 }, () => at(sparkle(0.45), 0, 0, 0, S));

// ---------- screen text ----------
const ui = overlay();
const title = ui.add('YOUR REFLECTION<br>ISN\'T COPYING YOU', 'left:0;right:0;top:290px;text-align:center;font-size:104px;line-height:1.04;');
const bonk = ui.add('BONK!', 'left:0;right:0;top:420px;text-align:center;font-size:170px;color:#ffd166;');
const nothing = ui.add('NOTHING CAN<br>DESTROY IT', 'left:0;right:0;top:300px;text-align:center;font-size:118px;line-height:1.04;');
const flash = ui.add('', 'inset:0;background:#fff;');
const pacific = ui.add('<span style="background:#fffaf0;color:#1f6fa8;border-radius:28px;padding:14px 38px;text-shadow:none;box-shadow:0 8px 0 rgba(31,111,168,.35)">PACIFIC OCEAN</span>', 'left:0;right:0;top:300px;text-align:center;font-size:84px;');
const crack = ui.add(`<svg width="1080" height="1920" viewBox="0 0 1080 1920"><g stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round">${
  Array.from({ length: 11 }, (_, i) => { const a = i * 0.57 + 0.2; let x = 540, y = 960, d = `M${x} ${y}`;
    for (let k = 1; k < 6; k++) { x += Math.cos(a + (k % 2 ? 0.25 : -0.2)) * 120; y += Math.sin(a + (k % 2 ? 0.25 : -0.2)) * 120; d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    return `<path d="${d}"/>`; }).join('')}</g></svg>`, 'inset:0;');
const end = ui.add(`<div>${[...'REFLECT ON THAT.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:96px;');
const endLetters = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
const shotAt = t => SHOTS.find(s => t < s.to) ?? SHOTS[SHOTS.length - 1];
const boatAt = t => new THREE.Vector3(0, 0, lerp(-8, 2, smooth(seg(t, ...T.sail))));

function bathroom(t) {
  // you: wave, then hit by the kick, then the tools
  const Y = you.group, kicked = seg(t, T.impact, T.impact + 0.2) * (1 - seg(t, 9.3, 9.6));
  Y.position.set(0.2, 0, 0.6 + (t > T.sledge[1] && t < 15.6 ? easeOut(seg(t, T.sledge[1], T.sledge[1] + 0.4)) * 1.2 : 0)); Y.rotation.y = Math.PI;
  const strike = (a, b) => seg(t, a, b) * (1 - seg(t, b + 0.25, b + 0.6) * 0.6);
  const hammerOn = t >= 9.5 && t < 14, sledgeOn = t >= 14 && t < 15.6, sawOn = t >= 15.6 && t < 17.2;
  you.pose({ t, wave: t < 3 ? seg(t, 0.1, 0.3) * (1 - seg(t, 2.4, 2.8)) : 0, double: kicked, mood: t > 6 && t < 9.5 ? -1 : t < 6 ? 0.2 : -0.5,
    swingUp: hammerOn || sledgeOn ? 1 : 0, swing: hammerOn ? strike(...T.hammer) : sledgeOn ? strike(...T.sledge) : 0,
    hold: sawOn ? 1 : 0, sit: t > T.boom && t < 20 ? 1 : 0 });
  if (t > T.boom && t < 20) Y.position.set(0.2, -0.25, 1.4);
  show(tools.hammer, hammerOn); show(tools.sledge, sledgeOn); show(tools.saw, sawOn);
  tools.hammer.anchors.head.rotation.z = t > T.tink ? 0.7 : 0;
  const snapped = seg(t, T.snap, T.snap + 0.6);
  tools.saw.anchors.chain.position.set(snapped * 1.5, -0.75 - snapped * 1.2, snapped * 0.8); tools.saw.anchors.chain.rotation.z = snapped * 6;
  tools.saw.anchors.bar.rotation.z = snapped * 0.6;
  stars.forEach((s, i) => { const a = t * 6 + i * 1.57; show(s, t > T.bonk && t < 9.5);
    s.position.set(0.2 + Math.cos(a) * 0.7, 2.6 - kicked * 0.7, 0.4 + Math.sin(a) * 0.5); s.rotation.z = t * 4; });
  sparks.forEach((s, i) => { const on = (t > T.tink && t < T.tink + 0.3) || (t > T.sledge[1] && t < T.sledge[1] + 0.3) || (t > T.saw[0] + 0.2 && t < T.snap);
    show(s, on); const f = Math.floor(t * 30) + i * 17; s.position.set(0.2 + (hash(f) - 0.5) * 1.2, 1.8 + hash(f + 3) * 1.2, -2.35); P(s, 0.6 + hash(f + 7)); });
  // the reflection
  const kick = seg(t, ...T.kick) * (1 - seg(t, 7.6, 8.2));
  refl.pose({ t, fold: t < 3 ? seg(t, T.fold, T.fold + 0.4) : t > 9.5 && t < 17.5 ? 1 : 0, smug: t > T.smirk ? 1 : 0,
    slump: t > 3 && t < 6 ? seg(t, T.lean, T.lean + 0.5) : 0, hold: t > T.poke && t < 6 ? 1 : t > T.clear ? 0.8 : 0,
    kick: smooth(kick), kickReach: 4.6, laugh: (t > 7.3 && t < 9.5) || (t > 10.6 && t < 12) ? 1 : 0 });
  show(nailFile, t > T.clear);
  mirror.glint(seg(t, T.glint, T.glint + 0.8) || seg(t, T.clear + 0.2, T.clear + 1.0));
  // bomb + smoke
  show(kaboom, t > T.bomb && t < T.boom); P(kaboom, pop(t, T.bomb, 7, 13));
  kaboom.anchors.spark.scale.setScalar(0.6 + Math.abs(Math.sin(t * 40)) * 0.6);
  puff.set(seg(t, T.boom, T.boom + 1.1));
}

function ocean(t) {
  sea.update(t);
  const b = boatAt(t); ship.position.set(b.x, sea.height(b.x, b.z, t) * 0.8 + 0.1, b.z);
  ship.rotation.set(Math.sin(t * 1.3) * 0.05, 0, Math.sin(t * 1.1) * 0.06);
  ship.anchors.sail.rotation.y = Math.sin(t * 0.9) * 0.08;
  const side = t > 25.5 && t < 41, sunset = t >= 41;
  sailor.group.rotation.y = side ? Math.PI / 2 : 0;
  sailor.pose({ t, sit: 1, slump: t > T.peek && t < 27.5 ? 0.9 : 0, scratch: t > 31 && t < 34 ? 1 : 0, scratchRate: 2,
    hold: t > T.mirrorUp - 0.1 && t < 41 ? smooth(seg(t, T.mirrorUp - 0.2, T.mirrorUp + 0.3)) : 0,
    mood: t < 25.5 ? 0.6 : t < 34 ? -1 : 1, lean: sunset ? 1 : 0, shades: sunset ? 1 : 0, look: t > 31 && t < 34 ? Math.sin(t * 5) * 0.3 : 0 });
  show(mirrorInHand, t > T.mirrorUp - 0.2);
  route.forEach((r, i) => show(r, t >= 20 && t < 25.5 && r.position.z < b.z - 1.5));
  // laughing reflections in the water
  const wetOn = t > T.peek && t < 34;
  const copy = t > T.thumbs; show(wet.group, wetOn || copy);
  wet.group.position.set(b.x + 1.9, -0.35, b.z + 0.9); wet.pose(copy ? { t, wave: 1, mood: 0.6 } : { t, laugh: 1, smug: 1 });
  ring.forEach((r, i) => { const a = (i / ring.length) * Math.PI * 2 + (t > 31 ? (t - 31) * 1.2 : 0), rad = 4.2 + (i % 2) * 1.2;
    show(r.group, t > T.ring && t < 34); P(r.group, pop(t, T.ring + i * 0.08, 7, 13) * 0.8);
    r.group.position.set(b.x + Math.cos(a) * rad, -0.4, b.z + Math.sin(a) * rad); r.group.rotation.z = -a; r.pose({ t: t + i, laugh: 1 }); });
  // underwater duel, tunnel, shatter
  const deep = t >= 35.8 && t < 41, gone = t > T.shatter;
  const dk = seg(t, T.duelKick, T.duelKick + 0.3);
  [duelA, duelB].forEach((d, i) => { show(d.group, deep && !gone); d.group.position.set(i ? 1.0 + easeOut(seg(t, T.duelKick + 0.25, T.duelKick + 0.7)) * 0.7 : -1.0, -4.6, 0);
    d.group.rotation.y = i ? -Math.PI / 2 : Math.PI / 2; });
  duelA.pose({ t, smug: t < 36.6 ? 1 : 0, mood: t < 36.6 ? 0 : -1, hold: t < 36.6 ? 1 : 0, kick: dk * (1 - seg(t, 37.5, 37.8)), kickReach: 2.2 });
  duelB.pose({ t, smug: t < 36.6 ? 1 : 0, mood: -1, hold: t < 36.6 ? 1 : 0, double: seg(t, T.duelKick + 0.3, T.duelKick + 0.5) });
  tunnel.forEach((d, i) => { show(d.group, deep && !gone && t > T.tunnel); P(d.group, pop(t, T.tunnel + i * 0.1, 7, 13) * 0.85 ** (i + 1));
    d.group.position.set(i % 2 ? 1.2 : -1.2, -4.6, -2 - i * 2.2); d.group.rotation.y = i % 2 ? -Math.PI / 2 : Math.PI / 2;
    d.pose({ t, kick: seg(t, T.tunnel + 0.6 + i * 0.12, T.tunnel + 0.8 + i * 0.12), kickReach: 2, laugh: 1 }); });
  shards.forEach(s => { const p = seg(t, T.shatter, T.shatter + 1.5); show(s, deep && p > 0 && p < 1);
    s.position.set(s.userData.d.x * p, -3.4 + s.userData.d.y * p, 1 + s.userData.d.z * p); s.rotation.set(p * s.userData.s, p * 3, 0); });
  // sunset end: copying reflection gives a thumbs up
  endSparks.forEach((s, i) => { show(s, t > T.shatter && t < 41); const p = seg(t, T.shatter, T.shatter + 1.2);
    s.position.set(Math.cos(i * 0.63) * 2.6 * p, -3.6 + Math.sin(i * 0.63) * 2.6 * p, 2); P(s, Math.sin(p * Math.PI) * 1.2); s.rotation.z = t * 3; });
}

function screen(t) {
  title.style.opacity = t < T.title ? 0 : 1 - seg(t, 2.75, 2.95);
  title.style.transform = `scale(${Math.max(0.01, lerp(2.2, 1, Math.min(1, pop(t, T.title, 8, 16))))})`;
  bonk.style.opacity = t > T.bonk && t < 8.3 ? 1 : 0; bonk.style.transform = `scale(${Math.max(0.01, pop(t, T.bonk, 8, 16))}) rotate(-8deg)`;
  nothing.style.opacity = t > T.nothing && t < 20 ? 1 : 0; nothing.style.transform = `scale(${Math.max(0.01, pop(t, T.nothing, 8, 16))})`;
  pacific.style.opacity = t > 20.6 && t < 25.5 ? 1 : 0; pacific.style.transform = `scale(${Math.max(0.01, pop(t, 20.6, 7, 14))}) rotate(-3deg)`;
  flash.style.opacity = t > T.boom && t < T.boom + 0.35 ? 1 - seg(t, T.boom, T.boom + 0.35) : 0;
  crack.style.opacity = t > T.crack && t < T.shatter + 0.2 ? 1 : 0;
  crack.style.clipPath = `circle(${seg(t, T.crack, T.crack + 0.5) * 120}% at 50% 50%)`;
  endLetters.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.05, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.05 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = shotAt(t), x = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = s.world === 'bath' ? new THREE.Vector3() : new THREE.Vector3(OX, 0, 0).add(s.track ? boatAt(t) : new THREE.Vector3());
  const shake = t > T.boom && t < T.boom + 0.5 ? (1 - seg(t, T.boom, T.boom + 0.5)) * 0.15 : 0;
  camera.position.copy(lerpV(a.p, b.p, x)).add(base); camera.position.x += Math.sin(t * 80) * shake;
  const look = lerpV(a.l, b.l, x).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  const w = s.sunset ? 'sunset' : s.world;
  scene.background = SKY[w]; scene.fog = FOG[w] ?? null;
  key.color.set(s.sunset ? '#ffc08a' : s.world === 'deep' ? '#bfe6ff' : '#fff1dc');
  hemi.color.set(s.world === 'deep' ? '#cfeaff' : '#fff6ea'); hemi.intensity = s.world === 'deep' ? 2.4 : 1.5;
  key.place(look, s.world === 'bath' ? 9 : 14);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  bathroom(t); ocean(t); screen(t); shoot(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
