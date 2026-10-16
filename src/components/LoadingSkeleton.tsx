import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Current Weather Hero Skeleton */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/40 dark:border-slate-800">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-14 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
          <div className="h-20 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl hidden sm:block" />
        </div>

        {/* 6 Metric boxes */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="rounded-3xl glass-panel p-6 border border-white/40 dark:border-slate-800">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-32 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* 2-Column Forecast & Analytics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl glass-panel p-6 border border-white/40 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-800/50" />
        <div className="h-80 rounded-3xl glass-panel p-6 border border-white/40 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-800/50" />
      </div>
    </div>
  );
};
