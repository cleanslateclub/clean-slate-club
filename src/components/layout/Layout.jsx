import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WorkInProgressBanner from '@/components/shared/WorkInProgressBanner';

const brandBarColors = [
  '#DFE3A2',
  '#CAE7B9',
  '#F3DE8A',
  '#EFB988',
  '#EB9486',
  '#B58A90',
  '#7E7F9A',
  '#97A7B3',
];

function BrandColorBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[80] h-3 overflow-hidden sm:h-4" aria-hidden="true">
      <div className="flex h-full w-full">
        {brandBarColors.map(color => (
          <span key={color} className="h-full flex-1" style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}

const ADMIN_PATHS = ['/admin', '/admin-os', '/team'];

export default function Layout() {
  const { pathname, search } = useLocation();
  const isAdminRoute = ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  useEffect(() => {
    if (!isAdminRoute) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <BrandColorBar />
      <WorkInProgressBanner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}