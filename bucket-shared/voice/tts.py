"""Offline voice-over builder. Engines: Kokoro ONNX (fast) or Chatterbox (realistic, expressive).

  .venv/bin/python    bucket-shared/voice/tts.py reels/<name>/vo-script.json audio/<name>-vo.wav   # kokoro
  .venv-cb/bin/python bucket-shared/voice/tts.py reels/<name>/vo-script.json audio/<name>-vo.wav   # chatterbox
  add `--only 3` to render just line 3 (a sample) to <out>.

Chatterbox: set "engine": "chatterbox" (top level). Each line is spoken in one take (parts joined), with
  "exaggeration" (0.25 calm .. 1.0+ wild, default 0.7), "cfg" (pace/adherence, default 0.4),
  "temperature" (default 0.8), "seed", optional "ref" (wav to clone) and "pitch" (semitones, resampled).
  Parts may override "exaggeration", "whisper" (0..1, removes pitch -> breathy) and "gain" (dB); consecutive
  parts with the same settings are spoken in one take.
Takes cache: "cache": "audio/takes/<name>" keeps each line's audio, keyed by its settings (not its "at"),
  so verified takes are reused exactly; delete a line's file (or change its "seed") to re-take it.

Script JSON:
  { "voice": "af_bella", "speed": 1.1, "gap": 0.25,
    "lines": [ { "id": 1, "at": 0.2, "voice": "...",            # optional per-line voice
                 "parts": [ { "t": "text", "speed": 1.2,        # per-phrase speed
                              "pitch": 2, "pause": 0.15 } ] } ] }  # semitones up, silence after
A part may also be a plain string. Each line starts at max(at, end of previous line + gap).
Pitch shifts keep the timing: the phrase is spoken slower, then resampled up.
Writes <out>.wav (mono 24 kHz) and <out>.lines.json with where each line landed.
"""
import hashlib, json, sys, os
import numpy as np, soundfile as sf

SR = 24000

def load_kokoro():
    from huggingface_hub import hf_hub_download
    from kokoro_onnx import Kokoro
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

def whisperize(x, amount=1.0, n=1024, hop=256, seed=3):
    """Keep the spectral envelope, randomise phase: voiced speech becomes a breathy whisper."""
    if amount <= 0: return x
    w = np.hanning(n).astype(np.float32); rng = np.random.default_rng(seed)
    pad = np.concatenate([np.zeros(n, np.float32), x, np.zeros(n, np.float32)])
    out = np.zeros_like(pad); norm = np.zeros_like(pad)
    for i in range(0, len(pad) - n, hop):
        spec = np.fft.rfft(pad[i:i + n] * w)
        spec = np.abs(spec) * np.exp(1j * rng.uniform(0, 2 * np.pi, spec.shape))
        out[i:i + n] += np.fft.irfft(spec, n).astype(np.float32) * w; norm[i:i + n] += w * w
    wet = (out / np.maximum(norm, 1e-3))[n:n + len(x)]
    wet *= np.abs(x).max() / max(1e-6, np.abs(wet).max())
    return amount * wet + (1 - amount) * x

def speak(k, text, voice, speed, pitch):
    r = 2 ** (pitch / 12)
    s = max(0.5, min(2.0, speed / r))
    audio, sr = k.create(text, voice=voice, speed=s, lang="en-us")
    assert sr == SR
    audio = trim(np.asarray(audio, dtype=np.float32))
    return resample(audio, r) if pitch else audio

class Chatterbox:
    def __init__(self):
        import torch
        from chatterbox.tts import ChatterboxTTS
        self.torch, self.m = torch, ChatterboxTTS.from_pretrained(device="cpu")

    def line(self, text, line, cfg, o=None):
        o = o or {}
        self.torch.manual_seed(line.get("seed", cfg.get("seed", 7)) + line["id"])
        wav = self.m.generate(text, audio_prompt_path=line.get("ref", cfg.get("ref")),
                              exaggeration=o.get("exaggeration", line.get("exaggeration", cfg.get("exaggeration", 0.7))),
                              cfg_weight=line.get("cfg", cfg.get("cfg", 0.4)), temperature=line.get("temperature", cfg.get("temperature", 0.8)))
        a = wav.squeeze().cpu().numpy().astype(np.float32)
        if self.m.sr != SR: a = resample(a, self.m.sr / SR)
        a = trim(a / max(1e-6, np.abs(a).max()))
        pitch = line.get("pitch", 0)
        a = resample(a, 2 ** (pitch / 12)) if pitch else a
        return whisperize(a, o.get("whisper", 0)) * 10 ** (o.get("gain", 0) / 20)

def main(script_path, out_path, only=None):
    cfg = json.load(open(script_path))
    cb = cfg.get("engine") == "chatterbox"
    model = []
    def k_():
        if not model: model.append(Chatterbox() if cb else load_kokoro())
        return model[0]
    cache = cfg.get("cache")
    if cache: os.makedirs(cache, exist_ok=True)
    glob = {g: cfg.get(g) for g in ("engine", "voice", "speed", "exaggeration", "cfg", "temperature", "seed", "ref")}
    clips, cursor = [], 0.0
    for line in cfg["lines"]:
        if only and line["id"] != only: continue
        voice = line.get("voice", cfg.get("voice", "af_bella"))
        key = hashlib.sha1(json.dumps([glob, {a: b for a, b in line.items() if a != "at"}], sort_keys=True).encode()).hexdigest()[:10]
        cpath = os.path.join(cache, f"line{line['id']:02d}-{key}.wav") if cache else None
        chunks = [sf.read(cpath, dtype="float32")[0], None] if cpath and os.path.exists(cpath) else []
        if chunks: pass
        elif cb:  # group consecutive parts with equal overrides; one take per group
            groups = []
            for p in line["parts"]:
                p = {"t": p} if isinstance(p, str) else p
                o = {k2: p[k2] for k2 in ("exaggeration", "whisper", "gain") if k2 in p}
                if groups and groups[-1][0] == o: groups[-1][1].append(p)
                else: groups.append((o, [p]))
            for o, ps in groups:
                chunks += [k_().line(" ".join(p["t"] for p in ps), line, cfg, o), np.zeros(int(ps[-1].get("pause", 0.25) * SR), np.float32)]
        for p in ([] if cb or chunks else line["parts"]):
            p = {"t": p} if isinstance(p, str) else p
            chunks.append(speak(k_(), p["t"], voice, p.get("speed", line.get("speed", cfg.get("speed", 1.0))),
                                p.get("pitch", line.get("pitch", 0))))
            chunks.append(np.zeros(int(p.get("pause", 0.08) * SR), np.float32))
        audio = np.concatenate(chunks[:-1])
        if cpath and not os.path.exists(cpath): sf.write(cpath, audio, SR, subtype="FLOAT")
        start = 0.1 if only else max(line.get("at", 0.0), cursor)
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
    a = sys.argv[1:]
    main(a[0], a[1], int(a[a.index("--only") + 1]) if "--only" in a else None)
