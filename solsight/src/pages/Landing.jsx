/**
 * Landing.jsx — clean editorial layout
 */
import { Suspense } from "react";
import { Link } from "react-router-dom";
import SceneCanvas from "../components/scene/SceneCanvas";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────── */}
      <header style={{
        borderBottom: "1px solid #D8D6D0",
        padding: "0 48px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#F7F6F2",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "15px", letterSpacing: "-0.02em", color: "#242424" }}>
          SolSight
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#how-it-works" style={{ fontSize: "13px", color: "#6B6B6B", textDecoration: "none" }}>
            How it works
          </a>
          <Link to="/demo" style={{
            fontSize: "13px", fontWeight: 500,
            padding: "7px 16px",
            background: "#242424", color: "#F7F6F2",
            textDecoration: "none", borderRadius: "3px",
          }}>
            Demo
          </Link>
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section style={{
        padding: "80px 48px 72px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
        alignItems: "center",
        maxWidth: "1100px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Left copy */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "20px" }}>
            3D Solar Visualization
          </p>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "46px", fontWeight: 700,
            lineHeight: 1.1, letterSpacing: "-0.03em",
            color: "#242424", marginBottom: "20px",
          }}>
            A clearer view of sunlight on your roof.
          </h1>
          <p style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7, marginBottom: "32px", maxWidth: "420px" }}>
            Explore how sunlight and shadows change across a rooftop throughout
            the day — using real solar geometry and NASA environmental data.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/demo" style={{
              fontSize: "14px", fontWeight: 500,
              padding: "10px 24px",
              background: "#242424", color: "#F7F6F2",
              textDecoration: "none", borderRadius: "3px",
            }}>
              Explore Demo
            </Link>
            <a href="#how-it-works" style={{ fontSize: "13px", color: "#6B6B6B", textDecoration: "none" }}>
              How it works →
            </a>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: "32px",
            marginTop: "48px", paddingTop: "24px",
            borderTop: "1px solid #D8D6D0",
          }}>
            {[
              { val: "06→18", label: "hours simulated" },
              { val: "15 min", label: "time steps" },
              { val: "NASA", label: "POWER data" },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#242424" }}>{s.val}</p>
                <p style={{ fontSize: "11px", color: "#ADADAD", marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D preview */}
        <div style={{
          height: "400px",
          border: "1px solid #D8D6D0",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
          background: "#E8E6E0",
        }}>
          <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#E8E6E0" }} />}>
            <SceneCanvas mini />
          </Suspense>
          <div style={{
            position: "absolute", bottom: "12px", left: "12px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #D8D6D0",
            padding: "4px 8px",
          }}>
            <p style={{ fontSize: "10px", color: "#6B6B6B" }}>Interactive 3D — try the demo to move the sun</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="how-it-works" style={{
        borderTop: "1px solid #D8D6D0",
        padding: "64px 48px",
        background: "#FAFAF8",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "40px" }}>
            What it does
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px" }}>
            {[
              { num: "01", title: "3D Rooftop", body: "Explore a simple rooftop in 3D — rotate, zoom, and pan to see the scene from any angle. Panels and obstacles built with real geometry." },
              { num: "02", title: "Sun Movement", body: "Move a time slider from 06:00 to 18:00. Sun position is calculated using real solar geometry formulas for the selected location." },
              { num: "03", title: "Site Data", body: "View historical average solar radiation and temperature for any location, sourced directly from NASA POWER's public dataset." },
            ].map((f) => (
              <div key={f.num}>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#ADADAD", marginBottom: "8px" }}>{f.num}</p>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#242424", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOW ─────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #D8D6D0", padding: "64px 48px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "32px" }}>
            Core interaction
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0", flexWrap: "wrap" }}>
            {[
              "Open the demo",
              "Move the slider",
              "Sun updates",
              "Shadows change",
              "Understand your roof",
            ].map((label, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ paddingRight: "12px" }}>
                  <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#ADADAD", marginBottom: "4px" }}>{i + 1}</p>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#242424", whiteSpace: "nowrap" }}>{label}</p>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "#D8D6D0", fontSize: "14px", marginRight: "12px", lineHeight: 1 }}>→</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "36px" }}>
            <Link to="/demo" style={{
              fontSize: "14px", fontWeight: 500,
              padding: "10px 24px",
              background: "#242424", color: "#F7F6F2",
              textDecoration: "none", borderRadius: "3px",
              display: "inline-block",
            }}>
              Try it now
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #D8D6D0", padding: "18px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#ADADAD" }}>SolSight — 3D solar site visualization</span>
          <span style={{ fontSize: "12px", color: "#ADADAD" }}>Solar data: NASA POWER · Location: OpenStreetMap</span>
        </div>
      </footer>

    </div>
  );
}
