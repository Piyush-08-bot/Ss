import { getUtcOffsetHours } from "./timezone";

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getSunPosition(lat, lon, date, timeHour) {
  const doy = dayOfYear(date);

  const gamma = (2 * Math.PI) / 365 * (doy - 1 + (timeHour - 12) / 24);

  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.04089 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const utcOffset = getUtcOffsetHours(lat, lon, date);
  const utcHour   = timeHour - utcOffset;
  const timeOffset = eqtime + 4 * lon;
  const tst = utcHour * 60 + timeOffset;
  const ha = tst / 4 - 180;

  const latRad = toRad(lat);
  const cosZenith =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(toRad(ha));

  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const elevation = 90 - toDeg(zenithRad);

  let azimuth;
  const sinZenith = Math.sin(zenithRad);
  if (Math.abs(sinZenith) < 1e-6) {
    azimuth = ha >= 0 ? 180 : 0;
  } else {
    const cosAzRaw =
      (Math.sin(latRad) * cosZenith - Math.sin(decl)) /
      (Math.cos(latRad) * sinZenith);
    const azRaw = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAzRaw))));
    // NOAA azimuth convention: ha > 0 ? (azRaw + 180) % 360 : (540 - azRaw) % 360
    azimuth = ha > 0 ? (azRaw + 180) % 360 : (540 - azRaw) % 360;
  }

  return { azimuth, elevation };
}

export function sunPositionToVector(azimuth, elevation, distance = 50) {
  const elRad = toRad(elevation);
  const azRad = toRad(azimuth);

  const x = distance * Math.cos(elRad) * Math.sin(azRad);
  const y = distance * Math.sin(elRad);
  const z = distance * Math.cos(elRad) * Math.cos(azRad);

  return { x, y, z };
}

export function formatHour(hour) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
