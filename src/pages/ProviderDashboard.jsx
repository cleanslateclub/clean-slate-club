import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ProviderCalendar from '@/components/provider/ProviderCalendar';
import ProviderStats from '@/components/provider/ProviderStats';
import { motion } from 'framer-motion';

export default function ProviderDashboard() {
  const { user, authError } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

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

  if (authError || !user || (user.role !== 'provider' && user.role !== 'assistant')) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-heading text-xl font-semibold text-charcoal mb-2">Access Restricted</p>
          <p className="font-body text-sm text-charcoal/40 font-light">This dashboard is for service providers only.</p>
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

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="font-body text-xs tracking-[0.25em] uppercase font-light text-charcoal/40 mb-2">Welcome back</p>
            <h1 className="font-heading text-4xl font-semibold text-charcoal mb-1">{user?.full_name || 'Provider'}</h1>
            <p className="font-body text-sm text-charcoal/50">Your schedule, appointments, and earnings at a glance.</p>
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