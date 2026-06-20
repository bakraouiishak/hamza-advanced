import React, { useMemo, useState } from 'react';
import { fmtNum } from '../../../../../lib/format.js';

/**
 * Sparkline — minimalist SVG area+line chart, no external libs.
 *
 * Renders the 14-day spend series as a soft yellow gradient fill under a
 * sharp yellow stroke, with a hover crosshair that surfaces the exact day
 * and value. Designed to be light: one <svg>, ~60 lines of geometry.
 */
const W = 600;
const H = 160;
const PAD = { top: 18, right: 12, bottom: 22, left: 12 };

export default function Sparkline({ data }) {
  const [hover, setHover] = useState(null);

  const { points, maxVal, polyline, area } = useMemo(() => {
    const vals = (data || []).map((d) => d.total);
    const maxVal = Math.max(1, ...vals); // avoid /0 when all zero
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

    const points = data.map((d, i) => {
      const x = PAD.left + i * stepX;
      const y = PAD.top + innerH - (d.total / maxVal) * innerH;
      return { x, y, d };
    });

    const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
    const area = `${PAD.left},${PAD.top + innerH} ${polyline} ${PAD.left + (data.length - 1) * stepX},${PAD.top + innerH}`;
    return { points, maxVal, polyline, area };
  }, [data]);

  const isAllZero = points.every((p) => p.d.total === 0);

  return (
    <div className="acc-spark">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="acc-spark__svg"
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="مخطط المصاريف اليومية"
      >
        <defs>
          <linearGradient id="acc-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#FEFC4F" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#FEFC4F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline (dashed) */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={H - PAD.bottom}
          y2={H - PAD.bottom}
          stroke="rgba(247,240,245,0.12)"
          strokeDasharray="3 4"
        />

        {!isAllZero && (
          <>
            <polygon points={area} fill="url(#acc-spark-fill)" />
            <polyline
              points={polyline}
              fill="none"
              stroke="#FEFC4F"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}

        {/* invisible hover hit-areas — one per day */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - 14}
            y={0}
            width={28}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}

        {/* hover crosshair + dot */}
        {hover != null && (
          <>
            <line
              x1={points[hover].x}
              x2={points[hover].x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="rgba(254,252,79,0.4)"
              strokeWidth="1"
            />
            <circle
              cx={points[hover].x}
              cy={points[hover].y}
              r="4"
              fill="#FEFC4F"
              stroke="#0B1220"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {/* X-axis date labels — first / mid / last only, to avoid crowding */}
      <div className="acc-spark__axis">
        <span>{dateLabel(points[0]?.d.date)}</span>
        <span>{dateLabel(points[Math.floor(points.length / 2)]?.d.date)}</span>
        <span>{dateLabel(points[points.length - 1]?.d.date)}</span>
      </div>

      {/* tooltip — sits under the chart so RTL flow stays predictable */}
      <div className="acc-spark__tip" aria-live="polite">
        {hover != null ? (
          <>
            <strong>{fmtNum(points[hover].d.total)} ﷼</strong>
            <span>{dateLabel(points[hover].d.date, true)}</span>
          </>
        ) : (
          <span className="acc-spark__tip-idle">
            {isAllZero ? 'لا توجد مصاريف خلال آخر 14 يومًا.' : 'مرّر الفأرة لعرض التفاصيل'}
          </span>
        )}
      </div>
    </div>
  );
}

function dateLabel(iso, full = false) {
  if (!iso) return '';
  const d = new Date(iso);
  const opts = full
    ? { day: '2-digit', month: 'short', year: 'numeric' }
    : { day: '2-digit', month: 'short' };
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', opts).format(d);
}
