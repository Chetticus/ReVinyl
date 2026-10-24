# Vinylize integration

Frontend scope correction: all earlier branding, account/user-display, footer/about/contact copy, template and workbook-preview changes have been reverted to the pre-update frontend (`b40e208`). The only retained application changes are the Vinylized audio player/4.5-second intro and the four-artist homepage selection. Original Vinyl Heritage logos and original user/account rendering are restored exactly.

The source is the user's project at `C:/Users/1/Documents/Claude_Projects/VinylStuff`. It performs audio processing in Python using NumPy, SciPy and SoundFile. Its React player compares original and processed audio and applies a synthetic room response to the processed bus only.

## Processing retained

The vendored snapshot in `scripts/vinylize_engine/app` preserves the actual signal chain:

1. RIAA pre-emphasis, mid/side encoding and groove-velocity integration.
2. Time-to-spatial spiral mapping, stylus contact smoothing and groove-wall compliance saturation.
3. Spatial-to-time playback with wow/flutter, cartridge differentiation, crosstalk and RIAA de-emphasis.
4. The current Vinylize preset's recorded surface texture, replacing its older physical clicks/noise model.

The preset matches Vinylize's `DEFAULT_CONFIG`: 146 mm starting radius, stylus size 2.75, saturation drive 4, wow depth 3, click density 4, crosstalk amount 2, noise level 4 and seed 1109. The source project describes this as its exaggerated “worn favorite” listening preset.

Archive renditions use the complete song rather than truncating it to the demonstration's 180-second upload cap. At the user's request, Vinylized playback begins with 4.5 seconds of Vinylize's recorded surface texture (crackles and pops) before the music starts. Digital audio has no added intro. The player accounts for that offset when switching between renditions: Digital 1:00 maps to Vinylized 1:04.5, while choosing Vinylized at 0:00 plays its complete intro. Tracks exceeding the simulated disc's physical capacity are rejected by the engine rather than silently shortened.

## Rendering and storage

With Python 3.11+ and `scripts/vinylize_engine/requirements.txt` installed:

```powershell
python scripts/render-vinylized.py --audio-dir D:/ReVinyl_AudioFiles
```

The renderer checks finite stereo samples, changed output, MP3 duration within 50 ms of the decoded source plus lead-in, source/output SHA-256 hashes and cached-file consistency. Its [manifest](vinylized-render-manifest.json) records the 28 full-length renders, settings and engine metrics. The initial music renders were reused by `scripts/add-vinyl-lead-in.py` to add the surface intro without repeating the DSP stages; the original render hashes remain in the manifest. Generated MP3s are stored under the Git-ignored `outputs/vinylized/` directory and uploaded as `VINYLIZED` assets through the existing archive admin API. Record publication status and Digital audio are retained.

The public player keeps two media elements so a source switch can seek to the current position before resuming. It handles paused switching, seek, volume, rejected playback, cleanup and unavailable versions. Only Vinylized audio enters the 0.9-second synthetic room response (0.94 dry / 0.18 wet) and its limiter. The Digital source bypasses Web Audio processing. Source/rights notes remain stored in the system and available to admins; the public transport no longer exposes local filenames, filesystem paths or import notes.

## Current scope

Cover uploads are deferred at the user's request. The supplied images remain saved locally under `public/images/covers/` for a later update. Homepage curation uses four different artists: Tuấn Ngọc, Khánh Ly, Thái Thanh and Bằng Kiều.

The user-identified test recording **Trống Cơm** was removed after saving its recovery snapshot in `trong-com-before-removal.json`. **Chim ngói bay về** and **Giấc Mơ Trưa** are assigned to Thùy Chi; **Ru Đời Đi Nhé** is assigned to Tuấn Ngọc. Existing covers and publication statuses were preserved. The catalog contains 35 published recordings, with 28 Digital/Vinylized pairs and seven entries awaiting matching source audio.

Validation includes the production build on the production branch's Next.js 15.5.27 dependency version, TypeScript, focused ESLint checks, four-artist homepage selection/fallback tests, intro-offset switching tests, and the public API/media checks in `vinylized-upload-verification.json`.
