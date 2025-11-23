"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import styles from "./styles/styles.module.scss";
import useSound from "@/hooks/useSound";
import { useSettings } from "@/context/SettingsContext";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const { isSoundEnabled } = useSettings();

  const playSwitchOn = useSound("/assets/switch-on.mp3");
  const playSwitchOff = useSound("/assets/switch-off.mp3");

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if (currentEffectiveTheme !== nextEffectiveTheme && isSoundEnabled) {
        if (isNextThemeDark) {
          playSwitchOff();
        } else {
          playSwitchOn();
        }
      }

      if (localStorage) {
        localStorage.setItem("theme", nextTheme);
      }
      setTheme(nextTheme);
    }
  };

  const themeIcons: { [key: string]: React.JSX.Element } = {
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
