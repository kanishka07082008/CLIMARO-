import React from 'react';
import { 
  CalendarDays, 
  Droplets, 
  Sparkles
} from 'lucide-react';
import type { DailyForecastItem, UnitSystem } from '../types/weather';
import { formatTemperature } from '../utils/temperature';
import { getWeatherInfo } from '../utils/weatherCodes';

interface WeeklyForecastProps {
  items: DailyForecastItem[];
  unit: UnitSystem;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({
  items,
  unit,
}) => {
  if (!items || items.length === 0) return null;

  // Find min and max across all 7 days to calculate proportional temperature bars
  const allMins = items.map((i) => i.tempMin);
  const allMaxs = items.map((i) => i.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = globalMax - globalMin || 1;

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            7-Day Outlook
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily Conditions & Temperature Range
          </p>
        </div>
      </div>

      {/* Daily Items List */}
      <div className="space-y-3">
        {items.map((day, idx) => {
          const weatherInfo = getWeatherInfo(day.weatherCode, true);
          const Icon = weatherInfo.icon;

          // Bar positioning percentage
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / range) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / range) * 100));

          return (
            <div
              key={`day-${day.date}-${idx}`}
              className={`p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all duration-200 ${
                day.isToday
                  ? 'bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent border-sky-400/50 shadow-sm'
                  : 'bg-white/40 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {/* Day Name & Date */}
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-700/60 shrink-0">
                  <Icon className={`w-5 h-5 ${weatherInfo.iconColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className={`font-bold text-sm ${day.isToday ? 'text-sky-600 dark:text-sky-400' : 'text-slate-900 dark:text-white'}`}>
                      {day.dayName}
                    </p>
                    {day.isToday && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-500 text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {day.formattedDate}
                  </p>
                </div>
              </div>

              {/* Weather Condition Label & Rain chance */}
              <div className="flex items-center justify-between sm:justify-start gap-4 sm:min-w-[170px]">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {weatherInfo.label}
                </span>

                {day.precipitationProb > 0 ? (
                  <span className="flex items-center gap-1 text-xs text-blue-500 font-medium shrink-0">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{day.precipitationProb}%</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">0%</span>
                )}
              </div>

              {/* UV Index Badge */}
              <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 min-w-[80px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>UV {day.uvIndexMax.toFixed(0)}</span>
              </div>

              {/* Min - Max Temperature Bar */}
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 font-mono w-10 text-right">
                  {formatTemperature(day.tempMin, unit, false)}°
                </span>

                {/* Range Bar Graphic */}
                <div className="relative flex-1 h-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono w-10 text-left">
                  {formatTemperature(day.tempMax, unit, false)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
