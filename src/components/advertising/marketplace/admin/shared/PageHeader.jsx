import React from 'react';

/**
 * PageHeader — shared title/subtitle row used at the top of every admin
 * page. Optional right-hand slot for actions (Add buttons, view toggles).
 */
export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="adm-page-head">
      <div>
        {eyebrow && <p className="adm-page-head__eyebrow">{eyebrow}</p>}
        <h1 className="adm-page-head__title">{title}</h1>
        {subtitle && <p className="adm-page-head__sub">{subtitle}</p>}
      </div>
      {children && <div className="adm-page-head__actions">{children}</div>}
    </header>
  );
}
