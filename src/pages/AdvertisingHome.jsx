import React, { useEffect } from 'react';
import AdNavbar from '../components/advertising/AdNavbar.jsx';
import AdHero from '../components/advertising/AdHero.jsx';
import AdAbout from '../components/advertising/AdAbout.jsx';
import AdServices from '../components/advertising/AdServices.jsx';
import AdPromise from '../components/advertising/AdPromise.jsx';
import AdProcess from '../components/advertising/AdProcess.jsx';
import AdShowcase from '../components/advertising/AdShowcase.jsx';
import AdClients from '../components/advertising/AdClients.jsx';
import AdCTA from '../components/advertising/AdCTA.jsx';
import AdFooter from '../components/advertising/AdFooter.jsx';
import '../styles/advertising.css';

/**
 * Advertising sub-site landing page (route: /sectors/advertising).
 *
 * The `.ad-scope` wrapper overrides the CSS custom properties so every
 * descendant (including parent-design-system primitives that read --accent)
 * paints yellow. The wrapper also sets `dir="rtl"` and `data-advertising`,
 * leaving the parent <body> untouched.
 *
 * Note: this page renders its OWN navbar and footer. The global Navbar /
 * Footer rendered in App.jsx are intentionally hidden on this route to keep
 * the advertising sub-brand visually self-contained.
 */
export default function AdvertisingHome() {
  // Scroll restoration — when arriving from the parent site navbar, start at top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ad-scope" data-advertising dir="rtl">
      <AdNavbar />
      <main>
        <AdHero />
        <AdAbout />
        <AdServices />
        <AdPromise />
        <AdProcess />
        <AdShowcase />
        <AdClients />
        <AdCTA />
      </main>
      <AdFooter />
    </div>
  );
}
