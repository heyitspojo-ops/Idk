// Fuck These Fuck Ass Nuns Keep Meowing — vertical toy-diorama reel. Brief: briefs/fuck-these-fuck-ass.md
import * as THREE from 'three';
import { loadFont, toyRenderer, toyLights, overlay, seg, smooth, easeOut, pop, lerp, at, mesh } from '../../bucket-shared/toy-kit.js';
import { buildChurch, buildChurchExterior } from '../../bucket-shared/world-church.js';
import { buildHouse } from '../../bucket-shared/world-house.js';
import { buildStreet } from '../../bucket-shared/world-street.js';
import { buildToyPerson } from '../../bucket-shared/rig-toy-person.js';
import { fightCloud, alarmClock, bed as buildBed, sparkle } from '../../bucket-shared/props.js';
import { snap, hop, punch, dynamicCamera } from '../../bucket-shared/motion-fx.js';
import { DURATION, SHOTS, T, toStory } from './timeline.js';

export const duration = DURATION;
await loadFont();

const view = toyRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 500);
const { key } = toyLights(scene);
const OFF = { church: new THREE.Vector3(), home: new THREE.Vector3(300, 0, 0), street: new THREE.Vector3(600, 0, 0) };
const SKY = { church: '#f6e7d8', home: '#f6e7d8', street: '#ffd9b0' };
const show = (o, v) => (o.visible = v);
const P = (o, s) => o.scale.setScalar(Math.max(0.001, s));

// ---------- worlds ----------
const church = buildChurch(); scene.add(church.group);
const home = buildHouse(); home.group.position.copy(OFF.home); scene.add(home.group);
const street = buildStreet(); street.group.position.copy(OFF.street); scene.add(street.group);
show(street.mine, false);
const outside = buildChurchExterior(); street.group.add(outside.group); outside.group.position.set(0, 0, -8);
const C = church.group, H = home.group;
// ---------- cast ----------
const SKINS = ['#f2c6a0', '#e8b48f', '#d9a07a', '#f0c9a8', '#c98f6a'];
const nunAt = (i, o = {}) => buildToyPerson({ habit: true, shirt: '#1f1b2b', pants: '#1f1b2b', skin: SKINS[i % 5], seed: 20 + i, ...o });
const SEATS = church.seats.slice(0, 27);           // first 4.5 rows
const GERT = 4;                                   // Gertrude's seat: row 0, right half of the left pew? -> use index 4 (row 0, right pew, x ~ 2.0)
const nuns = SEATS.map((s, i) => { const n = nunAt(i); C.add(n.group); n.group.position.copy(s); n.group.rotation.y = Math.PI; return n; });
const gert = nunAt(99, { glasses: true }); C.add(gert.group);
const you = buildToyPerson(); scene.add(you.group);
const soldiers = Array.from({ length: 8 }, (_, i) => { const s = buildToyPerson({ helmet: true, shirt: '#6b7a45', pants: '#4a5830', skin: SKINS[(i + 2) % 5], seed: 60 + i }); street.group.add(s.group); return s; });
const homeG = nunAt(98, { glasses: true }); H.add(homeG.group); homeG.group.position.set(-1.4, 0.6, -2.0);
const bedP = at(buildBed(), 2.6, 0, 0.2, H); bedP.rotation.y = -0.2;
const clock = at(alarmClock('6:00'), 4.4, 0.9, -1.4, H); clock.rotation.y = -0.5;
at(mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), '#a8754a'), 4.4, 0.45, -1.4, H);
const winNun = nunAt(97); H.add(winNun.group);
const cloud = fightCloud(); C.add(cloud); cloud.position.set(0, 0, 1.0);
const dizzy = Array.from({ length: 10 }, () => { const s = sparkle(0.18); C.add(s); return s; });

// ---------- screen text ----------
const ui = overlay();
const pill = (txt, bg, fg = '#2b2233', size = 64) => `<span style="background:${bg};color:${fg};text-shadow:none;border-radius:40px;padding:10px 28px;display:inline-block;font-size:${size}px;box-shadow:0 6px 0 rgba(43,34,64,.3)">${txt}</span>`;
const title = ui.add('THE NUNS KEEP<br>MEOWING', 'left:0;right:0;top:300px;text-align:center;font-size:118px;line-height:1.04;');
const sunday = ui.add(pill('SUNDAY SERVICE', '#ffd166', '#2b2233', 76), 'left:0;right:0;top:300px;text-align:center;');
const bigMeow = ui.add('MEOW!', 'left:0;right:0;top:330px;text-align:center;font-size:220px;color:#ffd166;');
const six = ui.add(pill('6:00 AM', '#ef7b6c', '#fffaf0', 110), 'left:0;right:0;top:300px;text-align:center;');
const pow = ui.add('POW! BAM!', 'left:0;right:0;top:330px;text-align:center;font-size:150px;color:#ffd166;');
const R = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const meows = Array.from({ length: 22 }, (_, i) => ui.add(pill(i % 4 === 0 ? 'MEOW!' : 'meow', '#fffaf0', '#2b2233', 50 + (i % 3) * 16),
  `left:${70 + R(i) * 760}px;top:${330 + R(i + 50) * 1050}px;`));
