// Small reusable toy props. Each returns a THREE.Group (some with .anchors).
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng, textCard } from './toy-kit.js';

/** Fingertip: tip at origin, finger runs up +y, nail on the +z face. ~len tall. anchors.nail = top of the nail plate. */
export function finger({ skin = '#f2c6a0', nail = '#ffd9df', w = 2.2, len = 9 } = {}) {
  const g = new THREE.Group();
  at(mesh(rbox(w, len, w * 0.9, w * 0.42), skin), 0, len / 2, 0, g);
  const plate = at(mesh(rbox(w * 0.8, w * 1.05, 0.22, 0.1), nail), 0, w * 0.6, w * 0.45, g);
  at(mesh(rbox(w * 0.8, w * 0.2, 0.24, 0.08), '#fffaf5'), 0, w * 0.1, w * 0.46, g);
  g.anchors = { nail: at(new THREE.Object3D(), 0, w * 0.6, w * 0.45 + 0.12, g), plate };
  return g;
}

/** Comb: spine along x, teeth hang down from y=0. */
export function comb({ length = 10, teeth = 20, toothH = 2.5, toothW = 0.18, spineH = 0.6, depth = 0.25, color = '#ef7b6c' } = {}) {
  const g = new THREE.Group();
  at(mesh(rbox(length, spineH, depth, Math.min(spineH, depth) * 0.45), color), 0, spineH / 2, 0, g);
  for (let i = 0; i < teeth; i++) at(mesh(rbox(toothW, toothH, depth * 0.8, toothW * 0.45, 1), color), -length / 2 + (i + 0.5) * (length / teeth), -toothH / 2 + 0.05, 0, g);
  g.anchors = { teethX: i => -length / 2 + (i + 0.5) * (length / teeth), top: spineH };
  return g;
}

/** Mannequin head on a stand with a fluffy wig. Base at y=0, ~1.5 tall at scale 1. anchors.wig = wig centre. */
export function mannequinWig({ wig = '#c7a6f2', head = '#f4f0ea', seed = 5 } = {}) {
  const r = rng(seed), g = new THREE.Group();
  at(mesh(cyl(0.35, 0.42, 0.1, 10), '#3b2f4a'), 0, 0.05, 0, g);
  at(mesh(cyl(0.06, 0.06, 0.4, 6), '#3b2f4a'), 0, 0.3, 0, g);
  at(mesh(cyl(0.14, 0.2, 0.25, 8), head), 0, 0.6, 0, g);
  at(mesh(ball(0.42, 1), head), 0, 0.98, 0, g).scale.set(0.92, 1.1, 1);
  const w = at(new THREE.Group(), 0, 1.2, -0.05, g);
  for (let i = 0; i < 22; i++) {
    const a = r() * Math.PI * 2, e = r() * 1.2;
    at(mesh(ball(0.17 + r() * 0.1, 1), wig), Math.cos(a) * Math.sin(e) * 0.42, Math.cos(e) * 0.32 - 0.05, Math.sin(a) * Math.sin(e) * 0.42 - 0.05, w);
  }
  g.anchors = { wig: w };
  return g;
}

/** Idea light bulb, base at y=0, ~0.9 tall. */
export function bulb() {
  const g = new THREE.Group();
  at(mesh(cyl(0.16, 0.16, 0.22, 8), '#b8bcc6'), 0, 0.11, 0, g);
  at(new THREE.Mesh(ball(0.34, 1), mat('#ffe27a', { emissive: '#ffd23f', emissiveIntensity: 1.6 })), 0, 0.5, 0, g);
  for (let i = 0; i < 8; i++) {
    const ray = at(mesh(rbox(0.06, 0.24, 0.06, 0.02, 1), mat('#ffe27a', { emissive: '#ffd23f', emissiveIntensity: 1.2 })), 0, 0.5, 0, g);
    const a = (i / 8) * Math.PI * 2; ray.position.add(new THREE.Vector3(Math.sin(a) * 0.6, Math.cos(a) * 0.6, 0)); ray.rotation.z = -a;
  }
  return g;
}

/** Little house made of dandruff flakes. ~2 tall. */
export function flakeHouse({ roof = '#ef7b6c', seed = 1 } = {}) {
  const r = rng(seed), g = new THREE.Group(), w = 1.4 + r() * 0.6;
  at(mesh(rbox(w, 1.3, 1.3, 0.12), '#fbf7ee'), 0, 0.65, 0, g);
  const rf = at(mesh(new THREE.ConeGeometry(w * 0.85, 0.9, 4), roof), 0, 1.75, 0, g); rf.rotation.y = Math.PI / 4;
  at(mesh(rbox(0.36, 0.6, 0.06, 0.08), '#8a5a44'), 0, 0.3, 0.66, g);
  at(mesh(rbox(0.3, 0.3, 0.06, 0.05), '#8fd3f4'), w * 0.28, 0.85, 0.66, g);
  return g;
}

/** Flag on a pole with text. Pole base at y=0. */
export function flag(text, { pole = 6, w = 4, color = '#ef7b6c' } = {}) {
  const g = new THREE.Group();
  at(mesh(cyl(0.09, 0.11, pole, 6), '#d9d2c5'), 0, pole / 2, 0, g);
  at(mesh(ball(0.2, 0), '#ffd166'), 0, pole + 0.1, 0, g);
  const card = textCard(text, w, { w: 1024, h: 560, bg: color, color: '#fffaf0', size: 170, radius: 30 });
  at(card, w / 2 + 0.1, pole - w * 0.3, 0, g);
  g.anchors = { card };
  return g;
}

