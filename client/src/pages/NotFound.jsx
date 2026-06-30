import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white px-6 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          {/* Decorative glowing background */}
          <div className="absolute inset-0 -m-8 bg-indigo-500/10 dark:bg-indigo-500/25 rounded-full filter blur-3xl opacity-75 pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center mb-6 shadow-md">
              <AlertCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-8xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              404
            </h1>
            <h2 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base max-w-sm">
              The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Safety
          </button>
        </div>
      </div>
    </div>
  );
}
