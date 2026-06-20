import React, { useEffect } from 'react';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import ProductDetailView from '../components/advertising/marketplace/products/ProductDetailView.jsx';
import { RequireAuth } from '../lib/auth.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-products.css';
import '../styles/advertising-product-detail.css';

/**
 * MarketplaceProductDetail — single product page.
 *
 * Route: /sectors/advertising/marketplace/products/product_:ref
 * Auth-gated via <RequireAuth>.
 */
export default function MarketplaceProductDetail() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <RequireAuth>
      <div className="ad-scope" data-advertising-marketplace dir="rtl">
        <MarketNavbar />
        <main style={{ paddingTop: 78 }}>
          <ProductDetailView />
        </main>
        <MarketFooter />
      </div>
    </RequireAuth>
  );
}
