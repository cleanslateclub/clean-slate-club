import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { buildGoogleMapsDirectionsUrl, getPrimaryAddress, hasMapAddress } from '@/lib/mapLinks';

export default function HouseholdMapLink({ record = {}, className = '' }) {
  const address = getPrimaryAddress(record);
  if (!hasMapAddress(address)) return null;

  return (
    <a
      href={buildGoogleMapsDirectionsUrl(address)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs font-body text-coral hover:text-coral/80 transition-colors ${className}`}
    >
      <MapPin className="w-3 h-3" />
      Open directions
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
