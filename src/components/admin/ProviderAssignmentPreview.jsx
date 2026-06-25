import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Search, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildProviderAssignmentPatch, canAssignProviderToBooking } from '@/lib/adminProviderAssignmentActions';
import { getAssignmentCandidates } from '@/lib/providerAssignmentRules';

function ProviderCandidateCard({ candidate, booking, onAssigned }) {
  const provider = candidate.provider || {};
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const canSave = candidate.canAssign && canAssignProviderToBooking({ booking, provider });

  const assignProvider = async () => {
    if (!canSave) return;
    setSaving(true);
    setMessage('');
    try {
      const patch = buildProviderAssignmentPatch({ booking, provider, actorName: 'Admin' });
      const updated = await base44.entities.Booking.update(booking.id, patch);
      onAssigned?.(updated || patch);
      setMessage('Provider assigned.');
    } catch (error) {
      console.error('Provider assignment failed:', error);
      setMessage('Provider could not be assigned. Check Base44 permissions and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{provider.full_name || provider.email || 'Provider'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{provider.email || 'No email shown'}</p>
        </div>
        <span className={`px-2 py-1 rounded-full border text-[10px] font-body ${candidate.canAssign ? 'bg-sage/10 border-sage/20 text-charcoal/60' : 'bg-cream border-taupe/10 text-charcoal/35'}`}>
          {candidate.canAssign ? 'recommended' : 'review'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-xl bg-cream border border-taupe/10 p-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Score</p>
          <p className="font-heading text-xl text-charcoal mt-1">{candidate.score ?? 0}</p>
        </div>
        <div className="rounded-xl bg-cream border border-taupe/10 p-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Availability</p>
          <p className="font-body text-sm text-charcoal/55 font-light mt-1">{candidate.hasDayAvailability ? 'Day match' : 'Needs review'}</p>
        </div>
      </div>
      <p className="font-body text-xs text-charcoal/35 font-light mt-3">
        {(candidate.reasons || []).map(reason => String(reason).replace(/_/g, ' ')).join(', ') || 'No reason shown'}
      </p>
      <button
        type="button"
        disabled={!canSave || saving}
        onClick={assignProvider}
        className="mt-4 w-full rounded-full bg-coral px-4 py-2 text-xs font-body text-white disabled:opacity-40 hover:bg-coral/90 transition-colors"
      >
        {saving ? 'Assigning...' : 'Assign this provider'}
      </button>
      {message && <p className="font-body text-xs text-charcoal/45 font-light mt-2">{message}</p>}
    </div>
  );
}

export default function ProviderAssignmentPreview({ booking, onAssigned }) {
  const [providers, setProviders] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!booking?.id) return;
      setLoading(true);
      setLoadError('');
      try {
        const [providerRecords, availabilityRecords, blockRecords] = await Promise.all([
          base44.entities.Provider.list('-created_date', 300),
          base44.entities.ProviderAvailability.list('-created_date', 300),
          base44.entities.TimeBlock.list('-date', 300),
        ]);
        if (!active) return;
        setProviders(providerRecords || []);
        setAvailability(availabilityRecords || []);
        setBlocks(blockRecords || []);
      } catch (error) {
        console.error('Provider assignment preview failed:', error);
        if (active) setLoadError('Could not load assignment preview data from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [booking?.id]);

  const candidates = useMemo(() => {
    if (!booking?.id) return [];
    const q = search.trim().toLowerCase();
    const filteredProviders = q
      ? providers.filter(provider => [provider.full_name, provider.email, provider.status].some(value => String(value || '').toLowerCase().includes(q)))
      : providers;
    return getAssignmentCandidates({ providers: filteredProviders, booking, availability, existingBlocks: blocks });
  }, [providers, availability, blocks, booking, search]);

  if (!booking?.id) return null;

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Provider assignment</p>
          <p className="font-body text-xs text-charcoal/35 font-light mt-1">Admin-controlled assignment. No automatic assignment is enabled.</p>
        </div>
        {candidates.some(candidate => candidate.canAssign) && <CheckCircle2 className="w-5 h-5 text-sage" />}
      </div>

      <div className="rounded-2xl bg-warm-white border border-taupe/15 p-3 flex items-center gap-3 mt-4">
        <Search className="w-4 h-4 text-charcoal/30" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search providers..." className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25" />
      </div>

      {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading provider options...</p>}
      {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}

      {!loading && candidates.length === 0 ? (
        <div className="rounded-2xl bg-warm-white border border-taupe/15 p-5 text-center mt-4">
          <UserPlus className="w-5 h-5 text-sage mx-auto mb-2" />
          <p className="font-body text-sm text-charcoal/40 font-light">No provider candidates shown.</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {candidates.slice(0, 6).map(candidate => (
            <ProviderCandidateCard key={candidate.provider?.id || candidate.provider?.email || candidate.score} candidate={candidate} booking={booking} onAssigned={onAssigned} />
          ))}
        </div>
      )}
    </div>
  );
}
