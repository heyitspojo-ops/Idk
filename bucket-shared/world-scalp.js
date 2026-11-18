// Giant-scale scalp: a hair forest on skin, with clearings for action and dandruff flakes.
// buildScalp({ size, strands, seed, hair, skin, clearings:[{x,z,r}] })
//   -> { group, anchors: { [clearing.name]: Object3D }, strands: InstancedMesh, sway(t) }
// Units: a louse is ~1 tall; strands are 7–11 tall.
import * as THREE from 'three';
import { mesh, mat, ball, rng } from './toy-kit.js';

export function buildScalp(o = {}) {
  const { size = 60, strands = 420, seed = 7, hair = '#6b4226', skin = '#f2c6a0', flakes = 70,
    clearings = [{ name: 'center', x: 0, z: 0, r: 3 }] } = o;
  const r = rng(seed), g = new THREE.Group();
  const groundGeo = new THREE.PlaneGeometry(size, size, 40, 40);
  const p = groundGeo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.35) * Math.cos(p.getY(i) * 0.3) * 0.25 + (r() - 0.5) * 0.12);
  groundGeo.computeVertexNormals();
  const ground = mesh(groundGeo, skin); ground.rotation.x = -Math.PI / 2; g.add(ground);

  const free = (x, z, pad = 0) => clearings.every(c => Math.hypot(x - c.x, z - c.z) > c.r + pad);
  const geo = new THREE.CylinderGeometry(0.1, 0.3, 1, 5, 3); geo.translate(0, 0.5, 0);
  const inst = new THREE.InstancedMesh(geo, mat('#ffffff'), strands);
  inst.castShadow = inst.receiveShadow = true;
  const base = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  let n = 0;
  for (let tries = 0; n < strands && tries < strands * 20; tries++) {
    const x = (r() - 0.5) * size * 0.95, z = (r() - 0.5) * size * 0.95;
    if (!free(x, z, 0.4)) continue;
    base.push({ x, z, h: 7 + r() * 4, s: 0.8 + r() * 0.5, tx: (r() - 0.5) * 0.3, tz: (r() - 0.5) * 0.3, ph: r() * 6 });
    n++;
  }
  inst.count = n;
  const col = new THREE.Color();
  base.forEach((b, i) => inst.setColorAt(i, col.set(hair).offsetHSL(0, 0, (r() - 0.5) * 0.08)));
  function sway(t, amount = 1) {
    base.forEach((b, i) => {
      e.set(b.tx + Math.sin(t * 1.3 + b.ph) * 0.03 * amount, 0, b.tz + Math.cos(t * 1.1 + b.ph) * 0.03 * amount);
      m4.compose(new THREE.Vector3(b.x, -0.2, b.z), q.setFromEuler(e), new THREE.Vector3(b.s, b.h, b.s));
      inst.setMatrixAt(i, m4);
    });
    inst.instanceMatrix.needsUpdate = true;
  }
  sway(0); g.add(inst);

  for (let i = 0; i < flakes; i++) {
    const x = (r() - 0.5) * size * 0.9, z = (r() - 0.5) * size * 0.9;
    if (!free(x, z, -1)) continue;
    const f = mesh(ball(0.25 + r() * 0.25, 0), '#fbf7ee'); f.scale.set(1, 0.25, 1); f.position.set(x, 0.05, z); f.rotation.y = r() * 6; g.add(f);
  }
  const anchors = {};
  for (const c of clearings) { const a = new THREE.Object3D(); a.position.set(c.x, 0, c.z); g.add(a); anchors[c.name] = a; }
  return { group: g, anchors, strands: inst, sway };
}
