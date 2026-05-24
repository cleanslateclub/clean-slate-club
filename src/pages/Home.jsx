import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MashaSection from '../components/home/MashaSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreview.jsx';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import CTASection from '../components/home/CTASection';
import FAQSection from '../components/home/FAQSection';
import WaveDivider from '../components/shared/WaveDivider';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WaveDivider fill="#EFB98808" />
      <MashaSection />
      <WaveDivider fill="#CAE7B908" flip />
      <ServicesPreview />
      <WaveDivider fill="#7E7F9A08" />
      <TrustSection />
      <WaveDivider fill="#F3DE8A08" flip />
      <ConsultSection />
      <WaveDivider fill="#B58A9008" />
      <TestimonialsSection />
      <WaveDivider fill="#8B93A708" flip />
      <MembershipPreview />
      <WaveDivider fill="#DFE3A208" />
      <ServiceAreaSection />
      <WaveDivider fill="#97A7B308" />
      <FAQSection />
      <CTASection />
    </div>
  );
}