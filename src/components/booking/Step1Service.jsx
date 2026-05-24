import React, { useRef, useState } from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { base44 } from '@/api/base44Client';

const SERVICE_ORDER = ['consult', 'home_reset', 'mothers_helper', 'errands', 'senior_support', 'meal_prep'];

export default function Step1Service({ selected, onSelect, onPhotoUpload, uploadedPhotos = [] }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    onPhotoUpload([...uploadedPhotos, ...urls]);
    setUploading(false);
  };

  const orderedServices = SERVICE_ORDER
    .filter(k => SERVICE_CONFIG[k])
    .map(k => [k, SERVICE_CONFIG[k]]);

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">How can we help?</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-8">Not sure? The free consult is the perfect place to start — no commitment, just a conversation.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {orderedServices.map(([key, cfg]) => {
          const isConsult = key === 'consult';
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-coral bg-coral/5 shadow-md shadow-coral/10'
                  : isConsult
                  ? 'border-mauve/40 bg-gradient-to-br from-[#fdf6f4] to-[#f5f0f6] hover:border-coral/30'
                  : 'border-taupe/20 bg-warm-white hover:border-coral/30 hover:shadow-sm'
              } ${isConsult ? 'sm:col-span-2' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cfg.color }} />
                <span className="font-heading text-sm font-semibold text-charcoal">{cfg.label}</span>
                {isConsult ? (
                  <span className="ml-auto font-body text-xs px-3 py-0.5 rounded-full font-light" style={{ background: '#f0ebe8', color: '#B58A90' }}>Free · 15 min</span>
                ) : (
                  <span className="ml-auto font-body text-xs text-charcoal/35 font-light">${cfg.priceRange[0]}–${cfg.priceRange[1]}</span>
                )}
              </div>
              <p className="font-body text-xs text-charcoal/50 font-light leading-relaxed mb-3">{cfg.description}</p>
              {isConsult ? (
                <div className="flex flex-wrap gap-4 mt-2">
                  {cfg.examples.slice(0, 2).map((ex, i) => (
                    <p key={i} className="font-body text-[11px] text-charcoal/35 font-light flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">→</span>{ex}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {cfg.examples.slice(0, 3).map((ex, i) => (
                    <p key={i} className="font-body text-[11px] text-charcoal/35 font-light flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">→</span>{ex}
                    </p>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Photo / wish list upload — show for all selections */}
      {selected && (
        <div className="mt-6 p-5 rounded-2xl border border-dashed transition-all duration-300" style={{ borderColor: '#e0d5d0', background: '#fdfaf8' }}>
          <p className="font-body text-sm font-light text-charcoal/60 mb-1">
            📸 <strong className="font-normal text-charcoal/80">Optional:</strong> Upload photos of your space or a wish list
          </p>
          <p className="font-body text-xs text-charcoal/35 font-light mb-4">
            This helps us prepare the perfect support plan before we even arrive. No pressure — add as many or as few as you'd like.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-body text-xs px-5 py-2.5 rounded-full border transition-all duration-300 text-charcoal/60 hover:text-coral"
              style={{ borderColor: '#e0d5d0', background: 'white' }}
            >
              {uploading ? 'Uploading...' : '+ Add photos or files'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            {uploadedPhotos.map((url, i) => (
              <span key={i} className="font-body text-[11px] text-sage/80 font-light flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                Photo {i + 1} uploaded
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}