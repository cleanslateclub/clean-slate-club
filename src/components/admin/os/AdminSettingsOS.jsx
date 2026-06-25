import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, MapPin, ClipboardList, DollarSign, Heart, Star, Ban, XCircle, RefreshCw, AlertTriangle, Bell, MessageSquare, FileText, ToggleLeft, Database, FlaskConical, ShieldCheck, Settings, Lock, CheckCircle, Package, Sparkles, ShoppingBag, Layout, Shield } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

const SETTINGS_MENU = [
  { key: 'business_profile', label: 'Business Profile', icon: Globe },
  { key: 'service_areas', label: 'Service Areas', icon: MapPin },
  { key: 'booking_rules', label: 'Booking Rules', icon: ClipboardList },
  { key: 'services_settings', label: 'Services', icon: Sparkles },
  { key: 'packages_settings', label: 'Packages', icon: Package },
  { key: 'addons_settings', label: 'Add-ons', icon: ShoppingBag },
  { key: 'appt_templates_settings', label: 'Appointment Templates', icon: Layout },
  { key: 'provider_rules', label: 'Provider Rules', icon: Shield },
  { key: 'pricing', label: 'Pricing', icon: DollarSign },
  { key: 'deposits_settings', label: 'Deposits', icon: DollarSign },
  { key: 'memberships_settings', label: 'Memberships', icon: Heart },
  { key: 'holidays', label: 'Holidays', icon: Star },
  { key: 'cancellation_policy', label: 'Cancellation Policy', icon: XCircle },
  { key: 'reschedule_policy', label: 'Reschedule Policy', icon: RefreshCw },
  { key: 'noshow_policy', label: 'No-Show Policy', icon: AlertTriangle },
  { key: 'notifications_settings', label: 'Notifications', icon: Bell },
  { key: 'message_templates', label: 'Message Templates', icon: MessageSquare },
  { key: 'forms', label: 'Forms', icon: FileText },
  { key: 'feature_toggles', label: 'Feature Toggles', icon: ToggleLeft },
  { key: 'schema_check', label: 'Schema Check', icon: Database },
  { key: 'smoke_test', label: 'Smoke Test', icon: FlaskConical },
  { key: 'launch_guards', label: 'Launch Guards', icon: ShieldCheck },
];

const SERVICE_AREAS = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill', 'Lafayette Hill',
  'Blue Bell', 'Conshohocken', 'Plymouth Meeting', 'Ambler', 'Glenside',
  'Oreland', 'Fort Washington', 'Willow Grove',
];

const BOOKING_RULES = [
  { key: 'min_lead_time', label: '24-Hour Minimum Lead Time', value: '24 hrs', editable: false },
  { key: 'booking_hours', label: 'Public Booking Hours', value: '10am – 6pm', editable: false },
  { key: 'no_sunday', label: 'No Sunday Client-Facing Bookings', value: 'Enabled', editable: false },
  { key: 'consult_only_mon', label: 'Consults Only (Mon 10am–12pm)', value: 'Enabled', editable: false },
  { key: 'consult_duration', label: 'Free Consult Duration', value: '15 minutes', editable: false },
  { key: 'min_booking', label: 'Minimum Booking Duration', value: '2 hours', editable: false },
  { key: 'travel_buffer', label: 'Travel Buffer', value: '20 minutes', editable: false },
  { key: 'one_pkg_per_visit', label: 'One Package Per Visit', value: 'Enabled', editable: false },
];

const LAUNCH_GUARDS = [
  { key: 'final_checkout', label: 'Final Checkout Sends', locked: true },
  { key: 'live_payments', label: 'Real Payment Collection (beyond deposit)', locked: true },
  { key: 'refunds', label: 'Refunds', locked: true },
  { key: 'cancellation_fees', label: 'Cancellation Fees', locked: true },
  { key: 'reschedule_fees', label: 'Reschedule Fees', locked: true },
  { key: 'noshow_fees', label: 'No-Show Fees', locked: true },
  { key: 'sms_sends', label: 'SMS Sends', locked: false },
  { key: 'email_sends', label: 'Email Sends', locked: false },
  { key: 'auto_assign', label: 'Provider Auto-Assignment', locked: true },
  { key: 'destructive_deletes', label: 'Destructive Deletes', locked: true },
];

