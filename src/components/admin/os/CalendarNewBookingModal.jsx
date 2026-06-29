import React from 'react';
import { X, LockKeyhole } from 'lucide-react';

export default function CalendarNewBookingModal({ defaultDate, defaultTime, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-heading text-lg font-bold text-gray-900">New Booking Locked</h2>
            <p className="font-body text-xs text-gray-500">Calendar quick-add is preview-safe only</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-coral/10 border border-coral/20 p-4 flex items-start gap-3">
            <LockKeyhole className="w-5 h-5 text-coral mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-coral font-light">Launch-sensitive workflow locked</p>
              <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">
                This legacy calendar modal previously created Booking and TimeBlock records directly. It is disabled until Base44 booking and TimeBlock behavior are verified.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-gray-400">Requested slot</p>
            <p className="font-body text-sm text-gray-600 mt-1">
              {defaultDate || 'Date TBD'}{defaultTime ? ` · ${defaultTime}` : ''}
            </p>
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-xl bg-coral text-white font-body text-sm font-bold hover:bg-coral/90 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
