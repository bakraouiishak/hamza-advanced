import React, { useEffect } from 'react';
import CtNavbar from '../components/catering/CtNavbar.jsx';
import CtHero from '../components/catering/CtHero.jsx';
import CtAbout from '../components/catering/CtAbout.jsx';
import CtServices from '../components/catering/CtServices.jsx';
import CtSignature from '../components/catering/CtSignature.jsx';
import CtExpertise from '../components/catering/CtExpertise.jsx';
import CtMenu from '../components/catering/CtMenu.jsx';
import CtProcess from '../components/catering/CtProcess.jsx';
import CtChefs from '../components/catering/CtChefs.jsx';
import CtTrust from '../components/catering/CtTrust.jsx';
import CtCTA from '../components/catering/CtCTA.jsx';
import CtFooter from '../components/catering/CtFooter.jsx';
import '../styles/catering.css';

/**
 * Catering sub-site landing page (route: /sectors/catering).
 *
 * The `.ct-scope` wrapper overrides the parent design system's --accent
 * triplet, switching the look to the catering identity: deep navy ground,
 * warm gold (#D79F56) accent, and the signature text-on-path round-plate
 * motif from /public/catering.
 *
 * Like the advertising sub-site, this page renders its own navbar and footer;
 * the global chrome from App.jsx is suppressed on any /sectors/* route.
 */
export default function CateringHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="ct-scope" data-catering dir="rtl">
      <CtNavbar />
      <main>
        <CtHero />
        <CtAbout />
        <CtServices />
        <CtSignature />
        <CtExpertise />
        <CtMenu />
        <CtProcess />
        <CtChefs />
        <CtTrust />
        <CtCTA />
      </main>
      <CtFooter />
    </div>
  );
}
