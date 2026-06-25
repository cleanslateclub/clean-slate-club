import React, { useState, useEffect } from 'react';
import { Sparkles, Package, ShoppingBag, Layout, Plus, Edit2, Archive, Copy, ChevronRight, ToggleLeft, ToggleRight, Lock, DollarSign, Clock, CheckCircle } from 'lucide-react';

const SERVICES = [
  { key: 'hot_mess_express', label: 'Hot Mess Express', description: 'Full home reset for overwhelmed households', basePrice: '145–275', duration: '2–4 hrs', color: '#EB9486', category: 'home_reset', status: 'active' },
  { key: 'clean_plate_club', label: 'Clean Plate Club', description: 'Meal prep, kitchen organization, and food system support', basePrice: '125–250', duration: '2–4 hrs', color: '#CAE7B9', category: 'meal_prep', status: 'active' },
  { key: 'chaos_coordinator', label: 'Chaos Coordinator', description: 'Family logistics, scheduling, and errand management', basePrice: '95–180', duration: '2–3 hrs', color: '#F3DE8A', category: 'family_support', status: 'active' },
  { key: 'the_check_in', label: 'The Check-In', description: 'Light companion care, wellness check, and household presence', basePrice: '85–150', duration: '2–3 hrs', color: '#B58A90', category: 'senior_support', status: 'active' },
  { key: 'the_runaround', label: 'The Runaround', description: 'Errand running, pickups, returns, and local logistics', basePrice: '75–140', duration: '2–3 hrs', color: '#EFB988', category: 'errands', status: 'active' },
  { key: 'room_service', label: 'Room Service', description: 'Deep room organization, declutter, and room reset', basePrice: '125–225', duration: '2–4 hrs', color: '#8B93A7', category: 'organization', status: 'active' },
];

const PACKAGES = [
  { key: 'initial_visit', label: 'Initial Visit', description: 'First-time deep reset and intake', price: '200–350', status: 'active' },
  { key: 'recurring_visit', label: 'Recurring Visit', description: 'Scheduled return visit (weekly/biweekly)', price: '145–250', status: 'active' },
  { key: 'member_priority', label: 'Member Priority Booking', description: 'Priority scheduling for active members', price: 'Member rate', status: 'active' },
  { key: 'custom_support', label: 'Custom Support', description: 'Admin-quoted custom package', price: 'Quoted', status: 'active' },
  { key: 'manual_quote', label: 'Manual Quote', description: 'Admin-created manual quote', price: 'Variable', status: 'active' },
  { key: 'seasonal_support', label: 'Seasonal Support', description: 'Holiday/seasonal priority packages', price: 'Quoted', status: 'active' },
];

const ADDONS = [
  { key: 'grocery_run', label: 'Grocery Run', price: '+$0 (shopping funds)', time: '+30 min', status: 'active' },
  { key: 'fridge_refresh', label: 'Fridge Refresh', price: '+$35', time: '+30 min', status: 'active' },
  { key: 'pantry_party', label: 'Pantry Party', price: '+$45', time: '+45 min', status: 'active' },
  { key: 'freezer_meal_batch', label: 'Freezer Meal Batch', price: '+$55', time: '+60 min', status: 'active' },
  { key: 'school_lunch_prep', label: 'School Lunch Prep', price: '+$35', time: '+30 min', status: 'active' },
  { key: 'appointment_transport', label: 'Appointment Transport', price: 'Quoted', time: '+Varies', status: 'active' },
  { key: 'extra_hour', label: 'Extra Hour', price: '+$65', time: '+60 min', status: 'active' },
  { key: 'two_provider', label: 'Two Provider Request', price: '+$85', time: '+0 min', status: 'active' },
  { key: 'special_diet_prep', label: 'Special Diet Prep', price: '+$40', time: '+45 min', status: 'active' },
  { key: 'post_prep_cleanup', label: 'Post-Prep Kitchen Cleanup', price: '+$30', time: '+30 min', status: 'active' },
  { key: 'room_reset_addon', label: 'Room Reset Add-on', price: '+$45', time: '+30 min', status: 'active' },
];

const APPT_TEMPLATES = [
  { key: 'free_consult', label: 'Free Consult', type: 'consult', duration: '15 min', color: '#F3DE8A', online: true, status: 'active' },
  { key: 'service_visit', label: 'Service Visit', type: 'service', duration: '2–4 hrs', color: '#EB9486', online: true, status: 'active' },
  { key: 'follow_up', label: 'Follow Up', type: 'internal', duration: '15–30 min', color: '#CAE7B9', online: false, status: 'active' },
  { key: 'internal_request', label: 'Internal Request', type: 'internal', duration: 'Varies', color: '#8B93A7', online: false, status: 'active' },
  { key: 'member_priority', label: 'Member Priority Booking', type: 'service', duration: '2–4 hrs', color: '#B58A90', online: true, status: 'active' },
  { key: 'recurring_visit', label: 'Recurring Visit', type: 'service', duration: '2–4 hrs', color: '#EFB988', online: true, status: 'active' },
  { key: 'manual_review', label: 'Manual Review Request', type: 'review', duration: 'Varies', color: '#97A7B3', online: false, status: 'active' },
];

