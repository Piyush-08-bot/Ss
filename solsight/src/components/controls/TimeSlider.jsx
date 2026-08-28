/**
 * TimeSlider.jsx — inline-styled time control bar
 */
import { useEffect, useRef } from "react";
import useSceneStore from "../../store/useSceneStore";
import { formatHour } from "../../utils/sunPosition";

const MIN_HOUR = 6;
const MAX_HOUR = 18;
const STEP = 0.25;
const PLAY_MS = 120;

export default function TimeSlider() {
  const currentTime = useSceneStore((s) => s.currentTime);
  const isPlaying   = useSceneStore((s) => s.isPlaying);
  const setTime     = useSceneStore((s) => s.setTime);
  const setPlaying  = useSceneStore((s) => s.setPlaying);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const next = useSceneStore.getState().currentTime + STEP;
        if (next > MAX_HOUR) {
          setTime(MIN_HOUR);
          setPlaying(false);
        } else {
          setTime(next);
        }
      }, PLAY_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, setTime, setPlaying]);

  const handleSlider = (e) => {
    setPlaying(false);
    setTime(parseFloat(e.target.value));
  };

  const togglePlay = () => {
    if (currentTime >= MAX_HOUR) setTime(MIN_HOUR);
    setPlaying(!isPlaying);
  };

  const pct = ((currentTime - MIN_HOUR) / (MAX_HOUR - MIN_HOUR)) * 100;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "12px 20px",
      background: "#FFFFFF",
      borderTop: "1px solid #D8D6D0",
      height: "56px",
      boxSizing: "border-box",
    }}>
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        style={{
          flexShrink: 0,
          width: "32px", height: "32px",
          borderRadius: "50%",
          background: "#242424",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F7F6F2",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#444")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#242424")}
      >
        {isPlaying ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect x="0" y="0" width="3" height="12" rx="1" />
            <rect x="7" y="0" width="3" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <polygon points="1,0 10,6 1,12" />
          </svg>
        )}
      </button>

      {/* Left time label */}
      <span style={{ fontSize: "11px", color: "#ADADAD", fontFamily: "monospace", flexShrink: 0 }}>06:00</span>

      {/* Slider track */}
      <div style={{ flex: 1, position: "relative" }}>
        <input
          type="range"
          min={MIN_HOUR}
          max={MAX_HOUR}
          step={STEP}
          value={currentTime}
          onChange={handleSlider}
          style={{
            width: "100%",
            background: `linear-gradient(to right, #242424 ${pct}%, #D8D6D0 ${pct}%)`,
          }}
        />
      </div>

      {/* Right time label */}
      <span style={{ fontSize: "11px", color: "#ADADAD", fontFamily: "monospace", flexShrink: 0 }}>18:00</span>

      {/* Current time */}
      <div style={{
        flexShrink: 0,
        minWidth: "48px",
        textAlign: "right",
      }}>
        <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "monospace", color: "#242424", letterSpacing: "0.02em" }}>
          {formatHour(currentTime)}
        </span>
      </div>
    </div>
  );
}
