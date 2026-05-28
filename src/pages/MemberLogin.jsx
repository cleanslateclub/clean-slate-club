import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // Use base44's login method
      await base44.auth.loginWithPassword(email, password);
      const user = await base44.auth.me();

      // Members can be regular users
      if (user?.role === 'admin' || user?.role === 'provider' || user?.role === 'assistant') {
        await base44.auth.logout();
        setError('Access denied. Member credentials required.');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
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
          <h1 className="font-heading text-3xl font-semibold text-charcoal mb-1">Member Dashboard</h1>
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
              className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
            />
          </div>

          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Don't have an account yet?{' '}
            <button
              onClick={() => navigate('/member-signup')}
              className="text-coral hover:underline font-light"
            >
              Create one
            </button>
          </p>
          <p className="font-body text-xs text-charcoal/40 font-light">
            Need help? Contact us at (206) 825-4061
          </p>
        </div>
      </div>
    </div>
  );
}