function ServiceRow({ item, type, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-coral/5 border-coral/40' : 'bg-white border-taupe/15 hover:border-coral/25'}`}
    >
      {type === 'service' && (
        <div className="w-3 h-8 rounded-full shrink-0" style={{ background: item.color }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-body text-sm text-charcoal font-light truncate">{item.label}</p>
          <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase font-body ${item.status === 'active' ? 'bg-sage/15 border-sage/40 text-green-700' : 'bg-taupe/10 border-taupe/30 text-charcoal/40'}`}>
            {item.status}
          </span>
        </div>
        <p className="font-body text-xs text-charcoal/40 font-light truncate mt-0.5">{item.description || item.price || item.time}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-charcoal/20 shrink-0" />
    </div>
  );
}

function ServiceDetail({ item, type, onClose }) {
  const [active, setActive] = useState(item.status === 'active');

  return (
    <div className="bg-white border-l border-taupe/15 flex flex-col h-full">
      <div className="px-5 py-4 border-b border-taupe/10 bg-cream/50">
        <div className="flex items-center gap-3">
          {item.color && <div className="w-4 h-10 rounded-full" style={{ background: item.color }} />}
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-charcoal">{item.label}</h3>
            <p className="font-body text-xs text-charcoal/40 font-light capitalize">{type} · {item.category || item.type || item.key}</p>
          </div>
          <button
            onClick={() => setActive(a => !a)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${active ? 'bg-sage/15 text-green-700 border border-sage/40' : 'bg-taupe/10 text-charcoal/40 border border-taupe/20'}`}
          >
            {active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
            {active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {item.description && (
          <div className="bg-cream rounded-xl p-4 border border-taupe/10">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-2">Description</p>
            <p className="font-body text-sm text-charcoal/70 font-light">{item.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {item.basePrice && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Price Range</p>
              <p className="font-body text-sm text-charcoal font-semibold">${item.basePrice}</p>
            </div>
          )}
          {item.price && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Price</p>
              <p className="font-body text-sm text-charcoal font-semibold">{item.price}</p>
            </div>
          )}
          {item.duration && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Duration</p>
              <p className="font-body text-sm text-charcoal">{item.duration}</p>
            </div>
          )}
          {item.time && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Added Time</p>
              <p className="font-body text-sm text-charcoal">{item.time}</p>
            </div>
          )}
          {item.type && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Type</p>
              <p className="font-body text-sm text-charcoal capitalize">{item.type}</p>
            </div>
          )}
          {item.online !== undefined && (
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Online Booking</p>
              <p className="font-body text-sm text-charcoal">{item.online ? '✓ Enabled' : '✗ Admin Only'}</p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Actions</p>
          <button className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-taupe/15 text-xs font-body text-charcoal/60 hover:bg-cream transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit {type}
          </button>
          <button className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-taupe/15 text-xs font-body text-charcoal/60 hover:bg-cream transition-colors">
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </button>
          <button className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-taupe/15 text-xs font-body text-charcoal/40 hover:bg-cream transition-colors">
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
        </div>

        <div className="bg-butter/10 border border-butter/25 rounded-xl p-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-amber-700 mb-1">⚠ Editing Note</p>
          <p className="font-body text-xs text-charcoal/50 font-light">Changes to pricing, duration, or availability will update connected bookings, calendar estimates, and checkout.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminServicesOS({ sidebarItem }) {
  const [type, setType] = useState('services');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const key = sidebarItem?.section;
    if (key === 'services') setType('services');
    else if (key === 'packages') setType('packages');
    else if (key === 'addons') setType('addons');
    else if (key === 'appt_templates') setType('appt_templates');
  }, [sidebarItem]);

  const items = type === 'services' ? SERVICES : type === 'packages' ? PACKAGES : type === 'addons' ? ADDONS : APPT_TEMPLATES;
  const icons = { services: Sparkles, packages: Package, addons: ShoppingBag, appt_templates: Layout };
  const TopIcon = icons[type];

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-72 shrink-0 border-r border-taupe/15 flex flex-col bg-cream/30">
        <div className="p-3 border-b border-taupe/10 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TopIcon className="w-4 h-4 text-coral" />
              <h2 className="font-heading text-sm font-semibold text-charcoal capitalize">{type.replace(/_/g, ' ')}</h2>
            </div>
            <button className="flex items-center gap-1 bg-coral text-white px-2.5 py-1.5 rounded-lg text-xs font-body hover:bg-coral/90">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {[['services', 'Services', Sparkles], ['packages', 'Packages', Package], ['addons', 'Add-ons', ShoppingBag], ['appt_templates', 'Templates', Layout]].map(([k, label, Icon]) => (
              <button key={k} onClick={() => { setType(k); setSelected(null); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body transition-colors ${type === k ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}>
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {items.map(item => (
            <ServiceRow key={item.key} item={item} type={type.replace('s', '').replace('_templates', '_template')} onSelect={setSelected} isSelected={selected?.key === item.key} />
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div className="flex-1 overflow-hidden">
          <ServiceDetail item={selected} type={type.replace('s', '').replace('_templates', '_template')} onClose={() => setSelected(null)} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-charcoal/20">
          <div className="text-center">
            <TopIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-body text-sm font-light">Select an item to view and edit</p>
          </div>
        </div>
      )}
    </div>
  );
}