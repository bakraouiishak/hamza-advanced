import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { rotate } from 'three/tsl';

/**
 * HamzaWheel — interactive radial wheel inspired by the Figma reference.
 *
 * Layout: an 8-wedge wheel (only the LEFT half is visible — the parent
 * container crops the right half, since the wheel is on the right edge of the screen).
 * The 5 visible wedges on the left are:
 *
 *   V6  top            →  الدعاية والاعلان         #FEFC4F
 *   V7  top-left       →  ادارة واقامة الفعاليات    #EE4266
 *   V0  left           →  السفر والسياحة            #2ADBD6
 *   V1  bottom-left    →  الكهرباء                  #008CFF
 *   V2  bottom         →  التموين والاعاشة           #D79F56
 *
 * Hover behaviour:
 *   • Static state    — ALL wedges (including center) filled with brand-system GREEN.
 *   • Whole Wheel     — When hovered, all wedges turn to deactivated dark colour.
 *   • Hovered wedge   — Transforms into a rich card: dimmed BG image + title text + icon.
 *   • Other wedges    — further dim/desaturate.
 *   • Hidden wedges   — fade to ~8%.
 *
 * NOTE: All 5 visible sectors now use the "image+text inside wedge" treatment.
 * Each wedge has its own layout config (foLayout, iconPos) to match its orientation.
 */

