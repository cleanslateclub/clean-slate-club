import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CONSULT_SLOTS = [
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '11:30 AM',
  '11:45 AM',
];

const isOpenConsultBooking = (booking: Record<string, unknown>) => {
  const status = String(booking.status || '').toLowerCase();
  const serviceCategory = String(booking.service_category || '').toLowerCase();
  const serviceLabel = String(booking.service_label || '').toLowerCase();
  const adminNotes = String(booking.admin_notes || '').toLowerCase();

  const isConsult = serviceCategory === 'consult' || serviceLabel.includes('consult') || adminNotes.startsWith('consult');
  const isActive = !['cancelled', 'canceled', 'declined', 'rejected', 'completed', 'no_show'].includes(status);

  return isConsult && isActive;
};

const getNextMonday = (fromDate: Date, weekOffset = 0) => {
  const date = new Date(fromDate);
  const daysUntilMonday = (1 + 7 - date.getDay()) % 7;
  date.setDate(date.getDate() + daysUntilMonday + (weekOffset * 7));
  return date;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const bookings = await base44.asServiceRole.entities.Booking.list('-scheduled_date', 500);

    const takenSlots = new Set(
      bookings
        .filter(isOpenConsultBooking)
        .map((booking: Record<string, unknown>) => `${booking.scheduled_date}_${booking.scheduled_start_time}`)
    );

    const now = new Date();

    for (let week = 0; week < 8; week++) {
      const date = getNextMonday(now, week);
      const dateStr = date.toISOString().split('T')[0];

      for (const slot of CONSULT_SLOTS) {
        const key = `${dateStr}_${slot}`;
        if (!takenSlots.has(key)) {
          return Response.json({ success: true, date: dateStr, time: slot });
        }
      }
    }

    return Response.json({ success: false, error: 'No consult slots available.' });
  } catch (error) {
    console.error('scheduleConsultSlot error:', error);
    return Response.json({ success: false, error: error.message || 'No consult slots available.' }, { status: 500 });
  }
});
