import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
const IconShield = () =>
<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M14 3L4 7v7c0 5.25 4.33 10.16 10 11 5.67-.84 10-5.75 10-11V7L14 3z" />
    <path d="M9 14l3 3 5-5" strokeWidth="1.4" />
  </svg>;

const IconHeart = () =>
<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M14 23S3 17 3 10a5.5 5.5 0 0111-1 5.5 5.5 0 0111 1c0 7-11 13-11 13z" />
    <path d="M14 9v3M12.5 11h3" strokeWidth="1.2" />
  </svg>;

const IconCheck = () =>
<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <circle cx="14" cy="14" r="10" />
    <path d="M9 14l3.5 3.5L19 10" strokeWidth="1.4" />
  </svg>;

const IconClipboard = () =>
<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <rect x="7" y="5" width="14" height="18" rx="2" />
    <path d="M11 5a3 3 0 006 0" />
    <path d="M11 13h6M11 17h4" />
  </svg>;

const IconLeaf = () =>
<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M7 21c2-6 6-10 14-12-2 8-6 12-14 12z" />
    <path d="M7 21L14 14" />
  </svg>;


const trustIconMap = { shield: IconShield, heart: IconHeart, check: IconCheck, clipboard: IconClipboard, leaf: IconLeaf };

const credentials = [
{ iconKey: 'shield', label: 'Licensed & Insured', detail: 'Full business coverage', accent: '#EB9486' },
{ iconKey: 'heart', label: 'CPR Certified', detail: 'Safety trained', accent: '#EFB988' },
{ iconKey: 'check', label: 'Background Checked', detail: 'Every time, no exception', accent: '#CAE7B9' },
{ iconKey: 'clipboard', label: 'Clearances Available', detail: 'Upon request', accent: '#B58A90' },
{ iconKey: 'leaf', label: 'ServSafe Certified', detail: 'Food safety trained', accent: '#97A7B3' }];

const withOpacity = (hex, opacity = '66') => `${hex}${opacity}`;

export default function TrustSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body tracking-[0.25em] uppercase mb-4 font-light text-lg text-[hsl(var(--popover-foreground))]">YOU'RE IN GOOD HANDS</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-3">
            Trust isn't given. It's earned.
          </h2>
          <p className="font-body text-base text-charcoal/65 font-light max-w-md mx-auto leading-relaxed">
            When someone comes into your home, you deserve to feel completely safe. Here's what we bring to every visit.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {credentials.map((c, i) =>
            <div key={i} className="flex items-center gap-3 rounded-2xl px-6 py-4 border transition-all duration-300 hover:shadow-sm" style={{ background: withOpacity(c.accent), borderColor: c.accent }}>
                <span style={{ color: '#333333' }}>{React.createElement(trustIconMap[c.iconKey])}</span>
                <div>
                  <p className="font-heading text-sm font-semibold" style={{ color: '#333333' }}>{c.label}</p>
                  <p className="font-body text-xs font-light" style={{ color: '#333333cc' }}>{c.detail}</p>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
    );

}