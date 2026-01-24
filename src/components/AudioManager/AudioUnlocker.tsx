
"use client";
import { useEffect } from "react";
import AudioEngine from "@/system/AudioEngine";

const AudioUnlocker = () => {
    useEffect(() => {
        const unlock = () => {
            AudioEngine.getInstance().resume().then(() => {
                // Remove listeners once successfully unlocked/resumed
                document.removeEventListener("click", unlock);
                document.removeEventListener("keydown", unlock);
                document.removeEventListener("touchstart", unlock);
            });
        };

        document.addEventListener("click", unlock);
        document.addEventListener("keydown", unlock);
        document.addEventListener("touchstart", unlock);

        return () => {
            document.removeEventListener("click", unlock);
            document.removeEventListener("keydown", unlock);
            document.removeEventListener("touchstart", unlock);
        };
    }, []);

    return null;
};

export default AudioUnlocker;
