/**
 * DatePicker.jsx
 * A minimal month + day selector for seasonal sun simulation.
 * No external library — plain select inputs.
 */
import useSceneStore from "../../store/useSceneStore";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Days per month (non-leap year; good enough for simulation)
function daysInMonth(month) {
  return new Date(new Date().getFullYear(), month, 0).getDate();
}

const selectStyle = {
  fontSize: "12px",
  fontFamily: "'Inter', sans-serif",
  color: "#242424",
  background: "#F7F6F2",
  border: "1px solid #D8D6D0",
  borderRadius: "2px",
  padding: "4px 6px",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
};

export default function DatePicker() {
  const selectedMonth  = useSceneStore((s) => s.selectedMonth);
  const selectedDay    = useSceneStore((s) => s.selectedDay);
  const setSelectedMonth = useSceneStore((s) => s.setSelectedMonth);
  const setSelectedDay   = useSceneStore((s) => s.setSelectedDay);

  const maxDays = daysInMonth(selectedMonth);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setSelectedMonth(newMonth);
    // Clamp day if switching to a shorter month
    if (selectedDay > daysInMonth(newMonth)) {
      setSelectedDay(daysInMonth(newMonth));
    }
  };

  const handleDayChange = (e) => {
    setSelectedDay(parseInt(e.target.value, 10));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Calendar icon */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>

      <div>
        <p style={{ fontSize: "9px", color: "#ADADAD", lineHeight: 1, marginBottom: "2px" }}>Date</p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Month */}
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={selectStyle}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          {/* Day */}
          <select
            value={selectedDay}
            onChange={handleDayChange}
            style={selectStyle}
          >
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
