import React from 'react';

/**
 * LoadingShell — neutral shimmer placeholder used while admin pages fetch
 * their first payload. Two rows + a grid of skeleton cards is enough to
 * convey "data is on the way" without being noisy.
 */
export default function LoadingShell({ rows = 4 }) {
  return (
    <div className="adm-skeleton">
      <div className="adm-skeleton__bar adm-skeleton__bar--lg" />
      <div className="adm-skeleton__bar adm-skeleton__bar--md" />
      <div className="adm-skeleton__grid">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="adm-skeleton__card" />
        ))}
      </div>
    </div>
  );
}
