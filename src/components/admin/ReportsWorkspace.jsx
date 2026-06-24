import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, ClipboardList, DollarSign, Search, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  summarizeBookings,
  summarizePaymentStatus,
  summarizeProviderLoad,
  summarizeServiceMix,
} from '@/lib/adminReportsEngine';

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-center justify-between gap-3">
        <Icon className="w-5 h-5 text-coral/70" />
        <p className="font-heading text-3xl text-charcoal">{value}</p>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35 mt-4">{label}</p>
    </div>
  );
}

function RankingList({ title, rows = [], emptyText }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">{title}</p>
      {rows.length === 0 ? (
        <p className="font-body text-sm text-charcoal/40 font-light mt-4">{emptyText}</p>
      ) : (
        <div className="space-y-3 mt-4">
          {rows.slice(0, 8).map(row => (
            <div key={row.label} className="rounded-2xl bg-cream border border-taupe/10 p-4 flex items-center justify-between gap-3">
              <p className="font-body text-sm text-charcoal/60 font-light">{row.label}</p>
              <p className="font-heading text-xl text-charcoal">{row.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportsWorkspace() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.Booking.list('-created_date', 500);
        if (!active) return;
        setBookings(records || []);
      } catch (error) {
        console.error('Reports workspace load failed:', error);
        if (active) setLoadError('Could not load report data from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const visibleBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(booking => [booking.client_name, booking.client_email, booking.provider_name, booking.provider_email, booking.service_label, booking.service_category, booking.status]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [bookings, search]);

  const summary = useMemo(() => summarizeBookings(visibleBookings), [visibleBookings]);
  const serviceMix = useMemo(() => summarizeServiceMix(visibleBookings), [visibleBookings]);
  const providerLoad = useMemo(() => summarizeProviderLoad(visibleBookings), [visibleBookings]);
  const paymentStatus = useMemo(() => summarizePaymentStatus(visibleBookings), [visibleBookings]);

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Reports workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Owner visibility</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Early reporting view for bookings, service mix, provider load, payment status, and estimated revenue.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading reports...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-charcoal/30" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter reports..." className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total bookings" value={summary.total} icon={ClipboardList} />
        <StatCard label="Active" value={summary.active} icon={BarChart3} />
        <StatCard label="Needs review" value={summary.needsReview} icon={ClipboardList} />
        <StatCard label="Unassigned" value={summary.unassigned} icon={Users} />
        <StatCard label="Est. revenue" value={`$${Math.round(summary.revenue || 0).toLocaleString()}`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RankingList title="Service mix" rows={serviceMix} emptyText="No service data yet." />
        <RankingList title="Provider load" rows={providerLoad} emptyText="No provider data yet." />
        <RankingList title="Payment status" rows={paymentStatus} emptyText="No payment status data yet." />
      </div>
    </div>
  );
}
