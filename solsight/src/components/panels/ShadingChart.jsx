import { useMemo } from "react";
import useSceneStore from "../../store/useSceneStore";
import { getDailyShadingProfile, getPeakSunHours } from "../../utils/shadingAnalysis";

const CHART_W = 224;
const CHART_H = 80;
const BAR_GAP = 1;

export default function ShadingChart() {
  const lat           = useSceneStore((s) => s.lat);
  const lon           = useSceneStore((s) => s.lon);
  const selectedMonth = useSceneStore((s) => s.selectedMonth);
  const selectedDay   = useSceneStore((s) => s.selectedDay);
  const currentTime   = useSceneStore((s) => s.currentTime);

  const profile = useMemo(
    () => getDailyShadingProfile(lat, lon, selectedMonth, selectedDay),
    [lat, lon, selectedMonth, selectedDay]
  );

  const peakSunHours = useMemo(() => getPeakSunHours(profile), [profile]);

  const barCount = profile.length;
  const barW = (CHART_W - BAR_GAP * (barCount - 1)) / barCount;

  const activeIdx = profile.reduce((best, p, i) =>
    Math.abs(p.hour - currentTime) < Math.abs(profile[best].hour - currentTime) ? i : best
  , 0);

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ADADAD" }}>
          Daily Sun Availability
        </p>
        <p style={{ fontSize: "10px", color: "#ADADAD", fontStyle: "italic" }}>approx.</p>
      </div>

      <svg width={CHART_W} height={CHART_H} style={{ display: "block", overflow: "visible" }}>
        <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#EBEBEB" strokeWidth={1} />

        {profile.map((pt, i) => {
          const sunPct = 100 - pt.shadowPct;
          const barH   = (sunPct / 100) * CHART_H;
          const x      = i * (barW + BAR_GAP);
          const y      = CHART_H - barH;

          const isNow    = i === activeIdx;
          const isUseful = pt.elevation > 20;

          const fill = isNow
            ? "#242424"
            : isUseful
              ? "#8BA5C4"
              : "#D8D4CE";

          return (
            <g key={pt.hour}>
              <rect x={x} y={y} width={barW} height={Math.max(barH, 1)} fill={fill} rx={1} />
              <title>{`${pt.label} — Sun ${sunPct}%, Elevation ${pt.elevation}°`}</title>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>06:00</span>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>12:00</span>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>18:00</span>
      </div>

      <p style={{ fontSize: "9px", color: "#C0C0C0", marginTop: "4px" }}>
        ↑ taller bar = more sunlight at that hour
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
        <div style={{ width: "8px", height: "8px", background: "#8BA5C4", borderRadius: "1px" }} />
        <span style={{ fontSize: "10px", color: "#6B6B6B" }}>Good solar (&gt;20°)</span>
        <div style={{ width: "8px", height: "8px", background: "#D8D4CE", borderRadius: "1px", marginLeft: "6px" }} />
        <span style={{ fontSize: "10px", color: "#6B6B6B" }}>Low / none</span>
      </div>

      <div style={{
        marginTop: "10px",
        padding: "8px 10px",
        background: "#F7F6F2",
        borderRadius: "3px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <p style={{ fontSize: "10px", color: "#ADADAD", marginBottom: "1px" }}>Peak sun hours</p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#242424", lineHeight: 1 }}>
            {peakSunHours}
            <span style={{ fontSize: "11px", fontWeight: 400, color: "#6B6B6B", marginLeft: "3px" }}>hrs/day</span>
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "10px", color: "#ADADAD", marginBottom: "1px" }}>Elevation &gt; 20°</p>
          <p style={{ fontSize: "10px", color: "#ADADAD", fontStyle: "italic" }}>illustrative</p>
        </div>
      </div>
    </div>
  );
}
