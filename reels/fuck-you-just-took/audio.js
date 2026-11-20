// Sound for "Fuck, You Just Took a Shit at Your Girlfriend's House": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const splats = Array.from({ length: 8 }, (_, i) => ['splat', T.launch + 0.2 + i * 0.12, { gain: 0.3 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-you-just-took-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.28, duck: 0.6,
    sections: [
      { from: 0.9, to: 10.5, style: 'bouncy' },
      { from: 10.5, to: 20.5, style: 'march' },
      { from: 20.5, to: 29.0, style: 'sad' },
      { from: 33.0, to: 40.5, style: 'party' },
      { from: 40.5, to: 49.5, style: 'march', key: 'D' },
      { from: 52.4, to: 56.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['clang', T.press1, { gain: 0.2, pitch: 2 }], ['flush', T.press1 + 0.1, { dur: 2.0, gain: 0.45 }],
    ['bubbles', 1.8, { dur: 1.4, n: 8, gain: 0.25 }],
    ['hit', T.title, { gain: 0.45 }],
    ['clang', T.press2, { gain: 0.2, pitch: 2 }], ['flush', T.press2 + 0.1, { dur: 1.6, gain: 0.4 }],
    ['squish', T.overflow[0], { dur: 2.2, gain: 0.35 }], ['splash', T.overflow[0] + 0.4, { gain: 0.35 }],
    ['whoosh', T.plunger, { dur: 0.4, gain: 0.3 }],
    ...T.bangs.map(x => ['bang', x, { gain: 0.7 }]),
    ['squish', T.plunge, { dur: 0.4, gain: 0.4 }],
    ['whoosh', T.suck[0], { dur: 0.9, gain: 0.4 }], ['plop', T.suck[1], { gain: 0.5 }],
    ['ding', T.bulb, { gain: 0.45 }],
    ['slam', T.door, { gain: 0.8 }],
    ['hiss', T.rage, { dur: 1.8, gain: 0.35 }],
    ['fart', T.sit[1] - 0.2, { dur: 1.2, wet: 0.8, gain: 0.45 }],
    ['rumble', 27.8, { dur: 1.4, gain: 0.5 }],
    ['fart', T.launch - 0.15, { dur: 1.4, wet: 1.0, gain: 0.7 }],
    ['slam', T.boom, { gain: 0.9 }], ['hit', T.boom, { gain: 0.7 }],
    ['whoosh', T.launch + 0.2, { dur: 2.6, gain: 0.4 }],
    ...splats,
    ['sparkle', T.mayor, { gain: 0.3 }],
    ['pop', T.dots, { gain: 0.3 }],
    ['rumble', T.tornado[0], { dur: 4.6, gain: 0.5 }],
    ['whoosh', T.tornado[0] + 0.5, { dur: 4.0, gain: 0.35 }],
    ['bubbles', T.rain, { dur: 3.0, n: 24, gain: 0.25 }],
    ['whoosh', T.detroit[0], { dur: 3.0, gain: 0.3 }],
    ['whoosh', T.drop[0], { dur: 1.1, gain: 0.45 }], ['slam', T.drop[1], { gain: 0.7 }],
    ['clang', T.flushFinal, { gain: 0.2, pitch: 2 }], ['flush', T.flushFinal + 0.1, { dur: 2.0, gain: 0.55 }],
    ['sparkle', T.flushFinal + 0.6, { gain: 0.4 }],
    ['sparkle', T.endCard, { gain: 0.3 }],
    ['rumble', T.gurgle, { dur: 0.6, gain: 0.35 }],
  ],
});
