/** Vinylize's listening-room response. The Digital element bypasses this bus. */
export function createVinylRoom(element: HTMLAudioElement) {
  const context = new AudioContext();
  const source = context.createMediaElementSource(element);
  const dry = context.createGain();
  const wet = context.createGain();
  const convolver = context.createConvolver();
  const limiter = context.createDynamicsCompressor();
  const length = Math.ceil(context.sampleRate * 0.9);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let seed = 0x41c6ce57 ^ (channel * 0x9e3779b9);
    let low = 0;
    const start = Math.floor(0.008 * context.sampleRate);
    for (let i = start; i < length; i++) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      const noise = ((seed >>> 0) / 0xffffffff) * 2 - 1;
      low += (noise - low) * 0.22;
      const t = (i - start) / Math.max(1, length - start - 1);
      data[i] =
        (noise * 0.38 + low * 0.62) *
        Math.pow(1 - t, 5.8) *
        (0.72 + 0.28 * Math.exp(-t * 28));
    }
    for (const [delay, gain] of [
      [0.014, 0.72],
      [0.027, 0.48],
      [0.043, 0.31],
      [0.071, 0.18],
    ]) {
      const index = Math.min(
        length - 1,
        Math.floor((delay + channel * 0.0017) * context.sampleRate)
      );
      data[index] += gain;
    }
  }
  convolver.buffer = impulse;
  dry.gain.value = 0.94;
  wet.gain.value = 0.18;
  limiter.threshold.value = -0.2;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.08;
  source.connect(dry).connect(limiter);
  source.connect(convolver).connect(wet).connect(limiter);
  limiter.connect(context.destination);
  return {
    resume: () => context.resume(),
    setAudible: (audible: boolean) => {
      wet.gain.cancelScheduledValues(context.currentTime);
      wet.gain.setValueAtTime(audible ? 0.18 : 0, context.currentTime);
    },
    dispose: () => {
      source.disconnect();
      dry.disconnect();
      wet.disconnect();
      convolver.disconnect();
      limiter.disconnect();
      void context.close();
    },
  };
}
