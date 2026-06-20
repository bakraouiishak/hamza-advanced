import React, { useEffect } from 'react';
import SignInHeader from '../components/advertising/marketplace/signin/SignInHeader.jsx';
import SignInForm from '../components/advertising/marketplace/signin/SignInForm.jsx';
import SignInGraphic from '../components/advertising/marketplace/signin/SignInGraphic.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';

// Inherit the advertising sub-brand palette + marketplace primitives
import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-signin.css';

/**
 * MarketplaceSignIn — full-page sign-in for the advertising marketplace.
 *
 * Layout (RTL):
 *   ┌──────────────────────────────────────────────┐
 *   │  [graphic image]  │  [logo + back] + [form]  │
 *   └──────────────────────────────────────────────┘
 *   │                  [footer]                    │
 *   └──────────────────────────────────────────────┘
 *
 * No navbar — the header inside the form panel provides the logo and a
 * "back to marketplace" pill link. The marketplace footer is brought in
 * as-is at the bottom.
 */
export default function MarketplaceSignIn() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ad-scope" data-advertising-marketplace dir="rtl">
      <div className="si-page">
        {/* Form panel (RTL right = visual right) */}
        <div className="si-panel si-panel--form">
          <SignInHeader />
          <div className="si-panel__content">
            <SignInForm />
          </div>
        </div>

        {/* Graphic panel (RTL left = visual left) */}
        <div className="si-panel si-panel--graphic">
          <SignInGraphic />
        </div>
      </div>

      <MarketFooter />
    </div>
  );
}
