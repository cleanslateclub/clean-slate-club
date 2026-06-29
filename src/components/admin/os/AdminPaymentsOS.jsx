import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DollarSign, AlertTriangle, Lock, FileText, RefreshCw, Heart } from 'lucide-react';
import BookingDrawer from '@/components/admin/os/BookingDrawer';

const TABS = [
  { key: 'deposits', label: 'Deposits', icon: DollarSign },
  { key: 'balances', label: 'Balances Due', icon: AlertTriangle },
  { key: 'invoices', label: 'Invoices', icon: FileText },
  { key: 'payouts', label: 'Payout Batches', icon: RefreshCw },
  { key: 'membership', label: 'Membership Billing', icon: Heart },
];

const PAYMENT_BADGE = {
  unpaid:        'bg-coral/10 border-coral/30 text-coral',
  deposit_paid:  'bg-butter/15 border-butter/50 text-amber-700',
  checkout_sent: 'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
  partially_paid:'bg-coral/10 border-coral/30 text-coral',
  paid:          'bg-sage/20 border-sage/60 text-green-700',
  refunded:      'bg-taupe/10 border-taupe/30 text-charcoal/40',
  disputed:      'bg-red-50 border-red-200 text-red-600',
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getDepositCredit = (booking) => (
  booking.deposit_status === 'paid' ? toNumber(booking.deposit_amount, 50) : 0
);

const getFinalTotal = (booking) => toNumber(booking.final_price, toNumber(booking.estimated_price_high, 0));

const getBalanceDue = (booking) => {
  const recordedBalance = Number(booking.final_balance_due);
  if (Number.isFinite(recordedBalance)) return Math.max(0, recordedBalance);
  return Math.max(0, getFinalTotal(booking) - getDepositCredit(booking));
};

export default function AdminPaymentsOS({ sidebarItem }) {
  const [tab, setTab] = useState('deposits');
  const [bookings, setBookings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (sidebarItem?.key) {
      const map = { deposits: 'deposits', balances_due: 'balances', invoices: 'invoices', payout_batches: 'payouts', membership_billing: 'membership' };
      if (map[sidebarItem.key]) setTab(map[sidebarItem.key]);
    }
  }, [sidebarItem]);

  useEffect(() => {
    Promise.all([
      base44.entities.Booking.list('-scheduled_date', 200),
      base44.entities.ProviderPayout.list('-created_date', 100),
      base44.entities.Membership.list('-created_date', 100),
    ]).then(([b, p, m]) => {
      setBookings(b || []);
      setPayouts(p || []);
      setMemberships(m || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pendingDeposits = bookings.filter(b => b.deposit_status === 'pending' && !['cancelled', 'archived'].includes(b.status));
  const balancesDue = bookings.filter(b => (
    b.status === 'completed' &&
    ['unpaid', 'deposit_paid', 'partially_paid', 'checkout_sent'].includes(b.payment_status) &&
    getBalanceDue(b) > 0
  ));
  const pendingPayouts = payouts.filter(p => p.status === 'pending');

  const stats = [
    { label: 'Pending Deposits', value: pendingDeposits.length, amount: pendingDeposits.length * 50, color: 'bg-butter/20 border-butter/40' },
    { label: 'Balances Due', value: balancesDue.length, amount: balancesDue.reduce((s, b) => s + getBalanceDue(b), 0), color: 'bg-coral/10 border-coral/30' },
    { label: 'Pending Payouts', value: pendingPayouts.length, amount: pendingPayouts.reduce((s, p) => s + (p.total_payout || 0), 0), color: 'bg-sage/15 border-sage/40' },
    { label: 'Active Members', value: memberships.filter(m => m.status === 'active').length, amount: memberships.filter(m => m.status === 'active').length * 49, color: 'bg-blue-gray/10 border-blue-gray/30' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Stats bar */}
      <div className="p-4 bg-white border-b border-taupe/10 grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
            <p className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-600">{s.label}</p>
            <p className="font-heading text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="font-body text-sm font-semibold text-gray-700">${s.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-2 bg-white border-b border-taupe/10">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${tab === t.key ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}>
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>
        ) : tab === 'deposits' ? (
          <BookingPaymentTable bookings={pendingDeposits} title="Pending Deposits" emptyMsg="No pending deposits." onViewBooking={setSelectedBooking} />
        ) : tab === 'balances' ? (
          <BookingPaymentTable bookings={balancesDue} title="Balances Due" emptyMsg="No outstanding balances." onViewBooking={setSelectedBooking} showBalance />
        ) : tab === 'invoices' ? (
          <BookingPaymentTable bookings={bookings.filter(b => b.status === 'completed')} title="Completed Bookings / Invoices" emptyMsg="No completed bookings." onViewBooking={setSelectedBooking} showBalance />
        ) : tab === 'payouts' ? (
          <PayoutsTable payouts={payouts} />
        ) : tab === 'membership' ? (
          <MembershipTable memberships={memberships} />
        ) : null}
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={(id, updates) => {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
            setSelectedBooking(prev => ({ ...prev, ...updates }));
          }}
          statusColors={{}}
        />
      )}
    </div>
  );
}

function BookingPaymentTable({ bookings, title, emptyMsg, onViewBooking, showBalance = false }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-charcoal mb-3">{title} <span className="font-body text-sm text-charcoal/40 font-light">({bookings.length})</span></h3>
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-charcoal/25 font-body text-sm">{emptyMsg}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-taupe/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-taupe/10 bg-cream/50">
                {['Guest', 'Service', 'Date', showBalance ? 'Final / Balance' : 'Estimate', 'Deposit', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-body text-[10px] uppercase tracking-wider text-charcoal/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-taupe/6 hover:bg-cream/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <p className="font-body text-sm font-semibold text-gray-900">{b.client_name}</p>
                    <p className="font-body text-xs font-medium text-gray-600">{b.client_phone}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-body text-sm font-medium text-gray-800">{b.service_label || b.service_category?.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-body text-sm font-medium text-gray-700">{b.scheduled_date || '—'}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    {showBalance ? (
                      <div>
                        <p className="font-body text-xs font-medium text-gray-500">Final ${getFinalTotal(b).toFixed(2)}</p>
                        <p className="font-body text-sm font-semibold text-coral">Due ${getBalanceDue(b).toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="font-body text-sm font-semibold text-gray-800">${b.estimated_price_low}–${b.estimated_price_high}</p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body bg-taupe/10 border-taupe/30 text-charcoal/50">
                      {b.deposit_status?.replace(/_/g, ' ') || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body ${PAYMENT_BADGE[b.payment_status] || 'bg-taupe/10 border-taupe/30 text-charcoal/40'}`}>
                      {b.payment_status?.replace(/_/g, ' ') || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onViewBooking(b)} className="px-2 py-1 rounded-lg border border-coral/30 text-[10px] font-body text-coral hover:bg-coral/5 transition-colors">View</button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg border border-taupe/15 text-[10px] font-body text-charcoal/30 cursor-not-allowed opacity-50">
                        <Lock className="w-2.5 h-2.5" /> Charge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PayoutsTable({ payouts }) {
  const total = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.total_payout || 0), 0);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-base font-semibold text-charcoal">Provider Payouts</h3>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm text-charcoal/50">Pending: <strong className="text-charcoal">${total.toFixed(2)}</strong></span>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-taupe/15 text-xs font-body text-charcoal/30 cursor-not-allowed opacity-50">
            <Lock className="w-3 h-3" /> Process Batch
          </button>
        </div>
      </div>
      {payouts.length === 0 ? (
        <div className="text-center py-12 text-charcoal/25 font-body text-sm">No payouts yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-taupe/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-taupe/10 bg-cream/50">
                {['Provider', 'Booking', 'Service Revenue', 'Rate', 'Payout', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-body text-[10px] uppercase tracking-wider text-charcoal/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} className="border-b border-taupe/6 hover:bg-cream/30">
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal">{p.provider_name}</td>
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal/50">{p.booking_id?.slice(-8)}</td>
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal/70">${p.service_revenue}</td>
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal/50">{(p.payout_rate * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2.5 font-body text-xs font-semibold text-charcoal">${p.total_payout}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body ${p.status === 'paid' ? 'bg-sage/20 border-sage/60 text-green-700' : 'bg-butter/15 border-butter/50 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MembershipTable({ memberships }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Membership Billing</h3>
      {memberships.length === 0 ? (
        <div className="text-center py-12 text-charcoal/25 font-body text-sm">No memberships yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-taupe/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-taupe/10 bg-cream/50">
                {['Member', 'Status', 'Monthly', 'Next Billing', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-body text-[10px] uppercase tracking-wider text-charcoal/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memberships.map(m => (
                <tr key={m.id} className="border-b border-taupe/6 hover:bg-cream/30">
                  <td className="px-3 py-2.5">
                    <p className="font-body text-xs text-charcoal">{m.user_name}</p>
                    <p className="font-body text-[10px] text-charcoal/40">{m.user_email}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase font-body ${m.status === 'active' ? 'bg-sage/20 border-sage text-green-700' : 'bg-taupe/10 border-taupe/30 text-charcoal/40'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal/70">${m.monthly_amount || 49}/mo</td>
                  <td className="px-3 py-2.5 font-body text-xs text-charcoal/50">{m.next_billing_date || '—'}</td>
                  <td className="px-3 py-2.5">
                    <button className="px-2 py-1 rounded-lg border border-taupe/20 text-[10px] font-body text-charcoal/50 hover:bg-cream">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
