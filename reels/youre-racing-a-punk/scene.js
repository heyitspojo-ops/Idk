// You're Racing a Punk Ass Honda Civic — vertical toy-diorama reel. Brief: briefs/youre-racing-a-punk.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, easeIn, pop, lerp, lerpV, mesh, rbox, ball, at } from '../../bucket-shared/toy-kit.js';
import { buildDragStrip } from '../../bucket-shared/world-drag-strip.js';
import { buildUsaMap } from '../../bucket-shared/world-usa-map.js';
import { buildSwamp } from '../../bucket-shared/world-swamp.js';
import { buildCar } from '../../bucket-shared/car-toy.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { nosBottle, trophy, snail as buildSnail, engineParts, smoke, sparkle } from '../../bucket-shared/props.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 600);
const { key } = toyLights(scene);
const OFF = { strip: new THREE.Vector3(), map: new THREE.Vector3(500, 0, 0), swamp: new THREE.Vector3(800, 0, 0) };
const SKY = { strip: new THREE.Color('#bfe7f5'), map: new THREE.Color('#f6e7d8'), swamp: new THREE.Color('#d8e8c8') };
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));

// ---------- worlds ----------
const strip = buildDragStrip(); scene.add(strip.group);
const usa = buildUsaMap(); usa.group.position.copy(OFF.map); scene.add(usa.group);
const swamp = buildSwamp(); swamp.group.position.copy(OFF.swamp); scene.add(swamp.group);
// ---------- cars & drivers ----------
const mine = buildCar({ style: 'sedan', body: '#d9c7a3', convertible: true });
const civic = buildCar({ style: 'hatch', body: '#9be15d', rust: false, spoiler: true, underglow: '#a855f7', convertible: true });
scene.add(mine.group, civic.group);
const seatPerson = (car, o) => { const p = buildToyPerson(o); car.anchors.seat.add(p.group); p.group.scale.setScalar(0.5); return p; };
const you = seatPerson(mine), punk = seatPerson(civic, { shirt: '#2b2233', hair: '#f4d03f', skin: '#e8b48f', seed: 9 });
const youFoot = buildToyPerson(); scene.add(youFoot.group); // you, standing (pit beats)
const bottle = nosBottle(); youFoot.anchors.handR.add(bottle); bottle.rotation.x = Math.PI * 0.6;
const cup = trophy(); scene.add(cup);
const slug = buildSnail(); scene.add(slug); slug.scale.setScalar(1.6);
const parts = engineParts(14); scene.add(parts);
const boomSmoke = smoke({ n: 16, size: 2.6, color: '#5b5560' }); scene.add(boomSmoke);
const exhaust = Array.from({ length: 5 }, (_, i) => { const s = smoke({ n: 3, size: 0.5, seed: i, color: '#d9d4cb' }); scene.add(s); return s; });
const flames = Array.from({ length: 4 }, (_, i) => { const f = mesh(new THREE.ConeGeometry(0.18, 0.9, 6), '#60a5fa'); f.material = f.material.clone();
  f.material.emissive = new THREE.Color('#3b82f6'); f.material.emissiveIntensity = 2; scene.add(f); return f; });
