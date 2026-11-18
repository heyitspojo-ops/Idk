// Shared look for soft low-poly toy dioramas: materials, renderer + tilt-shift, lights, easing, text textures.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';

export const FONT = 'Fredoka';
const FONT_URL = '/node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2';

/** Load the rounded display font (call once, before drawing text). */
export async function loadFont() {
  const f = new FontFace(FONT, `url(${FONT_URL})`, { weight: '700' });
  document.fonts.add(await f.load());
}

// ---------- randomness & easing ----------
export function rng(seed = 1) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const clamp01 = x => Math.min(1, Math.max(0, x));
/** 0..1 progress of t through [a,b] */
export const seg = (t, a, b) => clamp01((t - a) / (b - a));
export const smooth = x => x * x * (3 - 2 * x);
export const easeOut = x => 1 - (1 - x) ** 3;
export const easeIn = x => x ** 3;
/** Springy arrival: 0 before t0, overshoots ~25 %, settles to 1. */
export const pop = (t, t0, k = 7, w = 13) => (t < t0 ? 0 : 1 - Math.exp(-k * (t - t0)) * Math.cos(w * (t - t0)));
export const lerp = (a, b, x) => a + (b - a) * x;
export const lerpV = (a, b, x) => new THREE.Vector3(lerp(a[0], b[0], x), lerp(a[1], b[1], x), lerp(a[2], b[2], x));

// ---------- materials & meshes ----------
const mats = new Map();
/** Flat-shaded matte toy plastic (cached by colour + options). */
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, metalness: 0, ...opts }));
  return mats.get(key);
}
export function mesh(geo, color, opts) {
  const m = new THREE.Mesh(geo, typeof color === 'string' || typeof color === 'number' ? mat(color, opts) : color);
  m.castShadow = m.receiveShadow = true;
  return m;
}
export const rbox = (w, h, d, r = 0.1, seg = 2) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2));
export const ball = (r, detail = 1) => new THREE.IcosahedronGeometry(r, detail);
export const cyl = (rt, rb, h, s = 7) => new THREE.CylinderGeometry(rt, rb, h, s);
export function at(obj, x = 0, y = 0, z = 0, parent) { obj.position.set(x, y, z); if (parent) parent.add(obj); return obj; }

// ---------- text ----------
/** Canvas texture with centred lines of text. opts: w,h,bg,color,size,radius,stroke */
export function textTexture(lines, o = {}) {
  const { w = 1024, h = 512, bg = null, color = '#2b2233', size = 120, radius = 60, stroke = null, lineGap = 1.1 } = o;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, w, h, radius); g.fill(); }
  g.font = `700 ${size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const arr = [].concat(lines), y0 = h / 2 - ((arr.length - 1) * size * lineGap) / 2;
  arr.forEach((l, i) => {
    if (stroke) { g.lineWidth = size * 0.16; g.strokeStyle = stroke; g.lineJoin = 'round'; g.strokeText(l, w / 2, y0 + i * size * lineGap); }
    g.fillStyle = color; g.fillText(l, w / 2, y0 + i * size * lineGap);
  });
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}
/** Flat card (plane) showing text; width in world units, height follows the texture aspect. */
export function textCard(lines, width, o = {}) {
  const tex = textTexture(lines, o);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, width * (o.h ?? 512) / (o.w ?? 1024)),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
  return m;
}

/** DOM overlay layer (screen text). Returns {el, add(html, css)}. Coordinates in 1080x1920 px. */
export function overlay() {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;inset:0;pointer-events:none;font-family:${FONT},sans-serif;font-weight:700;color:#fffaf0;
    text-shadow:0 6px 0 rgba(43,34,64,.55),0 10px 24px rgba(43,34,64,.45);`;
  document.body.appendChild(el);
  return { el, add(html, css = '') { const d = document.createElement('div'); d.innerHTML = html; d.style.cssText = `position:absolute;${css}`; el.appendChild(d); return d; } };
}

// ---------- renderer, lights ----------
/** WebGL renderer + composer with soft tilt-shift. Returns {renderer, render(scene, camera, {focus, blur})}. */
export function toyRenderer({ width = innerWidth, height = innerHeight } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  document.body.appendChild(renderer.domElement);
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(devicePixelRatio); composer.setSize(width, height);
  const rp = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
  const hp = new ShaderPass(HorizontalTiltShiftShader), vp = new ShaderPass(VerticalTiltShiftShader);
  composer.addPass(rp); composer.addPass(hp); composer.addPass(vp); composer.addPass(new OutputPass());
  return {
    renderer,
    render(scene, camera, { focus = 0.5, blur = 1 } = {}) {
      rp.scene = scene; rp.camera = camera;
      hp.uniforms.h.value = (blur * 1.2) / width; hp.uniforms.r.value = focus;
      vp.uniforms.v.value = (blur * 1.2) / height; vp.uniforms.r.value = focus;
      composer.render();
    },
  };
}

/** Warm key + sky fill. key.place(center, size) re-aims the shadow box at a world area. */
export function toyLights(scene) {
  const hemi = new THREE.HemisphereLight('#fff6ea', '#b9a6c9', 1.5);
  const key = new THREE.DirectionalLight('#fff1dc', 2.6);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
  scene.add(hemi, key, key.target);
  key.place = (c, size) => {
    key.target.position.copy(c);
    key.position.copy(c).add(new THREE.Vector3(-0.6, 1.2, 0.8).multiplyScalar(size * 2));
    Object.assign(key.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 0.1, far: size * 6 });
    key.shadow.camera.updateProjectionMatrix();
  };
  return { hemi, key };
}
