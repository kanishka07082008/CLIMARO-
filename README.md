# CLIMARO — Real-Time Weather Intelligence

A modern, responsive, real-time weather information and forecast dashboard built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. **CLIMARO** provides live meteorological data, 24-hour hourly trend analytics, and 7-day weather outlooks for cities worldwide using the open **Open-Meteo APIs** (no API key required).

![CLIMARO Preview](public/favicon.svg)

---

## 🌟 Key Features

1. **Live Meteorological Intelligence**
   - Live temperature in Celsius (°C) and Fahrenheit (°F).
   - Real-time weather condition with dynamic WMO weather code mapping and vibrant animated Lucide icons.
   - Feels-like temperature, daily minimum & maximum temperatures.
   - Relative humidity (%), barometric pressure (hPa), cloud cover (%), and precipitation (mm / in).
   - Wind speed and direction with compass headings (N, NE, ESE, etc.) and gust tracking.
   - Accurate local sunrise and sunset timings with daylight duration.
   - Solar UV index rating with safety guidelines.

2. **Worldwide City Search & Geolocation**
   - Real-time autocomplete suggestions with 300ms debounce.
   - Displays city, region/state, and country with country code badges.
   - Browser geolocation integration ("Current Location") with graceful permission-denied handling.
   - Initial default city: **Madurai, Tamil Nadu, India**.
   - Quick-access chips for recently searched cities.

3. **24-Hour Hourly Forecast**
   - Horizontally scrollable carousel with navigation arrows and touch swiping.
   - Hourly temperature, weather icons, rain probability (%), and wind speeds.

4. **7-Day Weather Outlook**
   - Highlights today's forecast.
   - Proportional temperature range bar showing progression between weekly highs and lows.
   - Rain probability and peak UV index ratings.

5. **Interactive Weather Analytics (Recharts)**
   - **Temperature Trend**: Smooth curved area chart tracking actual vs. feels-like temperature over 24 hours.
   - **Precipitation Probability**: Bar chart highlighting chance of rain.
   - **Wind & Humidity**: Metric graphs and 24-hour average/peak indicators.
   - Fully responsive for mobile, tablet, and desktop screens.

6. **User Customization & Local Persistence**
   - **Unit Toggle**: 1-click switch between Celsius (°C) and Fahrenheit (°F).
   - **Clock Format**: 12-hour (AM/PM) and 24-hour military clock display.
   - **Theme Engine**: Light and Dark mode with glassmorphism styling and dynamic ambient gradients tailored to current weather conditions (clear, cloudy, rain, thunderstorm, snow).
   - **Saved Favorites**: Save frequently visited cities to `localStorage` with instant 1-click weather switching.
   - **Refresh**: Live reload button with animated spinning feedback.

---

## 🏗️ Architecture & Project Structure

```
kanishka-project/
├── index.html                  # HTML5 shell with Google Inter font & meta tags
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS design system with custom colors
├── tsconfig.json               # TypeScript configuration
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Core application controller & state orchestrator
│   ├── index.css               # Global glassmorphism, gradients, & scrollbars
│   ├── components/
│   │   ├── Header.tsx          # Navbar, live clock, unit/clock/theme toggles
│   │   ├── SearchBar.tsx       # Geocoding search, suggestions, current location
│   │   ├── CurrentWeather.tsx  # Hero card with temperature & meteorological grid
│   │   ├── HourlyForecast.tsx  # Next 24h scrollable hourly outlook
│   │   ├── WeeklyForecast.tsx  # 7-day outlook with temperature range bars
│   │   ├── WeatherCharts.tsx   # Recharts area, bar, and line visualizations
│   │   ├── WeatherDetails.tsx  # Highlights for humidity, pressure, UV, and sun
│   │   ├── Favorites.tsx       # Saved favorite cities drawer modal
│   │   ├── LoadingSkeleton.tsx # Shimmering glassmorphism loading skeleton
│   │   ├── ErrorState.tsx      # Friendly error notification with retry button
│   │   └── Footer.tsx          # Open-Meteo attribution & copyright
│   ├── services/
│   │   └── weatherApi.ts       # Open-Meteo API integrations & reverse geocoding
│   ├── hooks/
│   │   ├── useWeather.ts       # Custom weather hook managing fetch lifecycle
│   │   ├── useDebounce.ts      # Debounce hook for input throttling
│   │   └── useLocalStorage.ts  # Persistent storage hook
│   ├── types/
│   │   └── weather.ts          # Complete TypeScript interfaces for all responses
│   └── utils/
│       ├── weatherCodes.ts     # WMO code interpreter & icon/theme mapping
│       └── temperature.ts      # Unit converters & time formatters
```

---

## 🌐 API Endpoints Used

All data is fetched in real-time without mock data or demo fallbacks:

1. **Open-Meteo Geocoding API**
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Parameters: `name={query}&count=10&language=en&format=json`
   - Documentation: [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api)

2. **Open-Meteo Weather Forecast API**
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Parameters:
     - `latitude={lat}&longitude={lon}`
     - `current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`
     - `hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,is_day`
     - `daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max`
     - `timezone=auto`
   - Documentation: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v24 recommended)
- **npm**: v9.0.0 or later

### Installation
Clone or navigate to the project directory:
```bash
cd "e:\kanishka project"
```

Install dependencies:
```bash
npm install
```

### Running the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Production Build
To create an optimized production build:
```bash
npm run build
```

To preview the production bundle:
```bash
npm run preview
```

---

## 🧪 Testing Checklist

| Test Item | Verification Criteria | Status |
|---|---|:---:|
| **Initial Default City** | Madurai, Tamil Nadu, India loads automatically on first visit. | ✅ Passed |
| **Real API Data** | All temperatures and metrics come from Open-Meteo API. | ✅ Passed |
| **City Search** | Suggestions appear dynamically when typing; selecting a city fetches weather. | ✅ Passed |
| **Current Location** | Browser geolocation requests coordinates; handles denial gracefully. | ✅ Passed |
| **Hourly Forecast** | 24-hour horizontal cards with icons, rain %, and temperatures. | ✅ Passed |
| **7-Day Forecast** | High/low range bars, conditions, and UV index. Today is highlighted. | ✅ Passed |
| **Charts & Analytics** | Recharts renders responsive temperature, precipitation, and wind tabs. | ✅ Passed |
| **Unit Conversion** | Switching °C / °F instantly updates hero, hourly, daily, and chart views. | ✅ Passed |
| **Clock Format** | Switching 12h / 24h formats times across the application. | ✅ Passed |
| **Favorites Persistence** | Adding cities to favorites stores them in `localStorage`; persistent on refresh. | ✅ Passed |
| **Theme Switching** | Toggling light/dark mode smoothly transitions styles & glassmorphism. | ✅ Passed |
| **Error Handling** | Network disconnect or invalid query states show clear retry screens. | ✅ Passed |
| **Responsiveness** | Fluid layout across mobile (360px+), tablet (768px+), and desktop (1024px+). | ✅ Passed |

---

## 📄 License & Attribution
- Data provided by [Open-Meteo.com](https://open-meteo.com/) under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.
- Built for educational, personal, and non-commercial portfolio use.
