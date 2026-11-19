// Toy continental-USA map on a table top: a low-poly outline extruded as a slab, pastel "state" tiles on top,
// a few landmark stars. Map spans x -10..10, z -6..6 (north = -z). buildUsaMap() -> { group, anchors: { west, florida } }
import * as THREE from 'three';
import { mesh, mat, rbox, at, rng, textCard } from './toy-kit.js';

const OUTLINE = [[-9.6,-5.2],[-6,-5.4],[-1,-5.3],[2.5,-4.6],[4.2,-3.6],[5.5,-4.6],[7.6,-5.4],[9.4,-4.4],[8.8,-3.0],[7.2,-2.2],[7.4,-0.8],
  [6.6,0.6],[6.4,1.9],[5.4,2.6],[6.1,4.6],[5.6,5.8],[4.9,5.3],[4.3,3.4],[2.6,3.0],[0.6,3.4],[-1.4,4.7],[-2.6,5.6],[-3.4,4.2],
  [-4.9,2.9],[-7.4,2.1],[-8.8,0.6],[-9.4,-1.4],[-10,-3.6]];

export function buildUsaMap(o = {}) {
  const { seed = 61 } = o;
  const r = rng(seed), g = new THREE.Group();
  at(mesh(rbox(26, 0.6, 17, 0.2), '#8ecae6'), 0, -0.35, 0, g);
  const shape = new THREE.Shape(OUTLINE.map(([x, z]) => new THREE.Vector2(x, -z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
  at(mesh(geo, '#cfe9b4'), 0, 0, 0, g);
  const cols = ['#f7c8a0', '#bfe0f0', '#fbe3a0', '#d9c8f0', '#c8ecd8', '#f4b3c2'];
  const inside = (x, z) => { let c = false; for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, zi] = OUTLINE[i], [xj, zj] = OUTLINE[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
  for (let x = -9.5; x < 9.5; x += 1.6) for (let z = -5.2; z < 5.8; z += 1.4)
    if (inside(x + 0.8, z + 0.7) && inside(x, z) && inside(x + 1.5, z + 1.3)) at(mesh(rbox(1.5, 0.12, 1.3, 0.05, 1), cols[Math.floor(r() * cols.length)]), x + 0.75, 0.55, z + 0.65, g);
  at(mesh(rbox(1.2, 0.14, 2.3, 0.1, 1), '#f4a3b5'), 5.7, 0.57, 4.5, g);
  const lbl = at(textCard('FLORIDA', 2.6, { w: 1024, h: 260, bg: '#fffaf0', color: '#e2577a', size: 170, radius: 40 }), 5.6, 1.5, 4.6, g); lbl.rotation.x = -0.9;
  const anchors = { west: at(new THREE.Object3D(), -8.6, 0.6, -1.2, g), florida: at(new THREE.Object3D(), 5.7, 0.6, 4.6, g) };
  return { group: g, anchors, floridaLabel: lbl };
}
