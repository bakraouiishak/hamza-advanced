import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../lib/auth.jsx';

/**
 * AdminSidebar — the narrow right-hand panel (RTL start) hosting all
 * navigation links + the logout control + the admin avatar.
 *
 * Width is tight (≈240px) because in RTL it sits on the visual RIGHT and
 * the wide preview/main area sits on the left where it has the most space.
 */
const LINKS = [
  {
    to: '/sectors/advertising/marketplace/admin/home',
    label: 'الرئيسية',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8" /><path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: '/sectors/advertising/marketplace/admin/customers',
    label: 'العملاء',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/sectors/advertising/marketplace/admin/products',
    label: 'المنتجات',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    to: '/sectors/advertising/marketplace/admin/orders',
    label: 'الطلبات',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11V7a3 3 0 0 1 6 0v4" />
        <rect x="4" y="11" width="16" height="10" rx="2" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/sectors/advertising/marketplace/signin', { replace: true });
  };

  return (
    <aside className="adm-sidebar">
      <Link to="/sectors/advertising/marketplace/admin/home" className="adm-sidebar__brand">
        <img src="/images/logos svg/hamza advanced advertising marketplace svg.svg" alt="" />
        <span className="adm-sidebar__brand-tag">لوحة التحكم</span>
      </Link>

      {/* Nav */}
      <nav className="adm-sidebar__nav" aria-label="القائمة الرئيسية">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `adm-sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <span className="adm-sidebar__link-icon">{l.icon}</span>
            <span className="adm-sidebar__link-label">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card + logout */}
      <div className="adm-sidebar__foot">
        <div className="adm-sidebar__user">
          <div className="adm-sidebar__user-avatar">
            {user?.profileImg ? (
              <img src={user.profileImg} alt="" />
            ) : (
              <span>{(user?.name?.[0] || 'A')}</span>
            )}
          </div>
          <div className="adm-sidebar__user-info">
            <p className="adm-sidebar__user-name">{user?.name} {user?.surname}</p>
            <p className="adm-sidebar__user-role">{user?.role === 'Admin' ? 'مدير' : 'عميل'}</p>
          </div>
        </div>
        <button type="button" className="adm-sidebar__logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