/** Easel sign with text lines. Base at y=0. */
export function sign(lines, { w = 1.6, color = '#fffaf0', ink = '#2b2233' } = {}) {
  const g = new THREE.Group();
  for (const s of [-1, 1]) { const l = at(mesh(cyl(0.03, 0.03, w * 1.1, 5), '#8a5a44'), s * w * 0.35, w * 0.5, -0.05, g); l.rotation.z = s * 0.12; }
  at(textCard(lines, w, { w: 1024, h: 760, bg: color, color: ink, size: 118, radius: 50 }), 0, w * 0.68, 0.02, g);
  return g;
}

/** Speech bubble card facing +z. */
export const bubble = (text, w = 3) => textCard(text, w, { w: 1024, h: 420, bg: '#ffffff', color: '#2b2233', size: 200, radius: 200 });

/** Four-point sparkle. */
export function sparkle(size = 0.3) {
  const g = new THREE.Group(), m = mat('#fff7c2', { emissive: '#fff1a0', emissiveIntensity: 2 });
  for (const rz of [0, Math.PI / 2]) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), m); s.scale.set(0.22, 1, 0.22); s.rotation.z = rz; g.add(s); }
  return g;
}

// ---------- tools & gags (reflection reel) ----------
/** Hammer: handle along -y from the grip (origin), head at the far end. anchors.head (bendable). */
export function hammer({ len = 1.1, headW = 0.5, color = '#9aa3ad', handle = '#b5803e', sledge = false } = {}) {
  const g = new THREE.Group(), L = sledge ? len * 1.6 : len, hw = sledge ? headW * 1.7 : headW;
  at(mesh(cyl(0.05, 0.06, L, 6), handle), 0, -L / 2, 0, g);
  const head = at(new THREE.Group(), 0, -L, 0, g);
  at(mesh(rbox(hw, sledge ? 0.42 : 0.2, sledge ? 0.42 : 0.2, 0.05), color), 0, 0, 0, head);
  g.anchors = { head };
  return g;
}
/** Chainsaw held at the grip (origin); bar points -y. anchors.chain (pops off when it snaps). */
export function chainsaw() {
  const g = new THREE.Group();
  at(mesh(rbox(0.45, 0.4, 0.3, 0.1), '#f4a340'), 0, 0, 0, g);
  at(mesh(rbox(0.3, 0.08, 0.08, 0.03), '#2b2233'), 0, 0.26, 0, g);
  const bar = at(mesh(rbox(0.12, 1.1, 0.04, 0.03), '#c9ced6'), 0, -0.75, 0, g);
  const chain = at(new THREE.Group(), 0, -0.75, 0, g);
  for (let i = 0; i < 10; i++) at(mesh(rbox(0.05, 0.08, 0.06, 0.01, 1), '#3b3b44'), i % 2 ? 0.08 : -0.08, -0.5 + i * 0.11, 0, chain);
  g.anchors = { bar, chain };
  return g;
}
/** Cartoon bomb with a fuse; anchors.spark at the fuse tip. */
export function bomb(r = 0.45) {
  const g = new THREE.Group();
  at(mesh(ball(r, 1), '#2b2233'), 0, r, 0, g);
  at(mesh(cyl(0.12, 0.12, 0.16, 8), '#55556a'), 0, r * 2 + 0.03, 0, g);
  const fuse = at(mesh(cyl(0.03, 0.03, 0.35, 4), '#c9b38a'), 0.08, r * 2 + 0.22, 0, g); fuse.rotation.z = -0.4;
  const spark = at(sparkle(0.18), 0.16, r * 2 + 0.4, 0, g);
  g.anchors = { spark };
  return g;
}
/** Smoke / explosion puff: cluster of balls; call puff.set(p 0..1) to grow, fade and drift. */
export function smoke({ n = 16, size = 1.6, seed = 4, color = '#e9e4ef' } = {}) {
  const r = rng(seed), g = new THREE.Group(), m = mat(color, { transparent: true, opacity: 1 });
  const balls = Array.from({ length: n }, () => {
    const b = at(mesh(ball(0.3 + r() * 0.3, 1), m), (r() - 0.5) * size, r() * size * 0.8, (r() - 0.5) * size * 0.6, g);
    b.userData.d = b.position.clone(); return b;
  });
  g.set = p => { g.visible = p > 0 && p < 1; m.opacity = 1 - Math.max(0, p - 0.5) * 2;
    balls.forEach(b => { b.position.copy(b.userData.d).multiplyScalar(0.3 + p * 1.2); b.scale.setScalar(0.2 + Math.min(1, p * 3)); }); };
  return g;
}
/** Hand mirror: handle along -y from the grip, glass faces +z. anchors.glass */
export function handMirror({ frame = '#e2577a' } = {}) {
  const g = new THREE.Group();
  at(mesh(cyl(0.05, 0.06, 0.45, 6), frame), 0, -0.1, 0, g);
  const f = at(mesh(cyl(0.32, 0.32, 0.08, 14), frame), 0, 0.38, 0, g); f.rotation.x = Math.PI / 2;
  const gm = mat('#d8f1fb', { roughness: 0.1, metalness: 0.3 });
  const glass = at(mesh(cyl(0.27, 0.27, 0.02, 14), gm), 0, 0.38, 0.045, g); glass.rotation.x = Math.PI / 2;
  at(mesh(cyl(0.27, 0.27, 0.02, 14), gm), 0, 0.38, -0.045, g).rotation.x = Math.PI / 2; // glass on both faces
  g.anchors = { glass };
  return g;
}
/** Full-length magic mirror on feet: glass at z=0 facing +z, a box behind it holds the "reflection room".
 *  Put the reflection inside at anchors.inside (z < 0). w x h glass, depth of the room. */
