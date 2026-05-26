import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MashaSection from '../components/home/MashaSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TrustSection from '../components/home/TrustSection';
import ConsultSection from '../components/home/ConsultSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MembershipPreview from '../components/home/MembershipPreview.jsx';
import ServiceAreaSection from '../components/home/ServiceAreaSection';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MashaSection />
      <ServicesPreview />
      <TrustSection />
      <ConsultSection />
      <TestimonialsSection />
      <MembershipPreview />
      <ServiceAreaSection />
      <FAQSection />
    </div>
  );
}