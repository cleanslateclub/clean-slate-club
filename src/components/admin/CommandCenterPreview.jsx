import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, Home, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildCommandCenterSnapshot } from '@/lib/commandCenter';

const emptySnapshot = buildCommandCenterSnapshot({ bookings: [], providers: [], households: [] });

function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-coral/70" />}
      </div>
      <p className="font-heading text-3xl text-charcoal mt-2">{value}</p>
      {helper && <p className="font-body text-xs text-charcoal/40 font-light mt-1">{helper}</p>}
    </div>
  );
}

function AlertRow({ alert }) {
  const tone = alert.priority === 'critical' ? 'text-red-500 bg-red-50 border-red-100' : alert.priority === 'high' ? 'text-coral bg-coral/10 border-coral/20' : 'text-charcoal/55 bg-cream border-taupe/10';
  return (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-body text-sm font-medium">{alert.title}</p>
          <p className="font-body text-xs font-light mt-1 opacity-75">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

function BookingList({ title, bookings }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="font-heading text-sm font-semibold text-charcoal">{title}</p>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/35">{bookings.length}</span>
      </div>
      {bookings.length === 0 ? (
        <p className="font-body text-sm text-charcoal/35 font-light">Nothing here yet.</p>
      ) : (
        <div className="space-y-2">
          {bookings.slice(0, 6).map(booking => (
            <div key={booking.id || `${booking.client_name}-${booking.scheduled_date}`} className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3">
              <p className="font-body text-sm text-charcoal/65 font-light">{booking.client_name || 'Guest'}</p>
              <p className="font-body text-xs text-charcoal/35 font-light mt-1">
                {booking.service_label || booking.service_category || 'Service'} · {booking.scheduled_date || 'No date'} {booking.scheduled_start_time || ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommandCenterPreview() {
  const [records, setRecords] = useState({ bookings: [], providers: [], households: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [bookings, providers, households] = await Promise.all([
          base44.entities.Booking.list('-created_date', 100).catch(() => []),
          base44.entities.Provider.list('-created_date', 100).catch(() => []),
          base44.entities.HouseholdProfile.list('-created_date', 100).catch(() => []),
        ]);
        if (!active) return;
        setRecords({ bookings: bookings || [], providers: providers || [], households: households || [] });
      } catch (error) {
        console.error('Command center preview load failed:', error);
        if (active) setLoadError('Could not load live dashboard records. Showing empty preview.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, []);

  const snapshot = useMemo(() => buildCommandCenterSnapshot(records) || emptySnapshot, [records]);
  const summary = snapshot.bookingSummary || emptySnapshot.bookingSummary;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Command Center</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Daily operations snapshot</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          A Vagaro-style owner view adapted for bookings, households, provider readiness, review queues, and schedule attention.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading live records...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Today" value={snapshot.today.length} helper="Active visits today" icon={CalendarDays} />
        <StatCard label="Needs review" value={summary.needsReview} helper="Approval/manual review" icon={AlertTriangle} />
        <StatCard label="Unassigned" value={summary.unassigned} helper="Needs provider" icon={Users} />
        <StatCard label="Completed" value={summary.completed} helper="Completed records" icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          <BookingList title="Today" bookings={snapshot.today} />
          <BookingList title="Upcoming" bookings={snapshot.upcoming} />
        </div>

        <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-coral" />
            <p className="font-heading text-sm font-semibold text-charcoal">Attention queue</p>
          </div>
          {snapshot.alerts.length === 0 ? (
            <div className="rounded-2xl bg-cream border border-taupe/10 p-4 text-center">
              <Home className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/45 font-light">No alerts in the current preview.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {snapshot.alerts.slice(0, 8).map((alert, index) => <AlertRow key={`${alert.type}-${alert.entityId}-${index}`} alert={alert} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
