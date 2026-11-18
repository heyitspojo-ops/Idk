// You Have Fucking Head Lice — 45 s vertical toy-diorama reel. Brief: briefs/you-have-fucking-head.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, mat, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildBathroom } from '../../bucket-shared/world-bathroom.js';
import { buildScalp } from '../../bucket-shared/world-scalp.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { buildLouse } from '../../bucket-shared/rig-louse.js';
import { finger, comb, mannequinWig, bulb, flakeHouse, flag, sign, bubble, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 300);
const { key } = toyLights(scene);
const SKY = { bath: new THREE.Color('#efe2fb'), scalp: new THREE.Color('#f6d7c3') };
const fog = new THREE.Fog(SKY.scalp, 20, 60);
const SX = 400; // scalp world offset on x

// ---------- worlds ----------
const bath = buildBathroom(); scene.add(bath.group);
const C = { hook: [0, 0], hookCam: [0, 7], ride: [-20, 0], rideCam: [-20.5, 10.5], pool: [20, 0], poolCam: [20, 7], town: [0, -22], townCam: [0, -13] };
const R = { hook: 3.5, hookCam: 3.5, ride: 6, rideCam: 5.5, pool: 5.5, poolCam: 3, town: 8.5, townCam: 4.5 };
const scalp = buildScalp({ size: 70, strands: 430, clearings: Object.entries(C).map(([name, [x, z]]) => ({ name, x, z, r: R[name] })) });
scalp.group.position.x = SX; scene.add(scalp.group);
const S = scalp.group, B = bath.group;
const louse = (o, parent, x = 0, y = 0, z = 0, s = 1) => { const l = buildLouse(o); at(l.group, x, y, z, parent).scale.setScalar(s); return l; };

// beat 1 — hook
const hero = louse({ seed: 1 }, S, 0, 0, 0);
const slam = at(finger({ w: 1.6, len: 14 }), 0.55, 14, -0.2, S);
// beat 3 — nail surfing
const surf = [0, 1].map(i => { const f = at(finger({ len: 14 }), 0, 1.0, 0.5 - i * 3.2, S);
  f.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, Math.PI / 2 + 0.22, 'XZY')); return f; });
const surfers = [[0, -0.42], [0, 0.42], [1, 0]].map(([fi, dz], i) => ({ fi, dz, l: louse({ seed: 10 + i }, S) }));
const wheee = at(bubble('WHEEE!', 2.0), 0, 0, 0, S);
// beat 4 — pool party
const [px, pz] = C.pool;
const water = at(mesh(new THREE.CircleGeometry(5.6, 24), mat('#cdeffb', { transparent: true, opacity: 0.88, roughness: 0.2 })), px, 0.5, pz, S);
water.rotation.x = -Math.PI / 2;
const suds = Array.from({ length: 34 }, (_, i) => i).filter(i => Math.sin(i * 2.4) * (1 + (i * 0.37) % 4.4) < 2.2).map(i => at(mesh(ball(0.22 + (i % 5) * 0.09, 1), mat('#ffffff', { roughness: 0.35 })), px + Math.cos(i * 2.4) * (1 + (i * 0.37) % 4.4), 0.55, pz + Math.sin(i * 2.4) * (1 + (i * 0.37) % 4.4), S));
const rafts = [[-0.95, 0.7], [0.95, 0.9], [0.05, -1.0]].map(([x, z], i) => {
  const r = at(new THREE.Group(), px + x, 0.55, pz + z, S);
  at(mesh(ball(0.75, 0), '#fbf7ee'), 0, 0, 0, r).scale.set(1, 0.22, 1);
  return { r, l: louse({ seed: 20 + i, sunglasses: true }, r, 0, 0.12, 0) };
});
// beat 5/6 — comb, town, speech
const [tx, tz] = C.town;
const bigComb = at(comb({ length: 13, teeth: 12, toothH: 4.8, toothW: 0.45, spineH: 1.2, depth: 0.8 }), tx, 5.2, tz + 3, S);
const swingers = [4, 5, 6, 7].map((i, k) => louse({ seed: 30 + k }, bigComb, bigComb.anchors.teethX(i), -2.6 - (k % 2) * 1.0, 0.55));
const houses = [200, 228, 256, 284, 312, 340].map((a, i) => {
  const h = at(flakeHouse({ seed: i + 2, roof: ['#ef7b6c', '#7cc6a4', '#f4b860', '#8db6e8', '#e78fb3', '#b59be0'][i] }), tx + Math.cos(a * Math.PI / 180) * 6, 0, tz + Math.sin(a * Math.PI / 180) * 5, S);
  h.lookAt(S.localToWorld(new THREE.Vector3(tx, 0, tz + 6))); return h;
});
const banner = at(flag('LICE NATION', { pole: 5.2, w: 2.8 }), tx - 1.45, 0, tz - 3.2, S);
const box = at(mesh(new THREE.BoxGeometry(1.4, 1, 1.2), '#c99b6a'), tx, 0.5, tz - 1, S);
const leader = louse({ seed: 40, megaphone: true, hat: true }, S, tx, 1, tz - 1);
const crowd = Array.from({ length: 11 }, (_, i) => {
  const row = i < 6 ? 0 : 1, k = row ? i - 6 : i, n = row ? 5 : 6;
  const l = louse({ seed: 50 + i, hat: i % 4 === 1 }, S, tx + (k - (n - 1) / 2) * 1.25 + row * 0.3, 0, tz + 3 + row * 1.4);
  l.group.rotation.y = Math.PI + (k - (n - 1) / 2) * -0.12; return l;
});

