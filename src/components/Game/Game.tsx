"use client";
import React, { useEffect, useRef, useState } from "react";
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
import Dialog, { DialogButton } from "../Dialog/Dialog";
import useSound from "@/hooks/useSound";
import { useSettings } from "@/context/SettingsContext";
import { triggerVibration } from "@/utils/vibration";
import { GAME_SETTINGS } from "@/config/constants";

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

const Game = (): React.JSX.Element => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [direction, setDirection] = useState<Direction | undefined>(undefined);
  const [snakePosition, setSnakePosition] = useState<Position[]>([
    { x: 0, y: 0, z: 0, w: 0 },
  ]);
  const [foodPosition, setFoodPosition] = useState<Position>(
    generateFoodPosition(GAME_SETTINGS.FIELD_DIMENSION),
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

  const playEatingSound = useSound("/assets/eating.mp3");
  const { isSoundEnabled, isVibrationEnabled } = useSettings();

  const { isFromTelegram, telegramUserId, telegramMessageId } =
    useTelegramCheck();

  const [controllerType, setControllerType] =
    useState<ControllerType>("Touchpad");

  const updateRotation = (label: string, value: number) => {
    setRotation((prev) => ({ ...prev, [label]: value }));
  };

  const updateControllerType = (type: ControllerType) => {
    setControllerType(type);
    localStorage.setItem("controllerType", type);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorialShown", "true");
    }
  };

  const resetGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setDirection(undefined);
    directionRef.current = undefined;
    setSnakePosition([{ x: 0, y: 0, z: 0, w: 0 }]);
    snakePositionRef.current = [{ x: 0, y: 0, z: 0, w: 0 }];
    setGameOver(false);
    let newFoodPosition = generateFoodPosition(GAME_SETTINGS.FIELD_DIMENSION);
    foodPositionRef.current = newFoodPosition;
    setFoodPosition(newFoodPosition);
    intervalRef.current = setInterval(() => {
      if (directionRef.current && snakePositionRef.current) {
        let newSnakePositions = updateSnakePosition(
          snakePositionRef.current,
          directionRef.current.axis,
          GAME_SETTINGS.FIELD_DIMENSION,
          directionRef.current.delta,
        );
        snakePositionRef.current = newSnakePositions;
        setSnakePosition(newSnakePositions);
      }
    }, GAME_SETTINGS.TICK_RATE);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tutorialShown = localStorage.getItem("tutorialShown");
      if (tutorialShown) {
        setShowTutorial(false);
      }
    }
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    // Fixing the hydration error due to conditional rendering.
    // The game component is initially rendered without isMobile beeing initialized,
    // which triggers the hydration error.
    setIsMounted(true);
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
      if (isSoundEnabled) {
        playEatingSound();
      }
      if (isVibrationEnabled) {
        triggerVibration();
      }
      let pos = snakePositionRef.current;
      pos.push(
        updateSnakeBlockPosition(
          pos.at(-1)!,
          directionRef.current.axis,
          GAME_SETTINGS.FIELD_DIMENSION,
          (directionRef.current.delta * -1) as -1 | 1,
        ),
      );
      let newFoodPosition = generateFoodPosition(GAME_SETTINGS.FIELD_DIMENSION);

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
    if (showTutorial) return; // Pause game loop during tutorial
    intervalRef.current = setInterval(() => {
      if (directionRef.current && snakePositionRef.current) {
        let newSnakePositions = updateSnakePosition(
          snakePositionRef.current,
          directionRef.current.axis,
          GAME_SETTINGS.FIELD_DIMENSION,
          directionRef.current.delta,
        );
        snakePositionRef.current = newSnakePositions;
        setSnakePosition(newSnakePositions);
      }
    }, GAME_SETTINGS.TICK_RATE);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [showTutorial]);

  const handleSetDirection = (direction: Direction) => {
    if (snakePositionRef.current.length === 1) {
      setDirection(direction);
    } else if (!isOppositeDirection(directionRef.current, direction)) {
      setDirection(direction);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (showTutorial) return;
      const pressedKey = event.key.toLowerCase();
      let direction = keyMap[pressedKey];
      if (!direction) return;
      handleSetDirection(direction);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTutorial]);

  const handleAction = (direction: Direction) => {
    if (showTutorial) return;
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
                  dimension={GAME_SETTINGS.FIELD_DIMENSION}
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
        <Dialog open={showTutorial}>
          <h3>How to Play</h3>
          <p>
            <strong>Desktop:</strong> Use <b>WASD</b> for XY axis (Left Box) and{" "}
            <b>IJKL</b> for ZW axis (Right Box).
          </p>
          <p>
            <strong>Mobile:</strong> Use the left controller for XY axis and the
            right controller for ZW axis.
          </p>
          <p>
            To eat food in 4D space, your head must align with the food in{" "}
            <b>BOTH</b> boxes (XY & ZW), meaning all 4 axes.
          </p>
          <DialogButton onClick={closeTutorial}>Start Game</DialogButton>
        </Dialog>
        <Dialog open={gameOver}>
          <span>Game Over!</span>
          <span>Score: {score}</span>
          <DialogButton onClick={resetGame}>Play Again</DialogButton>
        </Dialog>
      </>
    );
  } else {
    return <></>;
  }
};
export default Game;
