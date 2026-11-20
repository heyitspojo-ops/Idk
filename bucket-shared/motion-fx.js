// Snappy motion + camera helpers (CLAUDE.md: bouncy, sharp, never floaty; dynamic camera).
import * as THREE from 'three';

const clamp01 = x => Math.min(1, Math.max(0, x));
/** 0 before t0, then a fast rise with ~15 % overshoot that settles by dur. */
export const snap = (t, t0, dur = 0.4) => { if (t < t0) return 0; const x = (t - t0) / dur; return x >= 2.5 ? 1 : 1 - Math.exp(-6 * x) * Math.cos(7.5 * x); };
/** Decaying impact envelope: 1 at the event, gone after ~len s. Sum over several event times. */
export const punch = (t, times, len = 0.45) => [].concat(times).reduce((s, e) => (t >= e && t < e + len ? s + Math.exp(-7 * (t - e) / len * 1.4) : s), 0);
/** Handheld bounce offset (Vector3) — small, always on. */
export function handheld(t, amt = 1) {
  return new THREE.Vector3(Math.sin(t * 1.7) * 0.05 + Math.sin(t * 4.1) * 0.02, Math.sin(t * 2.3 + 1) * 0.04 + Math.sin(t * 5.3) * 0.015, Math.sin(t * 1.3 + 2) * 0.03).multiplyScalar(amt);
}
/**
 * Hop from a to b (Vector3s) over [t0, t0+dur]: anticipation crouch (first 18 %), fast arc of height h, squash on landing.
 * Returns { pos, squash } — squash = { y, xz } scale factors to apply to the jumper.
 */
export function hop(t, t0, dur, a, b, h = 1.2) {
  const x = (t - t0) / dur, pos = new THREE.Vector3();
  let sy = 1;
  if (x <= 0) return { pos: a.clone(), squash: { y: 1, xz: 1 } };
  if (x < 0.18) { pos.copy(a); sy = 1 - 0.25 * Math.sin((x / 0.18) * Math.PI / 2); }
  else if (x < 0.8) { const k = (x - 0.18) / 0.62, e = 1 - (1 - k) ** 2; pos.lerpVectors(a, b, e); pos.y += Math.sin(k * Math.PI) * h; sy = 1.15; }
  else { pos.copy(b); const k = (x - 0.8) / 0.2; sy = k >= 1 ? 1 : 1 - 0.3 * Math.exp(-4 * k) * Math.cos(9 * k); }
  if (x >= 1) { const k = (t - t0 - dur) / 0.4; sy = k > 1 ? 1 : 1 - 0.12 * Math.exp(-5 * k) * Math.cos(12 * k); }
  return { pos, squash: { y: sy, xz: 1 + (1 - sy) * 0.5 } };
}
/**
 * Dynamic camera: each shot snaps from its 'from' framing to its 'to' framing in ~0.4 s (overshoot), then holds with a
 * handheld bounce; a whip-pan offset swings the look target on the cut; punches add shake + a fov kick.
 * shot = { from, to, fov, cam: [{p,l},{p,l}] }; base = Vector3 world offset; hits = event times.
 */
export function dynamicCamera(camera, t, shot, base, hits = [], { whip = 1.6, kick = 7, shake = 0.18 } = {}) {
  const k = clamp01(snap(t, shot.from, 0.45)), [a, b] = shot.cam;
  const lp = (u, v) => new THREE.Vector3(u[0] + (v[0] - u[0]) * k, u[1] + (v[1] - u[1]) * k, u[2] + (v[2] - u[2]) * k);
  const pos = lp(a.p, b.p).add(base), look = lp(a.l, b.l).add(base);
  const w = Math.exp(-14 * Math.max(0, t - shot.from)), right = new THREE.Vector3().subVectors(look, pos).cross(new THREE.Vector3(0, 1, 0)).normalize();
  look.addScaledVector(right, whip * w * (Math.floor(shot.from) % 2 ? 1 : -1));
  const p = punch(t, hits);
  pos.add(handheld(t, 1 + p * 2)).add(new THREE.Vector3(Math.sin(t * 83), Math.cos(t * 71), Math.sin(t * 59)).multiplyScalar(shake * p));
  camera.position.copy(pos);
  camera.fov = shot.fov + (1 - Math.min(1, snap(t, shot.from, 0.35))) * 10 - kick * Math.min(1, p);
  camera.updateProjectionMatrix(); camera.lookAt(look);
  return look;
}
