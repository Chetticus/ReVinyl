"""Add Vinylize's recorded surface texture before the already-rendered music."""
import hashlib
import json
from pathlib import Path
import sys
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts/vinylize_engine"))
from app.dsp.playback.sampled_surface import SURFACE_GAIN, mix_sampled_surface

SECONDS = 4.5
path = ROOT / "docs/vinylized-render-manifest.json"
base_path = ROOT / "docs/vinylized-render-manifest-no-intro.json"
if not base_path.exists():
    base_path.write_bytes(path.read_bytes())
base = json.loads(base_path.read_text(encoding="utf-8"))
previous = path.with_name('vinylized-render-manifest-before-crackle30.json')
if not previous.exists():
    previous.write_bytes(path.read_bytes())
result = {**base, "leadInSeconds": SECONDS, "surfaceGain": SURFACE_GAIN,
    "surfaceVolumeMultiplier": 1.3,
    "introSource": "Vinylize codrops-noise1.mp3 at gain 0.351 (0.27 x 1.30)", "records": []}
for row in base["records"]:
    source = ROOT / "outputs/vinylized" / row["filename"]
    if hashlib.sha256(source.read_bytes()).hexdigest() != row["sha256"]:
        raise ValueError("Base render changed: " + row["slug"])
    music, rate = sf.read(source, dtype="float32", always_2d=True)
    # The immutable base already contains the 0.27 texture. Add only its extra
    # 30%, preserving the existing music and all other DSP stages.
    louder = mix_sampled_surface(music, rate, 4 * (SURFACE_GAIN - 0.27) / SURFACE_GAIN)
    # MP3 decoding can overshoot full scale. Bound only the added texture at
    # those peaks; do not turn down or clip the existing music samples.
    lower = np.minimum(music, -0.999)
    upper = np.maximum(music, 0.999)
    limited = (louder < lower) | (louder > upper)
    limited_fraction = float(np.mean(limited))
    music = np.clip(louder, lower, upper)
    intro = mix_sampled_surface(np.zeros((round(rate * SECONDS), 2), dtype="float32"), rate, 4)
    # The recorded texture already fades in; soften only its final 5 ms at the join.
    fade = round(rate * 0.005)
    intro[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)[:, None]
    output = source.with_name(row['slug'] + "-crackle30-vinylized-intro.mp3")
    samples = np.concatenate([intro, music])
    if not np.isfinite(samples).all():
        raise ValueError('Nonfinite audio: ' + row['slug'])
    sf.write(output, samples, rate, format="MP3", subtype="MPEG_LAYER_III", bitrate_mode="CONSTANT", compression_level=0.25)
    info = sf.info(output)
    if abs(info.duration - (row["sourceFrames"] / rate + SECONDS)) > 0.05:
        raise ValueError("Intro duration mismatch: " + row["slug"])
    result["records"].append({**row, "filename": output.name, "bytes": output.stat().st_size,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(), "duration": info.duration,
        "leadInSeconds": SECONDS, "surfaceGain": SURFACE_GAIN,
        "surfaceVolumeMultiplier": 1.3, "baseRenderSha256": row["sha256"],
        "extraTextureLimitedFraction": limited_fraction,
        "introRms": float(np.sqrt(np.mean(intro ** 2))), "introPeak": float(np.max(np.abs(intro)))})
    print("INTRO_READY " + row["slug"], flush=True)
    # A folder containing exactly 28 short filenames makes native file selection reliable.
    upload_dir = ROOT / 'outputs/vinylized/upload-crackle30'
    upload_dir.mkdir(exist_ok=True)
    (upload_dir / (str(len(result['records'])) + '.mp3')).write_bytes(output.read_bytes())
path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("28 lead-ins complete", flush=True)
