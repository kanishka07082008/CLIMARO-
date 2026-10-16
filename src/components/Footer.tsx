import React from 'react';
import { CloudSun, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-slate-200/60 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center text-white">
            <CloudSun className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            CLIMARO
          </span>
          <span>•</span>
          <span>Real-Time Weather Intelligence</span>
        </div>

        {/* Data Attribution */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span>Weather & Geocoding data powered by</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>Open-Meteo API</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-400">(Non-commercial Open Data)</span>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-1 text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>React, Vite & Tailwind</span>
        </div>
      </div>
    </footer>
  );
};
