import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAdmin } from '../lib/auth.jsx';

import AdminLayout from '../components/advertising/marketplace/admin/AdminLayout.jsx';
import DashboardHome from '../components/advertising/marketplace/admin/home/DashboardHome.jsx';
import CustomersPage from '../components/advertising/marketplace/admin/customers/CustomersPage.jsx';
import ProductsPage  from '../components/advertising/marketplace/admin/products/ProductsPage.jsx';
import OrdersPage    from '../components/advertising/marketplace/admin/orders/OrdersPage.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-admin.css';
import '../styles/advertising-marketplace-orders.css';

/**
 * MarketplaceAdmin — guarded shell for the entire admin area.
 *
 * Mounts under the parent route `/sectors/advertising/marketplace/admin/*`
 * and uses nested routes so each sidebar section maps to its own URL —
 * keeps the browser back button useful and lets us link directly to a sub
 * page later.
 */
export default function MarketplaceAdmin() {
  return (
    <RequireAdmin>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home"      element={<DashboardHome />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products"  element={<ProductsPage />} />
          <Route path="orders"    element={<OrdersPage />} />
          <Route path="*"         element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </RequireAdmin>
  );
}
