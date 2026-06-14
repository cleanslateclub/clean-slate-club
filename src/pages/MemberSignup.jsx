import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function MemberSignup() {
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    // FIX: Redirect to base44's auth platform — handles both new accounts AND login
    // FIX: was redirecting back to /member-signup (infinite loop) — now goes to /dashboard
    base44.auth.redirectToLogin('/dashboard');
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    base44.auth.loginWithProvider('google', '/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-28 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase font-light text-charcoal/50 mb-2">Clean Slate Club™</p>
          <h1 className="font-logo text-3xl text-coral mb-1">Create Your Account</h1>
          <p className="font-body text-sm text-charcoal/40 font-light">Your reset starts here. Let’s get you set up.</p>
        </div>

        <div className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5 text-center">
          <div className="bg-sage/10 border border-sage/30 rounded-xl p-3.5">
            <p className="font-body text-xs text-charcoal/60 font-light">
              <span className="font-semibold text-sage">✓ No spam, ever.</span> We’ll only reach out about your bookings and service preferences. Unsubscribe anytime.
            </p>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white border border-taupe/20 py-3 font-body text-sm font-semibold text-charcoal hover:border-coral/30 hover:bg-cream disabled:opacity-50 transition-all duration-300"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-heading text-sm font-bold" style={{ color: '#EB9486' }}>
              G
            </span>
            {loading ? 'Redirecting...' : 'Create Account with Google'}
          </button>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full text-white font-body text-sm tracking-wide py-3 rounded-full disabled:opacity-50 transition-all duration-300"
            style={{ background: '#B58A90' }}
          >
            {loading ? 'Redirecting...' : 'Use Email Instead'}
          </button>

          <p className="font-body text-xs text-charcoal/40 font-light">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-coral hover:underline">Terms</Link>
            {' '}&{' '}
            <Link to="/privacy-policy" className="text-coral hover:underline">Privacy Policy</Link>
          </p>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Already have an account?{' '}
            <Link to="/member-login" className="text-coral hover:underline font-light">Sign in</Link>
          </p>
          <p className="font-body text-xs text-charcoal/40 font-light">
            Need help? Contact us at (206) 825-4061
          </p>
        </div>
      </div>
    </div>
  );
}
