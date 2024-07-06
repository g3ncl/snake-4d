import React, { useState } from "react";
import styles from "./styles/style.module.css";
import { ControllerType } from "@/types/types";
import { ControllerToggleProps } from "@/types/props";

const ControllerToggle = ({
  updateControllerType,
  ControllerType,
}: ControllerToggleProps): JSX.Element => {
  const toggleControllerType = (newValue: ControllerType) => {
    updateControllerType(newValue);
  };

  return (
    <div className={styles.toggleContainer}>
      <span className={styles.label}>Controller type:</span>
      <div className={styles.toggle}>
        <button
          className={`${styles.toggleButton} ${ControllerType === "Touchpad" ? styles.active : ""}`}
          onClick={() => toggleControllerType("Touchpad")}
        >
          Touchpad
        </button>
        <button
          className={`${styles.toggleButton} ${ControllerType === "Dpad" ? styles.active : ""}`}
          onClick={() => toggleControllerType("Dpad")}
        >
          Dpad
        </button>
      </div>
    </div>
  );
};

export default ControllerToggle;
