export const triggerVibration = (pattern: number | number[] = 200): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};
