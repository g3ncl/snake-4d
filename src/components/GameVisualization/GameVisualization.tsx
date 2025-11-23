"use client";
import { Canvas } from "@react-three/fiber";
import Square from "@/components/Square/Square";
import Snake from "@/components/Snake/Snake";
import Food from "@/components/Food/Food";
import Tesseract from "@/components/Tesseract/Tesseract";
import SnakeTesseract from "@/components/SnakeTesseract/SnakeTesseract";
import FoodTesseract from "@/components/FoodTesseract/FoodTesseract";

import { GameVisualizationProps } from "@/types/props";
import styles from "./styles/styles.module.css";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { COLORS, GAME_SETTINGS, LAYOUT } from "@/config/constants";

const XY_AXIS = { a: "x", b: "y" } as const;
const ZW_AXIS = { a: "z", b: "w" } as const;

const GameVisualization = ({
  dimension,
  snakePosition,
  foodPosition,
  rotation,
}: GameVisualizationProps): React.JSX.Element => {
  const { theme, systemTheme } = useTheme();
  const [lineColor, setLineColor] = useState(COLORS.GRID.LIGHT);

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setLineColor(
      currentTheme === "dark" ? COLORS.GRID.DARK : COLORS.GRID.LIGHT,
    );
  }, [theme, systemTheme]);

  const fov = GAME_SETTINGS.FOV;
  // Calculate distance to fit the dimension with some padding
  // formula: distance = (height / 2) / tan(fov / 2)
  const cameraDistance =
    (dimension / (2 * Math.tan((fov * Math.PI) / 360))) * LAYOUT.ZOOM_PADDING;

  return (
    <>
      <div className={styles.topHalf}>
        <Canvas camera={{ position: [0, 0, 18], fov: fov }}>
          <Tesseract
            dimension={dimension}
            scale={1}
            rotation={rotation}
            color={lineColor}
          />
          <FoodTesseract
            dimension={dimension}
            position={foodPosition}
            scale={0.1}
            rotation={rotation}
          />
          <SnakeTesseract
            dimension={dimension}
            positions={snakePosition}
            scale={0.1}
            rotation={rotation}
          />
        </Canvas>
      </div>
      <div className={styles.bottomHalf}>
        <div className={styles.bottomLeft}>
          <div className={styles.canvasLabel}>XY Axis</div>
          <div className={styles.canvasContainer}>
            <Canvas
              className={styles.canvas}
              camera={{ position: [0, 0, cameraDistance], fov: fov }}
            >
              <Square dimension={dimension} color={lineColor} />
              <Food
                scale={0.5}
                dimension={1}
                position={{
                  a: foodPosition.current.x,
                  b: foodPosition.current.y,
                }}
              />
              <Snake
                dimension={1}
                snakePosition={snakePosition}
                axis={XY_AXIS}
              />
            </Canvas>
          </div>
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.canvasLabel}>ZW Axis</div>
          <div className={styles.canvasContainer}>
            <Canvas
              className={styles.canvas}
              camera={{ position: [0, 0, cameraDistance], fov: fov }}
            >
              <Square dimension={dimension} color={lineColor} />
              <Food
                dimension={1}
                scale={0.5}
                position={{
                  a: foodPosition.current.z,
                  b: foodPosition.current.w,
                }}
                color={COLORS.FOOD}
              />
              <Snake
                dimension={1}
                snakePosition={snakePosition}
                axis={ZW_AXIS}
                color={COLORS.SNAKE.BODY}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameVisualization;
