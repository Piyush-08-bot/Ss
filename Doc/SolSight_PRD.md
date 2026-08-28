# Product Requirements Document: SolSight

**A 3D rooftop sun-path & shadow visualization tool**

Version 1.0 | Draft for personal project / interview portfolio

---

## 1. Summary

SolSight is a small, focused 3D web application that helps a user understand how sunlight moves across a rooftop over the course of a day, and how nearby obstructions (buildings, water tanks, trees) cast shadows that affect solar panel placement. It combines real astronomical sun-position calculations, real environmental data (NASA POWER API), and an interactive 3D scene (Three.js / React Three Fiber) to make an otherwise abstract concept ("shading loss") visible and intuitive.

It is deliberately scoped as a **visualization and analysis tool**, not a full solar design/proposal platform. It solves the "site feasibility understanding" problem — the step that happens *before* someone designs a panel layout or generates a financial proposal.

---

## 2. Problem Statement

Before installing rooftop solar panels, a person (homeowner, installer, or student researching the domain) needs to understand:

- How much of the roof actually gets clean, unobstructed sunlight
- How that changes across the day (morning vs. afternoon shading)
- Which parts of the roof are shadowed by nearby structures at different times

Most people have no intuitive way to visualize this. Solar design software that models this exists, but it's usually complex, paid, and bundled with unrelated features (proposal generation, CRM, billing). There's no lightweight, visual, "just show me the sun and shadows" tool.

**SolSight's goal:** make sun movement and shadow behavior on a rooftop understandable through direct 3D interaction, using real solar geometry and real environmental data — nothing more.

---

## 3. Goals

| Goal | Description |
|---|---|
| G1 | Let a user place a rooftop scene with obstacles in 3D and see it from any angle |
| G2 | Simulate the sun's real position for a chosen location, date, and time |
| G3 | Render shadows that update correctly and immediately as the sun moves |
| G4 | Surface real environmental data (solar radiation, temperature) for the chosen location |
| G5 | Present a simple, honest summary of roof usability — without pretending to be a full engineering tool |

### Non-Goals (explicitly out of scope for v1)

- User authentication / accounts
- Saving/loading multiple projects or a database
- CRM, customer management, or lead tracking
- Automatic Bill of Materials (BOM) or Single Line Diagram (SLD) generation
- Electricity bill / tariff / payback calculations
- Payments
- AI-based rooftop detection from photos or satellite imagery
- Panel layout optimization or auto-placement algorithms
- Mobile app (responsive web is enough; not a native app)

Keeping this list explicit matters — it's the difference between a 2-week project you finish well and a 2-month project you abandon half-built.

---

## 4. Target User

**Primary:** Someone learning about / demonstrating understanding of solar site feasibility — in this case, used as a portfolio/interview project for a solar-tech company.

**Secondary (realistic future use case, not built for v1):** A homeowner or junior solar sales rep doing a rough, non-binding feasibility check before requesting a professional site survey.

This is not built for licensed engineers doing bankable energy yield calculations — that requires far more rigorous shading/soiling/temperature-derating models than this tool attempts.

---

## 5. Core Features (Detailed)

### Feature 1 — 3D Rooftop Scene

**Description:** A 3D scene containing a flat rooftop plane, a small set of placeable obstacle blocks (representing a neighboring building, water tank, or tree), and a simple grid of solar panel mockups on the roof.

**Requirements:**
- Roof rendered as a rectangular plane with configurable width/length (user input or default preset)
- 2–4 obstacle objects (simple boxes/cylinders), each with adjustable height and position on/near the roof
- A static grid of panel placeholders on the roof (not auto-optimized — just illustrative, e.g. evenly spaced rows)
- Camera controls: orbit (rotate), zoom, pan (via OrbitControls)
- Scene should load with a sensible default (a preset roof + 1–2 obstacles) so it's never empty on first load

**Acceptance criteria:**
- User can rotate/zoom/pan the scene smoothly on a mid-range laptop (no major frame drops)
- Obstacle position/height changes are reflected in the scene without a full reload
- Scene works at common desktop resolutions (mobile responsiveness is nice-to-have, not required)

---

### Feature 2 — Sun Simulation (Time Slider)

**Description:** A slider representing time of day (e.g. 06:00–18:00) that moves a directional light (representing the sun) through a realistic arc based on the sun's actual position for the selected location and date.