const doorsFly = mine.doors.map(d => { const c = d.clone(); c.material = d.material; scene.add(c); return c; });
const trail = Array.from({ length: 24 }, () => at(mesh(ball(0.12, 0), '#e2577a'), 0, 0, 0, usa.group));
const mapCar = buildCar({ body: '#d9c7a3', convertible: true }); usa.group.add(mapCar.group); mapCar.group.scale.setScalar(0.3);
const splash = Array.from({ length: 12 }, (_, i) => at(mesh(ball(0.3, 1), '#cfe9dc'), 0, 0, 0, swamp.group));

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#fffaf0') => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:40px;padding:14px 40px;display:inline-block;box-shadow:0 8px 0 rgba(43,34,64,.3)">${txt}</span>`;
const big = (txt, top = 330, size = 150, color = '#ffd166') => ui.add(txt, `left:0;right:0;top:${top}px;text-align:center;font-size:${size}px;line-height:1.04;color:${color};`);
const title = ui.add("YOU'RE RACING A<br>PUNK ASS CIVIC", 'left:0;right:0;top:300px;text-align:center;font-size:104px;line-height:1.04;');
const race = [1, 2, 3].map(n => ui.add(pill(`RACE #${n}`, '#ef7b6c'), 'left:0;right:0;top:' + (n === 1 ? 560 : 300) + 'px;text-align:center;font-size:96px;'));
const loser = ui.add(pill('LOSER', '#2b2233'), 'left:0;right:0;top:300px;text-align:center;font-size:120px;');
const nos = ui.add(pill('NOS', '#3b82f6'), 'left:0;right:0;top:300px;text-align:center;font-size:130px;');
const boom = big('BOOM', 360, 230);
const florida = ui.add(pill('FLORIDA', '#f4a3b5', '#2b2233'), 'left:0;right:0;top:300px;text-align:center;font-size:110px;');
const flash = ui.add('', 'inset:0;background:#fffaf0;');
const end = ui.add(`<div>${[...'WINNER (TECHNICALLY).'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:84px;');
const endL = [...end.querySelectorAll('span')];

// ---------- choreography ----------
const LANE = { you: 1.6, civic: -1.6 };
function race1(t) { // z positions on the strip
  const c = t < T.green ? 0 : Math.min(85, 18 * (t - T.green) ** 1.4);
  const y = t < T.green ? 0 : Math.min(12, 0.8 * (t - T.green));
  return { you: y, civic: c };
}
function stage(t) {
  const M = mine.group, C = civic.group;
  M.rotation.set(0, 0, 0); C.rotation.set(0, 0, 0); M.scale.setScalar(1); C.scale.setScalar(1);
  show(youFoot.group, false); show(cup, false); show(slug, false); parts.set(0); boomSmoke.set(0);
  exhaust.forEach(s => s.set(0)); flames.forEach(f => show(f, false)); doorsFly.forEach(d => show(d, false));
  let ms = { t, engine: 'stock', doors: 4, speed: 0 }, cs = { t, speed: 0 };
  let yp = { t, sit: 1, mood: 0 }, pp = { t, sit: 1, smug: 1, mood: 0.6 }, fp = { t };
  // --- race 1 (0–13.5)
  if (t < 13.5) { const z = race1(t); M.position.set(LANE.you, 0, z.you); C.position.set(LANE.civic, 0, z.civic);
    ms.speed = t > T.green ? 6 : 0; cs.speed = t > T.green ? 30 : 0; ms.bounce = t > T.floor ? 1 : 0.3;
    Object.assign(yp, { mood: t > T.floor && t < 10 ? 1 : t > 10 ? -1 : -0.3, wave: t > T.civicWins ? 1 : 0, laugh: t > T.floor && t < 10 ? 1 : 0 });
    show(slug, t > T.snail - 0.4); slug.position.set(LANE.you + 1.4, 0, z.you - 2 + (t - T.snail) * 1.6);
    exhaust.forEach((s, i) => { const p = ((t * 1.5 + i / 5) % 1); s.position.set(M.position.x - 0.6, 0.5 + p, M.position.z - 2.3 - p * 1.2); s.set(0.2 + p * 0.5); }); }
  // --- pit: tear the doors off (13.5–17)
  else if (t < 17) { M.position.set(9, 0, 2); M.rotation.y = 0.4; C.position.set(LANE.civic, 0, 85);
    const n = T.doors.filter(x => t > x).length; ms.doors = 4 - n; show(you.group, false);
    show(youFoot.group, true); youFoot.group.position.set(10.8, 0, 2.8); youFoot.group.rotation.y = -1.2;
    fp = { t, wave: Math.abs(((t - T.doors[0]) * 1.66) % 1 - 0.5) < 0.25 ? 1 : 0, mood: -1 };
    doorsFly.forEach((d, i) => { const p = seg(t, T.doors[i], T.doors[i] + 0.9); show(d, p > 0 && p < 1);
      d.position.set(10.6 + p * 3 + i * 0.3, 1 + Math.sin(p * Math.PI) * 3, 3.5 + p * 2); d.rotation.set(p * 5, p * 4, 0); }); }
  // --- race 2: NOS (17–26.5)
  else if (t < 26.5) { const go = t > T.launch2 ? (t - T.launch2) : 0, boomed = t > T.boom;
    M.position.set(LANE.you, 0, Math.min(18, go * go * 6)); C.position.set(LANE.civic, 0, t > T.launch2 ? Math.min(30, go * 9) : 0);
    Object.assign(ms, { doors: 0, hoodOpen: t < T.launch2 ? 1 : 0, speed: go ? 40 : 0, blown: boomed ? 1 : 0, char: boomed ? 1 : 0, bounce: t > T.nos ? 1 : 0 });
    cs.speed = go ? 25 : 0;
    if (t < T.launch2) { show(you.group, false); show(youFoot.group, true); youFoot.group.position.set(LANE.you + 0.2, 0, 3.4); youFoot.group.rotation.y = Math.PI;
      fp = { t, hold: 1, mood: t > T.nos ? 1 : 0.2, laugh: t > T.nos ? 1 : 0 }; }
    else show(you.group, true);
    Object.assign(yp, { mood: boomed ? -1 : 1, laugh: !boomed && go ? 1 : 0 });
    flames.forEach((f, i) => { show(f, t > T.nos && !boomed); f.position.set(M.position.x - 0.6 + (i - 1.5) * 0.08, 0.45, M.position.z - 2.5 - i * 0.25);
      f.rotation.x = -Math.PI / 2; P(f, 0.8 + Math.sin(t * 40 + i) * 0.3); });
    parts.position.set(M.position.x, 1.3, M.position.z + 1.2); parts.set(seg(t, T.boom, T.boom + 1.6));
    boomSmoke.position.set(M.position.x, 1.5, M.position.z + 1.0); boomSmoke.set(seg(t, T.boom, T.boom + 3.0)); }
  // --- pit: V8 (26.5–35)
  else if (t < 35) { const inPit = t < 31; M.position.set(inPit ? 9 : LANE.you, 0, inPit ? 2 : 0); M.rotation.y = inPit ? 0.4 : 0; C.position.set(LANE.civic, 0, 0);
    Object.assign(ms, { doors: 0, engine: 'v8', bounce: 0.6 });
    mine.parts.v8.position.y = 1.05 + (inPit ? (1 - easeOut(seg(t, ...T.crane))) * 7 : 0);
    Object.assign(yp, { mood: t > 29 ? 1 : 0, smug: t > 29 && inPit ? 1 : 0, look: t > T.peek ? -0.9 : 0, tilt: t > T.peek ? -0.4 : 0 });
    if (t > T.peek) you.group.position.x = 0.35 * smooth(seg(t, T.peek, T.peek + 0.5)); else you.group.position.x = 0; }
  // --- race 3: torque twist, smash, fly (35–43.5)
  else if (t < 43.5) { const go = Math.max(0, t - T.launch3);
    const zc = Math.min(45, go * 7), zm = Math.min(34, go * go * 2.2);
    C.position.set(LANE.civic, 0, zc);
    Object.assign(ms, { doors: 0, engine: 'v8', speed: go ? 50 : 0, twist: smooth(seg(t, ...T.twist)) * (t < T.smash ? 1 : 0.6), lift: go ? 0.6 + Math.sin(t * 9) * 0.2 : 0, bounce: 1 });
    cs.speed = go ? 20 : 0;
    const fly = seg(t, ...T.fly), hit = t > T.smash;
    const mx = hit ? lerp(0, -1.2, seg(t, T.smash, T.smash + 0.3)) : lerp(LANE.you, 0, seg(t, 39.0, T.smash));
    M.position.set(mx, fly * 22, hit ? 34 + fly * 18 : zm); M.rotation.set(fly * 6, fly * 2, fly * 4);
    if (hit) { C.position.set(-2.6, fly * 18, 36 + fly * 14); C.rotation.set(-fly * 5, -fly * 3, fly * 3); }
    Object.assign(yp, { mood: t > T.twist[0] ? -1 : 1, laugh: 1 }); Object.assign(pp, { smug: hit ? 0 : 1, mood: hit ? -1 : 0.6, laugh: hit ? 1 : 0 }); }
  // --- across the USA (43.5–47): tiny car on the map; real cars parked off-screen
  else if (t < 47) { M.position.set(0, -50, 0); C.position.set(0, -50, 0);
    const a = smooth(seg(t, ...T.arc)), w = usa.anchors.west.position, f = usa.anchors.florida.position;
    mapCar.group.position.set(lerp(w.x, f.x, a), 0.6 + Math.sin(a * Math.PI) * 5, lerp(w.z, f.z, a)); mapCar.group.rotation.set(a * 9, a * 4, a * 6);
    trail.forEach((d, i) => { const k = i / trail.length; show(d, k < a); d.position.set(lerp(w.x, f.x, k), 0.6 + Math.sin(k * Math.PI) * 5, lerp(w.z, f.z, k)); }); }
  // --- swamp (47–60)
  else { const S = OFF.swamp, land = seg(t, T.splash - 0.4, T.splash);
    M.position.set(S.x + 0.4, lerp(8, -0.35, easeIn(land)), S.z - 0.3 + (1 - land) * 6); M.rotation.set(0, -0.4, 0.12);
    C.position.set(S.x - 3.4, 0.8, S.z - 2.6); C.rotation.set(0, 0.6, Math.PI);
    Object.assign(ms, { doors: 0, engine: 'v8', char: 0 }); cs.speed = t > T.wreck ? 18 : 0;
    splash.forEach((d, i) => { const p = seg(t, T.splash, T.splash + 1.0), a = i * 0.52; show(d, p > 0 && p < 1);
      d.position.set(0.4 + Math.cos(a) * p * 3.4, Math.sin(p * Math.PI) * 2.4, -0.3 + Math.sin(a) * p * 3.4); });
    swamp.gator.position.set(lerp(5.6, 3.0, smooth(seg(t, T.splash, T.gator))), 0, lerp(3.4, 1.4, smooth(seg(t, T.splash, T.gator))));
    swamp.gator.rotation.y = -2.3; swamp.gator.jaw.rotation.x = -Math.abs(Math.sin(t * 2)) * 0.4;
    if (t > 57) { swamp.gator.position.set(0.9, 1.15, 1.9); swamp.gator.rotation.y = 0.1; swamp.gator.scale.setScalar(0.55); } else swamp.gator.scale.setScalar(1);
    const onRoof = t > T.trophy - 0.6;
    show(you.group, !onRoof); show(youFoot.group, onRoof);
    if (onRoof) { youFoot.group.position.set(S.x + 0.3, 0.75, S.z - 0.6); youFoot.group.rotation.y = 0.5; fp = { t, wave: 1, mood: 1, smug: 1 }; }
    show(cup, onRoof); cup.position.copy(youFoot.anchors.handR.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(0, 0.05, 0));
    Object.assign(yp, { mood: -0.6, tilt: Math.sin(t * 2) * 0.1 }); Object.assign(pp, { smug: 0, mood: -1, laugh: 1, sit: 1 }); }
  mine.set(ms); civic.set(cs); you.pose(yp); punk.pose(pp); youFoot.pose(fp);
  strip.tree.set(t < T.red ? 0 : t < T.yellow ? 1 : t < T.green ? 2 : t < 13.5 ? 3 : t > T.race2 && t < T.launch2 ? (t < T.launch2 - 0.8 ? 2 : 3) : t > 35 && t < T.launch3 ? 2 : 3);
}

function screen(t) {
  const pp = (el, a, b, w = 15) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, 8, w))})`; };
  pp(title, T.title, 3.45); pp(race[0], T.red, 3.45); pp(loser, T.civicWins, 13.45); pp(race[1], T.race2, 18.5); pp(nos, T.nos, T.launch2 + 1.3);
  pp(boom, T.boom, T.boom + 1.4); pp(race[2], T.race3, T.launch3 + 1.2); pp(florida, T.splash + 0.8, 51.9);
  flash.style.opacity = t > T.boom && t < T.boom + 0.4 ? 1 - seg(t, T.boom, T.boom + 0.4) : t > T.smash && t < T.smash + 0.3 ? 1 - seg(t, T.smash, T.smash + 0.3) : 0;
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.04, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.04 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1], k = smooth(seg(t, s.from, s.to)), [a, b] = s.cam;
  const base = s.track === 'you' ? mine.group.position.clone().setY(0) : s.track === 'civic' ? civic.group.position.clone().setY(0) : OFF[s.world].clone();
  const shake = (t > T.boom && t < T.boom + 0.6) || (t > T.smash && t < T.smash + 0.5) ? 0.2 : t > T.launch3 && t < T.smash ? 0.05 : 0;
  camera.position.copy(lerpV(a.p, b.p, k)).add(base); camera.position.x += Math.sin(t * 80) * shake; camera.position.y += Math.cos(t * 70) * shake;
  const look = lerpV(a.l, b.l, k).add(base);
  camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  scene.background = SKY[s.world];
  key.place(look, s.world === 'map' ? 16 : 12);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
