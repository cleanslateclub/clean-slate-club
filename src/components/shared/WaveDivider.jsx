import React from 'react';

export default function WaveDivider({ fill = '#F7F4F0', flip = false, className = '' }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '72px', transform: flip ? 'scaleX(-1)' : 'none' }}
      >
        <path
          d="M0,38 C180,70 360,12 540,34 C720,56 900,70 1080,30 C1260,-8 1380,18 1440,34 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
