import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MashaSection from '../components/home/MashaSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreview';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import CTASection from '../components/home/CTASection';
import FAQSection from '../components/home/FAQSection';
import WaveDivider from '../components/shared/WaveDivider';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WaveDivider fill="#FDFBF8" />
      <MashaSection />
      <WaveDivider fill="#FAF7F2" flip />
      <ServicesPreview />
      <WaveDivider fill="#FDFBF8" />
      <TrustSection />
      <WaveDivider fill="#FAF7F2" flip />
      <ConsultSection />
      <WaveDivider fill="#FDFBF8" />
      <TestimonialsSection />
      <WaveDivider fill="#FAF7F2" flip />
      <MembershipPreview />
      <WaveDivider fill="#FDFBF8" />
      <ServiceAreaSection />
      <WaveDivider fill="#FDFBF8" />
      <FAQSection />
      <CTASection />
    </div>
  );
}