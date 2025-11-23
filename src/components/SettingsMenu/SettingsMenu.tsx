"use client";
import React, { useState } from "react";
import {
  Settings,
  Volume2,
  VolumeX,
  Vibrate,
  VibrateOff,
  X,
} from "lucide-react";
import styles from "./styles/styles.module.scss";
import { useSettings } from "@/context/SettingsContext";
import { isMobile } from "react-device-detect";

const SettingsMenu = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const { isSoundEnabled, toggleSound, isVibrationEnabled, toggleVibration } =
    useSettings();

  const handleMenuClick = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleMenuClick}
        className={styles.button}
        aria-label={open ? "Close settings" : "Open settings"}
      >
        {open ? <X size={20} /> : <Settings size={20} />}
      </button>
      {open && (
        <div className={styles.menu}>
          <div className={styles.item}>
            <span>Sound</span>
            <button
              onClick={toggleSound}
              className={styles.toggleButton}
              aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
            >
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
          {isMobile && (
            <div className={styles.item}>
              <span>Vibration</span>
              <button
                onClick={toggleVibration}
                className={styles.toggleButton}
                aria-label={
                  isVibrationEnabled ? "Disable vibration" : "Enable vibration"
                }
              >
                {isVibrationEnabled ? (
                  <Vibrate size={20} />
                ) : (
                  <VibrateOff size={20} />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
