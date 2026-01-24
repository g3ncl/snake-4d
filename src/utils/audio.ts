let audioContext: AudioContext | null = null;
const bufferCache: Map<string, AudioBuffer> = new Map();

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

export const decodeAudioData = async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  const OfflineAudioContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  // Create a minimal offline context for decoding (1 channel, 1 frame, 44.1kHz)
  const offlineContext = new OfflineAudioContextClass(1, 1, 44100);
  return await offlineContext.decodeAudioData(arrayBuffer);
};

export const getBufferFromCache = (url: string): AudioBuffer | undefined => {
  return bufferCache.get(url);
};

export const addBufferToCache = (url: string, buffer: AudioBuffer): void => {
  bufferCache.set(url, buffer);
};
