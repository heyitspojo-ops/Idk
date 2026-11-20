// Toy church. buildChurch() = interior box: altar end at z = -10, entrance doors at z = +8, aisle along x = 0,
// pews both sides (seats listed in anchors.seats, facing -z toward the altar), stained-glass windows on the side walls.
//   -> { group, anchors: { altar, doors, aisle }, seats: [Vector3], doors: { open(k) } }
// buildChurchExterior() = white church with a steeple + bell and big front doors facing +z. -> { group, bell, doors }
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng } from './toy-kit.js';

export function buildChurch(o = {}) {
  const { seed = 91 } = o;
  const r = rng(seed), g = new THREE.Group(), W = 12, L = 18, H = 8, z0 = -10, z1 = 8;
  at(mesh(rbox(W + 0.6, 0.5, L + 0.6, 0.15), '#c9a27a'), 0, -0.27, (z0 + z1) / 2, g);
  at(mesh(rbox(2.2, 0.05, L - 1, 0.02, 1), '#c2364a'), 0, 0.01, (z0 + z1) / 2 + 0.5, g);
  const wall = '#fbf3e6';
  for (const s of [-1, 1]) at(mesh(rbox(0.4, H, L, 0.1), wall), s * (W / 2 + 0.2), H / 2, (z0 + z1) / 2, g);
  at(mesh(rbox(W + 0.8, H, 0.4, 0.1), wall), 0, H / 2, z0 - 0.2, g);
  // stained glass: side walls
  const glassCols = ['#ef7b6c', '#5fa8d3', '#ffd166', '#7cc6a4', '#c3b1e1'];
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const win = at(new THREE.Group(), s * (W / 2 - 0.02), 4.4, z0 + 3 + i * 4, g); win.rotation.y = -s * Math.PI / 2;
    at(mesh(rbox(1.6, 3.0, 0.08, 0.6), '#6b5a4a'), 0, 0, 0, win);
    for (let k = 0; k < 6; k++) at(new THREE.Mesh(rbox(0.65, 0.85, 0.06, 0.05), mat(glassCols[(i + k) % 5], { emissive: glassCols[(i + k) % 5], emissiveIntensity: 0.6 })), (k % 2 - 0.5) * 0.7, 1.0 - Math.floor(k / 2) * 0.95, 0.04, win);
  }
  // altar + cross + candles + organ
  at(mesh(rbox(5, 0.5, 2.6, 0.1), '#d9a873'), 0, 0.25, z0 + 1.6, g);
  at(mesh(rbox(2.4, 1.2, 1.0, 0.08), '#fbfbf8'), 0, 1.1, z0 + 1.4, g);
  const gold = mat('#ffd166', { metalness: 0.5, roughness: 0.3, emissive: '#7a5200', emissiveIntensity: 0.25 });
  at(mesh(rbox(0.22, 2.4, 0.18, 0.05), gold), 0, 5.0, z0 + 0.05, g); at(mesh(rbox(1.3, 0.22, 0.18, 0.05), gold), 0, 5.5, z0 + 0.05, g);
  for (const x of [-0.8, 0.8]) { at(mesh(cyl(0.06, 0.06, 0.5, 6), '#fffaf0'), x, 1.95, z0 + 1.4, g); at(new THREE.Mesh(ball(0.07, 0), mat('#ffd166', { emissive: '#ffb703', emissiveIntensity: 2 })), x, 2.25, z0 + 1.4, g); }
  const organ = at(new THREE.Group(), 4.2, 0, z0 + 1.0, g);
  at(mesh(rbox(1.8, 1.4, 1.0, 0.1), '#8a5a44'), 0, 0.7, 0, organ);
  for (let i = 0; i < 7; i++) at(mesh(cyl(0.1, 0.1, 2 + (i % 4) * 0.5, 8), '#c9ced6'), -0.75 + i * 0.25, 2.2 + (i % 4) * 0.25, -0.3, organ);
  // pews: rows on both sides of the aisle; 3 seats each
  const seats = [], wood = '#a8754a';
  for (let row = 0; row < 6; row++) for (const s of [-1, 1]) {
    const z = z0 + 6.4 + row * 1.9, x = s * 3.1; // pews start well back from the altar (room for a front camera)
    at(mesh(rbox(3.6, 0.15, 0.7, 0.05), wood), x, 0.75, z, g);
    at(mesh(rbox(3.6, 1.0, 0.14, 0.05), wood), x, 1.2, z + 0.4, g);
    for (const e of [-1, 1]) at(mesh(rbox(0.14, 1.3, 0.8, 0.05), '#8a5a44'), x + e * 1.8, 0.65, z + 0.1, g);
    for (let k = 0; k < 3; k++) seats.push(new THREE.Vector3(x + (k - 1) * 1.1, 0, z));
  }
  // entrance doors (front wall with an opening)
  for (const s of [-1, 1]) at(mesh(rbox(W / 2 - 1.4, H, 0.4, 0.1), wall), s * (W / 4 + 0.7), H / 2, z1 + 0.2, g);
  at(mesh(rbox(2.8, H - 4, 0.4, 0.1), wall), 0, 4 + (H - 4) / 2, z1 + 0.2, g);
  const leaves = [-1, 1].map(s => { const hinge = at(new THREE.Group(), s * 1.4, 0, z1 + 0.1, g);
    at(mesh(rbox(1.38, 3.9, 0.15, 0.06), '#8a5a44'), -s * 0.69, 1.95, 0, hinge); return hinge; });
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('altar', 0, 0.5, z0 + 1.6); A('doors', 0, 0, z1 - 0.6); A('aisle', 0, 0, 0);
  return { group: g, anchors, seats, doors: { open: k => leaves.forEach((h, i) => (h.rotation.y = (i ? -1 : 1) * k * 1.6)) } };
}

