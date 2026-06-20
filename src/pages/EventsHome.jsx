import React, { useEffect } from 'react';
import EvNavbar from '../components/events/EvNavbar.jsx';
import EvHero from '../components/events/EvHero.jsx';
import EvServices from '../components/events/EvServices.jsx';
import EvExpertise from '../components/events/EvExpertise.jsx';
import EvProcess from '../components/events/EvProcess.jsx';
import EvProjects from '../components/events/EvProjects.jsx';
import EvPartners from '../components/events/EvPartners.jsx';
import EvValues from '../components/events/EvValues.jsx';
import EvPillars from '../components/events/EvPillars.jsx';
import EvCTA from '../components/events/EvCTA.jsx';
import EvFooter from '../components/events/EvFooter.jsx';
import '../styles/events.css';

/**
 * Events sub-site landing page (route: /sectors/events).
 *
 * The `.ev-scope` wrapper overrides --accent and friends so every descendant
 * paints brand pink. The wrapper sets `dir="rtl"` and the global Navbar/Footer
 * in App.jsx are suppressed on this route, keeping the sub-brand visually
 * self-contained.
 *
 * Section order follows the brief: hero → services → expertise (why us) →
 * process (17-step ops cycle) → projects → partners/roles matrix → values →
 * vision/mission/goal → contact CTA → footer. Values, pillars, mission
 * statements are intentionally placed near the END.
 */
export default function EventsHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ev-scope" data-events dir="rtl">
      <EvNavbar />
      <main>
        <EvHero />
        <EvServices />
        <EvExpertise />
        <EvProcess />
        <EvProjects />
        <EvPartners />
        <EvValues />
        <EvPillars />
        <EvCTA />
      </main>
      <EvFooter />
    </div>
  );
}