**Requirements:**
- Time slider UI control, default range 06:00–18:00, adjustable in ~15–30 min steps
- Sun position (azimuth + elevation) computed using standard solar position formulas based on:
  - Latitude/longitude (from selected location)
  - Date (default: today, or a fixed date for simplicity in v1)
  - Time of day (from slider)
- The directional light's position/angle in the 3D scene is updated to match the computed azimuth/elevation whenever the slider moves
- Optional stretch: a "play" button that auto-advances the slider like a timelapse

**Acceptance criteria:**
- Moving the slider visibly moves the light source and updates its angle in real time
- Sun position roughly matches real-world expectation (e.g. low angle in early morning/evening, high at midday) for the selected latitude
- No page reload or noticeable lag when scrubbing the slider

**Technical note:** Sun position formulas (declination, hour angle, azimuth, elevation from lat/long/date/time) are pure math — no external API needed for this part. This can be implemented directly or via a small, well-known open-source formula set.

---

### Feature 3 — Shadow Visualization

**Description:** As the simulated sun moves, the obstacles cast shadows on the rooftop that change direction and length correctly, using the 3D engine's real-time shadow rendering.

**Requirements:**
- Enable shadow mapping on the directional light and roof/obstacle meshes
- Shadow direction and length must respond correctly to the light's elevation/azimuth (longer shadows near sunrise/sunset, shorter near midday, direction flipping across the day)
- Shadows should visibly fall across panel placeholders, so the user can see which panels would be shaded at a given time

**Acceptance criteria:**
- At low sun elevation (early morning/late evening), shadows are visibly long
- At high sun elevation (midday), shadows are visibly short and closer to the obstacle base
- Shadow direction changes correctly from one side of the obstacle to the other as the sun crosses from morning to afternoon
- This is the single most important feature to get right and polish — it's the "wow" moment of the demo

---

### Feature 4 — Site Summary Panel

**Description:** A simple side panel showing a few key, honestly-scoped numbers — not a financial or engineering-grade output.

**Requirements:**
Display, updated live as the user changes time/location:

| Field | Source | Notes |
|---|---|---|
| Roof Area | User input | e.g. in m² |
| Panel Capacity (illustrative) | Simple calc from roof area ÷ standard panel size | Labeled clearly as illustrative, not optimized |
| Sun Exposure | Derived from current elevation + % of roof/panels currently shadowed | Simple qualitative label (Good / Partial / Low) |
| Current Time | From slider | |
| Shadow Coverage | Rough estimate of % of panel area currently shadowed | Can be approximate (e.g. based on shadow overlap with panel grid) |

**Acceptance criteria:**
- Panel updates without needing a manual refresh
- No values are presented as precise engineering outputs — labels/tooltips make clear this is a visualization aid, not a certified estimate

---

## 6. NASA POWER API Integration

**Role:** Supporting/enrichment feature only — not core interactivity. If it breaks or is slow, the rest of the app must still work.

