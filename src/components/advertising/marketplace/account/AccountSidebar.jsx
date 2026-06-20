import React from 'react';
import { useAuth } from '../../../../lib/auth.jsx';

/**
 * AccountSidebar — sticky right-side nav.
 *
 * Minimalist by design: each tab is a row of [icon | label]; the active row
 * gets a yellow bar on its inline-start edge and a soft yellow wash. No
 * heavy borders, no shadows — the rhythm of the icon column carries the
 * structure. A muted divider separates "profile" from "orders".
 */

const ICON = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  ),
  picture: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="10" r="2.2" />
      <path d="M21 17l-5-5-9 9" />
    </svg>
  ),
  personal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  ),
  active: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7h14l-1.5 11.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

const SECTIONS = [
  { group: 'profile', keys: ['home', 'picture', 'personal'] },
  { group: 'orders',  keys: ['active', 'history'] },
];

export default function AccountSidebar({ active, onPick, tabs }) {
  const { user } = useAuth();
  const initial = (user?.name || '?').charAt(0);
  const fullName = `${user?.name || ''} ${user?.surname || ''}`.trim();

  return (
    <aside className="acc-side" role="tablist" aria-orientation="vertical">
      {/* Identity chip — anchors the sidebar visually */}
      <div className="acc-side__id">
        <div className="acc-side__avatar">
          {user?.profileImg
            ? <img src={user.profileImg} alt="" />
            : <span>{initial}</span>}
        </div>
        <div className="acc-side__id-text">
          <strong>{fullName || 'عميل'}</strong>
          <span>{user?.email}</span>
        </div>
      </div>

      <nav className="acc-side__nav">
        {SECTIONS.map((section, idx) => (
          <React.Fragment key={section.group}>
            {idx > 0 && <hr className="acc-side__divider" />}
            {section.keys.map((key) => {
              const t = tabs[key];
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`acc-tab-${key}`}
                  aria-selected={isActive}
                  className={`acc-side__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => onPick(key)}
                >
                  <span className="acc-side__icon">{ICON[key]}</span>
                  <span className="acc-side__label">{t.label}</span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}
