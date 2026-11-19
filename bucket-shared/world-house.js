// Cosy toy living room: floor, three walls (open to +z), couch, lamp, rug, window, TV, a door on the right wall.
// buildHouse({ seed, w, d }) -> { group, anchors: { door, couch, lamp, center } }   floor top at y = 0
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at } from './toy-kit.js';

export function buildHouse(o = {}) {
  const { w = 11, d = 8, wall = '#f7e3c8', floor = '#d9a873', accent = '#e2577a' } = o;
  const g = new THREE.Group(), H = 7;
  at(mesh(rbox(w + 0.6, 0.6, d + 0.6, 0.25), '#c98f5f'), 0, -0.32, 0, g);
  for (let i = 0; i < 9; i++) at(mesh(rbox(w / 9 - 0.05, 0.06, d, 0.02, 1), i % 2 ? floor : '#e2b483'), -w / 2 + (i + 0.5) * (w / 9), 0, 0, g);
  at(mesh(rbox(w + 0.6, H, 0.4, 0.12), wall), 0, H / 2, -d / 2 - 0.2, g);
  at(mesh(rbox(0.4, H, d + 0.6, 0.12), wall), -w / 2 - 0.2, H / 2, 0, g);
  at(mesh(rbox(0.4, H, d + 0.6, 0.12), wall), w / 2 + 0.2, H / 2, 0, g);
  at(mesh(rbox(w + 0.6, 0.35, 0.1, 0.04), '#e9c9a3'), 0, 0.18, -d / 2 + 0.02, g);
  // door (right wall), window, picture
  at(mesh(rbox(0.12, 3.6, 1.8, 0.06), '#8a5a44'), w / 2 - 0.02, 1.8, 1.5, g);
  at(mesh(ball(0.1, 0), '#ffd166'), w / 2 - 0.1, 1.8, 0.9, g);
  at(mesh(rbox(2.6, 1.8, 0.12, 0.08), '#ffffff'), -1.2, 4.2, -d / 2 + 0.02, g);
  at(mesh(rbox(2.3, 1.5, 0.1, 0.06), mat('#bfe6f5', { roughness: 0.2 })), -1.2, 4.2, -d / 2 + 0.06, g);
  at(mesh(rbox(1.4, 1.0, 0.08, 0.05), accent), 2.8, 4.4, -d / 2 + 0.03, g);
  at(mesh(rbox(3.6, 0.05, 2.6, 0.02, 1), '#f4a3b5'), -0.6, 0.04, 0.4, g);
  // couch
  const c = at(new THREE.Group(), -1.4, 0, -2.4, g);
  at(mesh(rbox(3.8, 0.8, 1.5, 0.25), '#7cc6a4'), 0, 0.6, 0, c);
  at(mesh(rbox(3.8, 1.3, 0.45, 0.2), '#6ab894'), 0, 1.25, -0.6, c);
  for (const s of [-1, 1]) at(mesh(rbox(0.45, 1.1, 1.5, 0.2), '#6ab894'), s * 2.0, 0.85, 0, c);
  for (const s of [-1, 1]) at(mesh(rbox(0.7, 0.6, 0.25, 0.12), '#ffd166'), s * 1.1, 1.25, -0.3, c);
  // lamp
  const l = at(new THREE.Group(), 2.6, 0, -2.6, g);
  at(mesh(cyl(0.35, 0.4, 0.12, 10), '#3b2f4a'), 0, 0.06, 0, l);
  at(mesh(cyl(0.05, 0.05, 2.6, 6), '#3b2f4a'), 0, 1.35, 0, l);
  at(mesh(cyl(0.45, 0.7, 0.7, 10), mat('#fbe3a0', { emissive: '#fbe3a0', emissiveIntensity: 0.3 })), 0, 2.9, 0, l);
  // TV on a stand (left)
  at(mesh(rbox(1.6, 0.7, 0.8, 0.08), '#b5803e'), -4.2, 0.35, 0.8, g);
  const tv = at(mesh(rbox(0.15, 1.1, 1.7, 0.06), '#2b2233'), -4.5, 1.3, 0.8, g);
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('door', w / 2 - 1.0, 0, 1.5); A('couch', -1.4, 1.0, -2.3); A('lamp', 2.6, 3.25, -2.6); A('center', 0.4, 0, 0.8);
  return { group: g, anchors };
}
