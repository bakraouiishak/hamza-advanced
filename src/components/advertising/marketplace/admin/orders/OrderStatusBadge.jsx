import React from 'react';

const TONE = {
  Pending:  { bg: 'rgba(254,252,79,0.14)', fg: '#FEFC4F', label: 'قيد الانتظار' },
  Accepted: { bg: 'rgba(91,216,232,0.14)', fg: '#5BD8E8', label: 'مقبول' },
  Done:     { bg: 'rgba(19,189,132,0.16)', fg: '#13BD84', label: 'مكتمل' },
  Rejected: { bg: 'rgba(255,122,147,0.14)', fg: '#FF7A93', label: 'مرفوض' },
};

/**
 * OrderStatusBadge — colored pill matching the brand sub-palette per status.
 */
export default function OrderStatusBadge({ status }) {
  const t = TONE[status] || { bg: 'rgba(247,240,245,0.10)', fg: '#F7F0F5', label: status };
  return (
    <span className="adm-status" style={{ background: t.bg, color: t.fg, borderColor: t.fg + '44' }}>
      <span className="adm-status__dot" style={{ background: t.fg }} />
      {t.label}
    </span>
  );
}
