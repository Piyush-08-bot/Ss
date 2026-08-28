/**
 * EnvironmentCard.jsx — inline-styled NASA POWER data card
 */
import { useEffect } from "react";
import useSceneStore from "../../store/useSceneStore";
import { fetchNASAData } from "../../utils/nasaPower";

export default function EnvironmentCard() {
  const lat         = useSceneStore((s) => s.lat);
  const lon         = useSceneStore((s) => s.lon);
  const cityName    = useSceneStore((s) => s.cityName);
  const nasaData    = useSceneStore((s) => s.nasaData);
  const nasaLoading = useSceneStore((s) => s.nasaLoading);
  const nasaError   = useSceneStore((s) => s.nasaError);
  const setNasaData    = useSceneStore((s) => s.setNasaData);
  const setNasaLoading = useSceneStore((s) => s.setNasaLoading);

  useEffect(() => {
    let cancelled = false;
    setNasaLoading(true);
    fetchNASAData(lat, lon).then((data) => {
      if (!cancelled) setNasaData(data);
    });
    return () => { cancelled = true; };
  }, [lat, lon, setNasaData, setNasaLoading]);

  const city = cityName.split(",")[0];

  return (
    <div style={{ padding: "16px", borderTop: "1px solid #EBEBEB" }}>
      <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "10px" }}>
        Environment
      </p>
      <p style={{ fontSize: "13px", fontWeight: 500, color: "#242424", marginBottom: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {city}
      </p>

      {nasaLoading ? (
        <div>
          <div style={{ height: "32px", background: "#F0EFE9", borderRadius: "3px", marginBottom: "8px", animation: "pulse 1.4s ease infinite" }} />
          <div style={{ height: "32px", background: "#F0EFE9", borderRadius: "3px", animation: "pulse 1.4s ease infinite" }} />
          <p style={{ fontSize: "10px", color: "#ADADAD", marginTop: "8px" }}>Fetching environmental data…</p>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
      ) : nasaError || !nasaData ? (
        <div>
          <p style={{ fontSize: "12px", color: "#ADADAD" }}>Environmental data unavailable.</p>
          <p style={{ fontSize: "10px", color: "#C0C0C0", marginTop: "4px" }}>
            The 3D simulation continues normally.
          </p>
        </div>
      ) : (
        <div>
          {/* Radiation */}
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "3px" }}>
              Solar Radiation
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#242424", lineHeight: 1.1 }}>
              {nasaData.radiation}
              <span style={{ fontSize: "12px", fontWeight: 400, color: "#6B6B6B", marginLeft: "4px" }}>
                kWh/m²/day
              </span>
            </p>
          </div>

          {/* Temperature */}
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ADADAD", marginBottom: "3px" }}>
              Avg Temperature
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#242424", lineHeight: 1.1 }}>
              {nasaData.temperature}
              <span style={{ fontSize: "12px", fontWeight: 400, color: "#6B6B6B", marginLeft: "2px" }}>°C</span>
            </p>
          </div>

          <div style={{ borderTop: "1px solid #EBEBEB", paddingTop: "10px" }}>
            <p style={{ fontSize: "10px", color: "#ADADAD", lineHeight: 1.5 }}>
              NASA POWER — historical monthly avg (2010–2020).<br />
              Not a generation forecast.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
