import tzlookup from "tz-lookup";

export function getUtcOffsetHours(lat, lon, date) {
  try {
    const ianaTimezone = tzlookup(lat, lon);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "longOffset",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value;

    if (!tzPart || tzPart === "GMT") return 0;

    const match = tzPart.match(/GMT([+-])(\d{2}):(\d{2})/);
    if (!match) return 0;

    const sign    = match[1] === "+" ? 1 : -1;
    const hours   = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    return sign * (hours + minutes / 60);

  } catch (err) {
    console.warn("[SolSight TZ] Timezone lookup failed, falling back to lon/15:", err?.message);
    return lon / 15;
  }
}
