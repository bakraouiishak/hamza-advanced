import React from 'react';

/* Electricity sector icon set — single-stroke line glyphs that read clearly at
   28-32px. Each icon takes width/height props and inherits currentColor. */

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

export const EL_ICONS = {
  generator: (props) => (
    <I {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="9" cy="12" r="2.4" />
      <path d="M14 10h4M14 13h3M14 16h4" />
    </I>
  ),
  ups: (props) => (
    <I {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M11 7l-3 6h4l-3 5" />
      <path d="M4 10h16" />
    </I>
  ),
  switch: (props) => (
    <I {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v6M8 8l4 4 4-4" />
    </I>
  ),
  battery: (props) => (
    <I {...props}>
      <rect x="3" y="7" width="16" height="10" rx="1.5" />
      <path d="M19 10v4M7 10v4M11 10v4" />
      <path d="M21 10v4" />
    </I>
  ),
  wrench: (props) => (
    <I {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.6-2.6 2.3-2.1z" />
    </I>
  ),
  install: (props) => (
    <I {...props}>
      <path d="M4 21h16" />
      <path d="M6 21V9l6-5 6 5v12" />
      <path d="M10 13h4v8h-4z" />
    </I>
  ),
  panel: (props) => (
    <I {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
      <circle cx="6" cy="6" r="0.5" fill="currentColor" />
      <circle cx="13" cy="13" r="0.6" />
      <circle cx="17" cy="17" r="0.6" />
    </I>
  ),
  consult: (props) => (
    <I {...props}>
      <path d="M12 2a7 7 0 0 0-4 12.7V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.3A7 7 0 0 0 12 2z" />
      <path d="M10 22h4" />
    </I>
  ),
};
