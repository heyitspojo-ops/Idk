// Sound for "Fuck, This Shopping Cart": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const tpPops = Array.from({ length: 8 }, (_, i) => ['pop', T.boom + 0.2 + i * 0.09, { pitch: 0.8 + (i % 4) * 0.15, gain: 0.25 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-this-shopping-cart-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.3, duck: 0.6,
    sections: [
      { from: 0.9, to: 10.5, style: 'bouncy' },
      { from: 13.5, to: 21.0, style: 'march' },
      { from: 21.0, to: 26.0, style: 'bouncy', key: 'D' },
      { from: 26.0, to: 29.0, style: 'sad' },
      { from: 29.0, to: 36.4, style: 'party' },
      { from: 41.0, to: 45.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['squeak', 0, { dur: 2.6, rate: 9, gain: 0.5 }],
    ['hit', T.title, { gain: 0.45 }],
    ['whoosh', T.swerve, { dur: 0.5, gain: 0.3 }],
    ['squeak', T.yank[0], { dur: 2.0, rate: 8, gain: 0.4 }],
    ['slam', T.tumble, { gain: 0.35 }],
    ['pop', T.tumble + 0.3, { gain: 0.25 }],
    ['squeak', T.drift[0], { dur: 3.0, rate: 6, gain: 0.35 }],
    ['pop', T.bump, { gain: 0.4, pitch: 0.7 }],
    ['whoosh', T.slap - 0.25, { dur: 0.25, gain: 0.35 }],
    ['slap', T.slap, { gain: 0.8 }],
    ['whoosh', T.slap + 0.05, { dur: 0.45, gain: 0.3 }],
    ['ding', T.slap + 0.4, { gain: 0.25 }],
    ['ding', T.eyes, { gain: 0.3 }],
    ['squeak', T.backUp[0], { dur: 1.0, rate: 7, gain: 0.35 }],
    ['rev', T.rev[0], { dur: 0.7, gain: 0.45 }],
    ['whoosh', T.ram - 0.25, { dur: 0.3, gain: 0.4 }],
    ['slam', T.ram, { gain: 0.8 }],
    ['scratch', T.inflate[0], { dur: 2.2, rate0: 2, rate1: 4, gain: 0.25 }],
    ['pop', T.inflate[1], { gain: 0.35, pitch: 0.6 }],
    ['sparkle', T.proud, { gain: 0.3 }],
    ['rev', T.shudder[0], { dur: 1.6, gain: 0.35 }],
    ['rev', T.launch, { dur: 1.2, gain: 0.55 }],
    ['whoosh', T.launch + 0.2, { dur: 2.5, gain: 0.35 }],
    ['steps', T.huss, { dur: 2.0, rate: 10, gain: 0.25 }],
    ['whoosh', 33.6, { dur: 2.6, gain: 0.3 }],
    ['slam', T.boom, { gain: 0.9 }],
    ['hit', T.boom, { gain: 0.7 }],
    ...tpPops,
    ['cheer', T.landPile + 0.3, { dur: 1.0, n: 6, gain: 0.15 }],
    ['ding', T.ghostOut[0], { gain: 0.3 }],
    ['whoosh', T.ghostIn[0], { dur: 0.5, gain: 0.35 }],
    ['pop', T.ghostIn[1], { gain: 0.4, pitch: 0.7 }],
    ['squeak', T.ghostIn[1] + 0.1, { dur: 2.4, rate: 9, gain: 0.5 }],
    ['sparkle', T.endCard, { gain: 0.35 }],
    ['ding', T.buttEyes, { gain: 0.35 }],
  ],
});
