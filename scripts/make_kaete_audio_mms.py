#!/usr/bin/env python3
"""Independent-model Hebrew TTS comparison from the same source passage.

Meta MMS-TTS Hebrew (VITS, 36M parameters; CC BY-NC 4.0).
This is a *research A/B voice sample*, not represented as Käte's real voice.
Requires internet to download the model weights from Hugging Face.
"""
from __future__ import annotations

import numpy as np
import torch
from pathlib import Path
from pydub import AudioSegment
from transformers import AutoTokenizer, VitsModel

from make_kaete_audio_sample import PARTS

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "audio" / "kaete-1948-05-05-mms.mp3"
MODEL = "facebook/mms-tts-heb"

# Split into manageable semantic units. The content comes from PARTS, i.e.
# the exact same edited spoken script as the initial Hila voice baseline.
def phrases(parts: list[str]):
    for part in parts:
        for phrase in part.splitlines():
            phrase = phrase.strip()
            if phrase:
                yield phrase

def pcm_clip(samples: np.ndarray, sr: int) -> AudioSegment:
    clipped = (np.clip(samples, -1.0, 1.0) * 32767).astype("<i2").tobytes()
    return AudioSegment(data=clipped, sample_width=2, frame_rate=sr, channels=1)

def main() -> None:
    torch.set_num_threads(2)
    torch.manual_seed(73)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading/loading {MODEL}", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = VitsModel.from_pretrained(MODEL)
    model.eval()
    sampling_rate = model.config.sampling_rate
    audio = AudioSegment.silent(duration=180, frame_rate=sampling_rate)
    n = 0
    for line in phrases(PARTS):
        tokens = tokenizer(line, return_tensors="pt")
        with torch.inference_mode():
            waveform = model(**tokens).waveform.squeeze().cpu().numpy()
        audio += pcm_clip(waveform, sampling_rate)
        audio += AudioSegment.silent(duration=350 if line.endswith((".", "!", "?")) else 180, frame_rate=sampling_rate)
        n += 1
    audio.export(str(OUT), format="mp3", bitrate="128k")
    print(f"Created {OUT} ({len(audio)/1000:.1f} seconds, {OUT.stat().st_size} bytes), {n} phrases", flush=True)

if __name__ == "__main__":
    main()