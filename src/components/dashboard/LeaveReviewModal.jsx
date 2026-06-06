import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaveReviewModal({ booking, userEmail, userName, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    await base44.entities.Review.create({
      booking_id: booking.id,
      client_name: userName || booking.client_name,
      client_email: userEmail || booking.client_email,
      rating,
      comment,
      status: 'published',
      service_category: booking.service_category,
    });
    setDone(true);
    setSubmitting(false);
    setTimeout(() => {
      onSubmitted?.();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-warm-white rounded-3xl border border-taupe/15 shadow-xl p-8 max-w-md w-full relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-full hover:bg-cream transition-colors">
          <X className="w-4 h-4 text-charcoal/40" />
        </button>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="text-3xl mb-3">🌿</div>
              <p className="font-heading text-lg font-semibold text-charcoal mb-1">Thank you!</p>
              <p className="font-body text-sm text-charcoal/50 font-light">Your review means the world to us.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-coral/60 font-light mb-2">How'd we do?</p>
              <h2 className="font-heading text-xl font-semibold text-charcoal mb-1">Leave a Review</h2>
              <p className="font-body text-sm text-charcoal/40 font-light mb-6">
                Your honest feedback helps us improve and helps others find us.
              </p>

              {/* Star rating */}
              <div className="flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className="w-8 h-8"
                      fill={(hovered || rating) >= star ? '#EB9486' : 'none'}
                      stroke={(hovered || rating) >= star ? '#EB9486' : '#dcdcdc'}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us about your experience... (optional)"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none mb-5"
              />

              <button
                onClick={handleSubmit}
                disabled={!rating || submitting}
                className="w-full bg-coral text-white font-body text-sm tracking-wide py-3 rounded-full hover:bg-coral/90 disabled:opacity-40 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Review →'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}