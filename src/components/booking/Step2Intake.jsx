import React from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function Step2Intake({ serviceKey, answers, onChange, clientInfo, onClientChange }) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;

  const handleAnswer = (id, value) => onChange({ ...answers, [id]: value });

  const toggleMulti = (id, option) => {
    const current = answers[id] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleAnswer(id, updated);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Tell us about your home</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-8">The more detail you share, the better we can prepare. Zero judgment, always.</p>

      {/* Client Info */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-6">
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-4">Your Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Your name', required: true },
            { key: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
            { key: 'phone', label: 'Phone', placeholder: '(555) 555-5555', required: true },
            { key: 'address', label: 'Service Address', placeholder: 'Street address, City, PA', required: true },
          ].map(f => (
            <div key={f.key}>
              <label className="font-body text-xs font-light text-charcoal/50 block mb-1.5">{f.label}{f.required && <span className="text-coral ml-0.5">*</span>}</label>
              <input
                type="text"
                value={clientInfo[f.key] || ''}
                onChange={e => onClientChange({ ...clientInfo, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Service-specific intake */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 space-y-5">
        <h3 className="font-heading text-sm font-semibold text-charcoal">About this visit</h3>
        {config.intakeQuestions.map(q => (
          <div key={q.id}>
            <label className="font-body text-xs font-light text-charcoal/55 block mb-2">{q.label}</label>
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
                        : 'bg-cream border-taupe/20 text-charcoal/55 hover:border-coral/30'
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
                          : 'bg-cream border-taupe/20 text-charcoal/55 hover:border-coral/30'
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
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
              />
            )}
          </div>
        ))}
        <div>
          <label className="font-body text-xs font-light text-charcoal/55 block mb-2">Anything else we should know?</label>
          <textarea
            value={answers.special_notes || ''}
            onChange={e => handleAnswer('special_notes', e.target.value)}
            placeholder="Alarm codes, parking instructions, dog info, anything..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}