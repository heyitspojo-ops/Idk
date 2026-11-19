// Florida swamp diorama: murky water, mud bank, mangrove roots, mossy trees, lily pads, a toy gator and a flamingo.
// buildSwamp({ seed }) -> { group, gator, flamingo, anchors: { crash, wreck, bank } }   water surface at y = 0
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng } from './toy-kit.js';

export function buildSwamp(o = {}) {
  const { seed = 71 } = o;
  const r = rng(seed), g = new THREE.Group();
  at(mesh(new THREE.CircleGeometry(30, 24), mat('#5e7d4a', { roughness: 0.3 })), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  at(mesh(new THREE.CircleGeometry(30, 24), '#3b3a2a'), 0, -1.5, 0, g).rotation.x = -Math.PI / 2;
  const bank = at(mesh(ball(6, 1), '#7a6a45'), -4, -4.6, -6, g); bank.scale.set(1.6, 1, 1);
  for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, d = 3 + r() * 10;
    at(mesh(new THREE.CircleGeometry(0.4 + r() * 0.3, 7), '#7cc68a'), Math.cos(a) * d, 0.02, Math.sin(a) * d, g).rotation.x = -Math.PI / 2; }
  for (let k = 0; k < 6; k++) { const t = at(new THREE.Group(), (k % 2 ? 1 : -1) * (6 + r() * 4), 0, -6 - r() * 6 + k, g);
    for (let i = 0; i < 5; i++) { const root = at(mesh(cyl(0.06, 0.1, 1.6, 4), '#6b4f3a'), Math.cos(i * 1.3) * 0.6, 0.4, Math.sin(i * 1.3) * 0.6, t); root.rotation.set(Math.sin(i) * 0.5, 0, Math.cos(i) * 0.5); }
    at(mesh(cyl(0.25, 0.35, 4, 6), '#6b4f3a'), 0, 2.4, 0, t);
    at(mesh(ball(1.8, 1), '#5f8d55'), 0, 4.8, 0, t).scale.set(1.3, 0.8, 1.3);
    for (let i = 0; i < 4; i++) at(mesh(cyl(0.02, 0.15, 1.4, 4), '#a9b99a'), (r() - 0.5) * 2, 3.8, (r() - 0.5) * 2, t); }
  // gator: long body, snout, eyes, scutes
  const gator = at(new THREE.Group(), 3.4, 0, 1.6, g), gm = mat('#4d7a3a');
  at(mesh(rbox(0.9, 0.4, 3.0, 0.18), gm), 0, 0.05, 0, gator);
  const jaw = at(new THREE.Group(), 0, 0.1, 1.5, gator);
  at(mesh(rbox(0.6, 0.22, 1.1, 0.1), gm), 0, 0.05, 0.5, jaw);
  for (const s of [-1, 1]) { at(mesh(ball(0.12, 1), gm), s * 0.22, 0.32, 0.1, gator.children[0] ? gator : gator).position.set(s * 0.22, 0.32, 1.45);
    at(mesh(ball(0.06, 0), '#ffd166'), s * 0.22, 0.38, 1.55, gator); }
  for (let i = 0; i < 6; i++) at(mesh(new THREE.ConeGeometry(0.1, 0.2, 4), '#3e6330'), 0, 0.33, -1.2 + i * 0.4, gator);
  const tail = at(mesh(new THREE.ConeGeometry(0.35, 1.8, 5), gm), 0, 0.05, -2.3, gator); tail.rotation.x = -Math.PI / 2;
  // flamingo
  const flamingo = at(new THREE.Group(), -3.4, 0, 2.2, g), pk = mat('#f4a3b5');
  at(mesh(cyl(0.025, 0.025, 1.4, 4), pk), 0, 0.7, 0, flamingo);
  at(mesh(ball(0.38, 1), pk), 0, 1.55, 0, flamingo).scale.set(1, 0.8, 1.4);
  const neck = at(mesh(cyl(0.05, 0.06, 0.9, 5), pk), 0, 2.0, 0.35, flamingo); neck.rotation.x = 0.4;
  at(mesh(ball(0.14, 1), pk), 0, 2.45, 0.55, flamingo);
  at(mesh(new THREE.ConeGeometry(0.05, 0.22, 4), '#2b2233'), 0, 2.4, 0.72, flamingo).rotation.x = 2.2;
  gator.jaw = jaw;
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('crash', 0, 0, 0); A('wreck', -3.2, 0, -2.4); A('bank', -4, 1.4, -6);
  return { group: g, gator, flamingo, anchors };
}
