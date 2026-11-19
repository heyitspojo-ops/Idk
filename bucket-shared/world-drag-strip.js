// Toy drag strip along +z: two lanes (x = -1.6 / +1.6), start line z = 0, finish z = 80, a start "tree",
// grandstand on the left, pit area at the start (x ~ 8). buildDragStrip() -> { group, anchors: { start, finish, pit }, tree }
// tree.set(stage) stage 0 off, 1 red, 2 yellow, 3 green.
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at, rng, textCard } from './toy-kit.js';

export function buildDragStrip(o = {}) {
  const { len = 90, seed = 51 } = o;
  const r = rng(seed), g = new THREE.Group();
  const grass = at(mesh(new THREE.PlaneGeometry(80, len + 60), '#a8dd8f'), 0, -0.03, len / 2, g); grass.rotation.x = -Math.PI / 2;
  at(mesh(rbox(7, 0.06, len + 20, 0.02, 1), '#6b6f7d'), 0, 0, len / 2, g);
  for (const x of [-3.4, 0, 3.4]) at(mesh(rbox(0.12, 0.08, len + 20, 0.02, 1), '#fffaf0'), x, 0.01, len / 2, g);
  for (const z of [0, 80]) for (let i = 0; i < 14; i++) at(mesh(rbox(0.5, 0.08, 0.5, 0.02, 1), (i % 2) ^ (z ? 1 : 0) ? '#2b2233' : '#fffaf0'), -3.25 + i * 0.5, 0.02, z, g);
  // start tree
  const tree = at(new THREE.Group(), 0, 0, -1.2, g);
  at(mesh(cyl(0.1, 0.12, 3.4, 6), '#3b2f4a'), 0, 1.7, 0, tree);
  const lamps = ['#ef4444', '#ffd166', '#ffd166', '#4ade80'].map((c, i) => {
    const m = new THREE.MeshStandardMaterial({ color: '#3b3640', emissive: c, emissiveIntensity: 0, flatShading: true });
    for (const s of [-1, 1]) at(new THREE.Mesh(ball(0.2, 1), m), s * 0.32, 3.4 - i * 0.48, 0.05, tree);
    return m;
  });
  at(mesh(rbox(1.0, 2.2, 0.2, 0.06), '#2b2233'), 0, 2.7, -0.1, tree);
  tree.set = stage => lamps.forEach((m, i) => (m.emissiveIntensity = (stage === 1 && i === 0) || (stage === 2 && (i === 1 || i === 2)) || (stage === 3 && i === 3) ? 2.2 : 0));
  // grandstand with toy fans
  const stand = at(new THREE.Group(), -9, 0, 20, g);
  for (let i = 0; i < 4; i++) at(mesh(rbox(3, 0.6, 30, 0.05), '#c9ced6'), -i * 1.2, 0.3 + i * 0.6, 0, stand);
  const fanCols = ['#ef7b6c', '#ffd166', '#7cc6a4', '#5fa8d3', '#c3b1e1'];
  for (let i = 0; i < 70; i++) { const row = i % 4, z = -14 + Math.floor(i / 4) * 1.6 + r() * 0.4;
    at(mesh(ball(0.32, 1), fanCols[i % 5]), -row * 1.2 + 0.4, 1.0 + row * 0.6, z, stand); }
  at(textCard('DRAG STRIP', 6, { w: 1024, h: 240, bg: '#ef7b6c', color: '#fffaf0', size: 150, radius: 30 }), -8.5, 4.6, 20, g).rotation.y = Math.PI / 2;
  const fin = at(textCard('FINISH', 5, { w: 1024, h: 260, bg: '#2b2233', color: '#fffaf0', size: 170, radius: 30 }), 0, 5.2, 80, g);
  fin.rotation.y = Math.PI;
  for (const s of [-1, 1]) at(mesh(cyl(0.12, 0.12, 5.4, 6), '#3b2f4a'), s * 3.6, 2.7, 80, g);
  // pit area
  at(mesh(rbox(10, 0.06, 10, 0.02, 1), '#8c8f99'), 9, 0.01, 2, g);
  const anchors = {};
  const A = (n, x, y, z) => { anchors[n] = at(new THREE.Object3D(), x, y, z, g); };
  A('start', 0, 0, 0); A('finish', 0, 0, 80); A('pit', 9, 0, 2);
  return { group: g, anchors, tree };
}
