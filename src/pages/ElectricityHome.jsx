import React, { useEffect } from 'react';
import ElNavbar from '../components/electricity/ElNavbar.jsx';
import ElHero from '../components/electricity/ElHero.jsx';
import ElServices from '../components/electricity/ElServices.jsx';
import ElExpertise from '../components/electricity/ElExpertise.jsx';
import ElValues from '../components/electricity/ElValues.jsx';
import ElPillars from '../components/electricity/ElPillars.jsx';
import ElCTA from '../components/electricity/ElCTA.jsx';
import ElFooter from '../components/electricity/ElFooter.jsx';
import '../styles/electricity.css';

/**
 * Electricity sub-site landing page (route: /sectors/electricity).
 *
 * The `.el-scope` wrapper overrides --accent and friends so every descendant
 * paints electric blue. The wrapper also sets `dir="rtl"` and the global
 * Navbar/Footer in App.jsx are suppressed on this route, keeping the
 * sub-brand visually self-contained.
 *
 * Section order follows the brief: hero → services → expertise (why us) →
 * values → vision/mission/goal → contact CTA → footer. Values and pillars
 * are intentionally placed near the END of the page.
 */
export default function ElectricityHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="el-scope" data-electricity dir="rtl">
      <ElNavbar />
      <main>
        <ElHero />
        <ElServices />
        <ElExpertise />
        <ElValues />
        <ElPillars />
        <ElCTA />
      </main>
      <ElFooter />
    </div>
  );
}
