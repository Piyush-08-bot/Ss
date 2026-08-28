const cache = new Map();

export async function fetchNASAData(lat, lon) {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const params = new URLSearchParams({
    parameters: "ALLSKY_SFC_SW_DWN,T2M",
    community: "RE",
    longitude: lon.toFixed(4),
    latitude: lat.toFixed(4),
    start: "2010",
    end: "2020",
    format: "JSON",
  });

  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?${params}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`NASA API ${res.status}`);

    const json = await res.json();
    const props = json?.properties?.parameter;
    if (!props) throw new Error("Unexpected NASA response shape");

    const radiation = props.ALLSKY_SFC_SW_DWN?.ANN ?? null;
    const temperature = props.T2M?.ANN ?? null;

    const result = {
      radiation: radiation !== null ? parseFloat(radiation.toFixed(2)) : null,
      temperature: temperature !== null ? parseFloat(temperature.toFixed(1)) : null,
    };

    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn("[SolSight] NASA POWER fetch failed:", err.message);
    return null;
  }
}
