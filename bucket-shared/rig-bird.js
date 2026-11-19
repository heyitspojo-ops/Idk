// Smug cartoon pigeon, ~1 unit long, faces +z, feet at y = 0.
// buildBird({ body, wing, band, seed })
//   -> { group, anchors: { head, beak, butt }, pose({ t, flap, glide, smug, bloat, shake, peck, shrug, look, tilt }) }
//   flap 0..1 wing beat · glide: wings held out · smug: half-lidded eyes · bloat 0..1 swells up (holding it)
//   shake 0..1 jitter · peck 0..1 head dips forward (eating) · shrug 0..1 wings lift, "don't give a fuck"
import * as THREE from 'three';
import { mesh, ball, cyl, rbox, at } from './toy-kit.js';

export function buildBird(o = {}) {
  const { body = '#a9a3c4', wing = '#8d86ad', band = '#5fc39a', belly = '#c9c3dd', seed = 0 } = o;
  const g = new THREE.Group(), core = at(new THREE.Group(), 0, 0.42, 0, g);
  const torso = at(mesh(ball(0.34, 1), body), 0, 0, 0, core); torso.scale.set(1, 0.95, 1.3);
  const tummy = at(mesh(ball(0.26, 1), belly), 0, -0.06, 0.12, core); tummy.scale.set(1, 0.9, 1.1);
  const neck = at(new THREE.Group(), 0, 0.22, 0.28, core);
  at(mesh(cyl(0.17, 0.2, 0.16, 8), band), 0, 0, 0, neck);
  const head = at(new THREE.Group(), 0, 0.17, 0.04, neck);
  at(mesh(ball(0.2, 1), body), 0, 0, 0, head);
  const beak = at(mesh(new THREE.ConeGeometry(0.06, 0.18, 5), '#f2a33a'), 0, -0.02, 0.24, head); beak.rotation.x = Math.PI / 2;
  const lids = [];
  for (const s of [-1, 1]) {
    at(mesh(ball(0.075, 1), '#ffffff'), s * 0.11, 0.05, 0.14, head);
    at(mesh(ball(0.04, 0), '#221a26'), s * 0.115, 0.05, 0.2, head);
    const lid = at(mesh(new THREE.SphereGeometry(0.082, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), body), s * 0.11, 0.05, 0.14, head);
    lid.rotation.x = 0.4; lids.push(lid);
  }
  const wings = [-1, 1].map(s => {
    const p = at(new THREE.Group(), s * 0.3, 0.08, 0.02, core);
    const w = at(mesh(rbox(0.5, 0.06, 0.42, 0.03), wing), s * 0.22, 0, -0.06, p); w.rotation.y = s * 0.2;
    return { p, s };
  });
  const tail = at(mesh(rbox(0.3, 0.05, 0.34, 0.02), wing), 0, 0.02, -0.5, core); tail.rotation.x = -0.3;
  const butt = at(new THREE.Object3D(), 0, -0.12, -0.42, core);
  for (const s of [-1, 1]) at(mesh(cyl(0.025, 0.03, 0.26, 4), '#f2a33a'), s * 0.1, -0.31, 0.05, core);
  const ph = seed * 1.3;

  function pose({ t = 0, flap = 0, glide = 0, smug = 0, bloat = 0, shake = 0, peck = 0, shrug = 0, look = 0, tilt = 0 } = {}) {
    const beat = Math.sin(t * 22 + ph);
    for (const w of wings) w.p.rotation.z = w.s * (-0.15 + flap * beat * 0.9 - glide * 0.1 - shrug * 0.9);
    const b = 1 + bloat * 1.1, jit = shake * 0.04;
    core.scale.set(b, b * (1 + bloat * 0.1), b);
    core.position.set(Math.sin(t * 70) * jit, 0.42 + bloat * 0.35 + Math.abs(beat) * 0.04 * flap, Math.cos(t * 60) * jit);
    neck.rotation.x = peck * (0.6 + Math.abs(Math.sin(t * 14)) * 0.5);
    head.rotation.set(-bloat * 0.2, look, tilt + shrug * 0.15);
    head.scale.setScalar(1 + bloat * 0.25);
    lids.forEach(l => (l.rotation.x = 0.4 + smug * 0.9 + bloat * 0.4));
    tail.rotation.x = -0.3 - bloat * 0.4;
  }
  pose();
  return { group: g, anchors: { head, beak, butt }, pose };
}
