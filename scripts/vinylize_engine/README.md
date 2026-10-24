# Vinylize DSP snapshot

Copied from the user's `C:/Users/1/Documents/Claude_Projects/VinylStuff/backend/app` on 2026-10-24. The original project is unchanged. The DSP modules and groove geometry module retain their original implementation and comments; archive rendering does not need the FastAPI service, session storage or 3D frontend.

`../../render-vinylized.py` imports this isolated snapshot. Its preset matches `VinylStuff/frontend/src/types/api.ts` (`DEFAULT_CONFIG`). The frontend room response is adapted separately in `src/modules/archive/vinyl-room.ts`.

The surface recording and its credits/usage terms are retained at `app/audio/assets/README.md`. Python dependencies are listed in `requirements.txt`.
