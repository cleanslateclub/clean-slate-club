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
      <WaveDivider fill="#fdf5f3" />
      <MashaSection />
      <WaveDivider fill="#fdf3f0" flip />
      <ServicesPreview />
      <WaveDivider fill="#f2ddd6" />
      <TrustSection />
      <WaveDivider fill="#fdf5ec" flip />
      <ConsultSection />
      <WaveDivider fill="#e3d0c3" />
      <TestimonialsSection />
      <WaveDivider fill="#fdf5f3" flip />
      <MembershipPreview />
      <WaveDivider fill="#e5f4ec" />
      <ServiceAreaSection />
      <WaveDivider fill="#eedbd5" flip />
      <FAQSection />
      <CTASection />
    </div>
  );
}