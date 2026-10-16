import { useState, useEffect, useCallback, useRef } from 'react';
import type { WeatherData, GeoLocation } from '../types/weather';
import { fetchWeatherForecast, reverseGeocode, DEFAULT_CITY } from '../services/weatherApi';

export function useWeather() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(DEFAULT_CITY);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Keep track of current fetch to avoid race conditions
  const currentFetchId = useRef(0);

  const loadWeather = useCallback(async (location: GeoLocation) => {
    const fetchId = ++currentFetchId.current;
    setLoading(true);
    setError(null);
    setCurrentLocation(location);

    try {
      const weatherData = await fetchWeatherForecast(location);
      if (fetchId === currentFetchId.current) {
        setData(weatherData);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (fetchId === currentFetchId.current) {
        const message = err instanceof Error ? err.message : 'Failed to load weather data. Please try again.';
        setError(message);
        setLoading(false);
      }
    }
  }, []);

  // Fetch for default city on mount
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  // Refresh current city
  const refreshWeather = useCallback(() => {
    if (currentLocation) {
      loadWeather(currentLocation);
    }
  }, [currentLocation, loadWeather]);

  // Use browser geolocation to find current user location
  const fetchCurrentLocationWeather = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          setGeoLoading(false);
          loadWeather(location);
        } catch (err: unknown) {
          setGeoLoading(false);
          const msg = err instanceof Error ? err.message : 'Failed to detect location coordinates.';
          setGeoError(msg);
        }
      },
      (geoErr) => {
        setGeoLoading(false);
        switch (geoErr.code) {
          case geoErr.PERMISSION_DENIED:
            setGeoError('Location access was denied. Please allow location permissions in your browser or search for your city manually.');
            break;
          case geoErr.POSITION_UNAVAILABLE:
            setGeoError('Location information is currently unavailable. Please try again or search manually.');
            break;
          case geoErr.TIMEOUT:
            setGeoError('Location request timed out. Please check your connection and try again.');
            break;
          default:
            setGeoError('An unknown error occurred while requesting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [loadWeather]);

  const clearGeoError = useCallback(() => {
    setGeoError(null);
  }, []);

  return {
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
  };
}
