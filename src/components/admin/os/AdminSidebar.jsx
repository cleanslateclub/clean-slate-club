import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown,
  Calendar, CalendarDays, CalendarRange, CalendarCheck, Clock, AlertTriangle, Ban, Star,
  ClipboardList, Plus, Eye, CheckCircle, UserCheck, Loader, CheckSquare, XCircle, Archive,
  Sparkles, Package, ShoppingBag, FileText, Layout,
  Users, UserPlus, Heart, AlertCircle, StickyNote, Upload, History, MapPin, PawPrint, Key,
  Shield, User, Lock, Truck, Award, DollarSign, TrendingUp, MessageSquare, CreditCard,
  BarChart3, Settings, Zap, Mail, Globe, Bell, ToggleLeft, Database, FlaskConical, ShieldCheck,
  Tag, RefreshCw, Inbox
} from 'lucide-react';

const SIDEBAR_SECTIONS = {
  calendar: [
    {
      key: 'schedule', label: 'Schedule', icon: Calendar, items: [
        { key: 'today', label: 'Today', icon: CalendarCheck, section: 'schedule' },
        { key: 'day_view', label: 'Day View', icon: Calendar, section: 'schedule' },
        { key: 'week_view', label: 'Week View', icon: CalendarDays, section: 'schedule' },
        { key: 'month_view', label: 'Month View', icon: CalendarRange, section: 'schedule' },
        { key: 'unassigned', label: 'Unassigned Requests', icon: AlertTriangle, section: 'schedule' },
        { key: 'consults', label: 'Consults', icon: MessageSquare, section: 'schedule' },
        { key: 'provider_availability', label: 'Provider Availability', icon: UserCheck, section: 'schedule' },
        { key: 'blackout_dates', label: 'Blackout Dates', icon: Ban, section: 'schedule' },
        { key: 'premium_dates', label: 'Premium Dates', icon: Star, section: 'schedule' },
        { key: 'time_blocks', label: 'Time Blocks', icon: Clock, section: 'schedule' },
      ]
    },
    {
      key: 'bookings', label: 'Bookings', icon: ClipboardList, items: [
        { key: 'new_requests', label: 'New Requests', icon: Inbox, section: 'bookings', badge: 'new' },
        { key: 'needs_review', label: 'Needs Review', icon: AlertCircle, section: 'bookings', badge: 'warn' },
        { key: 'pending_deposit', label: 'Pending Deposit', icon: DollarSign, section: 'bookings' },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, section: 'bookings' },
        { key: 'assigned', label: 'Assigned', icon: UserCheck, section: 'bookings' },
        { key: 'in_progress', label: 'In Progress', icon: Loader, section: 'bookings' },
        { key: 'completed', label: 'Completed', icon: CheckSquare, section: 'bookings' },
        { key: 'cancelled', label: 'Cancelled', icon: XCircle, section: 'bookings' },
        { key: 'no_show', label: 'No Show', icon: AlertTriangle, section: 'bookings' },
        { key: 'archived_bookings', label: 'Archived', icon: Archive, section: 'bookings' },
      ]
    },
    {
      key: 'services', label: 'Services', icon: Sparkles, items: [
        { key: 'svc_hot_mess', label: 'Hot Mess Express', icon: Sparkles, section: 'services' },
        { key: 'svc_clean_plate', label: 'Clean Plate Club', icon: Sparkles, section: 'services' },
        { key: 'svc_chaos', label: 'Chaos Coordinator', icon: Sparkles, section: 'services' },
        { key: 'svc_checkin', label: 'The Check-In', icon: Sparkles, section: 'services' },
        { key: 'svc_runaround', label: 'The Runaround', icon: Sparkles, section: 'services' },
        { key: 'svc_room_service', label: 'Room Service', icon: Sparkles, section: 'services' },
        { key: 'svc_custom', label: 'Custom Requests', icon: Plus, section: 'services' },
      ]
    },
    {
      key: 'packages', label: 'Packages', icon: Package, items: [
        { key: 'pkg_initial', label: 'Initial Visit', icon: Package, section: 'packages' },
        { key: 'pkg_recurring', label: 'Recurring Visit', icon: RefreshCw, section: 'packages' },
        { key: 'pkg_member', label: 'Member Priority', icon: Heart, section: 'packages' },
        { key: 'pkg_custom', label: 'Custom Support', icon: Package, section: 'packages' },
        { key: 'pkg_quote', label: 'Manual Quote', icon: FileText, section: 'packages' },
        { key: 'pkg_seasonal', label: 'Seasonal Support', icon: Star, section: 'packages' },
      ]
    },
    {
      key: 'addons', label: 'Add-ons', icon: ShoppingBag, items: [
        { key: 'addon_grocery', label: 'Grocery Run', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_fridge', label: 'Fridge Refresh', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_pantry', label: 'Pantry Party', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_freezer', label: 'Freezer Meal Batch', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_lunch', label: 'School Lunch Prep', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_transport', label: 'Appointment Transport', icon: Truck, section: 'addons' },
        { key: 'addon_hour', label: 'Extra Hour', icon: Clock, section: 'addons' },
        { key: 'addon_two_provider', label: 'Two Provider Request', icon: Users, section: 'addons' },
        { key: 'addon_diet', label: 'Special Diet Prep', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_cleanup', label: 'Post-Prep Cleanup', icon: ShoppingBag, section: 'addons' },
        { key: 'addon_room_reset', label: 'Room Reset Add-on', icon: ShoppingBag, section: 'addons' },
      ]
    },
    {
      key: 'appt_templates', label: 'Appointment Templates', icon: Layout, items: [
        { key: 'appt_consult', label: 'Free Consult', icon: MessageSquare, section: 'appt_templates' },
        { key: 'appt_service', label: 'Service Visit', icon: CalendarCheck, section: 'appt_templates' },
        { key: 'appt_followup', label: 'Follow Up', icon: RefreshCw, section: 'appt_templates' },
        { key: 'appt_internal', label: 'Internal Request', icon: Lock, section: 'appt_templates' },
        { key: 'appt_member', label: 'Member Priority', icon: Heart, section: 'appt_templates' },
        { key: 'appt_recurring', label: 'Recurring Visit', icon: CalendarDays, section: 'appt_templates' },
        { key: 'appt_review', label: 'Manual Review Request', icon: AlertCircle, section: 'appt_templates' },
      ]
    },
  ],
  households: [
    {
      key: 'households', label: 'Households', icon: Users, items: [
        { key: 'all_households', label: 'All Households', icon: Users, section: 'households' },
        { key: 'new_leads', label: 'New Leads', icon: UserPlus, section: 'households' },
        { key: 'members', label: 'Members', icon: Heart, section: 'households' },
        { key: 'needs_review_hh', label: 'Needs Review', icon: AlertCircle, section: 'households' },
        { key: 'household_notes', label: 'Household Notes', icon: StickyNote, section: 'households' },
        { key: 'intake_forms', label: 'Intake Forms', icon: FileText, section: 'households' },
        { key: 'uploaded_photos', label: 'Uploaded Photos', icon: Upload, section: 'households' },
        { key: 'service_history', label: 'Service History', icon: History, section: 'households' },
        { key: 'addresses', label: 'Addresses', icon: MapPin, section: 'households' },
        { key: 'pets', label: 'Pets', icon: PawPrint, section: 'households' },
        { key: 'access_instructions', label: 'Access Instructions', icon: Key, section: 'households' },
      ]
    },
  ],
  checkout: [
    {
      key: 'payments', label: 'Payments', icon: DollarSign, items: [
        { key: 'deposits', label: 'Deposits', icon: DollarSign, section: 'payments' },
        { key: 'balances_due', label: 'Balances Due', icon: AlertTriangle, section: 'payments' },
        { key: 'invoices', label: 'Invoices', icon: FileText, section: 'payments' },
        { key: 'final_checkout', label: 'Final Checkout', icon: CreditCard, section: 'payments' },
        { key: 'refund_review', label: 'Refund Review', icon: RefreshCw, section: 'payments' },
        { key: 'payment_issues', label: 'Payment Issues', icon: AlertCircle, section: 'payments' },
        { key: 'payout_batches', label: 'Payout Batches', icon: DollarSign, section: 'payments' },
        { key: 'membership_billing', label: 'Membership Billing', icon: Heart, section: 'payments' },
      ]
    },
  ],
  marketing: [
    {
      key: 'marketing', label: 'Marketing', icon: Zap, items: [
        { key: 'lead_sources', label: 'Lead Sources', icon: Tag, section: 'marketing' },
        { key: 'reviews', label: 'Reviews', icon: Star, section: 'marketing' },
        { key: 'referrals', label: 'Referrals', icon: Users, section: 'marketing' },
        { key: 'campaigns', label: 'Campaigns', icon: Mail, section: 'marketing' },
        { key: 'msg_templates', label: 'Email/SMS Templates', icon: MessageSquare, section: 'marketing' },
        { key: 'waitlist', label: 'Waitlist', icon: ClipboardList, section: 'marketing' },
        { key: 'rebooking', label: 'Rebooking Prompts', icon: RefreshCw, section: 'marketing' },
      ]
    },
  ],
  reports: [
    {
      key: 'reports', label: 'Reports', icon: BarChart3, items: [
        { key: 'today_ops', label: "Today's Operations", icon: CalendarCheck, section: 'reports' },
        { key: 'revenue', label: 'Revenue', icon: DollarSign, section: 'reports' },
        { key: 'booking_report', label: 'Bookings', icon: ClipboardList, section: 'reports' },
        { key: 'provider_util', label: 'Provider Utilization', icon: UserCheck, section: 'reports' },
        { key: 'service_pop', label: 'Service Popularity', icon: TrendingUp, section: 'reports' },
        { key: 'memberships_report', label: 'Memberships', icon: Heart, section: 'reports' },
        { key: 'lead_sources_report', label: 'Lead Sources', icon: Tag, section: 'reports' },
        { key: 'payment_issues_report', label: 'Payment Issues', icon: AlertCircle, section: 'reports' },
        { key: 'ops_readiness', label: 'Operational Readiness', icon: ShieldCheck, section: 'reports' },
      ]
    },
  ],
  settings: [
    {
      key: 'settings', label: 'Settings', icon: Settings, items: [
        { key: 'business_profile', label: 'Business Profile', icon: Globe, section: 'settings' },
        { key: 'service_areas', label: 'Service Areas', icon: MapPin, section: 'settings' },
        { key: 'booking_rules', label: 'Booking Rules', icon: ClipboardList, section: 'settings' },
        { key: 'services_settings', label: 'Services', icon: Sparkles, section: 'settings' },
        { key: 'packages_settings', label: 'Packages', icon: Package, section: 'settings' },
        { key: 'addons_settings', label: 'Add-ons', icon: ShoppingBag, section: 'settings' },
        { key: 'appt_templates_settings', label: 'Appointment Templates', icon: Layout, section: 'settings' },
        { key: 'provider_rules', label: 'Provider Rules', icon: Shield, section: 'settings' },
        { key: 'pricing', label: 'Pricing', icon: DollarSign, section: 'settings' },
        { key: 'deposits_settings', label: 'Deposits', icon: CreditCard, section: 'settings' },
        { key: 'memberships_settings', label: 'Memberships', icon: Heart, section: 'settings' },
        { key: 'holidays', label: 'Holidays', icon: Star, section: 'settings' },
        { key: 'blackout_settings', label: 'Blackout Dates', icon: Ban, section: 'settings' },
        { key: 'premium_settings', label: 'Premium Dates', icon: Star, section: 'settings' },
        { key: 'cancellation_policy', label: 'Cancellation Policy', icon: XCircle, section: 'settings' },
        { key: 'reschedule_policy', label: 'Reschedule Policy', icon: RefreshCw, section: 'settings' },
        { key: 'noshow_policy', label: 'No-Show Policy', icon: AlertTriangle, section: 'settings' },
        { key: 'notifications_settings', label: 'Notifications', icon: Bell, section: 'settings' },
        { key: 'message_templates', label: 'Message Templates', icon: MessageSquare, section: 'settings' },
        { key: 'forms', label: 'Forms', icon: FileText, section: 'settings' },
        { key: 'feature_toggles', label: 'Feature Toggles', icon: ToggleLeft, section: 'settings' },
        { key: 'schema_check', label: 'Schema Check', icon: Database, section: 'settings' },
        { key: 'smoke_test', label: 'Smoke Test', icon: FlaskConical, section: 'settings' },
        { key: 'launch_guards', label: 'Launch Guards', icon: ShieldCheck, section: 'settings' },
      ]
    },
  ],
};

function SidebarGroup({ group, activeItem, onNavigate }) {
  const [open, setOpen] = useState(false);
  const Icon = group.icon;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
          <span className="font-body text-xs font-bold uppercase tracking-wider text-white/70 group-hover:text-white">{group.label}</span>
        </div>
        {open
          ? <ChevronDown className="w-3 h-3 text-white/25" />
          : <ChevronRight className="w-3 h-3 text-white/25" />}
      </button>

      {open && (
        <div className="mt-0.5 space-y-px">
          {group.items.map(item => {
            const ItemIcon = item.icon;
            const isActive = activeItem?.key === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-coral/20 text-coral border-l-2 border-coral pl-[10px]'
                    : 'text-white/75 hover:text-white hover:bg-white/8 border-l-2 border-transparent pl-[10px]'
                }`}
              >
                <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-coral' : 'text-white/50'}`} />
                <span className="font-body text-xs font-semibold truncate">{item.label}</span>
                {item.badge === 'new' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-coral shrink-0" />
                )}
                {item.badge === 'warn' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-butter shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({ topSection, activeItem, onNavigate }) {
  const groups = SIDEBAR_SECTIONS[topSection] || SIDEBAR_SECTIONS.calendar;

  return (
    <aside
      className="w-52 shrink-0 overflow-y-auto border-r border-white/8 flex flex-col"
      style={{ background: '#12121f' }}
    >
      <div className="p-3 space-y-1">
        {groups.map(group => (
          <SidebarGroup
            key={group.key}
            group={group}
            activeItem={activeItem}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </aside>
  );
}