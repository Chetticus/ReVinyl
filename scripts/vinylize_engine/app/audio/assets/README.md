# Recorded vinyl surface texture

`codrops-noise1.mp3` is the exact `mp3/noise1.mp3` sample used by the
[Codrops Interactive Record Player](https://tympanus.net/Development/RecordPlayer/).
Downloaded from https://tympanus.net/Development/RecordPlayer/mp3/noise1.mp3.

Original sound: Vinyl Noise SFX by Chia, hosted by 99Sounds. The
[Codrops credits](https://github.com/codrops/RecordPlayer#credits) grant use in
non-commercial and commercial projects, excluding resale as a sample library
or virtual instrument. This is used only as the website's playback ambience.

Reference gain: 0.5. Initial Vinylize trial: 0.45. Archive gain: 0.351, raised 30% from 0.27 at the user’s request (0.27 × 1.30).
The increase applies only to the surface texture, including the 4.5-second intro.
This texture replaces the physical clicks and surface noise. RIAA, stylus,
compliance, wow/flutter and crosstalk settings are preserved.

To restore the previous sound, change `DEFAULT_CONFIG.surface_sound` to
`"physical"` in `frontend/src/types/api.ts`. `CLASSIC_CONFIG` preserves the
full previous preset. Both original DSP modules remain unchanged, and the
backend still defaults to that physical model for direct API requests.
