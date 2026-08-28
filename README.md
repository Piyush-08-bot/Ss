# SolSight

SolSight is a small 3D web app that shows how sunlight and shadows move across a rooftop over the course of a day. You pick a location, set a rooftop size, and drag a time slider — the sun's position updates using real solar geometry (not an animation loop pretending to be the sun), and shadows from nearby obstacles fall correctly across the roof.

I built this to understand rooftop solar feasibility better before it's worth paying for a full engineering survey — how much of a roof is actually usable, and when.

Live demo: https://solsight-pi.vercel.app/demo

## What it does

- Renders a 3D rooftop scene (panels, a water tank, a rooftop structure) using Three.js / React Three Fiber, with orbit/zoom/pan controls.
- Computes real sun position (elevation, azimuth) using NOAA's solar position formulas — declination, hour angle, and the standard elevation/azimuth equations — for any latitude/longitude, date, and time.
- Updates a directional light and casts real-time shadows as the time slider moves from 06:00 to 18:00, including direction reversal (shadows point west in the morning, east in the afternoon).
- Lets you change the date to see seasonal differences — winter sun sits lower in the sky than summer sun.
- Pulls historical solar radiation and average temperature for the selected location from NASA's POWER API.
- Geocodes any city you search via OpenStreetMap Nominatim.
- Shows a rough site summary (panel count, illustrative kW capacity, sun exposure, approximate shadow coverage) — labeled clearly as illustrative, not an engineering-grade estimate.

## Tech stack

- React 18 + Vite
- Three.js, React Three Fiber, Drei
- Zustand for state
- Tailwind CSS
- NASA POWER API for climate data
- OpenStreetMap Nominatim for geocoding
- Solar position math implemented directly from NOAA's published formulas — no third-party solar library

## Accuracy — what I fixed

I checked the app's output against [NOAA's Solar Calculator](https://gml.noaa.gov/grad/solcalc/) rather than just trusting that the code compiled and looked right.

**Bug 1 — geocoding fallback.** Searching a city that didn't resolve cleanly was silently falling back to a hardcoded default coordinate (the geographic center of the contiguous US), instead of failing visibly. This meant any location that hit this path gave completely wrong sun angles without any indication something was off. Fixed by surfacing geocoding failures in the UI instead of masking them with a default.

**Bug 2 — UTC offset derived from longitude instead of real civil time.** The app was computing UTC offset as `longitude / 15` (mean solar time), instead of the location's actual timezone offset. For most cities this introduces a 20–50 minute error into the hour angle calculation, which shows up as a few degrees of elevation/azimuth error. Fixed by resolving the real IANA timezone offset for the selected location instead of deriving it from longitude.

**Verification (Chicago, Aug 28 2026, 12:00 PM local):**

| | NOAA reference | Before fix | After fix |
|---|---|---|---|
| Elevation | 55.72° | 58.1° (off by 2.4°) | 56.1° (off by 0.4°) |
| Azimuth | 156.95° | — | 156.5° (off by 0.5°) |

Also spot-checked against locations that stress-test the timezone/hemisphere logic differently — New Delhi (UTC+5:30, a non-whole-hour offset), Sydney (southern hemisphere), and London (near the Prime Meridian) — to make sure the fix generalizes and isn't just correct for one test case.

## What this is not

This isn't a solar design or proposal tool. There's no panel layout optimization, no BOM/BOQ generation, no financial modeling, no accounts or saved projects. It's a feasibility visualization tool — the step before you'd bring in an actual solar installer.

## Running locally

```bash
git clone <repo-url>
cd solsight
npm install
npm run dev
```

## Known limitations

- Sun position math uses NOAA's standard approximation formulas, which are accurate to a fraction of a degree but not the higher-precision algorithms used in bankable energy yield studies.
- Shadow coverage and panel capacity numbers are simplified estimates for visualization, not engineering calculations.
- No backend — NASA POWER and Nominatim are called directly from the browser, with in-memory caching per session only.
