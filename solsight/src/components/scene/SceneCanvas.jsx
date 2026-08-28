import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import Roof from "./Roof";
import PanelGrid from "./PanelGrid";
import Obstacle from "./Obstacle";
import SunLight from "./SunLight";
import SunMarker from "./SunMarker";
import { useSunPosition } from "../../store/useSceneStore";

const OBSTACLES = [
  { id: 1, type: "watertank", position: [3.5, 0, 2.5], height: 1.8, radius: 0.55 },
  { id: 2, type: "structure", position: [-3.2, 0, -2.0], height: 1.4, radius: 0.7 },
];

function SceneInner({ mini }) {
  const { elevation } = useSunPosition();
  const turbidity = Math.max(1, 10 - elevation * 0.08);
  const rayleigh = elevation > 10 ? 1.2 : 3;

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[0, elevation > 0 ? 1 : -1, 0]}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <SunLight />
      <Roof />
      <PanelGrid />
      {OBSTACLES.map((obs) => (
        <Obstacle key={obs.id} {...obs} />
      ))}
      <SunMarker />
      {mini ? (
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          autoRotate
          autoRotateSpeed={0.6}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0.5, 0]}
        />
      ) : (
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={5}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.5, 0]}
        />
      )}
    </>
  );
}

export default function SceneCanvas({ mini = false }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{
        position: mini ? [8, 6, 10] : [12, 9, 14],
        fov: mini ? 38 : 42,
        near: 0.1,
        far: 500,
      }}
      style={{ background: "#D8E8F2" }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <SceneInner mini={mini} />
      </Suspense>
    </Canvas>
  );
}