// bathroom cast & props
const you = buildToyPerson(); B.add(you.group);
const manq = at(mannequinWig(), 4.3, 2.8, -3.4, B); manq.scale.setScalar(1.4); manq.rotation.y = 0.35;
const deal = at(sign(['FREE WIG', 'POOL', 'NO SCRATCHING'], { w: 1.1 }), 5.1, 2.8, -2.75, B); deal.rotation.y = 0.2;
const idea = at(bulb(), 0, 0, 0, B);
const HEAD_TOP = new THREE.Vector3(3.6, 3.05, -1.6), WIG = new THREE.Vector3(4.25, 4.35, -3.1);
const bridge = at(comb({ length: HEAD_TOP.distanceTo(WIG) + 0.3, teeth: 16, toothH: 0.22, toothW: 0.05, spineH: 0.1, depth: 0.3 }), 0, 0, 0, B);
bridge.position.lerpVectors(HEAD_TOP, WIG, 0.5);
bridge.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), WIG.clone().sub(HEAD_TOP).normalize());
const marchers = Array.from({ length: 6 }, (_, i) => louse({ seed: 60 + i, suitcase: i < 5, hat: i === 5 }, B, 0, 0, 0, 0.3));
const peeker = louse({ seed: 1 }, manq.anchors.wig, 0.05, 0.05, 0.4, 0.34);
const sparks = Array.from({ length: 5 }, (_, i) => at(sparkle(0.22 + (i % 2) * 0.1), 0, 0, 0, B));

// screen text
const ui = overlay();
const title = ui.add('YOU HAVE<br>FUCKING<br>HEAD LICE', 'left:0;right:0;top:300px;text-align:center;font-size:132px;line-height:1.02;letter-spacing:2px;');
const endText = ['LICE-FREE.', 'RENT-FREE.'];
const end = ui.add(endText.map(w => `<div>${[...w].map(c => `<span style="display:inline-block">${c}</span>`).join('')}</div>`).join(''),
  'left:0;right:0;top:880px;text-align:center;font-size:118px;line-height:1.08;');
const endLetters = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
const shotAt = t => SHOTS.find(s => t < s.to) ?? SHOTS[SHOTS.length - 1];
const show = (o, v) => (o.visible = v);

