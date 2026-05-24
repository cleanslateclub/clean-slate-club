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
      <WaveDivider fill="#fdf8f5" />
      <MashaSection />
      <WaveDivider fill="#fdf6f4" flip />
      <ServicesPreview />
      <WaveDivider fill="#f5e6e2" />
      <TrustSection />
      <WaveDivider fill="#fdf8f2" flip />
      <ConsultSection />
      <WaveDivider fill="#e8ddd4" />
      <TestimonialsSection />
      <WaveDivider fill="#fdf8f5" flip />
      <MembershipPreview />
      <WaveDivider fill="#f0f6f2" />
      <ServiceAreaSection />
      <WaveDivider fill="#f2e4e0" flip />
      <FAQSection />
      <CTASection />
    </div>
  );
}