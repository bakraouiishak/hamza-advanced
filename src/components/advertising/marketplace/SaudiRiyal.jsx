import React from 'react';

/**
 * SaudiRiyal — inline SVG of the official Saudi Riyal symbol (SAMA).
 *
 * Sizing rule:  height always equals the surrounding font-size (`1em`).
 * Color rule:   inherits `currentColor` so it matches whatever text it sits next to.
 * Spacing rule: a small gap (0.25em ≈ ⅓ of symbol height) separates it from the numeral.
 *
 * Props:
 *   size — explicit px override; when omitted the icon uses `1em`.
 *   className — extra className forwarded to the wrapper <svg>.
 *   style — extra inline styles forwarded to the wrapper <svg>.
 */
export default function SaudiRiyal({ size, className = '', style = {} }) {
  const h = size != null ? `${size}px` : '1em';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1124.14 1256.39"
      aria-hidden="true"
      focusable="false"
      className={`saudi-riyal-icon ${className}`.trim()}
      style={{
        height: h,
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    >
      <path
        fill="currentColor"
        d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
      />
      <path
        fill="currentColor"
        d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
      />
    </svg>
  );
}
