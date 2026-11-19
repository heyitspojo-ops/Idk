// Peg-doll toy person, ~3 units tall, faces +z.
// buildToyPerson({ skin, shirt, pants, hair, seed, mirrored, longHair })
//   mirrored: flips left/right (a reflection of the same person) · longHair: shoulder-length hair + bun.
//   -> { group, anchors: { head, headTop, handL, handR, hips }, foam, shades, pose({...}) }
// pose({ t, scratch, sit, slump, point, lather, look, tilt, mood,
//        wave, fold, kick, kickReach, double, swing, hold, laugh, smug, lean, shades }):
//   scratch/sit/slump/point/lather are 0..1 weights; scratch speed rises with `scratchRate` (Hz).
//   mood: -1 miserable .. 0 neutral .. 1 delighted (brows + mouth).
//   wave: right arm up, waving · fold: arms folded · kick: right leg kicks forward; kickReach stretches it (cartoon)
//   double: doubled over, hands at groin · swing: 0 = tool raised overhead .. 1 = struck forward (both hands)
//   hold: right arm straight forward (holding something out) · laugh: head back, mouth wide, shaking
//   smug: one brow up + side smirk · lean: lean back, relaxed · shades: sunglasses on (0/1)
//   walk 0..1: walk cycle at walkRate steps/s (legs + arm swing)
//   goo 0..1: covered in bird shit, from a splat on the head (0.1) to a full white shell (1)
import * as THREE from 'three';
import { mesh, ball, cyl, rbox, at, rng, mat } from './toy-kit.js';

