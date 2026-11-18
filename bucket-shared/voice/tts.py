"""Offline voice-over builder (Kokoro ONNX).

  .venv/bin/python bucket-shared/voice/tts.py reels/<name>/vo-script.json audio/<name>-vo.wav

Script JSON:
  { "voice": "af_bella", "speed": 1.1, "gap": 0.25,
    "lines": [ { "id": 1, "at": 0.2, "voice": "...",            # optional per-line voice
                 "parts": [ { "t": "text", "speed": 1.2,        # per-phrase speed
                              "pitch": 2, "pause": 0.15 } ] } ] }  # semitones up, silence after
A part may also be a plain string. Each line starts at max(at, end of previous line + gap).
Pitch shifts keep the timing: the phrase is spoken slower, then resampled up.
Writes <out>.wav (mono 24 kHz) and <out>.lines.json with where each line landed.
"""
import json, sys, os
import numpy as np, soundfile as sf
from huggingface_hub import hf_hub_download
from kokoro_onnx import Kokoro

SR = 24000

def load_kokoro():
    model = hf_hub_download("fastrtc/kokoro-onnx", "kokoro-v1.0.onnx")
    voices = hf_hub_download("fastrtc/kokoro-onnx", "voices-v1.0.bin")
    return Kokoro(model, voices)

def resample(x, ratio):
    """Play back `ratio` times faster (ratio>1 raises pitch, shortens)."""
    n = int(len(x) / ratio)
    return np.interp(np.arange(n) * ratio, np.arange(len(x)), x).astype(np.float32)

def trim(x, thresh=0.01):
    idx = np.where(np.abs(x) > thresh)[0]
    if not len(idx): return x
    a, b = max(0, idx[0] - int(0.02 * SR)), min(len(x), idx[-1] + int(0.06 * SR))
    return x[a:b]

def speak(k, text, voice, speed, pitch):
    r = 2 ** (pitch / 12)
    s = max(0.5, min(2.0, speed / r))
    audio, sr = k.create(text, voice=voice, speed=s, lang="en-us")
    assert sr == SR
    audio = trim(np.asarray(audio, dtype=np.float32))
    return resample(audio, r) if pitch else audio

def main(script_path, out_path):
    cfg = json.load(open(script_path))
    k = load_kokoro()
    clips, cursor = [], 0.0
    for line in cfg["lines"]:
        voice = line.get("voice", cfg.get("voice", "af_bella"))
        chunks = []
        for p in line["parts"]:
            p = {"t": p} if isinstance(p, str) else p
            chunks.append(speak(k, p["t"], voice, p.get("speed", line.get("speed", cfg.get("speed", 1.0))),
                                p.get("pitch", line.get("pitch", 0))))
            chunks.append(np.zeros(int(p.get("pause", 0.08) * SR), np.float32))
        audio = np.concatenate(chunks[:-1])
        start = max(line.get("at", 0.0), cursor)
        clips.append((start, audio, line))
        cursor = start + len(audio) / SR + cfg.get("gap", 0.25)
        print(f"  line {line['id']:>2}  {start:6.2f}s  {len(audio)/SR:5.2f}s  {' '.join(p if isinstance(p,str) else p['t'] for p in line['parts'])}")
    total = int((cursor + 0.5) * SR)
    mix = np.zeros(total, np.float32)
    for start, audio, _ in clips:
        i = int(start * SR)
        mix[i:i + len(audio)] += audio
    mix /= max(1e-6, np.abs(mix).max()) / 0.9
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    sf.write(out_path, mix, SR, subtype="PCM_16")
    placed = [{"id": l["id"], "start": round(s, 3), "end": round(s + len(a) / SR, 3),
               "text": " ".join(p if isinstance(p, str) else p["t"] for p in l["parts"])} for s, a, l in clips]
    json.dump(placed, open(os.path.splitext(out_path)[0] + ".lines.json", "w"), indent=1)
    print(f"Wrote {out_path} ({total/SR:.2f}s)")

if __name__ == "__main__":
    main(*sys.argv[1:3])
