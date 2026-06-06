import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Called by automation when a Booking status changes to "completed"
// Checks if this client was referred, and if so:
//   1. Marks the referral as completed
//   2. Issues $25 credit to the NEW client (referred_discount_issued)
//   3. Issues $25 credit to the REFERRING client (referrer_credit_issued) after their 2nd successful referral
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const bookingId = body?.event?.entity_id || body?.booking_id;
    if (!bookingId) {
      return Response.json({ skipped: true, reason: 'no booking_id' });
    }

    const booking = body?.data || await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking || booking.status !== 'completed') {
      return Response.json({ skipped: true, reason: 'not completed' });
    }

    const clientEmail = booking.client_email;
    if (!clientEmail) return Response.json({ skipped: true, reason: 'no client_email' });

    // Find a pending/booked referral for this client
    const referrals = await base44.asServiceRole.entities.Referral.filter({ referred_email: clientEmail });
    const pendingReferral = referrals.find(r => r.status === 'pending' || r.status === 'booked');

    if (!pendingReferral) {
      return Response.json({ skipped: true, reason: 'no pending referral found for this client' });
    }

    // Mark referral as completed
    await base44.asServiceRole.entities.Referral.update(pendingReferral.id, {
      status: 'completed',
      booking_id: bookingId,
    });

    // Issue $25 credit to the NEW (referred) client
    const referredProfiles = await base44.asServiceRole.entities.HouseholdProfile.filter({ guest_email: clientEmail });
    if (referredProfiles.length > 0) {
      const profile = referredProfiles[0];
      await base44.asServiceRole.entities.HouseholdProfile.update(profile.id, {
        referral_credits_available: (profile.referral_credits_available || 0) + 25,
      });
    }

    // Credit the referrer — only if this is their 2nd+ completed referral
    const referrerEmail = pendingReferral.referrer_email;
    const allReferrerReferrals = await base44.asServiceRole.entities.Referral.filter({ referrer_email: referrerEmail });
    const completedCount = allReferrerReferrals.filter(r => r.status === 'completed' || r.status === 'credited').length;

    const shouldCreditReferrer = completedCount >= 2;
    if (shouldCreditReferrer) {
      const referrerProfiles = await base44.asServiceRole.entities.HouseholdProfile.filter({ guest_email: referrerEmail });
      if (referrerProfiles.length > 0) {
        const rp = referrerProfiles[0];
        await base44.asServiceRole.entities.HouseholdProfile.update(rp.id, {
          referral_credits_available: (rp.referral_credits_available || 0) + 25,
          successful_referrals: (rp.successful_referrals || 0) + 1,
        });
      }

      // Mark referral as credited
      await base44.asServiceRole.entities.Referral.update(pendingReferral.id, { status: 'credited', referrer_credit_issued: true, referred_discount_issued: true });

      // Notify referrer
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: referrerEmail,
        subject: `You earned a $25 credit — Clean Slate Club™`,
        body: `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#fdfcfb;padding:32px;">
          <h2 style="font-family:'Montserrat',sans-serif;color:#EB9486;">You earned a $25 credit! 🎉</h2>
          <p style="color:#555;">Your referral of <strong>${pendingReferral.referred_name || pendingReferral.referred_email}</strong> just completed their first visit — and because this is your 2nd+ successful referral, you've earned <strong>$25 toward your next service</strong>.</p>
          <p style="color:#555;">Your credit will automatically be applied to your next booking. No code needed.</p>
          <p style="color:#aaa;font-size:13px;">Questions? Text us at (206) 825-4061 — cleanslateclubpa@gmail.com</p>
        </body></html>`
      });
    } else {
      // Still mark referred_discount_issued for the new client
      await base44.asServiceRole.entities.Referral.update(pendingReferral.id, { referred_discount_issued: true });
    }

    // Notify the new (referred) client about their $25 credit
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: clientEmail,
      subject: `You have a $25 credit — Clean Slate Club™`,
      body: `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#fdfcfb;padding:32px;">
        <h2 style="font-family:'Montserrat',sans-serif;color:#EB9486;">A $25 credit just landed in your account ✨</h2>
        <p style="color:#555;">Because you were referred by someone in the Clean Slate Club family, you've earned <strong>$25 off your next service</strong>.</p>
        <p style="color:#555;">Your credit is saved on your profile and will be automatically applied to your next booking.</p>
        <p style="color:#aaa;font-size:13px;">Questions? Text us at (206) 825-4061 — cleanslateclubpa@gmail.com</p>
      </body></html>`
    });

    return Response.json({ success: true, referralId: pendingReferral.id, referrerCredited: shouldCreditReferrer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});