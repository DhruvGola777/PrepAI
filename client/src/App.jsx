import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/dashboard/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loading page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Practice = lazy(() => import('./pages/Practice'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Settings = lazy(() => import('./pages/Settings'));
const Interview = lazy(() => import('./pages/Interview'));
const InterviewDetails = lazy(() => import('./pages/InterviewDetails'));
const Resume = lazy(() => import('./pages/Resume'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white transition-colors duration-300">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Loading experience...</p>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Toaster position="top-right" />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/history" element={<InterviewHistory />} />
                  <Route path="/history/:id" element={<InterviewDetails />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/interview" element={<Interview />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
