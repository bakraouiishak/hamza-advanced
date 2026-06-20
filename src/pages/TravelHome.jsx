import React, { useEffect } from 'react';
import TrNavbar from '../components/travel/TrNavbar.jsx';
import TrHero from '../components/travel/TrHero.jsx';
import TrServices from '../components/travel/TrServices.jsx';
import TrExpertise from '../components/travel/TrExpertise.jsx';
import TrProjects from '../components/travel/TrProjects.jsx';
import TrValues from '../components/travel/TrValues.jsx';
import TrPillars from '../components/travel/TrPillars.jsx';
import TrCTA from '../components/travel/TrCTA.jsx';
import TrFooter from '../components/travel/TrFooter.jsx';
import TrPaths from '../components/travel/TrPaths.jsx';
import '../styles/travel.css';

/**
 * Travel & Tourism sub-site landing page (route: /sectors/travel).
 *
 * The `.tr-scope` wrapper overrides --accent and friends so every descendant
 * paints in the travel cyan/teal palette. The wrapper sets `dir="rtl"` and
 * the global Navbar/Footer in App.jsx are suppressed on /sectors/* routes,
 * keeping the sub-brand visually self-contained.
 *
 * Section order follows the brief: hero → services → expertise (why us) →
 * projects → values → vision/message → contact CTA → footer. Values and
 * pillars are intentionally placed near the END of the page, and a roaming
 * compass on dashed travel paths drifts across the layout between sections.
 */
export default function TravelHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="tr-scope" data-travel dir="rtl">
      <TrNavbar />
      <main className="tr-main">
        <TrPaths />
        <TrHero />
        <TrServices />
        <TrExpertise />
        <TrProjects />
        <TrValues />
        <TrPillars />
        <TrCTA />
      </main>
      <TrFooter />
    </div>
  );
}
