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
  { from: 1.4, to: 3, fov: 32, track: 'cart', cam: [{ p: [-2.2, 2.6, -5.4], l: [0, 1.4, 1.0] }, { p: [-2.4, 3.0, -6.4], l: [0, 1.5, 1.0] }] },
  { from: 3, to: 4.8, fov: 36, cam: [{ p: [1.8, 4.6, 12.6], l: [-1.0, 1.4, 6.0] }, { p: [1.6, 4.4, 12.0], l: [-1.0, 1.4, 6.0] }] },
  { from: 4.8, to: 6.5, fov: 38, cam: [{ p: [0.6, 5.4, 11.4], l: [-0.6, 1.4, 5.5] }, { p: [0.4, 5.0, 10.8], l: [-0.8, 1.4, 5.0] }] },
  { from: 6.5, to: 8.4, fov: 40, cam: [{ p: [1.8, 6.4, 11.4], l: [-0.2, 1.2, 3.6] }, { p: [1.6, 6.0, 10.8], l: [-0.2, 1.2, 3.2] }] },
  { from: 8.4, to: 10.5, fov: 34, cam: [{ p: [2.5, 4.6, 9.6], l: [-0.6, 1.6, 2.6] }, { p: [2.3, 4.2, 8.2], l: [-0.8, 1.6, 2.0] }] },
  { from: 10.5, to: 13.5, fov: 32, cam: [{ p: [2.6, 3.0, 5.0], l: [-0.4, 2.2, 1.5] }, { p: [2.5, 2.9, 4.6], l: [-0.4, 2.2, 1.5] }] },
  { from: 13.5, to: 17, fov: 32, cam: [{ p: [1.6, 2.5, 0.4], l: [0, 2.3, 5.4] }, { p: [1.4, 2.4, 0.9], l: [0, 2.3, 5.4] }] },
  { from: 17, to: 21, fov: 32, cam: [{ p: [2.6, 2.7, 9.0], l: [0, 1.5, 1.6] }, { p: [2.4, 2.6, 8.4], l: [0, 1.5, 1.6] }] },
  { from: 21, to: 23.6, fov: 36, cam: [{ p: [3.0, 2.6, 8.4], l: [0, 1.4, 3.6] }, { p: [2.8, 2.5, 7.8], l: [0, 1.4, 3.6] }] },
  { from: 23.6, to: 26, fov: 34, cam: [{ p: [-2.6, 2.8, -3.6], l: [0, 1.5, 3.6] }, { p: [-2.7, 3.0, -2.6], l: [0, 1.6, 3.8] }] },
  { from: 26, to: 29, fov: 32, cam: [{ p: [1.8, 2.2, 0.0], l: [0, 1.4, 4.4] }, { p: [1.6, 2.1, 0.4], l: [0, 1.4, 4.4] }] },
  { from: 29, to: 31.5, fov: 40, track: 'cart', cam: [{ p: [2.4, 2.6, -3.4], l: [0, 1.4, 1.6] }, { p: [2.3, 2.4, -3.0], l: [0, 1.4, 1.6] }] },
  { from: 31.5, to: 33.5, fov: 34, track: 'cart', cam: [{ p: [1.0, 0.9, -3.4], l: [0, 1.3, 0] }, { p: [0.9, 0.85, -3.2], l: [0, 1.3, 0] }] },
  { from: 33.5, to: 36, fov: 40, track: 'cart', cam: [{ p: [1.1, 2.6, -3.4], l: [0, 1.8, 2.2] }, { p: [1.0, 2.5, -3.2], l: [0, 1.8, 2.2] }] },
  { from: 36, to: 38.4, fov: 40, cam: [{ p: [-3.4, 4.6, -9.6], l: [0.0, 1.2, -18.0] }, { p: [-3.0, 4.2, -10.4], l: [0.0, 1.2, -18.4] }] },
  { from: 38.4, to: 41, fov: 36, cam: [{ p: [2.6, 4.0, -10.6], l: [0.0, 1.4, -18.6] }, { p: [2.4, 3.7, -11.6], l: [0.0, 1.4, -18.8] }] },
  { from: 41, to: 42.6, fov: 36, cam: [{ p: [1.8, 3.8, -9.8], l: [-0.4, 2.0, -16.4] }, { p: [1.8, 3.6, -10.4], l: [-0.4, 2.0, -16.4] }] },
  { from: 42.6, to: 45, fov: 36, cam: [{ p: [2.4, 3.5, -8.0], l: [-0.8, 1.5, -16.6] }, { p: [2.3, 3.3, -7.4], l: [-0.8, 1.5, -16.0] }] },
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
