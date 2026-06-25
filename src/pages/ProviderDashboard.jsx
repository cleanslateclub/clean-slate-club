import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ProviderCalendar from '@/components/provider/ProviderCalendar';
import ProviderStats from '@/components/provider/ProviderStats';
import CompleteVisitWizard from '@/components/provider/CompleteVisitWizard';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ExternalLink, LogOut, CheckSquare, CalendarDays, DollarSign, MapPin } from 'lucide-react';
import ProviderPayoutsPanel from '@/components/provider/ProviderPayoutsPanel';
import { buildGoogleMapsDirectionsUrl, hasMapAddress } from '@/lib/mapLinks';
import { notifyScheduleChange } from '@/lib/scheduleNotifications';

const ALLOWED_BOOKING_STATUSES = ['pending', 'confirmed', 'completed'];

const getProviderDashboardReadiness = ({ providerData, bookings, timeBlocks, todaysJobs }) => [
  {
    key: 'profile',
    label: 'Profile loaded',
    ready: Boolean(providerData?.id && providerData?.email),
    value: providerData?.email || 'Missing email',
  },
  {
    key: 'status',
    label: 'Provider status',
    ready: providerData?.status === 'active',
    value: (providerData?.status || 'draft').replace(/_/g, ' '),
  },
  {
    key: 'service_permissions',
    label: 'Service permissions',
    ready: Array.isArray(providerData?.service_permissions) && providerData.service_permissions.length > 0,
    value: Array.isArray(providerData?.service_permissions) ? `${providerData.service_permissions.length} permission(s)` : 'None shown',
  },
  {
    key: 'bookings',
    label: 'Assigned visits',
    ready: Array.isArray(bookings),
    value: `${bookings.length} visible`,
  },
  {
    key: 'calendar',
    label: 'Calendar blocks',
    ready: Array.isArray(timeBlocks),
    value: `${timeBlocks.length} loaded`,
  },
  {
    key: 'today',
    label: "Today's jobs",
    ready: Array.isArray(todaysJobs),
    value: `${todaysJobs.length} today`,
  },
];

