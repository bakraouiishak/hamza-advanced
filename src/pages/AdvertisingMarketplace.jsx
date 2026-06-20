import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketHero from '../components/advertising/marketplace/MarketHero.jsx';
import MarketCategories from '../components/advertising/marketplace/MarketCategories.jsx';
import MarketCarousel from '../components/advertising/marketplace/MarketCarousel.jsx';
import MarketTrust from '../components/advertising/marketplace/MarketTrust.jsx';
import MarketPacks from '../components/advertising/marketplace/MarketPacks.jsx';
import MarketCTA from '../components/advertising/marketplace/MarketCTA.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import OnboardingOverlay from '../components/advertising/marketplace/OnboardingOverlay.jsx';

// Inherit the advertising sub-brand palette + VIP Hakm via .ad-scope, then
// layer the marketplace-only primitives on top.
import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-product-detail.css';

/**
 * Advertising Marketplace home page (route: /sectors/advertising/marketplace).
 *
 * Frontend skeleton only — every backend-driven slot (products, categories,
 * pack pricing, banners) renders as a shimmer placeholder. When the API is
 * ready, populating the `advertising-marketplace.js` data file will hydrate
 * the UI without any structural changes here.
 *
 * The page reuses `.ad-scope` so it inherits the exact yellow accent
 * (#FEFC4F) and VIP Hakm typeface stack of the advertising sub-site — making
 * the marketplace a 1:1 visual sibling rather than a separate look.
 */
export default function AdvertisingMarketplace() {
  const location = useLocation();
  const navigate = useNavigate();

  // Onboarding overlay: shown ONCE, right after sign-up, driven by the
  // `justSignedUp` flag SignUpForm sets in the route state. We consume the
  // flag on mount and clear `location.state` so a refresh / back-nav
  // doesn't show the overlay again.
  const [showOnboarding, setShowOnboarding] = useState(
    () => !!location.state?.justSignedUp
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    // Clear the navigation state once we've captured the flag in component
    // state, so it doesn't replay on refresh.
    if (location.state?.justSignedUp) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="ad-scope" data-advertising-marketplace dir="rtl">
      <MarketNavbar />
      <main>
        <MarketHero />
        <MarketCategories />
        <MarketCarousel />
        <MarketTrust />
        <MarketPacks />
        <MarketCTA />
      </main>
      <MarketFooter />

      {showOnboarding && (
        <OnboardingOverlay onDone={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
