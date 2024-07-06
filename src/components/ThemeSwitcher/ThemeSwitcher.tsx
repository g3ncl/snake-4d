"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import styles from "./styles/styles.module.scss";

const ThemeSwitcher = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  var lightOnSound: HTMLAudioElement | undefined = undefined;
  var lightOffSound: HTMLAudioElement | undefined = undefined;

  if (typeof window !== "undefined") {
    lightOnSound = new Audio("/assets/switch-on.mp3");
    lightOffSound = new Audio("/assets/switch-off.mp3");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = (): void => {
    if (theme && systemTheme) {
      const nextTheme =
        theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

      const getEffectiveTheme = (theme: string, systemTheme: string) => {
        if (theme === "system") {
          return systemTheme;
        }
        return theme;
      };

      const currentEffectiveTheme = getEffectiveTheme(theme, systemTheme);
      const nextEffectiveTheme = getEffectiveTheme(nextTheme, systemTheme);

      const isNextThemeDark = nextEffectiveTheme === "dark";
      const soundToPlay = isNextThemeDark ? lightOffSound : lightOnSound;

      if (currentEffectiveTheme !== nextEffectiveTheme) {
        soundToPlay?.play();
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

  if (mounted && theme) {
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
  } else {
    return <></>;
  }
};

export default ThemeSwitcher;
