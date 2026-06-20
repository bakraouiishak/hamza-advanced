import React, { useMemo } from 'react';
import { fmtInt } from '../../../../../lib/format.js';

/**
 * StatusDonut — 4-slice SVG donut of order-status mix.
 *
 * Pure geometry, no chart lib. The total goes in the center, and a legend
 * to the inline-start lists each status with its colored chip and count.
 */
const STATUS_LABEL = {
  Pending:  'قيد الانتظار',
  Accepted: 'مقبول',
  Done:     'مكتمل',
  Rejected: 'مرفوض',
};
const STATUS_COLOR = {
  Pending:  '#FEFC4F',
  Accepted: '#5BD8E8',
  Done:     '#13BD84',
  Rejected: '#FF7A93',
};

const SIZE = 180;
const R = 72;
const STROKE = 18;
const CIRC = 2 * Math.PI * R;

export default function StatusDonut({ data }) {
  const { total, segments } = useMemo(() => {
    const total = data.reduce((a, r) => a + r.count, 0);
    if (total === 0) return { total: 0, segments: [] };

    let acc = 0;
    const segments = data.map((row) => {
      const frac = row.count / total;
      const dash = frac * CIRC;
      const gap = CIRC - dash;
      // rotate so first slice starts at 12 o'clock; subsequent slices stack
      const rotation = (acc / total) * 360 - 90;
      acc += row.count;
      return { ...row, dash, gap, rotation };
    });
    return { total, segments };
  }, [data]);

  if (total === 0) {
    return (
      <div className="acc-donut acc-donut--empty">
        <div className="acc-donut__placeholder" aria-hidden>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="rgba(247,240,245,0.08)"
              strokeWidth={STROKE}
            />
          </svg>
        </div>
        <p className="acc-donut__empty-text">لا توجد طلبات بعد.</p>
      </div>
    );
  }

  return (
    <div className="acc-donut">
      <div className="acc-donut__ring">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          {/* track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(247,240,245,0.06)"
            strokeWidth={STROKE}
          />
          {/* segments */}
          {segments.map((s) => (
            s.count === 0 ? null : (
              <circle
                key={s.status}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={STATUS_COLOR[s.status]}
                strokeWidth={STROKE}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeLinecap="butt"
                transform={`rotate(${s.rotation} ${SIZE / 2} ${SIZE / 2})`}
              />
            )
          ))}
        </svg>
        <div className="acc-donut__center">
          <strong>{fmtInt(total)}</strong>
          <span>طلب</span>
        </div>
      </div>

      <ul className="acc-donut__legend">
        {segments.map((s) => (
          <li key={s.status}>
            <span className="acc-donut__chip" style={{ background: STATUS_COLOR[s.status] }} />
            <span className="acc-donut__name">{STATUS_LABEL[s.status]}</span>
            <span className="acc-donut__count">{fmtInt(s.count)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
