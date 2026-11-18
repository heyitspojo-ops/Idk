// Beat times (from briefs/you-have-fucking-head.md, fitted to vo-timing.json) and camera per shot.
// cam: [from, to] each { p: position, l: look-at } in the shot's world coordinates; fov in degrees.
// world 'bath' = bathroom diorama; 'scalp' = hair forest (offset in scene.js).
export const DURATION = 45;

export const SHOTS = [
  { id: 1, beat: 1, from: 0.0, to: 3.0, world: 'scalp', fov: 30,
    cam: [{ p: [0, 1.6, 10], l: [0, 1.3, 0] }, { p: [0, 1.6, 9.3], l: [0, 1.3, 0] }] },
  { id: 2, beat: 2, from: 3.0, to: 8.0, world: 'bath', fov: 28,
    cam: [{ p: [9, 7.5, 17], l: [0.2, 2.2, 0.4] }, { p: [6.5, 5.5, 12.5], l: [0.3, 2.4, 0.8] }] },
  { id: 3, beat: 3, from: 8.0, to: 13.0, world: 'scalp', fov: 34,
    cam: [{ p: [-21.8, 3.0, 15.2], l: [-21.3, 2.3, 0] }, { p: [-20.6, 3.2, 14.6], l: [-21.0, 2.3, 0] }] },
  { id: 4, beat: 4, from: 13.0, to: 15.5, world: 'bath', fov: 26,
    cam: [{ p: [3.8, 4.4, 10.5], l: [0.4, 3.2, 1.4] }, { p: [3.0, 4.2, 9.2], l: [0.4, 3.3, 1.4] }] },
  { id: 5, beat: 4, from: 15.5, to: 19.0, world: 'scalp', fov: 32,
    cam: [{ p: [21, 5.6, 10.0], l: [19.9, 0.6, -0.4] }, { p: [20.2, 5.0, 9.2], l: [19.9, 0.7, -0.4] }] },
  { id: 6, beat: 5, from: 19.0, to: 20.4, world: 'scalp', fov: 36,
    cam: [{ p: [0.4, 3.0, -9.6], l: [0, 3.5, -19] }, { p: [-0.4, 3.1, -10.0], l: [0, 3.5, -19] }] },
  { id: 7, beat: 5, from: 20.4, to: 25.0, world: 'scalp', fov: 36,
    cam: [{ p: [0, 7.5, -9.5], l: [0, 2.0, -22] }, { p: [1.2, 8.5, -10.2], l: [0, 1.8, -22.5] }] },
  { id: 8, beat: 6, from: 25.0, to: 30.0, world: 'scalp', fov: 36,
    cam: [{ p: [-1.0, 2.4, -13.2], l: [0, 2.5, -23] }, { p: [-0.5, 2.3, -14.2], l: [0, 2.6, -23] }] },
  { id: 9, beat: 7, from: 30.0, to: 34.3, world: 'bath', fov: 28,
    cam: [{ p: [3.5, 6.5, 16], l: [-2.8, 2.6, -1.3] }, { p: [0.5, 4.6, 9.5], l: [-2.8, 3.2, -1.3] }] },
  { id: 10, beat: 8, from: 34.3, to: 39.0, world: 'bath', fov: 32,
    cam: [{ p: [8.8, 5.0, 9.6], l: [4.1, 3.1, -2.1] }, { p: [8.3, 4.9, 8.8], l: [4.1, 3.2, -2.1] }] },
  { id: 11, beat: 9, from: 39.0, to: 42.5, world: 'bath', fov: 26,
    cam: [{ p: [12.4, 4.4, 1.4], l: [4.0, 3.75, -2.51] }, { p: [12.1, 4.3, 1.3], l: [4.0, 3.75, -2.51] }] },
  { id: 12, beat: 10, from: 42.5, to: 45.0, world: 'bath', fov: 30,
    cam: [{ p: [3.1, 3.7, 6.2], l: [3.95, 3.6, -2.2] }, { p: [3.0, 3.8, 6.8], l: [3.95, 3.6, -2.2] }] },
];

// Story moments (seconds)
export const T = {
  louseUp: 0.2, title: 0.9, nailSlam: 1.55,
  nailSweep: [8.2, 12.8], wheee: 9.0,
  latherBath: 13.0, poolParty: 15.5,
  combDrag: [19.0, 20.4], houses: [20.4, 21.4], flag: 21.5,
  speech: 25.1,
  bulb: 33.4,
  mannequin: 34.4, sign: 35.6, point: 35.0,
  march: [39.1, 42.1], hatTip: 41.6,
  sparkle: 42.6, endCard: 42.8, peek: 44.6,
};
