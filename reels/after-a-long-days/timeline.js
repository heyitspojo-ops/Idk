// Beats and cameras for "After a Long Day's Work, This Freak Climbs in Bed" (brief: briefs/after-a-long-days.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/after-a-long-days-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (14 lines) + the end
const STORY = [0, 3.5, 6, 8.5, 12, 16, 21, 24.5, 28, 32, 36, 40, 44, 48, 50];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'room' (bedroom, origin; bed at (0,0,-1.6) head to -z, window on left wall x -5.3, lock door on right wall x 5.3, ceiling y 7)
//         'street' (x + 400; front door at (0,0,-5.8), sidewalk z 0, trash can at the curb)
export const SHOTS = [
  { from: 0, to: 2.4, world: 'room', fov: 40, cam: [{ p: [1.8, 5.6, 5.0], l: [0.6, 1.2, -1.6] }, { p: [1.5, 5.2, 4.4], l: [0.6, 1.2, -1.6] }] },
  { from: 2.4, to: 3.5, world: 'room', fov: 32, cam: [{ p: [-0.5, 6.4, 0.4], l: [-0.6, 1.3, -2.6] }, { p: [-0.5, 6.0, 0.0], l: [-0.6, 1.3, -2.6] }] },
  { from: 3.5, to: 6, world: 'room', fov: 34, cam: [{ p: [0.0, 6.5, 2.0], l: [-0.1, 1.3, -2.6] }, { p: [0.3, 6.2, 1.4], l: [0.3, 1.3, -2.6] }] },
  { from: 6, to: 8.5, world: 'room', fov: 46, cam: [{ p: [-2.8, 3.2, 5.4], l: [0.6, 1.6, -0.8] }, { p: [-2.6, 3.0, 5.0], l: [0.6, 1.6, -0.8] }] },
  { from: 8.5, to: 12, world: 'room', fov: 44, cam: [{ p: [-1.6, 3.4, 6.6], l: [3.4, 1.8, 0.6] }, { p: [-1.0, 3.2, 6.0], l: [4.4, 1.8, 1.0] }] },
  { from: 12, to: 14, world: 'room', fov: 40, cam: [{ p: [1.6, 3.6, 6.0], l: [4.8, 2.0, 1.4] }, { p: [2.0, 3.4, 5.6], l: [4.8, 2.0, 1.4] }] },
  { from: 14, to: 16, world: 'room', fov: 42, cam: [{ p: [1.8, 5.6, 5.6], l: [1.0, 1.2, -0.8] }, { p: [1.6, 5.2, 5.0], l: [0.6, 1.2, -1.2] }] },
  { from: 16, to: 18, world: 'room', fov: 40, cam: [{ p: [0.6, 3.2, 3.0], l: [-5.2, 1.8, -1.2] }, { p: [0.2, 3.0, 2.6], l: [-5.2, 1.8, -1.2] }] },
  { from: 18, to: 21, world: 'room', fov: 34, cam: [{ p: [0.2, 6.5, 2.4], l: [0.0, 1.3, -2.2] }, { p: [0.1, 6.3, 1.9], l: [0.0, 1.3, -2.2] }] },
  { from: 21, to: 23, world: 'room', fov: 46, cam: [{ p: [-1.2, 3.6, 7.0], l: [1.8, 1.8, 0.6] }, { p: [-0.8, 3.4, 6.4], l: [2.4, 1.8, 0.8] }] },
  { from: 23, to: 24.5, world: 'street', fov: 46, cam: [{ p: [6, 4.4, 12], l: [2, 2.4, -2] }, { p: [9, 4.4, 12], l: [8, 2.0, 0] }] },
  { from: 24.5, to: 28, world: 'room', fov: 42, cam: [{ p: [-1.2, 3.8, 4.0], l: [-5.0, 2.0, -1.2] }, { p: [-1.6, 3.6, 3.6], l: [-5.0, 2.0, -1.2] }] },
  { from: 28, to: 29.6, world: 'room', fov: 38, cam: [{ p: [-0.4, 5.0, 0.8], l: [-0.6, 1.6, -2.4] }, { p: [-0.4, 4.8, 0.5], l: [-0.6, 1.6, -2.4] }] },
  { from: 29.6, to: 32, world: 'room', fov: 36, cam: [{ p: [0.8, 2.4, 0.8], l: [-0.6, 6.8, -2.4] }, { p: [0.6, 2.6, 0.6], l: [-0.6, 6.6, -2.4] }] },
  { from: 32, to: 36, world: 'street', fov: 40, cam: [{ p: [7.6, 4.6, 7.6], l: [1.6, 2.0, -1.8] }, { p: [7, 4.2, 7], l: [1.6, 2.0, -1.6] }] },
  { from: 36, to: 37, world: 'room', fov: 42, cam: [{ p: [1.4, 2.2, 2.6], l: [-0.6, 5.6, -1.8] }, { p: [1.2, 2.2, 2.2], l: [-0.6, 5.6, -1.8] }] },
  { from: 37, to: 38, world: 'room', fov: 42, cam: [{ p: [2.4, 5.4, 5.4], l: [0.4, 1.4, -1.0] }, { p: [2.2, 5.2, 5.0], l: [0.2, 1.4, -1.2] }] },
  { from: 38, to: 40, world: 'room', fov: 50, cam: [{ p: [-0.6, 4.4, 7.0], l: [2.0, 1.6, -0.4] }, { p: [-0.4, 4.2, 6.4], l: [0.8, 1.4, -0.8] }] },
  { from: 40, to: 44, world: 'room', fov: 32, cam: [{ p: [0.2, 6.4, 1.4], l: [0.0, 1.4, -2.4] }, { p: [0.1, 6.0, 0.8], l: [0.0, 1.4, -2.4] }] },
  { from: 44, to: 45.8, world: 'room', fov: 34, cam: [{ p: [-1.6, 2.8, 2.0], l: [-5.3, 2.2, -1.2] }, { p: [-1.9, 2.7, 1.7], l: [-5.3, 2.2, -1.2] }] },
  { from: 45.8, to: 48, world: 'room', fov: 42, cam: [{ p: [0.2, 6.0, 1.2], l: [0.0, 1.2, -2.0] }, { p: [0.2, 5.6, 0.8], l: [0.0, 1.2, -2.0] }] },
  { from: 48, to: 49.55, world: 'room', fov: 40, cam: [{ p: [2.0, 6.0, 5.0], l: [0.0, 1.4, -1.6] }, { p: [1.7, 5.6, 4.4], l: [0.0, 1.4, -1.6] }] },
  { from: 49.55, to: 50, world: 'room', fov: 32, cam: [{ p: [0.9, 5.6, 0.2], l: [0.5, 1.5, -2.6] }, { p: [0.7, 5.3, -0.2], l: [0.5, 1.5, -2.6] }] },
];

// story moments (seconds)
export const T = {
  creepIn: [0.8, 1.5], eyesOpen: 2.4, title: 2.45,
  grin: 3.7,
  scream: 6.15, point: 6.3,
  climbOut: 8.7, backOut: [9.3, 11.3], doorOpen: 10.2, doorShut: 11.6,
  night2: 12.1, locks: [12.6, 13.0, 13.4], bedHop2: 14.2,
  winOpen: 16.3, slither: [16.6, 17.4], bedHop3: 17.5, spoon: 18.1,
  jumpUp: 21.2, kick: 22.5, boot: 22.55, fly: [23.0, 23.8], bounces: [23.8, 24.2, 24.45],
  night3: 24.6, bolts: [25.0, 25.4, 25.8, 26.2], bedHop4: 26.8,
  dust: 28.2, lookUp: 29.0, cut: [29.7, 31.0], plug: 31.0, peek: 31.3,
  carry: 32.2, fling: 33.4, can: 34.2,
  patch: 36.4, flop: 37.0, night4: 37.9, doorBurst: 38.2, dive: [38.7, 39.5],
  hold: 40.2, timelapse: [44.2, 47.6],
  morning: 48.0, endCard: 48.3, creepEyes: 49.6,
};
