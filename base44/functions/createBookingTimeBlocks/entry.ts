import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const getPayload = async (req: Request) => {
  try {
    const body = await req.json();
    return body?.data ?? body ?? {};
  } catch {
    return {};
  }
};

const timeToMinutes = (time: string) => {
  if (!time || time === 'TBD') return null;
  const parts = time.trim().split(' ');
  const clock = parts[0];
  const meridiem = parts[1];
  let [hours, minutes] = clock.split(':').map(Number);
  if (Number.isNaN(hours)) return null;
  if (Number.isNaN(minutes)) minutes = 0;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes: number) => {
  const minutesInDay = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${meridiem}`;
};

const safeTravelMinutes = (value: unknown) => {
  const parsed = Number(value ?? 20);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(0, Math.min(120, Math.round(parsed)));
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await getPayload(req);
    const bookingId = payload.bookingId || payload.booking_id;

    if (!bookingId) {
      return Response.json({ success: false, error: 'Missing bookingId.' }, { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.Booking.filter({ id: bookingId }, 1);
    const booking = matches?.[0];

    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    if (booking.service_category === 'consult') {
      return Response.json({ success: true, skipped: true, reason: 'Consult bookings do not need service TimeBlocks.' });
    }

    const date = booking.scheduled_date;
    const startTime = booking.scheduled_start_time;
    const endTime = booking.scheduled_end_time;

    if (!date || !startTime || !endTime || startTime === 'TBD' || endTime === 'TBD') {
      return Response.json({ success: true, skipped: true, reason: 'Booking has no confirmed date/time.' });
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      return Response.json({ success: false, error: 'Booking has an invalid start/end time.' }, { status: 400 });
    }

    const travelMinutes = safeTravelMinutes(booking.travel_buffer_minutes);
    const travelEndTime = minutesToTime(endMinutes + travelMinutes);

    const existing = await base44.asServiceRole.entities.TimeBlock.filter({ booking_id: bookingId }, 10);
    if (existing?.length) {
      return Response.json({ success: true, skipped: true, reason: 'TimeBlocks already exist for booking.', count: existing.length });
    }

    const timestamp = new Date().toISOString();
    const records = [
      {
        date,
        start_time: startTime,
        end_time: endTime,
        booking_id: bookingId,
        provider_id: booking.provider_id || '',
        provider_email: booking.provider_email || '',
        provider_name: booking.provider_name || '',
        block_type: 'booking',
        status: 'active',
        label: `${booking.service_label || 'Clean Slate Club Visit'} - ${booking.client_name || 'Guest'}`,
        location_address: booking.client_address || '',
        is_publicly_bookable: false,
        created_by_role: 'system',
        last_changed_by: 'createBookingTimeBlocks',
        last_changed_at: timestamp,
      },
    ];

    if (travelMinutes > 0) {
      records.push({
        date,
        start_time: endTime,
        end_time: travelEndTime,
        booking_id: bookingId,
        provider_id: booking.provider_id || '',
        provider_email: booking.provider_email || '',
        provider_name: booking.provider_name || '',
        block_type: 'travel',
        status: 'active',
        label: 'Travel buffer',
        location_address: booking.client_address || '',
        travel_minutes: travelMinutes,
        is_publicly_bookable: false,
        created_by_role: 'system',
        last_changed_by: 'createBookingTimeBlocks',
        last_changed_at: timestamp,
      });
    }

    const blocks = await base44.asServiceRole.entities.TimeBlock.bulkCreate(records);

    await base44.asServiceRole.entities.Booking.update(bookingId, {
      backend_repair_needed: false,
      backend_repair_reason: '',
      admin_notes: booking.admin_notes || '',
    });

    return Response.json({ success: true, bookingId, count: blocks?.length || records.length });
  } catch (error) {
    console.error('createBookingTimeBlocks error:', error);
    return Response.json({ success: false, error: error?.message || 'Could not create booking TimeBlocks.' }, { status: 500 });
  }
});
