// Cartoon louse rig, ~1 unit tall, faces +z.
// buildLouse({ color, hat, sunglasses, suitcase, megaphone, seed })
//   -> { group, anchors: { head, hand, hatTop }, pose({ t, wave, walk, cheer, bob, look }) }
//   wave/walk/cheer are 0..1 weights; t drives the cycles. look = head yaw (rad).
import * as THREE from 'three';
import { mesh, ball, cyl, rbox, at } from './toy-kit.js';

export function buildLouse(o = {}) {
  const { color = '#c9b8a6', belly = '#e6d8c6', hat = false, sunglasses = false, suitcase = false, megaphone = false, seed = 0 } = o;
  const g = new THREE.Group(), body = new THREE.Group();
  g.add(body);
  const abdomen = at(mesh(ball(0.38), color), 0, 0.42, -0.18, body); abdomen.scale.set(1, 0.75, 1.2);
  at(mesh(ball(0.22), belly), 0, 0.36, -0.05, body).scale.set(1, 0.6, 1);
  const thorax = at(mesh(ball(0.24), color), 0, 0.5, 0.2, body);
  const head = at(new THREE.Group(), 0, 0.72, 0.34, body);
  at(mesh(ball(0.26), color), 0, 0, 0, head).scale.set(1, 0.9, 0.95);
  for (const s of [-1, 1]) {
    at(mesh(ball(0.1), '#ffffff'), s * 0.11, 0.06, 0.2, head);
    at(mesh(ball(0.05, 0), '#221a26'), s * 0.11, 0.06, 0.29, head);
    const ant = at(mesh(cyl(0.015, 0.025, 0.3, 4), '#8a7766'), s * 0.1, 0.28, 0.05, head); ant.rotation.z = -s * 0.4;
    at(mesh(ball(0.04, 0), '#8a7766'), 0, 0.16, 0, ant);
  }
  at(mesh(rbox(0.14, 0.04, 0.04, 0.02), '#6b4f57'), 0, -0.09, 0.24, head); // smile
  if (sunglasses) {
    for (const s of [-1, 1]) at(mesh(rbox(0.16, 0.1, 0.04, 0.03), '#1d1d2b'), s * 0.11, 0.07, 0.29, head);
    at(mesh(rbox(0.1, 0.02, 0.02, 0.01), '#1d1d2b'), 0, 0.09, 0.29, head);
  }
  const hatTop = at(new THREE.Group(), 0, 0.24, 0, head);
  if (hat) {
    at(mesh(cyl(0.2, 0.2, 0.03, 10), '#3b2f4a'), 0, 0, 0, hatTop);
    at(mesh(cyl(0.13, 0.14, 0.2, 10), '#3b2f4a'), 0, 0.1, 0, hatTop);
    at(mesh(cyl(0.142, 0.142, 0.04, 10), '#e2577a'), 0, 0.03, 0, hatTop);
  }
  // legs: 3 pairs; the front pair are arms (wave / carry)
  const legs = [];
  for (const [i, z] of [[0, 0.22], [1, 0.02], [2, -0.2]].map(([i, z]) => [i, z])) for (const s of [-1, 1]) {
    const hip = at(new THREE.Group(), s * 0.2, 0.42, z, body);
    const leg = at(mesh(cyl(0.035, 0.05, 0.4, 5), '#8a7766'), 0, -0.2, 0, hip);
    at(mesh(ball(0.06, 0), '#8a7766'), 0, -0.2, 0, leg);
    hip.rotation.z = s * 0.7; legs.push({ hip, s, i });
  }
  const arm = legs.find(l => l.i === 0 && l.s === 1).hip, armL = legs.find(l => l.i === 0 && l.s === -1).hip;
  const hand = at(new THREE.Group(), 0, -0.42, 0, arm);
  if (suitcase) { const c = at(mesh(rbox(0.24, 0.18, 0.08, 0.03), '#e2577a'), 0, -0.12, 0, hand); c.rotation.z = 0.7; }
  if (megaphone) { const m = at(mesh(cyl(0.12, 0.04, 0.26, 8, true), '#ffd166'), 0, -0.05, 0.1, hand); m.rotation.x = Math.PI / 2; }

  const ph = seed * 1.7;
  function pose({ t = 0, wave = 0, walk = 0, cheer = 0, bob = 0, look = 0 } = {}) {
    const c = t * 9 + ph;
    for (const l of legs) {
      const stride = Math.sin(c + l.i * 2.1 + (l.s > 0 ? Math.PI : 0)) * 0.45 * walk;
      l.hip.rotation.set(stride, 0, l.s * 0.7);
    }
    const up = Math.max(wave, cheer, megaphone ? 1 : 0, suitcase ? 0.35 : 0);
    // right arm up for wave/cheer/megaphone, waggles while waving
    arm.rotation.z = THREE.MathUtils.lerp(0.7, 2.7 - (megaphone ? 0.9 : 0), up) + Math.sin(t * 14 + ph) * 0.35 * wave;
    arm.rotation.x = suitcase ? 0 : -0.4 * up;
    armL.rotation.z = THREE.MathUtils.lerp(-0.7, -2.7, cheer) - Math.sin(t * 12 + ph) * 0.3 * cheer;
    body.position.y = Math.abs(Math.sin(c)) * 0.06 * walk + Math.abs(Math.sin(t * 10 + ph)) * 0.18 * cheer + Math.sin(t * 2 + ph) * 0.05 * bob;
    body.rotation.z = Math.sin(c) * 0.06 * walk;
    head.rotation.y = look;
    head.rotation.z = Math.sin(t * 6 + ph) * 0.12 * (wave + cheer);
  }
  pose();
  return { group: g, anchors: { head, hand, hatTop }, pose };
}
