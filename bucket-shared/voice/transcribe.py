"""Transcribe, time and level a voice-over.

  .venv/bin/python bucket-shared/voice/transcribe.py audio/<name>-vo.wav reels/<name>/vo-timing.json [--model small.en]

- faster-whisper word timestamps; words are grouped into lines. If <wav>.lines.json exists (from tts.py)
  heard words are fuzzy-aligned to the script and take their script word's line; otherwise lines are split on pauses > 0.6 s.
- Levels the voice to -16 LUFS (two-pass loudnorm, high-pass, gentle compression) -> <wav>-leveled.wav, 48 kHz.
Writes [{id, start, end, text, heard, words:[{w,start,end}]}].
"""
import difflib, json, os, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

def load16k(wav):
    # decode with ffmpeg (avoids PyAV version mismatches)
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", wav, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)

def level(src, dst, lufs=-16):
    pre = "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=2"
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", f"{pre},loudnorm=I={lufs}:TP=-1.5:LRA=7:print_format=json",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(re.findall(r"\{[^{}]*\}", out)[-1])
    ln = (f"loudnorm=I={lufs}:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", f"{pre},{ln}", "-ar", "48000", dst], check=True)
    print(f"Leveled {src} ({m['input_i']} LUFS) -> {dst} ({lufs} LUFS)")

def main(wav, out, model="small.en"):
    segs, _ = WhisperModel(model, device="cpu", compute_type="int8").transcribe(
        load16k(wav), word_timestamps=True, beam_size=5, vad_filter=False, language="en")
    words = [{"w": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for s in segs for w in s.words]
    placed_path = os.path.splitext(wav)[0] + ".lines.json"
    if os.path.exists(placed_path):
        placed = json.load(open(placed_path))
        lines = [dict(p, words=[]) for p in placed]
        # fuzzy-align heard words to script words (in order), then each word takes its script word's line
        norm = lambda x: re.sub(r"[^a-z]", "", x.lower())
        script = [(li, norm(t)) for li, l in enumerate(lines) for t in re.findall(r"[\w']+", l["text"])]
        sm = difflib.SequenceMatcher(None, [t for _, t in script], [norm(w["w"]) for w in words], autojunk=False)
        line_of = [None] * len(words)
        for op, a0, a1, b0, b1 in sm.get_opcodes():
            for j in range(b0, b1):
                a = a0 + (j - b0) * max(1, a1 - a0) // max(1, b1 - b0) if a1 > a0 else max(0, a0 - 1)
                line_of[j] = script[min(a, len(script) - 1)][0]
        for w, li in zip(words, line_of): lines[li]["words"].append(w)
        words = []
        for w in words:
            mid = (w["start"] + w["end"]) / 2
            best = min(lines, key=lambda l: 0 if l["start"] - 0.3 <= mid <= l["end"] + 0.3 else min(abs(mid - l["start"]), abs(mid - l["end"])))
            best["words"].append(w)
    else:
        lines, cur = [], []
        for w in words:
            if cur and w["start"] - cur[-1]["end"] > 0.6: lines.append({"words": cur}); cur = []
            cur.append(w)
        if cur: lines.append({"words": cur})
        for i, l in enumerate(lines): l.update(id=i + 1, text="")
    for l in lines:
        if l["words"]: l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
        l["heard"] = " ".join(w["w"] for w in l["words"])
        print(f"  {l['id']:>2}  {l['start']:6.2f}-{l['end']:6.2f}  {l['heard']}")
    json.dump(lines, open(out, "w"), indent=1)
    print(f"Wrote {out}")
    level(wav, os.path.splitext(wav)[0] + "-leveled.wav")

if __name__ == "__main__":
    a = sys.argv[1:]
    model = a[a.index("--model") + 1] if "--model" in a else "small.en"
    main(a[0], a[1], model)