export function mirrorBox({ w = 2.4, h = 4.4, depth = 1.8, frame = '#e0b25c', room = '#fbe3d6', floor = '#9fd8c3' } = {}) {
  const g = new THREE.Group(), y0 = 0.35;
  // frame
  for (const s of [-1, 1]) at(mesh(rbox(0.22, h + 0.44, 0.3, 0.08), frame), s * (w / 2 + 0.11), y0 + h / 2, 0, g);
  for (const y of [y0 - 0.11, y0 + h + 0.11]) at(mesh(rbox(w + 0.44, 0.22, 0.3, 0.08), frame), 0, y, 0, g);
  for (const s of [-1, 1]) at(mesh(rbox(0.5, 0.2, 0.7, 0.08), frame), s * (w / 2), 0.1, 0, g);
  // reflection room (seen through the glass)
  const back = mat(room, { side: THREE.DoubleSide });
  at(mesh(new THREE.BoxGeometry(w, h, 0.05), back), 0, y0 + h / 2, -depth, g);
  for (const s of [-1, 1]) at(mesh(new THREE.BoxGeometry(0.05, h, depth), back), s * w / 2, y0 + h / 2, -depth / 2, g);
  at(mesh(new THREE.BoxGeometry(w, 0.05, depth), floor), 0, y0, -depth / 2, g);
  at(mesh(new THREE.BoxGeometry(w + 0.1, 0.05, depth), back), 0, y0 + h, -depth / 2, g);
  // glass: faint cool sheen
  const glass = at(new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: '#cfefff', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2 })), 0, y0 + h / 2, 0.02, g);
  const glint = at(new THREE.Mesh(new THREE.PlaneGeometry(0.35, h * 1.3), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.0, toneMapped: false })), 0, y0 + h / 2, 0.04, g);
  glint.rotation.z = 0.5;
  g.anchors = { inside: at(new THREE.Object3D(), 0, y0, -depth * 0.5, g), glass, glint, floorY: y0 };
  g.glint = p => { glint.material.opacity = p > 0 && p < 1 ? Math.sin(p * Math.PI) * 0.6 : 0; glint.position.x = (p - 0.5) * w * 1.4; };
  return g;
}
/** Toy sailboat: hull at y=0 waterline, faces +z (bow). anchors.seat, anchors.side (gunwale for peeking). */
export function boat({ hull = '#ef7b6c', sail = '#fffaf0', stripe = '#5fa8d3' } = {}) {
  const g = new THREE.Group();
  const h = at(mesh(rbox(1.8, 0.7, 3.6, 0.3), hull), 0, 0.1, 0, g); h.scale.set(1, 1, 1);
  at(mesh(rbox(1.5, 0.1, 3.2, 0.05), '#d9a873'), 0, 0.42, 0, g);
  at(mesh(rbox(0.5, 0.5, 1.0, 0.2), hull), 0, 0.2, 1.75, g).scale.set(0.8, 1, 1);
  at(mesh(cyl(0.06, 0.07, 4.0, 6), '#b5803e'), 0, 2.4, 1.55, g); // mast at the bow, clear of the seat
  const sg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3.4, 0), new THREE.Vector3(0, 0, -1.3)]);
  sg.setIndex([0, 1, 2]); sg.computeVertexNormals();
  const sl = at(mesh(sg, mat(sail, { side: THREE.DoubleSide })), 0.02, 0.8, 1.45, g); // sail ends ahead of the seat
  const st = at(mesh(rbox(0.04, 0.25, 0.95, 0.01), mat(stripe, { side: THREE.DoubleSide })), 0.04, 1.6, 0.95, g); st.rotation.x = 0.0;
  g.anchors = { seat: at(new THREE.Object3D(), 0, 0.45, -0.6, g), side: at(new THREE.Object3D(), 0.9, 0.5, -0.4, g), sail: sl };
  return g;
}

