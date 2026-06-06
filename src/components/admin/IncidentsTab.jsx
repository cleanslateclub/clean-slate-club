import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const SEVERITY_COLORS = {
  low: 'bg-sage/20 border-sage/30 text-charcoal/60',
  medium: 'bg-butter/30 border-butter/40 text-charcoal/60',
  high: 'bg-coral/10 border-coral/20 text-coral',
  critical: 'bg-red-100 border-red-200 text-red-600',
};

const STATUS_COLORS = {
  open: 'bg-coral/10 border-coral/20 text-coral',
  under_review: 'bg-butter/30 border-butter/40 text-charcoal/60',
  resolved: 'bg-sage/20 border-sage/30 text-charcoal/50',
  escalated: 'bg-red-100 border-red-200 text-red-600',
};

export default function IncidentsTab() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    base44.entities.Incident.list('-created_date').then(i => { setIncidents(i || []); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const updates = { status };
    if (resolutionNote) updates.resolution_notes = resolutionNote;
    await base44.entities.Incident.update(id, updates);
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    setSelected(null);
    setResolutionNote('');
  };

  const open = incidents.filter(i => i.status === 'open');
  const others = incidents.filter(i => i.status !== 'open');

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;

  return (
    <div>
      {open.length > 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-coral/5 border border-coral/15 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-coral shrink-0" />
          <p className="font-body text-sm text-coral font-light"><strong>{open.length}</strong> open incident{open.length !== 1 ? 's' : ''} require attention.</p>
        </div>
      )}

      <div className="space-y-3">
        {incidents.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 className="w-10 h-10 text-sage/40 mx-auto mb-3" />
            <p className="font-body text-sm text-charcoal/30 font-light">No incidents on record.</p>
          </div>
        )}
        {incidents.map(inc => (
          <div key={inc.id} className="bg-warm-white rounded-2xl border border-taupe/15 overflow-hidden">
            <button onClick={() => setSelected(selected === inc.id ? null : inc.id)} className="w-full flex items-start gap-4 p-4 text-left hover:bg-cream/50 transition-colors">
              <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${inc.severity === 'critical' || inc.severity === 'high' ? 'text-coral' : 'text-charcoal/30'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-charcoal font-light">{inc.client_name} · {inc.incident_type?.replace(/_/g, ' ')}</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-0.5 truncate">{inc.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${SEVERITY_COLORS[inc.severity]}`}>{inc.severity}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${STATUS_COLORS[inc.status]}`}>{inc.status?.replace('_', ' ')}</span>
              </div>
            </button>

            {selected === inc.id && (
              <div className="border-t border-taupe/10 p-4 space-y-3">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Full Report</p>
                  <p className="font-body text-sm text-charcoal/70 font-light leading-relaxed">{inc.description}</p>
                </div>
                {inc.photo_urls?.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Photos</p>
                    <div className="flex gap-2 flex-wrap">
                      {inc.photo_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-taupe/15" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {inc.resolution_notes && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Resolution Notes</p>
                    <p className="font-body text-sm text-charcoal/60 font-light">{inc.resolution_notes}</p>
                  </div>
                )}
                {inc.status !== 'resolved' && (
                  <div className="space-y-2">
                    <textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} placeholder="Add resolution notes..."
                      rows={2} className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(inc.id, 'under_review')} className="flex-1 py-2 rounded-full border border-butter/40 bg-butter/20 text-xs font-body font-light text-charcoal/60 hover:bg-butter/30 transition-colors">Mark Under Review</button>
                      <button onClick={() => updateStatus(inc.id, 'resolved')} className="flex-1 py-2 rounded-full bg-sage text-white text-xs font-body font-light hover:bg-sage/90 transition-colors">Mark Resolved</button>
                      <button onClick={() => updateStatus(inc.id, 'escalated')} className="flex-1 py-2 rounded-full border border-coral/30 bg-coral/5 text-xs font-body font-light text-coral hover:bg-coral/10 transition-colors">Escalate</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}