import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, MapPin, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BLOCK_TYPES = [
  { key: 'all', label: 'All Blocks' },
  { key: 'booking', label: 'Visits' },
  { key: 'travel', label: 'Travel' },
  { key: 'consult', label: 'Consults' },
  { key: 'admin_hold', label: 'Holds' },
];

const todayKey = () => new Date().toISOString().split('T')[0];

const getFilteredBlocks = (blocks = [], type = 'all') => {
  if (type === 'all') return blocks;
  return blocks.filter(block => block.block_type === type);
};

function TypeButton({ item, active, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition-all ${active ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <CalendarDays className={`w-4 h-4 ${active ? 'text-coral' : 'text-charcoal/35'}`} />
        <span className="font-heading text-2xl text-charcoal">{count}</span>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35 mt-3">{item.label}</p>
    </button>
  );
}

function BlockCard({ block, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(block)}
      className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{block.label || block.title || 'Calendar block'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{block.date || 'No date'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(block.block_type || 'block').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal/55 font-light mt-3">
        {block.start_time || 'No start'}{block.end_time ? ` - ${block.end_time}` : ''}
      </p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-2">
        {block.provider_name || block.provider_email || 'No provider'}
      </p>
    </button>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
    </div>
  );
}

function BlockDetailPanel({ block }) {
  if (!block) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <CalendarDays className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a calendar block</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a block to review time, type, provider, and notes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Calendar detail</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{block.label || block.title || 'Calendar block'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{block.date || 'No date'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Type" value={(block.block_type || 'block').replace(/_/g, ' ')} />
        <DetailTile label="Status" value={(block.status || 'active').replace(/_/g, ' ')} />
        <DetailTile label="Start" value={block.start_time} />
        <DetailTile label="End" value={block.end_time} />
        <DetailTile label="Provider" value={block.provider_name || block.provider_email} />
        <DetailTile label="Travel minutes" value={block.travel_minutes} />
      </div>

      <DetailTile label="Location" value={block.location_address} />
      <DetailTile label="Reason" value={block.change_reason} />
    </div>
  );
}

export default function CalendarWorkspace() {
  const [blocks, setBlocks] = useState([]);
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.TimeBlock.list('-date', 300);
        if (!active) return;
        setBlocks(records || []);
      } catch (error) {
        console.error('Calendar workspace load failed:', error);
        if (active) setLoadError('Could not load calendar records from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const upcoming = useMemo(() => blocks.filter(block => !block.date || block.date >= todayKey()), [blocks]);
  const counts = useMemo(() => Object.fromEntries(BLOCK_TYPES.map(item => [item.key, getFilteredBlocks(upcoming, item.key).length])), [upcoming]);

  const filteredBlocks = useMemo(() => {
    const pool = getFilteredBlocks(upcoming, type);
    const q = search.trim().toLowerCase();
    const searched = q ? pool.filter(block => [
      block.label,
      block.title,
      block.date,
      block.start_time,
      block.end_time,
      block.block_type,
      block.provider_name,
      block.provider_email,
      block.location_address,
    ].some(value => String(value || '').toLowerCase().includes(q))) : pool;

    return searched.sort((a, b) => `${a.date || ''} ${a.start_time || ''}`.localeCompare(`${b.date || ''} ${b.start_time || ''}`));
  }, [upcoming, type, search]);

  const selectedBlock = selected ? blocks.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Calendar workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Operations calendar</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Read-only view of upcoming schedule blocks while scheduling actions are still being verified.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading calendar...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {BLOCK_TYPES.map(item => (
          <TypeButton key={item.key} item={item} active={type === item.key} count={counts[item.key] || 0} onClick={() => { setType(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search calendar..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredBlocks.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <Clock className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/40 font-light">No calendar blocks in this view.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBlocks.map(block => (
                <BlockCard key={block.id} block={block} selected={selected?.id === block.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <BlockDetailPanel block={selectedBlock} />
        </div>
      </div>
    </div>
  );
}
