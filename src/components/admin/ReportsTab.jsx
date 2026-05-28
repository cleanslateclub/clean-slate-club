import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const COLORS = ['#EB9486', '#CAE7B9', '#EFB988', '#B58A90', '#97A7B3', '#F3DE8A'];

function MetricBox({ label, value, sub }) {
  return (
    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">{label}</p>
      <p className="font-heading text-2xl font-semibold text-charcoal">{value}</p>
      {sub && <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ReportsTab({ bookings }) {
  const stats = useMemo(() => {
    const avg = (b) => ((b.estimated_price_low || 0) + (b.estimated_price_high || 0)) / 2;
    const completed = bookings.filter(b => b.status === 'completed');
    const cancelled = bookings.filter(b => b.status === 'cancelled');

    // Revenue by month
    const byMonth = {};
    completed.forEach(b => {
      if (!b.scheduled_date) return;
      const m = b.scheduled_date.slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + avg(b);
    });
    const monthlyData = Object.entries(byMonth).sort().slice(-6).map(([month, revenue]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      revenue: Math.round(revenue),
    }));

    // By service
    const byService = {};
    bookings.filter(b => b.status !== 'cancelled').forEach(b => {
      const key = b.service_category || 'other';
      if (!byService[key]) byService[key] = { count: 0, revenue: 0 };
      byService[key].count++;
      byService[key].revenue += avg(b);
    });
    const serviceData = Object.entries(byService)
      .map(([key, val]) => ({ name: SERVICE_CONFIG[key]?.label || key, ...val }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = completed.reduce((s, b) => s + avg(b), 0);
    const avgBookingValue = completed.length ? totalRevenue / completed.length : 0;
    const cancelRate = bookings.length ? ((cancelled.length / bookings.length) * 100).toFixed(0) : 0;

    return { monthlyData, serviceData, totalRevenue, avgBookingValue, cancelRate, completed, cancelled };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricBox label="Total Revenue" value={`$${Math.round(stats.totalRevenue).toLocaleString()}`} sub="All completed visits" />
        <MetricBox label="Avg. Booking Value" value={`$${Math.round(stats.avgBookingValue)}`} sub="Per completed visit" />
        <MetricBox label="Total Bookings" value={bookings.length} sub={`${stats.completed.length} completed`} />
        <MetricBox label="Cancellation Rate" value={`${stats.cancelRate}%`} sub={`${stats.cancelled.length} cancelled`} />
      </div>

      {/* Monthly revenue chart */}
      {stats.monthlyData.length > 0 && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6">
          <p className="font-heading text-sm font-semibold text-charcoal mb-4">Monthly Revenue (last 6 months)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.monthlyData} barSize={32}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Lato', fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Lato', fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ fontFamily: 'Lato', fontSize: 12, borderRadius: 12, border: '1px solid #f0e8e4', background: '#fdfcfb' }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {stats.monthlyData.map((_, i) => (
                  <Cell key={i} fill="#EB9486" opacity={0.8 + (i / stats.monthlyData.length) * 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* By service */}
      {stats.serviceData.length > 0 && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6">
          <p className="font-heading text-sm font-semibold text-charcoal mb-4">Revenue by Service</p>
          <div className="space-y-3">
            {stats.serviceData.map((s, i) => {
              const maxRevenue = stats.serviceData[0].revenue;
              const pct = maxRevenue > 0 ? (s.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-xs text-charcoal/70 font-light">{s.name}</span>
                    <span className="font-body text-xs text-charcoal font-light">
                      ${Math.round(s.revenue).toLocaleString()} · {s.count} visits
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-taupe/15 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}