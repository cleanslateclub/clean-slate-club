import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildSchedulePreview } from '@/lib/adminScheduleActions';

function PreviewTile({ label, value }) {
  return (
    <div className="rounded-xl bg-warm-white border border-taupe/15 p-3">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1">{value || 'Not set'}</p>
    </div>
  );
}

export default function SchedulePreviewPanel({ booking }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!booking?.id) return;
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.TimeBlock.list('-date', 300);
        if (!active) return;
        setBlocks(records || []);
      } catch (error) {
        console.error('Schedule preview failed:', error);
        if (active) setLoadError('Could not load schedule blocks from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [booking?.id]);

  const preview = useMemo(() => buildSchedulePreview({ booking, existingBlocks: blocks }), [booking, blocks]);

  if (!booking?.id) return null;

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Schedule preview</p>
          <p className="font-body text-xs text-charcoal/35 font-light mt-1">Preview-only. Schedule changes are not saved from this panel yet.</p>
        </div>
        {preview.conflicts.length > 0 ? <AlertTriangle className="w-5 h-5 text-coral" /> : <CalendarDays className="w-5 h-5 text-sage" />}
      </div>

      {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading schedule...</p>}
      {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {(preview.candidateBlocks || []).map((block, index) => (
          <div key={`${block.block_type}-${index}`} className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-coral/70" />
              <p className="font-heading text-base text-charcoal">{(block.block_type || 'block').replace(/_/g, ' ')}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <PreviewTile label="Date" value={block.date} />
              <PreviewTile label="Time" value={`${block.start_time || ''}${block.end_time ? ` - ${block.end_time}` : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {preview.conflicts.length > 0 && (
        <div className="rounded-2xl bg-warm-white border border-coral/20 p-4 mt-4">
          <p className="font-body text-xs uppercase tracking-widest text-coral/70">Conflicts found</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-1">This booking should be reviewed before schedule blocks are created.</p>
        </div>
      )}
    </div>
  );
}
