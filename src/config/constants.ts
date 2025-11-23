export const COLORS = {
  SNAKE: {
    HEAD: "#ffff00",
    BODY: "#00ff00",
  },
  FOOD: "#ff0000",
  GRID: {
    LIGHT: "#666",
    DARK: "#d0d0d0",
  },
};

export const GAME_SETTINGS = {
  SEMI_STEPS: 5,
  get FIELD_DIMENSION() {
    return 2 * this.SEMI_STEPS + 1;
  },
  TICK_RATE: 200,
  FOV: 75,
  MAX_SNAKE_LENGTH: 10000,
};

export const LAYOUT = {
  ZOOM_PADDING: 1.1,
};
