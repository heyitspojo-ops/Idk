// Beats and cameras for "Fuck, This Shopping Cart" (brief: briefs/fuck-this-shopping-cart.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-this-shopping-cart-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (13 lines) + the end
const STORY = [0, 3, 6.5, 10.5, 13.5, 17, 21, 26, 29, 31.5, 33.5, 36, 41, 45];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// store aisle runs along z (start z ~ 9, end wall z = -22). track: 'cart' | 'you' -> camera p/l are offsets from it
export const SHOTS = [
  { from: 0, to: 1.4, fov: 30, track: 'cart', cam: [{ p: [-1.6, 0.5, -2.4], l: [-0.48, 0.2, -0.72] }, { p: [-1.9, 0.7, -2.9], l: [-0.48, 0.3, -0.72] }] },
  { from: 1.4, to: 3, fov: 32, track: 'cart', cam: [{ p: [-3.5, 3.0, -5.5], l: [0, 1.6, 1.0] }, { p: [-4.0, 3.4, -6.5], l: [0, 1.6, 1.0] }] },
  { from: 3, to: 6.5, fov: 34, cam: [{ p: [0.4, 6.5, 14.5], l: [-0.6, 1.4, 5.5] }, { p: [0.2, 6.0, 13.5], l: [-0.8, 1.4, 5.0] }] },
  { from: 6.5, to: 10.5, fov: 34, cam: [{ p: [4.5, 4.4, 9.5], l: [-0.5, 1.6, 2.8] }, { p: [3.8, 4.0, 8.0], l: [-0.8, 1.6, 2.0] }] },
  { from: 10.5, to: 13.5, fov: 30, cam: [{ p: [-0.2, 3.0, 6.6], l: [-0.4, 2.4, 1.5] }, { p: [-0.2, 2.9, 6.0], l: [-0.4, 2.4, 1.5] }] },
  { from: 13.5, to: 17, fov: 32, cam: [{ p: [1.4, 1.2, 0.2], l: [0, 2.0, 4.8] }, { p: [1.2, 1.1, 0.8], l: [0, 2.0, 4.8] }] },
  { from: 17, to: 21, fov: 32, cam: [{ p: [7.0, 2.6, 2.6], l: [0, 1.6, 1.8] }, { p: [6.6, 2.5, 2.6], l: [0, 1.6, 1.8] }] },
  { from: 21, to: 26, fov: 32, cam: [{ p: [-3.8, 2.6, -1.2], l: [0, 1.6, 3.4] }, { p: [-4.4, 2.8, 0.6], l: [0, 1.7, 3.6] }] },
  { from: 26, to: 29, fov: 32, cam: [{ p: [1.8, 2.2, 0.0], l: [0, 1.4, 4.4] }, { p: [1.6, 2.1, 0.4], l: [0, 1.4, 4.4] }] },
  { from: 29, to: 31.5, fov: 40, track: 'cart', cam: [{ p: [3.2, 3.4, 6.5], l: [0, 1.4, 0.5] }, { p: [3.0, 3.0, 6.0], l: [0, 1.4, 0.5] }] },
  { from: 31.5, to: 33.5, fov: 34, track: 'cart', cam: [{ p: [1.0, 0.9, -3.4], l: [0, 1.3, 0] }, { p: [0.9, 0.85, -3.2], l: [0, 1.3, 0] }] },
  { from: 33.5, to: 36, fov: 34, track: 'cart', cam: [{ p: [2.6, 3.0, 2.0], l: [0, 2.0, 2.8] }, { p: [2.4, 2.9, 1.8], l: [0, 2.0, 2.8] }] },
  { from: 36, to: 41, fov: 34, cam: [{ p: [5.2, 4.2, -10.5], l: [0.0, 1.4, -18.6] }, { p: [4.6, 3.8, -11.5], l: [0.0, 1.4, -18.8] }] },
  { from: 41, to: 45, fov: 34, cam: [{ p: [4.6, 3.8, -11.0], l: [-0.4, 1.8, -17.4] }, { p: [4.2, 3.6, -10.0], l: [-0.2, 1.8, -16.6] }] },
];

// story moments (seconds)
export const T = {
  title: 0.9, swerve: 2.0,
  yank: [3.4, 5.6], tumble: 5.0,
  drift: [6.8, 9.8], bump: 9.8,
  turn: [10.6, 11.3], slap: 11.6,
  grip: 13.8,
  eyes: 17.3, backUp: [17.6, 18.6], rev: [18.6, 19.2], ram: 19.35,
  inflate: [21.4, 23.6], lookBack: [23.6, 24.4], proud: 24.8,
  squint: 26.6, shudder: [27.2, 29],
  launch: 29.1, run: [29.1, 36.4],
  huss: 31.6,
  boom: 36.4, landPile: 37.2,
  ghostOut: [41.2, 42.0], ghostIn: [42.0, 42.5], rollAway: [42.6, 45], endCard: 42.9, buttEyes: 44.6,
};
