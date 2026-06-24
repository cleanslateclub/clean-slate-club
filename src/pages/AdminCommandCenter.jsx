import React, { useState } from 'react';
import { Bell, CalendarDays, ClipboardList, CreditCard, Home, LogOut, Settings, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommandCenterPreview from '@/components/admin/CommandCenterPreview';
import ServicesOSTab from '@/components/admin/ServicesOSTab';

const COMMAND_TABS = [
  { key: 'home', label: 'Command', icon: Home },
  { key: 'bookings', label: 'Bookings', icon: ClipboardList },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'households', label: 'Households', icon: Users },
  { key: 'providers', label: 'Providers', icon: ShieldCheck },
  { key: 'services', label: 'Services', icon: Sparkles },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'messages', label: 'Messages', icon: Bell },
  { key: 'settings', label: 'Settings', icon: Settings },
];

function PlaceholderPanel({ title, description, bullets = [] }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6">
      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Replacement Portal</p>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">{title}</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">{description}</p>
      {bullets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {bullets.map(item => (
            <div key={item} className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3 font-body text-sm text-charcoal/50 font-light">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  return (
    <main className="min-h-screen bg-cream pt-20 pb-16">
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Command Center</h1>
            <p className="font-body text-xs text-charcoal/35 font-light mt-1">New admin portal replacement shell</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a href="/admin-os" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Admin OS Preview
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-warm-white border-b border-taupe/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {COMMAND_TABS.map(item => {
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
        {tab === 'home' && <CommandCenterPreview />}
        {tab === 'services' && <ServicesOSTab />}
        {tab === 'bookings' && (
          <PlaceholderPanel
            title="Bookings workspace"
            description="This will replace the legacy booking tab with queues that match how Clean Slate actually runs."
            bullets={['Needs review queue', 'Unassigned queue', 'Confirmed visits', 'Completed visits', 'Cancellation/no-show review', 'Booking detail drawer']}
          />
        )}
        {tab === 'calendar' && (
          <PlaceholderPanel
            title="Operations calendar"
            description="This will replace the old mixed calendar with booking blocks, travel buffers, provider availability, consults, and admin holds."
            bullets={['Today schedule', 'Provider schedule overlay', 'Travel buffer blocks', 'Manual holds', 'Conflict warnings', 'Reschedule preview']}
          />
        )}
        {tab === 'households' && (
          <PlaceholderPanel
            title="Households"
            description="This replaces the client/guest split with one household record system."
            bullets={['Household profile', 'Visit history', 'Private flags', 'Service area status', 'Membership status', 'Provider-safe notes']}
          />
        )}
        {tab === 'providers' && (
          <PlaceholderPanel
            title="Providers"
            description="This replaces scattered provider tools with one provider readiness, schedule, and assignment workspace."
            bullets={['Compliance readiness', 'Service permissions', 'Availability', 'Assignment recommendations', 'Override log', 'Provider-safe visit list']}
          />
        )}
        {tab === 'payments' && (
          <PlaceholderPanel
            title="Payments"
            description="This will replace scattered payment views with deposits, invoice totals, checkout status, and policy-safe fee handling."
            bullets={['Deposit status', 'Final checkout', 'Invoice totals', 'Refund review', 'Reschedule fee review', 'Payment issue alerts']}
          />
        )}
        {tab === 'messages' && (
          <PlaceholderPanel
            title="Messages"
            description="This will centralize transactional emails, SMS history, reusable templates, and failed message review."
            bullets={['Message log', 'Booking templates', 'Follow-up templates', 'Provider alerts', 'Failed sends', 'Opt-in aware messages']}
          />
        )}
        {tab === 'settings' && (
          <PlaceholderPanel
            title="Settings"
            description="This will become the business rules and feature toggle area instead of hiding rules across code."
            bullets={['Booking rules', 'Service menu', 'Payment settings', 'Provider rules', 'Feature toggles', 'Launch checks']}
          />
        )}
      </div>
    </main>
  );
}
