import { generateFoodPosition, generateVertices4D } from "../generate";

describe("generate utils", () => {
  describe("generateFoodPosition", () => {
    it("should return position within bounds", () => {
      const dim = 11;
      const pos = generateFoodPosition(dim);
      const limit = 5; // floor(11/2)
      expect(Math.abs(pos.x)).toBeLessThanOrEqual(limit);
      expect(Math.abs(pos.y)).toBeLessThanOrEqual(limit);
      expect(Math.abs(pos.z)).toBeLessThanOrEqual(limit);
      expect(Math.abs(pos.w)).toBeLessThanOrEqual(limit);
    });
  });

  describe("generateVertices4D", () => {
    it("should return correct number of vertices and edges for tesseract", () => {
      const [vertices, edges] = generateVertices4D(1);
      expect(vertices.length).toBe(16); // 2^4
      expect(edges.length).toBe(32); // 4 * 2^(4-1) ? 16 vertices * 4 edges each / 2 = 32. Correct.
    });
  });
});
