import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, MapPin, ClipboardList, DollarSign, Heart, Star, Ban, XCircle, RefreshCw, AlertTriangle, Bell, MessageSquare, FileText, ToggleLeft, Database, FlaskConical, ShieldCheck, Settings, Lock, CheckCircle, Package, Sparkles, ShoppingBag, Layout, Shield } from 'lucide-react';

const SETTINGS_MENU = [
  { key: 'business_profile', label: 'Business Profile', icon: Globe },
  { key: 'service_areas', label: 'Service Areas', icon: MapPin },
  { key: 'booking_rules', label: 'Booking Rules', icon: ClipboardList },
  { key: 'pricing', label: 'Pricing', icon: DollarSign },
  { key: 'deposits_settings', label: 'Deposits', icon: DollarSign },
  { key: 'memberships_settings', label: 'Memberships', icon: Heart },
  { key: 'holidays', label: 'Holidays', icon: Star },
  { key: 'cancellation_policy', label: 'Cancellation Policy', icon: XCircle },
  { key: 'reschedule_policy', label: 'Reschedule Policy', icon: RefreshCw },
  { key: 'noshow_policy', label: 'No-Show Policy', icon: AlertTriangle },
  { key: 'feature_toggles', label: 'Feature Toggles', icon: ToggleLeft },
  { key: 'launch_guards', label: 'Launch Guards', icon: ShieldCheck },
];

export default function AdminSettingsOS({ sidebarItem }) {
  const [activeKey, setActiveKey] = useState('business_profile');

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
        {activeKey === 'feature_toggles' && <FeatureTogglesSettings />}
        {activeKey === 'launch_guards' && <LaunchGuardsSettings />}
        {activeKey === 'holidays' && <HolidaysSettings />}
        {activeKey === 'memberships_settings' && <MembershipsSettings />}
        {activeKey === 'deposits_settings' && <DepositsSettings />}
        {activeKey === 'cancellation_policy' && <PolicySettings settingKey="cancellation_policy" title="Cancellation Policy" defaultText="Cancellations must be made at least 48 hours before the scheduled visit. Late cancellations (under 48 hours) may result in deposit forfeiture. Same-day cancellations are subject to a $50 fee." />}
        {activeKey === 'reschedule_policy' && <PolicySettings settingKey="reschedule_policy" title="Reschedule Policy" defaultText="Reschedules are allowed up to 24 hours before the visit at no charge. Reschedules under 24 hours may incur a $25 fee. Limit of 2 reschedules per booking." />}
        {activeKey === 'noshow_policy' && <PolicySettings settingKey="noshow_policy" title="No-Show Policy" defaultText="If a provider arrives and cannot access the home, or the client cannot be reached within 15 minutes, the visit may be marked as a no-show. Full deposit may be retained." />}
        {activeKey === 'pricing' && <PricingSettings />}
      </div>
    </div>
  );
}

// ── Reusable save hook ──
function useAppSetting(key, defaultValue = '') {
  const [value, setValue] = useState(defaultValue);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.AppSettings.filter({ key }).then(results => {
      if (results?.length > 0) {
        setValue(results[0].value ?? defaultValue);
        setRecordId(results[0].id);
      }
    }).catch(() => {});
  }, [key]);

  const save = async (newValue) => {
    setSaving(true);
    const v = newValue !== undefined ? newValue : value;
    try {
      if (recordId) {
        await base44.entities.AppSettings.update(recordId, { value: String(v) });
      } else {
        const created = await base44.entities.AppSettings.create({ key, value: String(v), category: 'feature_toggles' });
        setRecordId(created.id);
      }
      setValue(v);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Save failed', e);
    } finally {
      setSaving(false);
    }
  };

  return { value, setValue, save, saving, saved };
}

function SaveBar({ saving, saved, onSave }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={onSave} disabled={saving}
        className="bg-coral text-white px-5 py-2.5 rounded-xl text-sm font-body hover:bg-coral/90 disabled:opacity-50 transition-colors">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && <span className="text-xs font-body text-green-600">✓ Saved</span>}
    </div>
  );
}

function BusinessProfileSettings() {
  const fields = [
    { label: 'Business Name', key: 'biz_name', default: 'Clean Slate Club' },
    { label: 'Email', key: 'biz_email', default: 'cleanslateclubpa@gmail.com' },
    { label: 'Phone', key: 'biz_phone', default: '(215) 500-3758' },
    { label: 'Website', key: 'biz_website', default: 'cleanslateclub.co' },
  ];
  return (
    <div className="max-w-xl space-y-4">
      {fields.map(f => <SettingTextField key={f.key} settingKey={f.key} label={f.label} defaultValue={f.default} />)}
    </div>
  );
}

