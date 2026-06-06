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
      <div style="background:#fff;border:1px solid #f0e8e4;border-left:4px solid #EFB988;border-radius:0 12px 12px 0;padding:16px 20px;margin:16px 0;">
        <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#EFB988;">Add-ons Included</p>
        ${addonLabels.map(a => `<p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:14px;color:#555;">✓ ${a}</p>`).join('')}
      </div>` : '';

    const paySection = paymentLink ? `
      <div style="text-align:center;margin:28px 0;">
        <a href="${paymentLink}" style="display:inline-block;background:#EB9486;color:white;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;padding:14px 32px;text-decoration:none;border-radius:50px;">
          Complete Your Deposit →
        </a>
      </div>` : '';

    const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#fdfcfb;">
<div style="max-width:600px;margin:0 auto;background:#fdfcfb;">

  <!-- HEADER with full brand gradient -->
  <div style="background:linear-gradient(135deg,#EB9486 0%,#EFB988 35%,#CAE7B9 70%,#ece4db 100%);padding:44px 40px 36px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.9);">CLEAN SLATE</span>
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-style:italic;color:#fff;margin-left:7px;">Club</span>
    </td></tr></table>
    <div style="height:1px;background:rgba(255,255,255,0.3);margin:16px auto;max-width:180px;"></div>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.8);">Your Visit is Confirmed ✨</p>
  </div>

  <div style="padding:36px 40px;">
    <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#333;margin:0 0 10px;">You're booked, ${clientName}!</p>
    <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:1.7;margin:0 0 24px;">Consider it handled. Here's everything you need to know about your upcoming visit.</p>

    <!-- Visit card -->
    <div style="background:linear-gradient(135deg,#fff8f7,#fff);border:1px solid #fcd5ce;border-radius:16px;padding:22px 24px;margin-bottom:20px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;">Your Visit</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:17px;font-weight:700;color:#333;">${serviceLabel}</p>
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:14px;color:#777;">${displayDate} · ${selectedTime} – ${endTime}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#999;">${clientAddress}</p>
    </div>

    ${addonSection}

    <!-- Price card -->
    <div style="background:linear-gradient(135deg,#fef8f0,#fffdf9);border:1px solid #EFB988;border-radius:16px;padding:22px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#EFB988;">Estimated Cost</p>
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:28px;font-weight:700;color:#EFB988;">$${estimateLow}–$${estimateHigh}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#bbb;">Final pricing confirmed before any work begins. No surprises, ever.</p>
    </div>

    ${paySection}

    <!-- What to expect -->
    <div style="background:#f9f6f5;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#B58A90;">What to Expect</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#666;">🌿 We'll arrive on time, ready to work — zero judgment.</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#666;">✨ Quick walkthrough together to confirm priorities.</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#666;">💌 We'll check in before wrapping up.</p>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#999;font-weight:300;margin:0 0 8px;">Questions? Reply to this email or text us at (206) 825-4061.</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#aaa;margin:0;">With care,<br><strong style="color:#EB9486;font-weight:700;">The Clean Slate Club Team</strong></p>
  </div>

  <!-- Footer -->
  <div style="background:linear-gradient(135deg,#fdf0ee,#f9f4f2);padding:24px 40px;text-align:center;border-top:1px solid #f0e8e4;">
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#aaa;margin:0 0 4px;">Questions? Reply to this email or text us at (206) 825-4061</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#bbb;margin:0;">cleanslateclubpa@gmail.com · <a href="https://cleanslateclub.co" style="color:#EB9486;text-decoration:none;">cleanslateclub.co</a></p>
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