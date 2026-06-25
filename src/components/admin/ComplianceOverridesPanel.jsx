import React, { useState } from 'react';
import { AlertTriangle, Ban, Clock, ShieldAlert } from 'lucide-react';
import {
  createComplianceOverride,
  getActiveComplianceOverrides,
  getComplianceOverrides,
  revokeComplianceOverride,
  serializeComplianceOverrides,
} from '@/lib/complianceOverrideUtils';

export default function ComplianceOverridesPanel({ provider, checklist = [], onChange }) {
  const [requirementKey, setRequirementKey] = useState('');
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [confirm, setConfirm] = useState(false);

  const allOverrides = getComplianceOverrides(provider);
  const activeOverrides = getActiveComplianceOverrides(provider);
  const missingRequirements = checklist.filter(item => !item.complete);

  const createOverride = () => {
    const requirement = checklist.find(item => item.key === requirementKey);
    if (!requirement || !reason.trim() || !expiresAt || !confirm) return;

    const override = createComplianceOverride({
      requirementKey: requirement.key,
      requirementLabel: requirement.label,
      reason: reason.trim(),
      expiresAt,
      providerId: provider.id,
      providerName: provider.full_name,
    });

    onChange({
      compliance_overrides: serializeComplianceOverrides([...allOverrides, override]),
    });

    setRequirementKey('');
    setReason('');
    setExpiresAt('');
    setConfirm(false);
  };

  const revokeOverride = (overrideId) => {
    const next = revokeComplianceOverride(provider, overrideId);
    onChange({ compliance_overrides: serializeComplianceOverrides(next) });
  };

  return (
    <div className="bg-warm-white rounded-3xl border border-coral/20 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-charcoal">Admin override</p>
          <p className="font-body text-xs text-charcoal/45 font-light leading-relaxed mt-1">
            Use only when admin intentionally allows a provider to continue despite a missing or pending requirement. A reason and expiration date are required.
          </p>
        </div>
      </div>

      {activeOverrides.length > 0 && (
        <div className="mb-4 rounded-2xl bg-coral/5 border border-coral/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-coral" />
            <p className="font-heading text-sm font-semibold text-charcoal">Active override warning</p>
          </div>
          <div className="space-y-2">
            {activeOverrides.map(override => (
              <div key={override.id} className="rounded-xl bg-warm-white border border-coral/10 px-3 py-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs text-charcoal font-light">{override.requirement_label}</p>
                  <p className="font-body text-[11px] text-charcoal/40 font-light mt-0.5">Reason: {override.reason}</p>
                  <p className="font-body text-[11px] text-charcoal/40 font-light">Expires: {override.expires_at}</p>
                </div>
                <button type="button" onClick={() => revokeOverride(override.id)} className="flex items-center gap-1 px-2 py-1 rounded-full border border-taupe/20 text-[10px] font-body text-charcoal/45 hover:border-coral/30">
                  <Ban className="w-3 h-3" /> Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Requirement</span>
          <select
            value={requirementKey}
            onChange={e => setRequirementKey(e.target.value)}
            className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
          >
            <option value="">Choose missing item...</option>
            {missingRequirements.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>
        <label>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Expires</span>
          <div className="relative">
            <Clock className="w-4 h-4 text-charcoal/25 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              className="w-full rounded-2xl border border-taupe/15 bg-cream pl-10 pr-4 py-3 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
            />
          </div>
        </label>
        <label>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Reason</span>
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Required internal reason"
            className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 placeholder-charcoal/25 focus:outline-none focus:border-coral/30"
          />
        </label>
      </div>

      <label className="flex items-start gap-3 mt-4 cursor-pointer">
        <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} className="mt-1" />
        <span className="font-body text-xs text-charcoal/45 font-light leading-relaxed">
          I understand this override bypasses a normal readiness requirement and should be used intentionally.
        </span>
      </label>

      <button
        type="button"
        onClick={createOverride}
        disabled={!requirementKey || !reason.trim() || !expiresAt || !confirm}
        className="mt-4 w-full rounded-full bg-charcoal text-white py-3 font-body text-xs tracking-wide disabled:opacity-40 hover:bg-charcoal/90 transition-colors"
      >
        Create admin override
      </button>
    </div>
  );
}
