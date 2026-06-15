import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

// Single client entry point — redirects to platform login (handles 2FA/email verification)
// After login, platform redirects back to /dashboard
export default function ClientPortal() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    // FIX: Added timeout — if auth hangs for 8 seconds, show an error instead of spinning forever
    const timeout = setTimeout(() => {
      setError(true);
    }, 8000);

    base44.auth.isAuthenticated()
      .then(authed => {
        clearTimeout(timeout);
        if (authed) {
          navigate('/dashboard');
        } else {
          base44.auth.redirectToLogin('/dashboard');
        }
      })
      .catch((err) => {
        // FIX: Auth failure now shows a helpful message instead of an infinite spinner
        clearTimeout(timeout);
        console.error('Auth check failed:', err);
        setError(true);
      });

    return () => clearTimeout(timeout);
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-heading text-lg font-semibold text-charcoal mb-2">Something went wrong</p>
          <p className="font-body text-sm text-charcoal/40 font-light mb-6">
            We couldn't connect to your account. Please try again or contact us.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-coral text-white font-body text-sm tracking-wide px-8 py-3 rounded-full hover:bg-coral/90 transition-all"
          >
            Try Again
          </button>
          <p className="mt-4 font-body text-xs text-charcoal/30 font-light">
            Need help? Text us at (206) 825-4061
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-charcoal/40 font-light">Redirecting to your account...</p>
      </div>
    </div>
  );
}
