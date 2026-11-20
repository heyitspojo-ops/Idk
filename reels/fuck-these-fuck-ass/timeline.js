// Beats and cameras for "Fuck These Fuck Ass Nuns Keep Meowing" (brief: briefs/fuck-these-fuck-ass.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-these-fuck-ass-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (13 lines) + the end
const STORY = [0, 3.5, 6.5, 10.5, 14, 17.5, 21.5, 24, 30, 35, 40, 45, 48, 50];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'church' (interior, origin; altar z -10, doors z 8), 'home' (house, x + 300), 'street' (x + 600; church exterior at z -8)
export const SHOTS = [
  { from: 0, to: 3.5, world: 'church', fov: 34, cam: [{ p: [-3.1, 2.6, -9.0], l: [-3.1, 1.7, -5.8] }, { p: [-3.1, 2.4, -8.4], l: [-3.1, 1.8, -5.8] }] },
  { from: 3.5, to: 6.5, world: 'church', fov: 30, cam: [{ p: [-4.2, 2.6, -8.0], l: [-4.2, 2.3, -5.8] }, { p: [-4.2, 2.5, -7.5], l: [-4.2, 2.35, -5.8] }] },
  { from: 6.5, to: 10.5, world: 'church', fov: 38, cam: [{ p: [0.8, 3.4, -3.0], l: [0, 2.0, 7.0] }, { p: [0.6, 3.2, -2.0], l: [0, 2.0, 5.0] }] },
  { from: 10.5, to: 14, world: 'church', fov: 32, cam: [{ p: [0.9, 2.9, -1.4], l: [0, 2.3, 2.0] }, { p: [0.7, 2.8, -0.8], l: [0, 2.4, 2.0] }] },
  { from: 14, to: 17.5, world: 'church', fov: 30, cam: [{ p: [0.5, 2.7, 0.4], l: [0, 2.5, 2.0] }, { p: [0.4, 2.6, 0.7], l: [0, 2.55, 2.0] }] },
  { from: 17.5, to: 19.5, world: 'home', fov: 34, cam: [{ p: [2.4, 3.2, 5.6], l: [-1.4, 1.6, -2.2] }, { p: [2.0, 3.0, 4.8], l: [-1.4, 1.6, -2.2] }] },
  { from: 19.5, to: 21.5, world: 'church', fov: 32, cam: [{ p: [-2.0, 2.6, -6.4], l: [-2.0, 1.9, -3.9] }, { p: [-2.0, 2.5, -6.0], l: [-2.0, 1.95, -3.9] }] },
  { from: 21.5, to: 24, world: 'church', fov: 32, cam: [{ p: [2.4, 2.8, 1.0], l: [2.0, 1.9, 3.7] }, { p: [2.3, 2.7, 1.4], l: [2.0, 1.95, 3.7] }] },
  { from: 24, to: 26, world: 'church', fov: 40, cam: [{ p: [0.6, 3.0, -8.6], l: [-3.1, 1.6, -3.0] }, { p: [0.4, 3.0, -8.2], l: [-3.1, 1.6, -2.0] }] },
  { from: 26, to: 28, world: 'church', fov: 40, cam: [{ p: [-0.6, 3.0, -8.6], l: [3.1, 1.6, -2.0] }, { p: [-0.4, 3.0, -8.2], l: [3.1, 1.6, -1.0] }] },
  { from: 28, to: 30, world: 'church', fov: 44, cam: [{ p: [0, 6.0, -9.2], l: [0, 1.4, 0] }, { p: [0, 6.6, -9.4], l: [0, 1.2, 0.5] }] },
  { from: 30, to: 35, world: 'home', fov: 36, cam: [{ p: [4.6, 3.4, 5.2], l: [2.2, 1.4, 0.2] }, { p: [4.2, 3.2, 4.6], l: [2.2, 1.5, 0.2] }] },
  { from: 35, to: 40, world: 'street', fov: 40, cam: [{ p: [9, 4.2, 9], l: [-1, 2.6, -5] }, { p: [8, 4.0, 8], l: [-1, 2.6, -5] }] },
  { from: 40, to: 45, world: 'church', fov: 42, cam: [{ p: [0.4, 5.2, 7.0], l: [0, 1.8, -1.5] }, { p: [0.2, 4.8, 6.2], l: [0, 1.9, -1.5] }] },
  { from: 45, to: 48, world: 'church', fov: 40, cam: [{ p: [0, 3.4, -9.2], l: [0, 1.4, -4.0] }, { p: [0, 3.2, -8.8], l: [0, 1.4, -4.0] }] },
  { from: 48, to: 50, world: 'home', fov: 36, cam: [{ p: [4.6, 3.6, 5.2], l: [1.6, 1.6, -0.6] }, { p: [4.3, 3.4, 4.8], l: [1.4, 1.7, -0.8] }] },
];

// story moments (seconds)
export const T = {
  whip: 0.9, title: 1.0, catPop: 4.2,
  gertIn: [6.8, 9.6], doors: 6.8, smirk: 11.0, bigMeow: 14.6,
  preen: 19.8, relief: 22.0,
  domino: [24.4, 29.4],
  clock: 30.3, bolt: 31.0,
  whistle: 35.3, march: [35.5, 39.0], kick: 39.3,
  cloud: [40.2, 44.6], aftermath: 45.0, mew: 46.6,
  flop: 48.1, endCard: 48.3, windowNun: 49.55,
};
