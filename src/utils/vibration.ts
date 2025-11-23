export const triggerVibration = (pattern: number | number[] = 50): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};
