import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function AccountMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) base44.auth.me().then(setUser).catch(() => {});
    });
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout('/');
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin('/dashboard');
  };

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-taupe/25 bg-warm-white/80 text-charcoal/60 hover:border-coral/40 hover:text-coral transition-all duration-200"
        aria-label="Sign in"
      >
        <User className="w-4 h-4" />
        <span className="font-body text-xs font-light hidden sm:inline">Sign In</span>
      </button>
    );
  }

  const firstName = user.full_name?.split(' ')[0] || 'Account';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-coral/30 bg-coral/5 hover:bg-coral/10 transition-all duration-200"
        aria-label="My account"
      >
        <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-coral" />
        </div>
        <span className="font-body text-xs font-light text-charcoal/70 hidden sm:inline max-w-[80px] truncate">{firstName}</span>
        <ChevronDown className={`w-3 h-3 text-charcoal/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-taupe/15 bg-warm-white shadow-lg shadow-taupe/10 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-taupe/10">
            <p className="font-body text-xs font-light text-charcoal truncate">{user.full_name}</p>
            <p className="font-body text-[11px] text-charcoal/40 font-light truncate">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); navigate('/dashboard'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cream transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-charcoal/40" />
              <span className="font-body text-sm font-light text-charcoal/70">My Dashboard</span>
            </button>
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-charcoal/30" />
              <span className="font-body text-sm font-light text-charcoal/50">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}