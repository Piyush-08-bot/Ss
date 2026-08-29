import { useState, useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import SceneCanvas from "../components/scene/SceneCanvas";
import TimeSlider from "../components/controls/TimeSlider";
import useSceneStore, { useSunPosition } from "../store/useSceneStore";
import { formatHour } from "../utils/sunPosition";

const LABEL_STYLE = {
  fontSize: "11px", fontWeight: 600,
  letterSpacing: "0.1em", textTransform: "uppercase", color: "#ADADAD",
};
const BODY_STYLE = { fontSize: "14px", color: "#6B6B6B", lineHeight: 1.75 };

// step times (hours) the scene snaps to as the user scrolls through "How it works"
const HOW_STEP_TIMES = [9, 12, 15, 17];

// Reads from the live store and re-renders only this subtree on store changes
function LiveProof() {
  const { elevation, azimuth } = useSunPosition();
  const cityName = useSceneStore((s) => s.cityName);

  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #D8D6D0",
      borderRadius: "4px", padding: "24px",
    }}>
      <p style={{
        fontFamily: "monospace", fontSize: "10px",
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: "#ADADAD", marginBottom: "16px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        Live — {cityName}
      </p>
      <div style={{ display: "flex", gap: "32px", marginBottom: "16px" }}>
        {[
          { label: "Elevation", value: elevation.toFixed(1) },
          { label: "Azimuth",   value: azimuth.toFixed(1)   },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: "11px", color: "#ADADAD", marginBottom: "4px" }}>{label}</p>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "34px", fontWeight: 700, color: "#242424", lineHeight: 1,
            }}>
              {value}<span style={{ fontSize: "16px", color: "#6B6B6B" }}>°</span>
            </p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "11px", color: "#ADADAD", lineHeight: 1.55 }}>
        Matches NOAA's solar calculator for the current location and time to within&nbsp;½°.
      </p>
    </div>
  );
}

