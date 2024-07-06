import { rotateVertices } from "./rotation";

/**
 * Generates a set of 4D vertices and edges for a tesseract, rotates them, and returns the rotated vertices and edges.
 *
 * @param {number} [value=1] - The value used to define the size of the tesseract. Defaults to 1.
 * @param {number[][][]} [rotationMatrices=[]] - The rotation matrices to be applied to the vertices. Each rotation matrix is represented as a 4x4 array of numbers. Defaults to an empty array.
 * @return {[number[][], number[][]]} An array containing the rotated vertices as a 2D array of numbers and the edges as a 2D array of numbers.
 */
export const generateVertices4D = (
  value: number = 1,
  rotationMatrices: number[][][] = [],
): [number[][], number[][]] => {
  const edges: number[][] = [
    [0, 1],
    [0, 2],
    [0, 4],
    [0, 8],
    [1, 3],
    [1, 5],
    [1, 9],
    [2, 3],
    [2, 6],
    [2, 10],
    [3, 7],
    [3, 11],
    [4, 5],
    [4, 6],
    [4, 12],
    [5, 7],
    [5, 13],
    [6, 7],
    [6, 14],
    [7, 15],
    [8, 9],
    [8, 10],
    [8, 12],
    [9, 11],
    [9, 13],
    [10, 11],
    [10, 14],
    [11, 15],
    [12, 13],
    [12, 14],
    [13, 15],
    [14, 15],
  ];
  const tesseractVertices: number[][] = [
    [-value, -value, -value, -value],
    [-value, -value, -value, value],
    [-value, -value, value, -value],
    [-value, -value, value, value],
    [-value, value, -value, -value],
    [-value, value, -value, value],
    [-value, value, value, -value],
    [-value, value, value, value],
    [value, -value, -value, -value],
    [value, -value, -value, value],
    [value, -value, value, -value],
    [value, -value, value, value],
    [value, value, -value, -value],
    [value, value, -value, value],
    [value, value, value, -value],
    [value, value, value, value],
  ];

  const rotatedVertices = rotateVertices(tesseractVertices, rotationMatrices);

  return [rotatedVertices, edges];
};

/**
 * Generates a random position for food in a 4-dimensional space.
 *
 * @param dimension - The size of the 4-dimensional space. Defaults to 20.
 * @returns An object containing the x, y, z, and w coordinates of the food position.
 */
export const generateFoodPosition = (
  dimension: number = 9,
): { x: number; y: number; z: number; w: number } => {
  const randomNumber = (): number =>
    Math.floor(Math.random() * dimension) - Math.floor(dimension / 2);
  return {
    x: randomNumber(),
    y: randomNumber(),
    z: randomNumber(),
    w: randomNumber(),
  };
};
