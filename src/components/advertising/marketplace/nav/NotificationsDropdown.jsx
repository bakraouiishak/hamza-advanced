import React, { useRef, useState } from 'react';
import useClickOutside from './useClickOutside.js';

/**
 * NotificationsDropdown — bell icon in the navbar with an attached popover.
 *
 * No data layer yet (the notifications API isn't built). The component
 * renders a clean empty state today; when the API ships, drop the fetched
 * list into the `items` array in this file and the layout just works.
 *
 * Item shape (future):
 *   { id, title, body, href, read, createdAt }
 */
export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  // Placeholder — to be replaced by useEffect+fetch when the API exists.
  const items = [];
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mk-iconbtn-wrap" ref={ref}>
      <button
        type="button"
        className={`mk-iconbtn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="الإشعارات"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && <span className="mk-iconbtn__dot" aria-label={`${unread} غير مقروء`} />}
      </button>

      {open && (
        <div className="mk-dropdown mk-dropdown--wide" role="menu">
          <header className="mk-dropdown__head">
            <h4>الإشعارات</h4>
            {items.length > 0 && (
              <button type="button" className="mk-dropdown__head-link" aria-disabled="true">
                تعليم الكل كمقروء
              </button>
            )}
          </header>

          {items.length === 0 ? (
            <div className="mk-dropdown__empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p className="mk-dropdown__empty-title">لا توجد إشعارات جديدة</p>
              <p className="mk-dropdown__empty-hint">سنُعلِمك هنا عند تحديث حالة طلباتك أو وصول رسائل من الإدارة.</p>
            </div>
          ) : (
            <ul className="mk-dropdown__list">
              {items.map((n) => (
                <li key={n.id} className={`mk-dropdown__row ${n.read ? '' : 'is-unread'}`}>
                  <strong>{n.title}</strong>
                  <span>{n.body}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
