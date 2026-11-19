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
