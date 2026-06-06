import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

// Single client entry point — redirects to platform login (handles 2FA/email verification)
// After login, platform redirects back to /dashboard
export default function ClientPortal() {
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) {
        navigate('/dashboard');
      } else {
        base44.auth.redirectToLogin('/dashboard');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-charcoal/40 font-light">Redirecting to your account...</p>
      </div>
    </div>
  );
}