export default function AdminSettingsOS({ sidebarItem }) {
  const [activeKey, setActiveKey] = useState('business_profile');
  const { getBool, getString, loading: settingsLoading } = useAppSettings();

  useEffect(() => {
    if (sidebarItem?.key) setActiveKey(sidebarItem.key);
  }, [sidebarItem]);

  const activeItem = SETTINGS_MENU.find(s => s.key === activeKey) || SETTINGS_MENU[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="flex h-full">
      {/* Settings sidebar */}
      <div className="w-56 shrink-0 border-r border-taupe/15 overflow-y-auto" style={{ background: '#f8f5f2' }}>
        <div className="p-3">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-charcoal/30 px-2 mb-2">Settings</p>
          {SETTINGS_MENU.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all mb-0.5 ${activeKey === item.key ? 'bg-coral/10 border border-coral/25 text-coral' : 'text-charcoal/55 hover:bg-white hover:text-charcoal/80 border border-transparent'}`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${activeKey === item.key ? 'text-coral' : 'text-charcoal/30'}`} />
                <span className="font-body text-xs font-light truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center gap-2 mb-5">
          <ActiveIcon className="w-5 h-5 text-coral" />
          <h2 className="font-heading text-lg font-semibold text-charcoal">{activeItem.label}</h2>
        </div>

        {activeKey === 'business_profile' && <BusinessProfileSettings />}
        {activeKey === 'service_areas' && <ServiceAreasSettings />}
        {activeKey === 'booking_rules' && <BookingRulesSettings />}
        {activeKey === 'feature_toggles' && <FeatureTogglesSettings getBool={getBool} />}
        {activeKey === 'launch_guards' && <LaunchGuardsSettings />}
        {activeKey === 'holidays' && <HolidaysSettings />}
        {activeKey === 'memberships_settings' && <MembershipsSettings />}
        {activeKey === 'deposits_settings' && <DepositsSettings />}
        {activeKey === 'cancellation_policy' && <PolicySettings title="Cancellation Policy" />}
        {activeKey === 'reschedule_policy' && <PolicySettings title="Reschedule Policy" />}
        {activeKey === 'noshow_policy' && <PolicySettings title="No-Show Policy" />}
        {!['business_profile', 'service_areas', 'booking_rules', 'feature_toggles', 'launch_guards', 'holidays', 'memberships_settings', 'deposits_settings', 'cancellation_policy', 'reschedule_policy', 'noshow_policy'].includes(activeKey) && (
          <ComingSoonPanel label={activeItem.label} />
        )}
      </div>
    </div>
  );
}

function BusinessProfileSettings() {
  return (
    <div className="max-w-xl space-y-4">
      {[
        { label: 'Business Name', value: 'Clean Slate Club' },
        { label: 'Email', value: 'cleanslateclubpa@gmail.com' },
        { label: 'Phone', value: '(215) 500-3758' },
        { label: 'Website', value: 'cleanslateclub.co' },
        { label: 'Service Type', value: 'Lifestyle Support, Home Reset, Household Support' },
      ].map(field => (
        <div key={field.label}>
          <label className="font-body text-xs uppercase tracking-widest text-charcoal/40 mb-1 block">{field.label}</label>
          <input defaultValue={field.value} className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body text-charcoal focus:outline-none focus:border-coral/40 bg-white" />
        </div>
      ))}
      <button className="bg-coral text-white px-5 py-2.5 rounded-xl text-sm font-body hover:bg-coral/90 transition-colors">Save Changes</button>
    </div>
  );
}

