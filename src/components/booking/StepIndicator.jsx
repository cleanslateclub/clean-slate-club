import React from 'react';

const ALL_STEPS = ['Service', 'Details', 'Add-Ons', 'Schedule', 'Confirm'];
const CONSULT_STEPS = ['Service', 'Details', 'Confirm'];

// Chart colors 1–5 mapped to each step
const STEP_COLORS = ['#EB9486', '#CAE7B9', '#F3DE8A', '#EFB988', '#B58A90'];

export default function StepIndicator({ currentStep, totalSteps = 5 }) {
  const steps = totalSteps === 3 ? CONSULT_STEPS : ALL_STEPS;

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = currentStep > stepNum;
        const active = currentStep === stepNum;
        const color = STEP_COLORS[i] || '#EB9486';
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all duration-300"
                style={
                  done
                    ? { background: color, color: '#fff' }
                    : active
                    ? { background: color, color: '#fff', boxShadow: `0 0 0 4px ${color}30` }
                    : { background: '#e8e8e4', color: '#33333355' }
                }
              >
                {done ? '✓' : stepNum}
              </div>
              <span
                className="text-[10px] mt-1 font-body font-light whitespace-nowrap"
                style={{ color: active ? color : '#333333aa' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px w-8 sm:w-12 mb-4 transition-all duration-300"
                style={{ background: done ? color : '#e8e8e4' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}