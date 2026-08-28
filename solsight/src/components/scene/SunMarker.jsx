import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSunPosition } from "../../store/useSceneStore";
import { sunPositionToVector } from "../../utils/sunPosition";

export default function SunMarker() {
  const meshRef = useRef();
  const { azimuth, elevation } = useSunPosition();

  const isVisible = elevation > 2;
  const { x, y, z } = sunPositionToVector(azimuth, Math.max(elevation, 0), 38);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!isVisible) return null;

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
