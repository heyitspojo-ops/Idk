// Underground bunker cutaway: layered dirt block with a room open to +z, grass on top, a hatch + ladder,
// an air vent in the back wall, a bare bulb and a cot. buildBunker({ w, h, d }) -> { group, anchors: { floor, vent, hatch, cot, bulb } }
// Room floor at y = 0; ground surface at y = h + 1.
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at } from './toy-kit.js';

export function buildBunker(o = {}) {
  const { w = 8, h = 5, d = 5 } = o;
  const g = new THREE.Group(), dirt = ['#8a5a44', '#9c6b50', '#7a4e3b', '#a8775a'];
  const T = 1.0; // wall thickness
  // layered dirt shell: floor, back, sides, ceiling (stripes = layers)
  for (let i = 0; i < 5; i++) at(mesh(rbox(w + 2 * T, (h + 2 * T) / 5, 0.9, 0.05, 1), dirt[i % 4]), 0, -T + (i + 0.5) * (h + 2 * T) / 5, -d / 2 - 0.45, g);
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) at(mesh(rbox(T, (h + 2 * T) / 5, d + 0.9, 0.05, 1), dirt[(i + 1) % 4]), s * (w / 2 + T / 2), -T + (i + 0.5) * (h + 2 * T) / 5, 0, g);
  at(mesh(rbox(w + 2 * T, T, d + 0.9, 0.08), dirt[2]), 0, -T / 2, 0, g);
  at(mesh(rbox(w + 2 * T, T, d + 0.9, 0.08), dirt[3]), 0, h + T / 2, 0, g);
  at(mesh(rbox(w + 2 * T + 0.2, 0.25, d + 1.1, 0.1), '#a8dd8f'), 0, h + T + 0.1, 0, g);
  // concrete-ish room lining
  at(mesh(rbox(w, 0.1, d, 0.03, 1), '#c9c4bb'), 0, 0.05, 0, g);
  at(mesh(rbox(w, h, 0.1, 0.03, 1), '#d9d4cb'), 0, h / 2, -d / 2 + 0.05, g);
  // hatch + ladder (right)
  const hx = w / 2 - 1.3;
  at(mesh(cyl(0.75, 0.75, 0.15, 12), '#6b7280'), hx, h + T + 0.25, 0.2, g);
  at(mesh(cyl(0.08, 0.08, 0.5, 6), '#ffd166'), hx, h + T + 0.4, 0.2, g).rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) at(mesh(cyl(0.05, 0.05, h + T, 5), '#b5803e'), hx + s * 0.35, (h + T) / 2, 0.2, g);
  for (let i = 0; i < 8; i++) at(mesh(cyl(0.04, 0.04, 0.7, 5), '#b5803e'), hx, 0.5 + i * 0.7, 0.2, g).rotation.z = Math.PI / 2;
  // vent (back wall, left-high), bulb, cot
  const vent = at(new THREE.Group(), -w / 2 + 1.6, h - 1.0, -d / 2 + 0.15, g);
  at(mesh(rbox(1.2, 0.8, 0.2, 0.05), '#9aa3ad'), 0, 0, 0, vent);
  for (let i = 0; i < 4; i++) at(mesh(rbox(1.0, 0.06, 0.1, 0.01, 1), '#4b5563'), 0, -0.25 + i * 0.17, 0.12, vent);
  at(mesh(cyl(0.02, 0.02, 0.8, 4), '#2b2233'), 0, h - 0.4, 0, g);
  at(new THREE.Mesh(ball(0.2, 1), mat('#fff3b0', { emissive: '#ffe27a', emissiveIntensity: 1.5 })), 0, h - 0.85, 0, g);
  const cot = at(new THREE.Group(), -1.2, 0, -0.8, g);
  at(mesh(rbox(3.2, 0.5, 1.4, 0.1), '#6b8f71'), 0, 0.5, 0, cot);
  at(mesh(rbox(0.9, 0.25, 1.0, 0.1), '#fffaf0'), -1.1, 0.85, 0, cot);
  const light = new THREE.PointLight('#ffe9a8', 6, 12, 1.5); light.position.set(0, h - 1.0, 0.3); g.add(light);
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('floor', 0.6, 0.1, 0.8); A('vent', vent.position.x, vent.position.y, vent.position.z + 0.3); A('hatch', hx, h, 0.2); A('cot', -1.2, 0.75, -0.8); A('bulb', 0, h - 0.85, 0);
  return { group: g, anchors };
}