function ServiceAreasSettings() {
  const [areas] = useState(SERVICE_AREAS.map(name => ({ name, active: true })));
  return (
    <div className="max-w-lg">
      <p className="font-body text-sm text-charcoal/50 font-light mb-4">Active service territories. Bookings outside these areas require manual review.</p>
      <div className="space-y-2">
        {areas.map(area => (
          <div key={area.name} className="flex items-center justify-between p-3 bg-white rounded-xl border border-taupe/15">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-sage" />
              <p className="font-body text-sm text-charcoal">{area.name}, PA</p>
            </div>
            <span className="font-body text-[10px] uppercase tracking-widest text-sage bg-sage/10 border border-sage/30 rounded-full px-2 py-0.5">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingRulesSettings() {
  return (
    <div className="max-w-lg space-y-2">
      <p className="font-body text-sm text-charcoal/50 font-light mb-4">Core booking rules for Clean Slate Club. These govern online booking availability and schedule constraints.</p>
      {BOOKING_RULES.map(rule => (
        <div key={rule.key} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-taupe/15">
          <div className="flex items-center gap-2.5">
            <Lock className="w-3.5 h-3.5 text-charcoal/25 shrink-0" />
            <p className="font-body text-sm text-charcoal">{rule.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-charcoal/50 bg-cream border border-taupe/15 rounded-lg px-2.5 py-1">{rule.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureTogglesSettings({ getBool }) {
  const toggles = [
    { key: 'booking_enabled', label: 'Public Booking Enabled', description: 'Allow new bookings from the public booking form' },
    { key: 'consult_enabled', label: 'Free Consult Available', description: 'Show and allow free consult scheduling' },
    { key: 'membership_signup_enabled', label: 'Membership Signup Enabled', description: 'Allow new membership sign-ups' },
    { key: 'referrals_enabled', label: 'Referral Program Enabled', description: 'Accept and track referral codes' },
  ];
  return (
    <div className="max-w-lg space-y-3">
      {toggles.map(t => (
        <div key={t.key} className="flex items-start justify-between p-4 bg-white rounded-xl border border-taupe/15">
          <div className="flex-1 pr-4">
            <p className="font-body text-sm text-charcoal">{t.label}</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{t.description}</p>
          </div>
          <div className={`w-10 h-5.5 rounded-full transition-all cursor-pointer relative flex items-center px-0.5 ${getBool(t.key, true) ? 'bg-sage' : 'bg-taupe/30'}`}
            style={{ minWidth: 40, height: 22 }}>
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${getBool(t.key, true) ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LaunchGuardsSettings() {
  return (
    <div className="max-w-lg">
      <div className="bg-coral/5 border border-coral/20 rounded-xl p-4 mb-4">
        <p className="font-heading text-sm font-semibold text-coral mb-1">🔒 Launch Guards Active</p>
        <p className="font-body text-xs text-charcoal/50 font-light">These features are locked until backend verification is complete. Do not unlock without owner confirmation.</p>
      </div>
      <div className="space-y-2">
        {LAUNCH_GUARDS.map(guard => (
          <div key={guard.key} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-taupe/15">
            <div className="flex items-center gap-2.5">
              {guard.locked ? <Lock className="w-3.5 h-3.5 text-coral/60 shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 text-sage shrink-0" />}
              <p className="font-body text-sm text-charcoal">{guard.label}</p>
            </div>
            <span className={`font-body text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-body ${guard.locked ? 'bg-coral/8 border-coral/25 text-coral' : 'bg-sage/15 border-sage/40 text-green-700'}`}>
              {guard.locked ? '🔒 Locked' : '✓ Available'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HolidaysSettings() {
  const blackout = [
    { name: 'New Year\'s Day', date: 'Jan 1' },
    { name: 'Thanksgiving Day', date: 'Nov (4th Thu)' },
    { name: 'Christmas Day', date: 'Dec 25' },
  ];
  const premium = [
    { name: 'Easter Weekend', date: 'April (varies)' },
    { name: 'Memorial Day Weekend', date: 'Late May' },
    { name: 'Independence Day', date: 'Jul 4' },
    { name: 'Labor Day', date: 'Sep (1st Mon)' },
    { name: 'Christmas Eve', date: 'Dec 24' },
    { name: 'New Year\'s Eve', date: 'Dec 31' },
  ];
  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-2 flex items-center gap-2"><Ban className="w-4 h-4 text-charcoal/40" /> Blackout Dates (No Booking)</h3>
        <div className="space-y-1.5">
          {blackout.map(h => (
            <div key={h.name} className="flex items-center justify-between p-3 bg-white rounded-xl border border-taupe/15">
              <p className="font-body text-sm text-charcoal">{h.name}</p>
              <span className="font-body text-xs text-charcoal/40 bg-taupe/10 border border-taupe/20 rounded-lg px-2 py-1">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-butter" /> Premium / Manual Approval Dates</h3>
        <div className="space-y-1.5">
          {premium.map(h => (
            <div key={h.name} className="flex items-center justify-between p-3 bg-white rounded-xl border border-taupe/15">
              <p className="font-body text-sm text-charcoal">{h.name}</p>
              <span className="font-body text-xs text-amber-700 bg-butter/15 border border-butter/40 rounded-lg px-2 py-1">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MembershipsSettings() {
  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white rounded-2xl border border-taupe/15 p-5">
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-3">Clean Slate Club Membership</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-cream rounded-xl p-3 border border-taupe/10">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Monthly Rate</p>
            <p className="font-heading text-xl font-semibold text-coral">$49/mo</p>
          </div>
          <div className="bg-cream rounded-xl p-3 border border-taupe/10">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Max Pauses/Year</p>
            <p className="font-heading text-xl font-semibold text-charcoal">2</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {['Priority booking', 'Preferred scheduling windows', 'First access to recurring openings', 'Faster consult approvals', 'Seasonal priority'].map(b => (
            <div key={b} className="flex items-center gap-2 text-xs font-body text-charcoal/60 font-light">
              <CheckCircle className="w-3.5 h-3.5 text-sage shrink-0" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepositsSettings() {
  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white rounded-2xl border border-taupe/15 p-5">
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-3">Deposit Rules</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-cream rounded-xl p-3 border border-taupe/10">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Standard Deposit</p>
            <p className="font-heading text-xl font-semibold text-coral">$50</p>
          </div>
          <div className="bg-cream rounded-xl p-3 border border-taupe/10">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Applied To</p>
            <p className="font-body text-sm text-charcoal">Services only</p>
          </div>
        </div>
        <div className="space-y-2 text-sm font-body text-charcoal/60 font-light">
          <p>✓ Deposit applied toward final balance</p>
          <p>✓ Goods/shopping funds excluded from deposit</p>
          <p>✓ Providers never use personal funds</p>
          <p>🔒 Live charge automation locked until verified</p>
        </div>
      </div>
    </div>
  );
}

function PolicySettings({ title }) {
  const policies = {
    'Cancellation Policy': 'Cancellations must be made at least 48 hours before the scheduled visit. Late cancellations (under 48 hours) may result in deposit forfeiture. Same-day cancellations are subject to a $50 fee.',
    'Reschedule Policy': 'Reschedules are allowed up to 24 hours before the visit at no charge. Reschedules under 24 hours may incur a $25 fee. Limit of 2 reschedules per booking.',
    'No-Show Policy': 'If a provider arrives and cannot access the home, or the client cannot be reached within 15 minutes, the visit may be marked as a no-show. Full deposit may be retained.',
  };
  return (
    <div className="max-w-xl">
      <textarea
        defaultValue={policies[title] || ''}
        rows={8}
        className="w-full border border-taupe/20 rounded-2xl px-4 py-3 text-sm font-body text-charcoal/70 font-light focus:outline-none focus:border-coral/40 bg-white leading-relaxed resize-none"
      />
      <div className="flex gap-2 mt-3">
        <button className="bg-coral text-white px-5 py-2.5 rounded-xl text-sm font-body hover:bg-coral/90">Save Policy</button>
        <p className="text-xs text-charcoal/30 font-body font-light self-center">🔒 Policy enforcement automation is locked until backend verification</p>
      </div>
    </div>
  );
}

function ComingSoonPanel({ label }) {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="text-center">
        <Settings className="w-10 h-10 text-charcoal/15 mx-auto mb-3" />
        <p className="font-heading text-base text-charcoal/40">{label}</p>
        <p className="font-body text-sm text-charcoal/25 font-light mt-1">Configuration panel coming soon</p>
      </div>
    </div>
  );
}