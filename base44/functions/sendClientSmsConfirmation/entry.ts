import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Handle entity automation payload
    const booking = data || event?.data;
    if (!booking?.client_phone || !booking?.scheduled_date) {
      return Response.json({ success: true, skipped: 'Missing phone or date' });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    const serviceLabels = {
      home_reset: 'Home Reset',
      mothers_helper: "Mother's Helper",
      errands: 'Errands',
      senior_support: 'Senior Support',
      meal_prep: 'Meal Prep',
    };

    const serviceName = serviceLabels[booking.service_category] || booking.service_category;
    const dateObj = new Date(booking.scheduled_date + 'T00:00:00');
    const displayDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });

    const message = `Hi ${booking.client_name}! Your Clean Slate Club ${serviceName} is confirmed for ${displayDate} at ${booking.scheduled_start_time}. We'll see you soon! Reply STOP to opt out.`;

    const auth = btoa(`${accountSid}:${authToken}`);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: booking.client_phone,
        Body: message,
      }).toString(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Twilio error:', result);
      return Response.json({ error: result.message || 'Failed to send SMS' }, { status: 500 });
    }

    return Response.json({ success: true, messageSid: result.sid });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});