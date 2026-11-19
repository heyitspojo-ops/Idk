// Cartoon cosmos: low-poly Earth with land + cloud puffs and a tiny house on top, a moon, a sun and a spiral
// galaxy, on a starfield. buildCosmos({ seed, R }) -> { group, planet, moon, sun, galaxy, anchors: { top, sunPos, core } }
// Planet centre at origin, radius R; sun at +x; galaxy core far behind (-z).
import * as THREE from 'three';
import { mesh, mat, ball, rbox, at, rng } from './toy-kit.js';
import { flakeHouse } from './props.js';

export function buildCosmos(o = {}) {
  const { seed = 41, R = 6 } = o;
  const r = rng(seed), g = new THREE.Group();
  // planet with land faces
  const geo = new THREE.IcosahedronGeometry(R, 3).toNonIndexed(), cols = [], c = new THREE.Color(), p = geo.attributes.position;
  const land = new THREE.Vector3(0.6, 0.8, 0.3).normalize(), land2 = new THREE.Vector3(-0.7, -0.2, 0.6).normalize();
  for (let i = 0; i < p.count; i += 3) {
    const n = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)).normalize();
    const isLand = n.dot(land) > 0.55 + r() * 0.15 || n.dot(land2) > 0.6 + r() * 0.15 || n.y > 0.92;
    c.set(isLand ? (r() > 0.5 ? '#7cc68a' : '#6ab07a') : (r() > 0.5 ? '#4aa3d8' : '#3d93c9'));
    for (let k = 0; k < 3; k++) cols.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const planet = at(new THREE.Group(), 0, 0, 0, g);
  const earth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.8 }));
  earth.castShadow = earth.receiveShadow = true; planet.add(earth);
  for (let i = 0; i < 14; i++) { const d = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    const cl = at(mesh(ball(0.6 + r() * 0.5, 1), mat('#ffffff', { transparent: true, opacity: 0.9 })), 0, 0, 0, planet);
    cl.position.copy(d.multiplyScalar(R + 0.5)); cl.scale.set(1.6, 0.6, 1); cl.lookAt(0, 0, 0); }
  const house = at(flakeHouse({ roof: '#ef7b6c' }), 0, R - 0.1, 0, planet); house.scale.setScalar(0.8);
  // moon
  const moon = at(mesh(ball(1.3, 1), '#d9d4cb'), 0, 0, 0, g);
  for (let i = 0; i < 4; i++) at(mesh(ball(0.25, 0), '#b9b6ad'), (r() - 0.5) * 1.6, (r() - 0.5) * 1.6, 1.0, moon).scale.set(1, 1, 0.3);
  // sun
  const sun = at(new THREE.Group(), 40, 4, -10, g);
  at(new THREE.Mesh(ball(8, 2), mat('#ffd166', { emissive: '#ffb703', emissiveIntensity: 1.4 })), 0, 0, 0, sun);
  for (let i = 0; i < 16; i++) { const ray = at(new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.5, 4), mat('#ffe27a', { emissive: '#ffd166', emissiveIntensity: 1.2 })), 0, 0, 0, sun);
    const a = (i / 16) * Math.PI * 2; ray.position.set(Math.cos(a) * 10, Math.sin(a) * 10, 0); ray.rotation.z = a - Math.PI / 2; }
  // spiral galaxy (instanced stars)
  const galaxy = at(new THREE.Group(), 20, 10, -260, g), n = 1400;
  const star = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.9, 0), mat('#ffffff', { emissive: '#ffffff', emissiveIntensity: 1.5 }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  for (let i = 0; i < n; i++) { const arm = i % 3, d = Math.pow(r(), 0.7) * 110, a = arm * (Math.PI * 2 / 3) + d * 0.045 + (r() - 0.5) * 0.5;
    const s = 0.4 + r() * 1.4; sc.set(s, s, s);
    m4.compose(new THREE.Vector3(Math.cos(a) * d, (r() - 0.5) * 6 * (1 - d / 120), Math.sin(a) * d), q, sc); star.setMatrixAt(i, m4);
    star.setColorAt(i, c.set(['#ffffff', '#ffe9a8', '#c8d8ff', '#ffc1d6'][i % 4])); }
  galaxy.add(star); galaxy.rotation.x = 1.1;
  at(new THREE.Mesh(ball(9, 2), mat('#fff3c4', { emissive: '#ffe9a8', emissiveIntensity: 2 })), 0, 0, 0, galaxy).scale.set(1, 0.4, 1);
  // starfield
  const sp = []; for (let i = 0; i < 900; i++) { const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(500); sp.push(v.x, v.y, v.z); }
  const sf = new THREE.BufferGeometry(); sf.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  g.add(new THREE.Points(sf, new THREE.PointsMaterial({ color: '#ffffff', size: 2.2, sizeAttenuation: false })));
  const anchors = { top: at(new THREE.Object3D(), 0, R, 0, planet), sunPos: sun, core: galaxy };
  return { group: g, planet, moon, sun, galaxy, house, anchors };
}
