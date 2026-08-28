import { getSunPosition } from "./sunPosition";

function elevToShadow(elevation) {
  if (elevation <= 0) return 100;
  if (elevation >= 50) return 5;
  return Math.round(60 - elevation * 1.1);
}

export function getDailyShadingProfile(lat, lon, month, day) {
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const results = [];

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

export function getPeakSunHours(profile) {
  const usefulSteps = profile.filter((p) => p.elevation > 20);
  return parseFloat((usefulSteps.length * 0.5).toFixed(1));
}
