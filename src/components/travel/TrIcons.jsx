import React from 'react';

/* Travel sector icon set — single-stroke line glyphs at 28-32px.
   Each takes width/height props and inherits currentColor. */

const I = ({ children, width = 28, height = 28, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

export const TR_ICONS = {
  concierge: (props) => (
    <I {...props}>
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M4 22v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      <path d="M9 13l3 3 3-3" />
    </I>
  ),
  visa: (props) => (
    <I {...props}>
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <path d="M7 8h6M7 12h6M7 16h4" />
      <circle cx="19" cy="6" r="2.4" />
    </I>
  ),
  plane: (props) => (
    <I {...props}>
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5l8 2.5z" />
    </I>
  ),
  license: (props) => (
    <I {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <path d="M14 10h5M14 13h5M14 16h3" />
    </I>
  ),
  hotel: (props) => (
    <I {...props}>
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M3 21h18" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h0M15 11h0" />
    </I>
  ),
  compass: (props) => (
    <I {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5.5-5.5 2 2-5.5 5.5-2z" fill="currentColor" stroke="none" opacity="0.85" />
    </I>
  ),
  transport: (props) => (
    <I {...props}>
      <rect x="3" y="6" width="18" height="11" rx="2" />
      <circle cx="7.5" cy="18.5" r="1.8" />
      <circle cx="16.5" cy="18.5" r="1.8" />
      <path d="M3 11h18" />
      <path d="M7 6V4h10v2" />
    </I>
  ),
  logistics: (props) => (
    <I {...props}>
      <path d="M3 7h13v10H3z" />
      <path d="M16 10h4l1 3v4h-5" />
      <circle cx="7.5" cy="18.5" r="1.8" />
      <circle cx="17.5" cy="18.5" r="1.8" />
    </I>
  ),
};
