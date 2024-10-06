"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import styles from "./styles/styles.module.scss";

const baseUrl = "https://snake4d.netlify.app";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const audioContext = useRef<AudioContext | null>(null);
  const lightOnBuffer = useRef<AudioBuffer | null>(null);
  const lightOffBuffer = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const loadSound = async (url: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.current!.decodeAudioData(arrayBuffer);
      };

      Promise.all([
        loadSound(`${baseUrl}/assets/switch-on.mp3`),
        loadSound(`${baseUrl}/assets/switch-off.mp3`),
      ]).then(([onBuffer, offBuffer]) => {
        lightOnBuffer.current = onBuffer;
        lightOffBuffer.current = offBuffer;
      });
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playSound = (buffer: AudioBuffer | null) => {
    if (audioContext.current && buffer) {
      const source = audioContext.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current.destination);
      source.start();
    }
  };

  const cycleTheme = (): void => {
    if (theme && systemTheme) {
      const nextTheme =
        theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
      const getEffectiveTheme = (theme: string, systemTheme: string) => {
        return theme === "system" ? systemTheme : theme;
      };
      const currentEffectiveTheme = getEffectiveTheme(theme, systemTheme);
      const nextEffectiveTheme = getEffectiveTheme(nextTheme, systemTheme);
      const isNextThemeDark = nextEffectiveTheme === "dark";

      if (currentEffectiveTheme !== nextEffectiveTheme) {
        playSound(
          isNextThemeDark ? lightOffBuffer.current : lightOnBuffer.current,
        );
      }

      if (localStorage) {
        localStorage.setItem("theme", nextTheme);
      }
      setTheme(nextTheme);
    }
  };

  const themeIcons: { [key: string]: JSX.Element } = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    system: <Laptop size={20} />,
  };

  if (!mounted || !theme) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={cycleTheme}
        className={`${styles.button} ${
          styles[`active${theme.charAt(0).toUpperCase() + theme.slice(1)}`]
        }`}
        aria-label={`Current theme: ${theme}. Click to switch theme.`}
      >
        {themeIcons[theme]}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
