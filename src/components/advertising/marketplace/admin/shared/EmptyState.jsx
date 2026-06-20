import React from 'react';

/**
 * EmptyState — the dashed "لا يوجد بيانات لهذه الصفحة" tile shown on every
 * admin page when the corresponding collection is empty. Sized to fill its
 * parent and stays brand-aligned (yellow stroke on dark background, no
 * pattern / no graphic per the design brief).
 */
export default function EmptyState({
  message = 'لا يوجد بيانات لهذه الصفحة',
  hint = null,
  icon = null,
}) {
  return (
    <div className="adm-empty" role="status">
      <div className="adm-empty__icon">
        {icon || (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9h18M9 3v18" />
          </svg>
        )}
      </div>
      <p className="adm-empty__msg">{message}</p>
      {hint && <p className="adm-empty__hint">{hint}</p>}
    </div>
  );
}
