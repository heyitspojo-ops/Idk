// Chunky toy tabby cat, sitting, ~1.5 units tall, faces +z, base at y = 0.
// buildCat({ fur, stripe, eye, seed })
//   -> { group, anchors: { head, pawR, mouth }, pose({ t, unimpressed, pissed, blink, look, tilt, tail, paw, sigh, bob }) }
//   unimpressed 0..1 flat half-lids · pissed 0..1 ears back + narrowed eyes + puffed tail · blink 0..1 closes the eyes
//   look head yaw (rad) · tail 0..1 flick amount · paw 0..1 right paw reaches forward · sigh 0..1 chest heave · bob 0..1 trot bounce
import * as THREE from 'three';
import { mesh, mat, ball, cyl, rbox, at } from './toy-kit.js';

export function buildCat(o = {}) {
  const { fur = '#9aa0ad', stripe = '#6b7080', belly = '#e8e4dc', eye = '#c8e05a', seed = 0 } = o;
  const g = new THREE.Group(), body = at(new THREE.Group(), 0, 0, 0, g);
  const torso = at(mesh(ball(0.55, 2), fur), 0, 0.55, -0.05, body); torso.scale.set(1, 1.05, 1.1);
  at(mesh(ball(0.35, 2), belly), 0, 0.5, 0.3, body).scale.set(1, 1.2, 0.6);
  for (let i = 0; i < 3; i++) at(mesh(rbox(0.9, 0.08, 0.5, 0.04), stripe), 0, 0.75 - i * 0.22, -0.32, body).rotation.x = 0.3;
  for (const s of [-1, 1]) at(mesh(ball(0.2, 1), fur), s * 0.38, 0.18, 0.12, body).scale.set(1, 0.7, 1.4);
  const paws = [-1, 1].map(s => { const p = at(new THREE.Group(), s * 0.18, 0.12, 0.42, body); at(mesh(ball(0.12, 1), belly), 0, 0, 0, p).scale.set(1, 0.7, 1.3); return p; });
  const head = at(new THREE.Group(), 0, 1.2, 0.12, body);
  at(mesh(ball(0.46, 2), fur), 0, 0, 0, head).scale.set(1.12, 0.95, 1);
  at(mesh(ball(0.2, 1), belly), 0, -0.14, 0.33, head).scale.set(1.3, 0.8, 0.7);
  for (let i = 0; i < 3; i++) at(mesh(rbox(0.06, 0.24, 0.05, 0.02, 1), stripe), (i - 1) * 0.12, 0.3, 0.32, head).rotation.x = -0.5;
  const ears = [-1, 1].map(s => { const e = at(new THREE.Group(), s * 0.3, 0.35, 0, head);
    at(mesh(new THREE.ConeGeometry(0.15, 0.32, 4), fur), 0, 0.12, 0, e); at(mesh(new THREE.ConeGeometry(0.08, 0.2, 4), '#f4a3b5'), 0, 0.1, 0.04, e); return e; });
  const eyes = [], lids = [], brows = [];
  for (const s of [-1, 1]) {
    const e = at(new THREE.Group(), s * 0.19, 0.06, 0.38, head);
    at(mesh(ball(0.11, 1), eye), 0, 0, 0, e).scale.set(1, 1, 0.5);
    at(mesh(rbox(0.035, 0.15, 0.03, 0.01, 1), '#221a26'), 0, 0, 0.05, e);
    const lid = at(mesh(rbox(0.26, 0.13, 0.08, 0.04), fur), 0, 0.12, 0.03, e);
    const lo = at(mesh(rbox(0.26, 0.13, 0.08, 0.04), fur), 0, -0.14, 0.03, e);
    eyes.push(e); lids.push([lid, lo]);
    brows.push(at(mesh(rbox(0.18, 0.04, 0.04, 0.02), stripe), s * 0.19, 0.21, 0.4, head));
  }
  at(mesh(ball(0.05, 0), '#e2577a'), 0, -0.06, 0.45, head);
  const mouth = at(mesh(rbox(0.12, 0.025, 0.03, 0.01, 1), '#3b2f4a'), 0, -0.17, 0.43, head);
  for (const s of [-1, 1]) for (const k of [-1, 1]) { const w = at(mesh(rbox(0.32, 0.012, 0.012, 0.005, 1), '#fffaf0'), s * 0.32, -0.1 + k * 0.04, 0.38, head); w.rotation.z = s * k * 0.12; }
  const tail = [], tailRoot = at(new THREE.Group(), 0, 0.25, -0.6, body);
  let parent = tailRoot;
  for (let i = 0; i < 5; i++) { const seg = at(new THREE.Group(), 0, i ? 0.2 : 0, 0, parent);
    at(mesh(cyl(0.07, 0.08, 0.22, 6), i % 2 ? stripe : fur), 0, 0.1, 0, seg); tail.push(seg); parent = seg; }
  const ph = seed * 2.1;

  function pose({ t = 0, unimpressed = 0, pissed = 0, blink = 0, look = 0, tilt = 0, tail: flick = 0.3, paw = 0, sigh = 0, bob = 0 } = {}) {
    head.rotation.set(-0.05 + pissed * 0.08, look, tilt);
    ears.forEach((e, i) => (e.rotation.z = (i ? -1 : 1) * pissed * 0.9));
    ears.forEach(e => (e.rotation.x = -pissed * 0.5));
    const close = Math.max(blink, unimpressed * 0.5, pissed * 0.45);
    lids.forEach(([up, lo]) => { up.position.y = 0.12 - close * 0.1; lo.position.y = -0.14 + Math.max(blink, pissed * 0.35) * 0.08; });
    brows.forEach((b, i) => { b.rotation.z = (i ? 1 : -1) * pissed * 0.45; b.position.y = 0.21 - pissed * 0.05 - unimpressed * 0.03; });
    mouth.scale.x = 1 - pissed * 0.4;
    tail.forEach((s, i) => (s.rotation.x = -0.5 + Math.sin(t * 3 + ph - i * 0.6) * 0.35 * flick - i * 0.08));
    tail.forEach(s => s.scale.set(1 + pissed * 0.8, 1, 1 + pissed * 0.8));
    paws[1].position.set(0.18, 0.12 + paw * 0.25, 0.42 + paw * 0.45);
    body.position.y = Math.abs(Math.sin(t * 9)) * 0.08 * bob;
    torso.scale.set(1 + sigh * 0.08, 1.05 + sigh * 0.06, 1.1);
  }
  pose();
  return { group: g, anchors: { head, pawR: paws[1], mouth }, pose };
}
