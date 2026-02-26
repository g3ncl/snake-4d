import { useEffect } from "react";
import { Direction, Position } from "@/types/types";
import { isOppositeDirection } from "@/utils/direction";
import { arePositionsEqual, updateSnakeBlockPosition } from "@/utils/positions";

const AXES: (keyof Position)[] = ["x", "y", "z", "w"];
const DELTAS: (1 | -1)[] = [1, -1];

function manhattanDistance(a: Position, b: Position): number {
  return (
    Math.abs(a.x - b.x) +
    Math.abs(a.y - b.y) +
    Math.abs(a.z - b.z) +
    Math.abs(a.w - b.w)
  );
}

export function useAutoPlay({
  enabled,
  snakePositionRef,
  foodPositionRef,
  directionRef,
  fieldDimension,
  onSetDirection,
  gameOver,
  onRestart,
  tickRate,
}: {
  enabled: boolean;
  snakePositionRef: React.RefObject<Position[]>;
  foodPositionRef: React.RefObject<Position>;
  directionRef: React.RefObject<Direction | undefined>;
  fieldDimension: number;
  onSetDirection: (dir: Direction) => void;
  gameOver: boolean;
  onRestart: () => void;
  tickRate: number;
}) {
  // Auto-restart on game over
  useEffect(() => {
    if (!enabled || !gameOver) return;
    const timeout = setTimeout(onRestart, 500);
    return () => clearTimeout(timeout);
  }, [enabled, gameOver, onRestart]);

  // Direction picking interval — runs slightly faster than game tick
  useEffect(() => {
    if (!enabled || gameOver) return;

    const interval = setInterval(() => {
      const positions = snakePositionRef.current;
      const food = foodPositionRef.current;
      const currentDir = directionRef.current;
      if (!positions || !food) return;

      const head = positions[0];

      // Generate all 8 candidate directions
      const candidates: { dir: Direction; dist: number }[] = [];
      for (const axis of AXES) {
        for (const delta of DELTAS) {
          const dir: Direction = { axis, delta };
          if (isOppositeDirection(currentDir, dir) && positions.length > 1)
            continue;

          const nextPos = updateSnakeBlockPosition(
            head,
            axis,
            fieldDimension,
            delta,
          );
          const hitsBody = positions
            .slice(0, -1)
            .some((seg) => arePositionsEqual(seg, nextPos));
          if (hitsBody) continue;

          candidates.push({ dir, dist: manhattanDistance(nextPos, food) });
        }
      }

      if (candidates.length === 0) return; // no safe move, will die

      candidates.sort((a, b) => a.dist - b.dist);
      onSetDirection(candidates[0].dir);
    }, tickRate / 2);

    return () => clearInterval(interval);
  }, [enabled, gameOver, tickRate]);
}