const WHEEL_SECTORS = [
  {
    id: 'V6',
    sectorId: 'ads',
    accent: '#FEFC4F',
    accentRgb: '254,252,79',
    icon: '/images/hero_section_svgs/Advertising SVG.svg',
    bgImage: '/images/slogan sectors/advertising.jpg',
    lines: ['الهمزة', 'المتطورة', 'للدعاية', 'والاعلان'],
    badgeRight: '56%',
    badgeTop: '6%',
    transform: 'translate(189.714, 0)',
    d: 'M9.71251 7.02818C2.14525 8.9431 -1.89127 17.408 0.871688 24.7377L54.1796 145.749C64.9269 144.374 75.5122 144.378 86.1945 145.844L139.433 24.9931C142.55 17.7732 138.386 9.21626 130.789 7.26258C91.6496 -2.11007 50.4105 -2.64574 9.71251 7.02818Z',
    useInWedgeContent: true,
    // V6 (top wedge) — text centered, icon at bottom-right
    imgBox: { x: -10, y: -10, width: 170, height: 180 },
    foBox: { x: 8, y: 10, width: 130, height: 140 },
    foLayout: 'column',       // 'column' = icon below text, 'row' = icon beside text
    iconPos: 'bottom',        // where the icon sits relative to text
  },
  {
    id: 'V7',
    sectorId: 'events',
    accent: '#EE4266',
    accentRgb: '238,66,102',
    icon: '/images/hero_section_svgs/Event Administration SVG.svg',
    bgImage: '/images/slogan sectors/events.jpg',
    lines: ['الهمزة', 'المتطورة', 'لإدارة وإقامة', 'الفعاليات'],
    badgeRight: '80%',
    badgeTop: '16%',
    transform: 'translate(36.612, 36.458)',
    d: 'M87.3271 1.84821C51.6722 23.709 22.7296 53.4109 1.8663 87.5389C-2.33894 94.1481 0.901006 103.176 8.19496 106.061L131.295 153.862C137.772 145.373 145.117 137.739 153.846 131.127L106.097 8.20426C103.026 1.03173 94.1033 -2.38196 87.3271 1.84821Z',
    useInWedgeContent: true,
    // V7 (top-left wedge) — text centered, icon at bottom-right
    imgBox: { x: -20, y: -10, width: 200, height: 190 },
    foBox: { x: 12, y: 8, width: 145, height: 148 },
    foLayout: 'column',
    iconPos: 'bottom',
    titleAlign: 'flex-start',
    titleOffsetY: 20,
    titleOffsetX: 16,
    iconOffsetX: 40,
  },
  {
    id: 'V0',
    sectorId: 'travel',
    accent: '#2ADBD6',
    accentRgb: '42,219,214',
    icon: '/images/hero_section_svgs/Travel & Tourism SVG.svg',
    bgImage: '/images/slogan sectors/tourism.jpg',
    lines: ['الهمزة', 'المتطورة', 'للسفر', 'والسياحة'],
    badgeRight: '85%',
    badgeTop: '40%',
    transform: 'translate(0, 189.867)',
    d: 'M7.26843 9.60154C8.24554 5.80261 10.7757 2.76558 14.0911 1.27006C17.4065 -0.22546 21.3501 -0.487779 24.997 0.954476L145.863 54.2064C144.393 64.8947 144.386 75.4856 145.756 86.238L24.7258 139.538C17.397 142.302 8.93392 138.266 7.02017 130.698C-2.6475 89.9943 -2.1072 48.7485 7.26843 9.60154Z',
    // V0 uses the new in-wedge content (image + text + icon INSIDE the wedge)
    useInWedgeContent: true,
    imgBox: { x: -30, y: -30, width: 210, height: 200 },
    foBox: { x: -5, y: 5, width: 160, height: 130 },
    foLayout: 'row',
    iconPos: 'right',
    titleOffsetY: -4,
  },
  {
    id: 'V1',
    sectorId: 'electric',
    accent: '#008CFF',
    accentRgb: '0,140,255',
    icon: '/images/hero_section_svgs/Electricity SVG.svg',
    bgImage: '/images/slogan sectors/electricity.jpg',
    lines: ['الهمزة', 'المتطورة', 'للكهرباء'],
    badgeRight: '80%',
    badgeBottom: '16%',
    transform: 'translate(36.425, 329.676)',
    d: 'M1.84718 66.4894C-2.38154 59.7126 1.03262 50.7882 8.20434 47.7156L7.89608 47.8727L131.122 0C137.727 8.73121 145.355 16.0768 153.836 22.5547L106.034 145.622C103.149 152.918 94.1218 156.159 87.5142 151.954C53.3942 131.091 23.7004 102.148 1.84718 66.4894Z',
    useInWedgeContent: true,
    // V1 (bottom-left wedge) — icon at top-right, text below
    imgBox: { x: -20, y: -15, width: 200, height: 190 },
    foBox: { x: 28, y: -44, width: 150, height: 150 },
    foLayout: 'row',
    iconPos: 'bottom',
    iconOffsetX: -20,
    iconOffsetY: 0,
    titleOffsetY: 40,
  },
  {
    id: 'V2',
    sectorId: 'catering',
    accent: '#D79F56',
    accentRgb: '215,159,86',
    icon: '/images/hero_section_svgs/Cattering SVG.svg',
    bgImage: '/images/slogan sectors/cattering.jpg',
    lines: ['الهمزة', 'المتطورة', 'للتموين', 'والاعاشة'],
    badgeRight: '56%',
    badgeBottom: '4%',
    transform: 'translate(189.796, 374.155)',
    d: 'M1.04235 120.852L54.2798 0C64.9621 1.46674 75.5474 1.47048 86.2947 0.0952759L139.603 121.107C142.366 128.437 138.33 136.902 130.763 138.816C90.0646 148.49 48.8255 147.955 9.68597 138.582C2.08956 136.628 -2.07519 128.071 1.04235 120.852Z',
    useInWedgeContent: true,
    // V2 (bottom wedge) — icon at top-center, text below
    imgBox: { x: -10, y: -15, width: 170, height: 180 },
    foBox: { x: 10, y: 2, width: 125, height: 135 },
    foLayout: 'column-reverse',
    iconPos: 'top',
    HamzaWheel: { rotate: 90},
  },
];

