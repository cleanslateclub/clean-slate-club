import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Lock, ShieldCheck } from 'lucide-react';
import { PROVIDER_DOCUMENT_REQUIREMENTS, PROVIDER_SERVICE_PERMISSIONS, PROVIDER_STATUSES } from '@/lib/backendOSConfig';

const LEGACY_FIELD_MAP = {
  background_check: 'background_check_cleared',
  drivers_license: 'drivers_license_on_file',
  auto_insurance: 'vehicle_insurance_on_file',
  cpr_certification: 'cpr_certification_on_file',
  w9: 'w9_on_file',
  contractor_agreement: 'contractor_agreement_signed',
  child_abuse_clearance: 'child_abuse_clearance_on_file',
  food_handling: 'food_handling_on_file',
  confidentiality_agreement: 'confidentiality_agreement_signed',
  scope_policy: 'scope_policy_signed',
  transportation_policy: 'transportation_policy_signed',
  child_safety_policy: 'child_safety_policy_signed',
  no_medical_care_policy: 'no_medical_care_policy_signed',
};

const getRequirementGroupsForProvider = (provider = {}) => {
  const serviceKeys = provider.services || provider.service_permissions || [];
  const groups = ['base'];
  if (serviceKeys.includes('meal_prep')) groups.push('meal_prep');
  if (serviceKeys.includes('transportation') || serviceKeys.includes('errands') || serviceKeys.includes('family_support')) groups.push('transportation');
  if (serviceKeys.includes('family_support')) groups.push('family_support');
  if (serviceKeys.includes('senior_support')) groups.push('senior_support');
  return [...new Set(groups)];
};

export const getProviderComplianceChecklist = (provider = {}) => {
  const groups = getRequirementGroupsForProvider(provider);
  const requirements = groups.flatMap(group => PROVIDER_DOCUMENT_REQUIREMENTS[group] || []);
  const unique = [];
  const seen = new Set();

  requirements.forEach(req => {
    if (!seen.has(req.key)) {
      seen.add(req.key);
      const legacyField = LEGACY_FIELD_MAP[req.key];
      unique.push({
        ...req,
        complete: Boolean(provider[legacyField] || provider[`doc_${req.key}_complete`] || provider[req.key]),
        legacyField,
      });
    }
  });

  return unique;
};

function RequirementRow({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-taupe/10 bg-cream px-4 py-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.complete ? 'bg-sage/20 text-sage' : 'bg-butter/20 text-charcoal/45'}`}>
        {item.complete ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-body text-sm text-charcoal font-light">{item.label}</p>
          {item.sensitive && <Lock className="w-3 h-3 text-charcoal/30" />}
          {item.expires && <span className="px-2 py-0.5 rounded-full bg-warm-white border border-taupe/10 text-[10px] font-body text-charcoal/35">expires</span>}
          {item.required && <span className="px-2 py-0.5 rounded-full bg-coral/10 text-[10px] font-body text-coral">required</span>}
        </div>
        <p className="font-body text-xs text-charcoal/40 font-light mt-1 leading-relaxed">{item.helper}</p>
      </div>
      <span className={`text-[10px] font-body rounded-full px-2 py-1 ${item.complete ? 'bg-sage/10 text-sage' : 'bg-warm-white text-charcoal/35 border border-taupe/10'}`}>
        {item.complete ? 'done' : 'needed'}
      </span>
    </div>
  );
}

export default function ProviderComplianceOS({ provider }) {
  const checklist = useMemo(() => getProviderComplianceChecklist(provider), [provider]);
  const completeCount = checklist.filter(item => item.complete).length;
  const totalCount = checklist.length;
  const status = PROVIDER_STATUSES.find(item => item.key === provider?.status) || PROVIDER_STATUSES.find(item => item.key === 'draft');
  const serviceLabels = (provider?.services || provider?.service_permissions || [])
    .map(key => PROVIDER_SERVICE_PERMISSIONS.find(item => item.key === key)?.label || key)
    .filter(Boolean);

  const canAssign = status?.canBeAssigned && completeCount === totalCount;

  return (
    <div className="border-t border-taupe/10 pt-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-heading text-sm font-semibold text-charcoal">Provider Compliance OS</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1 leading-relaxed">
            Requirements adjust based on the provider's approved service permissions. Sensitive docs are admin-only.
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-body border ${canAssign ? 'bg-sage/10 border-sage/30 text-sage' : 'bg-butter/10 border-butter/30 text-charcoal/55'}`}>
          {completeCount}/{totalCount} ready
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-2xl bg-cream border border-taupe/10 p-3">
          <ShieldCheck className="w-4 h-4 text-coral mb-2" />
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Status</p>
          <p className="font-body text-xs text-charcoal/60 mt-1">{status?.label || 'Draft'}</p>
        </div>
        <div className="rounded-2xl bg-cream border border-taupe/10 p-3">
          <CheckCircle2 className="w-4 h-4 text-coral mb-2" />
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Assignable</p>
          <p className="font-body text-xs text-charcoal/60 mt-1">{canAssign ? 'Yes' : 'Not yet'}</p>
        </div>
        <div className="rounded-2xl bg-cream border border-taupe/10 p-3">
          <AlertTriangle className="w-4 h-4 text-coral mb-2" />
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Missing</p>
          <p className="font-body text-xs text-charcoal/60 mt-1">{Math.max(totalCount - completeCount, 0)} item(s)</p>
        </div>
      </div>

      {serviceLabels.length > 0 && (
        <div className="mb-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-2">Approved services</p>
          <div className="flex flex-wrap gap-2">
            {serviceLabels.map(label => (
              <span key={label} className="px-3 py-1 rounded-full bg-warm-white border border-taupe/10 text-xs font-body font-light text-charcoal/50">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {checklist.map(item => <RequirementRow key={item.key} item={item} />)}
      </div>
    </div>
  );
}
