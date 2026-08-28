import { useSunPosition } from "../../store/useSceneStore";
import { sunPositionToVector } from "../../utils/sunPosition";

export default function SunLight() {
  const { azimuth, elevation } = useSunPosition();

  const isVisible  = elevation > -5;
  const clampedEl  = Math.max(elevation, 0);
  const { x, y, z } = sunPositionToVector(azimuth, clampedEl, 50);

  const intensity = isVisible
    ? Math.max(0, Math.sin((clampedEl * Math.PI) / 180)) * 3.5 + 0.5
    : 0;

  return (
    <>
      <ambientLight intensity={0.35} color="#FFF9F0" />
      <hemisphereLight skyColor="#C8E8FF" groundColor="#C8B89A" intensity={0.4} />

      <directionalLight
        position={[x, y, z]}
        intensity={intensity}
        color="#FFF8E7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
        shadow-normalBias={0.003}
      />
    </>
  );
}