// ---------- bird-shit gags ----------
const gooMat = () => mat('#f6f4ee', { roughness: 0.35 });
/** Falling poop drop (teardrop), point up. */
export function poopDrop(r = 0.16) {
  const g = new THREE.Group();
  at(mesh(ball(r, 1), gooMat()), 0, 0, 0, g);
  const tip = at(mesh(new THREE.ConeGeometry(r * 0.7, r * 1.4, 6), gooMat()), 0, r * 0.9, 0, g);
  at(mesh(ball(r * 0.45, 0), mat('#b9b6ad')), r * 0.3, -r * 0.2, r * 0.6, g);
  return g;
}
/** Splat: flattened blob with drips, lies on +y. */
export function splat(r = 0.4, seed = 2) {
  const rr = rng(seed), g = new THREE.Group();
  at(mesh(ball(r, 1), gooMat()), 0, 0, 0, g).scale.set(1, 0.25, 1);
  for (let i = 0; i < 6; i++) { const a = i * 1.05 + rr(); at(mesh(ball(r * (0.25 + rr() * 0.2), 0), i % 3 ? gooMat() : mat('#b9b6ad')), Math.cos(a) * r * 1.1, 0, Math.sin(a) * r * 1.1, g).scale.set(1, 0.3, 1); }
  return g;
}
/** Shovel held at the grip (origin), blade along -y. */
export function shovel() {
  const g = new THREE.Group();
  at(mesh(cyl(0.05, 0.05, 1.4, 6), '#b5803e'), 0, -0.6, 0, g);
  at(mesh(rbox(0.3, 0.08, 0.08, 0.03), '#3b2f4a'), 0, 0.12, 0, g);
  const blade = at(mesh(rbox(0.4, 0.5, 0.05, 0.08), '#9aa3ad'), 0, -1.45, 0, g);
  g.anchors = { blade };
  return g;
}
/** Giant laxative bottle with a label. Base at y = 0. */
export function laxative() {
  const g = new THREE.Group();
  at(mesh(cyl(0.32, 0.32, 0.9, 12), '#f4f0ea'), 0, 0.45, 0, g);
  at(mesh(cyl(0.2, 0.22, 0.2, 12), '#e2577a'), 0, 1.0, 0, g);
  at(textCard(['LAXATIVE', 'EXTRA STRONG'], 0.62, { w: 1024, h: 600, bg: '#e2577a', color: '#fffaf0', size: 170, radius: 30 }), 0, 0.48, 0.325, g);
  return g;
}
/** Bird bowl on a stand with seed. Base at y = 0; anchors.food (top). */
export function birdBowl() {
  const g = new THREE.Group();
  at(mesh(cyl(0.07, 0.1, 1.2, 6), '#e0b25c'), 0, 0.6, 0, g);
  at(mesh(cyl(0.55, 0.35, 0.22, 12), '#7cc6a4'), 0, 1.28, 0, g);
  const food = at(new THREE.Group(), 0, 1.4, 0, g);
  for (let i = 0; i < 9; i++) at(mesh(ball(0.07, 0), '#e8c27a'), Math.cos(i * 2.3) * 0.25 * (i % 3) / 2, 0, Math.sin(i * 2.3) * 0.25 * (i % 3) / 2, food);
  g.anchors = { food };
  return g;
}
/** Lawn chair (seat at y ~0.55) + drink. anchors.seat */
export function lawnChair({ color = '#5fa8d3' } = {}) {
  const g = new THREE.Group();
  for (const x of [-0.5, 0.5]) for (const z of [-0.4, 0.4]) at(mesh(cyl(0.04, 0.04, 0.55, 4), '#d9d2c5'), x, 0.27, z, g);
  at(mesh(rbox(1.1, 0.1, 0.9, 0.04), color), 0, 0.55, 0, g);
  const back = at(mesh(rbox(1.1, 1.0, 0.1, 0.04), color), 0, 1.0, -0.5, g); back.rotation.x = -0.35;
  at(mesh(cyl(0.1, 0.08, 0.3, 8), '#ffd166'), 0.75, 0.75, 0.2, g);
  at(mesh(cyl(0.012, 0.012, 0.3, 4), '#e2577a'), 0.78, 0.98, 0.2, g);
  g.anchors = { seat: at(new THREE.Object3D(), 0, 0.6, 0.1, g) };
  return g;
}

// ---------- shopping-cart gags ----------
/** Shopping cart, faces -z (front), handle at +z. anchors: wobble (front-left wheel pivot), wheels[], eyes, handle, basket.
 *  cart.set({ t, wobble 0..1, eyes 0..1 open, squint 0..1, spin (wheel roll angle) }) */