export function buildChurchExterior() {
  const g = new THREE.Group(), white = '#fbf3e6';
  at(mesh(rbox(7, 5, 9, 0.15), white), 0, 2.5, 0, g);
  const roof = at(mesh(new THREE.ConeGeometry(6.2, 3, 4), '#8a5a44'), 0, 6.4, 0, g); roof.rotation.y = Math.PI / 4; roof.scale.z = 1.4;
  const tower = at(new THREE.Group(), 0, 0, 3.6, g);
  at(mesh(rbox(2.4, 9, 2.4, 0.1), white), 0, 4.5, 0, tower);
  const bell = at(mesh(new THREE.CylinderGeometry(0.35, 0.65, 0.8, 10), mat('#ffd166', { metalness: 0.5, roughness: 0.3 })), 0, 7.6, 0, tower);
  at(mesh(new THREE.ConeGeometry(1.8, 3.2, 4), '#8a5a44'), 0, 10.6, 0, tower).rotation.y = Math.PI / 4;
  at(mesh(rbox(0.12, 1.2, 0.12, 0.03), '#ffd166'), 0, 12.6, 0, tower); at(mesh(rbox(0.7, 0.12, 0.12, 0.03), '#ffd166'), 0, 12.8, 0, tower);
  const leaves = [-1, 1].map(s => { const h = at(new THREE.Group(), s * 0.9, 0, 4.82, g); at(mesh(rbox(0.88, 2.6, 0.12, 0.05), '#8a5a44'), -s * 0.44, 1.3, 0, h); return h; });
  for (let i = 0; i < 3; i++) at(mesh(rbox(3 - i * 0.4, 0.2, 0.6, 0.04), '#d9d4cb'), 0, 0.1 + i * 0.2, 5.6 - i * 0.5, g);
  return { group: g, bell, doors: { open: k => leaves.forEach((h, i) => (h.rotation.y = (i ? -1 : 1) * k * 1.6)) } };
}
