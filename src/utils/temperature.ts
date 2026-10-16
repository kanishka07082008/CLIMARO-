import type { UnitSystem, ClockFormat } from '../types/weather';

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Formats a Celsius temperature according to user preference
 */
export function formatTemperature(
  tempInCelsius: number,
  unit: UnitSystem,
  includeSymbol = true
): string {
  if (tempInCelsius === undefined || tempInCelsius === null || isNaN(tempInCelsius)) {
    return '--';
  }
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(tempInCelsius) : tempInCelsius;
  const rounded = Math.round(value);
  return includeSymbol ? `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}` : `${rounded}°`;
}

/**
 * Converts km/h to mph
 */
export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

/**
 * Formats wind speed based on selected unit system
 */
export function formatWindSpeed(kmh: number, unit: UnitSystem): string {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'fahrenheit') {
    return `${Math.round(kmhToMph(kmh))} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Formats atmospheric pressure
 */
export function formatPressure(hPa: number): string {
  if (hPa === undefined || hPa === null || isNaN(hPa)) return '--';
  return `${Math.round(hPa)} hPa`;
}

/**
 * Formats precipitation amount
 */
export function formatPrecipitation(mm: number, unit: UnitSystem): string {
  if (mm === undefined || mm === null || isNaN(mm)) return '0 mm';
  if (unit === 'fahrenheit') {
    const inches = mm / 25.4;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

/**
 * Converts degrees to compass direction
 */
export function getWindDirection(deg: number): string {
  if (deg === undefined || deg === null || isNaN(deg)) return 'N/A';
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Format time string according to clock preference (12h vs 24h)
 * Handles ISO strings like "2026-10-16T14:00" or Date objects
 */
export function formatTime(timeStr: string | Date, clockFormat: ClockFormat): string {
  if (!timeStr) return '--:--';
  const date = typeof timeStr === 'string' ? new Date(timeStr) : timeStr;
  if (isNaN(date.getTime())) {
    // If it's something like "14:00"
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const [hourStr, minStr] = timeStr.split(':');
      let hour = parseInt(hourStr, 10);
      const min = minStr || '00';
      if (clockFormat === '12h') {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${min} ${ampm}`;
      }
      return `${hour.toString().padStart(2, '0')}:${min}`;
    }
    return '--:--';
  }

  if (clockFormat === '12h') {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Formats a date into weekday name and day (e.g. "Mon, Oct 16" or "Tomorrow")
 */
export function formatDayName(dateStr: string): { dayName: string; formattedDate: string; isToday: boolean } {
  const target = new Date(dateStr);
  const today = new Date();
  
  const isToday = 
    target.getDate() === today.getDate() &&
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = 
    target.getDate() === tomorrow.getDate() &&
    target.getMonth() === tomorrow.getMonth() &&
    target.getFullYear() === tomorrow.getFullYear();

  let dayName = target.toLocaleDateString('en-US', { weekday: 'short' });
  if (isToday) dayName = 'Today';
  else if (isTomorrow) dayName = 'Tomorrow';

  const formattedDate = target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return { dayName, formattedDate, isToday };
}
