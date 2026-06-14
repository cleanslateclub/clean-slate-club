import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function WorkInProgressBanner() {
  const [visible, setVisible] = useState(false);
  const { getBool, loading: settingsLoading } = useAppSettings();

  useEffect(() => {
    if (settingsLoading) return;

    const wipEnabled = getBool('wip_banner_enabled');
    if (!wipEnabled) return;

    const dismissed = sessionStorage.getItem('wip_dismissed');
    if (!dismissed) setVisible(true);
  }, [settingsLoading]);

  const handleClose = () => {
    sessionStorage.setItem('wip_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-coral/30 bg-warm-white shadow-2xl text-center">
        <div className="h-2 bg-gradient-to-r from-coral via-taupe to-[#9CAF88]" />

       
