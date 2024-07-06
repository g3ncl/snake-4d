/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SnakeProps } from "@/types/props";

const Snake = ({
  dimension,
  snakePosition,
  axis = { a: "x", b: "y" },
  scale = 1,
  color = "#00ff00",
}: SnakeProps): JSX.Element => {
  const meshRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    if (snakePosition.current) {
      snakePosition.current.forEach((pos, index) => {
        if (!meshRef.current[index]) return;
        meshRef.current[index]!.position.set(pos[axis.a], pos[axis.b], 0);
      });
    }
  });

  return (
    <>
      {snakePosition.current.map((_, index) => (
        <mesh
          key={index}
          // @ts-ignore
          ref={(el) => (meshRef.current[index] = el)}
          position={[0, 0, 0]}
        >
          <planeGeometry args={[dimension * scale, dimension * scale]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </>
  );
};

export default React.memo(Snake);
