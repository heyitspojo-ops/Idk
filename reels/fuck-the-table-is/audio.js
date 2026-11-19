// Sound for "Fuck, the Table Is Uneven": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const clacks = Array.from({ length: 6 }, (_, i) => ['pop', 0.1 + i * 0.35, { pitch: 0.55, gain: 0.35 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-the-table-is-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.3, duck: 0.6,
    sections: [
      { from: 0.9, to: 7.0, style: 'bouncy' },
      { from: 7.0, to: 15.0, style: 'march' },
      { from: 15.0, to: 20.0, style: 'party' },
      { from: 20.0, to: 24.5, style: 'sad' },
      { from: 24.5, to: 33.5, style: 'march', key: 'D' },
      { from: 33.5, to: 38.0, style: 'sad' },
      { from: 38.0, to: 43.0, style: 'bright', key: 'D' },
      { from: 43.0, to: 47.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ...clacks,
    ['hit', T.title, { gain: 0.45 }],
    ...T.nails.map(x => ['clang', x, { gain: 0.45, pitch: 1.2 }]),
    ['sparkle', T.genius, { gain: 0.3 }],
    ['rumble', T.seesaw[0], { dur: 3.5, gain: 0.35 }],
    ['squeak', T.seesaw[0] + 0.3, { dur: 3.0, rate: 2, gain: 0.25 }],
    ...T.beams.map(x => ['clang', x, { gain: 0.4, pitch: 0.7 }]),
    ['scratch', T.beams[0], { dur: 2.8, rate0: 18, rate1: 18, gain: 0.2 }],
    ['rumble', T.houseRock[0], { dur: 4.6, gain: 0.45 }],
    ['ding', T.thumbs, { gain: 0.3 }],
    ['pop', T.blink + 0.45, { gain: 0.15, pitch: 1.6 }],
    ...T.bolts.map(x => ['clang', x, { gain: 0.5, pitch: 0.55 }]),
    ['rumble', T.quake, { dur: 5.0, gain: 0.6 }],
    ['slam', T.quake, { gain: 0.5 }],
    ['hit', T.moonBump, { gain: 0.4 }],
    ['rumble', T.turn[0], { dur: 2.0, gain: 0.2 }],
    ['ding', T.turn[1], { gain: 0.25 }],
    ['clang', T.chainSun, { gain: 0.45, pitch: 0.5 }],
    ['whoosh', T.chainGalaxy - 0.3, { dur: 0.8, gain: 0.35 }],
    ['clang', T.chainGalaxy, { gain: 0.5, pitch: 0.4 }],
    ['sparkle', T.sway[1], { gain: 0.35 }],
    ['pop', T.paper, { gain: 0.3 }],
    ['scratch', T.drag[0], { dur: 1.8, rate0: 4, rate1: 4, gain: 0.3 }],
    ['sparkle', T.endCard, { gain: 0.35 }],
    ['pop', T.lookBack + 0.3, { gain: 0.15, pitch: 1.6 }],
  ],
});
