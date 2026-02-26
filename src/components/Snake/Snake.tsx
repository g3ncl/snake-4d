import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SnakeProps } from "@/types/props";
import { Position } from "@/types/types";
import { COLORS } from "@/config/constants";

const MAX_SNAKE_LENGTH = 10000;
const tempObject = new THREE.Object3D();
const headColor = new THREE.Color(COLORS.SNAKE.HEAD);

function getHiddenAxes(axis: { a: string; b: string }): (keyof Position)[] {
  const all: (keyof Position)[] = ["x", "y", "z", "w"];
  return all.filter((a) => a !== axis.a && a !== axis.b);
}

const Snake = ({
  dimension,
  snakePosition,
  axis = { a: "x", b: "y" },
  scale = 1,
  color = COLORS.SNAKE.BODY,
}: SnakeProps): React.JSX.Element => {
  const opaqueMeshRef = useRef<THREE.InstancedMesh>(null);
  const ghostMeshRef = useRef<THREE.InstancedMesh>(null);
  const bodyColor = React.useMemo(() => new THREE.Color(color), [color]);
  const hiddenAxes = React.useMemo(() => getHiddenAxes(axis), [axis]);

  useFrame(() => {
    if (!opaqueMeshRef.current || !ghostMeshRef.current || !snakePosition.current) return;

    const positions = snakePosition.current;
    const head = positions[0];

    let opaqueCount = 0;
    let ghostCount = 0;

    positions.forEach((pos, index) => {
      const isHead = index === 0;
      const samePlane = isHead || hiddenAxes.every((ax) => pos[ax] === head[ax]);

      tempObject.position.set(pos[axis.a], pos[axis.b], 0);
      tempObject.updateMatrix();

      if (samePlane) {
        opaqueMeshRef.current!.setMatrixAt(opaqueCount, tempObject.matrix);
        opaqueMeshRef.current!.setColorAt(opaqueCount, isHead ? headColor : bodyColor);
        opaqueCount++;
      } else {
        ghostMeshRef.current!.setMatrixAt(ghostCount, tempObject.matrix);
        ghostMeshRef.current!.setColorAt(ghostCount, bodyColor);
        ghostCount++;
      }
    });

    opaqueMeshRef.current.count = opaqueCount;
    ghostMeshRef.current.count = ghostCount;

    opaqueMeshRef.current.instanceMatrix.needsUpdate = true;
    if (opaqueMeshRef.current.instanceColor) {
      opaqueMeshRef.current.instanceColor.needsUpdate = true;
    }
    ghostMeshRef.current.instanceMatrix.needsUpdate = true;
    if (ghostMeshRef.current.instanceColor) {
      ghostMeshRef.current.instanceColor.needsUpdate = true;
    }
  });

  const dim = dimension * scale;

  return (
    <>
      <instancedMesh ref={opaqueMeshRef} args={[undefined, undefined, MAX_SNAKE_LENGTH]}>
        <planeGeometry args={[dim, dim]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
      <instancedMesh ref={ghostMeshRef} args={[undefined, undefined, MAX_SNAKE_LENGTH]}>
        <planeGeometry args={[dim, dim]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </instancedMesh>
    </>
  );
};

export default React.memo(Snake);