**Requirements:**
- On location selection, fetch daily/monthly average solar radiation (kWh/m²/day) and temperature for that location from NASA POWER API
- Display in a small "Environment Data" card, clearly labeled as historical/average data (not a live forecast)
- Cache the response per location for the session (avoid refetching on every slider move — this data doesn't change with time-of-day)

**Explicit constraint:** Do not present NASA data as a rooftop generation prediction. It's contextual information about the location's solar potential in general, kept separate from the Site Summary's rooftop-specific numbers.

**Fallback:** If the API call fails or is rate-limited, show a graceful "environmental data unavailable" state — the 3D scene and shadow simulation must not depend on this succeeding.

---

## 7. User Flow

```
Open SolSight
   → Select/enter location (or use default preset city)
   → Enter rooftop dimensions (or use default preset)
   → 3D rooftop scene loads with default obstacles
   → User adjusts obstacle height/position (optional)
   → User moves time slider
       → Sun position updates
       → Shadows update in real time
       → Site Summary panel updates
   → User views NASA environmental data card
   → (Optional) User scrubs across full day to observe shading pattern
```

No login, no save/load, no multi-step wizard. Everything happens on one screen.

---

## 8. Technical Architecture

### Frontend
- **React** — app shell and state management
- **React Three Fiber + Three.js** — 3D scene, meshes, lighting, shadow rendering
- **Tailwind CSS** — layout only (styling detail intentionally out of scope for this PRD)
- **State:** local component state / lightweight state manager (e.g. useState/useReducer or Zustand if state grows) — no backend state needed

### Sun Position Calculation
- Implemented client-side using standard solar geometry formulas (solar declination, hour angle, elevation, azimuth from latitude, longitude, date, and local time)
- Pure function: `getSunPosition(lat, lon, date, time) → { azimuth, elevation }`
- Output mapped to a 3D vector to position the directional light

### API Layer
- **NASA POWER API** called directly from the frontend if CORS permits
- If CORS blocks direct calls, add a minimal Express (or serverless function) proxy that just forwards the request — no other backend logic
- No database in v1. If NASA response caching across sessions is later desired, localStorage is sufficient — no server-side persistence needed

### Data Flow
```
User selects location + date
      ↓
[Sun Position Function] → azimuth/elevation → updates Three.js directional light
      ↓
[Three.js Shadow Rendering] → shadows update on roof/obstacles
      ↓
[Site Summary Logic] → reads current shadow state → updates panel

(separately, once per location change)
[NASA POWER API call] → environment data card
```

---

## 9. Non-Functional Requirements

- **Performance:** Scene should maintain interactive frame rates (target 30+ fps) on a typical laptop with integrated graphics; keep obstacle/panel counts low enough to avoid heavy shadow-map computation
- **Browser support:** Latest Chrome/Edge/Firefox (WebGL required) — no need to support older browsers
- **Responsiveness:** Usable on desktop/laptop screens; mobile layout is a stretch goal, not a requirement
- **Reliability of core loop:** The sun-movement → shadow-update interaction must never break, even if the NASA API call fails

---

## 10. Success Criteria (for this being a good portfolio project, not a shipped product)

- A stranger can open the app and, within 10 seconds of moving the slider, understand what it does without explanation
- The shadow behavior is visibly, obviously correct (long morning/evening shadows, short midday shadows, correct direction)
- The whole thing can be demoed and explained in under 3 minutes
- Codebase is small enough that you can explain every major file/function in an interview without hesitating

---

## 11. Phased Build Plan

**Phase 1 — Core loop (highest priority, do not skip or rush)**
- Static 3D roof + 1–2 obstacles + panel grid
- Time slider wired to sun position calculation
- Directional light position updates with slider
- Shadows rendering and updating correctly

**Phase 2 — Site Summary panel**
- Roof area / panel capacity / sun exposure / shadow coverage fields
- Live updates as slider moves

**Phase 3 — NASA POWER integration**
- Location input → API call → environment data card
- Caching per location, graceful failure state

**Phase 4 — Polish**
- Default preset scene/location so it's never empty on load
- Optional "play" animation for the time slider
- Tooltips clarifying what's illustrative vs. real data
- Basic responsive layout pass

**Explicitly deferred / not built:** anything from the Non-Goals list in Section 3.

---

## 12. Open Questions / Risks

| Item | Notes |
|---|---|
| NASA POWER API CORS behavior | Confirm whether direct frontend calls work before committing to "no backend" — have the Express proxy fallback ready as a quick add if needed |
| Shadow accuracy at extreme latitudes/dates | Fine for a portfolio demo; not something to over-engineer |
| Performance on low-end devices | Keep obstacle/panel counts modest; this is a demo tool, not a production app |
| Date handling | v1 can fix "today" as the date and only vary time-of-day via the slider; full date-picker (to show seasonal shadow change) is a reasonable stretch feature if time allows |

---

## 13. Interview Talking Points (Appendix)

**What it is, in one line:**
"A 3D tool that visualizes how sunlight and shadows move across a rooftop, using real solar geometry and NASA environmental data."

**Why you built it this way:**
"I wanted something that demonstrates real spatial/3D problem-solving rather than a form-and-database CRUD app. Shadow simulation needed real solar position math, not guesswork, so I implemented the sun-position formulas myself rather than faking the light movement."

**Likely follow-up questions to be ready for:**
- *Why Three.js / React Three Fiber?* — Because the core problem is spatial visualization; charts/2D wouldn't convey shadow behavior convincingly.
- *How is sun position calculated?* — Standard solar geometry formulas from latitude, longitude, date, and time — no external API needed for this part.
- *How do shadows update?* — The directional light's position/angle changes with the calculated sun position; Three.js's shadow mapping recalculates shadows automatically as the light moves.
- *Why NASA POWER API?* — To ground the tool in real environmental data instead of static placeholder numbers, while being careful not to overstate it as a generation forecast.
- *What would you add next?* — A date picker to show seasonal shadow variation, and eventually a simple shading-loss percentage calculated by sampling shadow overlap across the day.

---

*End of PRD.*
