import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ProviderCalendar from '@/components/provider/ProviderCalendar';
import ProviderStats from '@/components/provider/ProviderStats';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, authError, isLoadingAuth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        navigate('/provider-login');
      }
    };
    if (!isLoadingAuth) checkAuth();
  }, [isLoadingAuth, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all bookings (provider will see their assigned ones via filter later)
        const allBookings = await base44.entities.Booking.list();
        setBookings(allBookings);

        // Get time blocks
        const blocks = await base44.entities.TimeBlock.list();
        setTimeBlocks(blocks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time booking updates
    const unsubBookings = base44.entities.Booking.subscribe((event) => {
      if (event.type === 'create') {
        setBookings(prev => [...prev, event.data]);
      } else if (event.type === 'update') {
        setBookings(prev => prev.map(b => b.id === event.id ? event.data : b));
      } else if (event.type === 'delete') {
        setBookings(prev => prev.filter(b => b.id !== event.id));
      }
    });

    // Subscribe to real-time time block updates
    const unsubBlocks = base44.entities.TimeBlock.subscribe((event) => {
      if (event.type === 'create') {
        setTimeBlocks(prev => [...prev, event.data]);
      } else if (event.type === 'update') {
        setTimeBlocks(prev => prev.map(b => b.id === event.id ? event.data : b));
      } else if (event.type === 'delete') {
        setTimeBlocks(prev => prev.filter(b => b.id !== event.id));
      }
    });

    return () => {
      unsubBookings();
      unsubBlocks();
    };
  }, []);

  const handleTimeBlockUpdate = async (blockId, updates) => {
    try {
      await base44.entities.TimeBlock.update(blockId, updates);
      const updated = timeBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
      setTimeBlocks(updated);
    } catch (error) {
      console.error('Error updating time block:', error);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-clay rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError || !user || (user.role !== 'provider' && user.role !== 'assistant')) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-heading text-xl font-semibold text-charcoal mb-2">Access Restricted</p>
          <p className="font-body text-sm text-charcoal/40 font-light">This dashboard is for service providers only.</p>
          <button
            onClick={() => navigate('/provider-login')}
            className="mt-6 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-clay rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate('/provider-login');
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light text-charcoal/40 mb-2">Welcome back</p>
              <h1 className="font-heading text-4xl font-semibold text-charcoal mb-1">{user?.full_name || 'Provider'}</h1>
              <p className="font-body text-sm text-charcoal/50">Your schedule, appointments, and earnings at a glance.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-taupe/20 bg-warm-white text-xs font-body font-light text-charcoal/50 hover:border-coral/30 hover:text-coral transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>

          {/* Stats */}
          <ProviderStats bookings={bookings} user={user} />

          {/* Calendar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ProviderCalendar
              timeBlocks={timeBlocks}
              bookings={bookings}
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
              onTimeBlockUpdate={handleTimeBlockUpdate}
              user={user}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}