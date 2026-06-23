import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSectionLite';
import ConsultSection, { HeavyManifestoSection, HeavySituationsSection } from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreviewLite';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import FAQSection from '../components/home/FAQSection';
import WaveDivider from '../components/shared/WaveDivider';

const SECTION_BACKGROUNDS = {
  services: '#FDFCFB',
  consult: '#F7F9F3',
  manifesto: '#F8F6EA',
  situations: '#F6EEE9',
  trust: '#F2E8EA',
  membership: '#EEE7EA',
  serviceArea: '#EAECEF',
  testimonials: '#E4EBEF',
  faq: '#DDE5EA',
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
