import React from 'react';

export default function OrgBlob({ color = '#EFB988', opacity = 0.18, className = '', size = 400 }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <path
        fill={color}
        fillOpacity={opacity}
        d="M47.5,-62.8C60.4,-54.2,69.3,-39.4,73.2,-23.5C77.1,-7.6,76,9.4,69.3,23.5C62.6,37.6,50.3,48.8,36.5,57.1C22.7,65.4,7.4,70.8,-8.1,70.4C-23.6,70,-39.3,63.8,-51.8,53.3C-64.3,42.8,-73.6,28,-76.2,12C-78.8,-4,-74.7,-21.2,-65.5,-34.9C-56.3,-48.6,-42,-58.8,-27.1,-66.1C-12.2,-73.4,3.3,-77.8,17.9,-75C32.5,-72.2,46.3,-62.2,47.5,-62.8Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}