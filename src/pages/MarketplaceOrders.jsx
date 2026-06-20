import React from 'react';
import { RequireAuth } from '../lib/auth.jsx';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import CustomerOrdersView from '../components/advertising/marketplace/orders/CustomerOrdersView.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-orders.css';

/**
 * MarketplaceOrders — customer-facing orders page.
 * Protected by RequireAuth. Uses same chrome as products page.
 */
export default function MarketplaceOrders() {
  return (
    <RequireAuth>
      <MarketNavbar />
      <CustomerOrdersView />
      <MarketFooter />
    </RequireAuth>
  );
}