function stage(t) {
  // --- scalp ---
  scalp.sway(t);
  // hook: hero pops up, waves, dodges the slamming nail
  const up = pop(t, T.louseUp, 6, 11), hop = seg(t, T.nailSlam - 0.15, T.nailSlam + 0.25);
  hero.group.position.set(lerp(0, -0.8, smooth(hop)), -1 + up + Math.sin(hop * Math.PI) * 0.9, 0);
  hero.group.rotation.y = lerp(0, 0.3, hop);
  hero.pose({ t, wave: seg(t, 0.4, 0.6) * (1 - seg(t, 1.3, 1.4)) + seg(t, 2.1, 2.3), look: hop * 0.25 });
  slam.position.y = lerp(14, 0.15, easeIn(seg(t, T.nailSlam - 0.22, T.nailSlam)));
  // surfing nails
  const sw = seg(t, ...T.nailSweep);
  surf.forEach((f, i) => { f.position.x = C.ride[0] + lerp(-2.4, 2.4, sw) - i * 2.2; f.position.y = 1 + Math.sin(t * 5 + i) * 0.2; f.updateMatrixWorld(); });
  surfers.forEach(({ fi, dz, l }) => { const w = surf[fi].anchors.nail.getWorldPosition(new THREE.Vector3()); S.worldToLocal(w);
    l.group.position.set(w.x - Math.abs(dz) * 0.3, w.y, w.z + dz); l.group.rotation.y = 0.5; l.pose({ t, cheer: 1 }); });
  wheee.position.set(C.ride[0] + lerp(-0.3, 0.3, sw), 4.15, 0);
  wheee.scale.setScalar(Math.max(0.001, pop(t, T.wheee, 6, 12)) * (1 + Math.sin(t * 8) * 0.03));
  // pool party
  suds.forEach((b, i) => (b.position.y = 0.55 + Math.sin(t * 2.2 + i) * 0.08));
  rafts.forEach(({ r, l }, i) => { r.position.y = 0.55 + Math.sin(t * 2 + i * 2) * 0.1; r.rotation.y = t * 0.3 * (i % 2 ? 1 : -1) + i;
    r.rotation.z = Math.sin(t * 1.7 + i) * 0.08; l.pose({ t, cheer: i === 1 ? 1 : 0, bob: 1, wave: i === 0 ? 0.6 : 0 }); });
  // comb drag with swingers, then the town
  const cd = seg(t, ...T.combDrag);
  bigComb.position.x = tx + lerp(2.2, -2.2, cd); show(bigComb, t > T.combDrag[0] - 0.1 && t < T.combDrag[1] + 0.2);
  swingers.forEach((s, i) => { s.group.rotation.z = Math.sin(t * 6 + i * 1.3) * 0.5; s.pose({ t, cheer: 1 }); });
  houses.forEach((h, i) => h.scale.setScalar(Math.max(0.001, pop(t, lerp(T.houses[0], T.houses[1], i / 5), 7, 13))));
  banner.scale.setScalar(Math.max(0.001, pop(t, T.flag, 6, 12)));
  banner.anchors.card.rotation.y = Math.sin(t * 3) * 0.15;
  const inTown = pop(t, T.houses[1], 6, 12);
  [box, leader.group].forEach(o => o.scale.setScalar(Math.max(0.001, inTown)));
  leader.pose({ t, wave: t > T.speech ? 0.4 : 0, bob: 1, look: Math.sin(t * 1.5) * 0.3 });
  leader.group.position.y = 1 + (t > T.speech ? Math.abs(Math.sin(t * 7)) * 0.12 : 0);
  crowd.forEach((c, i) => { c.group.scale.setScalar(Math.max(0.001, pop(t, T.houses[1] + i * 0.05, 7, 13))); c.pose({ t, cheer: t > T.speech + 0.4 ? 1 : 0.2, bob: 1 }); });

  // --- bathroom ---
  const sitting = t >= 30 && t < 34.3, late = t >= 34.3;
  const P = you.group;
  if (sitting) { P.position.set(-2.8, 0.95, -1.15); P.rotation.y = 0.25; }
  else if (late) { P.position.set(3.6, 0, -1.6); P.rotation.y = -0.15; }
  else { P.position.set(0.4, 0, 1.4); P.rotation.y = 0.35; }
  const lift = seg(t, T.bulb, T.bulb + 0.4);
  you.pose({
    t, scratch: t < 13 ? seg(t, 3.1, 3.4) : 0, scratchRate: lerp(3, 7.5, seg(t, 3.2, 7.8)),
    lather: t >= 13 && t < 15.5 ? 1 : 0, sit: sitting ? 1 : 0, slump: sitting ? 1 - lift : 0,
    point: late && t < 39 ? smooth(seg(t, T.point, T.point + 0.4)) : 0,
    look: late && t < 42.5 ? -0.5 : 0, tilt: t >= 42.5 ? Math.sin(t * 2) * 0.08 : 0,
    mood: t < 13 ? -0.5 : t < 15.5 ? 0.3 : sitting ? lerp(-1, 0.8, lift) : late ? (t < 42.5 ? 0.7 : 1) : 0,
  });
  idea.position.set(-2.8, 4.3, -1.15); show(idea, sitting && t >= T.bulb);
  idea.scale.setScalar(Math.max(0.001, pop(t, T.bulb, 6, 12)));
  [manq, deal].forEach((o, i) => { show(o, late && !(i && t >= 42.5)); o.scale.setScalar(Math.max(0.001, pop(t, i ? T.sign : T.mannequin, 6, 12)) * (i ? 1 : 1.4)); });
  // march over the comb bridge into the wig
  show(bridge, t >= 38.6 && t < 42.5);
  const dir = WIG.clone().sub(HEAD_TOP).normalize();
  marchers.forEach((m, i) => {
    let s = seg(t, T.march[0] + i * 0.32, T.march[0] + i * 0.32 + 1.7);
    if (i === 5) s = Math.min(s, 0.7) + (t > T.hatTip + 0.5 ? seg(t, T.hatTip + 0.5, T.hatTip + 0.9) * 0.3 : 0);
    show(m.group, t >= 38.6 && t < 42.5 && s < 0.98);
    m.group.position.lerpVectors(HEAD_TOP, WIG, s).y += 0.1;
    m.group.rotation.y = Math.atan2(dir.x, dir.z) + (i === 5 && t > T.hatTip - 0.3 && t < T.hatTip + 0.5 ? 1.8 : 0);
    m.pose({ t: t + i, walk: i === 5 && Math.abs(t - T.hatTip) < 0.5 ? 0 : 1, wave: i === 5 && Math.abs(t - T.hatTip) < 0.5 ? 1 : 0 });
    if (i === 5) m.anchors.hatTop.rotation.z = Math.abs(t - T.hatTip) < 0.4 ? Math.sin(seg(t, T.hatTip - 0.4, T.hatTip + 0.4) * Math.PI) * 0.9 : 0;
  });
  show(peeker.group, t >= T.peek);
  peeker.group.position.y = lerp(-0.3, 0.12, easeOut(seg(t, T.peek, T.peek + 0.2)));
  peeker.pose({ t, wave: seg(t, T.peek + 0.1, T.peek + 0.2) });
  sparks.forEach((s, i) => {
    const a = i * 1.3 + 0.4;
    s.position.set(HEAD_TOP.x + Math.cos(a) * 0.75, HEAD_TOP.y - 0.2 + (i % 3) * 0.25, HEAD_TOP.z + Math.sin(a) * 0.5 + 0.3);
    s.scale.setScalar(Math.max(0.001, pop(t, T.sparkle + i * 0.12, 6, 14)) * (0.8 + Math.sin(t * 9 + i) * 0.2));
    s.rotation.z = t * 2 + i; show(s, t >= T.sparkle);
  });

  // --- screen text ---
  const ti = pop(t, T.title, 8, 16), tout = seg(t, 2.75, 2.95);
  title.style.opacity = t < T.title ? 0 : 1 - tout;
  title.style.transform = `scale(${lerp(2.4, 1, Math.min(1, ti) ) + (ti - 1) * 0.3})`;
  endLetters.forEach((s, i) => {
    const p = pop(t, T.endCard + i * 0.04, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.04 ? 0 : 1;
    s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`;
  });
}

function shoot(t) {
  const s = shotAt(t), x = smooth(seg(t, s.from, s.to)), off = s.world === 'scalp' ? SX : 0;
  const [a, b] = s.cam;
  camera.position.copy(lerpV(a.p, b.p, x)); camera.position.x += off;
  const look = lerpV(a.l, b.l, x); look.x += off;
  const shake = s.id === 1 ? Math.exp(-12 * Math.max(0, t - T.nailSlam)) * (t > T.nailSlam ? 0.12 : 0) : 0;
  camera.position.y += Math.sin(t * 90) * shake; camera.position.x += Math.cos(t * 70) * shake;
  camera.fov = s.fov; camera.updateProjectionMatrix();
  camera.lookAt(look);
  scene.background = SKY[s.world];
  scene.fog = s.world === 'scalp' ? fog : null;
  key.place(look, s.world === 'scalp' ? 14 : 9);
}

window.renderFrame = t => {
  stage(t);
  shoot(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
