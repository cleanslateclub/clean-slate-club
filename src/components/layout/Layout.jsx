import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WorkInProgressBanner from '@/components/shared/WorkInProgressBanner';

export default function Layout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);

  return (
    <div className="min-h-screen bg-cream">
      <WorkInProgressBanner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}