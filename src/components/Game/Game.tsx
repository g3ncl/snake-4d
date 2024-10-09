"use client";
import { useEffect, useRef, useState } from "react";
import GameVisualization from "../GameVisualization/GameVisualization";
import { ControllerType, Direction, Position } from "@/types/types";
import { generateFoodPosition } from "@/utils/generate";
import {
  arePositionsEqual,
  updateSnakeBlockPosition,
  updateSnakePosition,
} from "@/utils/positions";
import styles from "./styles/styles.module.css";

import { isMobile } from "react-device-detect";
import Controller from "../Controller/Controller";
import Header from "../Header/Header";
import { isOppositeDirection } from "@/utils/direction";
import { updateScore } from "@/utils/score";
import useTelegramCheck from "@/hooks/useTelegramCheck";

const SEMI_STEPS = 5;
const FIELD_DIMENSION = 2 * SEMI_STEPS + 1;
const TIME = 200;
const baseUrl = "https://snake4d.netlify.app";
const keyMap: { [key: string]: Direction } = {
  w: { axis: "y", delta: 1 },
  s: { axis: "y", delta: -1 },
  d: { axis: "x", delta: 1 },
  a: { axis: "x", delta: -1 },
  i: { axis: "w", delta: 1 },
  k: { axis: "w", delta: -1 },
  j: { axis: "z", delta: -1 },
  l: { axis: "z", delta: 1 },
};

