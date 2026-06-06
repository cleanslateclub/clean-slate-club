import React, { useMemo } from 'react';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

// Provider payout rate: 50% standard
const PAYOUT_RATE = 0.5;

export default function ProviderStats({ bookings, payouts }) {
  const stats = useMemo(() => {
    const now = new Date();

    const thisWeek = bookings.filter(b => {
      const bDate = new Date(b.scheduled_date);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return bDate >= weekStart && bDate <= weekEnd;
    });

    const completedThisMonth = bookings.filter(b => {
      if (b.status !== 'completed') return false;
      const bDate = new Date(b.scheduled_date);
      return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    });

    // Own earnings = sum of payout records (or estimate from completed bookings at 50%)
    const myEarningsThisMonth = payouts
      ? payouts
          .filter(p => {
            const pDate = new Date(p.created_date);
            return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + (p.total_payout || 0), 0)
      : completedThisMonth.reduce((sum, b) => sum + ((b.estimated_price_low || 0) * PAYOUT_RATE), 0);

    return {
      upcomingThisWeek: thisWeek.filter(b => b.status !== 'completed').length,
      completedThisMonth: completedThisMonth.length,
      myEarningsThisMonth,
    };
  }, [bookings, payouts]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-coral/5 to-coral/10 rounded-2xl border border-coral/20 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-body text-xs font-light text-charcoal/50 mb-1">This Week</p>
            <p className="font-heading text-3xl font-semibold text-charcoal">{stats.upcomingThisWeek}</p>
            <p className="font-body text-xs font-light text-charcoal/40 mt-1">Upcoming visits</p>
          </div>
          <Calendar className="text-coral/40" size={24} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-sage/5 to-sage/10 rounded-2xl border border-sage/20 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-body text-xs font-light text-charcoal/50 mb-1">This Month</p>
            <p className="font-heading text-3xl font-semibold text-charcoal">{stats.completedThisMonth}</p>
            <p className="font-body text-xs font-light text-charcoal/40 mt-1">Completed visits</p>
          </div>
          <CheckCircle className="text-sage/40" size={24} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-butter/5 to-butter/10 rounded-2xl border border-butter/20 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-body text-xs font-light text-charcoal/50 mb-1">My Earnings</p>
            <p className="font-heading text-3xl font-semibold text-charcoal">${Math.round(stats.myEarningsThisMonth)}</p>
            <p className="font-body text-xs font-light text-charcoal/40 mt-1">This month (est.)</p>
          </div>
          <DollarSign className="text-butter/40" size={24} />
        </div>
      </div>
    </div>
  );
}