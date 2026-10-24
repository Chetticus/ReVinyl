"""Render full archive songs using Vinylize's DSP, retaining A/B time alignment.

Usage: python scripts/render-vinylized.py --audio-dir D:/ReVinyl_AudioFiles
Install scripts/vinylize_engine/requirements.txt in a Python 3.11+ environment.
The source project is read-only; this script uses the vendored engine snapshot.
"""
import argparse
from dataclasses import asdict
import gc
import hashlib
import json
from pathlib import Path
import sys
import time

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts/vinylize_engine"))
from app.dsp.pipeline import PipelineConfig, run

# Matches VinylStuff/frontend/src/types/api.ts DEFAULT_CONFIG.
CONFIG = PipelineConfig(surface_sound="codrops", retain_detail=False,
    start_radius_mm=146, stylus_size=2.75, saturation_drive=4, wow_depth=3,
    click_density=4, crosstalk_amount=2, noise_level=4, seed=1109)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audio-dir", required=True, type=Path)
    parser.add_argument("--slug", help="Render just one recording")
    args = parser.parse_args()
    plan = json.loads((ROOT / "docs/admin-import-plan.json").read_text(encoding="utf-8-sig"))
    output_dir = ROOT / "outputs/vinylized"
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_file = ROOT / "docs/vinylized-render-manifest.json"
    previous = json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else {"records": []}
    manifest = {"engine": "Vinylize DSP snapshot 2026-10-24", "preset": asdict(CONFIG),
        "leadInSeconds": 0, "fullLength": True, "roomResponse": "Applied by the web player to VINYLIZED only", "records": previous["records"]}
    for slug, match in plan["audio"].items():
        if args.slug and slug != args.slug:
            continue
        source = args.audio_dir / match["filename"]
        source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
        output = output_dir / (slug + "-vinylized.mp3")
        old = next((r for r in manifest["records"] if r["slug"] == slug), None)
        if old and old["sourceSha256"] == source_hash and old.get("preset") == asdict(CONFIG) and output.exists() and hashlib.sha256(output.read_bytes()).hexdigest() == old["sha256"]:
            print("CACHED " + slug, flush=True)
            continue
        started = time.monotonic()
        samples, rate = sf.read(source, dtype="float32", always_2d=True)
        if samples.shape[1] == 1:
            samples = np.repeat(samples, 2, axis=1)
        samples = samples[:, :2]
        print(f"RENDER {slug} {samples.shape[0] / rate:.2f}s", flush=True)
        result = run(samples, rate, CONFIG, lambda fraction, stage: print(f"  {fraction:.0%} {stage}", flush=True))
        rendered = result.vinyl
        if rendered.shape != samples.shape or not np.isfinite(rendered).all():
            raise ValueError("Render length/channels/finite samples failed: " + slug)
        difference_rms = float(np.sqrt(np.mean((rendered - samples) ** 2)))
        if difference_rms < 1e-5:
            raise ValueError("DSP produced no audible signal difference: " + slug)
        sf.write(output, rendered, rate, format="MP3", subtype="MPEG_LAYER_III", bitrate_mode="CONSTANT", compression_level=0.75)
        info = sf.info(output)
        if abs(info.duration - len(samples) / rate) > 0.05:
            raise ValueError("Encoded duration differs: " + slug)
        row = {"slug": slug, "filename": output.name, "sourceFilename": source.name,
            "sourceSha256": source_hash, "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
            "bytes": output.stat().st_size, "sampleRate": rate, "sourceFrames": len(samples),
            "duration": info.duration, "channels": info.channels, "differenceRms": difference_rms,
            "peak": float(np.max(np.abs(rendered))), "metrics": result.stage_metrics,
            "preset": asdict(CONFIG), "renderSeconds": round(time.monotonic() - started, 2)}
        manifest["records"] = [r for r in manifest["records"] if r["slug"] != slug] + [row]
        manifest_file.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"SAVED {slug} {row['bytes']} bytes, {row['renderSeconds']}s", flush=True)
        del samples, result, rendered
        gc.collect()


if __name__ == "__main__":
    main()
