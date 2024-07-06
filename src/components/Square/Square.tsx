import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SquareProps } from "@/types/props";

const Square = ({
  dimension,
  position = { a: 0, b: 0 },
  scale = 1,
  color = "#eeeeee",
}: SquareProps): JSX.Element => {
  const lineRef = useRef<THREE.LineSegments>(null!);
  const material = useRef(new THREE.LineBasicMaterial({ color: color }));
  const geometry = useRef<THREE.PlaneGeometry>(
    new THREE.PlaneGeometry(dimension * scale, dimension * scale, 2, 2),
  );

  useEffect(() => {
    material.current.color = new THREE.Color(color);
  }, [color]);

  useEffect(() => {
    const { a, b } = position;
    lineRef.current.position.x = a;
    lineRef.current.position.y = b;
    lineRef.current.material = material.current;
  }, [position]);

  useFrame(() => {});

  return (
    <lineSegments ref={lineRef}>
      <edgesGeometry args={[geometry.current]} />
    </lineSegments>
  );
};

export default React.memo(Square);
