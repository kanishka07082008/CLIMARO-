import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForecast';
import { WeatherCharts } from './components/WeatherCharts';
import { WeatherDetails } from './components/WeatherDetails';
import { Favorites } from './components/Favorites';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { 
  UnitSystem, 
  ClockFormat, 
  ThemeMode, 
  FavoriteCity, 
  GeoLocation 
} from './types/weather';
import { DEFAULT_CITY } from './services/weatherApi';
import { getWeatherInfo } from './utils/weatherCodes';

export function App() {
  // Weather hook orchestrating Open-Meteo API data
  const {
    data,
    loading,
    error,
    currentLocation,
    loadWeather,
    refreshWeather,
    fetchCurrentLocationWeather,
    geoLoading,
    geoError,
    clearGeoError,
  } = useWeather();

  // User persistent preferences
  const [unit, setUnit] = useLocalStorage<UnitSystem>('climaro_unit', 'celsius');
  const [clockFormat, setClockFormat] = useLocalStorage<ClockFormat>('climaro_clock', '12h');
  
  const [theme, setTheme] = useLocalStorage<ThemeMode>('climaro_theme', 'dark');

  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>('climaro_favorites', []);
  const [recentSearches, setRecentSearches] = useLocalStorage<GeoLocation[]>('climaro_recent', [
    DEFAULT_CITY,
    { id: 1277333, name: "Bengaluru", admin1: "Karnataka", country: "India", latitude: 12.9719, longitude: 77.5937 },
    { id: 2643743, name: "London", admin1: "England", country: "United Kingdom", latitude: 51.5085, longitude: -0.1257 },
    { id: 5128581, name: "New York", admin1: "New York", country: "United States", latitude: 40.7143, longitude: -74.006 },
    { id: 1850147, name: "Tokyo", admin1: "Tokyo", country: "Japan", latitude: 35.6895, longitude: 139.6917 }
  ]);

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Apply dark mode class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Determine dynamic weather ambient background class
  const weatherBgClass = useMemo(() => {
    if (!data || !data.current) return 'weather-bg-clear';
    const info = getWeatherInfo(data.current.weatherCode, data.current.isDay);
    switch (info.bgType) {
      case 'clear':
        return 'weather-bg-clear';
      case 'cloudy':
        return 'weather-bg-cloudy';
      case 'rain':
        return 'weather-bg-rain';
      case 'thunder':
        return 'weather-bg-thunder';
      case 'snow':
        return 'weather-bg-snow';
      default:
        return 'weather-bg-clear';
    }
  }, [data]);

  // Handle city selection
  const handleSelectCity = (city: GeoLocation) => {
    loadWeather(city);

    // Save to recent searches (deduplicate and keep top 6)
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name.toLowerCase() !== city.name.toLowerCase());
      return [city, ...filtered].slice(0, 6);
    });
  };

  // Toggle unit
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  // Toggle clock format
  const handleToggleClockFormat = () => {
    setClockFormat((prev) => (prev === '12h' ? '24h' : '12h'));
  };

  // Toggle theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check if current city is in favorites
  const isCurrentFavorite = useMemo(() => {
    if (!currentLocation) return false;
    return favorites.some(
      (f) =>
        f.id === currentLocation.id ||
        (f.name.toLowerCase() === currentLocation.name.toLowerCase() &&
          Math.abs(f.latitude - currentLocation.latitude) < 0.05)
    );
  }, [favorites, currentLocation]);

  // Toggle current city in favorites
  const handleToggleFavorite = () => {
    if (!currentLocation) return;

    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            !(
              f.id === currentLocation.id ||
              (f.name.toLowerCase() === currentLocation.name.toLowerCase() &&
                Math.abs(f.latitude - currentLocation.latitude) < 0.05)
            )
        )
      );
    } else {
      const newFav: FavoriteCity = {
        id: currentLocation.id,
        name: currentLocation.name,
        admin1: currentLocation.admin1,
        country: currentLocation.country,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        addedAt: Date.now(),
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  // Remove a favorite by ID
  const handleRemoveFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${weatherBgClass}`}>
      {/* Navigation Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        clockFormat={clockFormat}
        onToggleClockFormat={handleToggleClockFormat}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onRefresh={refreshWeather}
        isRefreshing={loading}
        favorites={favorites}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        lastUpdated={data?.lastUpdated}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Search & Location Bar */}
        <section aria-label="City Search">
          <SearchBar
            onSelectCity={handleSelectCity}
            onUseCurrentLocation={fetchCurrentLocationWeather}
            isGeoLoading={geoLoading}
            geoError={geoError}
            onDismissGeoError={clearGeoError}
            recentSearches={recentSearches}
            currentCityName={currentLocation?.name}
          />
        </section>

        {/* State Conditional Display: Loading / Error / Weather Dashboard */}
        {loading && !data ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={refreshWeather}
            onResetDefault={() => handleSelectCity(DEFAULT_CITY)}
          />
        ) : data ? (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Hero Current Weather Card */}
            <section aria-label="Current Weather">
              <CurrentWeather
                data={data}
                unit={unit}
                clockFormat={clockFormat}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </section>

            {/* 24-Hour Forecast Horizontal Carousel */}
            <section aria-label="Hourly Forecast">
              <HourlyForecast
                items={data.hourly}
                unit={unit}
                clockFormat={clockFormat}
              />
            </section>

            {/* 2-Column Responsive Layout: 7-Day Forecast & Weather Charts */}
            <section aria-label="Forecast and Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* 7-Day Forecast */}
              <div className="lg:col-span-5">
                <WeeklyForecast
                  items={data.daily}
                  unit={unit}
                />
              </div>

              {/* Weather Analytics Charts */}
              <div className="lg:col-span-7">
                <WeatherCharts
                  hourly={data.hourly}
                  unit={unit}
                  clockFormat={clockFormat}
                />
              </div>
            </section>

            {/* Meteorological Highlights & Parameters */}
            <section aria-label="Weather Highlights">
              <WeatherDetails
                current={data.current}
                unit={unit}
                clockFormat={clockFormat}
              />
            </section>
          </div>
        ) : null}
      </main>

      {/* Favorites Drawer/Modal */}
      <Favorites
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCity={handleSelectCity}
        onRemoveFavorite={handleRemoveFavorite}
        currentCityId={currentLocation?.id}
      />

      {/* Attribution Footer */}
      <Footer />
    </div>
  );
}

export default App;
