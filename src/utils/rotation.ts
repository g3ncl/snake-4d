/**
 * A function that generates a 2D rotation matrix around the XY plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationXY = (theta: number = 0): number[][] => [
  [Math.cos(theta), -Math.sin(theta), 0, 0],
  [Math.sin(theta), Math.cos(theta), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

/**
 * A function that generates a 2D rotation matrix around the XZ plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationXZ = (theta: number = 0): number[][] => [
  [Math.cos(theta), 0, -Math.sin(theta), 0],
  [0, 1, 0, 0],
  [Math.sin(theta), 0, Math.cos(theta), 0],
  [0, 0, 0, 1],
];

/**
 * A function that generates a 2D rotation matrix around the XW plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationXW = (theta: number = 0): number[][] => [
  [Math.cos(theta), 0, 0, -Math.sin(theta)],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [Math.sin(theta), 0, 0, Math.cos(theta)],
];

/**
 * A function that generates a 2D rotation matrix around the YZ plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationYZ = (theta: number = 0): number[][] => [
  [1, 0, 0, 0],
  [0, Math.cos(theta), -Math.sin(theta), 0],
  [0, Math.sin(theta), Math.cos(theta), 0],
  [0, 0, 0, 1],
];

/**
 * A function that generates a 2D rotation matrix around the YW plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationYW = (theta: number = 0): number[][] => [
  [1, 0, 0, 0],
  [0, Math.cos(theta), 0, -Math.sin(theta)],
  [0, 0, 1, 0],
  [0, Math.sin(theta), 0, Math.cos(theta)],
];

/**
 * A function that generates a 2D rotation matrix around the ZW plane.
 *
 * @param {number} theta - The angle of rotation in radians (default: 0).
 * @return {number[][]} The 2D rotation matrix for the XY plane.
 */
export const rotationZW = (theta: number = 0): number[][] => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, Math.cos(theta), -Math.sin(theta)],
  [0, 0, Math.sin(theta), Math.cos(theta)],
];

/**
 * Rotates a 4D vertex using a given rotation matrix.
 *
 * @param {number[]} vertex - The 4D vertex to be rotated. The vertex is represented as an array of four numbers [x, y, z, w].
 * @param {number[][]} rotationMatrix - The rotation matrix to be applied to the vertex. The rotation matrix is represented as a 4x4 array of numbers.
 * @return {number[]} The rotated 4D vertex. The rotated vertex is represented as an array of four numbers [rotatedX, rotatedY, rotatedZ, rotatedW].
 * @throws {Error} If the vertex or rotation matrix is null or undefined.
 */

export const rotateVertex = (
  vertex: number[],
  rotationMatrix: number[][]
): number[] => {
  if (!vertex || !rotationMatrix) {
    throw new Error("Vertex or rotation matrix is null or undefined");
  }
  const [x, y, z, w] = vertex;
  const [[a, b, c, d], [e, f, g, h], [i, j, k, l], [m, n, o, p]] =
    rotationMatrix;

  const rotatedX = a * x + b * y + c * z + d * w;
  const rotatedY = e * x + f * y + g * z + h * w;
  const rotatedZ = i * x + j * y + k * z + l * w;
  const rotatedW = m * x + n * y + o * z + p * w;

  return [rotatedX, rotatedY, rotatedZ, rotatedW];
};

/**
 * Rotates a set of 4D vertices using a series of rotation matrices and projects them into 3D space.
 *
 * @param {number[][]} vertices4D - The set of 4D vertices to be rotated and projected. Each vertex is represented as an array of four numbers [x, y, z, w].
 * @param {number[][][]} rotationMatrices - The rotation matrices to be applied to the vertices. Each rotation matrix is represented as a 4x4 array of numbers.
 * @return {number[][]} The set of rotated and projected 3D vertices. Each vertex is represented as an array of three numbers [x, y, z].
 */
export const rotateVertices = (
  vertices4D: number[][],
  rotationMatrices: number[][][]
): number[][] => {
  let rotatedVertices4D: number[][] = vertices4D.map((v) => [...v]);

  rotationMatrices.forEach((rotationMatrix) => {
    rotatedVertices4D = rotatedVertices4D.map((vertex) =>
      rotateVertex(vertex, rotationMatrix)
    );
  });

  return rotatedVertices4D;
};
