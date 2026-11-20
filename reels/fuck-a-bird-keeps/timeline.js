// Beats and cameras for "Fuck, a Bird Keeps Shitting on Me" (brief: briefs/fuck-a-bird-keeps.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-a-bird-keeps-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (13 lines; beat 6's speech bubble rides on line 5) + the end
const STORY = [0, 3, 7, 11.5, 13.5, 21, 25.5, 29.5, 31, 35.5, 40, 44, 48, 51];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'street' (origin), 'house' (x + 200), 'bunker' (x + 400). follow: camera is relative to you.
export const SHOTS = [
  { from: 0, to: 3, world: 'street', fov: 32, follow: true, cam: [{ p: [3.4, 3.4, 13.5], l: [0.6, 3.2, 0] }, { p: [3.0, 3.3, 12.8], l: [0.6, 3.2, 0] }] },
  { from: 3, to: 7, world: 'street', fov: 32, follow: true, cam: [{ p: [-2.6, 2.8, 8.5], l: [0.4, 2.6, 0] }, { p: [-2.2, 2.6, 8.0], l: [0.4, 2.6, 0] }] },
  { from: 7, to: 9.4, world: 'house', fov: 36, cam: [{ p: [-3.0, 4.0, 9.0], l: [1.4, 2.0, 0.4] }, { p: [-2.6, 3.8, 8.4], l: [1.2, 2.0, 0.4] }] },
  { from: 9.4, to: 11.5, world: 'house', fov: 32, cam: [{ p: [6.5, 4.6, 11], l: [0.8, 2.0, -0.6] }, { p: [5.5, 4.2, 9.5], l: [0.2, 2.0, -1.0] }] },
  { from: 11.5, to: 13.5, world: 'house', fov: 30, cam: [{ p: [4.4, 4.4, 2.2], l: [2.6, 3.6, -2.6] }, { p: [4.2, 4.3, 1.9], l: [2.6, 3.6, -2.6] }] },
  { from: 13.5, to: 15.6, world: 'house', fov: 36, cam: [{ p: [-2.8, 4.0, 8.6], l: [1.4, 2.0, 0.8] }, { p: [-2.6, 3.8, 8.0], l: [1.4, 2.0, 0.8] }] },
  { from: 15.6, to: 17.6, world: 'house', fov: 34, cam: [{ p: [0.4, 3.0, 9.2], l: [1.4, 2.0, 0.9] }, { p: [0.5, 2.9, 8.6], l: [1.4, 2.0, 0.9] }] },
  { from: 17.6, to: 19.5, world: 'house', fov: 32, cam: [{ p: [2.4, 3.6, 10.8], l: [1.3, 2.0, 1.0] }, { p: [2.2, 3.4, 9.8], l: [1.3, 2.0, 1.0] }] },
  { from: 19.5, to: 21, world: 'house', fov: 32, cam: [{ p: [-4.4, 3.3, 1.8], l: [2.0, 2.3, 1.5] }, { p: [-4.0, 3.25, 1.8], l: [2.0, 2.3, 1.5] }] },
  { from: 21, to: 23, world: 'street', fov: 32, cam: [{ p: [7.5, 3.8, 6.0], l: [3.2, 1.4, -3.0] }, { p: [7.0, 3.6, 5.5], l: [3.2, 1.4, -3.0] }] },
  { from: 23, to: 25.5, world: 'bunker', fov: 34, cam: [{ p: [1.4, 3.6, 13.5], l: [1.4, 3.4, 0] }, { p: [1.3, 3.3, 12.5], l: [1.3, 3.0, 0] }] },
  { from: 25.5, to: 29.5, world: 'bunker', fov: 32, cam: [{ p: [0.4, 3.6, 9.5], l: [-1.2, 2.2, -0.8] }, { p: [0.0, 3.4, 8.5], l: [-1.4, 2.0, -0.8] }] },
  { from: 29.5, to: 31, world: 'bunker', fov: 32, cam: [{ p: [0.4, 2.7, 6.4], l: [-1.1, 1.9, -0.4] }, { p: [0.3, 2.6, 6.0], l: [-1.1, 1.9, -0.4] }] },
  { from: 31, to: 33.2, world: 'street', fov: 34, cam: [{ p: [0.6, 3.4, 5.6], l: [3.8, 1.8, -2.8] }, { p: [0.9, 3.2, 5.0], l: [3.8, 1.8, -2.8] }] },
  { from: 33.2, to: 35.5, world: 'street', fov: 30, cam: [{ p: [7.4, 3.6, 7.4], l: [3.6, 1.8, -2.6] }, { p: [6.8, 3.4, 6.6], l: [3.6, 1.8, -2.6] }] },
  { from: 35.5, to: 37.8, world: 'street', fov: 36, cam: [{ p: [11.0, 3.8, 2.0], l: [4.0, 1.8, -2.8] }, { p: [10.4, 3.6, 1.4], l: [4.0, 1.8, -2.8] }] },
  { from: 37.8, to: 40, world: 'street', fov: 30, cam: [{ p: [6.4, 3.0, 2.4], l: [4.4, 2.2, -2.8] }, { p: [5.8, 2.8, 1.4], l: [4.4, 2.4, -2.8] }] },
  { from: 40, to: 42, world: 'street', fov: 40, cam: [{ p: [6.0, 6.0, 9.0], l: [4.4, 4.0, -3.0] }, { p: [6.0, 7.0, 9.0], l: [4.4, 6.0, -3.0] }] },
  { from: 42, to: 44, world: 'street', fov: 34, cam: [{ p: [8.6, 4.2, 9.0], l: [3.6, 2.0, -2.6] }, { p: [8.2, 4.0, 8.4], l: [3.6, 2.0, -2.6] }] },
  { from: 44, to: 46, world: 'street', fov: 36, followBird: true, cam: [{ p: [3.0, -2.5, 11], l: [0, 0, 0] }, { p: [2.5, -1.5, 9], l: [0, 0, 0] }] },
  { from: 46, to: 48, world: 'street', fov: 32, cam: [{ p: [-1.0, 3.6, 8.5], l: [-3.2, 2.4, -2.6] }, { p: [-1.4, 3.4, 7.8], l: [-3.2, 2.4, -2.6] }] },
  { from: 48, to: 51, world: 'street', fov: 32, cam: [{ p: [6.8, 3.4, 7.2], l: [2.6, 2.0, -2.4] }, { p: [7.4, 3.6, 8.0], l: [2.4, 2.1, -2.4] }] },
];

// story moments (seconds)
export const T = {
  title: 0.9, glide: [0.2, 1.4], drop1: 1.6, splat1: 2.05,
  drops: [3.6, 4.6, 5.5], fist: 5.9,
  enter: 7.0, couch: 8.4, hop: 9.6, splatHouse: 10.4,
  shrug: 11.9, dropLamp: 12.5,
  wifeIn: 13.8, bubble: 19.4,
  dig: [21, 23], climb: [23.2, 24.4], hatch: 24.5, fistUp: 24.8,
  vent: 26.4, ventOut: 27.2, mouth: 28.8,
  gag: 29.6,
  pour: [31.6, 32.8], peck: [33.4, 35.4], rub: 33.6,
  bloat: [35.8, 39.8],
  boom: 40.2, launch: 40.3,
  fly: [44.0, 45.9], land: 46.0, wifeSplats: [46.3, 46.9, 47.5],
  chair: 48.0, sweet: 48.6, finalDrop: 50.6,
};
