import React, { useState, useEffect } from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { base44 } from '@/api/base44Client';
import OutOfAreaModal from '@/components/booking/OutOfAreaModal';

const HELP_ME_CHOOSE = "Help Me Choose - I'm Overwhelmed";

const sortTaskOptions = (options = []) => {
  const safeOptions = Array.isArray(options) ? options : [];
  const helpOption = safeOptions.find(option => option === HELP_ME_CHOOSE);
  const sortedOptions = safeOptions
    .filter(option => option !== HELP_ME_CHOOSE)
    .sort((a, b) => a.localeCompare(b));

  return helpOption ? [helpOption, ...sortedOptions] : sortedOptions;
};

const requiredMark = <span className="text-coral ml-0.5" aria-label="required">*</span>;

const buildServiceAddress = (info = {}) => {
  const street = info.service_street?.trim();
  const unit = info.service_unit?.trim();
  const city = info.service_city?.trim();
  const state = (info.service_state || 'PA').trim();
  const zip = info.service_zip?.trim();

  return [street, unit, [city, state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
};

export default function Step2Intake({ serviceKey, answers, onChange, clientInfo, onClientChange, onPhotoUpload, uploadedPhotos = [], smsOptIn, onSmsOptInChange, serviceConfig }) {
  const services = serviceConfig || SERVICE_CONFIG;
  const [uploading, setUploading] = useState(false);
  const [territories, setTerritories] = useState([]);
  const [outOfArea, setOutOfArea] = useState(false);
  const [outOfAreaCity, setOutOfAreaCity] = useState('');

  useEffect(() => {
    base44.entities.Territory.filter({ is_active: true }).then(t => setTerritories(t || []));
  }, []);

  const checkServiceArea = (info) => {
    const city = info?.service_city?.trim();
    if (!city || territories.length === 0) return;

    const cityLower = city.toLowerCase();
    const addressLower = buildServiceAddress(info).toLowerCase();
    const match = territories.some(t => {
      const territoryName = t.name.toLowerCase();
      return cityLower === territoryName || addressLower.includes(territoryName);
    });

    if (!match) {
      setOutOfAreaCity(city);
      setOutOfArea(true);
    } else {
      setOutOfArea(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map(file => base44.integrations.Core.UploadFile({ file }).then(r => r.file_url))
      );
      onPhotoUpload([...uploadedPhotos, ...urls]);
    } finally {
      setUploading(false);
    }
  };

  const config = services[serviceKey];
  if (!config) return null;

  const isConsult = serviceKey === 'consult';
  const isErrands = serviceKey === 'errands';
  const needsEmergencyContact = serviceKey === 'senior_support' || serviceKey === 'mothers_helper';
  const sortedTaskOptions = sortTaskOptions(config.taskOptions);

  const handleAnswer = (id, value) => onChange({ ...answers, [id]: value });

  const handleEmergencyChange = (field, value) => {
    const updated = { ...answers, [field]: value };
    const first = field === 'emergency_first_name' ? value : answers.emergency_first_name;
    const last = field === 'emergency_last_name' ? value : answers.emergency_last_name;
    const phone = field === 'emergency_phone' ? value : answers.emergency_phone;
    updated.emergency_contact = [first, last].filter(Boolean).join(' ') + (phone ? ` - ${phone}` : '');
    onChange(updated);
  };

  const handleClientField = (field, value) => {
    const updated = { ...clientInfo, [field]: value };
    if (!isConsult && ['service_street', 'service_unit', 'service_city', 'service_state', 'service_zip'].includes(field)) {
      updated.address = buildServiceAddress(updated);
    }
    onClientChange(updated);
  };

  const toggleMulti = (id, option) => {
    const current = answers[id] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleAnswer(id, updated);
  };

  const toggleTask = (task) => {
    const current = (answers || {})._tasks || [];
    const updated = current.includes(task)
      ? current.filter(t => t !== task)
      : [...current, task];
    handleAnswer('_tasks', updated);
  };

  const selectedTasks = (answers || {})._tasks || [];
  const intakeQuestions = (config.intakeQuestions || []).filter(q => q.id !== 'emergency_contact');

  return (
    <div>
      {outOfArea && (
        <OutOfAreaModal
          city={outOfAreaCity}
          serviceKey={serviceKey}
          onClose={() => setOutOfArea(false)}
        />
      )}
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">
        {isConsult ? 'Tell us a little about you' : 'Tell us about your visit'}
      </h2>
      <p className="font-body text-sm text-charcoal font-light mb-2">
        {isConsult
          ? 'The more you share, the better we can prepare for our call. Zero judgment.'
          : 'The more detail you share, the better we can prepare. Zero judgment, always.'}
      </p>
      <p className="font-body text-xs text-charcoal/50 font-light mb-8">
        Fields marked with <span className="text-coral">*</span> are required.
      </p>

      {/* Client Info */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #DFE3A2' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#DFE3A2' }} />
          <h3 className="font-heading text-sm font-semibold text-charcoal">Your Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Your name', required: true, type: 'text' },
            { key: 'email', label: 'Email', placeholder: 'your@email.com', required: true, type: 'email' },
            { key: 'phone', label: 'Phone', placeholder: '(555) 555-5555', required: true, type: 'tel' },
          ].map(f => (
            <div key={f.key}>
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">
                {f.label}{f.required && requiredMark}
              </label>
              <input
                type={f.type}
                value={clientInfo[f.key] || ''}
                onChange={e => handleClientField(f.key, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #8B93A7' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#8B93A7' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">Service Address</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light mb-4">
            This is the home base for the visit. It must be inside the current service area.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-4">
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">Street Address{requiredMark}</label>
              <input type="text" value={clientInfo.service_street || ''} onChange={e => handleClientField('service_street', e.target.value)} placeholder="123 Example Lane" className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">Apt / Unit</label>
              <input type="text" value={clientInfo.service_unit || ''} onChange={e => handleClientField('service_unit', e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors" />
            </div>
            <div className="sm:col-span-3">
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">City{requiredMark}</label>
              <input type="text" value={clientInfo.service_city || ''} onChange={e => handleClientField('service_city', e.target.value)} onBlur={() => checkServiceArea({ ...clientInfo, address: buildServiceAddress(clientInfo) })} placeholder="Flourtown" className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors" />
            </div>
            <div className="sm:col-span-1">
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">State{requiredMark}</label>
              <input type="text" value={clientInfo.service_state || 'PA'} onChange={e => handleClientField('service_state', e.target.value)} maxLength={2} className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors uppercase" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">ZIP Code{requiredMark}</label>
              <input type="text" value={clientInfo.service_zip || ''} onChange={e => handleClientField('service_zip', e.target.value)} placeholder="19031" inputMode="numeric" className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors" />
            </div>
          </div>
        </div>
      )}

      {/* Task checkboxes */}
      {sortedTaskOptions.length > 0 && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #CAE7B9' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#CAE7B9' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">What areas need support?</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light mb-4">Select all that apply — this helps us estimate your visit time and pricing.</p>
          <div className="flex flex-wrap gap-2">
            {sortedTaskOptions.map(task => {
              const isSelected = selectedTasks.includes(task);
              return (
                <button
                  key={task}
                  type="button"
                  onClick={() => toggleTask(task)}
                  className={`px-3.5 py-2 rounded-full border text-xs font-body font-light transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected ? 'bg-coral/10 border-coral/40 text-charcoal' : 'bg-cream border-taupe/15 text-charcoal/60 hover:border-coral/25'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-coral border-coral' : 'border-taupe/30'}`}>
                    {isSelected && <span className="text-white text-[7px]">✓</span>}
                  </span>
                  {task}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency contact */}
      {needsEmergencyContact && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EB9486' }}>
          <h3 className="font-heading text-sm font-semibold text-charcoal mb-1">Emergency Contact{requiredMark}</h3>
          <p className="font-body text-xs text-charcoal font-light mb-4">Required for child/family or elder companion support.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={answers.emergency_first_name || ''} onChange={e => handleEmergencyChange('emergency_first_name', e.target.value)} placeholder="First name" className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40" />
            <input type="text" value={answers.emergency_last_name || ''} onChange={e => handleEmergencyChange('emergency_last_name', e.target.value)} placeholder="Last name" className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40" />
            <input type="tel" value={answers.emergency_phone || ''} onChange={e => handleEmergencyChange('emergency_phone', e.target.value)} placeholder="Phone" className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40" />
          </div>
        </div>
      )}

      {/* Intake questions */}
      {intakeQuestions.length > 0 && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EFB988' }}>
          <h3 className="font-heading text-sm font-semibold text-charcoal mb-4">Helpful details</h3>
          <div className="space-y-4">
            {intakeQuestions.map(q => (
              <div key={q.id}>
                <label className="font-body text-xs font-light text-charcoal block mb-1.5">{q.label}</label>
                {q.type === 'select' ? (
                  <select value={answers[q.id] || ''} onChange={e => handleAnswer(q.id, e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-charcoal/40">
                    <option value="">Choose...</option>
                    {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : q.type === 'multiselect' ? (
                  <div className="flex flex-wrap gap-2">
                    {(q.options || []).map(opt => {
                      const selected = (answers[q.id] || []).includes(opt);
                      return (
                        <button key={opt} type="button" onClick={() => toggleMulti(q.id, opt)} className={`px-3 py-1.5 rounded-full border text-xs font-body font-light ${selected ? 'bg-coral/10 border-coral/40' : 'bg-cream border-taupe/15'}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea value={answers[q.id] || ''} onChange={e => handleAnswer(q.id, e.target.value)} placeholder={q.placeholder || ''} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #B58A90' }}>
          <h3 className="font-heading text-sm font-semibold text-charcoal mb-2">Photos</h3>
          <p className="font-body text-xs text-charcoal font-light mb-4">Optional, but very helpful for estimating and prep.</p>
          <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="font-body text-xs text-charcoal/60" />
          {uploading && <p className="font-body text-xs text-coral mt-2">Uploading...</p>}
          {uploadedPhotos.length > 0 && <p className="font-body text-xs text-sage mt-2">{uploadedPhotos.length} photo(s) uploaded</p>}
        </div>
      )}

      <div className="bg-cream rounded-2xl border border-taupe/15 p-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-sm font-semibold text-charcoal">Text updates</p>
          <p className="font-body text-xs text-charcoal/50 font-light mt-1">Get booking confirmations, reminders, and schedule updates by SMS.</p>
        </div>
        <label className="flex items-center gap-2 font-body text-xs text-charcoal/50 font-light">
          <input type="checkbox" checked={smsOptIn} onChange={e => onSmsOptInChange?.(e.target.checked)} />
          Yes
        </label>
      </div>
    </div>
  );
}
