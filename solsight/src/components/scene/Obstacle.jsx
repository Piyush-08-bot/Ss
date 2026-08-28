/**
 * Obstacle.jsx
 * A simple rooftop obstacle (water tank or small structure).
 * Casts and receives shadows.
 */

/**
 * @param {{ type: 'watertank'|'structure', position: [x,y,z], height: number, radius?: number }} props
 */
export default function Obstacle({ type, position, height, radius = 0.6 }) {
  const [x, , z] = position;
  const y = height / 2; // sits on the roof

  if (type === "watertank") {
    return (
      <group position={[x, y, z]} castShadow>
        {/* Cylinder tank body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, height, 16]} />
          <meshLambertMaterial color="#9EA8A0" />
        </mesh>
        {/* Flat lid */}
        <mesh position={[0, height / 2 + 0.04, 0]} castShadow>
          <cylinderGeometry args={[radius + 0.04, radius + 0.04, 0.08, 16]} />
          <meshLambertMaterial color="#8A9690" />
        </mesh>
        {/* Pipe */}
        <mesh position={[radius * 0.5, height / 2 + 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshLambertMaterial color="#777" />
        </mesh>
      </group>
    );
  }

  // Default: rectangular rooftop structure (AC unit / staircase housing)
  const w = radius * 2.5;
  const d = radius * 2;
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, height, d]} />
        <meshLambertMaterial color="#B0ACA4" />
      </mesh>
      {/* Slight roof on the structure */}
      <mesh position={[0, height / 2 + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.1, 0.12, d + 0.1]} />
        <meshLambertMaterial color="#A0988E" />
      </mesh>
    </group>
  );
}
