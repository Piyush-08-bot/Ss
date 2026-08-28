/**
 * useSceneStore.js
 * Zustand global store for SolSight scene state.
 * sunPosition is computed lazily via useSunPosition() hook.
 */
import { create } from "zustand";
import { getSunPosition } from "../utils/sunPosition";

const DEFAULT_LAT  = 28.6139;
const DEFAULT_LON  = 77.209;
const DEFAULT_CITY = "New Delhi, India";
const DEFAULT_TIME = 12.0;

// Default date = today
const today = new Date();

const useSceneStore = create((set) => ({
  // ── Location ──────────────────────────────────────────────────
  lat:      DEFAULT_LAT,
  lon:      DEFAULT_LON,
  cityName: DEFAULT_CITY,

  setLocation: (lat, lon, cityName) => set({ lat, lon, cityName }),

  // ── Date ──────────────────────────────────────────────────────
  // Store month (1–12) and day separately so the UI is simple
  selectedMonth: today.getMonth() + 1,   // 1-indexed
  selectedDay:   today.getDate(),

  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedDay:   (day)   => set({ selectedDay:   day   }),

  // ── Time ──────────────────────────────────────────────────────
  currentTime: DEFAULT_TIME,
  isPlaying:   false,

  setTime:    (time)      => set({ currentTime: time }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  // ── Roof ──────────────────────────────────────────────────────
  roofWidth: 10,
  roofDepth:  8,

  // ── NASA POWER ────────────────────────────────────────────────
  nasaData:    null,
  nasaLoading: false,
  nasaError:   false,

  setNasaData:    (data)    => set({ nasaData: data, nasaLoading: false, nasaError: !data }),
  setNasaLoading: (loading) => set({ nasaLoading: loading }),
}));

/**
 * Compute sun position from store state on-demand.
 * Uses selectedMonth + selectedDay so seasonal changes are reflected.
 */
export function useSunPosition() {
  const lat          = useSceneStore((s) => s.lat);
  const lon          = useSceneStore((s) => s.lon);
  const currentTime  = useSceneStore((s) => s.currentTime);
  const selectedMonth = useSceneStore((s) => s.selectedMonth);
  const selectedDay   = useSceneStore((s) => s.selectedDay);

  // Build a Date with the selected month/day but current year
  const date = new Date(new Date().getFullYear(), selectedMonth - 1, selectedDay);
  return getSunPosition(lat, lon, date, currentTime);
}

/**
 * Compute sun position for arbitrary inputs (for chart/analysis).
 * Pure function — no hooks.
 */
export function computeSunPosition(lat, lon, month, day, hour) {
  const date = new Date(new Date().getFullYear(), month - 1, day);
  return getSunPosition(lat, lon, date, hour);
}

export default useSceneStore;