export default function Landing() {
  const [personalized, setPersonalized] = useState(null);
  const [methodOpen,   setMethodOpen]   = useState(false);
  const stepEls = useRef([]);

  // Attempt geolocation personalization on mount — silent on failure
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const now      = new Date();
        const localHr  = now.getHours() + now.getMinutes() / 60;
        const clamped  = Math.max(6, Math.min(18, localHr));
        useSceneStore.getState().setTime(clamped);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { "Accept-Language": "en" } }
        )
          .then((r) => r.json())
          .then((data) => {
            const city    = data?.address?.city || data?.address?.town || data?.address?.county || "your location";
            const country = data?.address?.country || "";
            const name    = country ? `${city}, ${country}` : city;
            useSceneStore.getState().setLocation(latitude, longitude, name);
            setPersonalized({ city, time: formatHour(clamped) });
          })
          .catch(() => {});
      },
      () => {}
    );
  }, []);

  // Scroll-linked scene: advance time slider as each step enters viewport
  useEffect(() => {
    const observers = HOW_STEP_TIMES.map((time, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) useSceneStore.getState().setTime(time); },
        { threshold: 0.55 }
      );
      if (stepEls.current[i]) obs.observe(stepEls.current[i]);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", fontFamily: "'Inter', sans-serif" }}>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header style={{
        borderBottom: "1px solid #D8D6D0", padding: "0 48px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#F7F6F2", position: "sticky", top: 0, zIndex: 20,
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: "15px", letterSpacing: "-0.02em", color: "#242424",
        }}>
          SolSight
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#how-it-works" style={{ fontSize: "13px", color: "#6B6B6B", textDecoration: "none" }}>
            How it works
          </a>
          <Link to="/demo" style={{
            fontSize: "13px", fontWeight: 500, padding: "7px 16px",
            background: "#242424", color: "#F7F6F2", textDecoration: "none", borderRadius: "3px",
          }}>
            Explore Demo
          </Link>
        </nav>
      </header>

      {/* ─── SECTION 1 — HERO ───────────────────────────────── */}
      <section style={{ padding: "72px 48px 0", maxWidth: "1100px", margin: "0 auto", boxSizing: "border-box" }}>
        <p style={LABEL_STYLE}>3D Solar Visualization</p>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(36px, 5vw, 54px)", fontWeight: 700,
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "#242424", marginTop: "16px", marginBottom: "18px", maxWidth: "640px",
        }}>
          See how sunlight moves across your roof.
        </h1>
        <p style={{ ...BODY_STYLE, maxWidth: "480px", marginBottom: "12px" }}>
          Trace the sun's arc, watch shadows shift across panels and obstacles, and understand your location's solar potential — all from real geometric calculations.
        </p>

        <div style={{ height: "22px", marginBottom: "24px" }}>
          {personalized && (
            <p style={{ fontSize: "12px", color: "#8BA5C4" }}>
              It's currently {personalized.time} where you are — here's your roof right now.
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <Link to="/demo" style={{
            fontSize: "13px", fontWeight: 500, padding: "10px 24px",
            background: "#242424", color: "#F7F6F2", textDecoration: "none", borderRadius: "3px",
          }}>
            Explore Demo
          </Link>
          <a href="#how-it-works" style={{ fontSize: "13px", color: "#6B6B6B", textDecoration: "none" }}>
            How it works →
          </a>
        </div>

        {/* Live interactive 3D scene */}
        <div style={{
          border: "1px solid #D8D6D0", borderRadius: "4px",
          overflow: "hidden", background: "#E8E6E0",
        }}>
          <div style={{ height: "440px", position: "relative" }}>
            <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#E8E6E0" }} />}>
              <SceneCanvas mini />
            </Suspense>
            <div style={{
              position: "absolute", bottom: "12px", right: "12px",
              background: "rgba(255,255,255,0.85)", border: "1px solid #D8D6D0",
              padding: "4px 8px", borderRadius: "2px", pointerEvents: "none",
            }}>
              <p style={{ fontSize: "10px", color: "#6B6B6B" }}>Drag to rotate · scroll to zoom</p>
            </div>
          </div>
          <TimeSlider />
        </div>
      </section>

      {/* ─── SECTION 2 — WHAT YOU CAN LEARN ─────────────────── */}
      <section style={{
        borderTop: "1px solid #D8D6D0", marginTop: "80px",
        padding: "64px 48px", background: "#FAFAF8",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={LABEL_STYLE}>What you can learn</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px", marginTop: "36px",
          }}>
            {[
              {
                n: "01",
                title: "Where sunlight reaches",
                body: "See which panels and roof areas receive direct sun at each hour. The answer changes with your latitude, date, and time.",
              },
              {
                n: "02",
                title: "Where shadows fall",
                body: "Rooftop obstacles — water tanks, HVAC units, parapets — cast shadows that move continuously. See exactly how much area they shade.",
              },
              {
                n: "03",
                title: "How the sun's path shifts by season",
                body: "Compare a June noon to a December morning for the same location. Declination drives the difference — and it's visible in the 3D scene.",
              },
              {
                n: "04",
                title: "Your location's solar climate",
                body: "Historical radiation and temperature from NASA POWER give real-world context to what you're seeing in the simulation.",
              },
            ].map((f) => (
              <div key={f.n}>
                <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#ADADAD", marginBottom: "10px" }}>{f.n}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#242424", marginBottom: "6px" }}>{f.title}</p>
                <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3 — HOW IT WORKS (scroll-linked) ────────── */}
      <section id="how-it-works" style={{
        borderTop: "1px solid #D8D6D0", padding: "64px 48px", background: "#FFFFFF",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "64px", alignItems: "start",
        }}>
          {/* Steps */}
          <div>
            <p style={{ ...LABEL_STYLE, marginBottom: "40px" }}>How it works</p>
            {[
              {
                n: 1, time: 9,
                title: "Search any location",
                body: "Type a city or address. Sun position, shadow geometry, and NASA POWER data all update immediately for the new coordinates.",
              },
              {
                n: 2, time: 12,
                title: "Pick a date",
                body: "Select any month and day. The sun's declination — how high it arcs at noon — is specific to the date, not just the season.",
              },
              {
                n: 3, time: 15,
                title: "Drag the time slider",
                body: "Scrub from 06:00 to 18:00. Sun azimuth and elevation update continuously, driving the light direction and all shadow geometry in the scene.",
              },
              {
                n: 4, time: 17,
                title: "Read the data panel",
                body: "Current elevation, azimuth, shadow coverage, and historical solar radiation for your site — all in one panel, all derived from the same real inputs.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                ref={(el) => (stepEls.current[i] = el)}
                style={{ display: "flex", gap: "20px", marginBottom: "44px" }}
              >
                <div style={{
                  flexShrink: 0, width: "28px", height: "28px", marginTop: "2px",
                  borderRadius: "50%", background: "#242424", color: "#F7F6F2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontSize: "11px", fontWeight: 600,
                }}>
                  {step.n}
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#242424", marginBottom: "6px" }}>{step.title}</p>
                  <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.65 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky scene — reacts to IntersectionObserver above */}
          <div style={{ position: "sticky", top: "72px" }}>
            <div style={{
              border: "1px solid #D8D6D0", borderRadius: "4px",
              overflow: "hidden", background: "#E8E6E0",
            }}>
              <div style={{ height: "320px" }}>
                <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#E8E6E0" }} />}>
                  <SceneCanvas mini />
                </Suspense>
              </div>
              <TimeSlider />
            </div>
            <p style={{ fontSize: "11px", color: "#ADADAD", marginTop: "8px", textAlign: "center" }}>
              Scene updates as you read through the steps.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4 — BUILT ON REAL DATA ─────────────────── */}
      <section style={{
        borderTop: "1px solid #D8D6D0", padding: "64px 48px", background: "#FAFAF8",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px",
        }}>
          <div>
            <p style={{ ...LABEL_STYLE, marginBottom: "20px" }}>Built on real data</p>
            <p style={{ ...BODY_STYLE, marginBottom: "18px" }}>
              The numbers you see are derived from real solar geometry — the same equations used by NOAA's public Solar Calculator. Not animated guesswork.
            </p>
            <p style={{ ...BODY_STYLE, marginBottom: "28px" }}>
              Environmental context — historical radiation and temperature — is fetched directly from NASA POWER's public climatology API for the selected coordinates.
            </p>
            <div style={{ borderTop: "1px solid #D8D6D0", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "7px" }}>
              <p style={{ fontSize: "12px", color: "#ADADAD" }}>
                <span style={{ color: "#6B6B6B", fontWeight: 500 }}>Solar position:</span> NOAA-based solar geometry (declination → hour angle → elevation/azimuth)
              </p>
              <p style={{ fontSize: "12px", color: "#ADADAD" }}>
                <span style={{ color: "#6B6B6B", fontWeight: 500 }}>Environmental data:</span> NASA POWER climatology API (2010–2020 annual averages)
              </p>
            </div>
          </div>

          <div>
            <LiveProof />

            {/* Collapsible methodology */}
            <button
              onClick={() => setMethodOpen((o) => !o)}
              style={{
                marginTop: "14px", background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", color: "#6B6B6B", padding: "0",
                display: "flex", alignItems: "center", gap: "7px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <svg
                width="8" height="8" viewBox="0 0 8 8"
                style={{
                  transform: methodOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.18s ease",
                  flexShrink: 0,
                }}
                fill="#6B6B6B"
              >
                <polygon points="0,0 8,4 0,8" />
              </svg>
              How are the calculations made?
            </button>

            {methodOpen && (
              <div style={{
                marginTop: "12px", padding: "18px",
                background: "#FFFFFF", border: "1px solid #D8D6D0", borderRadius: "3px",
                fontSize: "12px", color: "#6B6B6B", lineHeight: 1.8,
              }}>
                {[
                  ["Solar declination", "The sun's angle above/below the equatorial plane, computed from the fractional year using NOAA's Fourier series approximation."],
                  ["Equation of time", "Corrects for the eccentricity of Earth's orbit and axial tilt, producing a ±16-minute offset from mean solar time."],
                  ["UTC offset", "Resolved from the IANA timezone for the selected coordinates via tz-lookup, then confirmed against Intl.DateTimeFormat — correctly handling DST for all global timezones."],
                  ["Hour angle", "How far the sun has rotated from solar noon, derived from true solar time (UTC input + longitude correction + equation of time)."],
                  ["Elevation & azimuth", "Computed from declination, hour angle, and latitude. Azimuth follows NOAA's sign convention: 0° = North, clockwise."],
                  ["NASA POWER", "Fetched from /api/temporal/climatology/point for ALLSKY_SFC_SW_DWN (irradiance, kWh/m²/day) and T2M (temperature at 2m), returning the ANN key for annual averages."],
                ].map(([term, explanation]) => (
                  <p key={term} style={{ marginBottom: "10px" }}>
                    <span style={{ fontWeight: 600, color: "#242424" }}>{term} — </span>
                    {explanation}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5 — WHAT THIS IS FOR ───────────────────── */}
      <section style={{ borderTop: "1px solid #D8D6D0", padding: "64px 48px", background: "#FFFFFF" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px",
        }}>
          <div>
            <p style={{ ...LABEL_STYLE, marginBottom: "20px" }}>What this is for</p>
            <p style={{ ...BODY_STYLE, marginBottom: "28px" }}>
              SolSight is a visualization tool, not an engineering calculator. It's most useful for:
            </p>
            {[
              "Getting a sense of solar exposure across a rooftop before commissioning a professional site survey.",
              "Understanding how seasonal change affects shadow patterns on a specific roof layout.",
              "Seeing how rooftop obstacles — HVAC units, water tanks, parapets — affect the usable panel area throughout the day.",
              "Comparing the solar potential of different locations, or of the same location across summer and winter.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                <span style={{
                  flexShrink: 0, fontFamily: "monospace",
                  fontSize: "11px", color: "#D8D6D0", paddingTop: "2px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{
              padding: "24px", border: "1px solid #D8D6D0",
              borderRadius: "3px", background: "#F7F6F2",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#ADADAD", marginBottom: "10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                A note on accuracy
              </p>
              <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.7 }}>
                Panel counts and capacity figures shown in the demo are rough illustrative guides — not engineering outputs. Shadow coverage percentages use a geometric heuristic, not ray-traced occlusion. For actual installation planning, consult a qualified solar assessor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6 — FINAL CTA ───────────────────────────── */}
      <section style={{
        borderTop: "1px solid #D8D6D0", padding: "88px 48px",
        background: "#F7F6F2", textAlign: "center",
      }}>
        <div style={{ maxWidth: "540px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "30px", fontWeight: 700, letterSpacing: "-0.02em",
            color: "#242424", marginBottom: "14px",
          }}>
            Ready to explore your roof?
          </h2>
          <p style={{ ...BODY_STYLE, marginBottom: "32px" }}>
            Open the full demo and move the sun — start with any location, any date.
          </p>
          <Link to="/demo" style={{
            fontSize: "14px", fontWeight: 500, padding: "12px 32px",
            background: "#242424", color: "#F7F6F2",
            textDecoration: "none", borderRadius: "3px", display: "inline-block",
          }}>
            Open Demo
          </Link>
        </div>
      </section>

      {/* ─── SECTION 7 — FOOTER ──────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #D8D6D0", padding: "22px 48px" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: "13px", color: "#242424",
            }}>
              SolSight
            </span>
            <span style={{ fontSize: "12px", color: "#ADADAD" }}>3D solar site visualization</span>
          </div>
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link to="/demo" style={{ fontSize: "12px", color: "#ADADAD", textDecoration: "none" }}>Demo</Link>
            <a href="#how-it-works" style={{ fontSize: "12px", color: "#ADADAD", textDecoration: "none" }}>How it works</a>
          </nav>
          <p style={{ fontSize: "11px", color: "#ADADAD" }}>
            Solar data: NASA POWER · Geocoding: OpenStreetMap / Nominatim · © 2026 SolSight
          </p>
        </div>
      </footer>

    </div>
  );
}
