import useSceneStore from "../../store/useSceneStore";

const PANEL_W = 1.65;
const PANEL_D = 0.99;
const PANEL_H = 0.05;
const PANEL_GAP_X = 0.15;
const PANEL_GAP_Z = 0.25;
const PANEL_TILT = 0.18;

export default function PanelGrid() {
  const roofWidth = useSceneStore((s) => s.roofWidth);
  const roofDepth = useSceneStore((s) => s.roofDepth);

  const margin = 0.6;
  const usableW = roofWidth - margin * 2;
  const usableD = roofDepth - margin * 2;

  const cols = Math.floor(usableW / (PANEL_W + PANEL_GAP_X));
  const rows = Math.floor(usableD / (PANEL_D + PANEL_GAP_Z));

  const totalW = cols * (PANEL_W + PANEL_GAP_X) - PANEL_GAP_X;
  const totalD = rows * (PANEL_D + PANEL_GAP_Z) - PANEL_GAP_Z;
  const startX = -totalW / 2 + PANEL_W / 2;
  const startZ = -totalD / 2 + PANEL_D / 2;

  const panels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (PANEL_W + PANEL_GAP_X);
      const z = startZ + r * (PANEL_D + PANEL_GAP_Z);
      panels.push({ x, z, key: `${r}-${c}` });
    }
  }

  return (
    <group>
      {panels.map(({ x, z, key }) => (
        <group key={key} position={[x, 0.04, z]} rotation={[-PANEL_TILT, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[PANEL_W, PANEL_H, PANEL_D]} />
            <meshLambertMaterial color="#2C3E6E" />
          </mesh>
          <mesh position={[0, PANEL_H / 2 + 0.001, 0]} receiveShadow>
            <planeGeometry args={[PANEL_W - 0.04, PANEL_D - 0.04]} />
            <meshPhongMaterial
              color="#1A2B52"
              shininess={40}
              specular="#6688BB"
            />
          </mesh>
          <mesh
            position={[0, -0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
          >
            <boxGeometry args={[PANEL_W - 0.1, 0.06, 0.06]} />
            <meshLambertMaterial color="#888" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
