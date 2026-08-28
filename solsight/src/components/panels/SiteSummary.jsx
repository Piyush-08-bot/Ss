import useSceneStore, { useSunPosition } from "../../store/useSceneStore";
import { formatHour } from "../../utils/sunPosition";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PANEL_AREA = 1.65 * 0.99;
const PANEL_POWER_KW = 0.4;

function sunExposure(elevation) {
  if (elevation > 45) return { label: "Good", color: "#2D6A4F" };
  if (elevation > 20) return { label: "Partial", color: "#9B6300" };
  if (elevation > 0)  return { label: "Low",     color: "#9B2335" };
  return                     { label: "Night",   color: "#6B6B6B" };
}

function shadowPct(elevation) {
  if (elevation <= 0) return 100;
  if (elevation >= 50) return 5;
  return Math.round(60 - elevation * 1.1);
}

const row = { paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #F0F0F0" };
const label = { fontSize: "11px", color: "#ADADAD", marginBottom: "3px" };
const value = { fontSize: "14px", fontWeight: 600, color: "#242424" };
const subval = { fontSize: "11px", color: "#6B6B6B", marginLeft: "4px", fontWeight: 400 };

export default function SiteSummary() {
  const roofWidth      = useSceneStore((s) => s.roofWidth);
  const roofDepth      = useSceneStore((s) => s.roofDepth);
  const currentTime    = useSceneStore((s) => s.currentTime);
  const selectedMonth  = useSceneStore((s) => s.selectedMonth);
  const selectedDay    = useSceneStore((s) => s.selectedDay);
  const { elevation, azimuth } = useSunPosition();

  const roofArea  = roofWidth * roofDepth;
  const panels    = Math.floor((roofArea * 0.7) / PANEL_AREA);
  const kw        = (panels * PANEL_POWER_KW).toFixed(1);
  const exp       = sunExposure(elevation);
  const shadow    = shadowPct(elevation);
  const elev      = elevation.toFixed(1);
  const az        = azimuth.toFixed(1);

  const compassDir = (az) => {
    const a = parseFloat(az);
    if (a < 22.5 || a >= 337.5) return "N";
    if (a < 67.5)  return "NE";
    if (a < 112.5) return "E";
    if (a < 157.5) return "SE";
    if (a < 202.5) return "S";
    if (a < 247.5) return "SW";
    if (a < 292.5) return "W";
    return "NW";
  };

  return (
    <div style={{ padding: "16px" }}>
      <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "12px" }}>
        Site Summary
      </p>

      <div style={row}>
        <p style={label}>Simulation Date</p>
        <p style={value}>{MONTHS[selectedMonth - 1]} {selectedDay}</p>
      </div>

      <div style={row}>
        <p style={label}>Current Time</p>
        <p style={value}>{formatHour(currentTime)}</p>
      </div>

      <div style={row}>
        <p style={label}>Sun Position</p>
        <div style={{ display: "flex", gap: "12px", marginTop: "2px", flexWrap: "wrap" }}>
          <span style={value}>{elev}°<span style={subval}> elev.</span></span>
          <span style={{ ...value, color: "#6B6B6B", fontWeight: 400 }}>|</span>
          <span style={value}>{az}°<span style={subval}> {compassDir(az)}</span></span>
        </div>
      </div>

      <div style={row}>
        <p style={label}>Roof Area</p>
        <p style={value}>{roofArea} m²</p>
      </div>

      <div style={row}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={label}>Panels</p>
          <span style={{ fontSize: "10px", color: "#ADADAD", fontStyle: "italic" }}>illustrative</span>
        </div>
        <p style={value}>{panels} <span style={subval}>≈ {kw} kW</span></p>
      </div>

      <div style={row}>
        <p style={label}>Sun Exposure</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: exp.color }}>{exp.label}</span>
          <span style={{
            fontSize: "10px", fontWeight: 500, padding: "1px 6px",
            background: exp.color + "18", color: exp.color, borderRadius: "2px",
          }}>
            {elev}°
          </span>
        </div>
      </div>

      <div style={{ paddingTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={label}>Shadow Coverage</p>
          <span style={{ fontSize: "10px", color: "#ADADAD", fontStyle: "italic" }}>approx.</span>
        </div>
        <p style={{ ...value, marginTop: "2px" }}>~{shadow}%</p>
        <div style={{ height: "3px", background: "#EBEBEB", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
          <div style={{
            height: "100%", background: "#242424",
            width: `${shadow}%`,
            transition: "width 0.5s ease",
            borderRadius: "2px",
          }} />
        </div>
      </div>

      <p style={{ fontSize: "10px", color: "#C0C0C0", lineHeight: 1.5, marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F0F0F0" }}>
        Values are illustrative — not engineering-grade estimates.
      </p>
    </div>
  );
}
