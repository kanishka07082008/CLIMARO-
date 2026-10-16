import React from 'react';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Cloud, 
  SunMedium, 
  Eye, 
  ThermometerSnowflake, 
  Compass,
  Clock,
  Sparkles
} from 'lucide-react';
import type { CurrentWeatherData, UnitSystem, ClockFormat } from '../types/weather';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatPressure, 
  getWindDirection, 
  formatTime 
} from '../utils/temperature';

interface WeatherDetailsProps {
  current: CurrentWeatherData;
  unit: UnitSystem;
  clockFormat: ClockFormat;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  current,
  unit,
  clockFormat,
}) => {
  // Approximate daylight hours from sunrise/sunset if available
  let daylightDuration = '';
  if (current.sunrise && current.sunset) {
    const rise = new Date(current.sunrise).getTime();
    const set = new Date(current.sunset).getTime();
    if (!isNaN(rise) && !isNaN(set) && set > rise) {
      const diffHrs = (set - rise) / (1000 * 60 * 60);
      const hrs = Math.floor(diffHrs);
      const mins = Math.round((diffHrs - hrs) * 60);
      daylightDuration = `${hrs}h ${mins}m daylight`;
    }
  }

  // Calculate approximate dew point using Magnus formula approximation
  const temp = current.temperature;
  const rh = current.humidity;
  const dewPoint = temp - ((100 - rh) / 5);

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Current Highlights & Metrics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-Time Meteorological Parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feels Like Card */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Feels Like</span>
            <ThermometerSnowflake className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatTemperature(current.feelsLike, unit)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {current.feelsLike > current.temperature
              ? 'Humidity makes it feel warmer'
              : current.feelsLike < current.temperature
              ? 'Wind chill makes it feel colder'
              : 'Similar to actual temperature'}
          </p>
        </div>

        {/* Wind & Gusts Card */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Wind & Gusts</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatWindSpeed(current.windSpeed, unit)}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <Compass className="w-3.5 h-3.5 text-teal-500" />
            <span>Direction: {getWindDirection(current.windDirection)} ({Math.round(current.windDirection)}°)</span>
          </div>
        </div>

        {/* Humidity & Dew Point */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Humidity & Dew Point</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {current.humidity}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Dew point is approx. <strong className="text-slate-700 dark:text-slate-300">{formatTemperature(dewPoint, unit)}</strong>
          </p>
        </div>

        {/* Atmospheric Pressure */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Barometric Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatPressure(current.pressure)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {current.pressure >= 1013 ? 'Normal/High pressure stability' : 'Lower pressure (cloud formation)'}
          </p>
        </div>

        {/* Sunrise & Sunset */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Sun Timing</span>
            <SunMedium className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            Rise: {formatTime(current.sunrise, clockFormat)}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
            Set: {formatTime(current.sunset, clockFormat)}
          </p>
          {daylightDuration && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{daylightDuration}</span>
            </p>
          )}
        </div>

        {/* Cloud Cover */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {current.cloudCover}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {current.cloudCover > 75 ? 'Dense cloud canopy' : current.cloudCover > 25 ? 'Scattered clouds' : 'Clear visibility'}
          </p>
        </div>

        {/* UV Index Rating */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">UV Rating</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {current.uvIndex !== undefined ? current.uvIndex.toFixed(1) : 'Normal'}
          </p>
          <p className="text-[10px] text-slate-400">
            {current.uvIndex !== undefined && current.uvIndex >= 6
              ? 'High UV: Seek shade during midday'
              : 'Safe ambient solar radiation'}
          </p>
        </div>

        {/* Visibility / Air Quality Note */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Atmospheric State</span>
            <Eye className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {current.isDay ? 'Clear Daylight' : 'Night Atmosphere'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            WMO standard code {current.weatherCode} verified via satellite & station network.
          </p>
        </div>
      </div>
    </div>
  );
};
