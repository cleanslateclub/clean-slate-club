import React, { useState, useEffect } from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { base44 } from '@/api/base44Client';
import OutOfAreaModal from '@/components/booking/OutOfAreaModal';

const HELP_ME_CHOOSE = "Help Me Choose - I'm Overwhelmed";

const sortTaskOptions = (options = []) => {
  const helpOption = options.find(option => option === HELP_ME_CHOOSE);
  const sortedOptions = options
    .filter(option => option !== HELP_ME_CHOOSE)
    .sort((a, b) => a.localeCompare(b));

  return helpOption ? [helpOption, ...sortedOptions] : sortedOptions;
};

export default function Step2Intake({ serviceKey, answers, onChange, clientInfo, onClientChange, onPhotoUpload, uploadedPhotos = [], smsOptIn, onSmsOptInChange }) {
  const [uploading, setUploading] = useState(false);
  const [territories, setTerritories] = useState([]);
  const [outOfArea, setOutOfArea] = useState(false);
  const [outOfAreaCity, setOutOfAreaCity] = useState('');

  useEffect(() => {
    base44.entities.Territory.filter({ is_active: true }).then(t => setTerritories(t || []));
  }, []);

  const checkServiceArea = (address) => {
    // ✅ FIX: Only validate when address looks complete (must have a comma,
    // meaning the user has typed at least "Street, City").
    // Previously this fired on every keystroke via onChange, triggering
    // the out-of-area modal mid-typing even for valid addresses.
    if (!address || territories.length === 0 || !address.includes(',')) return;

    const addressLower = address.toLowerCase();
    const match = territories.some(t => addressLower.includes(t.name.toLowerCase()));
    if (!match) {
      const parts = address.split(',');
      const city = parts.length > 1 ? parts[parts.length - 2].trim() : address.trim();
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
  const sortedTaskOptions = sortTaskOptions(config.taskOptions);

  const handleAnswer = (id, value) => onChange({ ...answers, [id]: value });

  const toggleMulti = (id, option) => {
    const current = answers[id] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleAnswer(id, updated);
  };

  const toggleTask = (task) => {
    const current = answers._tasks || [];
    const updated = current.includes(task)
      ? current.filter(t => t !== task)
      : [...current, task];
    handleAnswer('_tasks', updated);
  };

  const selectedTasks = answers._tasks || [];

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
        {isConsult ? 'Tell us a little about you' : 'Tell us about your home'}
      </h2>
      <p className="font-body text-sm text-charcoal font-light mb-8">
        {isConsult
          ? 'The more you share, the better we can prepare for our call. Zero judgment.'
          : 'The more detail you share, the better we can prepare. Zero judgment, always.'}
      </p>

      {/* Client Info */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EB9486' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#EB9486' }} />
          <h3 className="font-heading text-sm font-semibold text-charcoal">Your Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Your name', required: true },
            { key: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { key: 'phone', label: 'Phone', placeholder: '(555) 555-5555', required: true },
            ...(!isConsult ? [{ key: 'address', label: 'Service Address', placeholder: 'Street address, City, PA', required: true }] : []),
          ].map(f => (
            <div key={f.key}>
              <label className="font-body text-xs font-light text-charcoal block mb-1.5">
                {f.label}{f.required && <span className="text-coral ml-0.5">*</span>}
              </label>
              <input
                type="text"
                value={clientInfo[f.key] || ''}
                onChange={e => {
                  onClientChange({ ...clientInfo, [f.key]: e.target.value });
                  // ✅ FIX: Removed checkServiceArea from onChange.
                  // It was firing mid-keystroke and triggering false out-of-area warnings.
                }}
                onBlur={e => {
                  // ✅ FIX: Only validate on blur (when user finishes typing and moves on).
                  if (f.key === 'address') checkServiceArea(e.target.value);
                }}
                placeholder={f.placeholder}
                required={f.required}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SMS opt-in */}
      <div className="rounded-2xl border border-taupe/15 p-5 mb-5" style={{ background: '#fdfcfb' }}>
        <label className="flex items-start gap-3 cursor-pointer group" onClick={() => onSmsOptInChange(!smsOptIn)}>
          <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${smsOptIn ? 'bg-coral border-coral' : 'border-taupe bg-white group-hover:border-coral/40'}`}>
            {smsOptIn && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <div>
            <p className="font-body text-sm font-light text-charcoal leading-relaxed select-none">
              Yes, send me appointment reminders & updates via text <span className="text-charcoal/40">(recommended)</span>
            </p>
            <p className="font-body text-[11px] text-charcoal/40 font-light mt-0.5 select-none">
              Uncheck to receive confirmations by email only. Msg & data rates may apply.{' '}
              <a href="/sms-terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors" onClick={e => e.stopPropagation()}>SMS Terms</a>
            </p>
          </div>
        </label>
      </div>

      {/* Task checkboxes */}
      {config.taskOptions && (
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
                      ? 'bg-coral border-coral text-white'
                      : 'bg-cream border-taupe/20 hover:border-coral/30'
                  }`}
                  style={!isSelected ? { color: '#333333' } : {}}
                >
                  <span className={`w-3 h-3 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-white border-white' : 'border-charcoal/25'
                  }`}>
                    {isSelected && <span className="text-coral text-[8px] font-bold leading-none">✓</span>}
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

      {/* Household / Service intake questions */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5 space-y-5" style={{ borderLeft: '3px solid #F3DE8A' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#F3DE8A' }} />
          <h3 className="font-heading text-sm font-semibold text-charcoal">About this visit</h3>
        </div>

        {config.intakeQuestions.map(q => (
          <div key={q.id}>
            <label className="font-body text-xs font-light text-charcoal block mb-2">
              {q.label}{q.required && <span className="text-coral ml-0.5">*</span>}
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
                        ? 'bg-coral border-coral text-white'
                        : 'bg-cream border-taupe/20 text-charcoal hover:border-coral/30'
                    }`}
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
                          ? 'bg-coral border-coral text-white'
                          : 'bg-cream border-taupe/20 text-charcoal hover:border-coral/30'
                      }`}
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
                  q.required ? 'border-coral/30 focus:border-coral/60' : 'border-taupe/20 focus:border-coral/40'
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
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
            />
          </div>
        )}
      </div>

      {/* Universal closing question */}
      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-5" style={{ borderLeft: '3px solid #EFB988' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#EFB988' }} />
            <label className="font-body text-sm font-semibold text-charcoal block">
              What would make this feel most helpful?
            </label>
          </div>
          <p className="font-body text-xs text-charcoal/60 font-light mb-3">Tell us what would make you feel relieved when we leave.</p>
          <textarea
            value={answers.relief_goal || ''}
            onChange={e => handleAnswer('relief_goal', e.target.value)}
            placeholder="e.g. I want the kitchen functional again, laundry caught up, errands off my list..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
          />
        </div>
      )}

      {/* Photo Upload */}
      {!isConsult && (
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6" style={{ borderLeft: '3px solid #7E7F9A' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#7E7F9A' }} />
            <h3 className="font-heading text-sm font-semibold text-charcoal">Photos help us help you</h3>
          </div>
          <p className="font-body text-xs text-charcoal font-light mb-4">Optional but helpful — upload photos of the areas you want support with.</p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-taupe/20 rounded-2xl p-8 cursor-pointer hover:border-coral/40 transition-colors" style={{ background: '#fdfcfb' }}>
            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <span className="font-logo text-3xl text-coral mb-2">+</span>
            <span className="font-body text-sm text-charcoal font-light">{uploading ? 'Uploading...' : 'Click to upload photos'}</span>
          </label>
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {uploadedPhotos.map((url, i) => <img key={i} src={url} alt={`Upload ${i + 1}`} className="w-full h-24 object-cover rounded-xl" />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}