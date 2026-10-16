import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Droplets, 
  Wind, 
  Thermometer, 
  Compass, 
  Waves 
} from 'lucide-react';
import type { HourlyForecastItem, UnitSystem, ClockFormat } from '../types/weather';
import { celsiusToFahrenheit, formatWindSpeed, kmhToMph } from '../utils/temperature';

interface WeatherChartsProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
  clockFormat: ClockFormat;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  hourly,
  unit,
  clockFormat,
}) => {
  const [activeTab, setActiveTab] = useState<'temperature' | 'precipitation' | 'wind'>('temperature');

  if (!hourly || hourly.length === 0) return null;

  // Prepare chart dataset
  const chartData = hourly.map((item) => {
    const tempVal = unit === 'fahrenheit' ? celsiusToFahrenheit(item.temperature) : item.temperature;
    const feelsLikeVal = unit === 'fahrenheit' ? celsiusToFahrenheit(item.feelsLike) : item.feelsLike;
    const windSpeedVal = unit === 'fahrenheit' ? kmhToMph(item.windSpeed) : item.windSpeed;

    const date = new Date(item.time);
    let timeLabel: string;
    if (clockFormat === '12h') {
      timeLabel = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } else {
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return {
      time: timeLabel,
      rawTime: item.time,
      temp: Math.round(tempVal),
      feelsLike: Math.round(feelsLikeVal),
      precipitationProb: item.precipitationProb,
      precipitation: item.precipitation,
      windSpeed: Math.round(windSpeedVal),
      humidity: item.humidity,
    };
  });

  // Calculate wind and humidity analytics for the summary cards
  const avgHumidity = Math.round(hourly.reduce((acc, curr) => acc + curr.humidity, 0) / hourly.length);
  const maxWindSpeed = Math.max(...hourly.map((h) => h.windSpeed));
  const avgWindSpeed = Math.round(hourly.reduce((acc, curr) => acc + curr.windSpeed, 0) / hourly.length);

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Weather Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive 24-Hour Forecast Trends
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'temperature'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'precipitation'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'wind'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind & Humidity</span>
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                unit={`°`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                }}
                formatter={(val: any, name: any) => [
                  `${val ?? 0}°${unit === 'celsius' ? 'C' : 'F'}`,
                  name === 'temp' ? 'Temperature' : 'Feels Like',
                ]}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="temp"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name="feelsLike"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#feelsGradient)"
              />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [
                  `${val ?? 0}%`,
                  name === 'precipitationProb' ? 'Rain Chance' : 'Precipitation',
                ]}
              />
              <Bar
                dataKey="precipitationProb"
                name="precipitationProb"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [
                  name === 'windSpeed'
                    ? `${val ?? 0} ${unit === 'fahrenheit' ? 'mph' : 'km/h'}`
                    : `${val ?? 0}%`,
                  name === 'windSpeed' ? 'Wind Speed' : 'Humidity',
                ]}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="windSpeed"
                stroke="#14b8a6"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Wind & Humidity Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/50">
        {/* Wind Analytics Card */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-500 mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Wind Analytics (24h)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Average Wind: <strong className="text-slate-800 dark:text-slate-200">{formatWindSpeed(avgWindSpeed, unit)}</strong>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Peak Gust / Speed: <strong className="text-teal-600 dark:text-teal-400">{formatWindSpeed(maxWindSpeed, unit)}</strong>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Humidity Analytics Card */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Humidity Analytics (24h)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Average Humidity: <strong className="text-slate-800 dark:text-slate-200">{avgHumidity}%</strong>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Condition: <strong className="text-blue-600 dark:text-blue-400">
                {avgHumidity > 65 ? 'High (Steamy / Damp)' : avgHumidity < 35 ? 'Dry' : 'Balanced Comfort'}
              </strong>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Waves className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
