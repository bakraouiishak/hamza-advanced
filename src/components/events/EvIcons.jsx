import React from 'react';

/* Events sector icon set — single-stroke line glyphs that read clearly at
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

export const EV_ICONS = {
  expo: (props) => (
    <I {...props}>
      <rect x="3" y="5" width="18" height="13" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M8 18v3M16 18v3M6 21h12" />
      <circle cx="6" cy="7" r="0.5" fill="currentColor" />
    </I>
  ),
  crown: (props) => (
    <I {...props}>
      <path d="M3 18h18l-2-9-4 4-3-6-3 6-4-4z" />
      <path d="M3 21h18" />
    </I>
  ),
  sparkle: (props) => (
    <I {...props}>
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" fill="currentColor" stroke="none" />
      <path d="M19 16l0.6 1.8L21 18l-1.4 0.6L19 20l-0.6-1.4L17 18l1.4-0.2z" fill="currentColor" stroke="none" />
    </I>
  ),
  booth: (props) => (
    <I {...props}>
      <path d="M4 8l8-4 8 4v3H4z" />
      <path d="M5 11v9M19 11v9M5 20h14" />
      <path d="M10 14h4v6h-4z" />
    </I>
  ),
  gift: (props) => (
    <I {...props}>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 13h18M12 9v11" />
      <path d="M12 9c-2 0-3.5-1.5-3.5-3S10 3 12 5c2-2 3.5-0.5 3.5 1S14 9 12 9z" />
    </I>
  ),
  envelope: (props) => (
    <I {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6 9-6" />
      <circle cx="18" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </I>
  ),
  target: (props) => (
    <I {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </I>
  ),
  handshake: (props) => (
    <I {...props}>
      <path d="M3 12l4-4 5 5 5-5 4 4" />
      <path d="M8 17l4-4 4 4" />
      <path d="M3 16h4M17 16h4" />
    </I>
  ),
};
