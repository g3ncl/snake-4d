import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { generateDiamond4D } from "@/utils/generate";
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
import { TesseractFoodProps } from "@/types/props";

const DISTANCE = 40;

const FoodTesseract = ({
  dimension,
  position,
  scale = 1,
  color = "#ff0000",
  rotation = { xy: 0, xw: 0, xz: 0, yw: 0, yz: 0, zw: 0 },
}: TesseractFoodProps): React.JSX.Element => {
  const line = useRef<THREE.LineSegments | null>(null);
  const geometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const projectedPosition = useRef<THREE.Vector3 | undefined>(undefined);
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
    const [vertices4D, edges] = generateDiamond4D(
      (dimension / 2) * scale,
      rotationMatrices,
    );
    const vertices3D = projectVerticesTo3D(vertices4D, DISTANCE);
    return [vertices3D, edges];
  }, [scale, rotationMatrices, dimension]);

  useFrame(() => {
    let rotatedPosition = [
      position.current.x,
      position.current.y,
      position.current.z,
      position.current.w,
    ];

    rotationMatrices.forEach((rotationMatrix) => {
      rotatedPosition = rotateVertex(rotatedPosition, rotationMatrix);
    });

    projectedPosition.current = project4dTo3d(rotatedPosition, DISTANCE);

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

    geometry.current.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    if (!line.current) {
      line.current = new THREE.LineSegments(geometry.current);
    } else {
      line.current.geometry.dispose();
      line.current.geometry = geometry.current;
    }
    if (projectedPosition) {
      line.current.position.copy(projectedPosition.current);
    }
  });

  return <lineSegments ref={line} material={material.current} />;
};

export default FoodTesseract;
