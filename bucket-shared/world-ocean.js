// Low-poly ocean: faceted waves (summed sines, flat-shaded), semi-transparent so things below the
// surface (e.g. reflections) show through. buildOcean({ size, seg, color, deep, opacity })
//   -> { group, water, height(x, z, t), update(t) }   water surface around y = 0
import * as THREE from 'three';
import { mat } from './toy-kit.js';

export function buildOcean(o = {}) {
  const { size = 120, seg = 70, color = '#45c4d8', deep = '#1f6fa8', opacity = 0.72, amp = 0.35 } = o;
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(size, size, seg, seg).toNonIndexed(); geo.rotateX(-Math.PI / 2);
  const base = geo.attributes.position.array.slice();
  const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.35, metalness: 0.05, transparent: true, opacity }));
  water.receiveShadow = true; g.add(water);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat(deep)); floor.rotation.x = -Math.PI / 2; floor.position.y = -6; g.add(floor);
  const height = (x, z, t) => amp * (Math.sin(x * 0.35 + t * 1.3) + 0.6 * Math.sin(z * 0.5 - t * 1.1) + 0.35 * Math.sin((x + z) * 0.9 + t * 2.1));
  function update(t) {
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) p[i + 1] = height(base[i], base[i + 2], t);
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  }
  update(0);
  return { group: g, water, height, update };
}
