import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection, { HeavyManifestoSection, HeavySituationsSection } from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreview';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import FAQSection from '../components/home/FAQSection';
import WaveDivider from '../components/shared/WaveDivider';

const SECTION_BACKGROUNDS = {
  services: '#F9FCF7',
  consult: '#FDF5E6',
  manifesto: '#F8E8E2',
  situations: '#F5E6E9',
  trust: '#F1ECEF',
  membership: '#F9FCF7',
  serviceArea: '#F1F2F4',
  testimonials: '#E4EBEF',
  faq: '#F1F1F1',
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.services} />
      <ServicesPreview />
      <WaveDivider fill={SECTION_BACKGROUNDS.consult} flip />
      <ConsultSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.manifesto} />
      <HeavyManifestoSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.situations} flip />
      <HeavySituationsSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.trust} />
      <TrustSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.membership} />
      <MembershipPreview />
      <WaveDivider fill={SECTION_BACKGROUNDS.serviceArea} flip />
      <ServiceAreaSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.testimonials} />
      <TestimonialsSection />
      <WaveDivider fill={SECTION_BACKGROUNDS.faq} flip />
      <FAQSection />
    </main>
  );
}
