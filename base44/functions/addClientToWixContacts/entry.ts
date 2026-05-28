import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const booking = body.data;

    if (!booking?.client_email && !booking?.client_name && !booking?.client_phone) {
      return Response.json({ skipped: 'no client info' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('wix');

    // Parse name into first/last
    const nameParts = (booking.client_name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const serviceLabel = booking.service_category
      ?.replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || '';

    const contactInfo = {
      name: { first: firstName, last: lastName },
      ...(booking.client_email && {
        emails: { items: [{ email: booking.client_email, tag: 'MAIN', primary: true }] }
      }),
      ...(booking.client_phone && {
        phones: { items: [{ phone: booking.client_phone, tag: 'MOBILE', primary: true }] }
      }),
      ...(booking.client_address && {
        addresses: { items: [{ tag: 'HOME', address: { addressLine: booking.client_address } }] }
      }),
      ...(serviceLabel && {
        extendedFields: {
          items: { 'custom.service': serviceLabel }
        }
      }),
    };

    const res = await fetch('https://www.wixapis.com/contacts/v4/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ info: contactInfo, allowDuplicates: false }),
    });

    const data = await res.json();

    if (!res.ok) {
      // 409 = duplicate contact — not an error, just skip
      if (res.status === 409) {
        return Response.json({ skipped: 'duplicate contact' });
      }
      return Response.json({ error: data }, { status: 500 });
    }

    return Response.json({ success: true, contactId: data.contact?.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});