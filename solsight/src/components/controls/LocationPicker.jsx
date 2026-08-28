import { useState, useCallback, useRef, useEffect } from "react";
import useSceneStore from "../../store/useSceneStore";
import { fetchNASAData } from "../../utils/nasaPower";

export default function LocationPicker() {
  const cityName       = useSceneStore((s) => s.cityName);
  const setLocation    = useSceneStore((s) => s.setLocation);
  const setNasaData    = useSceneStore((s) => s.setNasaData);
  const setNasaLoading = useSceneStore((s) => s.setNasaLoading);

  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [open,        setOpen]        = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [searchError, setSearchError] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback((q) => {
    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearchError(false);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
        const res  = await fetch(url, { headers: { "Accept-Language": "en" } });
        if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
        if (data.length === 0) setSearchError(false);
      } catch (err) {
        console.error("[SolSight GEO] Search failed:", err.message);
        setResults([]);
        setOpen(true);
        setSearchError(true);
      }
      finally { setLoading(false); }
    }, 350);
  }, []);

  const handleInput = (e) => { setQuery(e.target.value); search(e.target.value); };

  const selectResult = async (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const name = item.address?.city || item.address?.town || item.display_name.split(",")[0];
    const country = item.address?.country || "";
    const displayName = country ? `${name}, ${country}` : name;

    console.log(`[SolSight GEO] Selected: "${displayName}" → { lat: ${lat}, lon: ${lon} }`);

    setLocation(lat, lon, displayName);
    setQuery(""); setResults([]); setOpen(false); setSearchError(false);
    setNasaLoading(true);
    const data = await fetchNASAData(lat, lon);
    setNasaData(data);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div>
          <p style={{ fontSize: "9px", color: "#ADADAD", lineHeight: 1, marginBottom: "2px" }}>Location</p>
          <p style={{ fontSize: "12px", fontWeight: 500, color: "#242424", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cityName}
          </p>
        </div>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Search city…"
        style={{
          fontSize: "12px",
          padding: "5px 10px",
          border: "1px solid #D8D6D0",
          background: "#F7F6F2",
          color: "#242424",
          outline: "none",
          borderRadius: "2px",
          width: "160px",
          fontFamily: "'Inter', sans-serif",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#242424")}
        onBlur={(e)  => (e.target.style.borderColor = "#D8D6D0")}
      />
      {loading && (
        <span style={{ fontSize: "10px", color: "#ADADAD", position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)" }}>…</span>
      )}

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "4px",
          background: "#FFFFFF",
          border: "1px solid #D8D6D0",
          borderRadius: "3px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          zIndex: 50,
          minWidth: "260px",
          maxHeight: "240px",
          overflowY: "auto",
        }}>
          {searchError ? (
            <div style={{ padding: "10px 12px" }}>
              <p style={{ fontSize: "12px", color: "#9B2335", fontWeight: 500 }}>⚠️ Location search failed</p>
              <p style={{ fontSize: "10px", color: "#ADADAD", marginTop: "2px" }}>
                Check your internet connection and try again.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "10px 12px" }}>
              <p style={{ fontSize: "12px", color: "#ADADAD" }}>No results found.</p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => selectResult(item)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "9px 12px",
                  background: "none", border: "none",
                  borderBottom: "1px solid #F5F5F5",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#242424", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.address?.city || item.address?.town || item.display_name.split(",")[0]}
                </p>
                <p style={{ fontSize: "10px", color: "#ADADAD", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.display_name}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
