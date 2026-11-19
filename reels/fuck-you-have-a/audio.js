// Sound for "Fuck, You Have a Pimple": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const POPS = [T.pop1, T.chinPop, T.legPop, T.backPop, T.buttPop];
const pops = POPS.flatMap((x, i) => [['squish', x - 0.5, { dur: 0.45, gain: 0.2 }], ['pop', x, { gain: 0.55, pitch: 1.3 - i * 0.12 }], ['splat', x + 0.02, { gain: 0.35 }]]);
const boings = Array.from({ length: 7 }, (_, i) => ['boing', T.land + i * 1.0, { gain: 0.5, pitch: 1 - i * 0.04 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-you-have-a-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.28, duck: 0.6,
    sections: [
      { from: 0.9, to: 13.5, style: 'bouncy' },
      { from: 13.5, to: 19.0, style: 'party' },
      { from: 19.0, to: 23.0, style: 'sad' },
      { from: 23.0, to: 27.5, style: 'march' },
      { from: 27.5, to: 35.5, style: 'party', key: 'D' },
      { from: 38.6, to: 42.5, style: 'bright', key: 'D' },
      { from: 46.0, to: 48.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['scratch', 0.2, { dur: 2.4, rate0: 1.5, rate1: 1.5, gain: 0.15 }],
    ['hit', T.title, { gain: 0.45 }],
    ...pops,
    ['rumble', T.grow[0], { dur: 3.4, gain: 0.35 }],
    ['squish', T.grow[0] + 0.3, { dur: 3.0, gain: 0.25 }],
    ['steps', T.roof, { dur: 2.6, rate: 4, gain: 0.25 }],
    ['whoosh', T.jump, { dur: 1.0, gain: 0.4 }],
    ['slam', T.land, { gain: 0.5 }],
    ...boings,
    ['sparkle', T.basketball, { gain: 0.3 }],
    ['engine', T.truck[0], { dur: 6.5, from: 50, to: 90, gain: 0.3 }],
    ['wahwah', 35.6, { gain: 0.25 }],
    ['pop', T.hit - 0.05, { gain: 0.7, pitch: 0.6 }],
    ['slam', T.hit, { gain: 0.9 }], ['hit', T.hit, { gain: 0.7 }], ['splash', T.hit + 0.05, { gain: 0.5 }],
    ['whoosh', T.fly[0], { dur: 3.4, gain: 0.4 }],
    ['slam', T.crash, { gain: 0.7 }], ['clang', T.crash + 0.1, { gain: 0.3, pitch: 0.8 }],
    ['sparkle', T.mirror, { gain: 0.35 }],
    ['sparkle', T.endCard, { gain: 0.3 }],
    ['pop', T.zit, { gain: 0.35, pitch: 1.6 }],
  ],
});
