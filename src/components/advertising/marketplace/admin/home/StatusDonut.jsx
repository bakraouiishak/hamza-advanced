import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fmtInt } from '../../../../../lib/format.js';

const STATUS_COLORS = {
  Pending:  '#FEFC4F',  // brand yellow
  Accepted: '#5BD8E8',  // travel cyan (existing brand sub-accent)
  Done:     '#13BD84',  // emerald (parent brand)
  Rejected: '#FF7A93',  // catering rose (existing brand sub-accent)
};
const STATUS_LABEL = {
  Pending:  'قيد الانتظار',
  Accepted: 'مقبول',
  Done:     'مكتمل',
  Rejected: 'مرفوض',
};

/**
 * StatusDonut — donut chart of orders grouped by status. Stays muted when
 * empty (renders a single grey ring with a "—" inside).
 */
export default function StatusDonut({ data = [] }) {
  const total = data.reduce((a, r) => a + r.count, 0);
  const slices = total > 0
    ? data.map((d) => ({ ...d, label: STATUS_LABEL[d.status] || d.status }))
    : [{ status: 'empty', count: 1, label: 'لا يوجد' }];

  return (
    <div className="adm-chart">
      <div className="adm-chart__head">
        <h3 className="adm-chart__title">حالة الطلبات</h3>
        <p className="adm-chart__sub">توزيع الطلبات حسب الحالة</p>
      </div>
      <div className="adm-chart__body adm-chart__body--center" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              paddingAngle={total ? 2 : 0}
              stroke="rgba(11,18,32,0.85)"
              strokeWidth={2}
            >
              {slices.map((s, i) => (
                <Cell
                  key={i}
                  fill={total === 0 ? 'rgba(247,240,245,0.06)' : STATUS_COLORS[s.status]}
                />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                contentStyle={{
                  background: 'rgba(11,18,32,0.95)',
                  border: '1px solid rgba(254,252,79,0.30)',
                  borderRadius: 10,
                  fontFamily: 'VIP Hakm, Tajawal, sans-serif',
                  color: '#F7F0F5',
                }}
                labelStyle={{ color: '#FEFC4F' }}
                formatter={(v, _n, ctx) => [fmtInt(v), ctx.payload.label]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="adm-chart__center">
          <span className="adm-chart__center-num">{fmtInt(total)}</span>
          <span className="adm-chart__center-lbl">إجمالي الطلبات</span>
        </div>
      </div>
      <ul className="adm-chart__legend">
        {data.map((d) => (
          <li key={d.status}>
            <span className="adm-chart__legend-dot" style={{ background: STATUS_COLORS[d.status] }} />
            {STATUS_LABEL[d.status]}
            <strong>{fmtInt(d.count)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
