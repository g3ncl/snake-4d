/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SnakeProps } from "@/types/props";

const MAX_SNAKE_LENGTH = 10000;
const tempObject = new THREE.Object3D();
const headColor = new THREE.Color("#ffff00");

const Snake = ({
  dimension,
  snakePosition,
  axis = { a: "x", b: "y" },
  scale = 1,
  color = "#00ff00",
}: SnakeProps): JSX.Element => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bodyColor = React.useMemo(() => new THREE.Color(color), [color]);

  useFrame(() => {
    if (!meshRef.current || !snakePosition.current) return;

    const count = snakePosition.current.length;
    meshRef.current.count = count;

    snakePosition.current.forEach((pos, index) => {
      tempObject.position.set(pos[axis.a], pos[axis.b], 0);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(index, tempObject.matrix);
      meshRef.current!.setColorAt(index, index === 0 ? headColor : bodyColor);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_SNAKE_LENGTH]}
    >
      <planeGeometry args={[dimension * scale, dimension * scale]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
};

export default React.memo(Snake);
