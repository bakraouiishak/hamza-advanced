import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../lib/auth.jsx';
import useClickOutside from './useClickOutside.js';

/**
 * UserMenu — shown in the navbar when the customer is signed in.
 *
 * Layout (right → left in RTL):
 *   [avatar] | [welcome line + name]
 *
 * The welcome line "أهلا بك مجددا!" sits ABOVE the name in brand yellow.
 * The avatar is the click target — opens a dropdown with:
 *   • طلباتي       (my orders)
 *   • حسابي        (my account / profile)
 *   • المفضّلة     (wishlist — suggested addition)
 *   • horizontal divider
 *   • تسجيل الخروج (logout) — the only active item for now; the others
 *     point to pages that haven't been built yet, so they're disabled
 *     placeholders matching the existing pattern across the marketplace.
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  if (!user) return null;

  const initial = (user.name || '?').charAt(0);
  const fullName = `${user.name || ''} ${user.surname || ''}`.trim();

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/sectors/advertising/marketplace/signin', { replace: true });
  };

  return (
    <div className="mk-user" ref={ref}>
      {/* Trigger — clicking the avatar (or the name) opens the menu */}
      <button
        type="button"
        className={`mk-user__trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="mk-user__avatar">
          {user.profileImg
            ? <img src={user.profileImg} alt="" />
            : <span>{initial}</span>}
        </div>
        <div className="mk-user__greeting">
          <span className="mk-user__welcome">أهلا بك مجددًا!</span>
          <span className="mk-user__name">{fullName}</span>
        </div>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="mk-dropdown mk-dropdown--user" role="menu">
          <Link
            to="/sectors/advertising/marketplace/orders"
            className="mk-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11V7a3 3 0 0 1 6 0v4" />
              <rect x="4" y="11" width="16" height="10" rx="2" />
            </svg>
            طلباتي
          </Link>
          <Link
            to="/sectors/advertising/marketplace/account"
            className="mk-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            حسابي
          </Link>
          <Link
            to="/sectors/advertising/marketplace/favorites"
            className="mk-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            المفضّلة
          </Link>

          <hr className="mk-dropdown__divider" />

          <button
            type="button"
            className="mk-dropdown__item mk-dropdown__item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
