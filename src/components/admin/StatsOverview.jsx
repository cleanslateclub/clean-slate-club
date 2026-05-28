import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Clock, DollarSign, Users, AlertCircle } from 'lucide-react';

function StatCard({ label, value, sub, accent, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm w-full ${
        active ? 'border-coral shadow-sm bg-coral/5' : 'border-taupe/15 bg-warm-white hover:border-coral/25'
      }`}
    >
      <p className="font-heading text-2xl font-semibold text-charcoal">{value}</p>
      <p className="font-body text-[10px] text-charcoal/40 font-light mt-0.5">{label}</p>
      {sub && <p className="font-body text-[10px] mt-1 font-light" style={{ color: accent || '#EB9486' }}>{sub}</p>}
    </button>
  );
}

export default function StatsOverview({ bookings, onFilterChange, activeFilter }) {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];

    const confirmed = bookings.filter(b => b.status === 'confirmed');
    const pending = bookings.filter(b => b.status === 'pending');
    const completed = bookings.filter(b => b.status === 'completed');
    const todayVisits = bookings.filter(b => b.scheduled_date === today && b.status !== 'cancelled');

    const avgRevenue = (b) => ((b.estimated_price_low || 0) + (b.estimated_price_high || 0)) / 2;

    const completedRevenue = completed.reduce((s, b) => s + avgRevenue(b), 0);
    const projectedRevenue = confirmed.reduce((s, b) => s + avgRevenue(b), 0);
    const thisMonthRevenue = bookings
      .filter(b => b.status === 'completed' && b.scheduled_date >= startOfMonth)
      .reduce((s, b) => s + avgRevenue(b), 0);
    const thisWeekRevenue = bookings
      .filter(b => b.status === 'confirmed' && b.scheduled_date >= startOfWeek)
      .reduce((s, b) => s + avgRevenue(b), 0);

    return {
      today: todayVisits.length,
      pending: pending.length,
      confirmed: confirmed.length,
      completed: completed.length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completedRevenue,
      projectedRevenue,
      thisMonthRevenue,
      thisWeekRevenue,
    };
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Revenue highlight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1 rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #fcd5ce 80%)' }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 opacity-70" />
            <p className="font-body text-xs tracking-widest uppercase font-light opacity-80">Total Earned</p>
          </div>
          <p className="font-heading text-3xl font-semibold">${Math.round(stats.completedRevenue).toLocaleString()}</p>
          <p className="font-body text-xs opacity-70 font-light mt-1">This month: ${Math.round(stats.thisMonthRevenue).toLocaleString()}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl p-5 border border-sage/40" style={{ background: 'linear-gradient(135deg, #eef8ea 0%, #fdfcfb 100%)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-sage" />
            <p className="font-body text-xs tracking-widest uppercase font-light text-charcoal/50">Projected Income</p>
          </div>
          <p className="font-heading text-3xl font-semibold text-charcoal">${Math.round(stats.projectedRevenue).toLocaleString()}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{stats.confirmed} confirmed upcoming visits</p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Today's Visits" value={stats.today} accent="#EB9486" sub={stats.today > 0 ? 'Active today' : 'No visits today'} onClick={() => onFilterChange('all')} />
        <StatCard label="Pending" value={stats.pending} accent="#c0a84a" sub="Needs confirmation" onClick={() => onFilterChange('pending')} active={activeFilter === 'pending'} />
        <StatCard label="Confirmed" value={stats.confirmed} accent="#4a8a62" sub="Scheduled upcoming" onClick={() => onFilterChange('confirmed')} active={activeFilter === 'confirmed'} />
        <StatCard label="Completed" value={stats.completed} accent="#8c6068" sub="All time" onClick={() => onFilterChange('completed')} active={activeFilter === 'completed'} />
        <StatCard label="Cancelled" value={stats.cancelled} accent="#f87171" onClick={() => onFilterChange('cancelled')} active={activeFilter === 'cancelled'} />
      </div>

      {/* This week pipeline */}
      {stats.thisWeekRevenue > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-butter/40 bg-butter/10">
          <Clock className="w-4 h-4 text-charcoal/40 shrink-0" />
          <p className="font-body text-xs text-charcoal/60 font-light">
            <strong className="font-semibold text-charcoal">This week's pipeline:</strong>{' '}
            ${Math.round(stats.thisWeekRevenue).toLocaleString()} in confirmed upcoming visits
          </p>
        </div>
      )}

      {stats.pending > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-coral/20 bg-coral/5">
          <AlertCircle className="w-4 h-4 text-coral shrink-0" />
          <p className="font-body text-xs text-coral font-light">
            <strong className="font-semibold">{stats.pending} pending</strong> booking{stats.pending !== 1 ? 's' : ''} waiting for confirmation
          </p>
        </div>
      )}
    </div>
  );
}