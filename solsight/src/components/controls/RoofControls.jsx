/**
 * RoofControls.jsx
 * Simple width + depth inputs for the rooftop.
 * Changing values updates the 3D scene and all calculations live.
 */
import useSceneStore from "../../store/useSceneStore";

const inputStyle = {
  fontSize: "12px",
  fontFamily: "'Inter', sans-serif",
  color: "#242424",
  background: "#F7F6F2",
  border: "1px solid #D8D6D0",
  borderRadius: "2px",
  padding: "4px 6px",
  width: "52px",
  outline: "none",
  textAlign: "center",
};

export default function RoofControls() {
  const roofWidth = useSceneStore((s) => s.roofWidth);
  const roofDepth = useSceneStore((s) => s.roofDepth);
  const set       = useSceneStore.setState;

  const handleWidth = (e) => {
    const v = Math.max(4, Math.min(20, parseInt(e.target.value) || 4));
    set({ roofWidth: v });
  };

  const handleDepth = (e) => {
    const v = Math.max(4, Math.min(20, parseInt(e.target.value) || 4));
    set({ roofDepth: v });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Roof icon */}
      <svg width="14" height="13" viewBox="0 0 24 22" fill="none" stroke="#6B6B6B" strokeWidth="2">
        <polygon points="12,2 22,10 22,20 2,20 2,10" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>

      <div>
        <p style={{ fontSize: "9px", color: "#ADADAD", lineHeight: 1, marginBottom: "2px" }}>Roof (m)</p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="number"
            min={4} max={20}
            value={roofWidth}
            onChange={handleWidth}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#242424")}
            onBlur={(e)  => (e.target.style.borderColor = "#D8D6D0")}
            title="Roof width (metres)"
          />
          <span style={{ fontSize: "11px", color: "#ADADAD" }}>×</span>
          <input
            type="number"
            min={4} max={20}
            value={roofDepth}
            onChange={handleDepth}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#242424")}
            onBlur={(e)  => (e.target.style.borderColor = "#D8D6D0")}
            title="Roof depth (metres)"
          />
          <span style={{ fontSize: "10px", color: "#ADADAD" }}>m</span>
        </div>
      </div>
    </div>
  );
}
