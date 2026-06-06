import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // FIX: import Link for navigation
import { base44 } from '@/api/base44Client';
import { Eye, EyeOff } from 'lucide-react';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await base44.auth.loginWithPassword(email.trim(), password); // FIX: trim email
      const user = await base44.auth.me();

      // FIX: Explicitly check user exists before trusting role
      if (!user) {
        await base44.auth.logout();
        setError('Could not load your account. Please try again.');
        return;
      }

      // FIX: Allowlist approach — only known member roles pass through
      // Blocks admins, providers, assistants, AND any future unknown roles
      const memberRoles = ['member', 'client', null, undefined, ''];
      if (!memberRoles.includes(user.role)) {
        await base44.auth.logout();
        setError('Access denied. Member credentials required.');
        return;
      }

      navigate('/dashboard');

    } catch (err) {
      // FIX: Distinguish network errors from bad credentials
      if (err?.message?.toLowerCase().includes('network') || err?.status === 0) {
        setError('Connection problem. Please check your internet and try again.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase font-light text-charcoal/50 mb-2">Clean Slate Club™</p>
          {/* FIX: was "Member Dashboard" — this is the login page */}
          <h1 className="font-heading text-3xl font-semibold text-charcoal mb-1">Member Login</h1>
          <p className="font-body text-sm text-charcoal/40 font-light">Sign in to view your bookings and preferences.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <p className="font-body text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email" // FIX: password managers work properly
              className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-body text-xs text-charcoal/50 font-light">Password</label>
              {/* FIX: Added forgot password link */}
              <button
                type="button"
                onClick={() => base44.auth.sendPasswordResetEmail?.(email.trim())}
                className="font-body text-xs text-coral/70 font-light hover:text-coral hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password" // FIX: password managers work properly
                className="w-full px-4 py-3 pr-10 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/50 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* FIX: also disabled when fields are empty */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Don't have an account yet?{' '}
            {/* FIX: <Link> instead of navigate() — proper anchor, right-click works */}
            <Link to="/member-signup" className="text-coral hover:underline font-light">
              Create one
            </Link>
          </p>
          <p className="font-body text-xs text-charcoal/40 font-light">
            Need help? Contact us at (206) 825-4061
          </p>
        </div>
      </div>
    </div>
  );
}
