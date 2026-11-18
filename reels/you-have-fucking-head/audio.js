// Sound for You Have Fucking Head Lice: VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

const houses = Array.from({ length: 6 }, (_, i) => ['pop', T.houses[0] + (i / 5) * (T.houses[1] - T.houses[0]), { pitch: 1 + i * 0.12, gain: 0.35, pan: (i - 2.5) * 0.15 }]);
const sparkles = Array.from({ length: 5 }, (_, i) => ['pop', T.sparkle + i * 0.12, { pitch: 2 + i * 0.2, gain: 0.15 }]);

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});

export default reel({
  duration: DURATION,
  vo: { file: 'audio/you-have-fucking-head-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.32, duck: 0.6,
    sections: [
      { from: 0.9, to: 13.0, style: 'bouncy' },
      { from: 13.0, to: 19.0, style: 'party' },
      { from: 19.0, to: 30.0, style: 'march' },
      { from: 30.0, to: 33.4, style: 'sad' },
      { from: 33.4, to: 42.5, style: 'bright', key: 'D' },
      { from: 42.5, to: 45.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['pop', T.louseUp, { gain: 0.45 }],
    ['chirp', 0.55, { gain: 0.12 }],
    ['hit', T.title, { gain: 0.55 }],
    ['whoosh', T.nailSlam - 0.3, { dur: 0.3, gain: 0.5 }],
    ['slam', T.nailSlam, { gain: 0.8 }],
    ['scratch', 3.1, { dur: 4.8, rate0: 3, rate1: 7.5, gain: 0.32 }],
    ['whoosh', T.nailSweep[0], { dur: 1.2, gain: 0.35 }],
    ['pop', T.wheee, { gain: 0.35, pitch: 1.3 }],
    ['cheer', T.wheee, { dur: 3.5, n: 20, gain: 0.3 }],
    ['squish', T.latherBath, { dur: 2.4, gain: 0.22 }],
    ['splash', T.poolParty, { gain: 0.45 }],
    ['bubbles', T.poolParty + 0.3, { dur: 3.2, n: 22, gain: 0.25 }],
    ['whoosh', T.combDrag[0], { dur: 1.4, gain: 0.35 }],
    ...houses,
    ['ding', T.flag, { gain: 0.3 }],
    ['cheer', T.speech + 0.4, { dur: 4.4, n: 60, gain: 0.32 }],
    ['wahwah', 31.9, { gain: 0.3 }],
    ['ding', T.bulb, { gain: 0.45 }],
    ['pop', T.mannequin, { gain: 0.4 }],
    ['whoosh', T.point, { dur: 0.3, gain: 0.25 }],
    ['pop', T.sign, { gain: 0.35, pitch: 1.2 }],
    ['steps', T.march[0], { dur: 3.2, rate: 9, gain: 0.25 }],
    ['chirp', T.hatTip, { gain: 0.25, pitch: 1.2 }],
    ['sparkle', T.sparkle, { gain: 0.35 }],
    ...sparkles,
    ['pop', T.peek, { gain: 0.3, pitch: 1.5 }],
    ['chirp', T.peek + 0.15, { gain: 0.15, pitch: 1.4 }],
  ],
});
