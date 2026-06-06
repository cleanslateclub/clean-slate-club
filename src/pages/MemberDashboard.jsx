import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CalendarDays, Settings2, Star, LogOut, Home } from 'lucide-react';
import UpcomingBookings from '@/components/dashboard/UpcomingBookings';
import ServicePreferencesForm from '@/components/dashboard/ServicePreferencesForm';
import HouseholdProfileForm from '@/components/dashboard/HouseholdProfileForm';

const TABS = [
  { id: 'schedule', label: 'My Schedule', icon: CalendarDays },
  { id: 'household', label: 'My Home', icon: Home },
  { id: 'preferences', label: 'Preferences', icon: Settings2 },
];

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        navigate('/member-login');
        return;
      }
      
      base44.auth.me().then(u => {
        setUser(u);
        if (u?.email) {
          // Load bookings by email
          base44.entities.Booking.filter({ client_email: u.email })
            .then(results => {
              setBookings(results);
              setLoadingBookings(false);
            });
          // Check member status
          base44.entities.ServicePreferences.filter({ user_email: u.email }).then(results => {
            if (results.length > 0) setIsMember(results[0].is_member || false);
          });
        }
      }).catch(() => {
        navigate('/member-login');
      });
    };
    checkAuth();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin" />
      </div>
    );
  }

  const upcomingCount = bookings.filter(b =>
    b.scheduled_date >= new Date().toISOString().split('T')[0] && b.status !== 'cancelled'
  ).length;

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate('/member-login');
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2 text-charcoal/40">Welcome back</p>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-3xl font-semibold text-charcoal mb-1">
                  {user?.full_name?.split(' ')[0] || 'Hi there'} 👋
                </h1>
                <p className="font-logo text-lg text-coral">Your Clean Slate dashboard.</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-taupe/20 bg-warm-white text-xs font-body font-light text-charcoal/50 hover:border-coral/30 hover:text-coral transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
              {isMember && (
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-butter/40 border border-butter">
                  <Star className="w-3.5 h-3.5 text-charcoal/60" />
                  <span className="font-body text-xs font-light text-charcoal/60">Catch-Up Club™ Member</span>
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Upcoming visits', value: upcomingCount },
                { label: 'Total bookings', value: bookings.length },
                { label: 'Completed visits', value: bookings.filter(b => b.status === 'completed').length },
              ].map(stat => (
                <div key={stat.label} className="bg-warm-white rounded-2xl border border-taupe/15 px-4 py-3 text-center">
                  <p className="font-heading text-2xl font-semibold text-coral">{stat.value}</p>
                  <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-warm-white border border-taupe/15 rounded-2xl p-1 mb-6">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-body font-light transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-coral text-white shadow-sm'
                      : 'text-charcoal/50 hover:text-charcoal/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-warm-white rounded-3xl border border-taupe/15 shadow-sm p-6 sm:p-8"
          >
            {activeTab === 'schedule' && (
              <UpcomingBookings bookings={bookings} loading={loadingBookings} />
            )}
            {activeTab === 'household' && (
              <HouseholdProfileForm userEmail={user.email} userName={user.full_name} />
            )}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-charcoal mb-1">Service Preferences</h2>
                <p className="font-body text-sm text-charcoal/40 font-light mb-6">
                  These preferences help your Clean Slate team prepare for every visit. They're saved to your profile and shared with whoever serves you.
                </p>
                <ServicePreferencesForm userEmail={user.email} />
              </div>
            )}
          </motion.div>

          <p className="text-center font-body text-xs text-charcoal/25 font-light mt-6">
            Need to make changes? Text us at (206) 825-4061 or email cleanslateclubpa@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}