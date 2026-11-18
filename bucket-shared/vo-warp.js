// Tighten a reel to its voice-over. Beats are authored in STORY time; each beat i (i >= 1) starts LEAD
// seconds before VO line i+1 in the placed lines (tts.py <out>.lines.json). The reel ends after the
// last line (+ tail) or its "min", whichever is later. Returns { toStory, toReel, duration }.
export function voWarp(placed, story, { lead = 0.15, tail = 0.5, fps = 30 } = {}) {
  const last = placed[placed.length - 1];
  const reel = [0, ...placed.slice(1).map(l => l.start - lead), Math.max(last.end + tail, last.start - lead + (last.min ?? 0))];
  if (reel.length !== story.length) throw new Error(`voWarp: ${story.length} story knots but ${reel.length} from ${placed.length} lines`);
  const map = (x, A, B) => { let i = 0; while (i < A.length - 2 && x > A[i + 1]) i++; return B[i] + ((x - A[i]) * (B[i + 1] - B[i])) / (A[i + 1] - A[i]); };
  return { toStory: t => map(t, reel, story), toReel: s => map(s, story, reel), duration: Math.round(reel[reel.length - 1] * fps) / fps };
}
