import React, { useState } from 'react';
import { Archive, CheckCircle2, ClipboardCheck, PauseCircle, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  buildApproveBookingPatch,
  buildArchiveBookingPatch,
  buildCancelBookingPatch,
  buildCompleteBookingPatch,
  buildReviewHoldPatch,
} from '@/lib/adminBookingActions';

const ACTIONS = [
  {
    key: 'approve',
    label: 'Approve',
    helper: 'Clears review flag and moves the visit forward.',
    icon: ClipboardCheck,
    buildPatch: (booking) => buildApproveBookingPatch({ booking, actorName: 'Admin' }),
  },
  {
    key: 'hold',
    label: 'Hold for Review',
    helper: 'Keeps this visit in the review queue.',
    icon: PauseCircle,
    buildPatch: (booking) => buildReviewHoldPatch({ booking, actorName: 'Admin' }),
  },
  {
    key: 'complete',
    label: 'Mark Complete',
    helper: 'Marks the visit complete after service is done. Payment still needs checkout review.',
    icon: CheckCircle2,
    buildPatch: (booking) => buildCompleteBookingPatch({ booking, actorName: 'Admin' }),
  },
  {
    key: 'cancel',
    label: 'Cancel Safely',
    helper: 'Cancels without auto-refund, auto-fee, or automatic guest/provider messages.',
    icon: XCircle,
    buildPatch: (booking) => buildCancelBookingPatch({ booking, actorName: 'Admin' }),
  },
  {
    key: 'archive',
    label: 'Archive',
    helper: 'Moves this record out of active queues without deleting it.',
    icon: Archive,
    buildPatch: (booking) => buildArchiveBookingPatch({ booking, actorName: 'Admin' }),
  },
];

export default function BookingActionsPanel({ booking, onUpdated }) {
  const [pendingAction, setPendingAction] = useState('');
  const [message, setMessage] = useState('');

  if (!booking?.id) return null;

  const runAction = async (action) => {
    const requiresConfirm = ['cancel', 'archive'].includes(action.key);
    if (requiresConfirm && !window.confirm(`${action.label} this booking? This will not send payment, refund, or message automation.`)) {
      return;
    }

    setPendingAction(action.key);
    setMessage('');
    try {
      const patch = action.buildPatch(booking);
      const updated = await base44.entities.Booking.update(booking.id, patch);
      onUpdated?.(updated || patch);
      setMessage(`${action.label} saved.`);
    } catch (error) {
      console.error('Booking action failed:', error);
      setMessage(`${action.label} could not be saved. Check Base44 permissions and try again.`);
    } finally {
      setPendingAction('');
    }
  };

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Admin actions</p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-1">
        Controlled actions only. Automation stays off until Base44 and policy rules are verified.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          const isPending = pendingAction === action.key;
          return (
            <button
              key={action.key}
              type="button"
              disabled={Boolean(pendingAction)}
              onClick={() => runAction(action)}
              className="rounded-2xl border border-taupe/15 bg-warm-white px-4 py-3 text-left hover:border-coral/25 disabled:opacity-50 transition-colors"
            >
              <span className="flex items-center gap-2 font-body text-sm text-charcoal/65">
                <Icon className="w-4 h-4 text-coral/70" />
                {isPending ? 'Saving...' : action.label}
              </span>
              <span className="block font-body text-xs text-charcoal/35 font-light mt-1">{action.helper}</span>
            </button>
          );
        })}
      </div>
      {message && <p className="font-body text-xs text-charcoal/45 font-light mt-3">{message}</p>}
    </div>
  );
}