export function cart({ frame = '#b9c0ca', handle = '#e2577a' } = {}) {
  const g = new THREE.Group(), basket = at(new THREE.Group(), 0, 1.05, 0, g), fm = mat(frame, { metalness: 0.3, roughness: 0.4 });
  const W = 1.2, L = 1.7, H = 0.85;
  const bar = (w, h, d, x, y, z) => at(mesh(rbox(w, h, d, Math.min(w, h, d) * 0.4, 1), fm), x, y, z, basket);
  for (const y of [0, H]) { bar(W, 0.05, 0.05, 0, y, -L / 2); bar(W, 0.05, 0.05, 0, y, L / 2); bar(0.05, 0.05, L, -W / 2, y, 0); bar(0.05, 0.05, L, W / 2, y, 0); }
  for (let i = 0; i <= 6; i++) { const z = -L / 2 + (i / 6) * L; bar(0.04, H, 0.04, -W / 2, H / 2, z); bar(0.04, H, 0.04, W / 2, H / 2, z); }
  for (let i = 0; i <= 4; i++) { const x = -W / 2 + (i / 4) * W; bar(0.04, H, 0.04, x, H / 2, -L / 2); bar(0.04, 0.04, L, x, 0, 0); }
  at(mesh(rbox(W + 0.1, 0.12, 0.12, 0.05), handle), 0, H + 0.3, L / 2 + 0.25, basket);
  for (const s of [-1, 1]) { const p = at(mesh(rbox(0.05, 0.4, 0.05, 0.02, 1), fm), s * W / 2, H + 0.12, L / 2 + 0.12, basket); p.rotation.x = 0.5; }
  // chassis + wheels
  for (const s of [-1, 1]) at(mesh(rbox(0.06, 0.06, L, 0.02, 1), fm), s * W * 0.4, 0.28, 0, g);
  for (const s of [-1, 1]) at(mesh(rbox(0.05, 0.75, 0.05, 0.02, 1), fm), s * W * 0.4, 0.66, L / 2 - 0.1, g);
  const wheels = [];
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const piv = at(new THREE.Group(), x * W * 0.4, 0.14, z * L * 0.42, g);
    const wh = at(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 10), '#2b2233'), 0, 0, 0, piv); wh.rotation.z = Math.PI / 2;
    at(mesh(rbox(0.06, 0.14, 0.06, 0.02, 1), fm), 0, 0.12, 0, piv);
    wheels.push({ piv, wh });
  }
  // haunted eyes on the front of the basket
  const eyes = at(new THREE.Group(), 0, H * 0.55, -L / 2 - 0.05, basket), lids = [];
  for (const s of [-1, 1]) {
    const e = at(new THREE.Group(), s * 0.26, 0, 0, eyes);
    at(new THREE.Mesh(ball(0.16, 1), mat('#fff27a', { emissive: '#ffe600', emissiveIntensity: 1.8 })), 0, 0, 0, e);
    at(mesh(ball(0.06, 0), '#221a26'), 0, 0, -0.14, e);
    lids.push(e);
  }
  g.anchors = { wobble: wheels[0].piv, wheels, eyes, handle: at(new THREE.Object3D(), 0, H + 1.35, L / 2 + 0.3, g), basket };
  g.set = ({ t = 0, wobble = 0, eyes: open = 0, squint = 0, spin = 0 } = {}) => {
    wheels.forEach((w, i) => { w.wh.rotation.x = spin; w.piv.rotation.y = 0; });
    wheels[0].piv.rotation.y = Math.sin(t * 34) * 0.9 * wobble; wheels[0].piv.position.x = -W * 0.4 + Math.sin(t * 51) * 0.04 * wobble;
    eyes.visible = open > 0.01; lids.forEach(e => e.scale.set(1, Math.max(0.01, open * (1 - squint * 0.85)), 1));
  };
  g.set();
  return g;
}
/** Little cartoon ghost (~1 tall), faces +z. ghost.set({ t, open }) wiggles the tail. */
export function ghost() {
  const g = new THREE.Group(), m = mat('#f4f7ff', { transparent: true, opacity: 0.85, emissive: '#cfe0ff', emissiveIntensity: 0.4 });
  at(mesh(ball(0.42, 2), m), 0, 0.75, 0, g).scale.set(1, 1.1, 1);
  at(mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.6, 12), m), 0, 0.35, 0, g);
  const tail = Array.from({ length: 4 }, (_, i) => at(mesh(ball(0.12, 1), m), Math.cos(i * 1.57) * 0.25, 0.05, Math.sin(i * 1.57) * 0.25, g));
  for (const s of [-1, 1]) at(mesh(ball(0.07, 1), '#221a26'), s * 0.15, 0.85, 0.38, g);
  at(mesh(ball(0.08, 1), '#221a26'), 0, 0.65, 0.4, g).scale.set(1.4, 0.6, 0.5);
  g.set = ({ t = 0 } = {}) => tail.forEach((b, i) => (b.position.y = 0.05 + Math.sin(t * 9 + i) * 0.06));
  return g;
}
/** Toilet-paper pyramid; returns { group, rolls } so rolls can be thrown. Base at y = 0. */
export function tpPyramid({ rows = 5, color = '#fffaf0', band = '#7cc6a4' } = {}) {
  const g = new THREE.Group(), rolls = [];
  for (let row = 0; row < rows; row++) for (let i = 0; i < rows - row; i++) {
    const rg = at(new THREE.Group(), (i - (rows - row - 1) / 2) * 0.52, 0.25 + row * 0.5, 0, g);
    at(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.48, 12), color), 0, 0, 0, rg);
    at(mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.12, 12), band), 0, 0, 0, rg);
    rg.userData.home = rg.position.clone(); rolls.push(rg);
  }
  return { group: g, rolls };
}

// ---------- wobbly-table gags ----------
/** Little round table with one short leg. Top at y ~1.3. table.set({ t, wobble }) rocks it on the short leg.
 *  anchors: top (where a mug goes), legs[] (for nails), short (the short leg). */
