// Beats and cameras for "Your Reflection in the Mirror" (brief: briefs/your-reflection-in-the.md).
// All times are STORY time (the brief's table). The reel is tightened to the VO with voWarp:
// each beat starts just before its line in audio/your-reflection-in-the-vo.lines.json.
import placed from '../../audio/your-reflection-in-the-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (11 lines) + the end
const STORY = [0, 3.0, 6.0, 8.3, 9.5, 14.0, 20.0, 25.5, 31.0, 34.0, 41.0, 45.0];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// cam: [from, to] { p, l } in the shot's world; 'bath' = bathroom, 'sea' = ocean (offset in scene.js)
export const SHOTS = [
  { id: 1, from: 0, to: 3, world: 'bath', fov: 28, cam: [{ p: [-2.6, 4.4, 8.0], l: [0.2, 2.5, -2.6] }, { p: [-2.2, 4.2, 7.0], l: [0.2, 2.5, -2.6] }] },
  { id: 2, from: 3, to: 6, world: 'bath', fov: 30, cam: [{ p: [2.8, 3.6, 3.8], l: [0.1, 2.6, -3.0] }, { p: [2.5, 3.4, 3.2], l: [0.1, 2.6, -3.0] }] },
  { id: 3, from: 6, to: 8.3, world: 'bath', fov: 32, cam: [{ p: [5.6, 2.8, 4.6], l: [0.2, 1.6, -1.0] }, { p: [5.2, 2.6, 4.2], l: [0.2, 1.5, -1.0] }] },
  { id: 4, from: 8.3, to: 9.5, world: 'bath', fov: 58, cam: [{ p: [1.3, 0.7, -2.2], l: [0.2, 1.4, 0.4] }, { p: [1.25, 0.7, -2.15], l: [0.2, 1.4, 0.4] }] },
  { id: 5, from: 9.5, to: 14, world: 'bath', fov: 30, cam: [{ p: [5.4, 4.0, 8.8], l: [0.2, 2.3, -1.2] }, { p: [4.8, 3.8, 7.8], l: [0.2, 2.3, -1.2] }] },
  { id: 6, from: 14, to: 15.6, world: 'bath', fov: 32, cam: [{ p: [-6.0, 3.8, 8.0], l: [0.4, 2.2, -1.0] }, { p: [-5.6, 3.6, 7.4], l: [0.4, 2.2, -1.0] }] },
  { id: 7, from: 15.6, to: 17.2, world: 'bath', fov: 30, cam: [{ p: [7.6, 3.3, 7.4], l: [0.3, 2.0, -1.0] }, { p: [7.2, 3.2, 7.0], l: [0.3, 2.0, -1.0] }] },
  { id: 8, from: 17.2, to: 20, world: 'bath', fov: 32, cam: [{ p: [-4.2, 3.0, 5.4], l: [0.2, 1.8, -1.6] }, { p: [-3.6, 2.9, 4.8], l: [0.2, 2.0, -1.8] }] },
  { id: 9, from: 20, to: 25.5, world: 'sea', fov: 34, track: true, cam: [{ p: [10, 6.5, 6], l: [0, 1.0, 0] }, { p: [8, 5.0, 8], l: [0, 1.2, 0] }] },
  { id: 10, from: 25.5, to: 27.5, world: 'sea', fov: 34, track: true, cam: [{ p: [2.5, 6.2, 0.7], l: [1.9, -0.4, -0.45] }, { p: [2.5, 6.4, 0.6], l: [1.9, -0.4, -0.45] }] },
  { id: 11, from: 27.5, to: 31, world: 'sea', fov: 36, track: true, cam: [{ p: [4, 5, 5], l: [0.5, 0, -0.4] }, { p: [9, 12, 11], l: [0, 0, 0] }] },
  { id: 12, from: 31, to: 34, world: 'sea', fov: 32, track: true, cam: [{ p: [2.2, 2.8, 4.6], l: [0, 1.6, -0.6] }, { p: [1.9, 2.7, 4.0], l: [0, 1.7, -0.6] }] },
  { id: 13, from: 34, to: 35.8, world: 'sea', fov: 34, track: true, cam: [{ p: [4.2, 3.0, 4.0], l: [0.6, 1.2, -0.5] }, { p: [3.8, 2.8, 3.6], l: [0.6, 1.2, -0.5] }] },
  { id: 14, from: 35.8, to: 41, world: 'deep', fov: 38, cam: [{ p: [0, -3.3, 10.5], l: [0, -3.7, 0] }, { p: [0, -3.1, 9.5], l: [0, -3.7, -1] }] },
  { id: 15, from: 41, to: 44.4, world: 'sea', fov: 32, track: true, sunset: true, cam: [{ p: [3.4, 2.6, 5.2], l: [0, 1.4, -0.4] }, { p: [3.9, 2.9, 6.2], l: [0, 1.5, -0.4] }] },
  { id: 16, from: 44.4, to: 45, world: 'sea', fov: 34, track: true, sunset: true, cam: [{ p: [2.5, 6.2, 0.7], l: [1.9, -0.4, -0.45] }, { p: [2.5, 6.3, 0.7], l: [1.9, -0.4, -0.45] }] },
];

// story moments (seconds)
export const T = {
  wave: 0.3, fold: 1.0, title: 0.9, smirk: 1.6,
  lean: 3.4, poke: 4.6,
  kick: [6.5, 7.1], impact: 7.1, bonk: 7.15,
  fuck: 8.4,
  hammer: [9.9, 10.5], tink: 10.5, glint: 12.4,
  sledge: [14.2, 14.8], saw: [15.8, 16.6], snap: 16.6, bomb: 17.3, boom: 17.9, clear: 18.8, nothing: 18.6,
  sail: [20, 25.5], peek: 25.7, ring: 27.8,
  mirrorUp: 34.4, duelKick: 37.0, tunnel: 37.6, crack: 38.9, shatter: 39.5,
  shades: 41.2, endCard: 41.6, thumbs: 44.4,
};
