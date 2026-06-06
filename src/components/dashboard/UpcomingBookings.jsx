import React, { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import LeaveReviewModal from './LeaveReviewModal';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { Star } from 'lucide-react';

function LastBookingSummary({ bookings }) {
  const today = new Date().toISOString().split('T')[0];
  // Find the most recent completed or past booking
  const lastBooking = bookings
    .filter(b => b.status === 'completed' || b.scheduled_date < today)
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))[0];

  if (!lastBooking) return null;

  const config = SERVICE_CONFIG[lastBooking.service_category];
  const tasks = lastBooking.intake_answers?._tasks || [];
  const addonLabels = (lastBooking.addons || [])
    .map(id => config?.addons?.find(a => a.id === id)?.label)
    .filter(Boolean);
  const displayDate = lastBooking.scheduled_date
    ? new Date(lastBooking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  if (!tasks.length && !addonLabels.length) return null;

  return (
    <div className="rounded-2xl p-5 mb-2" style={{ background: 'linear-gradient(135deg, #fef0ee 0%, #fdf6f3 100%)', border: '1px solid #fcd5ce40', borderLeft: `3px solid ${config?.color || '#EB9486'}` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: config?.color || '#EB9486' }} />
        <p className="font-heading text-sm font-semibold text-charcoal">Last Visit Summary</p>
        <span className="font-body text-xs text-charcoal/40 font-light ml-auto">{displayDate}</span>
      </div>
      <p className="font-body text-xs text-charcoal/60 font-light mb-3">{config?.label || lastBooking.service_category}</p>

      {tasks.length > 0 && (
        <div className="mb-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-1.5">Tasks completed</p>
          <div className="flex flex-wrap gap-1.5">
            {tasks.map(task => (
              <span
                key={task}
                className="px-2.5 py-1 rounded-full text-[11px] font-body font-light"
                style={{ background: (config?.color || '#EB9486') + '20', color: '#333', border: `1px solid ${config?.color || '#EB9486'}30` }}
              >
                {task}
              </span>
            ))}
          </div>
        </div>
      )}

      {addonLabels.length > 0 && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-1.5">Add-ons included</p>
          <div className="flex flex-wrap gap-1.5">
            {addonLabels.map(label => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full text-[11px] font-body font-light text-charcoal/70"
                style={{ background: '#f5f5f3', border: '1px solid #e8e8e4' }}
              >
                + {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {lastBooking.estimated_price_low && (
        <p className="font-body text-xs text-charcoal/40 font-light mt-3">
          Estimated: <span className="font-semibold" style={{ color: config?.color || '#EB9486' }}>${lastBooking.estimated_price_low}–${lastBooking.estimated_price_high}</span>
        </p>
      )}
    </div>
  );
}

export default function UpcomingBookings({ bookings: initialBookings, loading, userEmail, userName }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [reviewBooking, setReviewBooking] = useState(null);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    if (!userEmail) return;
    base44.entities.Review.filter({ client_email: userEmail }).then(reviews => {
      setReviewedIds(new Set((reviews || []).map(r => r.booking_id)));
    });
  }, [userEmail]);

  const handleCancelled = (cancelledId) => {
    setBookings(prev =>
      prev.map(b => b.id === cancelledId ? { ...b, status: 'cancelled' } : b)
    );
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = bookings
    .filter(b => b.scheduled_date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
  const past = bookings
    .filter(b => b.scheduled_date < today || b.status === 'completed' || b.status === 'cancelled')
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-taupe/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Last booking summary */}
      <LastBookingSummary bookings={bookings} />

      {/* Upcoming */}
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-3">Upcoming Visits</h3>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-taupe/30 p-8 text-center">
            <p className="font-body text-sm text-charcoal/50 font-light mb-3">No upcoming visits scheduled.</p>
            <a href="/book" className="inline-block bg-coral text-white font-body text-xs tracking-wide px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors">
              Book a Visit →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(b => (
              <BookingCard key={b.id} booking={b} onCancelled={handleCancelled} />
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="font-heading text-sm font-semibold text-charcoal/50 mb-3">Recent & Past Visits</h3>
          <div className="space-y-3">
            {past.map(b => (
              <div key={b.id}>
                <BookingCard booking={b} onCancelled={handleCancelled} isPast />
                {b.status === 'completed' && !reviewedIds.has(b.id) && (
                  <button
                    onClick={() => setReviewBooking(b)}
                    className="mt-1.5 ml-1 flex items-center gap-1.5 text-xs font-body font-light text-coral hover:underline transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Leave a review for this visit
                  </button>
                )}
                {reviewedIds.has(b.id) && (
                  <p className="mt-1.5 ml-1 text-xs font-body font-light text-sage flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-sage stroke-sage" /> Review submitted — thank you!
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewBooking && (
        <LeaveReviewModal
          booking={reviewBooking}
          userEmail={userEmail}
          userName={userName}
          onClose={() => setReviewBooking(null)}
          onSubmitted={() => setReviewedIds(prev => new Set([...prev, reviewBooking.id]))}
        />
      )}
    </div>
  );
}