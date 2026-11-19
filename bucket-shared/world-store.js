// Toy supermarket aisle running along z: tiled floor, two long shelf runs full of colourful product boxes,
// a hanging "AISLE 5" sign, a back wall. buildStore({ seed, length, width })
//   -> { group, anchors: { start, prunes, end, tp }, shelfX }   floor at y = 0; aisle centre x = 0
import * as THREE from 'three';
import { mesh, mat, rbox, at, rng, textCard } from './toy-kit.js';

export function buildStore(o = {}) {
  const { seed = 31, length = 36, width = 5.6 } = o;
  const r = rng(seed), g = new THREE.Group(), z0 = 14, z1 = z0 - length;
  for (let i = 0; i < 6; i++) for (let j = 0; j < length / 2; j++)
    at(mesh(rbox(1.98, 0.1, 1.98, 0.03, 1), (i + j) % 2 ? '#e9f4ee' : '#cfe9dc'), -5 + i * 2, -0.05, z0 - 1 - j * 2, g);
  const shelfX = width / 2 + 0.6, levels = [0.3, 1.25, 2.2, 3.15];
  const colors = ['#ef7b6c', '#ffd166', '#7cc6a4', '#5fa8d3', '#c3b1e1', '#f4a3b5', '#f4a340', '#fffaf0'];
  const box = new THREE.BoxGeometry(1, 1, 1);
  const n = 2 * levels.length * Math.floor(length / 0.55);
  const inst = new THREE.InstancedMesh(box, mat('#ffffff'), n); inst.castShadow = inst.receiveShadow = true;
  const m4 = new THREE.Matrix4(), col = new THREE.Color(); let k = 0;
  for (const s of [-1, 1]) {
    at(mesh(rbox(1.3, 4.1, length, 0.08), '#e8e2d6'), s * (shelfX + 0.35), 2.05, (z0 + z1) / 2, g);
    for (const y of levels) {
      at(mesh(rbox(1.0, 0.08, length, 0.02, 1), '#c9ced6'), s * (shelfX - 0.15), y - 0.04, (z0 + z1) / 2, g);
      for (let z = z0 - 0.4; z > z1 + 0.4 && k < n; z -= 0.55) {
        const h = 0.45 + r() * 0.4, w = 0.5 + r() * 0.15;
        m4.compose(new THREE.Vector3(s * (shelfX - 0.15), y + h / 2, z), new THREE.Quaternion(), new THREE.Vector3(0.6, h, w));
        inst.setMatrixAt(k, m4); inst.setColorAt(k, col.set(colors[Math.floor(r() * colors.length)])); k++;
      }
    }
  }
  inst.count = k; g.add(inst);
  at(mesh(rbox(width + 4, 6, 0.4, 0.1), '#f7e3c8'), 0, 3, z1 - 0.2, g);
  const sign = at(textCard('AISLE 5', 2.4, { w: 1024, h: 380, bg: '#5fa8d3', color: '#fffaf0', size: 210, radius: 50 }), 0, 5.6, z0 - 6, g);
  for (const s of [-1, 1]) at(mesh(rbox(0.03, 1.2, 0.03, 0.01, 1), '#9aa3ad'), s * 0.9, 6.6, z0 - 6, g);
  const back = at(textCard('AISLE 5', 2.4, { w: 1024, h: 380, bg: '#5fa8d3', color: '#fffaf0', size: 210, radius: 50 }), 0, 5.6, z0 - 6.02, g); back.rotation.y = Math.PI; // readable from both sides
  const anchors = {};
  const A = (nm, x, y, z) => { anchors[nm] = at(new THREE.Object3D(), x, y, z, g); };
  A('start', 0, 0, 9); A('prunes', -1.7, 0, 1.5); A('end', 0, 0, z1 + 3.5); A('tp', 0.4, 0, z1 + 1.6);
  return { group: g, anchors, shelfX, sign };
}
