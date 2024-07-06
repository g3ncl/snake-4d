import * as THREE from "three";

/**
 * Projects a 4D vertex to a 3D vector.
 *
 * @param {number[]} vertex - The 4D vertex to be projected. Defaults to [0, 0, 0, 0].
 * @param {number} distance - The distance to be used for projecting the vertex. Defaults to 0.
 * @returns {THREE.Vector3} The projected 3D vector.
 */
export const project4dTo3d = (
  vertex: number[] = [0, 0, 0, 0],
  distance: number = 0,
): THREE.Vector3 => {
  const [x, y, z, w] = vertex;
  const factor = distance / (distance - w);
  return new THREE.Vector3(x * factor, y * factor, z * factor);
};
/**
 * Projects a set of 4D vertices into 3D space.
 *
 * @param {number[][]} vertices4D - The set of 4D vertices to be projected. Each vertex is represented as an array of four numbers [x, y, z, w].
 * @param {number} distance - The distance to be used for projecting the vertices into 3D space.
 * @return {number[][]} The set of projected 3D vertices. Each vertex is represented as an array of three numbers [x, y, z].
 */
export const projectVerticesTo3D = (
  vertices4D: number[][],
  distance: number,
) => {
  const vertices3D = vertices4D.map((v) => project4dTo3d(v, distance));
  return vertices3D;
};