function ProviderReadinessStrip({ providerData, bookings, timeBlocks, todaysJobs }) {
  const rows = getProviderDashboardReadiness({ providerData, bookings, timeBlocks, todaysJobs });
  const reviewCount = rows.filter(row => !row.ready).length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="bg-warm-white border border-taupe/15 rounded-3xl p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Provider readiness</p>
            <p className="font-heading text-xl text-charcoal mt-1">Today’s working snapshot</p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-body uppercase tracking-widest ${reviewCount ? 'bg-coral/10 border-coral/20 text-coral' : 'bg-sage/10 border-sage/20 text-sage'}`}>
            {reviewCount ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {reviewCount ? `${reviewCount} review` : 'ready'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {rows.map(row => (
            <div key={row.key} className="rounded-2xl bg-cream border border-taupe/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{row.label}</p>
                {row.ready ? <CheckCircle2 className="w-3.5 h-3.5 text-sage" /> : <AlertTriangle className="w-3.5 h-3.5 text-coral" />}
              </div>
              <p className="font-body text-xs text-charcoal/55 font-light mt-2">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [providerData, setProviderData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [activeVisitBooking, setActiveVisitBooking] = useState(null);
  const [providerTab, setProviderTab] = useState('calendar');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = localStorage.getItem('providerSession');
        if (!session) {
          navigate('/team');
          return;
        }

        const parsed = JSON.parse(session);
        const providerId = parsed?.providerId;
        const expiresAt = parsed?.expiresAt;

        if (!providerId || !expiresAt || Date.now() > expiresAt) {
          localStorage.removeItem('providerSession');
          navigate('/team');
          return;
        }

        const provider = await base44.entities.Provider.get(providerId);
        if (!provider) {
          localStorage.removeItem('providerSession');
          navigate('/team');
          return;
        }

        setProviderData(provider);
      } catch (err) {
        console.error('Provider auth check failed:', err);
        localStorage.removeItem('providerSession');
        navigate('/team');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!providerData) return;

    const fetchData = async () => {
      try {
        const [allBookings, blocks, myPayouts] = await Promise.all([
          base44.entities.Booking.filter({
            status: ALLOWED_BOOKING_STATUSES,
            provider_email: providerData.email
          }),
          base44.entities.TimeBlock.list(),
          base44.entities.ProviderPayout.filter({ provider_email: providerData.email }),
        ]);
        setBookings(allBookings || []);
        setTimeBlocks(blocks || []);
        setPayouts(myPayouts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const unsubBookings = base44.entities.Booking.subscribe((event) => {
      if (event.type === 'create') {
        const isOwn = event.data?.provider_email === providerData.email;
        const isAllowed = ALLOWED_BOOKING_STATUSES.includes(event.data?.status);
        if (isOwn && isAllowed) {
          setBookings(prev => [...prev, event.data]);
        }
      } else if (event.type === 'update') {
        setBookings(prev => prev.map(b => b.id === event.id ? { ...b, ...event.data } : b));
      } else if (event.type === 'delete') {
        setBookings(prev => prev.filter(b => b.id !== event.id));
      }
    });

    const unsubBlocks = base44.entities.TimeBlock.subscribe((event) => {
      if (event.type === 'create') {
        setTimeBlocks(prev => [...prev, event.data]);
      } else if (event.type === 'update') {
        setTimeBlocks(prev => prev.map(b => b.id === event.id ? { ...b, ...event.data } : b));
      } else if (event.type === 'delete') {
        setTimeBlocks(prev => prev.filter(b => b.id !== event.id));
      }
    });

    return () => {
      unsubBookings();
      unsubBlocks();
    };
  }, [providerData]);

  const handleTimeBlockUpdate = async (blockId, updates) => {
    try {
      const originalBlock = timeBlocks.find(block => block.id === blockId);
      await base44.entities.TimeBlock.update(blockId, updates);
      const updatedBlock = { ...originalBlock, ...updates };
      setTimeBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b));

      const relatedBooking = updatedBlock?.booking_id
        ? bookings.find(booking => booking.id === updatedBlock.booking_id)
        : null;

      notifyScheduleChange({
        eventType: 'time_block_updated',
        source: 'provider',
        actor: providerData?.full_name || providerData?.email || 'Provider',
        booking: relatedBooking,
        timeBlock: updatedBlock,
        updates,
        note: 'Provider-side schedule block changed. Admin should be notified for every schedule change.',
      });
    } catch (error) {
      console.error('Error updating time block:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('providerSession');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/team');
    }
  };

  if (loading || !providerData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-clay rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todaysJobs = bookings.filter(b =>
    b.scheduled_date === today && ['confirmed', 'pending'].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-cream">
      {activeVisitBooking && (
        <CompleteVisitWizard
          booking={activeVisitBooking}
          onComplete={() => setActiveVisitBooking(null)}
          onClose={() => setActiveVisitBooking(null)}
        />
      )}
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light text-charcoal/40 mb-2">Welcome back</p>
              <h1 className="font-heading text-4xl font-semibold text-charcoal mb-1">{providerData.full_name || 'Provider'}</h1>
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

          <ProviderReadinessStrip providerData={providerData} bookings={bookings} timeBlocks={timeBlocks} todaysJobs={todaysJobs} />

          <ProviderStats bookings={bookings} payouts={payouts} />

          {todaysJobs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="bg-coral/5 border border-coral/15 rounded-2xl p-4">
                <p className="font-body text-xs tracking-widest uppercase text-coral/60 font-light mb-3">Today's Jobs</p>
                <div className="space-y-2">
                  {todaysJobs.map(b => {
                    const address = b.client_address || b.intake_answers?.service_address?.formatted || '';
                    const directionsUrl = buildGoogleMapsDirectionsUrl(address);
                    return (
                      <div key={b.id} className="flex items-center justify-between gap-3 bg-warm-white rounded-xl border border-taupe/15 px-4 py-3">
                        <div>
                          <p className="font-body text-sm text-charcoal font-light">{b.client_name}</p>
                          <p className="font-body text-xs text-charcoal/40 font-light">
                            {b.scheduled_start_time} · {b.service_category?.replace(/_/g, ' ')}
                          </p>
                          {hasMapAddress(address) && (
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs font-body text-coral hover:text-coral/80 transition-colors"
                            >
                              <MapPin className="w-3 h-3" />
                              Directions
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => setActiveVisitBooking(b)}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-coral text-white font-body text-xs tracking-wide hover:bg-coral/90 transition-all shrink-0"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Complete Visit
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-1 bg-warm-white border border-taupe/15 rounded-2xl p-1 mb-6">
            {[
              { id: 'calendar', label: 'My Calendar', icon: CalendarDays },
              { id: 'earnings', label: 'My Earnings', icon: DollarSign },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setProviderTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-body font-light transition-all duration-200 ${
                    providerTab === t.id ? 'bg-coral text-white shadow-sm' : 'text-charcoal/50 hover:text-charcoal/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {providerTab === 'calendar' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <ProviderCalendar
                timeBlocks={timeBlocks}
                bookings={bookings}
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                onTimeBlockUpdate={handleTimeBlockUpdate}
                user={providerData}
                onStartVisit={setActiveVisitBooking}
              />
            </motion.div>
          )}

          {providerTab === 'earnings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-sm p-8">
                <ProviderPayoutsPanel payouts={payouts} />
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
