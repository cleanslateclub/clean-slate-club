import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Eye, EyeOff, ShieldCheck, Briefcase } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  username: 'Masha',
  password: 'Anya13579!'
};

export default function StaffLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'admin' | 'provider'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminSession', JSON.stringify({ username, timestamp: Date.now() }));
        navigate('/admin');
      } else {
        setError('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await base44.auth.loginWithPassword(email, password);
      const user = await base44.auth.me();
      if (user?.role !== 'provider' && user?.role !== 'assistant') {
        await base44.auth.logout();
        setError('Access denied. Provider credentials required.');
        return;
      }
      navigate('/provider');
    } catch {
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
          <div className="flex items-baseline gap-1.5 justify-center mb-4">
            <span className="font-heading text-sm font-semibold tracking-[0.18em] uppercase text-charcoal/50">Clean Slate</span>
            <span className="font-logo text-lg text-coral" style={{ lineHeight: 1 }}>Club</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal mb-1">Team Portal</h1>
          <p className="font-body text-sm text-charcoal/40 font-light">Select your role to continue.</p>
        </div>

        {/* Role selector */}
        {!mode && (
          <div className="space-y-3">
            <button
              onClick={() => setMode('admin')}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border border-taupe/15 bg-warm-white hover:border-coral/30 hover:shadow-sm transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-charcoal">Admin / Owner</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Access admin dashboard & operations</p>
              </div>
              <span className="ml-auto text-charcoal/25 text-lg">→</span>
            </button>

            <button
              onClick={() => setMode('provider')}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border border-taupe/15 bg-warm-white hover:border-coral/30 hover:shadow-sm transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-charcoal/50" />
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-charcoal">Provider / Assistant</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Access your schedule & visit management</p>
              </div>
              <span className="ml-auto text-charcoal/25 text-lg">→</span>
            </button>
          </div>
        )}

        {/* Admin form */}
        {mode === 'admin' && (
          <>
            <form onSubmit={handleAdminLogin} className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-coral" />
                <p className="font-heading text-sm font-semibold text-charcoal">Admin Sign In</p>
              </div>
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
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
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
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/50">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all">
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>
            <button onClick={() => { setMode(null); setError(null); setUsername(''); setPassword(''); }}
              className="w-full mt-4 font-body text-xs text-charcoal/40 font-light hover:text-coral transition-colors text-center">
              ← Back to role selection
            </button>
          </>
        )}

        {/* Provider form */}
        {mode === 'provider' && (
          <>
            <form onSubmit={handleProviderLogin} className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-charcoal/50" />
                <p className="font-heading text-sm font-semibold text-charcoal">Provider Sign In</p>
              </div>
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
                  onChange={e => setEmail(e.target.value)}
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
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/50">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-charcoal text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-charcoal/90 disabled:opacity-50 transition-all">
                {loading ? 'Signing in...' : 'Sign In as Provider'}
              </button>
            </form>
            <button onClick={() => { setMode(null); setError(null); setEmail(''); setPassword(''); }}
              className="w-full mt-4 font-body text-xs text-charcoal/40 font-light hover:text-coral transition-colors text-center">
              ← Back to role selection
            </button>
          </>
        )}

        <p className="font-body text-xs text-charcoal/25 font-light text-center mt-6">
          Need help? Contact us at (206) 825-4061
        </p>
      </div>
    </div>
  );
}