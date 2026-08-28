/**
 * SunLight.jsx
 * DirectionalLight positioned at the computed sun location.
 *
 * Shadow settings tuned:
 * - normalBias & bias set precisely to keep shadows attached firmly to building bases.
 * - frustum tuned to cover scene naturally without detachment or floating.
 */
import { useSunPosition } from "../../store/useSceneStore";
import { sunPositionToVector } from "../../utils/sunPosition";

export default function SunLight() {
  const { azimuth, elevation } = useSunPosition();

  const isVisible  = elevation > -5;
  const clampedEl  = Math.max(elevation, 0);
  const { x, y, z } = sunPositionToVector(azimuth, clampedEl, 50);

  // Intensity: full at noon, tapers toward dawn/dusk
  const intensity = isVisible
    ? Math.max(0, Math.sin((clampedEl * Math.PI) / 180)) * 3.5 + 0.5
    : 0;

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.35} color="#FFF9F0" />

      {/* Hemisphere sky/ground fill */}
      <hemisphereLight skyColor="#C8E8FF" groundColor="#C8B89A" intensity={0.4} />

      {/* Directional sun light */}
      <directionalLight
        position={[x, y, z]}
        intensity={intensity}
        color="#FFF8E7"
        castShadow

        // Shadow map resolution
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}

        // Camera frustum covering the rooftop & ground correctly
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}

        // Precision bias settings: keeps shadow anchored to building (no floating)
        shadow-bias={-0.0001}
        shadow-normalBias={0.003}
      />
    </>
  );
}
