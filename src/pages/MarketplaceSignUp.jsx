import React, { useEffect } from 'react';
import SignUpHeader from '../components/advertising/marketplace/signup/SignUpHeader.jsx';
import SignUpForm from '../components/advertising/marketplace/signup/SignUpForm.jsx';
import SignUpGraphic from '../components/advertising/marketplace/signup/SignUpGraphic.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';

// Reuse the advertising sub-brand palette + marketplace primitives + the
// shared sign-in form CSS (eyebrow, fields, submit, divider, bottom link).
// The sign-up stylesheet only adds the swapped grid + yellow graphic panel.
import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-signin.css';
import '../styles/advertising-marketplace-signup.css';

/**
 * MarketplaceSignUp — full-page sign-up for the advertising marketplace.
 *
 * Layout (RTL — mirrors sign-in with the graphic side flipped):
 *   ┌──────────────────────────────────────────────┐
 *   │  [logo + back] + [form]  │  [yellow graphic] │
 *   └──────────────────────────────────────────────┘
 *   │                  [footer]                    │
 *   └──────────────────────────────────────────────┘
 *
 * In the DOM the graphic comes FIRST so that in RTL flow it lands on the
 * visual right (RTL-start). The form is the second grid child, sitting on
 * the visual left.
 */
export default function MarketplaceSignUp() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ad-scope" data-advertising-marketplace dir="rtl">
      <div className="su-page">
        {/* Graphic panel — DOM-first → visual right in RTL */}
        <div className="si-panel su-panel--graphic">
          <SignUpGraphic />
        </div>

        {/* Form panel — DOM-second → visual left in RTL */}
        <div className="si-panel si-panel--form">
          <SignUpHeader />
          <div className="si-panel__content">
            <SignUpForm />
          </div>
        </div>
      </div>

      <MarketFooter />
    </div>
  );
}
