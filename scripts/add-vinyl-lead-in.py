"""Add Vinylize's recorded surface texture before the already-rendered music."""
import hashlib
import json
from pathlib import Path
import sys
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts/vinylize_engine"))
from app.dsp.playback.sampled_surface import mix_sampled_surface

SECONDS = 4.5
path = ROOT / "docs/vinylized-render-manifest.json"
base_path = ROOT / "docs/vinylized-render-manifest-no-intro.json"
if not base_path.exists():
    base_path.write_bytes(path.read_bytes())
base = json.loads(base_path.read_text(encoding="utf-8"))
result = {**base, "leadInSeconds": SECONDS, "introSource": "Vinylize codrops-noise1.mp3 at the current preset's gain 0.27", "records": []}
for row in base["records"]:
    source = ROOT / "outputs/vinylized" / row["filename"]
    if hashlib.sha256(source.read_bytes()).hexdigest() != row["sha256"]:
        raise ValueError("Base render changed: " + row["slug"])
    music, rate = sf.read(source, dtype="float32", always_2d=True)
    intro = mix_sampled_surface(np.zeros((round(rate * SECONDS), 2), dtype="float32"), rate, 4)
    # The recorded texture already fades in; soften only its final 5 ms at the join.
    fade = round(rate * 0.005)
    intro[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)[:, None]
    output = source.with_name(source.stem + "-intro.mp3")
    samples = np.concatenate([intro, music])
    sf.write(output, samples, rate, format="MP3", subtype="MPEG_LAYER_III", bitrate_mode="CONSTANT", compression_level=0.25)
    info = sf.info(output)
    if abs(info.duration - (row["sourceFrames"] / rate + SECONDS)) > 0.05:
        raise ValueError("Intro duration mismatch: " + row["slug"])
    result["records"].append({**row, "filename": output.name, "bytes": output.stat().st_size,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(), "duration": info.duration,
        "leadInSeconds": SECONDS, "baseRenderSha256": row["sha256"],
        "introRms": float(np.sqrt(np.mean(intro ** 2))), "introPeak": float(np.max(np.abs(intro)))})
    print("INTRO_READY " + row["slug"], flush=True)
path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("28 lead-ins complete", flush=True)
