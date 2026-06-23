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

const SECTION_TINTS = {
  services: '#CAE7B91F',
  consult: '#F3DE8A1F',
  manifesto: '#EB94861F',
  situations: '#B58A901F',
  trust: '#B58A901F',
  masha: '#97A7B31F',
  membership: '#CAE7B91F',
  serviceArea: '#8B93A71F',
  testimonials: '#97A7B31F',
  faq: '#F1F1F1',
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WaveDivider fill={SECTION_TINTS.services} />
      <ServicesPreview />
      <WaveDivider fill={SECTION_TINTS.consult} flip />
      <ConsultSection />
      <WaveDivider fill={SECTION_TINTS.manifesto} />
      <HeavyManifestoSection />
      <WaveDivider fill={SECTION_TINTS.situations} flip />
      <HeavySituationsSection />
      <WaveDivider fill={SECTION_TINTS.trust} />
      <TrustSection />
      <WaveDivider fill={SECTION_TINTS.masha} flip />
      <MashaSection />
      <WaveDivider fill={SECTION_TINTS.membership} />
      <MembershipPreview />
      <WaveDivider fill={SECTION_TINTS.serviceArea} flip />
      <ServiceAreaSection />
      <WaveDivider fill={SECTION_TINTS.testimonials} />
      <TestimonialsSection />
      <WaveDivider fill={SECTION_TINTS.faq} flip />
      <FAQSection />
    </main>
  );
}
