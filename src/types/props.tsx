import { MutableRefObject } from "react";
import { ControllerType, Direction, Position, Rotation } from "./types";

export type GameVisualizationProps = {
  dimension: number;
  snakePosition: MutableRefObject<Position[]>;
  foodPosition: MutableRefObject<Position>;
  rotation: Rotation;
};
export type HeaderProps = {
  rotation: Rotation;
  updateRotation: (label: string, value: number) => void;
  controllerType: ControllerType;
  updateControllerType: (type: ControllerType) => void;
};
export type MenuProps = HeaderProps;

export type AngleSliderProps = {
  label: string;
  callbackFunction: (label: string, value: number) => void;
  snapThreshold?: number;
  value?: number;
  events: {
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
  };
};
export type ControllerProps = {
  handleAction: (direction: Direction) => void;
  controls: {
    up: Direction;
    down: Direction;
    left: Direction;
    right: Direction;
  };
  touchpad?: boolean;
};
export type SquareProps = {
  dimension: number;
  position?: { a: number; b: number };
  scale?: number;
  color?: string;
};
export type TesseractFoodProps = {
  dimension: number;
  position: MutableRefObject<Position>;
  scale?: number;
  color?: string;
  rotation?: {
    xy: number;
    xw: number;
    xz: number;
    yw: number;
    yz: number;
    zw: number;
  };
  spin?: boolean;
};
export type SnakeProps = {
  dimension: number;
  snakePosition: MutableRefObject<Position[]>;
  scale?: number;
  color?: string;
  axis: { a: "x" | "y" | "z" | "w"; b: "x" | "y" | "z" | "w" };
};

export type SnakeTesseractProps = {
  dimension: number;
  positions: MutableRefObject<Position[]>;
  scale?: number;
  color?: string;
  rotation?: {
    xy: number;
    xw: number;
    xz: number;
    yw: number;
    yz: number;
    zw: number;
  };
};

export type TesseractProps = {
  dimension: number;
  scale?: number;
  color: string;
  rotation?: {
    xy: number;
    xw: number;
    xz: number;
    yw: number;
    yz: number;
    zw: number;
  };
};

export type ControllerToggleProps = {
  updateControllerType: (type: ControllerType) => void;
  ControllerType: ControllerType;
};