/* The 3 vectors on the (clipped) right half of the wheel — purely decorative. */
const HIDDEN_VECTORS = [
  {
    id: 'V5',
    transform: 'translate(329.086, 36.558)',
    d: 'M55.9353 0.955077C52.4629 2.14229 49.543 4.79543 47.8679 8.36757L0 131.46C8.48179 137.938 16.1094 145.284 22.7146 154.015L146.006 106.117C153.177 103.045 156.592 94.1202 152.363 87.3434C130.51 51.6853 100.816 22.7414 66.6959 1.87865C63.2757 -0.261731 59.4833 -0.464845 56.0109 0.722369L55.9353 0.955077Z',
  },
  {
    id: 'V4',
    transform: 'translate(374.137, 189.706)',
    d: 'M0.107178 54.1703C1.47765 64.9227 1.46997 75.5136 0 86.2019L120.866 139.456C128.084 142.573 136.64 138.407 138.594 130.809C147.97 91.662 148.51 50.4161 138.842 9.71262C136.929 2.14435 128.466 -1.89187 121.137 0.872377L0.107178 54.1703Z',
  },
  {
    id: 'V3',
    transform: 'translate(329.355, 329.387)',
    d: 'M22.5515 0C16.0738 8.48861 8.72916 16.123 0 22.7348L47.9243 145.996C50.9956 153.168 59.9181 156.582 66.6943 152.352C102.349 130.491 131.292 100.789 152.155 66.6612C156.36 60.052 153.12 51.0237 145.826 48.1392L22.7262 0.343079L22.5515 0Z',
  },
];

const CENTER = {
  transform: 'translate(200.679, 201.484)',
  d: 'M41.5231 117.237C73.0762 127.49 106.967 110.218 117.221 78.66C127.475 47.1021 110.208 13.2082 78.6553 2.95596C47.1022 -7.29631 13.211 9.97533 2.95721 41.5333C-7.29654 73.0912 9.97001 106.985 41.5231 117.237Z',
};

const STROKE_FAINT = 'rgba(247,240,245,0.10)';

