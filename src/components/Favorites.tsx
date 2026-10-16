import React from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  MapPin, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { FavoriteCity, GeoLocation } from '../types/weather';

interface FavoritesProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteCity[];
  onSelectCity: (city: GeoLocation) => void;
  onRemoveFavorite: (id: number) => void;
  currentCityId?: number;
}

export const Favorites: React.FC<FavoritesProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
  currentCityId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/40 dark:border-slate-800 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-500">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Saved Favorites
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved in local storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved cities */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2.5 pr-1">
          {favorites.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No favorite cities yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any city card to save your favorite locations for quick 1-click access!
              </p>
            </div>
          ) : (
            favorites.map((fav) => {
              const isCurrent = fav.id === currentCityId;
              const locationSub = [fav.admin1, fav.country].filter(Boolean).join(', ');

              return (
                <div
                  key={`fav-${fav.id}-${fav.name}`}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all duration-150 ${
                    isCurrent
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400/50'
                      : 'bg-white/50 dark:bg-slate-800/50 border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCity(fav);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {fav.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500 text-white shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {locationSub || 'Saved City'}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectCity(fav);
                        onClose();
                      }}
                      title="View forecast"
                      className="p-1.5 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      title="Remove from favorites"
                      className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
