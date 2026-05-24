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
      <WaveDivider fill="#ffd7ba18" />
      <MashaSection />
      <WaveDivider fill="#d8e2dc15" flip />
      <ServicesPreview />
      <WaveDivider fill="#f8edeb" />
      <TrustSection />
      <WaveDivider fill="#fdfcfb" flip />
      <ConsultSection />
      <WaveDivider fill="#ece4db" />
      <TestimonialsSection />
      <WaveDivider fill="#fdfcfb" flip />
      <MembershipPreview />
      <WaveDivider fill="#fdfcfb" />
      <ServiceAreaSection />
      <WaveDivider fill="#f8edeb" flip />
      <FAQSection />
      <CTASection />
    </div>
  );
}