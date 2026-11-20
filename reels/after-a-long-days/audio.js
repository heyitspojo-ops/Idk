// Sound for "After a Long Day's Work, This Freak Climbs in Bed": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const locks = T.locks.map(t => ['clang', t, { gain: 0.35, pitch: 1.6 }]);
const bolts = T.bolts.map(t => ['bang', t, { gain: 0.45 }]);
const bounces = T.bounces.map((t, i) => ['boing', t, { gain: 0.4 - i * 0.08 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/after-a-long-days-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 112, key: 'A', gain: 0.24, duck: 0.6,
    sections: [
      { from: 0, to: 3.5, style: 'sad' },
      { from: 8.5, to: 12, style: 'bouncy' },
      { from: 16, to: 21, style: 'sad' },
      { from: 21, to: 24.5, style: 'party' },
      { from: 32, to: 36, style: 'march' },
      { from: 38, to: 44, style: 'sad', key: 'D' },
      { from: 48, to: 50, style: 'end' },
    ],
  },
  sfx: [
    ['snore', 0.1, { dur: 1.6, gain: 0.35 }],
    ['squeak', T.creepIn[0] + 0.6, { gain: 0.35 }],
    ['hit', T.eyesOpen, { gain: 0.5 }],
    ['ding', T.grin, { gain: 0.25 }],
    ['slam', T.scream, { gain: 0.4 }],
    ['squeak', T.doorOpen, { gain: 0.3, pitch: 0.7 }], ['slam', T.doorShut, { gain: 0.5 }],
    ...locks,
    ['boing', T.bedHop2, { gain: 0.3 }],
    ['snore', T.bedHop2 + 0.7, { dur: 1.2, gain: 0.25 }],
    ['squeak', T.winOpen, { gain: 0.35, pitch: 1.3 }], ['whoosh', T.slither[0], { gain: 0.3 }], ['boing', T.bedHop3 + 0.5, { gain: 0.3 }],
    ['hit', T.kick, { gain: 0.8 }], ['whoosh', T.kick + 0.05, { gain: 0.45 }], ['slam', T.kick + 0.1, { gain: 0.4 }],
    ['whoosh', T.fly[0], { gain: 0.35 }], ...bounces,
    ...bolts,
    ['snore', T.bedHop4 + 0.6, { dur: 1.0, gain: 0.25 }],
    ['scratch', T.dust, { dur: 0.6, rate0: 30, rate1: 30, gain: 0.15 }],
    ['saw', T.cut[0], { dur: T.cut[1] - T.cut[0], gain: 0.35 }],
    ['plop', T.plug + 0.25, { gain: 0.45 }], ['pop', T.peek, { gain: 0.35, pitch: 0.8 }],
    ['whoosh', T.fling, { gain: 0.4 }], ['clang', T.can, { gain: 0.6 }], ['hit', T.can, { gain: 0.4 }],
    ['slap', T.patch, { gain: 0.6 }], ['boing', T.flop + 0.4, { gain: 0.3 }],
    ['slam', T.doorBurst, { gain: 0.8 }], ['whoosh', T.dive[0], { gain: 0.35 }], ['boing', T.dive[1], { gain: 0.35 }],
    ['chirp', T.morning + 0.2, { gain: 0.3, pitch: 1.6 }], ['chirp', T.morning + 0.6, { gain: 0.25, pitch: 1.9 }],
    ['sparkle', T.endCard, { gain: 0.3 }],
    ['ding', T.creepEyes, { gain: 0.4, pitch: 0.6 }],
  ],
});
