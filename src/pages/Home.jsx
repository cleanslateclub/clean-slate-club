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
      <WaveDivider fill="#fdf5f3" />
      <MashaSection />
      <WaveDivider fill="#F1F1F1" flip />
      <ServicesPreview />
      <WaveDivider fill="#FFFFFF" />
      <TrustSection />
      <WaveDivider fill="#fdf5ec" flip />
      <ConsultSection />
      <WaveDivider fill="#FFE5D9" />
      <TestimonialsSection />
      <WaveDivider fill="#F1F1F1" flip />
      <MembershipPreview />
      <ServiceAreaSection />
      <FAQSection />
    </main>
  );
}
