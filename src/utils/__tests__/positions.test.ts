import {
  updateSnakeBlockPosition,
  updateSnakePosition,
  arePositionsEqual,
} from "../positions";
import { Position } from "@/types/types";

describe("positions utils", () => {
  describe("arePositionsEqual", () => {
    it("should return true for identical positions", () => {
      const pos1: Position = { x: 1, y: 2, z: 3, w: 4 };
      const pos2: Position = { x: 1, y: 2, z: 3, w: 4 };
      expect(arePositionsEqual(pos1, pos2)).toBe(true);
    });

    it("should return false for different positions", () => {
      const pos1: Position = { x: 1, y: 2, z: 3, w: 4 };
      const pos2: Position = { x: 0, y: 2, z: 3, w: 4 };
      expect(arePositionsEqual(pos1, pos2)).toBe(false);
    });
  });

  describe("updateSnakeBlockPosition", () => {
    const dimension = 11;

    it("should move position forward correctly", () => {
      const startPos: Position = { x: 0, y: 0, z: 0, w: 0 };
      const newPos = updateSnakeBlockPosition(startPos, "x", dimension, 1);
      expect(newPos.x).toBe(1);
    });

    it("should wrap around positive edge", () => {
      const startPos: Position = { x: 5, y: 0, z: 0, w: 0 };
      const newPos = updateSnakeBlockPosition(startPos, "x", dimension, 1);
      expect(newPos.x).toBe(-5);
    });

    it("should wrap around negative edge", () => {
      const startPos: Position = { x: -5, y: 0, z: 0, w: 0 };
      const newPos = updateSnakeBlockPosition(startPos, "x", dimension, -1);
      expect(newPos.x).toBe(5);
    });
  });

  describe("updateSnakePosition", () => {
    const dimension = 11;

    it("should move head and follow tail", () => {
      const snake: Position[] = [
        { x: 0, y: 0, z: 0, w: 0 },
        { x: -1, y: 0, z: 0, w: 0 },
      ];
      const newSnake = updateSnakePosition(snake, "x", dimension, 1);

      expect(newSnake[0]).toEqual({ x: 1, y: 0, z: 0, w: 0 }); // New Head
      expect(newSnake[1]).toEqual({ x: 0, y: 0, z: 0, w: 0 }); // Old Head becomes body
      expect(newSnake.length).toBe(2);
    });
  });
});
