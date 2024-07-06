export type Position = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type Direction = { axis: keyof Position; delta: 1 | -1 };

export type Rotation = {
  xy: number;
  xw: number;
  xz: number;
  yw: number;
  yz: number;
  zw: number;
};
export type ControllerType = "Dpad" | "Touchpad";
