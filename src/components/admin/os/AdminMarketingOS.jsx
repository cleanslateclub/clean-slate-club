import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Users, Mail, ClipboardList, X } from 'lucide-react';

const TABS = [
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'referrals', label: 'Referrals', icon: Users },
  { key: 'waitlist', label: 'Waitlist', icon: ClipboardList },
  { key: 'campaigns', label: 'Campaigns', icon: Mail },
];

function NewTemplateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', key: '', category: 'booking', channel: 'email', subject: '', body: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.name || !form.key) return;
    setSaving(true);
    const created = await base44.entities.CampaignTemplate.create(form);
    onCreate(created);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-taupe/15 shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-base font-semibold text-charcoal">New Message Template</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-charcoal/40" /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Template name *" value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <input placeholder="Key (e.g. booking_confirmed) *" value={form.key} onChange={e => set('key', e.target.value.toLowerCase().replace(/\s/g, '_'))}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40 font-mono" />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40">
              {['booking','membership','followup','marketing','provider','admin'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.channel} onChange={e => set('channel', e.target.value)}
              className="border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both">Both</option>
            </select>
          </div>
          <input placeholder="Subject line (email)" value={form.subject} onChange={e => set('subject', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <textarea placeholder="Message body..." value={form.body} onChange={e => set('body', e.target.value)} rows={4}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40 resize-none" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={submit} disabled={saving || !form.name || !form.key} className="flex-1 py-2.5 bg-coral text-white rounded-xl text-sm font-body hover:bg-coral/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Create Template'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-taupe/20 rounded-xl text-sm font-body text-charcoal/50 hover:bg-cream">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMarketingOS({ sidebarItem }) {
  const [tab, setTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTemplate, setShowNewTemplate] = useState(false);

  useEffect(() => {
    if (sidebarItem?.key) {
      if (sidebarItem.key === 'reviews') setTab('reviews');
      if (sidebarItem.key === 'referrals') setTab('referrals');
      if (sidebarItem.key === 'waitlist') setTab('waitlist');
      if (sidebarItem.key === 'campaigns' || sidebarItem.key === 'msg_templates') setTab('campaigns');
    }
  }, [sidebarItem]);

  useEffect(() => {
    Promise.all([
      base44.entities.Review.list('-created_date', 50),
      base44.entities.Referral.list('-created_date', 50),
      base44.entities.WaitlistRequest.list('-created_date', 50),
      base44.entities.CampaignTemplate.list('-created_date', 50),
    ]).then(([rv, rf, wl, cp]) => {
      setReviews(rv || []);
      setReferrals(rf || []);
      setWaitlist(wl || []);
      setCampaigns(cp || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 px-4 py-3 bg-white border-b border-taupe/10">
        <div className="mr-auto">
          <h2 className="font-heading text-base font-semibold text-charcoal">Marketing</h2>
        </div>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${tab === t.key ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}>
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>
        ) : tab === 'reviews' ? (
          <ReviewsPanel reviews={reviews} />
        ) : tab === 'referrals' ? (
          <ReferralsPanel referrals={referrals} />
        ) : tab === 'waitlist' ? (
          <WaitlistPanel waitlist={waitlist} />
        ) : tab === 'campaigns' ? (
          <CampaignsPanel campaigns={campaigns} onNew={() => setShowNewTemplate(true)} />
        ) : null}
      </div>

      {showNewTemplate && (
        <NewTemplateModal
          onClose={() => setShowNewTemplate(false)}
          onCreate={t => setCampaigns(prev => [t, ...prev])}
        />
      )}
    </div>
  );
}

function ReviewsPanel({ reviews }) {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';
  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className="bg-butter/15 border border-butter/40 rounded-2xl p-4 text-center">
          <p className="font-heading text-3xl font-semibold text-amber-700">{avg}</p>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 mt-1">Avg Rating</p>
        </div>
        <div className="bg-sage/10 border border-sage/30 rounded-2xl p-4 text-center">
          <p className="font-heading text-3xl font-semibold text-green-700">{reviews.length}</p>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 mt-1">Total Reviews</p>
        </div>
      </div>
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-charcoal/30 font-body font-light text-center py-8">No reviews yet.</p>
        ) : reviews.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-taupe/15 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-sm font-semibold text-gray-900">{r.client_name}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-butter fill-butter' : 'text-taupe/30'}`} />
                  ))}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-body ${r.status === 'published' ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-taupe/10 border-taupe/30 text-charcoal/40'}`}>
                {r.status?.replace(/_/g, ' ')}
              </span>
            </div>
            {r.comment && <p className="font-body text-sm font-medium text-gray-700 mt-2">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralsPanel({ referrals }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Referrals ({referrals.length})</h3>
      {referrals.length === 0 ? (
        <p className="text-sm text-charcoal/30 font-body font-light text-center py-8">No referrals yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-taupe/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-taupe/10 bg-cream/50">
                {['Referrer', 'Referred', 'Code', 'Status', 'Credit'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-body text-[10px] uppercase tracking-wider text-charcoal/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id} className="border-b border-taupe/6 hover:bg-cream/30">
                  <td className="px-3 py-2.5 font-body text-sm font-semibold text-gray-900">{r.referrer_email}</td>
                  <td className="px-3 py-2.5 font-body text-sm font-medium text-gray-700">{r.referred_name}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-coral">{r.referral_code}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase font-body ${r.status === 'credited' ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-butter/15 border-butter/40 text-amber-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-body text-sm font-semibold text-gray-800">${r.referrer_credit_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WaitlistPanel({ waitlist }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Waitlist ({waitlist.length})</h3>
      {waitlist.length === 0 ? (
        <p className="text-sm text-charcoal/30 font-body font-light text-center py-8">No waitlist requests.</p>
      ) : (
        <div className="space-y-2">
          {waitlist.map(w => (
            <div key={w.id} className="bg-white rounded-xl border border-taupe/15 p-3 flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-semibold text-gray-900">{w.guest_name || w.guest_email}</p>
                <p className="font-body text-xs font-medium text-gray-600">{w.service_category?.replace(/_/g, ' ')} · {w.preferred_date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full border text-[9px] uppercase font-body ${w.status === 'notified' ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-butter/15 border-butter/40 text-amber-700'}`}>
                {w.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignsPanel({ campaigns, onNew }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-base font-semibold text-charcoal">Message Templates ({campaigns.length})</h3>
        <button onClick={onNew} className="flex items-center gap-1 bg-coral text-white px-3 py-1.5 rounded-lg text-xs font-body hover:bg-coral/90">
          + New Template
        </button>
      </div>
      {campaigns.length === 0 ? (
        <p className="text-sm text-charcoal/30 font-body font-light text-center py-8">No campaign templates yet.</p>
      ) : (
        <div className="space-y-2">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-taupe/15 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-gray-900">{c.name}</p>
                     <p className="font-body text-xs font-medium text-gray-600">{c.category} · {c.channel}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-body ${c.status === 'active' ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-taupe/10 border-taupe/30 text-charcoal/40'}`}>
                  {c.status}
                </span>
              </div>
              {c.subject && <p className="font-body text-xs font-medium text-gray-600 mt-1">Subject: {c.subject}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}