export default function HamzaWheel({ activeSectorId, onSectorClick }) {
  const [hoveredId, setHoveredId] = useState(null);
  const hovered = hoveredId ? WHEEL_SECTORS.find((s) => s.id === hoveredId) : null;

  // Map the externally-controlled sector id ('ads', 'electric'…) back to the
  // wheel-internal id ('V6', 'V1'…). When set, that wedge stays accent-coloured
  // after the mouse leaves and the others sit in the deactivated dark state.
  const selectedWheelId = activeSectorId
    ? (WHEEL_SECTORS.find((s) => s.sectorId === activeSectorId)?.id || null)
    : null;

  // The wedge currently "in focus" visually — hover wins over selection.
  const activeWedgeId = hoveredId || selectedWheelId;

  const handleEnter = useCallback((id) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback((sectorId) => {
    if (onSectorClick) onSectorClick(sectorId);
  }, [onSectorClick]);

  return (
    <div
      className="hamza-wheel-root"
      data-hovered={hoveredId || undefined}
      data-selected={selectedWheelId || undefined}
      style={{
        transform: activeWedgeId ? 'translateY(20px) translateX(-50px) scale(1)' : 'translateY(20px) translateX(-30px) scale(0.95)',
        transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
        width: '100%',
        height: '100%'
      }}
    >
      <svg
        viewBox="-10 -10 560 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="hamza-wheel-svg"
        style={{ overflow: 'hidden' }}
      >
        <defs>
          {WHEEL_SECTORS.map((s) => (
            <React.Fragment key={`defs-${s.id}`}>
              {/* Accent gradient for legacy hover behaviour */}
              <linearGradient
                id={`g-${s.id}`}
                x1="0%" y1="0%" x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={s.accent} stopOpacity="1" />
                <stop offset="100%" stopColor={s.accent} stopOpacity="0.22" />
              </linearGradient>

              {/* clipPath for in-wedge image content */}
              <clipPath id={`clip-${s.id}`}>
                <path d={s.d} />
              </clipPath>
            </React.Fragment>
          ))}
          {/* Green gradient for static state */}
          <linearGradient id="g-static-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39DC8E" stopOpacity="1" />
            <stop offset="100%" stopColor="#39DC8E" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── Hidden right-half wedges ── */}
        {HIDDEN_VECTORS.map((v) => (
          <g
            key={v.id}
            transform={v.transform}
            style={{
              pointerEvents: 'none',
              opacity: activeWedgeId ? 0.08 : 1,
              transition: 'opacity 280ms ease',
            }}
          >
            <path
              d={v.d}
              fill={activeWedgeId ? '#162036' : 'url(#g-static-green)'}
              stroke={activeWedgeId ? STROKE_FAINT : 'none'}
              strokeWidth={activeWedgeId ? 0.8 : 0}
              style={{ transition: 'fill 1s ease-in-out, stroke 1s ease-in-out' }}
            />
          </g>
        ))}

        {/* ── Visible left-half wedges ── */}
        {WHEEL_SECTORS.map((s) => {
          const isHover = hoveredId === s.id;
          const isSelected = !hoveredId && selectedWheelId === s.id;
          const isActive = isHover || isSelected;
          const otherActive = activeWedgeId && !isActive;
          const usesInWedge = s.useInWedgeContent;

          return (
            <g
              key={s.id}
              transform={s.transform}
              onMouseEnter={() => handleEnter(s.id)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(s.sectorId)}
              style={{
                cursor: 'pointer',
                opacity: otherActive ? 0.18 : 1,
                transition: 'opacity 280ms ease',
              }}
            >
              {/*
                Use the ACTUAL wedge path as the hit area with a generous invisible
                stroke so hovering near the wedge edge also triggers.
                onClick is wired here too (not only on the parent <g>) because on
                some browsers the SVG <image> overlay can swallow click events
                before they bubble — most visible for V6 (top/ads wedge) where the
                image-to-wedge ratio is largest.
              */}
              <path
                d={s.d}
                fill="transparent"
                stroke="transparent"
                strokeWidth="24"
                onClick={() => handleClick(s.sectorId)}
                onMouseEnter={() => handleEnter(s.id)}
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
              />

              {/* ─── In-wedge content mode (image + text + icon) ─── */}
              {usesInWedge && isHover && (
                <>
                  {/* Dimmed background image clipped to wedge shape */}
                  <g clipPath={`url(#clip-${s.id})`}>
                    <image
                      href={s.bgImage}
                      x={s.imgBox.x}
                      y={s.imgBox.y}
                      width={s.imgBox.width}
                      height={s.imgBox.height}
                      preserveAspectRatio="xMidYMid slice"
                      style={{
                        filter: 'brightness(0.25) saturate(0.5)',
                      }}
                    />
                    {/* Dark overlay gradient for readability — directional fade */}
                    <path
                      d={s.d}
                      fill="rgba(11,18,32,0.45)"
                    />
                  </g>
                </>
              )}

              {/* Glow layer — a blurred copy of the path that fades in on hover/selection */}
              {usesInWedge && isHover ? (
                /* Subtle outer glow for in-wedge sectors when hovered */
                <path
                  d={s.d}
                  fill="none"
                  stroke={s.accent}
                  strokeWidth="3"
                  style={{
                    filter: 'blur(8px)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                />
              ) : (
                <path
                  d={s.d}
                  fill={s.accent}
                  style={{
                    filter: 'blur(8px)',
                    opacity: isActive ? 0.5 : 0,
                    transition: 'opacity 1s ease',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Visible path — green (idle) → in-wedge image (hover) → solid accent (selected) → dim (other) */}
              <path
                d={s.d}
                fill={
                  usesInWedge && isHover
                    ? 'transparent'  // image is behind; path is just for stroke
                    : isSelected
                      ? s.accent
                      : isHover
                        ? `url(#g-${s.id})`
                        : activeWedgeId
                          ? '#162036'
                          : 'url(#g-static-green)'
                }
                stroke={
                  isActive
                    ? s.accent
                    : activeWedgeId
                      ? STROKE_FAINT
                      : 'none'
                }
                strokeWidth={isActive ? (usesInWedge && isHover ? 1.5 : 1.2) : 0}
                style={{
                  transition: 'fill 1s ease-in-out, stroke 1s ease-in-out, stroke-width 1s ease-in-out',
                  pointerEvents: 'fill',
                }}
              />

              {/* ─── In-wedge text & icon overlay (foreignObject) ─── */}
              {usesInWedge && isHover && (
                <foreignObject
                  x={s.foBox.x}
                  y={s.foBox.y}
                  width={s.foBox.width}
                  height={s.foBox.height}
                  style={{ pointerEvents: 'none', overflow: 'visible' }}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: s.foLayout === 'row' ? 'row' : 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      direction: 'ltr',
                      padding: s.foLayout === 'row' ? '0 12px 0 6px' : '6px 8px',
                      boxSizing: 'border-box',
                      gap: s.foLayout === 'row' ? '4px' : '4px',
                    }}
                  >
                    {/* Icon first when iconPos is 'top' (column-reverse layout renders icon above text) */}
                    {s.iconPos === 'top' && (
                      <div>
                        <img
                          src={s.icon}
                          alt=""
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain',
                            transform: s.id !== 'V0' ? 'scale(1.1)' : 'none',
                          }}
                        />
                      </div>
                    )}
                    {/* Sector title lines */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: s.titleAlign || 'center',
                      gap: '0px',
                      lineHeight: '1.30',
                      flex: s.foLayout === 'row' ? '1' : 'unset',
                      transform: s.titleOffsetY ? `translateY(${s.titleOffsetY}px)` : 'none',
                    }}>
                      {s.lines.map((line, i) => (
                        <span
                          key={i}
                          style={{
                            fontFamily: "'VIP Hakm'",
                            fontSize: s.foLayout === 'row' ? '16px' : '14px',
                            fontWeight: 700,
                            color: s.accent,
                            whiteSpace: 'nowrap',
                            textShadow: `0 0 8px rgba(${s.accentRgb}, 0.5)`,
                            lineHeight: '1.35',
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    {/* Icon when positioned to the right or bottom */}
                    {(s.iconPos === 'right' || s.iconPos === 'bottom') && (
                      <div style={{
                        transform: s.iconOffsetX ? `translateX(${s.iconOffsetX}px)` : 'none',
                      }}>
                        <img
                          src={s.icon}
                          alt=""
                          style={{
                            width: s.iconPos === 'right' ? '60px' : '50px',
                            height: s.iconPos === 'right' ? '60px' : '50px',
                            objectFit: 'contain',
                            transform: s.id !== 'V0' ? 'scale(1.2)' : 'none',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        {/* ── Center ellipse ── */}
        <g transform={CENTER.transform} style={{ pointerEvents: 'none' }}>
          {(() => {
            // Highlight the centre with the active wedge's accent, falling back
            // to hover, then to a stored selection — otherwise the brand green.
            const focus = hovered
              || (selectedWheelId && WHEEL_SECTORS.find((s) => s.id === selectedWheelId))
              || null;
            return (
              <>
                <path
                  d={CENTER.d}
                  fill={focus ? focus.accent : '#13BD84'}
                  style={{
                    filter: 'blur(10px)',
                    opacity: focus ? 0.50 : 0,
                    transition: 'opacity 320ms ease, fill 320ms ease',
                  }}
                />
                <path
                  d={CENTER.d}
                  fill={focus ? focus.accent : (activeWedgeId ? '#0F1A2C' : 'url(#g-static-green)')}
                  stroke={focus ? focus.accent : 'rgba(247,240,245,0.06)'}
                  strokeWidth="1"
                  style={{ transition: 'fill 320ms ease, stroke 320ms ease' }}
                />
              </>
            );
          })()}
        </g>
      </svg>

    </div>
  );
}
