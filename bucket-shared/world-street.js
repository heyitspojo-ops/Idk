// Sunny toy street: grass, sidewalk along x, road, pastel houses and round trees; "your" house in the middle
// with a front lawn. buildStreet({ seed, length }) -> { group, anchors: { door, lawn, walkStart, walkEnd, sky }, houses, mine }
// Units: a toy person is ~3 tall. Sidewalk runs along x at z = 0; your front door faces +z at x = 0.
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng } from './toy-kit.js';

export function buildStreet(o = {}) {
  const { seed = 21, length = 60 } = o;
  const r = rng(seed), g = new THREE.Group();
  const grass = at(mesh(new THREE.PlaneGeometry(length + 40, 60), '#a8dd8f'), 0, -0.02, -10, g); grass.rotation.x = -Math.PI / 2;
  for (let i = 0; i < length / 1.2; i++) at(mesh(rbox(1.15, 0.12, 2.4, 0.04, 1), i % 2 ? '#e9e2d6' : '#f2ece2'), -length / 2 + i * 1.2, 0.04, 0, g);
  at(mesh(rbox(length, 0.05, 5, 0.02, 1), '#7c7f8f'), 0, 0.0, 4.2, g);
  for (let i = 0; i < length / 3; i++) at(mesh(rbox(1.2, 0.06, 0.25, 0.02, 1), '#fffaf0'), -length / 2 + i * 3, 0.04, 4.2, g);
  const palette = [['#f7c8a0', '#ef7b6c'], ['#bfe0f0', '#5fa8d3'], ['#fbe3a0', '#e0a040'], ['#d9c8f0', '#9a7fd1'], ['#c8ecd8', '#55b38a']];
  const house = (x, z, [wall, roof], w = 5, mine = false) => {
    const h = at(new THREE.Group(), x, 0, z, g);
    at(mesh(rbox(w, 3.6, 4, 0.15), wall), 0, 1.8, 0, h);
    const rf = at(mesh(new THREE.ConeGeometry(w * 0.78, 2.2, 4), roof), 0, 4.7, 0, h); rf.rotation.y = Math.PI / 4; rf.scale.z = 0.85;
    at(mesh(rbox(1.0, 1.8, 0.1, 0.06), mine ? '#e2577a' : '#8a5a44'), 0, 0.9, 2.02, h);
    for (const s of [-1, 1]) at(mesh(rbox(0.9, 0.8, 0.1, 0.06), '#bfe6f5'), s * w * 0.3, 2.2, 2.02, h);
    return h;
  };
  const houses = []; for (let i = -3; i <= 3; i++) houses.push(house(i * 8, -8, palette[(i + 3) % palette.length], 5, i === 0));
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    const t = at(new THREE.Group(), i * 8 + 4 + (r() - 0.5), 0, -4.2 + r() * 0.6, g);
    at(mesh(cyl(0.18, 0.24, 1.6, 6), '#8a5a44'), 0, 0.8, 0, t);
    at(mesh(ball(1.1 + r() * 0.4, 1), '#6cc48a'), 0, 2.4, 0, t);
  }
  // front path from the sidewalk to your door
  for (let i = 0; i < 4; i++) at(mesh(rbox(1.2, 0.06, 0.9, 0.03, 1), '#e9e2d6'), 0, 0.03, -1.7 - i * 1.0, g);
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('door', 0, 0, -5.8); A('lawn', 3.2, 0, -3.0); A('walkStart', -10, 0, 0); A('walkEnd', 2, 0, 0); A('sky', 0, 9, 0);
  return { group: g, anchors, houses, mine: houses[3] };
}
