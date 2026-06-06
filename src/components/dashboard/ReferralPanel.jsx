import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Gift, Copy, CheckCircle2, Users } from 'lucide-react';

export default function ReferralPanel({ userEmail, userName }) {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.HouseholdProfile.filter({ guest_email: userEmail }),
      base44.entities.Referral.filter({ referrer_email: userEmail }),
    ]).then(([profiles, refs]) => {
      setProfile(profiles?.[0] || null);
      setReferrals(refs || []);
      setLoading(false);
    });
  }, [userEmail]);

  const generateCode = async () => {
    setGeneratingCode(true);
    // Generate a code from their name: first 5 letters + 25
    const base = (userName || userEmail).replace(/\s+/g, '').toUpperCase().slice(0, 5);
    const code = base + '25';
    if (profile) {
      await base44.entities.HouseholdProfile.update(profile.id, { referral_code: code });
      setProfile(prev => ({ ...prev, referral_code: code }));
    } else {
      const newProfile = await base44.entities.HouseholdProfile.create({
        guest_email: userEmail,
        guest_name: userName || '',
        referral_code: code,
      });
      setProfile(newProfile);
    }
    setGeneratingCode(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.referral_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" />
    </div>
  );

  const creditsAvailable = profile?.referral_credits_available || 0;
  const completedReferrals = referrals.filter(r => r.status === 'completed' || r.status === 'credited').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending' || r.status === 'booked').length;

  return (
    <div className="space-y-5">
      {/* Credit balance */}
      {creditsAvailable > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #f0fcea 0%, #fdfcfb 100%)', border: '1px solid #CAE7B940', borderLeft: '3px solid #CAE7B9' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage/30 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-charcoal/60" />
            </div>
            <div>
              <p className="font-heading text-2xl font-semibold text-charcoal">${creditsAvailable} credit available</p>
              <p className="font-body text-xs text-charcoal/50 font-light">Automatically applied to your next service</p>
            </div>
          </div>
        </div>
      )}

      {/* Referral code */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Your Referral Code</p>
        {profile?.referral_code ? (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-heading text-2xl font-semibold text-coral tracking-widest">{profile.referral_code}</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 hover:text-coral transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="font-body text-xs text-charcoal/40 font-light mt-2 leading-relaxed">
              Share this code with friends. When they book and complete their first visit, you'll each get $25 off.
            </p>
          </>
        ) : (
          <>
            <p className="font-body text-sm text-charcoal/50 font-light mb-3">
              Generate your personal referral code to start earning credits.
            </p>
            <button
              onClick={generateCode}
              disabled={generatingCode}
              className="px-5 py-2.5 rounded-full bg-coral text-white font-body text-sm font-light hover:bg-coral/90 transition-colors disabled:opacity-50"
            >
              {generatingCode ? 'Generating...' : 'Get My Referral Code'}
            </button>
          </>
        )}
      </div>

      {/* How it works */}
      <div className="bg-cream rounded-2xl p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">How It Works</p>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Share your code with a friend who needs support.' },
            { step: '2', text: 'They enter your code when booking — locking in $25 off their first service.' },
            { step: '3', text: 'After their visit is completed, their $25 credit is issued automatically.' },
            { step: '4', text: 'Starting from your 2nd completed referral, you earn $25 toward your next service too.' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-coral/15 text-coral text-[10px] font-heading font-semibold flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
              <p className="font-body text-xs text-charcoal/60 font-light leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral history */}
      {referrals.length > 0 && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-charcoal/30" />
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Your Referrals</p>
          </div>
          <div className="space-y-2">
            {referrals.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-3">
                <p className="font-body text-sm text-charcoal font-light">{r.referred_name || r.referred_email}</p>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-body font-light capitalize ${
                  r.status === 'credited' ? 'bg-sage/20 border-sage/30 text-charcoal/60' :
                  r.status === 'completed' ? 'bg-butter/30 border-butter/40 text-charcoal/60' :
                  r.status === 'booked' ? 'bg-peach/20 border-peach/30 text-charcoal/60' :
                  'bg-taupe/20 border-taupe/30 text-charcoal/40'
                }`}>
                  {r.status === 'credited' ? '✓ credit issued' : r.status}
                </span>
              </div>
            ))}
          </div>
          <p className="font-body text-[11px] text-charcoal/30 font-light mt-3">
            {completedReferrals} completed · {pendingReferrals} pending
          </p>
        </div>
      )}
    </div>
  );
}