import React from 'react';

/**
 * Decorative travel paths — small dashed SVG segments scattered in
 * "random" but deliberate spots across the page, each with the Identity
 * Compass animating along it. Sits as a non-interactive overlay between
 * sections to keep the "travel mood" alive without crowding the content.
 *
 * Positioning is absolute, sized in viewport units, with mobile fallbacks
 * that hide a couple of the segments so phones don't get noisy.
 */
const SEGMENTS = [
  {
    id: 's1',
    top: '24%',
    inset: '4%',
    width: '320px',
    height: '120px',
    d: 'M 10 90 Q 90 -10, 200 50 T 310 30',
    dur: 16,
    flip: false,
    hideOnMobile: false,
  },
  {
    id: 's2',
    top: '48%',
    inset: '60%',
    width: '380px',
    height: '140px',
    d: 'M 10 30 Q 120 130, 240 60 T 370 100',
    dur: 22,
    flip: true,
    hideOnMobile: true,
  },
  {
    id: 's3',
    top: '74%',
    inset: '8%',
    width: '420px',
    height: '160px',
    d: 'M 10 130 Q 140 10, 280 90 T 410 40',
    dur: 19,
    flip: false,
    hideOnMobile: true,
  },
];

export default function TrPaths() {
  return (
    <div className="tr-paths" aria-hidden>
      {SEGMENTS.map((s) => (
        <svg
          key={s.id}
          className={`tr-paths__seg ${s.hideOnMobile ? 'is-hide-mobile' : ''}`}
          style={{
            top: s.top,
            insetInlineEnd: s.flip ? 'auto' : s.inset,
            insetInlineStart: s.flip ? s.inset : 'auto',
            width: s.width,
            height: s.height,
          }}
          viewBox={`0 0 ${parseInt(s.width)} ${parseInt(s.height)}`}
          preserveAspectRatio="none"
        >
          <path
            id={`tr-path-${s.id}`}
            d={s.d}
            fill="none"
            stroke="rgba(91, 216, 232, 0.22)"
            strokeWidth="1.4"
            strokeDasharray="5 8"
            strokeLinecap="round"
          />
          <image
            href="/travel/Identity Compass.svg"
            width="30"
            height="30"
            x="-15"
            y="-15"
          >
            <animateMotion dur={`${s.dur}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#tr-path-${s.id}`} />
            </animateMotion>
          </image>
        </svg>
      ))}
    </div>
  );
}
