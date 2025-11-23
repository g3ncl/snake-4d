import React, { useCallback } from "react";
import styles from "./styles/styles.module.scss";
import { AngleSliderProps } from "@/types/props";

const graduations = [
  { value: 0, label: "0" },
  { value: Math.PI / 2, label: "π/2" },
  { value: Math.PI, label: "π" },
  { value: (3 * Math.PI) / 2, label: "3π/2" },
  { value: 2 * Math.PI, label: "2π" },
];

const displayValue = (value: number): string => {
  return (
    graduations.find((graduation) => graduation.value === value)?.label ??
    value.toFixed(2)
  );
};

const AngleSlider = ({
  label,
  callbackFunction,
  events,
  snapThreshold = 0.1,
  value = 0,
}: AngleSliderProps): React.JSX.Element => {
  const maxValue = Math.PI * 2;

  const snapToClosestGraduation = useCallback(
    (val: number): number => {
      const closestGrad = graduations.reduce((closest, current) =>
        Math.abs(current.value - val) < Math.abs(closest.value - val)
          ? current
          : closest,
      );

      const distanceBetweenTicks = Math.PI / 2; // Distance between each tick
      const snapDistance = distanceBetweenTicks * snapThreshold;

      if (Math.abs(closestGrad.value - val) <= snapDistance) {
        return closestGrad.value;
      }

      return val;
    },
    [snapThreshold],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseFloat(e.target.value);
    const snappedValue = snapToClosestGraduation(newValue);
    callbackFunction(label, snappedValue);
  };

  const getTickLabel = (grad: { value: number; label: string }) => {
    if (grad.label.includes("/")) {
      const [numerator, denominator] = grad.label.split("/");
      return (
        <div className={styles.tickLabel}>
          <div className={styles.top}>{numerator}</div>
          <div className={styles.bottom}>{denominator}</div>
        </div>
      );
    }
    return <div className={styles.tickLabel}>{grad.label}</div>;
  };

  return (
    <div>
      <div className={styles.labelContainer}>
        <span className={styles.label}>{label.toUpperCase()}</span>
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="0"
            max={maxValue}
            step="0.01"
            value={value}
            onChange={handleChange}
            className={styles.slider}
            onTouchStart={events?.onTouchStart}
            onTouchEnd={events?.onTouchEnd}
            onMouseDown={events?.onMouseDown}
            onMouseUp={events?.onMouseUp}
          />
          <div className={styles.graduationsContainer}>
            {graduations.map((grad) => (
              <div
                key={grad.value}
                className={styles.graduation}
                style={{ left: `${(grad.value / maxValue) * 100}%` }}
              >
                <div className={styles.tick} />
                <div className={styles.tickLabelContainer}>
                  {getTickLabel(grad)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <span className={styles.value}>{displayValue(value)}</span>
      </div>
    </div>
  );
};

export default AngleSlider;
