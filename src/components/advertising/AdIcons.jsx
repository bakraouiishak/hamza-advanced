import React from 'react';

/* Stroke-based glyphs for the 12 advertising services. Each follows the brand
   line-weight (1.6) and re-tints via currentColor so the card states (hover,
   active) drive the colour without inline overrides. */

const base = {
  width: 28,
  height: 28,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Identity = (p) => (
  <svg {...base} {...p}>
    <circle cx="16" cy="11" r="4" />
    <path d="M8 25c0-4 3.6-7 8-7s8 3 8 7" />
    <path d="M5 6l3 3M27 6l-3 3M16 3v3" />
  </svg>
);

const Print = (p) => (
  <svg {...base} {...p}>
    <path d="M9 5h14v8H9z" />
    <path d="M5 13h22v10H22v4H10v-4H5z" />
    <path d="M22 18h-2" />
  </svg>
);

const Signage = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h24v14H4z" />
    <path d="M9 12v4M12 12v4M15 12l3 4M21 12v4M23 12h2M23 16h2M24 12v4" />
  </svg>
);

const Acrylic = (p) => (
  <svg {...base} {...p}>
    <path d="M16 4l11 6v12l-11 6L5 22V10z" />
    <path d="M16 4v24M5 10l11 6 11-6" />
  </svg>
);

const Gifts = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12h24v4H4z" />
    <path d="M6 16v12h20V16" />
    <path d="M16 12v16" />
    <path d="M16 12c-3-4-7-1-3 0M16 12c3-4 7-1 3 0" />
  </svg>
);

const Packaging = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9l12-5 12 5-12 5z" />
    <path d="M4 9v14l12 5 12-5V9" />
    <path d="M16 14v14" />
    <path d="M10 11.5l12 5" />
  </svg>
);

const UV = (p) => (
  <svg {...base} {...p}>
    <circle cx="16" cy="16" r="5" />
    <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7 7l2 2M23 23l2 2M7 25l2-2M23 9l2-2" />
  </svg>
);

const Stickers = (p) => (
  <svg {...base} {...p}>
    <path d="M5 6h17l5 5v15H5z" />
    <path d="M22 6v5h5" />
    <path d="M10 17h12M10 21h8" />
  </svg>
);

const Stands = (p) => (
  <svg {...base} {...p}>
    <path d="M9 4h14v18H9z" />
    <path d="M16 22v6M11 28h10" />
    <path d="M13 9h6M13 13h6M13 17h6" />
  </svg>
);

const Bag = (p) => (
  <svg {...base} {...p}>
    <path d="M7 11h18l-2 17H9z" />
    <path d="M12 11V8a4 4 0 018 0v3" />
  </svg>
);

const Uniform = (p) => (
  <svg {...base} {...p}>
    <path d="M11 4l-6 4 2 6h3v14h12V14h3l2-6-6-4-5 4z" />
  </svg>
);

/* Events — calendar with a sparkle / star above to read as "managed events".
   Replaces the legacy Motion glyph; the export map below keeps `motion` as
   an alias for any old call-site that hasn't been migrated yet. */
const Events = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="7" width="24" height="20" rx="3" />
    <path d="M4 13h24" />
    <path d="M10 4v6M22 4v6" />
    <path d="M16 17l1.1 2.3 2.4.4-1.7 1.7.4 2.4-2.2-1.2-2.2 1.2.4-2.4-1.7-1.7 2.4-.4z" fill="currentColor" stroke="none" />
  </svg>
);

export const AD_ICONS = {
  events: Events,
  motion: Events, // back-compat alias
  identity: Identity,
  print: Print,
  signage: Signage,
  acrylic: Acrylic,
  gifts: Gifts,
  packaging: Packaging,
  uv: UV,
  stickers: Stickers,
  stands: Stands,
  bag: Bag,
  uniform: Uniform,
};
