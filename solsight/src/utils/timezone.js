/**
 * timezone.js
 * Converts a (lat, lon, date) to the real civil UTC offset in decimal hours.
 *
 * Uses:
 *   1. tz-lookup  → maps lat/lon to an IANA timezone name (e.g. "America/Chicago")
 *   2. Intl.DateTimeFormat → gets the actual UTC offset for that timezone ON the
 *      given date, correctly accounting for DST (CDT vs CST, IST stays fixed, etc.)
 *
 * Fallback: if tz-lookup or Intl fails for any reason, returns lon/15 (the old
 * approximation) so the app degrades gracefully rather than crashing.
 */
import tzlookup from "tz-lookup";

/**
 * Get the real civil UTC offset for a location on a specific date.
 *
 * @param {number} lat   Latitude in degrees
 * @param {number} lon   Longitude in degrees
 * @param {Date}   date  The date to check (DST differs by date)
 * @returns {number}     UTC offset in decimal hours, e.g. -5.0 for CDT, 5.5 for IST
 */
export function getUtcOffsetHours(lat, lon, date) {
  try {
    // Step 1: Resolve lat/lon → IANA timezone name
    const ianaTimezone = tzlookup(lat, lon);
    // e.g. "America/Chicago", "Asia/Kolkata", "Europe/London"

    // Step 2: Use Intl to get the UTC offset for this timezone on this exact date.
    // longOffset format produces strings like "GMT-05:00" or "GMT+05:30".
    // This automatically accounts for DST because we pass the actual date.
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "longOffset",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value;
    // tzPart is e.g. "GMT-05:00", "GMT+05:30", or just "GMT" for UTC

    if (!tzPart || tzPart === "GMT") return 0;

    const match = tzPart.match(/GMT([+-])(\d{2}):(\d{2})/);
    if (!match) return 0;

    const sign    = match[1] === "+" ? 1 : -1;
    const hours   = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    return sign * (hours + minutes / 60);

  } catch (err) {
    // Graceful fallback — better than crashing the 3D scene
    console.warn("[SolSight TZ] Timezone lookup failed, falling back to lon/15:", err?.message);
    return lon / 15;
  }
}
