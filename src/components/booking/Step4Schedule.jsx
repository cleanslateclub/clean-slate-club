import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AVAILABLE_HOURS, timeToMinutes, minutesToTime, isSlotAvailable, TRAVEL_BUFFER } from '@/lib/bookingConfig';

const DAYS_AHEAD = 30;
const MIN_NOTICE_HOURS = 24;

function getAvailableDates() {
  const dates = [];
  const now = new Date();
  const cutoff = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  cutoff.setHours(0, 0, 0, 0);
  // Start from tomorrow or the day after if today is close to cutoff
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // No Sundays (day 0)
    if (d.getDay() === 0) continue;
    // Must be at least 24hrs from now
    if (d < cutoff) continue;
    dates.push(d);
  }
  return dates;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Step4Schedule({ totalDuration, selectedDate, selectedTime, onSelect }) {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const allDates = getAvailableDates();
  const datesPerPage = 7;
  const visibleDates = allDates.slice(weekOffset * datesPerPage, (weekOffset + 1) * datesPerPage);

  useEffect(() => {
    Promise.all([
      base44.entities.TimeBlock.list(),
      base44.entities.HolidayBlackout.filter({ booking_allowed: false })
    ]).then(([blocks, holidays]) => {
      setTimeBlocks(blocks || []);
      setBlackoutDates((holidays || []).map(h => h.date));
      setLoading(false);
    });
  }, []);

  const getHolidayMessage = (dateStr) => {
    // For premium dates (booking_allowed=true), show a note but don't block
    return null;
  };

  const getAvailableSlots = (date) => {
    const dateStr = formatDate(date);
    if (blackoutDates.includes(dateStr)) return [];
    return AVAILABLE_HOURS.filter(time =>
      isSlotAvailable(dateStr, time, totalDuration, timeBlocks)
    );
  };

  const selectedDateObj = selectedDate ? allDates.find(d => formatDate(d) === selectedDate) : null;
  const availableSlots = selectedDateObj ? getAvailableSlots(selectedDateObj) : [];

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Pick your day & time</h2>
      <p className="font-body text-sm text-charcoal font-light mb-2">
        Your visit is estimated at <span className="text-coral font-semibold">{(totalDuration / 60).toFixed(1)} hours</span> — includes 15 min meet & greet + 15 min wrap-up.
      </p>
      <p className="font-body text-xs text-charcoal font-light mb-6">Services require at least 24 hours advance notice. Only slots with enough time are shown. We don't double-book.</p>

      {/* Date picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="font-body text-xs text-charcoal hover:text-coral disabled:opacity-25 transition-colors"
          >← Prev</button>
          <span className="font-body text-xs text-charcoal font-light">
            {formatDisplayDate(visibleDates[0])} – {formatDisplayDate(visibleDates[visibleDates.length - 1])}
          </span>
          <button
            onClick={() => setWeekOffset(Math.min(Math.ceil(allDates.length / datesPerPage) - 1, weekOffset + 1))}
            disabled={(weekOffset + 1) * datesPerPage >= allDates.length}
            className="font-body text-xs text-charcoal hover:text-coral disabled:opacity-25 transition-colors"
          >Next →</button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {visibleDates.map(date => {
            const dateStr = formatDate(date);
            const slots = loading ? [] : getAvailableSlots(date);
            const available = slots.length > 0;
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                disabled={!available}
                onClick={() => onSelect(dateStr, null)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-coral border-coral text-white'
                    : available
                      ? 'bg-warm-white border-taupe/15 hover:border-coral/30 text-charcoal'
                      : 'bg-taupe/10 border-taupe/10 text-charcoal/40 cursor-not-allowed'
                }`}
              >
                <span className="font-body text-[9px] font-light uppercase tracking-wide">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="font-heading text-base font-semibold mt-0.5">{date.getDate()}</span>
                <span className={`font-body text-[9px] font-light mt-0.5 ${isSelected ? 'text-white/70' : 'text-charcoal/70'}`}>
                  {loading ? '...' : available ? `${slots.length} open` : 'Full'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="font-body text-xs text-charcoal font-light mb-3">Available start times:</p>
          <div className="flex flex-wrap gap-2">
            {availableSlots.map(time => {
              const endTime = minutesToTime(timeToMinutes(time) + totalDuration);
              return (
                <button
                  key={time}
                  onClick={() => onSelect(selectedDate, time)}
                  className={`px-4 py-2 rounded-full border text-xs font-body font-light transition-all duration-200 ${
                    selectedTime === time
                      ? 'bg-coral border-coral text-white'
                      : 'bg-warm-white border-taupe/20 text-charcoal hover:border-coral/40'
                  }`}
                >
                  {time} – {endTime}
                </button>
              );
            })}
            {availableSlots.length === 0 && !loading && (
              <p className="font-body text-sm text-charcoal font-light">No available slots this day. Please try another date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}