function SettingTextField({ settingKey, label, defaultValue, multiline = false }) {
  const { value, setValue, save, saving, saved } = useAppSetting(settingKey, defaultValue);
  return (
    <div>
      <label className="font-body text-xs uppercase tracking-wider font-bold text-gray-600 mb-1 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={6}
          className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body text-charcoal focus:outline-none focus:border-coral/40 bg-white resize-none leading-relaxed" />
      ) : (
        <input value={value} onChange={e => setValue(e.target.value)}
          className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body text-charcoal focus:outline-none focus:border-coral/40 bg-white" />
      )}
      <SaveBar saving={saving} saved={saved} onSave={() => save()} />
    </div>
  );
}

function SettingNumberField({ settingKey, label, defaultValue, suffix = '' }) {
  const { value, setValue, save, saving, saved } = useAppSetting(settingKey, String(defaultValue));
  return (
    <div className="bg-white rounded-xl border border-taupe/15 p-4">
      <label className="font-body text-xs uppercase tracking-widest text-charcoal/40 mb-2 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="number" value={value} onChange={e => setValue(e.target.value)}
          className="w-32 border border-taupe/20 rounded-lg px-3 py-2 text-sm font-body text-charcoal focus:outline-none focus:border-coral/40 bg-cream" />
        {suffix && <span className="font-body text-sm text-charcoal/40">{suffix}</span>}
        <button onClick={() => save()} disabled={saving}
          className="ml-auto bg-coral text-white px-4 py-2 rounded-lg text-xs font-body hover:bg-coral/90 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function SettingToggle({ settingKey, label, description, defaultValue = true }) {
  const { value, save, saving } = useAppSetting(settingKey, String(defaultValue));
  const isOn = value === 'true' || value === true;
  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-xl border border-taupe/15">
      <div className="flex-1 pr-4">
        <p className="font-body text-sm font-semibold text-gray-900">{label}</p>
        {description && <p className="font-body text-xs text-gray-600 font-medium mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => save(String(!isOn))}
        disabled={saving}
        className={`w-11 h-6 rounded-full transition-all relative flex items-center px-0.5 shrink-0 disabled:opacity-60 ${isOn ? 'bg-sage' : 'bg-taupe/30'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function ServiceAreasSettings() {
  const SERVICE_AREAS = ['Flourtown','Wyndmoor','Erdenheim','Chestnut Hill','Lafayette Hill','Blue Bell','Conshohocken','Plymouth Meeting','Ambler','Glenside','Oreland','Fort Washington','Willow Grove'];
  const { value, setValue, save, saving, saved } = useAppSetting('service_areas_list', SERVICE_AREAS.join(','));
  const areas = value ? value.split(',').map(a => a.trim()).filter(Boolean) : [];
  const [newArea, setNewArea] = useState('');

  const addArea = () => {
    if (!newArea.trim()) return;
    const updated = [...areas, newArea.trim()].join(',');
    setValue(updated);
    save(updated);
    setNewArea('');
  };

  const removeArea = (area) => {
    const updated = areas.filter(a => a !== area).join(',');
    setValue(updated);
    save(updated);
  };

  return (
    <div className="max-w-lg">
      <p className="font-body text-sm text-gray-700 font-medium mb-4">Active service territories. Bookings outside these areas trigger a manual review flag.</p>
      <div className="flex gap-2 mb-3">
        <input value={newArea} onChange={e => setNewArea(e.target.value)} onKeyDown={e => e.key === 'Enter' && addArea()}
          placeholder="Add town or area..." className="flex-1 border border-taupe/20 rounded-lg px-3 py-2 text-sm font-body text-charcoal focus:outline-none focus:border-coral/40 bg-white" />
        <button onClick={addArea} className="bg-coral text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-coral/90">Add</button>
      </div>
      <div className="space-y-2">
        {areas.map(area => (
          <div key={area} className="flex items-center justify-between p-3 bg-white rounded-xl border border-taupe/15">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-sage" />
              <p className="font-body text-sm text-charcoal">{area}, PA</p>
            </div>
            <button onClick={() => removeArea(area)} className="text-charcoal/25 hover:text-red-400 transition-colors text-xs font-body">Remove</button>
          </div>
        ))}
      </div>
      {saved && <p className="text-xs text-green-600 font-body mt-2">✓ Saved</p>}
    </div>
  );
}

function BookingRulesSettings() {
  const rules = [
    { key: 'booking_min_lead_hours', label: 'Minimum Lead Time (hours)', defaultValue: '24', suffix: 'hours' },
    { key: 'booking_min_duration_hours', label: 'Minimum Booking Duration (hours)', defaultValue: '2', suffix: 'hours' },
    { key: 'travel_buffer_minutes', label: 'Travel Buffer (minutes)', defaultValue: '20', suffix: 'min' },
    { key: 'consult_duration_minutes', label: 'Free Consult Duration (minutes)', defaultValue: '15', suffix: 'min' },
    { key: 'booking_window_start', label: 'Booking Window Opens (hour, 24h)', defaultValue: '10', suffix: ':00' },
    { key: 'booking_window_end', label: 'Booking Window Closes (hour, 24h)', defaultValue: '18', suffix: ':00' },
    { key: 'max_reschedules', label: 'Max Reschedules Per Booking', defaultValue: '2', suffix: '' },
  ];
  const toggles = [
    { key: 'booking_no_sunday', label: 'Block Sunday Bookings', description: 'No client-facing bookings on Sundays', defaultValue: true },
    { key: 'booking_consult_monday_only', label: 'Consults Monday Morning Only', description: 'Mon 10am–12pm consult window', defaultValue: true },
    { key: 'booking_one_pkg_per_visit', label: 'One Package Per Visit', description: 'Prevent multiple packages per booking', defaultValue: true },
  ];
  return (
    <div className="max-w-lg space-y-3">
      <p className="font-body text-sm text-gray-700 font-medium mb-4">These rules govern online booking availability and scheduling constraints. Changes apply immediately.</p>
      {rules.map(r => <SettingNumberField key={r.key} settingKey={r.key} label={r.label} defaultValue={r.defaultValue} suffix={r.suffix} />)}
      <div className="space-y-2 mt-4">
        {toggles.map(t => <SettingToggle key={t.key} settingKey={t.key} label={t.label} description={t.description} defaultValue={t.defaultValue} />)}
      </div>
    </div>
  );
}

function FeatureTogglesSettings() {
  const toggles = [
    { key: 'booking_enabled', label: 'Public Booking Enabled', description: 'Allow new bookings from the public booking form', defaultValue: true },
    { key: 'consult_enabled', label: 'Free Consult Available', description: 'Show and allow free consult scheduling', defaultValue: true },
    { key: 'membership_signup_enabled', label: 'Membership Signup Enabled', description: 'Allow new membership sign-ups', defaultValue: true },
    { key: 'referrals_enabled', label: 'Referral Program Enabled', description: 'Accept and track referral codes', defaultValue: true },
    { key: 'waitlist_enabled', label: 'Waitlist Enabled', description: 'Allow guests to join the waitlist', defaultValue: true },
    { key: 'provider_portal_enabled', label: 'Provider Portal Enabled', description: 'Providers can log in to view their schedule', defaultValue: true },
    { key: 'member_portal_enabled', label: 'Member Portal Enabled', description: 'Members can log in to manage bookings', defaultValue: true },
  ];
  return (
    <div className="max-w-lg space-y-3">
      {toggles.map(t => <SettingToggle key={t.key} settingKey={t.key} label={t.label} description={t.description} defaultValue={t.defaultValue} />)}
    </div>
  );
}

function LaunchGuardsSettings() {
  const guards = [
    { key: 'guard_final_checkout', label: 'Final Checkout Sends', locked: true },
    { key: 'guard_live_payments', label: 'Real Payment Collection (beyond deposit)', locked: true },
    { key: 'guard_refunds', label: 'Refunds', locked: true },
    { key: 'guard_cancellation_fees', label: 'Cancellation Fees', locked: true },
    { key: 'guard_reschedule_fees', label: 'Reschedule Fees', locked: true },
    { key: 'guard_noshow_fees', label: 'No-Show Fees', locked: true },
    { key: 'guard_sms_sends', label: 'SMS Sends', locked: false },
    { key: 'guard_email_sends', label: 'Email Sends', locked: false },
    { key: 'guard_auto_assign', label: 'Provider Auto-Assignment', locked: true },
    { key: 'guard_destructive_deletes', label: 'Destructive Deletes', locked: true },
  ];
  return (
    <div className="max-w-lg">
      <div className="bg-coral/5 border border-coral/20 rounded-xl p-4 mb-4">
        <p className="font-heading text-sm font-semibold text-coral mb-1">🔒 Launch Guards Active</p>
        <p className="font-body text-xs text-charcoal/50 font-light">Locked features require owner confirmation before enabling. SMS and email sends can be toggled freely.</p>
      </div>
      <div className="space-y-2">
        {guards.map(guard => guard.locked ? (
          <div key={guard.key} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-taupe/15">
            <div className="flex items-center gap-2.5">
              <Lock className="w-3.5 h-3.5 text-coral/60 shrink-0" />
              <p className="font-body text-sm font-semibold text-gray-900">{guard.label}</p>
            </div>
            <span className="font-body text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border bg-coral/8 border-coral/25 text-coral">🔒 Locked</span>
          </div>
        ) : (
          <SettingToggle key={guard.key} settingKey={guard.key} label={guard.label} defaultValue={false} />
        ))}
      </div>
    </div>
  );
}

function HolidaysSettings() {
  const blackout = ["New Year's Day (Jan 1)", "Thanksgiving Day (Nov, 4th Thu)", "Christmas Day (Dec 25)"];
  const premium = ["Easter Weekend", "Memorial Day Weekend", "Independence Day (Jul 4)", "Labor Day (Sep, 1st Mon)", "Christmas Eve (Dec 24)", "New Year's Eve (Dec 31)"];
  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-2">Blackout Dates (No Booking)</h3>
        <div className="space-y-1.5">
          {blackout.map(h => (
            <div key={h} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-taupe/15">
              <Ban className="w-4 h-4 text-charcoal/30 shrink-0" />
              <p className="font-body text-sm text-charcoal">{h}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-2">Premium / Manual Approval Dates</h3>
        <div className="space-y-1.5">
          {premium.map(h => (
            <div key={h} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-taupe/15">
              <Star className="w-4 h-4 text-butter shrink-0" />
              <p className="font-body text-sm text-charcoal">{h}</p>
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
      <SettingNumberField settingKey="membership_monthly_rate" label="Monthly Rate ($)" defaultValue="49" suffix="/mo" />
      <SettingNumberField settingKey="membership_max_pauses" label="Max Pauses Per Year" defaultValue="2" suffix="pauses" />
      <SettingNumberField settingKey="membership_grace_days" label="Grace Period After Cancellation (days)" defaultValue="30" suffix="days" />
    </div>
  );
}

function DepositsSettings() {
  return (
    <div className="max-w-lg space-y-4">
      <SettingNumberField settingKey="deposit_amount" label="Standard Deposit Amount ($)" defaultValue="50" suffix="per booking" />
      <SettingToggle settingKey="deposit_required" label="Deposit Required for All Bookings" description="Require deposit at time of booking" defaultValue={true} />
      <SettingToggle settingKey="deposit_applied_to_balance" label="Deposit Applied to Final Balance" description="Deposit counts toward total service cost" defaultValue={true} />
    </div>
  );
}

function PolicySettings({ settingKey, title, defaultText }) {
  return (
    <div className="max-w-xl">
      <SettingTextField settingKey={settingKey} label={title} defaultValue={defaultText} multiline />
    </div>
  );
}

function PricingSettings() {
  return (
    <div className="max-w-lg space-y-3">
      <p className="font-body text-sm text-gray-700 font-medium mb-2">Base pricing by service. These are used as defaults in the booking estimator.</p>
      {[
        { key: 'price_home_reset_low', label: 'Home Reset — Low ($)', defaultValue: '145' },
        { key: 'price_home_reset_high', label: 'Home Reset — High ($)', defaultValue: '275' },
        { key: 'price_meal_prep_low', label: 'Meal Prep — Low ($)', defaultValue: '125' },
        { key: 'price_meal_prep_high', label: 'Meal Prep — High ($)', defaultValue: '250' },
        { key: 'price_errands_low', label: 'Errands — Low ($)', defaultValue: '75' },
        { key: 'price_errands_high', label: 'Errands — High ($)', defaultValue: '140' },
        { key: 'price_senior_low', label: 'Senior Support — Low ($)', defaultValue: '85' },
        { key: 'price_senior_high', label: 'Senior Support — High ($)', defaultValue: '150' },
        { key: 'provider_payout_rate_standard', label: 'Provider Payout Rate (standard %)', defaultValue: '50' },
        { key: 'provider_payout_rate_holiday', label: 'Provider Payout Rate (holiday %)', defaultValue: '55' },
      ].map(r => <SettingNumberField key={r.key} settingKey={r.key} label={r.label} defaultValue={r.defaultValue} />)}
    </div>
  );
}