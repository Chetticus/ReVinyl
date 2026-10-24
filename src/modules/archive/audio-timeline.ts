import type { RecordingAudio } from './types';

/** Intro renditions carry a stable suffix because the API has no offset field. */
export function audioLeadIn(asset: RecordingAudio | undefined) {
  return asset?.type === 'VINYLIZED' &&
    asset.originalFilename.endsWith('-vinylized-intro.mp3')
    ? 4.5
    : 0;
}

export function switchedPosition(
  seconds: number,
  from: RecordingAudio | undefined,
  to: RecordingAudio | undefined
) {
  const musicTime = Math.max(0, seconds - audioLeadIn(from));
  // Choosing Vinylized at the beginning plays the surface lead-in in full.
  return musicTime > 0 ? musicTime + audioLeadIn(to) : 0;
}
