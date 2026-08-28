/**
 * sunPosition.js
 * Pure-math solar position calculator.
 * No external dependencies.
 *
 * Given a lat, lon, JS Date, and a decimal hour (e.g. 14.5 = 14:30),
 * returns the sun's { azimuth, elevation } in degrees.
 *
 * Algorithm: NOAA Solar Calculator equations
 * https://gml.noaa.gov/grad/solcalc/solareqns.PDF
 */

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

/**
 * Get the day of year (1–365/366) for a given Date.
 */
function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculate sun position.
 *
 * @param {number} lat       Latitude in degrees
 * @param {number} lon       Longitude in degrees
 * @param {Date}   date      JS Date object (year, month, day used)
 * @param {number} timeHour  Decimal hour in LOCAL clock time (e.g. 13.5 = 13:30 IST)
 * @returns {{ azimuth: number, elevation: number }}
 *   azimuth  - degrees from North, clockwise (0=N, 90=E, 180=S, 270=W)
 *   elevation - degrees above horizon (0=horizon, 90=zenith)
 */
export function getSunPosition(lat, lon, date, timeHour) {
  const doy = dayOfYear(date);

  // Fractional year (radians)
  const gamma = (2 * Math.PI) / 365 * (doy - 1 + (timeHour - 12) / 24);

  // Equation of time (minutes)
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.04089 * Math.sin(2 * gamma));

  // Solar declination (radians)
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // ── UTC correction ────────────────────────────────────────────
  // The NOAA formula needs UTC time, but the slider shows local clock time.
  // We approximate the UTC offset from longitude: every 15° east = +1 hour.
  // e.g. India (lon≈77–88°E) → utcOffset ≈ +5.1 to +5.9 h  (actual IST = +5.5)
  // Subtracting this gives a UTC hour close enough for solar geometry.
  const utcOffset = lon / 15;          // approximate hours ahead of UTC
  const utcHour   = timeHour - utcOffset;

  // True solar time offset (minutes) — uses UTC input
  const timeOffset = eqtime + 4 * lon;

  // True solar time (minutes from midnight UTC)
  const tst = utcHour * 60 + timeOffset;

  // Hour angle (degrees) — 0 at solar noon, negative morning, positive afternoon
  const ha = tst / 4 - 180;

  const latRad = toRad(lat);

  // Solar zenith angle
  const cosZenith =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(toRad(ha));

  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const elevation = 90 - toDeg(zenithRad);

  // Solar azimuth (degrees from North, clockwise)
  let azimuth;
  const sinZenith = Math.sin(zenithRad);
  if (Math.abs(sinZenith) < 1e-6) {
    azimuth = ha >= 0 ? 180 : 0;
  } else {
    const cosAzRaw =
      (Math.sin(latRad) * cosZenith - Math.sin(decl)) /
      (Math.cos(latRad) * sinZenith);
    const azRaw = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAzRaw))));
    azimuth = ha > 0 ? 360 - azRaw : azRaw;
  }

  return { azimuth, elevation };
}

/**
 * Convert { azimuth, elevation } (degrees) to a Three.js-ready
 * Cartesian position vector (unit sphere, Y-up coordinate system).
 *
 * Three.js scene is Y-up:
 *   azimuth 0° = South (positive Z direction) to keep shadows going "away"
 *   We rotate so azimuth 180°(S) maps to +Z and azimuth 0°(N) to -Z
 *
 * @param {number} azimuth    degrees from North clockwise
 * @param {number} elevation  degrees above horizon
 * @param {number} distance   radius of the light orbit (default 50)
 * @returns {{ x: number, y: number, z: number }}
 */
export function sunPositionToVector(azimuth, elevation, distance = 50) {
  const elRad = toRad(elevation);
  const azRad = toRad(azimuth);

  // Convert spherical → cartesian (Y-up, Z-south, X-east)
  const x = distance * Math.cos(elRad) * Math.sin(azRad);
  const y = distance * Math.sin(elRad);
  const z = distance * Math.cos(elRad) * Math.cos(azRad);

  return { x, y, z };
}

/**
 * Format a decimal hour as "HH:MM"
 * @param {number} hour  e.g. 14.5
 * @returns {string}     e.g. "14:30"
 */
export function formatHour(hour) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
