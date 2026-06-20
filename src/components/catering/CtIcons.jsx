import React from 'react';

const props = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlateIcon = (p) => (
  <svg {...props} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
  </svg>
);

export const ChefIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M6 11a4 4 0 014-6 4 4 0 014 0 4 4 0 014 6v3H6z" />
    <path d="M6 14h12v5H6z" />
    <path d="M9 14v5M15 14v5" />
  </svg>
);

export const BuffetIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M3 12h18M5 12V8a2 2 0 012-2h10a2 2 0 012 2v4" />
    <path d="M4 12l1 7h14l1-7" />
    <path d="M12 6V3" />
  </svg>
);

export const TruckIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg {...props} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const ShieldIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const ClockIcon = (p) => (
  <svg {...props} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const LeafIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M20 4c-7 0-13 6-13 13 0 1 .2 2 .5 3 1-.3 2-.5 3-.5 7 0 13-6 13-13l-3.5-2.5z" />
    <path d="M7 17c4-4 7-7 11-11" />
  </svg>
);

export const ShoppingIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M3 6h2l2 12h11l2-9H7" />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />
  </svg>
);

export const PhoneIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
  </svg>
);

export const MailIcon = (p) => (
  <svg {...props} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 7 9-7" />
  </svg>
);

export const PinIcon = (p) => (
  <svg {...props} {...p}>
    <path d="M12 22s7-7.6 7-13a7 7 0 10-14 0c0 5.4 7 13 7 13z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

/* Cookie monogram from the catering identity — used as a rhythm mark next to
   headings (mirrors the 🍪🍪 motif from the social mockups). */
export const CookieIcon = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <circle cx="9" cy="12" r="6" opacity="0.95" />
    <circle cx="16" cy="12" r="4" opacity="0.7" />
  </svg>
);
