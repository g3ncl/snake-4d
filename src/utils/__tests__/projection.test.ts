import { project4dTo3d } from "../projection";
import * as THREE from "three";

describe("project4dTo3d", () => {
  it("should project 4D point to 3D with distance", () => {
    const vertex = [10, 20, 30, 0];
    const distance = 10;
    // factor = 10 / (10 - 0) = 1
    const result = project4dTo3d(vertex, distance);
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
    expect(result.z).toBe(30);
  });

  it("should project with perspective", () => {
    const vertex = [10, 20, 30, 5];
    const distance = 10;
    // factor = 10 / (10 - 5) = 2
    const result = project4dTo3d(vertex, distance);
    expect(result.x).toBe(20);
    expect(result.y).toBe(40);
    expect(result.z).toBe(60);
  });
});
