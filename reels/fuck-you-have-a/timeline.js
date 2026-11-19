// Beats and cameras for "Fuck, You Have a Pimple" (brief: briefs/fuck-you-have-a.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-you-have-a-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (13 lines) + the end
const STORY = [0, 3, 6.5, 10, 13.5, 19, 23, 27.5, 31.5, 35.5, 38, 42.5, 46, 48];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'bath' (origin), 'room' (x + 200), 'street' (x + 400), 'road' (x + 700).
// track: 'you' -> cam offsets from you; 'sky' -> offsets from you incl. height
export const SHOTS = [
  { from: 0, to: 13.5, world: 'bath', fov: 30, cam: [{ p: [0.1, 2.75, 5.2], l: [0, 2.55, 1.4] }, { p: [0.0, 2.7, 4.7], l: [0, 2.55, 1.4] }] },
  { from: 13.5, to: 15.3, world: 'bath', fov: 32, cam: [{ p: [1.6, 1.0, 4.6], l: [0.2, 0.8, 1.4] }, { p: [1.4, 0.9, 4.3], l: [0.2, 0.8, 1.4] }] },
  { from: 15.3, to: 17.1, world: 'bath', fov: 32, cam: [{ p: [0.6, 2.2, -2.2], l: [0, 1.9, 1.4] }, { p: [0.4, 2.1, -1.9], l: [0, 1.9, 1.4] }] },
  { from: 17.1, to: 19, world: 'bath', fov: 32, cam: [{ p: [1.8, 1.4, -2.0], l: [0, 1.1, 1.4] }, { p: [1.6, 1.3, -1.7], l: [0, 1.1, 1.4] }] },
  { from: 19, to: 23, world: 'room', fov: 40, cam: [{ p: [6.0, 3.2, 8.5], l: [0.4, 2.0, 0.2] }, { p: [7.0, 4.0, 10.5], l: [0.2, 2.6, 0] }] },
  { from: 23, to: 26.4, world: 'street', fov: 38, cam: [{ p: [9, 5, 6], l: [0, 5, -8] }, { p: [8, 6, 5], l: [0, 5.5, -8] }] },
  { from: 26.4, to: 27.5, world: 'street', fov: 40, cam: [{ p: [8, 3, 6], l: [0, 2.5, -5] }, { p: [8, 2.5, 6], l: [0, 1.6, -4] }] },
  { from: 27.5, to: 31.5, world: 'street', fov: 44, track: 'sky', cam: [{ p: [4, 2, 16], l: [0, 0, -2] }, { p: [5, 3, 18], l: [0, 0, -2] }] },
  { from: 31.5, to: 35.5, world: 'road', fov: 40, cam: [{ p: [7, 3.2, 16], l: [0, 2.0, -6] }, { p: [6.4, 3.0, 15], l: [0, 2.2, -8] }] },
  { from: 35.5, to: 38, world: 'road', fov: 34, track: 'you', cam: [{ p: [0.4, 2.6, -4.2], l: [0, 2.6, 0] }, { p: [0.3, 2.6, -3.8], l: [0, 2.6, 0] }] },
  { from: 38, to: 40.2, world: 'road', fov: 40, cam: [{ p: [9, 3.4, 15], l: [0.5, 2.4, 2] }, { p: [10, 5, 17], l: [0.5, 5, 0] }] },
  { from: 40.2, to: 42.5, world: 'road', fov: 44, track: 'sky', cam: [{ p: [6, -1, 10], l: [0, 0, 0] }, { p: [7, -2, 12], l: [0, 0, 0] }] },
  { from: 42.5, to: 48, world: 'room', fov: 38, cam: [{ p: [3.2, 4.0, 7.5], l: [-1.4, 2.0, -2.0] }, { p: [2.4, 3.4, 5.6], l: [-1.4, 1.8, -2.2] }] },
];

// story moments (seconds)
export const T = {
  title: 0.9, cross: 1.2,
  squeeze: [3.6, 4.4], pop1: 4.4,
  cheek: 7.6, chinPop: 10.6, chin: 11.0,
  legPop: 14.4, backPop: 16.2, buttPop: 18.0,
  grow: [19.2, 22.6],
  roof: 23.4, jump: 26.5, land: 27.5,
  bounce: [27.5, 35.0], basketball: 29.6,
  truck: [31.5, 38.6], hit: 38.6,
  fly: [38.7, 42.4], crash: 43.0,
  mirror: 46.2, endCard: 46.4, zit: 47.6,
};
