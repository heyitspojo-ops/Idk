// Toy car, faces +z (front), ~4.2 long, wheels on y = 0.
// buildCar({ style: 'sedan' | 'hatch', body, roof, rust, spoiler, underglow, convertible })
//   convertible: no roof/rear glass, just a windshield, so the driver is visible
//   -> { group, anchors: { seat, hood, intake, exhaust, driverDoor }, doors[], set({...}) }
// set({ t, speed (wheel spin rad/s), twist 0..1 (chassis pretzel), lift 0..1 (front wheels up), hoodOpen 0..1,
//       engine: 'stock' | 'v8' | 'none', blown 0..1 (hood + engine blown off), bounce 0..1, doors: 0..4 attached,
//       char 0..1 (scorched) })
import * as THREE from 'three';
import { mesh, mat, rbox, cyl, ball, at } from './toy-kit.js';

export function buildCar(o = {}) {
  const { style = 'sedan', body = '#d9c7a3', roof = null, rust = true, spoiler = false, underglow = null, convertible = false } = o;
  const g = new THREE.Group(), rear = at(new THREE.Group(), 0, 0, -0.1, g), front = at(new THREE.Group(), 0, 0, 0.1, g);
  const bm = mat(body), char = mat('#3b3640');
  const L = 4.2, W = 1.9, H = 0.7;
  // two halves so the chassis can twist (front half rotates about z)
  const rearBody = at(mesh(rbox(W, H, L / 2, 0.2), bm), 0, 0.75, -L / 4, rear);
  const frontBody = at(mesh(rbox(W, H, L / 2, 0.2), bm), 0, 0.75, L / 4, front);
  const cabinLen = style === 'hatch' ? 2.0 : 1.8;
  const cabin = at(mesh(rbox(W * 0.86, 0.7, cabinLen, 0.18), roof ? mat(roof) : bm), 0, 1.42, style === 'hatch' ? -0.55 : -0.2, rear);
  cabin.visible = !convertible;
  const glass = mat('#9fd0ea', { roughness: 0.2 });
  at(mesh(rbox(W * 0.8, 0.5, 0.06, 0.04), glass), 0, 1.45, (style === 'hatch' ? -0.55 : -0.2) + cabinLen / 2, rear).rotation.x = -0.3;
  at(mesh(rbox(W * 0.8, 0.5, 0.06, 0.04), glass), 0, 1.45, (style === 'hatch' ? -0.55 : -0.2) - cabinLen / 2, rear).rotation.x = 0.3;
  rear.children[rear.children.length - 1].visible = !convertible;
  if (convertible) for (const s of [-1, 1]) at(mesh(rbox(0.5, 0.55, 0.5, 0.12), '#3b2f4a'), s * 0.42, 1.25, -0.55, rear); // seat backs
  if (rust) for (const [x, y, z] of [[W / 2 + 0.01, 0.6, -1.3], [-W / 2 - 0.01, 0.75, 1.2], [W / 2 + 0.01, 0.9, 0.7]])
    at(mesh(ball(0.18, 0), '#a0522d'), x, y, z, x > 0 ? (z > 0 ? front : rear) : front).scale.set(0.2, 1, 1.4);
  if (spoiler) { for (const s of [-0.6, 0.6]) at(mesh(rbox(0.08, 0.5, 0.12, 0.03), '#2b2233'), s, 1.3, -L / 2 + 0.2, rear);
    at(mesh(rbox(W + 0.4, 0.08, 0.5, 0.03), '#2b2233'), 0, 1.58, -L / 2 + 0.15, rear); }
  if (underglow) at(new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, L * 0.9), mat(underglow, { emissive: underglow, emissiveIntensity: 2, transparent: true, opacity: 0.7 })), 0, 0.05, 0, g).rotation.x = -Math.PI / 2;
  // lights
  for (const s of [-0.62, 0.62]) { at(mesh(rbox(0.36, 0.16, 0.05, 0.04), mat('#fff7c2', { emissive: '#fff1a0', emissiveIntensity: 0.6 })), s, 0.85, L / 2 + 0.01, front);
    at(mesh(rbox(0.36, 0.14, 0.05, 0.04), mat('#ef4444', { emissive: '#ef4444', emissiveIntensity: 0.4 })), s, 0.85, -L / 2 - 0.01, rear); }
  // doors (4): flat panels on the sides
  const doors = [[1, 0.4], [-1, 0.4], [1, -0.65], [-1, -0.65]].map(([s, z]) => at(mesh(rbox(0.06, 0.65, 0.95, 0.04), bm), s * (W / 2 + 0.03), 0.9, z, s > 0 && z > 0 ? front : rear));
  // hood (lid over the engine bay) + engines
  const hood = at(new THREE.Group(), 0, 1.11, L / 2 - 1.05, front);
  at(mesh(rbox(W * 0.94, 0.06, 1.05, 0.03), bm), 0, 0, 0.5, hood);
  const stock = at(new THREE.Group(), 0, 1.0, L / 4 + 0.15, front);
  at(mesh(rbox(0.9, 0.35, 0.7, 0.06), '#6b7280'), 0, 0, 0, stock);
  const intake = at(mesh(cyl(0.14, 0.14, 0.3, 8), '#9aa3ad'), 0.25, 0.3, 0, stock);
  const v8 = at(new THREE.Group(), 0, 1.05, L / 4 + 0.1, front), chrome = mat('#dfe5ec', { metalness: 0.6, roughness: 0.2 });
  at(mesh(rbox(1.2, 0.7, 1.2, 0.08), '#d23b3b'), 0, 0.3, 0, v8);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) at(mesh(cyl(0.07, 0.07, 0.5, 6), chrome), s * 0.75, 0.35, -0.45 + i * 0.3, v8).rotation.z = s * 1.2;
  at(mesh(rbox(0.9, 1.4, 0.8, 0.08), chrome), 0, 1.3, 0, v8);
  for (let i = 0; i < 6; i++) at(mesh(rbox(1.0, 0.06, 0.9, 0.02, 1), '#b9c0ca'), 0, 0.75 + i * 0.22, 0, v8);
  at(mesh(rbox(1.1, 0.5, 0.9, 0.1), '#2b2233'), 0, 2.2, 0, v8);
  for (const s of [-1, 1]) at(mesh(cyl(0.18, 0.22, 0.4, 8), chrome), s * 0.3, 2.65, 0, v8);
  // wheels
  const wheels = [[1, 1.35], [-1, 1.35], [1, -1.35], [-1, -1.35]].map(([s, z]) => {
    const piv = at(new THREE.Group(), s * (W / 2 + 0.05), 0.42, z, z > 0 ? front : rear);
    const w = at(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12), '#2b2233'), 0, 0, 0, piv); w.rotation.z = Math.PI / 2;
    const cap = at(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 8), '#c9ced6'), 0, 0, 0, piv); cap.rotation.z = Math.PI / 2;
    for (let k = 0; k < 3; k++) at(mesh(rbox(0.33, 0.05, 0.05, 0.01, 1), '#6b7280'), 0, 0, 0, piv).rotation.x = (k / 3) * Math.PI;
    return piv;
  });
  const seat = at(new THREE.Object3D(), 0.42, 0.62, -0.25, rear);
  const anchors = { seat, hood, intake, exhaust: at(new THREE.Object3D(), -0.6, 0.45, -L / 2 - 0.15, rear), driverDoor: doors[0] };
  g.set = ({ t = 0, speed = 0, twist = 0, lift = 0, hoodOpen = 0, engine = 'stock', blown = 0, bounce = 0, doors: nd = 4, char: ch = 0 } = {}) => {
    wheels.forEach(w => (w.rotation.x = t * speed));
    front.rotation.set(-lift * 0.35, 0, twist * 0.6); rear.rotation.set(0, 0, -twist * 0.25);
    const bo = Math.abs(Math.sin(t * 22)) * 0.05 * bounce; // bounce inside the body, so g.position stays the caller's
    front.position.y = lift * 0.5 + bo; rear.position.y = bo;
    hood.rotation.x = -hoodOpen * 1.3; hood.visible = blown < 0.5;
    stock.visible = engine === 'stock' && blown < 0.5; v8.visible = engine === 'v8';
    doors.forEach((d, i) => (d.visible = i < nd));
    [rearBody, frontBody].forEach(m => (m.material = ch > 0.5 ? char : bm)); cabin.material = ch > 0.5 ? char : roof ? mat(roof) : bm;
  };
  g.set();
  return { group: g, anchors, doors, set: g.set, parts: { front, rear, v8, stock } };
}
