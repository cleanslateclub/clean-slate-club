import React from 'react';
import ProviderComplianceCenter from '@/components/admin/ProviderComplianceCenter';

export default function AdminOSCompliance() {
  return (
    <main className="min-h-screen bg-cream pt-20 pb-16">
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Provider Compliance Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin-os/modules" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Feature Map
            </a>
            <a href="/admin-os" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Admin OS Preview
            </a>
            <a href="/admin" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Current Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <ProviderComplianceCenter />
      </div>
    </main>
  );
}
