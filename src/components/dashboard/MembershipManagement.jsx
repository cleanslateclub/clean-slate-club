import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, PauseCircle, XCircle, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MembershipManagement({ userEmail, userName }) {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    base44.entities.Membership.filter({ user_email: userEmail }).then(results => {
      setMembership(results?.[0] || null);
      setLoading(false);
    });
  }, [userEmail]);

  const handlePause = async () => {
    if (!membership) return;
    if ((membership.pause_count_this_year || 0) >= 2) {
      alert('You have used your 2 pauses for this year. Contact us for help.');
      return;
    }
    setUpdating(true);
    const pauseStart = new Date().toISOString().split('T')[0];
    const pauseEnd = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]; // max 60 days
    await base44.entities.Membership.update(membership.id, {
      status: 'paused',
      pause_start_date: pauseStart,
      pause_end_date: pauseEnd,
      pause_count_this_year: (membership.pause_count_this_year || 0) + 1,
    });
    setMembership(prev => ({ ...prev, status: 'paused', pause_start_date: pauseStart, pause_end_date: pauseEnd, pause_count_this_year: (prev.pause_count_this_year || 0) + 1 }));
    setUpdating(false);
  };

  const handleResume = async () => {
    if (!membership) return;
    setUpdating(true);
    await base44.entities.Membership.update(membership.id, { status: 'active', pause_end_date: new Date().toISOString().split('T')[0] });
    setMembership(prev => ({ ...prev, status: 'active' }));
    setUpdating(false);
  };

  const handleCancel = async () => {
    if (!membership) return;
    setUpdating(true);
    await base44.entities.Membership.update(membership.id, {
      status: 'cancelled',
      cancelled_date: new Date().toISOString().split('T')[0],
      cancellation_reason: cancelReason,
      benefits_active_through: membership.next_billing_date || new Date().toISOString().split('T')[0],
    });
    setMembership(prev => ({ ...prev, status: 'cancelled', cancellation_reason: cancelReason }));
    setConfirmCancel(false);
    setUpdating(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" />
    </div>
  );

  if (!membership || membership.status === 'cancelled') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-butter/30 flex items-center justify-center mx-auto mb-4">
          <Star className="w-7 h-7 text-charcoal/40" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">
          {membership?.status === 'cancelled' ? 'Membership Cancelled' : 'Join the Clean Slate Club™'}
        </h3>
        {membership?.status === 'cancelled' ? (
          <>
            <p className="font-body text-sm text-charcoal/50 font-light mb-2">
              Your membership has been cancelled.
            </p>
            {membership.benefits_active_through && (
              <p className="font-body text-sm text-sage font-light">
                Benefits remain active through{' '}
                {new Date(membership.benefits_active_through + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-body text-sm text-charcoal/50 font-light mb-5">
              $49/month · Priority scheduling · Member-only availability · Reduced extra hour rate ($65/hr vs $85/hr) · Early access to openings
            </p>
            <a
              href="/memberships"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-8 py-3 rounded-full hover:bg-coral/90 transition-all"
            >
              Learn About Membership →
            </a>
          </>
        )}
      </div>
    );
  }

  const isPaused = membership.status === 'paused';
  const isPastDue = membership.status === 'past_due';
  const pausesLeft = 2 - (membership.pause_count_this_year || 0);

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #fef0ee 0%, #fdfcfb 100%)', border: '1px solid #fcd5ce40', borderLeft: '3px solid #EB9486' }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-butter/40 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-charcoal/50" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-charcoal">Clean Slate Club™ Membership</p>
              <p className="font-body text-sm text-charcoal/50 font-light">${membership.monthly_amount || 49}/month · Auto-renews monthly</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border font-body font-light capitalize ${
            isPaused ? 'bg-butter/30 border-butter/40 text-charcoal/60' :
            isPastDue ? 'bg-coral/10 border-coral/20 text-coral' :
            'bg-sage/20 border-sage/30 text-charcoal/70'
          }`}>
            {membership.status?.replace('_', ' ')}
          </span>
        </div>

        {membership.next_billing_date && !isPaused && (
          <p className="font-body text-xs text-charcoal/40 font-light mt-3">
            Next billing:{' '}
            {new Date(membership.next_billing_date + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {isPaused && membership.pause_end_date && (
          <div className="mt-3 p-3 rounded-xl bg-butter/20 border border-butter/30">
            <p className="font-body text-xs text-charcoal/60 font-light">
              Paused until{' '}
              {new Date(membership.pause_end_date + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              Your billing resumes automatically.
            </p>
          </div>
        )}

        {isPastDue && (
          <div className="mt-3 p-3 rounded-xl bg-coral/5 border border-coral/15 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
            <p className="font-body text-xs text-charcoal/60 font-light">
              Payment issue detected. Please update your payment method to keep your membership active.
            </p>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-cream rounded-2xl p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Your Member Benefits</p>
        <div className="space-y-2">
          {[
            'Priority scheduling + member-only time slots (9 AM access)',
            'Extra time at $65/hr (vs $85/hr for non-members)',
            'Early access to cancellation openings',
            'Holiday priority scheduling',
            'Recurring slot access & faster rescheduling',
            'Unlimited reschedules with 24+ hours notice',
          ].map(benefit => (
            <div key={benefit} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
              <p className="font-body text-xs text-charcoal/60 font-light">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-cream rounded-2xl p-4 flex items-center gap-3">
        <CreditCard className="w-4 h-4 text-charcoal/30 shrink-0" />
        <div>
          <p className="font-body text-xs text-charcoal font-light">Payment method on file</p>
          <p className="font-body text-[10px] text-charcoal/40 font-light">To update your card, contact us at cleanslateclubpa@gmail.com or text (206) 825-4061</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2 border-t border-taupe/10">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Manage Membership</p>

        {isPaused ? (
          <button
            onClick={handleResume}
            disabled={updating}
            className="w-full py-3 rounded-xl bg-sage/20 border border-sage/30 text-sm font-body font-light text-charcoal/70 hover:bg-sage/30 transition-colors disabled:opacity-50"
          >
            Resume Membership
          </button>
        ) : (
          <button
            onClick={handlePause}
            disabled={updating || pausesLeft <= 0}
            className="w-full py-3 rounded-xl bg-butter/20 border border-butter/30 text-sm font-body font-light text-charcoal/60 hover:bg-butter/30 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <PauseCircle className="w-4 h-4" />
            Pause Membership
            {pausesLeft > 0
              ? <span className="text-xs opacity-60">({pausesLeft} pause{pausesLeft !== 1 ? 's' : ''} remaining this year)</span>
              : <span className="text-xs opacity-60">(0 pauses remaining this year)</span>
            }
          </button>
        )}

        {!confirmCancel ? (
          <button
            onClick={() => setConfirmCancel(true)}
            className="w-full py-2.5 rounded-xl border border-taupe/15 text-sm font-body font-light text-charcoal/30 hover:border-red-200 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Cancel Membership
          </button>
        ) : (
          <div className="rounded-xl border border-coral/20 bg-coral/5 p-4 space-y-3">
            <p className="font-body text-sm text-charcoal font-light">Are you sure? Benefits remain through your paid period. No partial-month refund.</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Optional: help us improve — why are you cancelling?"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-coral text-white font-body text-sm font-light hover:bg-coral/90 disabled:opacity-50 transition-colors"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="flex-1 py-2.5 rounded-xl border border-taupe/20 font-body text-sm font-light text-charcoal/50 hover:border-coral/30 transition-colors"
              >
                Keep Membership
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="font-body text-[10px] text-charcoal/25 font-light text-center">
        Questions about your membership? Text us at (206) 825-4061 or email cleanslateclubpa@gmail.com
      </p>
    </div>
  );
}