const end = ui.add(`<div>${[...'SILENT NIGHT. (MORNING.)'].map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('')}</div>`, 'left:0;right:0;top:300px;text-align:center;font-size:78px;');
const endL = [...end.querySelectorAll('span')];

// ---------- per-frame ----------
const dominoAt = i => T.domino[0] + (i / SEATS.length) * (T.domino[1] - T.domino[0]);
function stage(t) {
  const flashback = t >= 6.5 && t < 24.0, Y = you.group;
  // --- nuns in the pews (Gertrude's seat holds Gertrude from her entrance on)
  nuns.forEach((n, i) => {
    const gSeat = i === GERT; show(n.group, !(gSeat && t >= 6.5) && !(t > T.cloud[0] && t < T.cloud[1]) && !(t > 30 && t < 40) && t < 48);
    const started = flashback ? false : t < 6.5 ? true : t >= dominoAt(i);
    const turn = t < 6.5 ? Math.min(1, snap(t, T.whip + (i % 3) * 0.05, 0.25)) : 1;
    const beat = started ? Math.max(0, Math.sin((t - (t < 6.5 ? 0 : dominoAt(i))) * 7 + i)) : 0;
    n.pose({ t, sit: 1, look: t < 6.5 ? lerp(1.3 * (i % 2 ? 1 : -1), 0, turn) : 0, cat: started && t < T.aftermath ? Math.min(1, snap(t, t < 6.5 ? T.catPop + (i % 3) * 0.1 : dominoAt(i), 0.25)) : 0,
      meow: started && t < T.aftermath ? beat : 0, hurt: t >= T.aftermath ? 1 : 0, mood: t >= T.aftermath ? -1 : started ? 0.6 : 0.2 });
  });
  // --- Gertrude: bounces in through the doors, smirks, MEOWS, preens; then sits in her pew
  const G = gert.group; show(G, t >= 6.5 && t < 48 && !(t > T.cloud[0] && t < T.cloud[1]) && !(t > 30 && t < 40) && !(t >= 17.5 && t < 19.5));
  if (t < 14) { const w = seg(t, ...T.gertIn), steps = 5, k = Math.min(1, w * steps), stepT = (w * steps) % 1;
    G.position.set(0, w < 1 ? Math.abs(Math.sin(stepT * Math.PI)) * 0.35 : 0, lerp(8.6, 2.0, Math.min(1, w)));
    G.rotation.y = t < T.smirk - 0.3 ? Math.PI : lerp(Math.PI, Math.PI, 1);
    church.doors.open(Math.min(1, snap(t, T.doors, 0.3)) * (1 - seg(t, 9.8, 10.2)));
    gert.pose({ t, walk: w > 0 && w < 1 ? 1 : 0, walkRate: 4, smug: t > T.smirk ? 1 : 0, mood: t > T.smirk ? 0.6 : 0.2 }); }
  else if (t < 19.5) { G.position.set(0, 0, 2.0); G.rotation.y = Math.PI;
    gert.pose({ t, meow: t > T.bigMeow ? Math.min(1, snap(t, T.bigMeow, 0.2)) * (t < 17 ? 1 : 0.2) : 0, cat: t > T.bigMeow ? 1 : 0, smug: t > 16.5 ? 1 : 0 }); }
  else { G.position.copy(SEATS[GERT]); G.rotation.y = Math.PI; const s = SEATS[GERT];
    const started = t >= dominoAt(GERT) - 0.4 || t < 24;
    gert.pose({ t, sit: 1, smug: t < 24 ? 1 : 0, tilt: t < 24 ? Math.sin(t * 4) * 0.15 : 0, meow: t > 24 && t < T.aftermath ? Math.max(0, Math.sin(t * 7)) : 0,
      cat: t > 24 && t < T.aftermath ? 1 : 0, hurt: t >= T.aftermath ? 1 : 0, mood: t >= T.aftermath ? -1 : 0.7 }); }
  homeG.pose({ t, sit: 1, slump: 0.8, mood: -0.8 });
  // --- you: back pew (flashback relief), bedroom, street with the army, bed at the end
  show(Y, (t >= 21.5 && t < 24) || (t >= 30 && t < 40) || t >= 48);
  let yp = { t };
  if (t < 24) { C.add(Y); Y.position.set(2.0, 0, 5.9); Y.rotation.set(0, Math.PI, 0); yp = { t, sit: 1, mood: t > T.relief ? 0.8 : 0, slump: t > T.relief ? 0.4 : 0 }; }
  else if (t < 35 || t >= 48) { H.add(Y); const up = t < 35 ? Math.min(1, snap(t, T.bolt, 0.18)) : 1 - Math.min(1, snap(t, T.flop, 0.25));
    Y.position.set(2.6, 1.1, 0.4); Y.rotation.set(-Math.PI / 2 * (1 - up), -0.2, 0);
    yp = { t, sit: up, mood: t < 35 ? (t > T.bolt ? -1 : 0) : 1, laugh: t < 35 && t > T.bolt ? 1 : 0, wave: t < 35 && t > T.bolt + 0.6 ? 1 : 0 }; }
  else { street.group.add(Y); Y.position.set(3.2, 0, -0.4); Y.rotation.set(0, -0.9, 0); yp = { t, wave: 1, mood: -1, laugh: t > T.kick ? 0 : 0.6 }; }
  you.pose(yp);
  clock.set({ t, ring: t > T.clock && t < 35 ? 1 : 0 });
  // --- soldiers march up in step, kick the doors open
  soldiers.forEach((s, i) => { show(s.group, t >= 35 && t < 40);
    const row = Math.floor(i / 2), side = i % 2 ? 0.7 : -0.7, m = seg(t, T.march[0] + row * 0.15, T.march[1]);
    s.group.position.set(lerp(-14, side, easeOut(m)) , Math.abs(Math.sin(t * 9)) * 0.18 * (m < 1 ? 1 : 0), -1.2 + row * 1.1); s.group.rotation.y = m < 1 ? Math.PI / 2 : Math.PI;
    s.pose({ t, walk: m < 1 ? 1 : 0, walkRate: 4.5, kick: i === 0 && t > T.kick - 0.15 && t < T.kick + 0.4 ? 1 : 0, kickReach: 1.6, mood: -0.8 }); });
  outside.doors.open(t > T.kick ? Math.min(1.1, snap(t, T.kick, 0.2)) : 0);
  outside.bell.rotation.z = t > 30 && t < 35 ? Math.sin(t * 9) * 0.5 : 0;
  // --- the fight cloud, then the dazed aftermath
  cloud.set({ t, size: t > T.cloud[0] && t < T.cloud[1] ? Math.min(1, snap(t, T.cloud[0], 0.3)) * 0.95 * (1 - seg(t, T.cloud[1] - 0.25, T.cloud[1])) : 0 });
  dizzy.forEach((d, i) => { show(d, t >= T.aftermath && t < 48); const s = SEATS[(i * 3 + 1) % SEATS.length], a = t * 5 + i;
    d.position.set(s.x + Math.cos(a) * 0.5, 2.65, s.z + Math.sin(a) * 0.4); d.rotation.z = t * 6; });
  // --- the window nun at the very end
  show(winNun.group, t >= T.windowNun); winNun.group.position.set(-1.2, lerp(1.0, 2.4, Math.min(1, snap(t, T.windowNun, 0.15))), -3.4);
  winNun.pose({ t, cat: 1, meow: 1 });
}

