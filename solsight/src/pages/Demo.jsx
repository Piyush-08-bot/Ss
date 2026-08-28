import { Suspense } from "react";
import { Link } from "react-router-dom";
import SceneCanvas from "../components/scene/SceneCanvas";
import TimeSlider from "../components/controls/TimeSlider";
import LocationPicker from "../components/controls/LocationPicker";
import DatePicker from "../components/controls/DatePicker";
import RoofControls from "../components/controls/RoofControls";
import SiteSummary from "../components/panels/SiteSummary";
import EnvironmentCard from "../components/panels/EnvironmentCard";
import ShadingChart from "../components/panels/ShadingChart";

export default function Demo() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#F0EFE9",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      <header style={{
        flexShrink: 0,
        height: "56px",
        borderBottom: "1px solid #D8D6D0",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 10,
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Link to="/" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: "14px",
            letterSpacing: "-0.02em", color: "#242424",
            textDecoration: "none",
          }}>
            SolSight
          </Link>
          <span style={{ color: "#D8D6D0", fontSize: "12px" }}>|</span>
          <span style={{ fontSize: "12px", color: "#6B6B6B" }}>3D Solar Visualization</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <RoofControls />
          <div style={{ width: "1px", height: "32px", background: "#EBEBEB" }} />
          <DatePicker />
          <div style={{ width: "1px", height: "32px", background: "#EBEBEB" }} />
          <LocationPicker />
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <Suspense fallback={
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#E0DEDB",
            }}>
              <p style={{ fontSize: "13px", color: "#6B6B6B" }}>Loading scene…</p>
            </div>
          }>
            <SceneCanvas />
          </Suspense>

          <div style={{
            position: "absolute", bottom: "16px", left: "16px",
            pointerEvents: "none",
          }}>
            <p style={{
              fontSize: "10px", color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.25)",
              padding: "4px 8px", borderRadius: "2px",
            }}>
              Drag to rotate · Scroll to zoom · Right-drag to pan
            </p>
          </div>
        </div>

        <aside style={{
          flexShrink: 0,
          width: "256px",
          borderLeft: "1px solid #D8D6D0",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
          <SiteSummary />
          <div style={{ borderTop: "1px solid #EBEBEB" }}>
            <ShadingChart />
          </div>
          <EnvironmentCard />

          <div style={{ flex: 1 }} />

          <div style={{ padding: "14px 16px", borderTop: "1px solid #EBEBEB" }}>
            <p style={{ fontSize: "10px", color: "#ADADAD", lineHeight: 1.5 }}>
              Solar position uses real astronomical formulas.
              All capacity values are illustrative only.
            </p>
          </div>
        </aside>
      </div>

      <div style={{ flexShrink: 0 }}>
        <TimeSlider />
      </div>
    </div>
  );
}
