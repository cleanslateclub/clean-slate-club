import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export default function StaffOAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const finishStaffLogin = async () => {
      try {
        const user = await base44.auth.me();

        if (user?.role === 'admin') {
          localStorage.setItem('adminSession', JSON.stringify({
            username: user.email,
            token: `oauth:${user.id || user.email}`,
            expiresAt: Date.now() + SESSION_DURATION_MS,
          }));
          navigate('/admin');
          return;
        }

        if (user?.role === 'provider' || user?.role === 'assistant') {
          const providers = await base44.entities.Provider.filter({ email: user.email }, '-created_date', 1);
          const provider = providers?.[0];

          if (!provider) {
            setError('Your login worked, but no provider profile is connected to this email yet.');
            return;
          }

          localStorage.setItem('providerSession', JSON.stringify({
            providerId: provider.id,
            email: provider.email,
            expiresAt: Date.now() + SESSION_DURATION_MS,
          }));
          navigate('/provider');
          return;
        }

        setError('This account is not set up for staff access.');
      } catch (err) {
        console.error('Staff OAuth callback failed:', err);
        setError('We could not finish staff sign-in. Please try again.');
      }
    };

    finishStaffLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-28 pb-12">
      <div className="max-w-sm text-center">
        {error ? (
          <>
            <p className="font-heading text-lg font-semibold text-charcoal mb-2">Access needs setup</p>
            <p className="font-body text-sm text-charcoal/50 font-light leading-relaxed mb-6">{error}</p>
            <button
              onClick={() => navigate('/staff-login')}
              className="rounded-full px-7 py-3 font-body text-sm font-semibold text-white"
              style={{ background: '#B58A90' }}
            >
              Back to Team Login
            </button>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body text-sm text-charcoal/40 font-light">Opening your team dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
