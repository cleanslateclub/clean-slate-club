import React from 'react';
import HeroSection from '../components/home/HeroSection';
import WhatWeDoSection from '../components/home/WhatWeDoSection';
import AboutSection from '../components/home/AboutSection';
import MembershipPreview from '../components/home/MembershipPreview';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import FAQSection from '../components/home/FAQSection';
import CTASection from '../components/home/CTASection';
import SectionDivider from '../components/shared/SectionDivider';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhatWeDoSection />
      <SectionDivider />
      <AboutSection />
      <MembershipPreview />
      <SectionDivider />
      <TestimonialsSection />
      <ServiceAreaSection />
      <SectionDivider />
      <FAQSection />
      <CTASection />
    </div>
  );
}