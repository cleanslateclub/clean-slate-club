import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MashaSection from '../components/home/MashaSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection, { HeavyManifestoSection, HeavySituationsSection } from '../components/home/ConsultSection';
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
      <HeavyManifestoSection />
      <WaveDivider fill="#F5E6E9" flip />
      <HeavySituationsSection />
      <WaveDivider fill="#F1ECEF" />
      <TrustSection />
      <WaveDivider fill="#EEF3F5" flip />
      <MashaSection />
      <WaveDivider fill="#EAF1EC" />
      <MembershipPreview />
      <WaveDivider fill="#E8EEE9" flip />
      <ServiceAreaSection />
      <WaveDivider fill="#E4EBEF" />
      <TestimonialsSection />
      <WaveDivider fill="#F1F1F1" flip />
      <FAQSection />
    </main>
  );
}