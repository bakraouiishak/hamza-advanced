import React, { useEffect } from 'react';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import MarketFavoritesView from '../components/advertising/marketplace/products/MarketFavoritesView.jsx';
import { RequireAuth } from '../lib/auth.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-products.css';
import '../styles/advertising-product-detail.css';

/**
 * MarketplaceFavorites — showing the customer's favorite products.
 *
 * Route: /sectors/advertising/marketplace/favorites
 *
 * Auth-gated: only signed-in users see this page. Guests are redirected
 * to the sign-in page via <RequireAuth>.
 */
export default function MarketplaceFavorites() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <RequireAuth>
      <div className="ad-scope" data-advertising-marketplace dir="rtl">
        <MarketNavbar />
        <main style={{ paddingTop: 78 }}>
          <MarketFavoritesView />
        </main>
        <MarketFooter />
      </div>
    </RequireAuth>
  );
}
