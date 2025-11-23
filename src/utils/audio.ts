let audioContext: AudioContext | null = null;
const bufferCache: Map<string, AudioBuffer> = new Map();

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const getBufferFromCache = (url: string): AudioBuffer | undefined => {
  return bufferCache.get(url);
};

export const addBufferToCache = (url: string, buffer: AudioBuffer): void => {
  bufferCache.set(url, buffer);
};
