import { Position } from "@/types/types";

export const updateSnakeBlockPosition = (
  /**
   * Updates the position of a snake block by shifting it in a given direction.
   *
   * @param {Position} position - The current position of the snake block.
   * @param {keyof Position} axis - The axis along which the snake block is moving.
   * @param {number} fieldDimension - The dimension of the game field.
   * @param {1 | -1} delta - The direction of movement (1 for forward, -1 for backward).
   * @return {Position} The updated position of the snake block.
   */
  position: Position,
  axis: keyof Position,
  fieldDimension: number,
  delta: 1 | -1,
): Position => {
  let updatedPosition = {
    ...position,
    [axis]:
      ((position[axis] + (fieldDimension / 2) * delta + delta) %
        fieldDimension) -
      (fieldDimension / 2) * delta,
  };
  return updatedPosition;
};

/**
 * Updates the position of the snake by shifting the head in a given direction.
 *
 * @param {Position[]} position - The current positions of the snake.
 * @param {keyof Position} axis - The axis along which the snake is moving.
 * @param {number} fieldDimension - The dimension of the game field.
 * @param {1 | -1} delta - The direction of movement (1 for forward, -1 for backward).
 * @return {Position[]} The updated positions of the snake.
 */
export const updateSnakePosition = (
  position: Position[],
  axis: keyof Position,
  fieldDimension: number,
  delta: 1 | -1,
) => {
  let pos = JSON.parse(JSON.stringify(position));
  let headPosition = pos[0];
  let newHeadPosition = updateSnakeBlockPosition(
    headPosition,
    axis,
    fieldDimension,
    delta,
  );
  pos.pop();
  pos.unshift(newHeadPosition);
  return pos;
};

/**
 * Checks if two positions are equal.
 *
 * @param {Position} pos1 - The first position.
 * @param {Position} pos2 - The second position.
 * @return {boolean} Returns true if the positions are equal, false otherwise.
 */
export const arePositionsEqual = (pos1: Position, pos2: Position): boolean => {
  return (
    pos1.x === pos2.x &&
    pos1.y === pos2.y &&
    pos1.z === pos2.z &&
    pos1.w === pos2.w
  );
};
