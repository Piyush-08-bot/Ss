# ☀️ SolSight — 3D Rooftop Solar & Sunlight Visualization

SolSight is an interactive, browser-based 3D rooftop simulation tool designed to visually demonstrate how sunlight and shadow angles evolve across a rooftop throughout the day and year. Built with real astronomical formulas (NOAA solar calculator) and historical climate data from NASA POWER.

---

## ✨ Key Features

- 📐 **Interactive 3D Rooftop Scene**: Full 3D rooftop model with solar panel arrays, water tanks, and surrounding structure obstacles built with Three.js / React Three Fiber.
- ☀️ **Real Solar Geometry Math**: Calculates exact solar azimuth and elevation for any location using NOAA astronomical algorithms (no mock data).
- 🕒 **Dynamic Day Simulation**: 06:00 to 18:00 interactive time slider with real-time shadow casting, direction reversal (East → West), and animated sunlight playback.
- 📅 **Seasonal Sun Tracking**: Select any month and day to simulate seasonal sun height differences (e.g. high summer sun vs low winter sun).
- 📊 **Daily Sun Availability Chart**: Pure SVG bar chart displaying hourly solar coverage and peak sun hours ($>20^\circ$ elevation).
- 🌍 **Global City Search & NASA Climate Data**: Integrated OpenStreetMap Nominatim geocoding paired with live historical solar radiation ($\text{kWh/m}^2/\text{day}$) and average temperatures from the NASA POWER API.
- 🏠 **Customizable Roof Dimensions**: Dynamic roof resizing (width $\times$ depth) with live capacity and panel count updates.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **State Management**: Zustand
- **Styling**: Modern minimal CSS & Tailwind CSS
- **APIs**: NASA POWER API (Solar & Temp), OpenStreetMap Nominatim (Geocoding)
- **Math**: Pure client-side NOAA Solar Calculator implementation
