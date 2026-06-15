import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MashaSection from '../components/home/MashaSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreview';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import FAQSection from '../components/home/FAQSection';
import WaveDivider from '../components/shared/WaveDivider';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WaveDivider fill="#F7FAF4" />
      <ServicesPreview />
      <WaveDivider fill="#FDF5E6" flip />
      <ConsultSection />
      <WaveDivider fill="#F8E8E2" />
      <MashaSection />
      <WaveDivider fill="#F1ECEF" flip />
      <TrustSection />
      <WaveDivider fill="#EEF3F5" />
      <TestimonialsSection />
      <WaveDivider fill="#EAF1EC" flip />
      <ServiceAreaSection />
      <WaveDivider fill="#F5E6E9" />
      <MembershipPreview />
      <WaveDivider fill="#F1F1F1" flip />
      <FAQSection />
    </main>
  );
}