/**
 * Roof.jsx
 * A flat rectangular rooftop plane with a subtle concrete material.
 */
import useSceneStore from "../../store/useSceneStore";

export default function Roof() {
  const roofWidth = useSceneStore((s) => s.roofWidth);
  const roofDepth = useSceneStore((s) => s.roofDepth);

  return (
    <group>
      {/* Main flat roof surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roofWidth, roofDepth]} />
        <meshLambertMaterial color="#C8C2B8" />
      </mesh>

      {/* Parapet wall — North */}
      <mesh position={[0, 0.2, -roofDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[roofWidth + 0.3, 0.4, 0.25]} />
        <meshLambertMaterial color="#B8B2A8" />
      </mesh>
      {/* Parapet wall — South */}
      <mesh position={[0, 0.2, roofDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[roofWidth + 0.3, 0.4, 0.25]} />
        <meshLambertMaterial color="#B8B2A8" />
      </mesh>
      {/* Parapet wall — East */}
      <mesh position={[roofWidth / 2, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, 0.4, roofDepth]} />
        <meshLambertMaterial color="#B8B2A8" />
      </mesh>
      {/* Parapet wall — West */}
      <mesh position={[-roofWidth / 2, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, 0.4, roofDepth]} />
        <meshLambertMaterial color="#B8B2A8" />
      </mesh>

      {/* Ground plane below (receives shadows only) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <meshLambertMaterial color="#D4D0C8" />
      </mesh>

      {/* Simple building body below roof */}
      <mesh position={[0, -1.75, 0]}>
        <boxGeometry args={[roofWidth + 0.3, 3.5, roofDepth + 0.3]} />
        <meshLambertMaterial color="#D8D2C6" />
      </mesh>
    </group>
  );
}
