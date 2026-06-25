import React, { useMemo, useState } from 'react';
import { Eye, Mail, MessageSquare, ShieldAlert } from 'lucide-react';

const DRAFT_TYPES = [
  {
    key: 'booking_follow_up',
    label: 'Booking follow-up',
    channel: 'email',
    subject: 'A quick follow-up from Clean Slate Club',
    body: 'Hi {{guestName}},\n\nI wanted to follow up on your Clean Slate Club booking for {{serviceLabel}}. Your request is still being reviewed, and I will reach out if I need anything else before confirming the visit.\n\nThank you for trusting us with your home support.\n\nClean Slate Club',
  },
  {
    key: 'provider_assignment_preview',
    label: 'Provider assignment notice',
    channel: 'email',
    subject: 'Your Clean Slate Club visit update',
    body: 'Hi {{guestName}},\n\nYour upcoming {{serviceLabel}} visit is being matched with a provider. Once everything is confirmed, you will receive the final visit details.\n\nClean Slate Club',
  },
  {
    key: 'schedule_change_preview',
    label: 'Schedule change notice',
    channel: 'sms',
    subject: '',
    body: 'Clean Slate Club: Your {{serviceLabel}} schedule is being reviewed. No change is final until you receive a confirmation.',
  },
  {
    key: 'payment_balance_preview',
    label: 'Balance reminder',
    channel: 'email',
    subject: 'Your Clean Slate Club balance',
    body: 'Hi {{guestName}},\n\nHere is a reminder that your remaining balance for {{serviceLabel}} is {{balanceDue}}. A secure checkout link will be sent once final checkout is enabled.\n\nClean Slate Club',
  },
];

const replaceTokens = (value = '', tokens = {}) => Object.entries(tokens).reduce(
  (text, [key, replacement]) => text.replaceAll(`{{${key}}}`, replacement || ''),
  value,
);

export default function MessageDraftPreview() {
  const [draftKey, setDraftKey] = useState(DRAFT_TYPES[0].key);
  const [guestName, setGuestName] = useState('Guest');
  const [serviceLabel, setServiceLabel] = useState('Clean Slate visit');
  const [balanceDue, setBalanceDue] = useState('$0.00');

  const draft = DRAFT_TYPES.find(item => item.key === draftKey) || DRAFT_TYPES[0];
  const tokens = useMemo(() => ({ guestName, serviceLabel, balanceDue }), [guestName, serviceLabel, balanceDue]);
  const subject = replaceTokens(draft.subject, tokens);
  const body = replaceTokens(draft.body, tokens);

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Draft preview</p>
          <h3 className="font-heading text-2xl text-charcoal mt-1">Message composer preview</h3>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
            Preview-only template tester for admin messages. This does not send email, SMS, create MessageLog records, or check opt-in status yet.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-[10px] font-body uppercase tracking-widest text-coral">
          <ShieldAlert className="w-3 h-3" />
          Sending locked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Template</span>
          <select
            value={draftKey}
            onChange={(event) => setDraftKey(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30"
          >
            {DRAFT_TYPES.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Guest name</span>
          <input value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
        </label>
        <label className="block">
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Service</span>
          <input value={serviceLabel} onChange={(event) => setServiceLabel(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
        </label>
        <label className="block">
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Balance due</span>
          <input value={balanceDue} onChange={(event) => setBalanceDue(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
        </label>
      </div>

      <div className="rounded-3xl bg-cream border border-taupe/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          {draft.channel === 'sms' ? <MessageSquare className="w-4 h-4 text-coral/70" /> : <Mail className="w-4 h-4 text-coral/70" />}
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{draft.channel} preview</p>
        </div>
        {subject && (
          <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4 mb-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Subject</p>
            <p className="font-body text-sm text-charcoal/60 font-light mt-1">{subject}</p>
          </div>
        )}
        <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4 whitespace-pre-wrap">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sage" />
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Body</p>
          </div>
          <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed mt-3">{body}</p>
        </div>
      </div>
    </div>
  );
}
