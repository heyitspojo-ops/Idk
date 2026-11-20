// Sound for "Fuck These Fuck Ass Nuns Keep Meowing": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const meow = (t, i, g = 0.35) => ['meow', t, { pitch: 0.8 + ((i * 37) % 10) / 14, dur: 0.45 + (i % 3) * 0.12, gain: g }];
const hookMeows = Array.from({ length: 5 }, (_, i) => meow(T.whip + i * 0.12, i, 0.4));
const domino = Array.from({ length: 22 }, (_, i) => meow(T.domino[0] + (i / 22) * (T.domino[1] - T.domino[0]), i + 5, 0.22 + (i / 22) * 0.2));
const morning = Array.from({ length: 10 }, (_, i) => meow(31 + i * 0.35, i + 30, 0.25));
const steps = Array.from({ length: 10 }, (_, i) => ['slam', T.march[0] + i * 0.33, { gain: 0.18 }]);
const brawl = Array.from({ length: 12 }, (_, i) => [i % 3 ? 'slap' : 'hit', T.cloud[0] + 0.2 + i * 0.35, { gain: 0.4 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-these-fuck-ass-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.26, duck: 0.6,
    sections: [
      { from: 3.5, to: 6.5, style: 'sad' },
      { from: 6.5, to: 14.0, style: 'bouncy' },
      { from: 17.5, to: 24.0, style: 'sad' },
      { from: 24.0, to: 30.0, style: 'party' },
      { from: 35.0, to: 40.0, style: 'march', key: 'D' },
      { from: 40.0, to: 45.0, style: 'party', key: 'D' },
      { from: 48.0, to: 50.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['bell', 0.1, { gain: 0.3 }],
    ...hookMeows,
    ['hit', T.title, { gain: 0.45 }],
    ['pop', T.catPop, { gain: 0.4, pitch: 1.4 }], ['sparkle', T.catPop + 0.05, { gain: 0.25 }],
    ['slam', T.doors, { gain: 0.5 }], ['bell', T.doors + 0.1, { gain: 0.25, pitch: 1.2 }],
    ['steps', T.gertIn[0], { dur: 2.8, rate: 4, gain: 0.2 }],
    ['ding', T.smirk, { gain: 0.25 }],
    ['meow', T.bigMeow, { pitch: 0.65, dur: 1.4, gain: 0.7 }], ['hit', T.bigMeow, { gain: 0.5 }],
    ['sparkle', T.preen, { gain: 0.25 }],
    ...domino,
    ['bell', 30.2, { gain: 0.35 }], ['bell', 31.4, { gain: 0.3 }],
    ['scratch', T.clock, { dur: 1.6, rate0: 22, rate1: 22, gain: 0.3 }],
    ...morning,
    ['chirp', T.whistle, { gain: 0.5, pitch: 1.8 }],
    ...steps,
    ['slam', T.kick, { gain: 0.8 }],
    ['rumble', T.cloud[0], { dur: 4.4, gain: 0.4 }],
    ...brawl,
    ['wahwah', T.aftermath + 0.2, { gain: 0.25 }],
    ['meow', T.mew, { pitch: 1.5, dur: 0.3, gain: 0.25 }],
    ['sparkle', T.endCard, { gain: 0.3 }],
    ['meow', T.windowNun, { pitch: 1.0, dur: 0.5, gain: 0.5 }],
  ],
});
