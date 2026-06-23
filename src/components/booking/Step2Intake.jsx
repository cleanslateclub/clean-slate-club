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

export default function Step2Intake({ serviceKey, answers, onChange, clientInfo, onClientChange, onPhotoUpload, uploadedPhotos = [], smsOptIn, onSmsOptInChange }) {
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

  const config = SERVICE_CONFIG[serviceKey];
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
  const intakeQuestions = config.intakeQuestions.filter(q => q.id !== 'emergency_contact');

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
                    isSelected
                      ? 'text-white'
                      : 'bg-cream border-taupe/20 hover:border-charcoal/30'
                  }`}
                  style={isSelected ? { background: '#333333', borderColor: '#333333' } : { color: '#333333' }}
                >
                  <span className={`w-3 h-3 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-white border-white' : 'border-charcoal/25'
                  }`}>
                    {isSelected && <span className="text-charcoal text-[8px] font-bold leading-none">✓</span>}
                  </span>
                  {task}
                </button>
              );
            })}
          </div>

          {selectedTasks.length > 0 && (
            <div className="mt-4 px-4 py-3 rounded-xl text-xs font-body font-light" style={{ background: '#fdf6f3', borderLeft: '3px solid #EB9486' }}>
              {selectedTasks.length <= 3 && <span className="text-charcoal">❖ <strong>1–3 tasks:</strong> Estimated 2–3 hours</span>}
              {selectedTasks.length >= 4 && selectedTasks.length <= 6 && <span className="text-charcoal">❖ <strong>4–6 tasks:</strong> Estimated 4–6 hours</span>}
              {selectedTasks.length > 6 && <span className="text-coral/80">❖ <strong>Full scope selected</strong> — we'll confirm the exact time after your intake review</span>}
            </div>
          )}
        </div>
      )}

      {isErrands && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5 space-y-4" style={{ borderLeft: '3px solid #B58A90' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#B58A90' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">Errand Details</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light">
            Tell us where the errand actually happens. If there are multiple stops, list each one with the town or address when you have it.
          </p>
          <div>
            <label className="font-body text-xs font-light text-charcoal block mb-2">Primary errand location or list of stops{requiredMark}</label>
            <textarea
              value={answers.errand_locations || ''}
              onChange={e => handleAnswer('errand_locations', e.target.value)}
              placeholder="Example: Giant in Flourtown, CVS in Wyndmoor, post office in Glenside. Include exact addresses if pickup/dropoff matters."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-coral/30 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/60 transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-light text-charcoal block mb-2">Where should we start?</label>
              <div className="flex flex-wrap gap-2">
                {['Service address', 'Store / first stop', 'Other - explain below'].map(opt => (
                  <button key={opt} type="button" onClick={() => handleAnswer('errand_start_point', opt)} className={`px-3 py-1.5 rounded-full border text-xs font-body font-light transition-all duration-200 ${answers.errand_start_point === opt ? 'text-white' : 'bg-cream border-taupe/20 text-charcoal hover:border-charcoal/30'}`} style={answers.errand_start_point === opt ? { background: '#333333', borderColor: '#333333' } : {}}>{opt}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-body text-xs font-light text-charcoal block mb-2">Pickup/dropoff details</label>
              <textarea value={answers.pickup_dropoff_notes || ''} onChange={e => handleAnswer('pickup_dropoff_notes', e.target.value)} placeholder="Order names, return QR codes, appointment address, who we are meeting, etc." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors resize-none" />
            </div>
          </div>
        </div>
      )}

      {needsEmergencyContact && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EB9486' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#EB9486' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">Emergency Contact</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light mb-4">Required for child, family, senior, and companion-style support.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">First Name{requiredMark}</label>
              <input type="text" value={answers.emergency_first_name || ''} onChange={e => handleEmergencyChange('emergency_first_name', e.target.value)} placeholder="First" className="w-full px-4 py-2.5 rounded-xl border border-coral/30 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/60 transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">Last Name{requiredMark}</label>
              <input type="text" value={answers.emergency_last_name || ''} onChange={e => handleEmergencyChange('emergency_last_name', e.target.value)} placeholder="Last" className="w-full px-4 py-2.5 rounded-xl border border-coral/30 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/60 transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">Phone Number{requiredMark}</label>
              <input type="tel" value={answers.emergency_phone || ''} onChange={e => handleEmergencyChange('emergency_phone', e.target.value)} placeholder="(555) 555-5555" className="w-full px-4 py-2.5 rounded-xl border border-coral/30 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/60 transition-colors" />
            </div>
          </div>
        </div>
      )}

      {/* Household / Service intake questions */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5 space-y-5" style={{ borderLeft: '3px solid #F3DE8A' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#F3DE8A' }} />
          <h3 className="font-heading text-sm font-semibold text-charcoal">About this visit</h3>
        </div>

        {intakeQuestions.map(q => (
          <div key={q.id}>
            <label className="font-body text-xs font-light text-charcoal block mb-2">
              {q.label}{q.required && requiredMark}
            </label>
            {q.type === 'select' && (
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-body font-light transition-all duration-200 ${
                      answers[q.id] === opt
                        ? 'text-white'
                        : 'bg-cream border-taupe/20 text-charcoal hover:border-charcoal/30'
                    }`}
                    style={answers[q.id] === opt ? { background: '#333333', borderColor: '#333333' } : {}}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === 'multiselect' && (
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => {
                  const selected = (answers[q.id] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMulti(q.id, opt)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-body font-light transition-all duration-200 ${
                        selected
                          ? 'text-white'
                          : 'bg-cream border-taupe/20 text-charcoal hover:border-charcoal/30'
                      }`}
                      style={selected ? { background: '#333333', borderColor: '#333333' } : {}}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
            {q.type === 'text' && (
              <textarea
                value={answers[q.id] || ''}
                onChange={e => handleAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl border bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none transition-colors resize-none ${
                  q.required ? 'border-coral/30 focus:border-charcoal/60' : 'border-taupe/20 focus:border-charcoal/40'
                }`}
              />
            )}
          </div>
        ))}

        {!isConsult && (
          <div>
            <label className="font-body text-xs font-light text-charcoal block mb-2">Anything else we should know?</label>
            <textarea
              value={answers.special_notes || ''}
              onChange={e => handleAnswer('special_notes', e.target.value)}
              placeholder="Alarm codes, parking instructions, dog info, anything..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors resize-none"
            />
          </div>
        )}
      </div>

      {/* Universal closing question */}
      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EFB988' }}>
          <label className="font-body text-xs font-light text-charcoal block mb-2">
            What would feel like a win by the end of this visit?
          </label>
          <textarea
            value={answers.win_goal || ''}
            onChange={e => handleAnswer('win_goal', e.target.value)}
            placeholder="Tell us what would make you exhale..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors resize-none"
          />
        </div>
      )}

      {/* Photo Upload - hidden for consult */}
      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EB9486' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#EB9486' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">Photos are optional, but helpful</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light mb-4">
            Upload photos if it helps explain the space. Totally optional, always judgment-free.
          </p>
          <label className="block border-2 border-dashed border-taupe/20 rounded-2xl p-6 text-center cursor-pointer hover:border-charcoal/30 transition-colors bg-cream">
            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <p className="font-body text-sm text-charcoal/60 font-light">
              {uploading ? 'Uploading...' : 'Click to upload photos'}
            </p>
          </label>
          {uploadedPhotos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {uploadedPhotos.map((url, i) => (
                <img key={i} src={url} alt={`Upload ${i + 1}`} className="w-16 h-16 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SMS opt-in */}
      <div className="rounded-2xl border border-taupe/15 p-5" style={{ background: '#fdfcfb', borderLeft: '3px solid #B58A90' }}>
        <label className="flex items-start gap-3 cursor-pointer group" onClick={() => onSmsOptInChange(!smsOptIn)}>
          <div
            className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
            style={smsOptIn ? { background: '#333333', borderColor: '#333333' } : { background: '#FFFFFF', borderColor: '#DCDCDC' }}
          >
            {smsOptIn && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <div>
            <p className="font-body text-sm font-light text-charcoal leading-relaxed select-none">
              Yes, send me appointment reminders & updates via text <span className="text-charcoal/40">(recommended)</span>
            </p>
            <p className="font-body text-[11px] text-charcoal/40 font-light mt-0.5 select-none">
              Uncheck to receive confirmations by email only. Msg & data rates may apply.{' '}
              <a href="/sms-terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal transition-colors" onClick={e => e.stopPropagation()}>SMS Terms</a>
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
