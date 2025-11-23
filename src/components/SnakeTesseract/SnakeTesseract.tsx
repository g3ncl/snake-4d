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
}: SnakeTesseractProps): React.JSX.Element => {
  const linesRef = useRef<THREE.Group>(new THREE.Group());
  const projectedPositions = useRef<THREE.Vector3[]>([]);

  // Shared resources
  const sharedGeometry = useRef(new THREE.BufferGeometry());
  const material = useRef(new THREE.LineBasicMaterial({ color: color }));
  const headMaterial = useRef(
    new THREE.LineBasicMaterial({ color: "#ffff00" }),
  );

  useEffect(() => {
    material.current.color.set(color);
  }, [color]);

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

  useEffect(() => {
    const geoPositions: number[] = [];
    edges.forEach((edge) => {
      const [start, end] = edge;
      geoPositions.push(
        vertices3D[start].x,
        vertices3D[start].y,
        vertices3D[start].z,
      );
      geoPositions.push(
        vertices3D[end].x,
        vertices3D[end].y,
        vertices3D[end].z,
      );
    });

    sharedGeometry.current.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(geoPositions, 3),
    );
    sharedGeometry.current.attributes.position.needsUpdate = true;
  }, [vertices3D, edges]);

  useFrame(() => {
    // Update Instances
    positions.current.forEach((position, index) => {
      let rotatedPosition = [position.x, position.y, position.z, position.w];
      rotationMatrices.forEach((rotationMatrix) => {
        rotatedPosition = rotateVertex(rotatedPosition, rotationMatrix);
      });

      const pos3D = project4dTo3d(rotatedPosition, DISTANCE);

      // Ensure child exists
      if (!linesRef.current.children[index]) {
        const line = new THREE.LineSegments(
          sharedGeometry.current,
          index === 0 ? headMaterial.current : material.current,
        );
        linesRef.current.add(line);
      }

      const lineSegment = linesRef.current.children[
        index
      ] as THREE.LineSegments;

      // Ensure it's using the shared geometry (in case logic drifted, though it shouldn't)
      if (lineSegment.geometry !== sharedGeometry.current) {
        lineSegment.geometry = sharedGeometry.current;
      }

      // Ensure correct material (Head vs Body)
      const targetMaterial =
        index === 0 ? headMaterial.current : material.current;
      if (lineSegment.material !== targetMaterial) {
        lineSegment.material = targetMaterial;
      }

      lineSegment.position.copy(pos3D);
      lineSegment.visible = true;
    });

    // 3. Hide excess children
    // Instead of removing/disposing, we just hide them to pool objects.
    // This reduces GC overhead.
    for (
      let i = positions.current.length;
      i < linesRef.current.children.length;
      i++
    ) {
      linesRef.current.children[i].visible = false;
    }
  });

  return <group ref={linesRef} />;
};

export default SnakeTesseract;
