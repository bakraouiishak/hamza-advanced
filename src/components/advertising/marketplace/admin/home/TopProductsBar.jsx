import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import EmptyState from '../shared/EmptyState.jsx';

/**
 * TopProductsBar — horizontal bar chart of the 5 best-selling products
 * (units sold across completed orders). Bars are filled with a yellow
 * gradient that fades from the brand accent into a darker tone.
 */
export default function TopProductsBar({ data = [] }) {
  if (!data.length) {
    return (
      <div className="adm-chart">
        <div className="adm-chart__head">
          <h3 className="adm-chart__title">المنتجات الأكثر مبيعًا</h3>
          <p className="adm-chart__sub">أعلى 5 منتجات حسب عدد الوحدات</p>
        </div>
        <div className="adm-chart__body" style={{ minHeight: 220 }}>
          <EmptyState message="لا يوجد بيانات لهذه الصفحة" />
        </div>
      </div>
    );
  }

  return (
    <div className="adm-chart">
      <div className="adm-chart__head">
        <h3 className="adm-chart__title">المنتجات الأكثر مبيعًا</h3>
        <p className="adm-chart__sub">أعلى 5 منتجات حسب عدد الوحدات المباعة</p>
      </div>
      <div className="adm-chart__body" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="grad-top" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#FEFC4F" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#FEFC4F" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(247,240,245,0.45)', fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(247,240,245,0.7)', fontSize: 12 }}
              width={120}
              orientation="right"
            />
            <Tooltip
              cursor={{ fill: 'rgba(254,252,79,0.05)' }}
              contentStyle={{
                background: 'rgba(11,18,32,0.95)',
                border: '1px solid rgba(254,252,79,0.30)',
                borderRadius: 10,
                fontFamily: 'VIP Hakm, Tajawal, sans-serif',
                color: '#F7F0F5',
              }}
              labelStyle={{ color: '#FEFC4F', fontWeight: 700 }}
              formatter={(v) => [v, 'الوحدات']}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="url(#grad-top)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
