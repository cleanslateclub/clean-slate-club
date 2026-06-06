import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { clientEmail, clientName, clientAddress, serviceLabel, displayDate, selectedTime, endTime, estimateLow, estimateHigh, addonLabels, paymentLink } = await req.json();

    const addonSection = addonLabels?.length > 0 ? `
      <div style="margin-bottom:20px;">
        <p style="margin:0 0 10px 0;font-weight:bold;">Add-ons:</p>
        <ul style="margin:0;padding-left:20px;">
          ${addonLabels.map(a => `<li style="margin-bottom:5px;">${a}</li>`).join('')}
        </ul>
      </div>` : '';

    const paySection = paymentLink ? `
      <div style="text-align:center;margin:30px 0;">
        <a href="${paymentLink}" style="display:inline-block;background:#EB9486;color:white;padding:12px 30px;text-decoration:none;border-radius:25px;font-weight:bold;">Complete Your Deposit →</a>
      </div>` : '';

    const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333;">
<div style="max-width:600px;margin:0 auto;background:#fdfcfb;">
  <div style="background:linear-gradient(135deg,#EB9486 0%,#fcd5ce 60%,#ece4db 100%);padding:40px 40px 32px;text-align:center;">
    <p style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 4px;">Clean Slate</p>
    <p style="font-family:'Sarina',cursive;font-size:28px;font-weight:400;color:#fff;margin:0;letter-spacing:0.02em;">Club</p>
  </div>
  <div style="padding:36px 40px;">
    <p style="font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;">Your appointment is confirmed, ${clientName}! ✨</p>
    <p style="font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;">Here's everything you need to know about your upcoming visit.</p>
    <div style="background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;">
      <p style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;">Your Visit</p>
      <p style="font-size:15px;font-weight:400;color:#333;margin:0 0 6px;"><strong>${serviceLabel}</strong></p>
      <p style="font-size:14px;font-weight:300;color:#777;margin:0 0 6px;">${displayDate} · ${selectedTime} – ${endTime}</p>
      <p style="font-size:14px;font-weight:300;color:#777;margin:0;">${clientAddress}</p>
    </div>
    ${addonSection}
    <div style="background:linear-gradient(135deg,#fef0ee,#fdfcfb);border:1px solid #fcd5ce;border-radius:16px;padding:22px 24px;margin:20px 0;">
      <p style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 6px;">Estimated Cost</p>
      <p style="font-family:'Montserrat',sans-serif;font-size:26px;font-weight:600;color:#EB9486;margin:0;">$${estimateLow}–$${estimateHigh}</p>
      <p style="font-size:12px;font-weight:300;color:#aaa;margin:4px 0 0;">Final pricing confirmed before any work begins. No surprises.</p>
    </div>
    ${paySection}
    <p style="font-size:14px;color:#888;font-weight:300;margin-top:24px;">Questions? Reply to this email or text us at (206) 825-4061.</p>
    <p style="font-size:13px;font-weight:300;color:#888;margin-top:24px;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;font-weight:600;">The Clean Slate Club Team</strong></p>
  </div>
  <div style="background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;">
    <p style="font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;">Questions? Reply to this email or text us at (206) 825-4061</p>
    <p style="font-size:12px;font-weight:300;color:#aaa;margin:0;">cleanslateclubpa@gmail.com · cleanslateclubco.com</p>
  </div>
</div>
</body></html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: clientEmail,
      subject: `Your appointment is confirmed — ${displayDate}`,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});