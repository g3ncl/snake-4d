import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { generateVertices4D } from "@/utils/generate";
import { projectVerticesTo3D } from "@/utils/projection";
import {
  rotationXW,
  rotationXY,
  rotationXZ,
  rotationYW,
  rotationYZ,
  rotationZW,
} from "@/utils/rotation";
import { useFrame } from "@react-three/fiber";
import { TesseractProps } from "@/types/props";

const DISTANCE = 40;

const Tesseract = ({
  dimension,
  color,
  scale = 1,
  rotation = { xy: 0, xw: 0, xz: 0, yw: 0, yz: 0, zw: 0 },
}: TesseractProps): React.JSX.Element => {
  const lineRef = useRef<THREE.LineSegments | null>(null);
  const geometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const projectedPositionRef = useRef<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );
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

  useEffect(() => {
    material.current.color = new THREE.Color(color);
  }, [color]);

  useFrame(() => {
    const [vertices4D, edges] = generateVertices4D(
      (dimension / 2) * scale,
      rotationMatrices,
    );

    const vertices3D = projectVerticesTo3D(vertices4D, DISTANCE);

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

    if (!lineRef.current) {
      lineRef.current = new THREE.LineSegments(geometry.current);
    } else {
      lineRef.current.geometry.dispose();
      lineRef.current.geometry = geometry.current;
      lineRef.current.position.x = projectedPositionRef.current.x;
      lineRef.current.position.y = projectedPositionRef.current.y;
      lineRef.current.position.z = projectedPositionRef.current.z;
    }
  });
  return <lineSegments ref={lineRef} material={material.current} />;
};

export default Tesseract;
