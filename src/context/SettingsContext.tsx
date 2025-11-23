"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isVibrationEnabled: boolean;
  toggleVibration: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedSound = localStorage.getItem("isSoundEnabled");
    const savedVibration = localStorage.getItem("isVibrationEnabled");

    if (savedSound !== null) {
      setIsSoundEnabled(savedSound === "true");
    }
    if (savedVibration !== null) {
      setIsVibrationEnabled(savedVibration === "true");
    }
  }, []);

  const toggleSound = () => {
    const newValue = !isSoundEnabled;
    setIsSoundEnabled(newValue);
    localStorage.setItem("isSoundEnabled", String(newValue));
  };

  const toggleVibration = () => {
    const newValue = !isVibrationEnabled;
    setIsVibrationEnabled(newValue);
    localStorage.setItem("isVibrationEnabled", String(newValue));
  };

  return (
    <SettingsContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        isVibrationEnabled,
        toggleVibration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
