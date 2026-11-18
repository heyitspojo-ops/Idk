// Bathroom diorama on a rounded base: tiled floor, two walls, tub, counter with sink and mirror, towel, mat.
// buildBathroom({ seed, floor, wall, tub, accent, w, d })
//   -> { group, anchors: { stand, tubEdge, counterTop, mirror, wallLeft }, size }
// Units: a toy person is ~3 tall. Base is w x d, floor top at y = 0, origin at floor centre.
import * as THREE from 'three';
import { mesh, rbox, cyl, ball, at, rng, mat } from './toy-kit.js';

export function buildBathroom(o = {}) {
  const { seed = 11, floor = '#9fd8c3', floor2 = '#b8e6d4', wall = '#fbe3d6', tile = '#f6cfc0', tub = '#ffd77a',
    accent = '#ef7b6c', w = 12, d = 9 } = o;
  const r = rng(seed), g = new THREE.Group();
  at(mesh(rbox(w + 0.6, 0.9, d + 0.6, 0.3), '#e9b7a2'), 0, -0.55, 0, g);
  for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) {
    const c = new THREE.Color((i + j) % 2 ? floor : floor2).offsetHSL(0, 0, (r() - 0.5) * 0.03);
    at(mesh(rbox(0.94, 0.12, 0.94, 0.04, 1), '#' + c.getHexString()), -w / 2 + 0.5 + i, -0.06, -d / 2 + 0.5 + j, g);
  }
  const H = 7.5;
  at(mesh(rbox(w + 0.6, H, 0.4, 0.12), wall), 0, H / 2 - 0.1, -d / 2 - 0.2, g);
  at(mesh(rbox(0.4, H, d + 0.6, 0.12), wall), -w / 2 - 0.2, H / 2 - 0.1, 0, g);
  at(mesh(rbox(w + 0.6, 2.2, 0.1, 0.04), tile), 0, 1.1, -d / 2 + 0.03, g);
  at(mesh(rbox(0.1, 2.2, d + 0.6, 0.04), tile), -w / 2 + 0.03, 1.1, 0, g);
  // tub (back-left)
  const tubG = at(new THREE.Group(), -w / 2 + 2.6, 0, -d / 2 + 1.7, g);
  at(mesh(rbox(4.6, 1.6, 2.8, 0.5), tub), 0, 0.8, 0, tubG);
  at(mesh(rbox(4.0, 0.1, 2.2, 0.05), mat('#8fd3f4', { roughness: 0.2 })), 0, 1.5, 0, tubG);
  for (const x of [-1.9, 1.9]) for (const z of [-1, 1]) at(mesh(ball(0.2, 0), '#d9a441'), x, 0.05, z * 1.1, tubG);
  at(mesh(cyl(0.08, 0.08, 0.8, 6), '#c9ced6'), 1.9, 2.0, -1.1, tubG);
  for (let i = 0; i < 5; i++) at(mesh(ball(0.25 + r() * 0.15, 1), mat('#ffffff', { roughness: 0.4 })), -1.4 + r() * 2.8, 1.6, -0.6 + r() * 1.2, tubG);
  // counter + sink + mirror (back-right)
  const ctr = at(new THREE.Group(), w / 2 - 2.4, 0, -d / 2 + 1.1, g);
  at(mesh(rbox(3.8, 2.6, 1.8, 0.2), '#c3b1e1'), 0, 1.3, 0, ctr);
  at(mesh(rbox(4.0, 0.2, 2.0, 0.08), '#ffffff'), 0, 2.7, 0, ctr);
  at(mesh(cyl(0.6, 0.45, 0.25, 10), '#e8eef3'), -0.6, 2.85, 0.1, ctr);
  at(mesh(cyl(0.06, 0.06, 0.5, 6), '#c9ced6'), -0.6, 3.05, -0.6, ctr);
  for (const x of [-0.9, 0.9]) at(mesh(rbox(1.2, 0.08, 0.06, 0.02), '#ffffff'), x, 1.5, 0.92, ctr);
  at(mesh(rbox(2.4, 2.8, 0.15, 0.4), '#ffffff'), -0.3, 4.9, -0.9, ctr);
  at(mesh(rbox(2.1, 2.5, 0.1, 0.35), mat('#bfe6f5', { roughness: 0.15, metalness: 0.2 })), -0.3, 4.9, -0.82, ctr);
  // towel on left wall, bath mat
  at(mesh(cyl(0.06, 0.06, 2.0, 6), '#c9ced6'), -w / 2 + 0.1, 4.4, 1.6, g).rotation.x = Math.PI / 2;
  at(mesh(rbox(0.12, 2.0, 1.6, 0.05), accent), -w / 2 + 0.15, 3.4, 1.6, g);
  at(mesh(rbox(2.6, 0.06, 1.6, 0.05), '#f4a3b5'), 0.4, 0.03, 1.4, g);
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('stand', 0.4, 0, 1.4); A('tubEdge', -w / 2 + 3.2, 1.62, -d / 2 + 3.1); A('counterTop', w / 2 - 2.4 + 1.0, 2.8, -d / 2 + 1.1);
  A('mirror', w / 2 - 2.7, 4.9, -d / 2 + 0.3); A('wallLeft', -w / 2, 3.5, 0);
  return { group: g, anchors, size: { w, d, H } };
}