export function wobblyTable({ wood = '#c98f5f', top = '#d9a873' } = {}) {
  const g = new THREE.Group(), rock = at(new THREE.Group(), 0, 0, 0, g);
  at(mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.14, 14), top), 0, 1.3, 0, rock);
  at(mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.1, 14), wood), 0, 1.2, 0, rock);
  const legs = [[0.7, 0.7], [-0.7, 0.7], [-0.7, -0.7], [0.7, -0.7]].map(([x, z], i) => {
    const h = i === 0 ? 1.05 : 1.2; const l = at(mesh(cyl(0.07, 0.06, h, 6), wood), x, 1.2 - h / 2, z, rock); return l; });
  g.anchors = { top: at(new THREE.Object3D(), 0, 1.38, 0, rock), legs, short: legs[0] };
  g.set = ({ t = 0, wobble = 0 } = {}) => { const a = Math.sin(t * 9) * 0.07 * wobble; rock.rotation.set(-a * 0.7, 0, a * 0.7); };
  return g;
}
/** Coffee mug, base at y = 0; mug.set({ slosh }) tilts the coffee surface. */
export function mug({ color = '#5fa8d3' } = {}) {
  const g = new THREE.Group();
  at(mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.4, 12), color), 0, 0.2, 0, g);
  const h = at(mesh(new THREE.TorusGeometry(0.11, 0.03, 6, 10), color), 0.22, 0.22, 0, g); h.rotation.y = Math.PI / 2;
  const coffee = at(mesh(new THREE.CircleGeometry(0.18, 12), '#6b4226'), 0, 0.36, 0, g); coffee.rotation.x = -Math.PI / 2;
  g.set = ({ slosh = 0 } = {}) => { coffee.rotation.z = slosh * 0.3; coffee.position.y = 0.36 + Math.abs(slosh) * 0.03; };
  return g;
}
/** Giant nail (point down at y = 0). */
export function giantNail(len = 1.6) {
  const g = new THREE.Group(), m = mat('#b9c0ca', { metalness: 0.4, roughness: 0.3 });
  at(mesh(cyl(0.06, 0.06, len, 6), m), 0, len / 2 + 0.12, 0, g);
  at(mesh(new THREE.ConeGeometry(0.06, 0.24, 6), m), 0, 0.12, 0, g).rotation.x = Math.PI;
  at(mesh(cyl(0.2, 0.2, 0.06, 10), m), 0, len + 0.15, 0, g);
  return g;
}
/** Steel I-beam along y, length len. */
export function steelBeam(len = 4, color = '#e0702f') {
  const g = new THREE.Group();
  for (const z of [-0.18, 0.18]) at(mesh(rbox(0.36, len, 0.06, 0.02, 1), color), 0, len / 2, z, g);
  at(mesh(rbox(0.06, len, 0.36, 0.02, 1), color), 0, len / 2, 0, g);
  return g;
}
/** Giant hex bolt, shaft down from y = 0 (head on top). */
export function giantBolt(len = 4, r = 0.35) {
  const g = new THREE.Group(), m = mat('#9aa3ad', { metalness: 0.5, roughness: 0.3 });
  at(mesh(new THREE.CylinderGeometry(r * 1.8, r * 1.8, r * 1.1, 6), m), 0, r * 0.55, 0, g);
  at(mesh(cyl(r, r, len, 8), m), 0, -len / 2, 0, g);
  for (let i = 0; i < len / 0.35; i++) at(mesh(new THREE.TorusGeometry(r, 0.04, 4, 10), m), 0, -0.2 - i * 0.35, 0, g).rotation.x = Math.PI / 2;
  return g;
}
/** Giant wrench held at the grip (origin), jaw along -y. */
export function wrench(len = 2.2) {
  const g = new THREE.Group(), m = mat('#c9ced6', { metalness: 0.4, roughness: 0.35 });
  at(mesh(rbox(0.22, len, 0.1, 0.05), m), 0, -len / 2, 0, g);
  for (const s of [-1, 1]) at(mesh(rbox(0.16, 0.4, 0.12, 0.04), m), s * 0.22, -len - 0.1, 0, g);
  at(mesh(rbox(0.6, 0.16, 0.12, 0.05), m), 0, -len + 0.08, 0, g);
  return g;
}
/** Chain of links from a to b (THREE.Vector3s, local to the parent). */
export function chain(a, b, link = 0.9) {
  const g = new THREE.Group(), m = mat('#9aa3ad', { metalness: 0.5, roughness: 0.3 }), d = b.clone().sub(a), n = Math.max(2, Math.round(d.length() / link));
  for (let i = 0; i <= n; i++) { const l = at(mesh(new THREE.TorusGeometry(link * 0.45, link * 0.1, 5, 10), m), 0, 0, 0, g);
    l.position.copy(a).addScaledVector(d, i / n); l.lookAt(l.position.clone().add(d)); if (i % 2) l.rotateZ(Math.PI / 2); }
  return g;
}
/** A sheet of paper with a word on it (flat card). */
export const paper = (text, w = 0.9) => textCard(text, w, { w: 1024, h: 1320, bg: '#fffaf0', color: '#e2574a', size: 220, radius: 30 });

// ---------- car gags ----------
/** NOS bottle held at the valve (origin), body along -y, nozzle at +y. */
export function nosBottle() {
  const g = new THREE.Group();
  at(mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.1, 12), '#3b82f6'), 0, -0.6, 0, g);
  at(mesh(ball(0.22, 1), '#3b82f6'), 0, -0.05, 0, g);
  at(mesh(cyl(0.06, 0.06, 0.3, 6), '#c9ced6'), 0, 0.22, 0, g);
  at(textCard('NOS', 0.36, { w: 512, h: 512, bg: '#fffaf0', color: '#ef4444', size: 220, radius: 60 }), 0, -0.6, 0.225, g);
  return g;
}
/** Little gold trophy, base at y = 0. */
export function trophy() {
  const g = new THREE.Group(), gold = mat('#ffd166', { metalness: 0.5, roughness: 0.25, emissive: '#7a5200', emissiveIntensity: 0.2 });
  at(mesh(rbox(0.3, 0.1, 0.3, 0.03), '#3b2f4a'), 0, 0.05, 0, g);
  at(mesh(cyl(0.04, 0.05, 0.2, 6), gold), 0, 0.2, 0, g);
  at(mesh(cyl(0.2, 0.08, 0.28, 10), gold), 0, 0.42, 0, g);
  for (const s of [-1, 1]) at(mesh(new THREE.TorusGeometry(0.08, 0.02, 4, 8), gold), s * 0.2, 0.44, 0, g).rotation.y = Math.PI / 2;
  return g;
}
/** Snail, faces +z. */
export function snail() {
  const g = new THREE.Group();
  at(mesh(rbox(0.25, 0.12, 0.6, 0.06), '#e8c27a'), 0, 0.06, 0, g);
  at(mesh(ball(0.22, 1), '#c98f5f'), 0, 0.26, -0.08, g);
  for (const s of [-1, 1]) { const st = at(mesh(cyl(0.015, 0.015, 0.16, 4), '#e8c27a'), s * 0.05, 0.18, 0.3, g); st.rotation.x = 0.5; }
  return g;
}
/** Exploding engine parts: pistons + bolts that fly out. parts.set(p 0..1) */
export function engineParts(n = 12, seed = 9) {
  const r = rng(seed), g = new THREE.Group(), list = [];
  for (let i = 0; i < n; i++) { const p = at(mesh(i % 3 ? cyl(0.12, 0.12, 0.3, 6) : rbox(0.25, 0.25, 0.25, 0.04), i % 2 ? '#9aa3ad' : '#6b7280'), 0, 0, 0, g);
    p.userData.v = new THREE.Vector3((r() - 0.5) * 6, 4 + r() * 5, (r() - 0.5) * 6); p.userData.s = r() * 8; list.push(p); }
  g.set = p => { g.visible = p > 0 && p < 1; list.forEach(q => { q.position.copy(q.userData.v).multiplyScalar(p * 1.2); q.position.y -= 9.8 * (p * 1.2) ** 2 / 2 * 1.4; q.rotation.set(p * q.userData.s, p * 3, 0); }); };
  return g;
}

