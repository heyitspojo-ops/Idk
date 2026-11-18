// Peg-doll toy person, ~3 units tall, faces +z.
// buildToyPerson({ skin, shirt, pants, hair, seed })
//   -> { group, anchors: { head, headTop, handL, handR }, foam, pose({...}) }
// pose({ t, scratch, sit, slump, point, lather, look, tilt, mood }):
//   scratch/sit/slump/point/lather are 0..1 weights; scratch speed rises with `scratchRate` (Hz).
//   mood: -1 miserable .. 0 neutral .. 1 delighted (brows + mouth).
import * as THREE from 'three';
import { mesh, ball, cyl, rbox, at, rng, mat } from './toy-kit.js';

export function buildToyPerson(o = {}) {
  const { skin = '#f2c6a0', shirt = '#5fa8d3', pants = '#3d4f7a', hair = '#6b4226', seed = 3 } = o;
  const r = rng(seed);
  const g = new THREE.Group(), hips = at(new THREE.Group(), 0, 0.85, 0, g), torso = at(new THREE.Group(), 0, 0, 0, hips);
  const legs = [-1, 1].map(s => {
    const hip = at(new THREE.Group(), s * 0.2, 0, 0, hips);
    at(mesh(cyl(0.17, 0.15, 0.8, 7), pants), 0, -0.4, 0, hip);
    at(mesh(rbox(0.28, 0.14, 0.42, 0.06), '#2b2233'), 0, -0.8, 0.07, hip);
    return hip;
  });
  at(mesh(cyl(0.42, 0.48, 1.0, 8), shirt), 0, 0.5, 0, torso);
  at(mesh(cyl(0.44, 0.44, 0.12, 8), pants), 0, 0.02, 0, torso);
  const neck = at(new THREE.Group(), 0, 1.05, 0, torso);
  const head = at(new THREE.Group(), 0, 0.55, 0, neck);
  at(mesh(ball(0.62, 1), skin), 0, 0, 0, head);
  at(mesh(cyl(0.16, 0.2, 0.2, 6), skin), 0, -0.55, 0, head);
  for (const s of [-1, 1]) at(mesh(ball(0.13, 0), skin), s * 0.6, -0.02, 0, head);
  // hair: cap + tufts
  const hairG = at(new THREE.Group(), 0, 0, 0, head);
  const cap = at(mesh(new THREE.SphereGeometry(0.66, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.42), hair), 0, 0.02, -0.04, hairG);
  cap.rotation.x = -0.25;
  const tufts = [];
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, el = 0.25 + r() * 0.55;
    const tf = at(mesh(new THREE.ConeGeometry(0.16, 0.42, 5), hair), Math.cos(a) * Math.sin(el) * 0.6, Math.cos(el) * 0.6 + 0.12, Math.sin(a) * Math.sin(el) * 0.6 - 0.05, hairG);
    tf.lookAt(tf.position.clone().multiplyScalar(3)); tf.rotateX(Math.PI / 2); tufts.push(tf);
  }
  // face
  const eyes = [-1, 1].map(s => at(mesh(ball(0.075, 0), '#221a26'), s * 0.21, 0.02, 0.58, head));
  const brows = [-1, 1].map(s => at(mesh(rbox(0.22, 0.05, 0.05, 0.02), hair), s * 0.21, 0.19, 0.58, head));
  const mouth = at(mesh(ball(0.1, 1), '#8c3b4a'), 0, -0.24, 0.57, head);
  for (const s of [-1, 1]) at(mesh(ball(0.08, 0), '#f29a9a'), s * 0.36, -0.12, 0.5, head).scale.set(1, 0.6, 0.4);
  // foam (hidden unless lather > 0)
  const foam = at(new THREE.Group(), 0, 0.35, 0, head);
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2, d = r() * 0.55;
    at(mesh(ball(0.16 + r() * 0.16, 1), mat('#ffffff', { roughness: 0.4 })), Math.cos(a) * d, r() * 0.35, Math.sin(a) * d * 0.9, foam);
  }
  // arms: shoulder pivots; arm hangs along -y
  const arms = [-1, 1].map(s => {
    const sh = at(new THREE.Group(), s * 0.48, 0.92, 0, torso);
    at(mesh(cyl(0.11, 0.12, 0.78, 6), shirt), 0, -0.36, 0, sh);
    const hand = at(mesh(ball(0.14, 1), skin), 0, -0.8, 0, sh);
    return { sh, hand, s };
  });

  function pose({ t = 0, scratch = 0, scratchRate = 4, sit = 0, slump = 0, point = 0, lather = 0, look = 0, tilt = 0, mood = 0 } = {}) {
    hips.position.y = 0.85 - sit * 0.18;
    legs.forEach(l => (l.rotation.x = -sit * 1.45));
    torso.rotation.x = slump * 0.35;
    neck.rotation.x = slump * 0.45;
    head.rotation.set(0, look, tilt);
    const rub = Math.max(scratch, lather);
    for (const a of arms) {
      const wig = Math.sin(t * Math.PI * 2 * scratchRate + (a.s > 0 ? 0 : 1.7));
      // rest -> hands on head (scratch) ; point: right arm out to the side
      const up = rub * (2.75 + wig * 0.18 * rub);
      a.sh.rotation.set(-rub * 0.25 + wig * 0.35 * scratch - slump * 0.3, 0, a.s * (0.12 + up) * (a.s > 0 && point ? 1 - point : 1));
      if (a.s > 0 && point) a.sh.rotation.z += point * 1.5, a.sh.rotation.x -= point * 0.4;
    }
    tufts.forEach((tf, i) => (tf.rotation.z = Math.sin(t * 25 + i) * 0.25 * scratch));
    head.position.x = Math.sin(t * 2 * Math.PI * scratchRate) * 0.04 * scratch;
    foam.visible = lather > 0.01; foam.scale.setScalar(Math.max(0.001, lather));
    brows.forEach((b, i) => { b.rotation.z = (i ? -1 : 1) * Math.max(0, -mood) * 0.35; b.position.y = 0.19 + mood * 0.03 + Math.max(0, -mood) * 0.02; });
    mouth.scale.set(mood >= 0 ? 1 + mood * 0.9 : 1 + -mood * 0.3, mood >= 0 ? 0.35 + mood * 0.2 : 0.25, 0.4);
    mouth.position.y = -0.24 - mood * 0.02;
    eyes.forEach(e => (e.scale.y = mood < -0.5 ? 0.5 : 1));
  }
  pose();
  return { group: g, anchors: { head, headTop: hairG, handL: arms[0].hand, handR: arms[1].hand }, foam, pose };
}
