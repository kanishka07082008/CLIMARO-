import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onResetDefault: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onResetDefault,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto my-12 rounded-3xl glass-panel p-8 text-center border border-rose-500/20 shadow-xl animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Unable to Load Weather
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
        {message || 'An unexpected error occurred while communicating with the Open-Meteo weather service.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-md shadow-sky-500/25 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onResetDefault}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all duration-200"
        >
          <Home className="w-4 h-4 text-sky-500" />
          <span>Reset to Madurai</span>
        </button>
      </div>
    </div>
  );
};
