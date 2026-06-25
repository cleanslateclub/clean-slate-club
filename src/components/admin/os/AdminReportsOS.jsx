import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users, CheckCircle, AlertTriangle, Clock, Heart } from 'lucide-react';

const PALETTE = ['#EB9486', '#CAE7B9', '#F3DE8A', '#EFB988', '#B58A90', '#8B93A7', '#97A7B3'];

export default function AdminReportsOS({ sidebarItem }) {
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Booking.list('-scheduled_date', 300),
      base44.entities.Provider.filter({ status: 'active' }),
      base44.entities.Membership.list('-created_date', 100),
    ]).then(([b, p, m]) => {
      setBookings(b || []);
      setProviders(p || []);
      setMemberships(m || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter(b => b.scheduled_date === today);
  const completedThisMonth = bookings.filter(b => {
    const now = new Date();
    const d = new Date(b.scheduled_date);
    return b.status === 'completed' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalRevenue = completedThisMonth.reduce((s, b) => s + (b.final_price || b.estimated_price_high || 0), 0);
  const activeMembers = memberships.filter(m => m.status === 'active').length;
  const unassigned = bookings.filter(b => !b.provider_email && !['cancelled', 'archived', 'completed'].includes(b.status)).length;

  // Service popularity
  const serviceData = useMemo(() => {
    const counts = {};
    bookings.forEach(b => {
      const label = (b.service_label || b.service_category || 'Unknown').replace(/_/g, ' ');
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [bookings]);

  // Monthly volume
  const monthlyData = useMemo(() => {
    const months = {};
    bookings.forEach(b => {
      if (!b.scheduled_date) return;
      const m = b.scheduled_date.slice(0, 7);
      months[m] = (months[m] || 0) + 1;
    });
    return Object.entries(months).sort().slice(-6).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count,
    }));
  }, [bookings]);

  // Status breakdown
  const statusData = useMemo(() => {
    const counts = {};
    bookings.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  }, [bookings]);

  const kpis = [
    { label: "Today's Visits", value: todaysBookings.length, icon: Calendar, color: 'bg-coral/10 border-coral/30', text: 'text-coral' },
    { label: 'Completed This Month', value: completedThisMonth.length, icon: CheckCircle, color: 'bg-sage/15 border-sage/40', text: 'text-green-700' },
    { label: 'Revenue (MTD Est.)', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-butter/15 border-butter/40', text: 'text-amber-700' },
    { label: 'Active Members', value: activeMembers, icon: Heart, color: 'bg-blue-gray/10 border-blue-gray/30', text: 'text-blue-gray' },
    { label: 'Unassigned', value: unassigned, icon: AlertTriangle, color: unassigned > 0 ? 'bg-coral/10 border-coral/30' : 'bg-taupe/10 border-taupe/20', text: unassigned > 0 ? 'text-coral' : 'text-charcoal/40' },
    { label: 'Active Providers', value: providers.length, icon: Users, color: 'bg-sage/10 border-sage/30', text: 'text-green-700' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div>
        <h2 className="font-heading text-xl font-semibold text-charcoal mb-1">Reports & Analytics</h2>
        <p className="font-body text-sm text-charcoal/40 font-light">Business overview for Clean Slate Club</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`rounded-2xl border p-4 ${k.color}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40">{k.label}</p>
                <Icon className={`w-4 h-4 ${k.text}`} />
              </div>
              <p className={`font-heading text-2xl font-semibold ${k.text}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly booking volume */}
        <div className="bg-white rounded-2xl border border-taupe/15 p-5">
          <h3 className="font-heading text-sm font-semibold text-charcoal mb-4">Monthly Booking Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#33333380' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#33333380' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #ece4db' }} />
              <Bar dataKey="count" fill="#EB9486" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service popularity */}
        <div className="bg-white rounded-2xl border border-taupe/15 p-5">
          <h3 className="font-heading text-sm font-semibold text-charcoal mb-4">Service Popularity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name.slice(0,12)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                {serviceData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-2xl border border-taupe/15 p-5">
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-4">Booking Status Breakdown (All Time)</h3>
        <div className="flex flex-wrap gap-3">
          {statusData.map((s, i) => (
            <div key={s.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cream border border-taupe/10">
              <div className="w-3 h-3 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="font-body text-xs text-charcoal/60 capitalize">{s.name}</span>
              <span className="font-heading text-sm font-semibold text-charcoal">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's ops */}
      <div className="bg-white rounded-2xl border border-taupe/15 p-5">
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-3">Today's Schedule ({today})</h3>
        {todaysBookings.length === 0 ? (
          <p className="text-sm font-body text-charcoal/30 font-light">No visits scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todaysBookings.sort((a, b) => (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || '')).map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-taupe/10">
                <div className="w-1 h-8 rounded-full bg-coral" />
                <div className="flex-1">
                  <p className="font-body text-sm text-charcoal">{b.client_name}</p>
                  <p className="font-body text-xs text-charcoal/40 font-light">{b.scheduled_start_time} · {b.service_label || b.service_category?.replace(/_/g, ' ')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-body uppercase ${b.provider_name ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-butter/15 border-butter/40 text-amber-700'}`}>
                  {b.provider_name || 'Unassigned'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}