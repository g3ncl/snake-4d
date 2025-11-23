"use client";
import React, { useState, useRef, useEffect } from "react";
import { Settings, X, ChevronRight, ChevronLeft } from "lucide-react";
import styles from "./styles/styles.module.scss";
import { useSettings } from "@/context/SettingsContext";
import { isMobile } from "react-device-detect";
import ControllerToggle from "../ControllerToggle/ControllerToggle";
import { ControllerType, Rotation } from "@/types/types";
import AngleSlider from "../AngleSlider/AngleSlider";

interface SettingsMenuProps {
  updateControllerType: (type: ControllerType) => void;
  controllerType: ControllerType;
  rotation: Rotation;
  updateRotation: (label: string, value: number) => void;
}

const SettingsMenu = ({
  updateControllerType,
  controllerType,
  rotation,
  updateRotation,
}: SettingsMenuProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [showRotation, setShowRotation] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isSoundEnabled, toggleSound, isVibrationEnabled, toggleVibration } =
    useSettings();

  const handleMenuClick = () => {
    setOpen(!open);
    if (open) {
      setShowRotation(false); // Reset to main menu on close
    }
  };

  useEffect(() => {
    const handleInteractionOutside = (
      event: MouseEvent | TouchEvent | Event,
    ) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowRotation(false);
        setIsActive(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleInteractionOutside);
      document.addEventListener("touchstart", handleInteractionOutside);
      document.addEventListener("scroll", handleInteractionOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleInteractionOutside);
      document.removeEventListener("touchstart", handleInteractionOutside);
      document.removeEventListener("scroll", handleInteractionOutside, true);
    };
  }, [open]);

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const handleTouchStart = () => {
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className={styles.button}
        aria-label={open ? "Close settings" : "Open settings"}
      >
        {open ? <X size={20} /> : <Settings size={20} />}
      </button>
      {open && (
        <div className={`${styles.menu} ${isActive ? styles.seeThrough : ""}`}>
          {showRotation ? (
            <>
              <div className={styles.submenuHeader}>
                <button
                  className={styles.backButton}
                  onClick={() => setShowRotation(false)}
                  aria-label="Back to settings"
                >
                  <ChevronLeft size={20} />
                </button>
                <span>4D Rotation</span>
              </div>
              {Object.entries(rotation).map(([label, value]) => (
                <AngleSlider
                  key={label}
                  label={label}
                  value={value}
                  callbackFunction={updateRotation}
                  events={{
                    onTouchStart: handleTouchStart,
                    onTouchEnd: handleTouchEnd,
                    onMouseDown: handleMouseDown,
                    onMouseUp: handleMouseUp,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <div className={styles.item}>
                <span>Sound</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isSoundEnabled}
                    onChange={toggleSound}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              {isMobile && (
                <div className={styles.item}>
                  <span>Vibration</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={isVibrationEnabled}
                      onChange={toggleVibration}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              )}
              {isMobile && (
                <ControllerToggle
                  updateControllerType={updateControllerType}
                  ControllerType={controllerType}
                />
              )}
              <button
                className={styles.menuButton}
                onClick={() => setShowRotation(true)}
              >
                <div className={styles.item} style={{ width: "100%" }}>
                  <span>4D Rotation</span>
                  <ChevronRight size={20} />
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
