// Test reel: a toon-shaded spinning cube.
import * as THREE from 'three';

export const duration = 2;

const W = window.innerWidth, H = window.innerHeight; // 1080x1920 CSS px
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(W, H);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffd166');

const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
camera.position.set(0, 1.5, 9);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight('#ffffff', '#8a5a00', 1.2));
const sun = new THREE.DirectionalLight('#ffffff', 2.5);
sun.position.set(3, 5, 4);
scene.add(sun);

// 3-step toon ramp
const ramp = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
ramp.needsUpdate = true;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 2.2, 2.2),
  new THREE.MeshToonMaterial({ color: '#ef476f', gradientMap: ramp }),
);
// cartoon outline: back-faces of a slightly larger black cube
const outline = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 2.2, 2.2),
  new THREE.MeshBasicMaterial({ color: '#1b1b1b', side: THREE.BackSide }),
);
outline.scale.setScalar(1.06);
cube.add(outline);
scene.add(cube);

const ground = new THREE.Mesh(new THREE.CircleGeometry(2, 48), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2.4;
scene.add(ground);

// Deterministic: everything is a pure function of t.
window.renderFrame = (t) => {
  const p = t / duration;
  cube.rotation.y = p * Math.PI * 2;          // one full turn over the reel -> loops cleanly
  cube.rotation.x = Math.sin(p * Math.PI * 2) * 0.4;
  cube.position.y = Math.abs(Math.sin(p * Math.PI * 2)) * 0.6;
  ground.scale.setScalar(1 - cube.position.y * 0.3);
  renderer.render(scene, camera);
};
