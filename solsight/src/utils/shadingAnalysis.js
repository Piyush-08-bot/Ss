/**
 * shadingAnalysis.js
 * Runs the sun simulation across the full day for a given date/location
 * and returns per-hour shadow coverage + peak sun hours.
 *
 * All pure math — no external dependencies.
 */
import { getSunPosition } from "./sunPosition";

/**
 * Estimate approximate shadow coverage % from sun elevation.
 * Same heuristic used in SiteSummary — good enough for a chart.
 */
function elevToShadow(elevation) {
  if (elevation <= 0) return 100;
  if (elevation >= 50) return 5;
  return Math.round(60 - elevation * 1.1);
}

/**
 * Run the full-day simulation in 30-min steps.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} month  1-indexed
 * @param {number} day
 * @returns {Array<{ hour: number, label: string, elevation: number, shadowPct: number, aboveHorizon: boolean }>}
 */
export function getDailyShadingProfile(lat, lon, month, day) {
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const results = [];

  // 06:00 to 18:00 in 30-min steps
  for (let h = 6; h <= 18; h += 0.5) {
    const { elevation } = getSunPosition(lat, lon, date, h);
    const aboveHorizon  = elevation > 0;
    const shadowPct     = aboveHorizon ? elevToShadow(elevation) : 100;

    const hours   = Math.floor(h);
    const minutes = (h % 1) === 0.5 ? "30" : "00";
    const label   = `${String(hours).padStart(2, "0")}:${minutes}`;

    results.push({ hour: h, label, elevation: parseFloat(elevation.toFixed(1)), shadowPct, aboveHorizon });
  }

  return results;
}

/**
 * Calculate peak sun hours = hours where elevation > 20° (useful solar irradiance).
 * Rough heuristic, not engineering-grade.
 */
export function getPeakSunHours(profile) {
  const usefulSteps = profile.filter((p) => p.elevation > 20);
  return parseFloat((usefulSteps.length * 0.5).toFixed(1)); // each step = 30 min
}
