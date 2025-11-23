import { isOppositeDirection } from "../direction";
import { Direction } from "@/types/types";

describe("isOppositeDirection", () => {
  it("should return true for opposite directions on the same axis", () => {
    const dir1: Direction = { axis: "x", delta: 1 };
    const dir2: Direction = { axis: "x", delta: -1 };
    expect(isOppositeDirection(dir1, dir2)).toBe(true);
  });

  it("should return false for same directions", () => {
    const dir1: Direction = { axis: "x", delta: 1 };
    const dir2: Direction = { axis: "x", delta: 1 };
    expect(isOppositeDirection(dir1, dir2)).toBe(false);
  });

  it("should return false for directions on different axes", () => {
    const dir1: Direction = { axis: "x", delta: 1 };
    const dir2: Direction = { axis: "y", delta: 1 };
    expect(isOppositeDirection(dir1, dir2)).toBe(false);
  });

  it("should return false if any direction is undefined", () => {
    const dir1: Direction = { axis: "x", delta: 1 };
    expect(isOppositeDirection(undefined, dir1)).toBe(false);
    expect(isOppositeDirection(dir1, undefined)).toBe(false);
  });
});
