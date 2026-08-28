/**
 * ShadingChart.jsx
 * SVG bar chart showing sun availability % across the day.
 * Tall bar = more useful sunlight. Intuitive like any solar chart.
 * No chart library — pure SVG.
 */
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

  // Closest bar to current time
  const activeIdx = profile.reduce((best, p, i) =>
    Math.abs(p.hour - currentTime) < Math.abs(profile[best].hour - currentTime) ? i : best
  , 0);

  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ADADAD" }}>
          Daily Sun Availability
        </p>
        <p style={{ fontSize: "10px", color: "#ADADAD", fontStyle: "italic" }}>approx.</p>
      </div>

      {/* SVG Chart — tall bar = more sun (intuitive) */}
      <svg width={CHART_W} height={CHART_H} style={{ display: "block", overflow: "visible" }}>
        {/* Baseline */}
        <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#EBEBEB" strokeWidth={1} />

        {profile.map((pt, i) => {
          // Invert: show sun availability (100 - shadow%) so tall = good
          const sunPct = 100 - pt.shadowPct;
          const barH   = (sunPct / 100) * CHART_H;
          const x      = i * (barW + BAR_GAP);
          const y      = CHART_H - barH;

          const isNow    = i === activeIdx;
          const isUseful = pt.elevation > 20;

          // Colors:
          //  Current bar   → charcoal
          //  Elevation>20° → warm amber-ish (useful solar hours)
          //  Low sun       → muted gray
          const fill = isNow
            ? "#242424"
            : isUseful
              ? "#8BA5C4"   // useful solar blue
              : "#D8D4CE";  // low / marginal gray

          return (
            <g key={pt.hour}>
              <rect x={x} y={y} width={barW} height={Math.max(barH, 1)} fill={fill} rx={1} />
              <title>{`${pt.label} — Sun ${sunPct}%, Elevation ${pt.elevation}°`}</title>
            </g>
          );
        })}
      </svg>

      {/* X-axis */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>06:00</span>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>12:00</span>
        <span style={{ fontSize: "9px", color: "#ADADAD", fontFamily: "monospace" }}>18:00</span>
      </div>

      {/* Y-axis hint */}
      <p style={{ fontSize: "9px", color: "#C0C0C0", marginTop: "4px" }}>
        ↑ taller bar = more sunlight at that hour
      </p>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
        <div style={{ width: "8px", height: "8px", background: "#8BA5C4", borderRadius: "1px" }} />
        <span style={{ fontSize: "10px", color: "#6B6B6B" }}>Good solar (&gt;20°)</span>
        <div style={{ width: "8px", height: "8px", background: "#D8D4CE", borderRadius: "1px", marginLeft: "6px" }} />
        <span style={{ fontSize: "10px", color: "#6B6B6B" }}>Low / none</span>
      </div>

      {/* Peak sun hours callout */}
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
