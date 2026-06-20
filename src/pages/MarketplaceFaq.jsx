import React, { useEffect } from 'react';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import FaqView from '../components/advertising/marketplace/FaqView.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-faq.css';

/**
 * MarketplaceFaq — public FAQ hub.
 *
 * Route: /sectors/advertising/marketplace/faq
 *
 * NOT auth-gated: accessible whether the visitor is signed in or not. The
 * MarketNavbar's "تساؤلاتكم" link routes here.
 */
export default function MarketplaceFaq() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ad-scope" data-advertising-marketplace dir="rtl">
      <MarketNavbar />
      <main style={{ paddingTop: 78 }}>
        <FaqView />
      </main>
      <MarketFooter />
    </div>
  );
}
