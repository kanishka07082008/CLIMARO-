import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  X, 
  Loader2, 
  Navigation, 
  AlertCircle,
  History
} from 'lucide-react';
import type { GeoLocation } from '../types/weather';
import { searchCities } from '../services/weatherApi';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  isGeoLoading: boolean;
  geoError: string | null;
  onDismissGeoError: () => void;
  recentSearches: GeoLocation[];
  currentCityName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isGeoLoading,
  geoError,
  onDismissGeoError,
  recentSearches,
  currentCityName
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search when debounced query changes
  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();

    const doSearch = async () => {
      const trimmed = debouncedQuery.trim();
      if (trimmed.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        setSearchError(null);
        return;
      }

      setIsLoading(true);
      setSearchError(null);

      try {
        const results = await searchCities(trimmed, abortController.signal);
        if (!isCancelled) {
          setSuggestions(results);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Error fetching city suggestions';
          setSearchError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    doSearch();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [debouncedQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSearchError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={dropdownRef}>
      {/* Geolocation Error Alert */}
      {geoError && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p>{geoError}</p>
          </div>
          <button
            onClick={onDismissGeoError}
            className="p-1 rounded-md hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Search Input & Location Button */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen && e.target.value.trim().length >= 2) setIsOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search city worldwide (e.g. London, Tokyo, New York, Paris)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl glass-panel text-sm sm:text-base font-medium placeholder-slate-400 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
          />

          {query && (
            <button
              onClick={clearInput}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <button
          onClick={onUseCurrentLocation}
          disabled={isGeoLoading}
          title="Use current location"
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-sky-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {isGeoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="relative z-50">
          <div className="absolute left-0 right-0 top-1 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {isLoading && suggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Searching worldwide cities...</span>
              </div>
            )}

            {!isLoading && suggestions.length === 0 && debouncedQuery.trim().length >= 2 && (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No matching cities found for &quot;{debouncedQuery}&quot;. Check the spelling or try another city.
              </div>
            )}

            {searchError && (
              <div className="p-4 text-center text-sm text-rose-500 dark:text-rose-400">
                {searchError}
              </div>
            )}

            {suggestions.map((item, index) => {
              const isSelected = index === selectedIndex;
              const locationParts = [item.admin1, item.country].filter(Boolean).join(', ');

              return (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors duration-150 ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {locationParts || 'Location'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {item.country_code && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {item.country_code}
                      </span>
                    )}
                    <span className="hidden sm:inline font-mono text-[11px]">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Searches Quick Access */}
      {recentSearches.length > 0 && !isOpen && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="flex items-center gap-1 text-slate-400 shrink-0">
            <History className="w-3.5 h-3.5" />
            <span>Recent:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentSearches.slice(0, 5).map((city) => (
              <button
                key={`recent-${city.id}-${city.name}`}
                onClick={() => onSelectCity(city)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                  currentCityName === city.name
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-sky-50 dark:hover:bg-slate-700'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
