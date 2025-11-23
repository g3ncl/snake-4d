import { rotationXY, rotateVertex, rotateVertices } from "../rotation";

describe("rotation utils", () => {
  describe("rotationXY", () => {
    it("should return identity matrix for 0 rotation", () => {
      const matrix = rotationXY(0);
      expect(matrix).toEqual([
        [1, -0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]);
    });
  });

  describe("rotateVertex", () => {
    it("should rotate vertex correctly with identity matrix", () => {
      const vertex = [1, 2, 3, 4];
      const identity = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      expect(rotateVertex(vertex, identity)).toEqual([1, 2, 3, 4]);
    });

    it("should throw error if inputs are missing", () => {
      expect(() => rotateVertex(null as any, [])).toThrow();
    });
  });
});