function screen(t) {
  const pp = (el, a, b, k = 8, w = 15) => { el.style.opacity = t > a && t < b ? 1 : 0; el.style.transform = `scale(${Math.max(0.01, pop(t, a, k, w))})`; };
  pp(title, T.title, 3.45); pp(sunday, 7.2, 10.4); pp(bigMeow, T.bigMeow, 17.3); pp(six, T.clock, 34.9); pp(pow, T.cloud[0] + 0.2, T.cloud[1]);
  bigMeow.style.transform += ` rotate(${Math.sin(t * 25) * 5}deg)`; pow.style.transform += ` rotate(${Math.sin(t * 18) * 6}deg)`;
  meows.forEach((m, i) => { const at0 = t < 3.5 ? 1.0 + i * 0.05 : T.domino[0] + (i / meows.length) * (T.domino[1] - T.domino[0]);
    const on = (t < 3.5 && i < 6 && t > at0) || (t >= T.domino[0] && t < 30 && t > at0) || (t > 31 && t < 35 && i < 10);
    m.style.opacity = on ? 1 : 0; m.style.transform = `scale(${Math.max(0.01, pop(t, t > 31 && t < 35 ? 31 + i * 0.08 : at0, 9, 16))}) rotate(${(R(i + 9) - 0.5) * 20}deg)`; });
  endL.forEach((s, i) => { const p = pop(t, T.endCard + i * 0.03, 8, 15);
    s.style.opacity = t < T.endCard + i * 0.03 ? 0 : 1; s.style.transform = `translateY(${(1 - Math.min(p, 1.2)) * 80}px) scale(${Math.max(0.01, p)})`; });
}

const HITS = [T.whip, T.catPop, T.doors, T.smirk, T.bigMeow, T.domino[0], 26, 28, T.clock, T.bolt, T.whistle, T.kick, T.cloud[0], 41.5, 43, T.aftermath, T.flop, T.windowNun];
function shoot(t) {
  const s = SHOTS.find(x => t < x.to) ?? SHOTS[SHOTS.length - 1];
  const look = dynamicCamera(camera, t, s, OFF[s.world].clone(), HITS);
  scene.background = new THREE.Color(SKY[s.world]);
  key.place(look, s.world === 'street' ? 14 : 11);
}

window.renderFrame = rt => {
  const t = toStory(rt);
  stage(t); scene.updateMatrixWorld(); shoot(t); screen(t);
  view.render(scene, camera, { focus: 0.5, blur: 1 });
};
