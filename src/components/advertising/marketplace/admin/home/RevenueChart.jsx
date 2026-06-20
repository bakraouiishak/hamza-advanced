import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { fmtMoney } from '../../../../../lib/format.js';

/**
 * RevenueChart — 14-day area chart of daily revenue. Yellow gradient fill,
 * cream-white stroke, ultra-light grid. Uses our brand tokens directly so
 * it visually matches the rest of the advertising sub-site.
 */
export default function RevenueChart({ data = [] }) {
  const formatted = data.map((d) => ({
    date: d.date,
    short: new Date(d.date).toLocaleDateString('ar-SA-u-nu-latn', { month: 'short', day: '2-digit' }),
    total: d.total,
  }));

  return (
    <div className="adm-chart">
      <div className="adm-chart__head">
        <h3 className="adm-chart__title">الإيرادات اليومية</h3>
        <p className="adm-chart__sub">آخر 14 يومًا — الطلبات المكتملة فقط</p>
      </div>
      <div className="adm-chart__body" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 10, right: 12, left: 12, bottom: 6 }}>
            <defs>
              <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FEFC4F" stopOpacity={0.55} />
                <stop offset="60%"  stopColor="#FEFC4F" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#FEFC4F" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(247,240,245,0.05)" vertical={false} />
            <XAxis
              dataKey="short"
              tickLine={false}
              axisLine={{ stroke: 'rgba(247,240,245,0.10)' }}
              tick={{ fill: 'rgba(247,240,245,0.45)', fontSize: 11 }}
              reversed
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(247,240,245,0.45)', fontSize: 11 }}
              width={48}
              orientation="right"
            />
            <Tooltip
              cursor={{ stroke: 'rgba(254,252,79,0.30)', strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'rgba(11,18,32,0.95)',
                border: '1px solid rgba(254,252,79,0.30)',
                borderRadius: 10,
                fontFamily: 'VIP Hakm, Tajawal, sans-serif',
                color: '#F7F0F5',
              }}
              labelStyle={{ color: '#FEFC4F', fontWeight: 700 }}
              formatter={(v) => [fmtMoney(v), 'الإيراد']}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#FEFC4F"
              strokeWidth={2.5}
              fill="url(#grad-revenue)"
              dot={false}
              activeDot={{ r: 5, fill: '#FEFC4F', stroke: '#0B1220', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
