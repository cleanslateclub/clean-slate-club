export const buildGoogleMapsDirectionsUrl = (address = '') => {
  const cleanAddress = String(address || '').trim();
  if (!cleanAddress) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cleanAddress)}`;
};

export const hasMapAddress = (address = '') => Boolean(String(address || '').trim());

export const getPrimaryAddress = (record = {}) => {
  return record.primary_service_address || record.client_address || record.location_address || record.address || '';
};
