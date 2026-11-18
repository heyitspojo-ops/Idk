// Sound for Your Reflection in the Mirror: VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const tunnelPops = Array.from({ length: 8 }, (_, i) => ['pop', T.tunnel + i * 0.1, { pitch: 1 + i * 0.1, gain: 0.25 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/your-reflection-in-the-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.3, duck: 0.6,
    sections: [
      { from: 0.9, to: 9.5, style: 'bouncy' },
      { from: 9.5, to: 20.0, style: 'party' },
      { from: 20.0, to: 25.5, style: 'bright', key: 'D' },
      { from: 25.5, to: 34.0, style: 'sad' },
      { from: 34.0, to: 41.0, style: 'march' },
      { from: 41.0, to: 45.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['chirp', T.wave, { gain: 0.12 }],
    ['hit', T.title, { gain: 0.5 }],
    ['ding', T.smirk, { gain: 0.15 }],
    ['pop', T.poke, { gain: 0.3, pitch: 0.8 }],
    ['whoosh', T.kick[0], { dur: 0.6, gain: 0.45 }],
    ['slam', T.impact, { gain: 0.8 }],
    ['ding', T.bonk, { gain: 0.3 }],
    ['cheer', T.impact + 0.2, { dur: 1.6, n: 12, gain: 0.2 }],
    ['whoosh', T.hammer[0], { dur: 0.5, gain: 0.35 }],
    ['ding', T.tink, { gain: 0.5 }],
    ['sparkle', T.glint, { gain: 0.3 }],
    ['whoosh', T.sledge[0], { dur: 0.5, gain: 0.4 }],
    ['slam', T.sledge[1], { gain: 0.6 }],
    ['ding', T.sledge[1] + 0.02, { gain: 0.4 }],
    ['scratch', T.saw[0], { dur: 0.8, rate0: 14, rate1: 18, gain: 0.45 }],
    ['pop', T.snap, { gain: 0.45, pitch: 0.7 }],
    ['pop', T.bomb, { gain: 0.35 }],
    ['scratch', T.bomb + 0.1, { dur: 0.5, rate0: 20, rate1: 25, gain: 0.2 }],
    ['slam', T.boom, { gain: 0.9 }],
    ['hit', T.boom, { gain: 0.7 }],
    ['whoosh', T.boom + 0.2, { dur: 1.0, gain: 0.3 }],
    ['sparkle', T.clear + 0.2, { gain: 0.3 }],
    ['splash', T.sail[0], { gain: 0.35 }],
    ['bubbles', T.sail[0] + 0.5, { dur: 4.5, n: 12, gain: 0.12 }],
    ['splash', T.peek, { gain: 0.25 }],
    ['cheer', T.peek + 0.1, { dur: 2.0, n: 18, gain: 0.25 }],
    ['cheer', T.ring, { dur: 6.0, n: 60, gain: 0.3 }],
    ['ding', T.mirrorUp, { gain: 0.35 }],
    ['whoosh', T.duelKick - 0.3, { dur: 0.4, gain: 0.4 }],
    ['slam', T.duelKick, { gain: 0.6 }],
    ...tunnelPops,
    ['hit', T.crack, { gain: 0.5 }],
    ['splash', T.shatter, { gain: 0.5 }],
    ['sparkle', T.shatter + 0.1, { gain: 0.45 }],
    ['sparkle', T.endCard, { gain: 0.35 }],
    ['chirp', T.thumbs, { gain: 0.2, pitch: 1.3 }],
  ],
});
