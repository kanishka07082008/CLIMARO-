import React from 'react';
import { 
  Heart, 
  MapPin, 
  ArrowUp, 
  ArrowDown, 
  Wind, 
  Droplets, 
  Gauge, 
  Cloud, 
  CloudRain, 
  Sunrise, 
  Sunset,
  Compass,
  Calendar,
  Sparkles
} from 'lucide-react';
import type { WeatherData, UnitSystem, ClockFormat } from '../types/weather';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatPressure, 
  formatPrecipitation, 
  getWindDirection, 
  formatTime 
} from '../utils/temperature';
import { getWeatherInfo } from '../utils/weatherCodes';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: UnitSystem;
  clockFormat: ClockFormat;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  unit,
  clockFormat,
  isFavorite,
  onToggleFavorite,
}) => {
  const { current, location, lastUpdated } = data;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const IconComponent = weatherInfo.icon;

  const locationSubtitle = [location.admin1, location.country].filter(Boolean).join(', ');

  // Format last updated
  const formattedLastUpdated = lastUpdated
    ? formatTime(new Date(lastUpdated), clockFormat)
    : 'Just now';

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      {/* Decorative ambient glowing circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Location, Date & Favorite Action */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {location.name}
                </h1>
                {location.country_code && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {location.country_code}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {locationSubtitle || 'Coordinates: ' + location.latitude.toFixed(2) + '°, ' + location.longitude.toFixed(2) + '°'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>{todayFormatted}</span>
            <span>•</span>
            <span>Updated {formattedLastUpdated}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 ${
            isFavorite
              ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>
      </div>

      {/* Main Temperature and Weather Icon Section */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left: Huge Temp & Condition */}
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="relative">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-800/60 shadow-lg border border-white/50 dark:border-slate-700/60 flex items-center justify-center">
              <IconComponent className={`w-14 h-14 sm:w-20 sm:h-20 ${weatherInfo.iconColor} animate-float`} />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-white shadow-sm">
              {current.isDay ? 'Day' : 'Night'}
            </div>
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">
                {formatTemperature(current.temperature, unit, false)}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-sky-600 dark:text-sky-400 ml-1">
                °{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-300 dark:to-blue-400 bg-clip-text text-transparent mt-0.5">
              {weatherInfo.label}
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>
                Feels like <strong className="text-slate-800 dark:text-slate-200">{formatTemperature(current.feelsLike, unit)}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3.5 h-3.5" />
                {formatTemperature(current.tempMax, unit)}
              </span>
              <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                <ArrowDown className="w-3.5 h-3.5" />
                {formatTemperature(current.tempMin, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sunrise & Sunset Highlights */}
        {current.sunrise && current.sunset && (
          <div className="flex sm:flex-col gap-3 justify-around sm:justify-center p-3.5 sm:p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/50 min-w-[180px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-500">
                <Sunrise className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Sunrise</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {formatTime(current.sunrise, clockFormat)}
                </p>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 sm:w-full sm:h-px" />

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-500">
                <Sunset className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Sunset</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {formatTime(current.sunset, clockFormat)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Meteorological Attributes */}
      <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-sky-500 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Humidity</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {current.humidity}%
          </p>
          <p className="text-[10px] text-slate-400">
            {current.humidity > 65 ? 'High moisture' : current.humidity < 30 ? 'Dry air' : 'Comfortable'}
          </p>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-teal-500 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wind</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {formatWindSpeed(current.windSpeed, unit)}
          </p>
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-500" />
            <span>{getWindDirection(current.windDirection)} ({Math.round(current.windDirection)}°)</span>
          </p>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Gauge className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pressure</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {formatPressure(current.pressure)}
          </p>
          <p className="text-[10px] text-slate-400">
            {current.pressure >= 1013 ? 'High pressure' : 'Low pressure'}
          </p>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Cloud className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cloud Cover</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {current.cloudCover}%
          </p>
          <p className="text-[10px] text-slate-400">
            {current.cloudCover > 80 ? 'Heavy overcast' : current.cloudCover > 30 ? 'Partly cloudy' : 'Clear skies'}
          </p>
        </div>

        {/* Precipitation */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <CloudRain className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Precipitation</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {formatPrecipitation(current.precipitation, unit)}
          </p>
          <p className="text-[10px] text-slate-400">
            {current.precipitation > 0 ? 'Active rain' : 'No rain recorded'}
          </p>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">UV Index</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {current.uvIndex !== undefined ? current.uvIndex.toFixed(1) : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-400">
            {current.uvIndex !== undefined
              ? current.uvIndex > 8
                ? 'Very High (Protection)'
                : current.uvIndex > 5
                ? 'High (Sunscreen)'
                : current.uvIndex > 2
                ? 'Moderate'
                : 'Low'
              : 'Index'}
          </p>
        </div>
      </div>
    </div>
  );
};
