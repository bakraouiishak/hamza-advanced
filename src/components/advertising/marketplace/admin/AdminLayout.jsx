import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

/**
 * AdminLayout — the two-pane shell.
 *
 *   ┌─────────────────────────────────────────────┐
 *   │  ┌──────────────┐ ┌────────────────────────┐│
 *   │  │   sidebar    │ │   preview / main       ││
 *   │  │  (RTL right) │ │   (Outlet renders the  ││
 *   │  │              │ │   active admin route)  ││
 *   │  └──────────────┘ └────────────────────────┘│
 *   └─────────────────────────────────────────────┘
 */
export default function AdminLayout() {
  return (
    <div className="ad-scope adm-shell" data-advertising dir="rtl">
      <AdminSidebar />
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
