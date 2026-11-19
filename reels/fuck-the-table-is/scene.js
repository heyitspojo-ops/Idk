// Fuck, the Table Is Uneven — vertical toy-diorama reel. Brief: briefs/fuck-the-table-is.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildHouse } from '../../bucket-shared/world-house.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildCosmos } from '../../bucket-shared/world-planet.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { buildCat } from '../../bucket-shared/rig-cat.js';
import { hammer, wrench, wobblyTable, mug, giantNail, steelBeam, giantBolt, chain, paper, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 1200);
const { key, hemi } = toyLights(scene);
const OFF = { room: new THREE.Vector3(), street: new THREE.Vector3(300, 0, 0), space: new THREE.Vector3(1000, 0, 0) };
const SKY = { room: new THREE.Color('#f6e7d8'), street: new THREE.Color('#bfe7f5'), space: new THREE.Color('#141032') };
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));

// ---------- worlds ----------
const room = buildHouse(); scene.add(room.group);
const street = buildStreet(); street.group.position.copy(OFF.street); scene.add(street.group);
const cosmos = buildCosmos(); cosmos.group.position.copy(OFF.space); scene.add(cosmos.group);
const RG = room.group, home = street.mine;
// ---------- cast & props (room) ----------
const table = at(wobblyTable(), 0.6, 0, 1.0, RG);
const cup = mug(); table.anchors.top.add(cup);
const nails = table.anchors.legs.map(l => { const n = giantNail(1.4); RG.add(n); n.userData.x = table.position.x + l.position.x; n.userData.z = table.position.z + l.position.z; return n; });
const beams = [[-5.1, -3.6], [5.1, -3.6], [-2.4, -3.7], [2.4, -3.7]].map(([x, z]) => at(steelBeam(7), x, 0, z, RG));
const welds = Array.from({ length: 6 }, () => at(sparkle(0.25), 0, 0, 0, RG));
const you = buildToyPerson(), cat = buildCat();
scene.add(you.group); scene.add(cat.group);
const ham = hammer({ sledge: true }), wr = wrench(2.6);
you.anchors.handR.add(ham); you.anchors.handR.add(wr);
const divorce = at(paper('DIVORCE', 0.8), 0, 0, 0, RG); divorce.rotation.x = -Math.PI / 2;
const dustMark = at(mesh(new THREE.CircleGeometry(1.1, 16), '#c2a47e'), 0.6, 0.06, 1.0, RG); dustMark.rotation.x = -Math.PI / 2;
// street + space
const bolts = [[-2.4, 1.9], [2.4, 1.9], [-2.4, -1.9], [2.4, -1.9]].map(([x, z]) => at(giantBolt(4, 0.3), x, 0, z, home));
const sunChain = chain(new THREE.Vector3(6.2, 0, 0), new THREE.Vector3(31, 3, -8), 1.6); cosmos.group.add(sunChain);
const galChain = chain(new THREE.Vector3(40, 4, -18), new THREE.Vector3(20, 10, -250), 7); cosmos.group.add(galChain);

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:40px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add('THE TABLE<br>IS UNEVEN', 'left:0;right:0;top:300px;text-align:center;font-size:120px;line-height:1.04;');
const genius = ui.add('GENIUS.', 'left:0;right:0;top:330px;text-align:center;font-size:160px;color:#ffd166;');
const wob = ui.add(pill('PLANET: WOBBLING', '#ef7b6c'), 'left:0;right:0;top:1380px;text-align:center;font-size:92px;');
const end = ui.add(`<div>${[...'TECHNICALLY FIXED.'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:100px;');
const endL = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
function stage(t) {
  const Y = you.group, C = cat.group;
  Y.rotation.set(0, 0, 0); C.rotation.set(0, 0, 0); RG.rotation.set(0, 0, 0); home.rotation.set(0, 0, 0); cosmos.planet.rotation.set(0, 0, 0); cosmos.group.rotation.set(0, 0, 0);
  // wobble levels
  const tableW = t < T.still ? 1 : t > 42 ? 0 : 0;
  const roomW = t > T.seesaw[0] && t < T.seesaw[1] ? smooth(seg(t, T.seesaw[0], T.seesaw[0] + 0.6)) * (1 - seg(t, 14.0, 14.6)) : 0;
  const houseW = t > T.houseRock[0] && t < T.houseRock[1] ? 1 - seg(t, 27.3, 27.8) : 0;
  const planetW = t > T.quake && t < T.sway[0] ? 1 : 0;
  RG.rotation.z = Math.sin(t * 3) * 0.06 * roomW + (t > 20 && t < 24.5 ? Math.sin(t * 2.5) * 0.04 : 0) + (t > 33.5 && t < 38 ? Math.sin(t * 9) * 0.015 : 0);
  home.rotation.z = Math.sin(t * 3.4) * 0.09 * houseW;
  cosmos.planet.rotation.set(Math.sin(t * 5) * 0.12 * planetW, t * 0.15, Math.sin(t * 4) * 0.15 * planetW);
  if (t > T.sway[0] && t < 42.2) cosmos.group.rotation.z = Math.sin(t * 3) * 0.04;
  table.set({ t, wobble: tableW }); cup.set({ slosh: Math.sin(t * 9) * tableW });
  // moon: orbit, bumped by the wobbling planet
  const ma = t * 0.4 + (t > T.moonBump ? easeOut(seg(t, T.moonBump, T.moonBump + 1)) * 1.2 : 0);
  cosmos.moon.position.set(Math.cos(ma) * 12, 2 + Math.sin(t * 6) * 0.5 * planetW, Math.sin(ma) * 12 - 2);
  // nails, beams, bolts, chains
  nails.forEach((n, i) => { const d = seg(t, T.nails[i] - 0.15, T.nails[i]); show(n, t > T.nails[i] - 0.15 && t < 43);
    n.position.set(n.userData.x, lerp(2.4, -0.55, easeIn(d)), n.userData.z); });
  beams.forEach((b, i) => { show(b, t > T.beams[i] && t < 43); b.scale.set(1, Math.max(0.001, pop(t, T.beams[i], 6, 12)), 1); });
  welds.forEach((w, i) => { const k = Math.floor(t * 12) + i; const on = t > T.beams[0] && t < 14.4; show(w, on);
    w.position.set(beams[i % 4].position.x + Math.sin(k) * 0.3, 0.3 + (k % 5) * 0.4, -3.3); w.rotation.z = k; });
  bolts.forEach((b, i) => { const d = seg(t, T.bolts[i] - 0.35, T.bolts[i] + 0.25); show(b, t > T.bolts[i] - 0.35);
    b.position.y = lerp(6, 0.35, easeOut(d)); b.rotation.y = d * 12; });
  show(sunChain, t > T.chainSun && t < 42.2); sunChain.scale.setScalar(Math.max(0.001, Math.min(1, pop(t, T.chainSun, 6, 12))));
  show(galChain, t > T.chainGalaxy && t < 42.2);
  // you: parent + local placement per beat
  let yp = { t, mood: -0.6 };
  show(ham, t > 3 && t < 7); show(wr, (t > 11 && t < 15) || (t > 24.5 && t < 29));
  const place = (parent, x, z, ry) => { parent.add(Y); Y.position.set(x, 0, z); Y.rotation.set(0, ry, 0); };
  if (t < 7) { place(RG, 2.3, 1.4, -Math.PI / 2);
    const k = ((t - T.nails[0] + 0.35) * 1.66) % 1, hitting = t > T.nails[0] - 0.4 && t < T.still;
    Object.assign(yp, { swingUp: hitting ? 1 : 0, swing: hitting ? (k < 0.5 ? k * 2 : 2 - k * 2) : 0, mood: t > T.dust ? 0.8 : -0.8, smug: t > T.genius ? 1 : 0, wave: t > T.dust && t < T.genius + 0.6 ? 0.5 : 0 }); }
  else if (t < 11) { place(RG, 2.3, 1.6, 0); Object.assign(yp, { wave: 1, hold: 1, mood: -0.6, tilt: Math.sin(t * 3) * 0.1 }); }
  else if (t < 15) { place(RG, 3.0, -2.7, -Math.PI / 2 - 0.3); Object.assign(yp, { hold: 1, mood: -0.8 }); }
  else if (t < 20) { place(home, 0, 2.3, 0); Object.assign(yp, { wave: t > T.thumbs ? 1 : 0, mood: t > T.thumbs ? 0.9 : -0.6, smug: t > T.thumbs ? 1 : 0 }); }
  else if (t >= 24.5 && t < 29) { place(street.group, 2.9, -5.3, -0.5); Object.assign(yp, { hold: 1, mood: -1 }); }
  else if (t < 43) { place(RG, 2.6, 1.6, -Math.PI / 2); Object.assign(yp, { mood: -1 }); }
  else { place(RG, -0.3, 2.3, 0.9); Object.assign(yp, { mood: t > T.drag[0] ? 1 : 0.4, smug: t > T.drag[0] ? 0.6 : 0 }); }
  you.pose(yp);
  // cat
  let cp = { t, unimpressed: 1 };
  if (t < 43) { RG.add(C); C.position.set(-1.4, 1.0, -2.3); C.rotation.y = 0.15;
    Object.assign(cp, { blink: t > T.blink && t < T.blink + 0.9 ? Math.sin(seg(t, T.blink, T.blink + 0.9) * Math.PI) : 0,
      pissed: t > 33.5 && t < 43 ? 1 : 0, look: t > 33.5 && t < 38 ? lerp(0.9, 0, smooth(seg(t, ...T.turn))) : 0, tail: t > 33.5 ? 1 : 0.3 }); }
  else { const d = seg(t, ...T.drag), door = new THREE.Vector3(5.0, 0, 1.5);
    const at0 = t < T.drag[0];
    C.position.copy(at0 ? new THREE.Vector3(1.9, 0, 1.9) : new THREE.Vector3(lerp(2.7, 6.8, smooth(d)), 0, 1.7));
    C.rotation.y = at0 ? -0.9 : Math.PI / 2;
    Object.assign(cp, { paw: t > T.paper - 0.3 && t < T.paper + 0.5 ? 1 : 0, bob: at0 ? 0 : 1, blink: t > T.lookBack ? Math.sin(seg(t, T.lookBack, T.lookBack + 0.6) * Math.PI) : 0,
      look: t > T.lookBack - 0.3 ? -1.2 : 0, tail: 1 }); }
  cat.pose(cp);
  // table leaves with the cat
  if (t > T.drag[0]) { const d = smooth(seg(t, ...T.drag)); table.position.set(lerp(0.6, 4.6, d), 0, lerp(1.0, 1.5, d)); }
  else table.position.set(0.6, 0, 1.0);
  show(dustMark, t > T.drag[0] + 0.3);
  show(divorce, t > T.paper - 0.4 && t < T.drag[0] + 0.1);
  divorce.position.set(lerp(1.3, 0.1, smooth(seg(t, T.paper - 0.3, T.paper + 0.5))), 1.4, 1.1);
}

function screen(t) {
  const pp = (el, a, b) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, 15))})`; };
  pp(title, T.title, 2.95); pp(genius, T.genius, 6.95); pp(wob, 29.4, 33.4);
  wob.style.transform += ` rotate(${Math.sin(t * 14) * 4}deg)`;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.05, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.05 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1], k = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = OFF[s.world];
  const quake = (t > T.quake && t < 29) ? 0.12 : (t > 29 && t < 38) ? 0.05 : 0;
  camera.position.copy(lerpV(a.p, b.p, k)).add(base); camera.position.x += Math.sin(t * 70) * quake; camera.position.y += Math.cos(t * 63) * quake;
  const look = lerpV(a.l, b.l, k).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  scene.background = SKY[s.world];
  hemi.intensity = s.world === 'space' ? 1.0 : 1.5; key.intensity = s.world === 'space' ? 3.0 : 2.6;
  key.place(look, s.world === 'space' ? 30 : 10);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