const Game = (): JSX.Element => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState<Direction | undefined>(undefined);
  const [snakePosition, setSnakePosition] = useState<Position[]>([
    { x: 0, y: 0, z: 0, w: 0 },
  ]);
  const [foodPosition, setFoodPosition] = useState<Position>(
    generateFoodPosition(FIELD_DIMENSION),
  );
  const [highScore, setHighScore] = useState(
    typeof window !== "undefined" ? localStorage.getItem("highScore") : 0,
  );
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState({
    xy: 0,
    xw: 0,
    xz: Math.PI / 4,
    yw: 0,
    yz: Math.PI / 4,
    zw: 0,
  });

  const directionRef = useRef(direction);
  const snakePositionRef = useRef<Position[]>([{ x: 0, y: 0, z: 0, w: 0 }]);
  const foodPositionRef = useRef<Position>(foodPosition);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const highScoreRef = useRef(highScore);
  const scoreRef = useRef(score);

  const audioContext = useRef<AudioContext | null>(null);
  const eatingAudioBuffer = useRef<AudioBuffer | null>(null);

  const { isFromTelegram, telegramUserId, telegramMessageId } =
    useTelegramCheck();

  const [controllerType, setControllerType] =
    useState<ControllerType>("Touchpad");

  const updateRotation = (label: string, value: number) => {
    setRotation((prev) => ({ ...prev, [label]: value }));
  };

  const updateControllerType = (type: ControllerType) => {
    setControllerType(type);
  };

  const resetGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setDirection(undefined);
    directionRef.current = undefined;
    setSnakePosition([{ x: 0, y: 0, z: 0, w: 0 }]);
    snakePositionRef.current = [{ x: 0, y: 0, z: 0, w: 0 }];
    setGameOver(false);
    let newFoodPosition = generateFoodPosition(FIELD_DIMENSION);
    foodPositionRef.current = newFoodPosition;
    setFoodPosition(newFoodPosition);
    intervalRef.current = setInterval(() => {
      if (directionRef.current && snakePositionRef.current) {
        let newSnakePositions = updateSnakePosition(
          snakePositionRef.current,
          directionRef.current.axis,
          FIELD_DIMENSION,
          directionRef.current.delta,
        );
        snakePositionRef.current = newSnakePositions;
        setSnakePosition(newSnakePositions);
      }
    }, TIME);
  };

  const playSound = (buffer: AudioBuffer | null) => {
    if (audioContext.current && buffer) {
      const source = audioContext.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current.destination);
      source.start();
    }
  };

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    // Fixing the hydration error due to conditional rendering.
    // The game component is initially rendered without isMobile beeing initialized,
    // which triggers the hydration error.
    setIsMounted(true);
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const loadSound = async (url: string) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.current!.decodeAudioData(arrayBuffer);
    };
    loadSound(`${baseUrl}/assets/eating.mp3`).then((buffer) => {
      eatingAudioBuffer.current = buffer;
    });

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (
      snakePositionRef.current
        .slice(1)
        .some((pos) => arePositionsEqual(pos, snakePositionRef.current[0]))
    ) {
      //Check if the head crashes into the snake body
      setGameOver(true);
    } else if (
      directionRef.current &&
      arePositionsEqual(snakePositionRef.current[0], foodPositionRef.current)
    ) {
      setScore((prev) => prev + 1);
      scoreRef.current += 1;
      playSound(eatingAudioBuffer.current);
      let pos = snakePositionRef.current;
      pos.push(
        updateSnakeBlockPosition(
          pos.at(-1)!,
          directionRef.current.axis,
          FIELD_DIMENSION,
          (directionRef.current.delta * -1) as -1 | 1,
        ),
      );
      let newFoodPosition = generateFoodPosition(FIELD_DIMENSION);

      snakePositionRef.current = pos;
      foodPositionRef.current = newFoodPosition;
      setSnakePosition(pos);
      setFoodPosition(foodPositionRef.current);
    }
  }, [snakePosition, foodPosition]);

  useEffect(() => {
    if (!gameOver) return;

    if (telegramUserId && telegramMessageId) {
      try {
        updateScore(telegramUserId, scoreRef.current, telegramMessageId);
      } catch (error) {
        console.error(error);
      }
    } else {
      let newHighScore = Math.max(
        Number(highScoreRef.current),
        scoreRef.current,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("highScore", `${newHighScore}`);
        setHighScore(newHighScore);
        highScoreRef.current = newHighScore;
      }
    }
    intervalRef.current && clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (directionRef.current && snakePositionRef.current) {
        let newSnakePositions = updateSnakePosition(
          snakePositionRef.current,
          directionRef.current.axis,
          FIELD_DIMENSION,
          directionRef.current.delta,
        );
        snakePositionRef.current = newSnakePositions;
        setSnakePosition(newSnakePositions);
      }
    }, TIME);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);
  const handleSetDirection = (direction: Direction) => {
    if (snakePositionRef.current.length === 1) {
      setDirection(direction);
    } else if (!isOppositeDirection(directionRef.current, direction)) {
      setDirection(direction);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const pressedKey = event.key.toLowerCase();
      let direction = keyMap[pressedKey];
      if (!direction) return;
      handleSetDirection(direction);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAction = (direction: Direction) => {
    handleSetDirection(direction);
  };

  if (isMounted) {
    return (
      <>
        <Header
          rotation={rotation}
          controllerType={controllerType}
          updateControllerType={updateControllerType}
          updateRotation={updateRotation}
        />
        <div className={styles.container}>
          <div className={styles.landscapeLayout}>
            {isMobile && (
              <div className={styles.leftControls}>
                <Controller
                  handleAction={handleAction}
                  controls={{
                    up: { axis: "y", delta: 1 },
                    down: { axis: "y", delta: -1 },
                    left: { axis: "x", delta: -1 },
                    right: { axis: "x", delta: 1 },
                  }}
                  touchpad={controllerType === "Touchpad"}
                />
              </div>
            )}
            <div className={styles.centerContent}>
              <div className={styles.scoreContainer}>
                <div className={styles.scoreBox}>
                  <p className={styles.score}>{`Score: ${score}`}</p>
                  {highScore && !isFromTelegram && (
                    <p
                      className={styles.highScore}
                    >{`High Score: ${highScore}`}</p>
                  )}
                </div>
              </div>
              <div className={styles.gameArea}>
                <GameVisualization
                  dimension={FIELD_DIMENSION}
                  snakePosition={snakePositionRef}
                  foodPosition={foodPositionRef}
                  rotation={rotation}
                />
              </div>
            </div>
            {isMobile && (
              <div className={styles.rightControls}>
                <Controller
                  handleAction={handleAction}
                  controls={{
                    up: { axis: "w", delta: 1 },
                    down: { axis: "w", delta: -1 },
                    left: { axis: "z", delta: -1 },
                    right: { axis: "z", delta: 1 },
                  }}
                  touchpad={controllerType === "Touchpad"}
                />
              </div>
            )}
          </div>
          {isMobile && (
            <div className={styles.portraitControls}>
              <Controller
                handleAction={handleAction}
                controls={{
                  up: { axis: "y", delta: 1 },
                  down: { axis: "y", delta: -1 },
                  left: { axis: "x", delta: -1 },
                  right: { axis: "x", delta: 1 },
                }}
                touchpad={controllerType === "Touchpad"}
              />
              <Controller
                handleAction={handleAction}
                controls={{
                  up: { axis: "w", delta: 1 },
                  down: { axis: "w", delta: -1 },
                  left: { axis: "z", delta: -1 },
                  right: { axis: "z", delta: 1 },
                }}
                touchpad={controllerType === "Touchpad"}
              />
            </div>
          )}
        </div>
        {gameOver && (
          <dialog open={gameOver} className={styles.dialog}>
            <span>Game Over!</span>
            <span>Score: {score}</span>
            <button className={styles.dialogButton} onClick={resetGame}>
              Play Again
            </button>
          </dialog>
        )}
      </>
    );
  } else {
    return <></>;
  }
};
export default Game;
