// Beats and cameras for "Fuck, You Just Took a Shit at Your Girlfriend's House" (brief: briefs/fuck-you-just-took.md).
// Times are STORY time (the brief's table); voWarp tightens the reel to the VO lines.
import placed from '../../audio/fuck-you-just-took-vo.lines.json' with { type: 'json' };
import heard from './vo-timing.json' with { type: 'json' };
import { voWarp } from '../../bucket-shared/vo-warp.js';

// one knot per VO line start (15 lines) + the end
const STORY = [0, 3.5, 7.5, 10.5, 14, 17.5, 20.5, 24.5, 29, 33, 37, 40.5, 45.5, 49.5, 53.5, 56];
export const { toStory, toReel, duration: DURATION } = voWarp(placed, STORY);

// worlds: 'bath' (origin), 'street' (x + 400), 'map' (x + 700). Bathroom: back wall z -4.5, left wall x -6, toilet at (0.2, 0, -3.75).
export const SHOTS = [
  { from: 0, to: 3.5, world: 'bath', fov: 32, cam: [{ p: [1.4, 3.0, 0.4], l: [0.2, 1.1, -3.5] }, { p: [1.2, 2.8, 0.0], l: [0.2, 1.1, -3.5] }] },
  { from: 3.5, to: 7.5, world: 'bath', fov: 36, cam: [{ p: [3.6, 4.6, 6.0], l: [0.4, 1.0, -2.2] }, { p: [3.2, 4.2, 5.2], l: [0.4, 1.0, -2.2] }] },
  { from: 7.5, to: 10.5, world: 'bath', fov: 32, cam: [{ p: [3.6, 2.8, 2.2], l: [0.8, 1.8, -2.6] }, { p: [3.3, 2.7, 1.8], l: [0.8, 1.8, -2.6] }] },
  { from: 10.5, to: 14, world: 'bath', fov: 34, cam: [{ p: [0.4, 2.8, 2.6], l: [-5.6, 2.2, -0.2] }, { p: [0.0, 2.7, 2.2], l: [-5.6, 2.2, -0.2] }] },
  { from: 14, to: 17.5, world: 'bath', fov: 34, cam: [{ p: [3.0, 4.4, 2.0], l: [0.3, 1.5, -3.4] }, { p: [2.8, 4.2, 1.6], l: [0.3, 1.4, -3.4] }] },
  { from: 17.5, to: 20.5, world: 'bath', fov: 34, cam: [{ p: [2.6, 3.1, 3.8], l: [0.9, 2.9, -1.5] }, { p: [2.4, 3.05, 3.4], l: [0.9, 2.95, -1.5] }] },
  { from: 20.5, to: 24.5, world: 'bath', fov: 36, cam: [{ p: [2.6, 3.4, 4.4], l: [-3.4, 2.2, -0.6] }, { p: [2.0, 3.2, 3.6], l: [-3.2, 2.4, -0.6] }] },
  { from: 24.5, to: 29, world: 'bath', fov: 36, cam: [{ p: [3.4, 3.8, 4.6], l: [-0.6, 1.8, -2.6] }, { p: [3.0, 3.6, 4.0], l: [-0.2, 1.8, -3.0] }] },
  { from: 29, to: 33, world: 'street', fov: 40, cam: [{ p: [6, 4, 10], l: [0, 6, -8] }, { p: [7, 5, 12], l: [0, 12, -8] }] },
  { from: 33, to: 37, world: 'bath', fov: 40, cam: [{ p: [4.6, 4.6, 6.6], l: [1.0, 1.6, -1.4] }, { p: [4.2, 4.3, 5.9], l: [1.1, 1.7, -1.4] }] },
  { from: 37, to: 40.5, world: 'bath', fov: 34, cam: [{ p: [1.8, 3.0, 3.6], l: [-5.0, 2.2, -0.2] }, { p: [1.4, 2.9, 3.0], l: [-5.0, 2.2, -0.2] }] },
  { from: 40.5, to: 45.5, world: 'street', fov: 46, cam: [{ p: [10, 6, 16], l: [0, 8, -8] }, { p: [14, 10, 24], l: [0, 10, -8] }] },
  { from: 45.5, to: 49.5, world: 'map', fov: 44, cam: [{ p: [0.6, 30, 16], l: [0.2, 0, 0.4] }, { p: [1.2, 29, 15.5], l: [0.8, 0, 0.2] }] },
  { from: 49.5, to: 56, world: 'bath', fov: 38, cam: [{ p: [3.6, 4.2, 6.4], l: [0.2, 1.6, -2.4] }, { p: [3.2, 3.9, 5.8], l: [0.2, 1.6, -2.6] }] },
];

// story moments (seconds)
export const T = {
  press1: 0.4, title: 0.9,
  press2: 4.0, overflow: [4.2, 4.6], spread: [4.55, 5.3],
  plunger: 7.8,
  bangs: [10.8, 11.3, 11.8, 12.6, 13.1],
  plunge: 15.0, suck: [15.3, 16.2],
  bulb: 18.6,
  door: 20.8, dadIn: [20.8, 21.4], rage: 21.6,
  crunch: 25.0, shove: 26.2, sit: [26.4, 27.6], noTime: 25.4,
  launch: 29.4, boom: 29.5,

  gf: 37.4, dots: 38.4,
  tornado: [40.6, 41.8], rain: 41.2,
  detroit: [45.6, 48.8],
  drop: [49.8, 50.4], drain: [50.5, 51.3], flushFinal: 51.4,
  endCard: 53.8, gurgle: 55.4,
};

// the MAYOR sash pops exactly on "and you're the fucking mayor" (word timing from the VO, line 10)
const l10 = heard.find(l => l.id === 10), w = l10.words.findIndex(x => /^you/i.test(x.w) && l10.words[l10.words.indexOf(x) - 1]?.w.match(/^and/i));
T.mayor = toStory((w > 0 ? l10.words[w - 1] : l10.words[Math.floor(l10.words.length / 2)]).start);
