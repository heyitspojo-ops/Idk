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
