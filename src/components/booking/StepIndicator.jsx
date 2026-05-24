import React from 'react';

const steps = ['Service', 'Details', 'Add-Ons', 'Schedule', 'Confirm'];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = currentStep > stepNum;
        const active = currentStep === stepNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all duration-300 ${
                done ? 'bg-coral text-white' : active ? 'bg-coral text-white ring-4 ring-coral/20' : 'bg-taupe/40 text-charcoal/40'
              }`}>
                {done ? '✓' : stepNum}
              </div>
              <span className={`text-[10px] mt-1 font-body font-light whitespace-nowrap ${active ? 'text-coral' : 'text-charcoal/35'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 sm:w-12 mb-4 transition-all duration-300 ${done ? 'bg-coral' : 'bg-taupe/30'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}