// Sound for "Fuck, a Bird Keeps Shitting on Me": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel } from './timeline.js';

// Cues below are in story time; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const splatOn = (t, g = 0.55) => [['plop', t - 0.35, { gain: 0.3 }], ['splat', t, { gain: g }]];
const rumbles = Array.from({ length: 6 }, (_, i) => ['fart', T.bloat[0] + 0.5 + i * 0.6, { dur: 0.25 + i * 0.05, wet: 0.2, gain: 0.12 + i * 0.03 }]);

export default reel({
  duration: DURATION,
  vo: { file: 'audio/fuck-a-bird-keeps-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.3, duck: 0.6,
    sections: [
      { from: 0.9, to: 13.5, style: 'bouncy' },
      { from: 13.5, to: 21.0, style: 'sad' },
      { from: 21.0, to: 31.0, style: 'march' },
      { from: 31.0, to: 35.5, style: 'party' },
      { from: 35.5, to: 40.0, style: 'sad' },
      { from: 44.0, to: 48.0, style: 'bright', key: 'D' },
      { from: 48.0, to: 51.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['whoosh', T.glide[0], { dur: 1.0, gain: 0.3 }],
    ['coo', 1.1, { gain: 0.3 }],
    ['hit', T.title, { gain: 0.45 }],
    ...splatOn(T.splat1, 0.7),
    ...T.drops.flatMap(x => splatOn(x + 0.45)),
    ['steps', 3.0, { dur: 3.8, rate: 6, gain: 0.15 }],
    ['slam', T.enter, { gain: 0.4 }],
    ['coo', T.couch, { gain: 0.35 }],
    ['whoosh', T.hop, { dur: 0.5, gain: 0.3 }],
    ...splatOn(T.splatHouse),
    ['coo', T.shrug, { gain: 0.3 }],
    ['plop', T.dropLamp + 0.5, { gain: 0.3 }],
    ['slam', T.wifeIn, { gain: 0.35 }],
    ['hit', T.bubble, { gain: 0.4 }],
    ['scratch', T.dig[0], { dur: 2.0, rate0: 3, rate1: 3, gain: 0.3 }],
    ['slam', T.hatch, { gain: 0.6 }],
    ['scratch', T.vent, { dur: 0.8, rate0: 12, rate1: 16, gain: 0.25 }],
    ['coo', T.ventOut, { gain: 0.35 }],
    ['plop', T.mouth - 0.4, { gain: 0.35 }],
    ['splat', T.mouth, { gain: 0.6 }],
    ['gag', T.gag, { gain: 0.5 }],
    ['pop', T.pour[0], { gain: 0.3, pitch: 0.7 }],
    ['bubbles', T.pour[0] + 0.1, { dur: 1.1, n: 8, gain: 0.2 }],
    ['scratch', T.peck[0], { dur: 2.0, rate0: 9, rate1: 9, gain: 0.15 }],
    ...rumbles,
    ['fart', T.boom - 0.05, { dur: 1.4, wet: 1.0, gain: 0.8 }],
    ['slam', T.boom, { gain: 0.9 }],
    ['splash', T.boom + 0.1, { gain: 0.6 }],
    ['whoosh', T.launch, { dur: 0.8, gain: 0.5 }],
    ['fart', T.fly[0], { dur: 1.8, wet: 0.6, gain: 0.35 }],
    ['whoosh', T.fly[0] + 0.2, { dur: 1.6, gain: 0.35 }],
    ['coo', T.land, { gain: 0.35 }],
    ...T.wifeSplats.flatMap(x => splatOn(x, 0.5)),
    ['cheer', 46.4, { dur: 1.5, n: 10, gain: 0.25, pitch: 1.4 }],
    ['sparkle', T.sweet, { gain: 0.4 }],
    ['plop', T.finalDrop + 0.2, { gain: 0.4 }],
    ['splat', 50.95, { gain: 0.7 }],
  ],
});
