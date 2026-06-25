import React, { useState } from 'react';
import { Bell, ClipboardCheck, LayoutDashboard, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import CommandCenterPreview from '@/components/admin/CommandCenterPreview';
import ServicesOSTab from '@/components/admin/ServicesOSTab';
import { BOOKING_RULES_DEFAULTS, CAMPAIGN_TEMPLATE_SEEDS, PROVIDER_DOCUMENT_REQUIREMENTS, SCHEDULE_NOTIFICATION_RULES } from '@/lib/backendOSConfig';

function OverviewPanel({ onJump }) {
  const documentRuleCount = Object.values(PROVIDER_DOCUMENT_REQUIREMENTS).flat().length;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Clean Slate Club Backend OS</p>
        <h1 className="font-heading text-3xl font-semibold text-charcoal mt-1">Command center preview</h1>
        <p className="font-body text-sm text-charcoal/45 font-light mt-3 max-w-3xl leading-relaxed">
          This preview keeps the new operating-system structure separate from the current dashboard while it is being built. The goal is one shared source for services, add-ons, quote estimates, provider rules, campaign seeds, and schedule notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Lead time', value: `${BOOKING_RULES_DEFAULTS.minimumLeadTimeHours}h`, helper: 'Default booking rule' },
          { label: 'Deposit', value: `$${BOOKING_RULES_DEFAULTS.depositAmount}`, helper: 'Default service deposit' },
          { label: 'Provider rules', value: documentRuleCount, helper: 'Preloaded requirements' },
          { label: 'Campaigns', value: CAMPAIGN_TEMPLATE_SEEDS.length, helper: 'Starter message seeds' },
        ].map(card => (
          <div key={card.label} className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{card.label}</p>
            <p className="font-heading text-3xl text-charcoal mt-2">{card.value}</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-1">{card.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <button type="button" onClick={() => onJump('command')} className="text-left rounded-3xl bg-warm-white border border-taupe/15 p-6 hover:border-coral/25 transition-all">
          <LayoutDashboard className="w-5 h-5 text-coral mb-4" />
          <p className="font-heading text-lg font-semibold text-charcoal">Command Center</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">Today, upcoming, review queue, alerts, and owner snapshot.</p>
        </button>
        <button type="button" onClick={() => onJump('services')} className="text-left rounded-3xl bg-warm-white border border-taupe/15 p-6 hover:border-coral/25 transition-all">
          <Sparkles className="w-5 h-5 text-coral mb-4" />
          <p className="font-heading text-lg font-semibold text-charcoal">Services OS</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">Packages, add-ons, prices, durations, focus items, and estimator preview.</p>
        </button>
        <button type="button" onClick={() => onJump('provider-rules')} className="text-left rounded-3xl bg-warm-white border border-taupe/15 p-6 hover:border-coral/25 transition-all">
          <ShieldCheck className="w-5 h-5 text-coral mb-4" />
          <p className="font-heading text-lg font-semibold text-charcoal">Provider rules</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">Required onboarding and readiness rules by service permission.</p>
        </button>
        <button type="button" onClick={() => onJump('notifications')} className="text-left rounded-3xl bg-warm-white border border-taupe/15 p-6 hover:border-coral/25 transition-all">
          <Bell className="w-5 h-5 text-coral mb-4" />
          <p className="font-heading text-lg font-semibold text-charcoal">Notifications</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">Provider and admin schedule-change notification rules.</p>
        </button>
      </div>
    </div>
  );
}

function ProviderRulesPanel() {
  return (
    <div className="space-y-5">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Provider OS</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Provider readiness rules</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          These rules support staged provider setup before a provider can take certain kinds of jobs.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(PROVIDER_DOCUMENT_REQUIREMENTS).map(([group, requirements]) => (
          <div key={group} className="bg-warm-white rounded-3xl border border-taupe/15 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-4 h-4 text-coral" />
              <p className="font-heading text-sm font-semibold text-charcoal capitalize">{group.replace(/_/g, ' ')}</p>
            </div>
            <div className="space-y-2">
              {requirements.map(req => (
                <div key={req.key} className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-body text-sm text-charcoal font-light">{req.label}</p>
                    {req.required && <span className="px-2 py-0.5 rounded-full bg-coral/10 text-[10px] font-body text-coral">required</span>}
                    {req.expires && <span className="px-2 py-0.5 rounded-full bg-warm-white text-[10px] font-body text-charcoal/35 border border-taupe/10">expires</span>}
                  </div>
                  <p className="font-body text-xs text-charcoal/40 font-light mt-1 leading-relaxed">{req.helper}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationPanel() {
  return (
    <div className="space-y-5">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Notification OS</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Schedule-change rules</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Providers can receive email and text alerts when assigned work changes. Admin receives schedule-change alerts as the master oversight layer.
        </p>
      </div>
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-5">
        <p className="font-heading text-sm font-semibold text-charcoal mb-3">Tracked schedule events</p>
        <div className="flex flex-wrap gap-2">
          {SCHEDULE_NOTIFICATION_RULES.events.map(event => (
            <span key={event} className="px-3 py-1 rounded-full bg-cream border border-taupe/10 text-xs font-body font-light text-charcoal/55">
              {event.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RulesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(BOOKING_RULES_DEFAULTS).map(([key, value]) => (
        <div key={key} className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
          <p className="font-body text-xs uppercase tracking-widest text-charcoal/30">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</p>
          <p className="font-body text-sm text-charcoal/60 font-light mt-2 break-words">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

const OS_TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'command', label: 'Command Center', icon: LayoutDashboard },
  { key: 'services', label: 'Services', icon: Sparkles },
  { key: 'provider-rules', label: 'Provider Rules', icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'rules', label: 'Rules', icon: Settings },
];

export default function AdminOS() {
  const [tab, setTab] = useState('overview');

  return (
    <main className="min-h-screen bg-cream pt-20 pb-16">
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Admin OS Preview</h1>
          </div>
          <a href="/admin" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
            Current Dashboard
          </a>
        </div>
      </div>

      <div className="bg-warm-white border-b border-taupe/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {OS_TABS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-body font-light border-b-2 whitespace-nowrap transition-all ${
                  tab === item.key ? 'border-coral text-coral' : 'border-transparent text-charcoal/40 hover:text-charcoal/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {tab === 'overview' && <OverviewPanel onJump={setTab} />}
        {tab === 'command' && <CommandCenterPreview />}
        {tab === 'services' && <ServicesOSTab />}
        {tab === 'provider-rules' && <ProviderRulesPanel />}
        {tab === 'notifications' && <NotificationPanel />}
        {tab === 'rules' && <RulesPanel />}
      </div>
    </main>
  );
}
