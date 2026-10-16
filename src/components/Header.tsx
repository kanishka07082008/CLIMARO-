import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Sun, 
  Moon, 
  RotateCw, 
  Bookmark, 
  Clock, 
  Thermometer
} from 'lucide-react';
import type { UnitSystem, ClockFormat, ThemeMode, FavoriteCity } from '../types/weather';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  clockFormat: ClockFormat;
  onToggleClockFormat: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  favorites: FavoriteCity[];
  onOpenFavorites: () => void;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  clockFormat,
  onToggleClockFormat,
  theme,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  favorites,
  onOpenFavorites,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (clockFormat === '12h') {
        setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
      } else {
        setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clockFormat]);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/20 dark:border-slate-800/80 shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
            <CloudSun className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                CLIMARO
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Real-Time Weather Intelligence
            </p>
          </div>
        </div>

        {/* Live Clock (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-mono font-medium shadow-inner">
          <Clock className="w-3.5 h-3.5 text-sky-500" />
          <span>{currentTime}</span>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'celsius' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
          >
            <Thermometer className="w-3.5 h-3.5 text-sky-500" />
            <span>°{unit === 'celsius' ? 'C' : 'F'}</span>
          </button>

          {/* Clock format toggle */}
          <button
            onClick={onToggleClockFormat}
            title={`Switch to ${clockFormat === '12h' ? '24-hour clock' : '12-hour clock'}`}
            className="hidden sm:flex items-center px-2 py-1.5 rounded-lg text-xs font-semibold bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
          >
            <span>{clockFormat}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data"
            className={`p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 ${
              isRefreshing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <RotateCw className={`w-4 h-4 text-sky-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            title="Saved Favorite Cities"
            className="relative p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
