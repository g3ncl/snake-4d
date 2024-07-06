import React, { useRef, useCallback } from "react";
import styles from "./styles/styles.module.css";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { ControllerProps } from "@/types/props";

const Controller = ({
  handleAction,
  controls,
  touchpad = true,
}: ControllerProps): JSX.Element => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      // Minimum distance to be considered a swipe
      const minSwipeDistance = 30;

      // Calculate the angle of the swipe
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Check if the swipe distance is significant enough
      if (Math.sqrt(dx * dx + dy * dy) > minSwipeDistance) {
        if (angle > -45 && angle <= 45) {
          handleAction(controls.right);
        } else if (angle > 45 && angle <= 135) {
          handleAction(controls.down);
        } else if (angle > 135 || angle <= -135) {
          handleAction(controls.left);
        } else {
          handleAction(controls.up);
        }
      }

      touchStartRef.current = null;
    },
    [handleAction, controls],
  );

  if (touchpad) {
    return (
      <div
        className={styles.swipePad}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        Swipe here
      </div>
    );
  }

  return (
    <div className={styles.dpad}>
      <button
        className={`${styles.dpadButton} ${styles.up}`}
        onClick={() => handleAction(controls.up)}
      >
        <ArrowUp size={20} />
      </button>
      <button
        className={`${styles.dpadButton} ${styles.left}`}
        onClick={() => handleAction(controls.left)}
      >
        <ArrowLeft size={20} />
      </button>
      <button
        className={`${styles.dpadButton} ${styles.right}`}
        onClick={() => handleAction(controls.right)}
      >
        <ArrowRight size={20} />
      </button>
      <button
        className={`${styles.dpadButton} ${styles.down}`}
        onClick={() => handleAction(controls.down)}
      >
        <ArrowDown size={20} />
      </button>
      <div className={styles.dpadCenter}></div>
    </div>
  );
};

export default Controller;
