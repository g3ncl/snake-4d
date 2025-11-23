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

const GameVisualization = ({
  dimension,
  snakePosition,
  foodPosition,
  rotation,
}: GameVisualizationProps): React.JSX.Element => {
  const { theme, systemTheme } = useTheme();
  const [lineColor, setLineColor] = useState("#666");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setLineColor(currentTheme === "dark" ? "#d0d0d0" : "#666");
  }, [theme, systemTheme]);
  return (
    <>
      <div className={styles.topHalf}>
        <Canvas camera={{ position: [0, 0, 18], fov: 75 }}>
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
          <Canvas
            className={styles.canvas}
            camera={{ position: [0, 0, 10], fov: 75 }}
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
              axis={{ a: "x", b: "y" }}
            />
          </Canvas>
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.canvasLabel}>ZW Axis</div>
          <Canvas
            className={styles.canvas}
            camera={{ position: [0, 0, 10], fov: 75 }}
          >
            <Square dimension={dimension} color={lineColor} />
            <Food
              dimension={1}
              scale={0.5}
              position={{
                a: foodPosition.current.z,
                b: foodPosition.current.w,
              }}
              color="#ff0000"
            />
            <Snake
              dimension={1}
              snakePosition={snakePosition}
              axis={{ a: "z", b: "w" }}
              color="#00ff00"
            />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default GameVisualization;
