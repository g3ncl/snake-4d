import { Direction } from "@/types/types";

/**
 * Determines if two directions are opposite to each other.
 *
 * @param {Direction} oldDirection - The first direction.
 * @param {Direction} newDirection - The second direction.
 * @return {boolean} True if the directions are opposite, false otherwise.
 */
export const isOppositeDirection = (
  oldDirection: Direction | undefined,
  newDirection: Direction | undefined,
) => {
  if (oldDirection === undefined || newDirection === undefined) return false;
  if (oldDirection.axis === newDirection.axis) {
    return oldDirection.delta * newDirection.delta < 0;
  }
  return false;
};