export function buildToyPerson(o = {}) {
  const { skin = '#f2c6a0', shirt = '#5fa8d3', pants = '#3d4f7a', hair = '#6b4226', seed = 3, mirrored = false, longHair = false } = o;
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
  if (longHair) {
    const back = at(mesh(rbox(1.25, 1.1, 0.5, 0.22), hair), 0, -0.25, -0.3, hairG);
    for (const s of [-1, 1]) at(mesh(rbox(0.28, 0.95, 0.42, 0.12), hair), s * 0.58, -0.3, 0.05, hairG);
    at(mesh(ball(0.26, 1), hair), 0, 0.55, -0.35, hairG);
  }
  const shades = at(new THREE.Group(), 0, 0.03, 0.6, head);
  for (const s of [-1, 1]) at(mesh(rbox(0.3, 0.17, 0.05, 0.05), '#1d1d2b'), s * 0.2, 0, 0, shades);
  at(mesh(rbox(0.16, 0.04, 0.04, 0.02), '#1d1d2b'), 0, 0.04, 0, shades);
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

  // bird shit: blobs ordered from the top of the head downwards; pose({ goo }) reveals them in that order
  const gooM = mat('#f6f4ee', { roughness: 0.35 }), grey = mat('#b9b6ad', { roughness: 0.4 }), goos = [];
  const addGoo = (parent, x, y, z, r, drip = 0) => { const b = at(mesh(ball(r, 1), goos.length % 4 === 3 ? grey : gooM), x, y, z, parent);
    b.scale.set(1, 0.7, 1); if (drip) at(mesh(cyl(r * 0.25, r * 0.12, drip, 5), gooM), 0, -drip / 2 - r * 0.3, 0, b); goos.push(b); };
  addGoo(head, 0.05, 0.62, 0.05, 0.28, 0.35); addGoo(head, -0.3, 0.5, 0.2, 0.18, 0.3); addGoo(head, 0.32, 0.45, -0.1, 0.2, 0.4);
  addGoo(head, 0.15, 0.3, 0.5, 0.15, 0.25); addGoo(torso, -0.45, 0.95, 0.05, 0.22, 0.3); addGoo(torso, 0.45, 0.95, -0.05, 0.22, 0.4);
  for (let i = 0; i < 8; i++) addGoo(torso, Math.cos(i * 1.7) * 0.42, 0.85 - i * 0.1, Math.sin(i * 1.7) * 0.42, 0.24, i % 2 ? 0.3 : 0);
  addGoo(head, 0, 0, 0, 0.72); goos[goos.length - 1].scale.set(1, 1.05, 1);   // full head shell
  addGoo(torso, 0, 0.5, 0, 0.62); goos[goos.length - 1].scale.set(1, 1.0, 0.95); // full body shell
  for (const l of legs) { addGoo(l, 0, -0.4, 0, 0.28); goos[goos.length - 1].scale.set(0.85, 1.6, 0.85); }
  for (const a of arms) { addGoo(a.sh, 0, -0.4, 0, 0.22); goos[goos.length - 1].scale.set(0.8, 1.9, 0.8); }
  if (mirrored) g.scale.x = -1;
  function pose({ t = 0, scratch = 0, scratchRate = 4, sit = 0, slump = 0, point = 0, lather = 0, look = 0, tilt = 0, mood = 0,
    wave = 0, fold = 0, kick = 0, kickReach = 1, double = 0, swing = 0, swingUp = 0, hold = 0, laugh = 0, smug = 0, lean = 0, shades: sh = 0, goo = 0, walk = 0, walkRate = 2 } = {}) {
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
    // --- extra poses (layered on top) ---
    const [L, R] = arms, lerp = THREE.MathUtils.lerp;
    if (wave) { R.sh.rotation.z = lerp(R.sh.rotation.z, 2.7 + Math.sin(t * 12) * 0.35, wave); R.sh.rotation.x = lerp(R.sh.rotation.x, -0.2, wave); }
    if (fold) for (const a of arms) { a.sh.rotation.x = lerp(a.sh.rotation.x, -1.35, fold); a.sh.rotation.z = lerp(a.sh.rotation.z, -a.s * 0.75, fold); }
    if (hold) { R.sh.rotation.x = lerp(R.sh.rotation.x, -1.5, hold); R.sh.rotation.z = lerp(R.sh.rotation.z, 0.05, hold); }
    if (swing || swingUp) for (const a of arms) {  // both hands together on a handle
      const x = lerp(-3.0, -1.1, swing) * Math.max(swingUp, swing > 0 ? 1 : 0);
      a.sh.rotation.x = x; a.sh.rotation.z = -a.s * 0.28;
    }
    torso.rotation.x += double * 0.75 - lean * 0.35;
    neck.rotation.x += double * 0.2 - laugh * 0.35 + lean * 0.15;
    if (double) for (const a of arms) { a.sh.rotation.x = lerp(a.sh.rotation.x, -0.5, double); a.sh.rotation.z = lerp(a.sh.rotation.z, -a.s * 0.15, double); }
    legs[1].rotation.x = lerp(legs[1].rotation.x, -1.5, kick); legs[1].scale.y = 1 + (kickReach - 1) * kick;
    legs.forEach(l => (l.rotation.z = double * (l === legs[0] ? -0.15 : 0.15)));
    head.position.y = Math.sin(t * 30) * 0.03 * laugh;
    shades.visible = sh > 0.5;
    goos.forEach((b, i) => (b.visible = goo > (i + 0.5) / goos.length));
    if (walk) { const w = Math.sin(t * Math.PI * walkRate) * 0.6 * walk;
      legs[0].rotation.x += w; legs[1].rotation.x -= w; L.sh.rotation.x -= w * 0.8; R.sh.rotation.x += w * 0.8;
      hips.position.y += Math.abs(Math.sin(t * Math.PI * walkRate)) * 0.06 * walk; }
    if (smug) { brows[1].position.y += 0.08 * smug; brows[1].rotation.z = -0.25 * smug; brows[0].rotation.z = -0.15 * smug;
      mouth.position.x = 0.1 * smug; mouth.rotation.z = 0.35 * smug; mouth.scale.set(1.6, 0.3, 0.4); }
    if (laugh) { mouth.scale.set(1.5, 0.9 + Math.abs(Math.sin(t * 22)) * 0.4 * laugh, 0.5); eyes.forEach(e => (e.scale.y = 0.4)); }
  }
  pose();
  return { group: g, anchors: { head, headTop: hairG, handL: arms[0].hand, handR: arms[1].hand, hips }, foam, shades, pose };
}
