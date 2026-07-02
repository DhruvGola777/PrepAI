import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({ error, resetError }) {

  const handleReload = () => {
    if (resetError) resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    if (resetError) resetError();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white px-6 transition-colors duration-300">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="relative">
          {/* Decorative glowing background */}
          <div className="absolute inset-0 -m-8 bg-red-500/10 dark:bg-red-500/20 rounded-full filter blur-3xl opacity-75 pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center justify-center mb-6 shadow-md">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base max-w-md">
              An unexpected application error occurred. Don't worry, we've logged the details and you can try reloading the session.
            </p>
            
            {error && (
              <div className="w-full mt-6 bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20 rounded-xl p-4 text-left">
                <p className="text-xs font-semibold uppercase text-red-600 dark:text-red-400 mb-1">
                  Technical Details
                </p>
                <p className="font-mono text-sm text-red-800 dark:text-red-300 break-words leading-relaxed">
                  {error.message || String(error)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Safety
          </button>
        </div>
      </div>
    </div>
  );
}