// ---------- pimple gags ----------
/** Cartoon pimple facing +z: red dome + white cap. pimple.set({ t, size, throb 0..1, popped 0..1 }) */
export function pimple() {
  const g = new THREE.Group(), red = mat('#e2574a', { roughness: 0.3 }), cap = mat('#fff7e6', { roughness: 0.25 });
  const dome = at(mesh(ball(0.5, 2), red), 0, 0, 0, g); dome.scale.set(1, 1, 0.7);
  const head = at(mesh(ball(0.2, 1), cap), 0, 0, 0.32, g);
  at(mesh(ball(0.06, 0), '#ffffff'), -0.15, 0.18, 0.4, g); // shine
  const burst = at(new THREE.Group(), 0, 0, 0.4, g);
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; const r = at(mesh(rbox(0.08, 0.5, 0.08, 0.03, 1), cap), Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0, burst); r.rotation.z = a - Math.PI / 2; }
  g.set = ({ t = 0, size = 1, throb = 1, popped = 0 } = {}) => {
    const th = 1 + Math.sin(t * 9) * 0.06 * throb;
    const shown = popped < 0.05;
    dome.visible = head.visible = shown;
    g.scale.setScalar(Math.max(0.001, size * th * (shown ? 1 : 1)));
    burst.visible = popped > 0 && popped < 1; burst.scale.setScalar(0.4 + popped * 1.8);
  };
  g.set();
  return g;
}
/** Wooden crate of oversized safety pins; one pin sticks out the back (anchors.tip, at -z). */
export function safetyPinCrate() {
  const g = new THREE.Group(), wood = mat('#c98f5f'), steel = mat('#c9ced6', { metalness: 0.5, roughness: 0.25 });
  at(mesh(rbox(2.2, 1.4, 4.6, 0.08), wood), 0, 0.7, 0, g);
  for (const z of [-1.6, 0, 1.6]) at(mesh(rbox(2.3, 0.14, 0.2, 0.03), '#a8754a'), 0, 1.0, z, g);
  at(textCard(['SAFETY', 'PINS'], 2.0, { w: 1024, h: 620, bg: '#ffd166', color: '#2b2233', size: 230, radius: 30 }), 1.12, 0.75, 0, g).rotation.y = Math.PI / 2;
  const pin = (len) => { const p = new THREE.Group();
    at(mesh(cyl(0.05, 0.05, len, 6), steel), 0, 0, 0, p).rotation.x = Math.PI / 2;
    at(mesh(new THREE.ConeGeometry(0.05, 0.3, 6), steel), 0, 0, -len / 2 - 0.15, p).rotation.x = -Math.PI / 2;
    at(mesh(new THREE.TorusGeometry(0.2, 0.05, 5, 10), steel), 0, 0, len / 2 + 0.15, p); return p; };
  for (let i = 0; i < 6; i++) { const p = at(pin(2.4), -0.7 + (i % 3) * 0.7, 1.5 + Math.floor(i / 3) * 0.12, -0.3 + (i % 2) * 0.6, g); p.rotation.y = (i - 2.5) * 0.15; }
  const big = at(pin(6), 0.3, 1.1, -4.6, g);
  g.anchors = { tip: at(new THREE.Object3D(), 0.3, 1.1, -7.8, g) };
  return g;
}

// ---------- toilet gags ----------
const brown = () => mat('#7a4a2a', { roughness: 0.35 });
/** Toilet facing +z, floor at y = 0. toilet.set({ t, level 0..1 (water rising to the rim), dirty 0..1, swirl, overflow 0..1, lidUp })
 *  anchors: seat (sit point), bowl (water centre), handle */
