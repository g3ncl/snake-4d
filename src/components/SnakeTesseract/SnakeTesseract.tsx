import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { generateVertices4D } from "@/utils/generate";
import { project4dTo3d, projectVerticesTo3D } from "@/utils/projection";
import {
  rotateVertex,
  rotationXW,
  rotationXY,
  rotationXZ,
  rotationYW,
  rotationYZ,
  rotationZW,
} from "@/utils/rotation";
import { useFrame } from "@react-three/fiber";
import { SnakeTesseractProps } from "@/types/props";

const DISTANCE = 40;

const SnakeTesseract = ({
  dimension,
  positions,
  scale = 1,
  color = "#00ff00",
  rotation = { xy: 0, xw: 0, xz: 0, yw: 0, yz: 0, zw: 0 },
}: SnakeTesseractProps): JSX.Element => {
  const linesRef = useRef<THREE.Group>(new THREE.Group());
  const geometries = useRef<THREE.BufferGeometry[]>([]);
  const projectedPositions = useRef<THREE.Vector3[]>([]);
  const material = useRef(new THREE.LineBasicMaterial({ color: color }));

  const rotationMatrices: number[][][] = useMemo(() => {
    const { xy, xw, xz, yw, yz, zw } = rotation;
    return [
      rotationXY(xy),
      rotationXZ(xz),
      rotationXW(xw),
      rotationYW(yw),
      rotationYZ(yz),
      rotationZW(zw),
    ];
  }, [rotation]);

  const [vertices3D, edges] = useMemo(() => {
    const [vertices4D, edges] = generateVertices4D(
      (dimension / 2) * scale,
      rotationMatrices,
    );
    const vertices3D = projectVerticesTo3D(vertices4D, DISTANCE);
    return [vertices3D, edges];
  }, [scale, rotationMatrices, dimension]);

  useFrame(() => {
    positions.current.forEach((position, index) => {
      let rotatedPosition = [position.x, position.y, position.z, position.w];
      rotationMatrices.forEach((rotationMatrix) => {
        rotatedPosition = rotateVertex(rotatedPosition, rotationMatrix);
      });
      projectedPositions.current[index] = project4dTo3d(
        rotatedPosition,
        DISTANCE,
      );

      const positions: number[] = [];
      edges.forEach((edge) => {
        const [start, end] = edge;
        positions.push(
          vertices3D[start].x,
          vertices3D[start].y,
          vertices3D[start].z,
        );
        positions.push(vertices3D[end].x, vertices3D[end].y, vertices3D[end].z);
      });

      if (!geometries.current[index]) {
        geometries.current[index] = new THREE.BufferGeometry();
      }

      geometries.current[index].setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );

      if (!linesRef.current.children[index]) {
        const line = new THREE.LineSegments(
          geometries.current[index],
          material.current,
        );
        linesRef.current.add(line);
      } else {
        (linesRef.current.children[index] as THREE.LineSegments).geometry =
          geometries.current[index];
      }

      if (projectedPositions.current[index]) {
        linesRef.current.children[index].position.copy(
          projectedPositions.current[index],
        );
      }
    });
    // Remove excess line segments if positions array has shrunk
    while (linesRef.current.children.length > positions.current.length) {
      const lastChild =
        linesRef.current.children[linesRef.current.children.length - 1];
      linesRef.current.remove(lastChild);
      (lastChild as THREE.LineSegments).geometry.dispose();
    }
  });

  return <group ref={linesRef} />;
};

export default SnakeTesseract;
