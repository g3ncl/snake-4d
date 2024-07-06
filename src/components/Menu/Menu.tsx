"use client";
import { useState } from "react";
import styles from "./styles/styles.module.scss";
import { MenuIcon, X } from "lucide-react";
import AngleSlider from "../AngleSlider/AngleSlider";
import { MenuProps } from "@/types/props";
import ControllerToggle from "../ControllerToggle/ControllerToggle";
import { isMobile } from "react-device-detect";

const Menu = ({
  rotation,
  controllerType,
  updateRotation,
  updateControllerType,
}: MenuProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    setOpen(!open);
  };
  const [isActive, setIsActive] = useState(false);

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
    <div className={styles.container}>
      <button
        onClick={handleMenuClick}
        className={styles.button}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={20} /> : <MenuIcon size={20} />}
      </button>
      {open && (
        <div className={`${styles.menu} ${isActive && styles.seeThrough}`}>
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
          {isMobile && (
            <ControllerToggle
              updateControllerType={updateControllerType}
              ControllerType={controllerType}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
