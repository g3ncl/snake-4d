import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SnakeProps } from "@/types/props";
import { COLORS } from "@/config/constants";

const MAX_SNAKE_LENGTH = 10000;
const tempObject = new THREE.Object3D();
const headColor = new THREE.Color(COLORS.SNAKE.HEAD);

const Snake = ({
  dimension,
  snakePosition,
  axis = { a: "x", b: "y" },
  scale = 1,
  color = COLORS.SNAKE.BODY,
}: SnakeProps): React.JSX.Element => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bodyColor = React.useMemo(() => new THREE.Color(color), [color]);

  useFrame(() => {
    if (!meshRef.current || !snakePosition.current) return;

    const positions = snakePosition.current;
    const count = positions.length;
    meshRef.current.count = count;

    positions.forEach((pos, index) => {
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
