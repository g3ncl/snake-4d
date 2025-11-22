import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SquareProps } from "@/types/props";

const Food = ({
  dimension,
  position = { a: 0, b: 0 },
  scale = 1,
  color = "#ff0000",
}: SquareProps): JSX.Element => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.z += 2 * delta;
  });

  return (
    <mesh ref={meshRef} position={[position.a, position.b, 0]}>
      <circleGeometry args={[(dimension * scale) / Math.sqrt(2), 4]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export default Food;
