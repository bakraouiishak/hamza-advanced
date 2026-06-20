import React from 'react';

/**
 * StatCard — one KPI tile. Big number, label below, optional trend tag.
 * The card has a subtle yellow→transparent gradient on its top edge.
 */
export default function StatCard({ label, value, hint = null, icon = null, accent = 'yellow' }) {
  return (
    <div className={`adm-stat adm-stat--${accent}`}>
      <div className="adm-stat__top">
        <span className="adm-stat__label">{label}</span>
        {icon && <span className="adm-stat__icon">{icon}</span>}
      </div>
      <div className="adm-stat__value">{value}</div>
      {hint && <div className="adm-stat__hint">{hint}</div>}
    </div>
  );
}
