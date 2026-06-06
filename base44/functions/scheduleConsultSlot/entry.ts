import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Returns the next available Monday 10:00 AM or 11:00 AM slot
// Slots: 10:00 AM (10:00–10:45) and 11:00 AM (11:00–11:45)
// Skips slots already taken by existing consult bookings

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Load all existing consult bookings
    const bookings = await base44.asServiceRole.entities.Booking.list('-scheduled_date', 200);
    const takenSlots = new Set(
      bookings
        .filter(b => b.admin_notes?.startsWith('CONSULT') && (b.status === 'pending' || b.status === 'confirmed'))
        .map(b => `${b.scheduled_date}_${b.scheduled_start_time}`)
    );

    // Also check HolidayBlackout dates
    const blackouts = await base44.asServiceRole.entities.HolidayBlackout.list('-date', 50);
    const blackoutDates = new Set(blackouts.filter(h => !h.booking_allowed).map(h => h.date));

    const slots = ['10:00 AM', '11:00 AM'];

    // Search up to 8 weeks ahead for an open Monday slot
    const now = new Date();
    for (let week = 0; week < 8; week++) {
      // Find next Monday
      const d = new Date(now);
      d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) + (week * 7));
      // If today is Monday and it's early enough, use today
      if (week === 0 && now.getDay() === 1) {
        d.setDate(now.getDate());
      }

      const dateStr = d.toISOString().split('T')[0];
      if (blackoutDates.has(dateStr)) continue;

      for (const slot of slots) {
        const key = `${dateStr}_${slot}`;
        if (!takenSlots.has(key)) {
          return Response.json({ success: true, date: dateStr, time: slot });
        }
      }
    }

    return Response.json({ success: false, message: 'No available consult slots in the next 8 weeks' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});