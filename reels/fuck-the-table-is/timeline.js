// Beats and cameras for "Fuck, the Table Is Uneven" (brief: briefs/fuck-the-table-is.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-the-table-is-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (11 lines) + the end
const STORY = [0, 3, 7, 11, 15, 20, 24.5, 29, 33.5, 38, 43, 47];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'room' (living room, origin), 'street' (x + 300), 'space' (x + 1000)
export const SHOTS = [
  { from: 0, to: 1.5, world: 'room', fov: 30, cam: [{ p: [1.6, 2.1, 3.2], l: [0.6, 1.5, 1.0] }, { p: [1.7, 2.2, 3.5], l: [0.6, 1.5, 1.0] }] },
  { from: 1.5, to: 3, world: 'room', fov: 32, cam: [{ p: [0.2, 2.9, 7.6], l: [1.4, 1.8, 1.2] }, { p: [0.0, 3.0, 8.4], l: [1.4, 1.8, 1.2] }] },
  { from: 3, to: 7, world: 'room', fov: 32, cam: [{ p: [-1.4, 3.4, 7.8], l: [1.2, 1.4, 1.1] }, { p: [-1.0, 3.2, 7.0], l: [1.2, 1.4, 1.1] }] },
  { from: 7, to: 11, world: 'room', fov: 36, cam: [{ p: [0.4, 4.2, 12.5], l: [0.4, 2.2, 0] }, { p: [0.4, 4.4, 13.5], l: [0.4, 2.4, 0] }] },
  { from: 11, to: 15, world: 'room', fov: 38, cam: [{ p: [0.4, 4.8, 13.5], l: [0.2, 3.0, -1.5] }, { p: [0.6, 5.0, 14.5], l: [0.2, 3.2, -1.5] }] },
  { from: 15, to: 20, world: 'street', fov: 34, cam: [{ p: [6.5, 5.0, 8.5], l: [0, 2.6, -7.5] }, { p: [7.5, 5.4, 10.0], l: [0, 2.8, -7.5] }] },
  { from: 20, to: 24.5, world: 'room', fov: 30, cam: [{ p: [-0.4, 2.2, 1.6], l: [-1.4, 1.9, -2.3] }, { p: [-0.6, 2.1, 1.1], l: [-1.4, 1.9, -2.3] }] },
  { from: 24.5, to: 29, world: 'street', fov: 34, cam: [{ p: [2.4, 4.6, 7.6], l: [1.4, 2.3, -7.0] }, { p: [2.6, 4.4, 6.6], l: [1.4, 2.3, -7.0] }] },
  { from: 29, to: 33.5, world: 'space', fov: 36, cam: [{ p: [0, 3, 30], l: [0, 1, 0] }, { p: [3, 5, 26], l: [0, 1.5, 0] }] },
  { from: 33.5, to: 38, world: 'room', fov: 30, cam: [{ p: [-0.5, 2.25, 1.9], l: [-1.4, 2.0, -2.3] }, { p: [-0.6, 2.2, 1.5], l: [-1.4, 2.0, -2.3] }] },
  { from: 38, to: 39.8, world: 'space', fov: 40, cam: [{ p: [14, 8, 40], l: [18, 2, -5] }, { p: [16, 10, 52], l: [20, 2, -5] }] },
  { from: 39.8, to: 42.2, world: 'space', fov: 50, cam: [{ p: [40, 40, 90], l: [20, 2, -120] }, { p: [80, 160, 200], l: [20, 5, -200] }] },
  { from: 42.2, to: 43, world: 'room', fov: 30, cam: [{ p: [1.6, 2.1, 3.2], l: [0.6, 1.5, 1.0] }, { p: [1.6, 2.1, 3.2], l: [0.6, 1.5, 1.0] }] },
  { from: 43, to: 47, world: 'room', fov: 46, cam: [{ p: [1.1, 3.6, 10.4], l: [1.2, 1.6, 1.2] }, { p: [1.2, 3.65, 10.8], l: [1.3, 1.6, 1.2] }] },
];

// story moments (seconds)
export const T = {
  title: 0.9,
  nails: [3.6, 4.2, 4.8, 5.4], still: 5.6, dust: 6.0, genius: 6.2,
  seesaw: [7.2, 14.6],
  beams: [11.4, 12.2, 13.0, 13.8],
  houseRock: [15.2, 27.8], thumbs: 17.8,
  blink: 22.4,
  bolts: [25.2, 25.9, 26.6, 27.3], quake: 28.4,
  planet: [29, 33.5], moonBump: 31.0,
  turn: [34.0, 35.4],
  chainSun: 38.4, chainGalaxy: 40.2, sway: [40.6, 42.2],
  paper: 43.6, drag: [44.6, 46.4], dust2: 45.0, endCard: 45.3, lookBack: 46.5,
};
