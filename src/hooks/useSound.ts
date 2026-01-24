import { useEffect, useRef } from "react";
import AudioEngine from "@/system/AudioEngine";
import { useSettings } from "@/context/SettingsContext";

const useSound = (url: string) => {
  const { isSoundEnabled } = useSettings();

  useEffect(() => {
    // Determine if we should preload. 
    // In a more complex app we might want a dedicated preload hook, 
    // but here preloading on mount is fine.
    AudioEngine.getInstance().preload([url]);
  }, [url]);

  const play = () => {
    if (!isSoundEnabled) return;
    AudioEngine.getInstance().play(url);
  };

  return play;
};

export default useSound;
