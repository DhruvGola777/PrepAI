import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      if (window.opener) {
        // If opened in a popup window, send token to main window
        window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token }, '*');
        window.close();
      } else {
        // Fallback if somehow not opened in a popup
        localStorage.setItem('token', token);
        window.location.href = '/dashboard';
      }
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">Authenticating...</p>
      </div>
    </div>
  );
}