export function toilet() {
  const g = new THREE.Group(), white = mat('#fbfbf8', { roughness: 0.25 });
  at(mesh(cyl(0.38, 0.32, 0.7, 12), white), 0, 0.35, 0.1, g);
  const bowl = at(mesh(new THREE.CylinderGeometry(0.62, 0.45, 0.5, 16, 1, true), mat('#fbfbf8', { roughness: 0.25, side: THREE.DoubleSide })), 0, 0.95, 0.25, g);
  bowl.scale.z = 1.25;
  at(mesh(new THREE.TorusGeometry(0.6, 0.08, 6, 18), white), 0, 1.2, 0.25, g).rotation.x = Math.PI / 2;
  g.children[g.children.length - 1].scale.set(1, 1.25, 1);
  at(mesh(rbox(1.2, 1.0, 0.45, 0.12), white), 0, 1.6, -0.55, g);
  at(mesh(rbox(1.3, 0.12, 0.55, 0.05), white), 0, 2.15, -0.55, g);
  const handle = at(mesh(rbox(0.3, 0.07, 0.07, 0.03), '#c9ced6'), -0.45, 1.95, -0.3, g);
  const waterM = new THREE.MeshStandardMaterial({ color: '#bfe6f5', roughness: 0.2, flatShading: true });
  const water = at(new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), waterM), 0, 0.85, 0.25, g); water.rotation.x = -Math.PI / 2; water.scale.y = 1.25;
  const swirl = at(new THREE.Group(), 0, 0.87, 0.25, g);
  for (let i = 0; i < 3; i++) at(mesh(ball(0.07, 0), '#ffffff'), Math.cos(i * 2.1) * 0.3, 0, Math.sin(i * 2.1) * 0.3, swirl);
  const spill = at(new THREE.Group(), 0, 1.2, 0.25, g);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const s = at(mesh(rbox(0.22, 1.1, 0.12, 0.06), brown()), Math.cos(a) * 0.68, -0.55, Math.sin(a) * 0.8, spill); s.rotation.y = -a; }
  const clean = new THREE.Color('#bfe6f5'), dirtyC = new THREE.Color('#7a4a2a');
  g.anchors = { seat: at(new THREE.Object3D(), 0, 1.2, 0.2, g), bowl: at(new THREE.Object3D(), 0, 0.9, 0.25, g), handle };
  g.set = ({ t = 0, level = 0, dirty = 0, swirl: sw = 0, overflow = 0, press = 0 } = {}) => {
    water.position.y = 0.85 + level * 0.35; waterM.color.copy(clean).lerp(dirtyC, dirty);
    swirl.visible = sw > 0; swirl.rotation.y = t * 9; swirl.position.y = water.position.y + 0.02;
    spill.visible = overflow > 0.02; spill.scale.y = Math.max(0.01, overflow);
    handle.rotation.z = -press * 0.5;
  };
  g.set();
  return g;
}
/** Plunger held at the grip (origin), cup at -y. */
export function plunger() {
  const g = new THREE.Group();
  at(mesh(cyl(0.05, 0.05, 1.3, 6), '#c98f5f'), 0, -0.6, 0, g);
  at(mesh(new THREE.SphereGeometry(0.28, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat('#e2574a', { side: THREE.DoubleSide })), 0, -1.35, 0, g).rotation.x = Math.PI;
  return g;
}
/** Fast-food wrapper (generic purple + yellow, no logos) with a short label. Folded packet, ~0.6 wide. */
export function wrapper(label = 'GORDITA') {
  const g = new THREE.Group();
  at(mesh(rbox(0.7, 0.12, 0.5, 0.05), '#7b3fa0'), 0, 0, 0, g);
  at(mesh(rbox(0.72, 0.13, 0.12, 0.04), '#ffd166'), 0, 0, 0, g);
  at(textCard(label, 0.6, { w: 1024, h: 300, color: '#fffaf0', size: 210 }), 0, 0.07, 0.12, g).rotation.x = -Math.PI / 2;
  return g;
}
/** Brown tornado funnel of puffs + falling drops. tornado.set({ t, size 0..1 }) */
export function shitTornado({ h = 14, seed = 3 } = {}) {
  const r = rng(seed), g = new THREE.Group(), m = mat('#7a4a2a', { roughness: 0.6 }), m2 = mat('#5e3820', { roughness: 0.6 });
  const puffs = Array.from({ length: 70 }, (_, i) => { const y = (i / 70) * h, rad = 0.4 + (y / h) ** 1.4 * 4.5;
    const p = at(mesh(ball(0.5 + (y / h) * 0.9, 1), i % 3 ? m : m2), 0, y, 0, g); p.userData = { y, rad, a: r() * 6.28, sp: 2 + r() * 2 }; return p; });
  const drops = Array.from({ length: 40 }, () => { const d = poopDrop(0.18); d.traverse(o => o.material && (o.material = m)); g.add(d); d.userData = { x: (r() - 0.5) * 18, z: (r() - 0.5) * 18, o: r() }; return d; });
  g.set = ({ t = 0, size = 1, rain = 1 } = {}) => {
    g.visible = size > 0.01;
    puffs.forEach(p => { const { y, rad, a, sp } = p.userData, ang = a + t * sp;
      p.position.set(Math.cos(ang) * rad * size, y * size, Math.sin(ang) * rad * size); p.scale.setScalar(Math.max(0.01, size)); });
    drops.forEach(d => { const k = (t * 0.8 + d.userData.o) % 1; d.visible = rain > 0.01;
      d.position.set(d.userData.x * size, h * size * (1 - k), d.userData.z * size); d.rotation.x = Math.PI; });
  };
  g.set();
  return g;
}
/** Shoulder sash with text (worn across the chest): attach to a person's torso. */
export function sash(text = 'MAYOR') {
  const g = new THREE.Group();
  const band = at(mesh(rbox(0.22, 1.5, 0.06, 0.03), '#e2574a'), 0, 0, 0, g); band.rotation.z = 0.75;
  at(textCard(text, 0.62, { w: 1024, h: 300, bg: '#fffaf0', color: '#e2574a', size: 210, radius: 30 }), 0, 0, 0.05, g).rotation.z = 0.75;
  return g;
}
