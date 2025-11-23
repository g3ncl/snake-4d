import { useEffect, useRef } from "react";
import {
  getAudioContext,
  getBufferFromCache,
  addBufferToCache,
} from "@/utils/audio";

const useSound = (url: string) => {
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const loadSound = async () => {
      const cached = getBufferFromCache(url);
      if (cached) {
        bufferRef.current = cached;
        return;
      }

      try {
        const context = getAudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await context.decodeAudioData(arrayBuffer);

        addBufferToCache(url, decodedBuffer);
        bufferRef.current = decodedBuffer;
      } catch (error) {
        console.error(`Failed to load sound from ${url}:`, error);
      }
    };

    loadSound();
  }, [url]);

  const play = () => {
    if (!bufferRef.current || typeof window === "undefined") return;

    const context = getAudioContext();

    // Resume context if suspended (browser policy)
    if (context.state === "suspended") {
      context.resume();
    }

    const source = context.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(context.destination);
    source.start();
  };

  return play;
};

export default useSound;
