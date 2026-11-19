// Beats and cameras for "You're Racing a Punk Ass Honda Civic" (brief: briefs/youre-racing-a-punk.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/youre-racing-a-punk-vo.lines.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// A 3 s "he's LAUGHING at me" beat (VO line 16) is inserted at story 26.5. SHOTS and T below stay in the
// original story clock ("old"); toStory returns the new clock, toOld maps it back (null inside the insert).
export const INSERT = { at: 26.5, len: 3 };
// one knot per VO line start (16 lines, in VO order) + the end — new clock
const STORY = [0, 3.5, 7, 10, 13.5, 17, 22, 26.5, 29.5, 34, 38, 42.5, 46.5, 50, 55, 60, 63];
const warp = voWarp(placed, STORY);
export const toStory = warp.toStory, DURATION = warp.duration;
export const toOld = n => (n < INSERT.at ? n : n < INSERT.at + INSERT.len ? null : n - INSERT.len);
export const toReel = old => warp.toReel(old >= INSERT.at ? old + INSERT.len : old);
export const atNew = n => warp.toReel(n); // place a cue by NEW story time (e.g. inside the insert)

// worlds: 'strip' (origin), 'map' (x + 500), 'swamp' (x + 800). track: 'you' | 'civic' -> cam offsets from that car
export const SHOTS = [
  { from: 0, to: 3.5, world: 'strip', fov: 34, cam: [{ p: [0.6, 1.3, 9.5], l: [0, 1.4, 0] }, { p: [0.4, 1.2, 8.6], l: [0, 1.5, 0] }] },
  { from: 3.5, to: 7, world: 'strip', fov: 38, track: 'you', cam: [{ p: [4.6, 3.0, -6.0], l: [-0.6, 1.2, 2.0] }, { p: [4.4, 3.2, -6.6], l: [-0.8, 1.2, 3.0] }] },
  { from: 7, to: 10, world: 'strip', fov: 30, track: 'you', cam: [{ p: [2.8, 2.0, 1.6], l: [0.4, 1.5, -0.2] }, { p: [2.6, 1.9, 1.3], l: [0.4, 1.5, -0.2] }] },
  { from: 10, to: 13.5, world: 'strip', fov: 36, track: 'you', cam: [{ p: [6.5, 2.0, 4.6], l: [0.6, 0.8, 0.6] }, { p: [6.4, 2.0, 4.2], l: [0.6, 0.8, 0.6] }] },
  { from: 13.5, to: 17, world: 'strip', fov: 34, cam: [{ p: [14.5, 3.6, 9.0], l: [9, 1.2, 2] }, { p: [14.0, 3.4, 8.0], l: [9, 1.2, 2] }] },
  { from: 17, to: 20.4, world: 'strip', fov: 34, cam: [{ p: [8.0, 2.8, 6.4], l: [2.6, 1.4, 1.4] }, { p: [7.6, 2.7, 6.0], l: [2.6, 1.4, 1.4] }] },
  { from: 20.4, to: 22, world: 'strip', fov: 36, track: 'you', cam: [{ p: [5.5, 2.4, -3.0], l: [0, 1.0, 1.0] }, { p: [5.5, 2.4, -3.5], l: [0, 1.0, 1.0] }] },
  { from: 22, to: 26.5, world: 'strip', fov: 36, track: 'you', cam: [{ p: [7.5, 4.6, 8.5], l: [0, 1.6, 0] }, { p: [7.0, 4.2, 7.5], l: [0, 1.6, 0] }] },
  { from: 26.5, to: 31, world: 'strip', fov: 40, cam: [{ p: [16.5, 4.4, 10.5], l: [9, 4.2, 2] }, { p: [16.0, 4.2, 9.6], l: [9, 2.8, 2] }] },
  { from: 31, to: 35, world: 'strip', fov: 44, track: 'you', cam: [{ p: [0.45, 3.0, -3.4], l: [0.3, 2.4, 3.0] }, { p: [1.6, 2.8, -3.0], l: [0.5, 2.2, 2.0] }] },
  { from: 35, to: 39.5, world: 'strip', fov: 36, track: 'you', cam: [{ p: [7.0, 2.6, 3.0], l: [-0.6, 1.4, 1.2] }, { p: [7.2, 2.8, 3.4], l: [-0.6, 1.4, 1.2] }] },
  { from: 39.5, to: 43.5, world: 'strip', fov: 40, track: 'you', cam: [{ p: [7, 2.5, -6], l: [-0.6, 1.5, 0.5] }, { p: [9, 4, -9], l: [0, 1.0, 0] }] },
  { from: 43.5, to: 47, world: 'map', fov: 44, cam: [{ p: [0.6, 30, 16], l: [0.2, 0, 0.6] }, { p: [1.2, 29, 15.5], l: [0.6, 0, 0.8] }] },
  { from: 47, to: 52, world: 'swamp', fov: 36, cam: [{ p: [6.5, 4.0, 10.5], l: [0, 1.0, 0] }, { p: [6.0, 3.8, 9.5], l: [0, 1.2, 0] }] },
  { from: 52, to: 57, world: 'swamp', fov: 40, cam: [{ p: [1.6, 4.6, 11.5], l: [-1.6, 1.0, -1.2] }, { p: [1.4, 4.4, 10.8], l: [-1.6, 1.0, -1.2] }] },
  { from: 57, to: 60, world: 'swamp', fov: 36, cam: [{ p: [4.6, 3.6, 8.0], l: [0, 2.2, 0] }, { p: [5.0, 3.8, 8.6], l: [0, 2.3, 0] }] },
];

// story moments (seconds)
export const T = {
  title: 0.9, smirk: 1.4, red: 1.8, yellow: 2.6, green: 3.6,
  floor: 7.6, snail: 10.4, civicWins: 12.2,
  doors: [14.0, 14.6, 15.2, 15.8],
  race2: 17.2, nos: 18.6, launch2: 20.5, boom: 22.6,
  crane: [27.0, 29.0], peek: 33.2,
  race3: 35.4, launch3: 36.2, twist: [37.0, 39.4],
  smash: 40.2, fly: [40.4, 43.5],
  arc: [43.6, 46.8],
  splash: 47.3, gator: 49.0,
  wreck: 52.4, trophy: 54.0,
  endCard: 57.3, meep: 59.4,
};
