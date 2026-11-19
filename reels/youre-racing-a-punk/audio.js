// Sound for "You're Racing a Punk Ass Honda Civic": VO + original toy score + SFX on the story moments in timeline.js.
import { DURATION, T, toReel, atNew, INSERT } from './timeline.js';

// Cues are in the OLD story clock; reel() maps them (and their durations) onto the tightened reel.
const reel = spec => ({
  ...spec,
  music: { ...spec.music, sections: spec.music.sections.map(s => ({ ...s, from: toReel(s.from), to: toReel(s.to) })) },
  sfx: spec.sfx.map(([n, t, o = {}]) => [n, toReel(t), o.dur ? { ...o, dur: toReel(t + o.dur) - toReel(t) } : o]),
});
const spec = reel({
  duration: DURATION,
  vo: { file: 'audio/youre-racing-a-punk-vo-leveled.wav', gain: 1.0 },
  music: {
    bpm: 120, key: 'C', gain: 0.28, duck: 0.6,
    sections: [
      { from: 0.9, to: 13.5, style: 'bouncy' },
      { from: 13.5, to: 22.0, style: 'party' },
      { from: 22.0, to: 26.4, style: 'sad' },
      { from: 26.6, to: 35.0, style: 'march' },
      { from: 35.0, to: 43.5, style: 'party', key: 'D' },
      { from: 43.5, to: 47.0, style: 'bright', key: 'D' },
      { from: 47.0, to: 57.0, style: 'sad' },
      { from: 57.0, to: 60.0, style: 'end', key: 'D' },
    ],
  },
  sfx: [
    ['rev', 0.2, { dur: 1.0, gain: 0.3 }],
    ['hit', T.title, { gain: 0.45 }],
    ['ding', T.red, { gain: 0.25 }], ['ding', T.yellow, { gain: 0.25 }], ['ding', T.green, { gain: 0.4 }],
    ['engine', T.green, { dur: 2.5, from: 70, to: 170, gain: 0.25 }],
    ['whoosh', T.green + 0.1, { dur: 1.0, gain: 0.3 }],
    ['engine', T.floor, { dur: 5.0, from: 45, to: 55, gain: 0.35 }],
    ['wahwah', T.civicWins, { gain: 0.3 }],
    ...T.doors.map(x => ['slam', x, { gain: 0.45 }]),
    ['ding', T.race2, { gain: 0.3 }],
    ['hiss', T.nos, { dur: 1.9, gain: 0.4 }],
    ['rev', T.launch2, { dur: 1.6, gain: 0.5 }],
    ['whoosh', T.launch2 + 0.1, { dur: 1.5, gain: 0.4 }],
    ['slam', T.boom, { gain: 0.9 }], ['hit', T.boom, { gain: 0.7 }],
    ...Array.from({ length: 6 }, (_, i) => ['clang', T.boom + 0.4 + i * 0.25, { gain: 0.2, pitch: 1 + i * 0.15 }]),
    ['rumble', T.crane[0], { dur: 2.0, gain: 0.25 }], ['clang', T.crane[1], { gain: 0.5, pitch: 0.5 }],
    ['rev', T.crane[1] + 0.3, { dur: 1.4, gain: 0.5 }],
    ['ding', T.race3, { gain: 0.3 }],
    ['rev', T.launch3 - 0.4, { dur: 0.8, gain: 0.5 }],
    ['engine', T.launch3, { dur: 4.0, from: 60, to: 190, gain: 0.35 }],
    ['rumble', T.twist[0], { dur: 2.4, gain: 0.4 }],
    ['slam', T.smash, { gain: 0.9 }], ['hit', T.smash, { gain: 0.6 }],
    ['whoosh', T.fly[0], { dur: 2.8, gain: 0.4 }],
    ['whoosh', T.arc[0], { dur: 3.0, gain: 0.3 }],
    ['splash', T.splash, { gain: 0.6 }],
    ['bubbles', T.splash + 0.3, { dur: 2.5, n: 14, gain: 0.2 }],
    ['squish', T.gator - 0.5, { dur: 1.0, gain: 0.2 }],
    ['sparkle', T.trophy, { gain: 0.35 }],
    ['sparkle', T.endCard, { gain: 0.35 }],
    ['chirp', T.meep, { gain: 0.3, pitch: 0.7 }],
  ],
});
// the inserted "he's LAUGHING at me" beat (new clock)
spec.sfx.push(['engine', atNew(INSERT.at), { dur: atNew(INSERT.at + 1.2) - atNew(INSERT.at), from: 80, to: 40, gain: 0.2 }],
  ['cheer', atNew(INSERT.at + 0.3), { dur: atNew(INSERT.at + 2.8) - atNew(INSERT.at + 0.3), n: 22, gain: 0.3 }]);
export default spec;
