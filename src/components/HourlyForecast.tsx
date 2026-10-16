import React, { useRef } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Droplets, 
  Wind 
} from 'lucide-react';
import type { HourlyForecastItem, UnitSystem, ClockFormat } from '../types/weather';
import { formatTemperature, formatWindSpeed, formatTime } from '../utils/temperature';
import { getWeatherInfo } from '../utils/weatherCodes';

interface HourlyForecastProps {
  items: HourlyForecastItem[];
  unit: UnitSystem;
  clockFormat: ClockFormat;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  items,
  unit,
  clockFormat,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Hourly Forecast
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Next 24 Hours Weather Outlook
            </p>
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
      >
        {items.map((hour, index) => {
          const weatherInfo = getWeatherInfo(hour.weatherCode, hour.isDay);
          const Icon = weatherInfo.icon;
          const isNow = index === 0;

          return (
            <div
              key={`hour-${hour.time}-${index}`}
              className={`flex flex-col items-center justify-between p-4 rounded-2xl min-w-[105px] sm:min-w-[115px] shrink-0 border transition-all duration-200 hover:-translate-y-1 ${
                isNow
                  ? 'bg-gradient-to-b from-sky-500/15 via-blue-500/10 to-transparent border-sky-400/50 shadow-md shadow-sky-500/10'
                  : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-800/70'
              }`}
            >
              {/* Time Label */}
              <div className="text-center">
                <span
                  className={`text-xs font-semibold font-mono ${
                    isNow ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isNow ? 'Now' : formatTime(hour.time, clockFormat)}
                </span>
                {isNow && (
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-sky-500">
                    Current
                  </span>
                )}
              </div>

              {/* Weather Icon */}
              <div className="my-2.5 p-2 rounded-xl bg-white/50 dark:bg-slate-700/50">
                <Icon className={`w-6 h-6 ${weatherInfo.iconColor}`} />
              </div>

              {/* Temperature */}
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {formatTemperature(hour.temperature, unit)}
              </p>

              {/* Rain Probability */}
              <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-500 dark:text-blue-400 font-medium">
                <Droplets className="w-3 h-3" />
                <span>{hour.precipitationProb}%</span>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                <Wind className="w-2.5 h-2.5 text-teal-500" />
                <span>{formatWindSpeed(hour.windSpeed, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
