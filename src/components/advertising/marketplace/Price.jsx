import React from 'react';
import SaudiRiyal from './SaudiRiyal.jsx';
import { fmtNum } from '../../../lib/format.js';

/**
 * Price — renders a formatted monetary value with the Saudi Riyal icon.
 *
 * Layout (LTR visual order, for an RTL page the flex handles direction):
 *   [﷼ icon]  19,900
 *
 * Props:
 *   value     — numeric value (number | string | null).
 *   className — extra className on the wrapper <span>.
 *   style     — extra inline styles on the wrapper <span>.
 *   size      — explicit px override for the icon; defaults to 1em (= font-size).
 */
export default function Price({ value, className = '', style = {}, size }) {
  if (value == null) return '—';

  return (
    <span
      className={`price-with-riyal ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25em',
        direction: 'ltr',
        unicodeBidi: 'isolate',
        ...style,
      }}
    >
      <SaudiRiyal size={size} />
      <span>{fmtNum(value)}</span>
    </span>
  );
}
