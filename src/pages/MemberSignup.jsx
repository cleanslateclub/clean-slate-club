import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Eye, EyeOff } from 'lucide-react';

export default function MemberSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create account using base44 auth
      await base44.auth.registerWithPassword({
        email,
        password,
        fullName
      });

      // Auto-login after signup
      await base44.auth.loginWithPassword(email, password);
      
      // Redirect to booking page
      navigate('/book');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
          <h1 className="font-logo text-3xl text-coral mb-1">Create Your Account</h1>
          <p className="font-body text-sm text-charcoal/40 font-light">Join us for personalized cleaning support.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="bg-warm-white rounded-3xl border border-taupe/15 p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <p className="font-body text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
            />
          </div>

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
                minLength="8"
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
            <p className="font-body text-xs text-charcoal/30 font-light mt-1.5">Minimum 8 characters</p>
          </div>

          {/* No spam message */}
          <div className="bg-sage/10 border border-sage/30 rounded-xl p-3.5">
            <p className="font-body text-xs text-charcoal/60 font-light">
              <span className="font-semibold text-sage">✓ No spam, ever.</span> We'll only reach out about your bookings and service preferences. Unsubscribe anytime.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign in link */}
        <div className="text-center mt-6">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/member-login')}
              className="text-coral hover:underline font-light"
            >
              Sign in
            </button>
          </p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-3">
            Need help? Contact us at (206) 825-4061
          </p>
        </div>
      </div>
    </div>
  );
}