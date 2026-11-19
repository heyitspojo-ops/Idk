// Toy highway along z: 4 lanes (x -4.5..4.5), dashed lines, guard rails, grass, an overpass at z = -40, a few
// distant hills. buildHighway({ len }) -> { group, anchors: { mid } }   road at y = 0
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng } from './toy-kit.js';

export function buildHighway(o = {}) {
  const { len = 160, seed = 81 } = o;
  const r = rng(seed), g = new THREE.Group();
  const grass = at(mesh(new THREE.PlaneGeometry(120, len), '#a8dd8f'), 0, -0.03, 0, g); grass.rotation.x = -Math.PI / 2;
  at(mesh(rbox(10, 0.06, len, 0.02, 1), '#6b6f7d'), 0, 0, 0, g);
  for (let z = -len / 2; z < len / 2; z += 4) for (const x of [-2.25, 2.25]) at(mesh(rbox(0.14, 0.08, 2, 0.02, 1), '#fffaf0'), x, 0.01, z, g);
  at(mesh(rbox(0.16, 0.08, len, 0.02, 1), '#ffd166'), 0, 0.01, 0, g);
  for (const s of [-1, 1]) { at(mesh(rbox(0.12, 0.35, len, 0.04, 1), '#c9ced6'), s * 5.4, 0.55, 0, g);
    for (let z = -len / 2; z < len / 2; z += 3) at(mesh(cyl(0.06, 0.06, 0.6, 4), '#9aa3ad'), s * 5.4, 0.3, z, g); }
  const ov = at(new THREE.Group(), 0, 0, -40, g);
  at(mesh(rbox(22, 0.8, 3, 0.1), '#c9c4bb'), 0, 6, 0, ov);
  for (const s of [-1, 1]) at(mesh(rbox(1, 6, 2.4, 0.1), '#b9b4ab'), s * 7, 3, 0, ov);
  for (let i = 0; i < 10; i++) at(mesh(ball(8 + r() * 6, 1), '#8fcf7e'), (r() - 0.5) * 100, -4, -70 - r() * 20, g).scale.set(1.6, 0.6, 1);
  for (let i = 0; i < 14; i++) { const t = at(new THREE.Group(), (r() > 0.5 ? 1 : -1) * (9 + r() * 12), 0, (r() - 0.5) * len * 0.8, g);
    at(mesh(cyl(0.15, 0.2, 1.4, 5), '#8a5a44'), 0, 0.7, 0, t); at(mesh(ball(1 + r() * 0.5, 1), '#6cc48a'), 0, 2.1, 0, t); }
  const anchors = { mid: at(new THREE.Object3D(), 0, 0, 0, g) };
  return { group: g, anchors };
}
