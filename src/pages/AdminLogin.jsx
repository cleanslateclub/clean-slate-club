import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const attemptLogin = async (user, pass) => {
    const result = await base44.functions.invoke('adminLogin', {
      data: { username: user, password: pass }
    });
    return result?.data ?? result;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = username.trim();
      const pass = password;

      let payload = await attemptLogin(user, pass);

      // Auto-retry once on cold start (Deno drops body on first invocation)
      if (!payload?.success && payload?.error === 'Missing credentials.') {
        await new Promise(resolve => setTimeout(resolve, 800));
        payload = await attemptLogin(user, pass);
      }

      if (payload?.success && payload?.token) {
        localStorage.setItem('adminSession', JSON.stringify({
          username: user,
          token: payload.token,
          expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8-hour expiry
        }));

        // ✅ FIX: Use full page navigation instead of React Router navigate.
        // This avoids Base44 SDK interceptors and React auth state race conditions
        // that redirect away from /admin before the dashboard can fully mount.
        window.location.href = '/admin';
      } else {
        setError(payload?.error || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('[adminLogin] exception:', err);
      setError('Login failed. Please try again.');
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
          <h1 className="font-logo text-3xl text-coral mb-1">Admin Login</h1>
          <p className="font-body text-sm text-charcoal/40 font-light">Access your admin dashboard.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <p className="font-body text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
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
                autoComplete="current-password"
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
            disabled={loading || !username || !password}
            className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Need help? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
