import type { 
  GeoLocation, 
  GeocodingResponse, 
  RawForecastResponse, 
  WeatherData, 
  HourlyForecastItem, 
  DailyForecastItem, 
  CurrentWeatherData 
} from '../types/weather';
import { formatDayName } from '../utils/temperature';

export const DEFAULT_CITY: GeoLocation = {
  id: 1264521,
  name: "Madurai",
  latitude: 9.919,
  longitude: 78.11953,
  country: "India",
  admin1: "Tamil Nadu",
  country_code: "IN",
  timezone: "Asia/Kolkata"
};

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Geocoding rate limit reached. Please wait a moment and try again.');
      }
      throw new Error(`Failed to search cities (${response.status})`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return [];
    }
    console.error('Error searching cities:', error);
    throw error;
  }
}

/**
 * Fetches real weather forecast data from Open-Meteo
 */
export async function fetchWeatherForecast(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','),
    timezone: 'auto'
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Weather API rate limit reached. Please wait a few seconds and refresh.');
    }
    throw new Error(`Unable to fetch weather data from Open-Meteo (${response.status})`);
  }

  const raw: RawForecastResponse = await response.json();

  // Find index of current hour in hourly forecast
  const currentTime = raw.current.time;
  const currentHourDate = new Date(currentTime);
  const currentHourTimestamp = currentHourDate.getTime();

  let startIndex = 0;
  if (raw.hourly && raw.hourly.time && raw.hourly.time.length > 0) {
    const foundIndex = raw.hourly.time.findIndex((t) => {
      const timeVal = new Date(t).getTime();
      return Math.abs(timeVal - currentHourTimestamp) < 3600000;
    });
    if (foundIndex !== -1) {
      startIndex = foundIndex;
    }
  }

  // Next 24 hours of forecast
  const next24Hours: HourlyForecastItem[] = [];
  const hourlyCount = Math.min(24, raw.hourly.time.length - startIndex);
  
  for (let i = 0; i < hourlyCount; i++) {
    const idx = startIndex + i;
    const timeStr = raw.hourly.time[idx];
    const itemDate = new Date(timeStr);
    
    next24Hours.push({
      time: timeStr,
      formattedTime: itemDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temperature: raw.hourly.temperature_2m[idx],
      feelsLike: raw.hourly.apparent_temperature[idx],
      weatherCode: raw.hourly.weather_code[idx],
      precipitationProb: raw.hourly.precipitation_probability ? raw.hourly.precipitation_probability[idx] ?? 0 : 0,
      precipitation: raw.hourly.precipitation ? raw.hourly.precipitation[idx] ?? 0 : 0,
      windSpeed: raw.hourly.wind_speed_10m[idx],
      windDirection: raw.hourly.wind_direction_10m[idx],
      humidity: raw.hourly.relative_humidity_2m[idx],
      uvIndex: raw.hourly.uv_index ? raw.hourly.uv_index[idx] : undefined,
      isDay: raw.hourly.is_day ? Boolean(raw.hourly.is_day[idx]) : true,
    });
  }

  // 7-day daily forecast
  const dailyForecasts: DailyForecastItem[] = [];
  const daysCount = Math.min(7, raw.daily.time.length);

  for (let i = 0; i < daysCount; i++) {
    const dateStr = raw.daily.time[i];
    const { dayName, formattedDate, isToday } = formatDayName(dateStr);

    dailyForecasts.push({
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode: raw.daily.weather_code[i],
      tempMax: raw.daily.temperature_2m_max[i],
      tempMin: raw.daily.temperature_2m_min[i],
      precipitationProb: raw.daily.precipitation_probability_max ? raw.daily.precipitation_probability_max[i] ?? 0 : 0,
      precipitationSum: raw.daily.precipitation_sum ? raw.daily.precipitation_sum[i] ?? 0 : 0,
      uvIndexMax: raw.daily.uv_index_max ? raw.daily.uv_index_max[i] ?? 0 : 0,
      sunrise: raw.daily.sunrise[i],
      sunset: raw.daily.sunset[i],
      isToday,
    });
  }

  // Current weather
  const currentData: CurrentWeatherData = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    feelsLike: raw.current.apparent_temperature,
    tempMin: raw.daily.temperature_2m_min[0] ?? raw.current.temperature_2m,
    tempMax: raw.daily.temperature_2m_max[0] ?? raw.current.temperature_2m,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    windGusts: raw.current.wind_gusts_10m,
    pressure: raw.current.pressure_msl ?? raw.current.surface_pressure,
    cloudCover: raw.current.cloud_cover,
    precipitation: raw.current.precipitation,
    weatherCode: raw.current.weather_code,
    isDay: Boolean(raw.current.is_day),
    sunrise: raw.daily.sunrise[0] || '',
    sunset: raw.daily.sunset[0] || '',
    uvIndex: raw.daily.uv_index_max ? raw.daily.uv_index_max[0] : undefined,
  };

  return {
    current: currentData,
    hourly: next24Hours,
    daily: dailyForecasts,
    location,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Reverse geocodes coordinates to a human-friendly city name
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'CLIMARO-WeatherApp/1.0' },
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'Current Location';
      const admin1 = addr.state || addr.region || addr.county || '';
      const country = addr.country || '';

      return {
        id: Math.round(latitude * 1000 + longitude * 100),
        name: cityName,
        latitude,
        longitude,
        admin1,
        country,
        country_code: addr.country_code ? addr.country_code.toUpperCase() : undefined,
      };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Reverse geocoding timed out or failed, falling back to coordinate label:', err);
  }

  // Graceful fallback
  return {
    id: Math.round(latitude * 1000 + longitude * 100),
    name: 'Current Location',
    latitude,
    longitude,
    admin1: `${latitude.toFixed(2)}°N`,
    country: `${longitude.toFixed(2)}°E`,
  };
}
