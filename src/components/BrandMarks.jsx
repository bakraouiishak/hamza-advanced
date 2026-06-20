import React from 'react';

/**
 * Sector marks — minimal SVG glyphs derived from the PDF logo-variant pages
 * (p.39–43). Each is a single-color outline that re-tints via `currentColor`,
 * so a sector card paints itself by setting CSS color on its parent.
 */

const base = { width: 28, height: 28, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const HamzaMark = (props) => (
  // Stylised "ء" hamza on a circle — connector dot at the joint
  <svg {...base} {...props}>
    <circle cx="16" cy="16" r="12" />
    <path d="M11 13c1.6-2 4.8-2 5.6 0 .7 1.6-.6 2.6-1.7 3.3-1 .6-1.4 1.4-1.4 2.4" />
    <circle cx="13.5" cy="22" r="1.2" fill="currentColor" />
  </svg>
);

export const AdvertisingMark = (props) => (
  // Color wheel — Advertising (PDF p.39)
  <svg {...base} {...props}>
    <circle cx="16" cy="16" r="11" />
    <path d="M16 5v22M5 16h22M8 8l16 16M24 8L8 24" />
  </svg>
);

export const EventsMark = (props) => (
  // Speech bubble + 4-point star (PDF p.40)
  <svg {...base} {...props}>
    <path d="M6 8h20v14H14l-5 5v-5H6z" />
    <path d="M16 12l1.4 2.6L20 16l-2.6 1.4L16 20l-1.4-2.6L12 16l2.6-1.4z" fill="currentColor" stroke="none" />
  </svg>
);

export const ElectricMark = (props) => (
  // Power bolt (PDF p.42)
  <svg {...base} {...props}>
    <path d="M17 4l-9 14h7l-1 10 9-14h-7z" />
  </svg>
);

export const TravelMark = (props) => (
  // Compass (PDF p.41)
  <svg {...base} {...props}>
    <circle cx="16" cy="16" r="11" />
    <path d="M20 12l-2 6-6 2 2-6z" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
);

export const CateringMark = (props) => (
  // Buffet dome with missing slice (PDF p.43)
  <svg {...base} {...props}>
    <path d="M5 22h22" />
    <path d="M7 22a9 9 0 0 1 18 0" />
    <path d="M16 13v-3" />
    <path d="M22 18a6 6 0 0 0-2-4" strokeDasharray="2 2.5" />
  </svg>
);

export const MARK_BY_ID = {
  main: HamzaMark,
  ads: AdvertisingMark,
  events: EventsMark,
  electric: ElectricMark,
  travel: TravelMark,
  catering: CateringMark,
};

/**
 * Full brand wordmark — used in the navbar.
 * Composes the hamza glyph + Arabic wordmark "الهمزة المتطورة" with the
 * brand green dot accent (PDF p.23).
 */
export const HamzaWordmark = ({ className = '', dark = true }) => {
  return (
    <div className={`inline-flex items-center ${className}`} aria-label="الهمزة المتطورة">
      <img 
        src="/images/logos svg/hamza advanced svg.svg" 
        alt="Hamza Advanced Logo" 
        className="h-10 w-auto object-contain"
        style={{ filter: dark ? 'none' : 'invert(1)' }} // Simple fallback if the logo needs to be dark
      />
    </div>
  );
};
