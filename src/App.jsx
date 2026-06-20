import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import PartnersCarousel from './components/PartnersCarousel.jsx';
import AboutUs from './components/AboutUs.jsx';
import Vision2030 from './components/Vision2030.jsx';
import Projects from './components/Projects.jsx';
import SloganSectors from './components/SloganSectors.jsx';
import Testimonials from './components/Testimonials.jsx';
import VisitMarketplace from './components/VisitMarketplace.jsx';
import ContactUs from './components/ContactUs.jsx';
import Footer from './components/Footer.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HamzaVision2030 from './pages/HamzaVision2030.jsx';
import AdvertisingHome from './pages/AdvertisingHome.jsx';
import ElectricityHome from './pages/ElectricityHome.jsx';
import EventsHome from './pages/EventsHome.jsx';
import TravelHome from './pages/TravelHome.jsx';
import CateringHome from './pages/CateringHome.jsx';
import AdvertisingMarketplace from './pages/AdvertisingMarketplace.jsx';
import MarketplaceSignIn from './pages/MarketplaceSignIn.jsx';
import MarketplaceSignUp from './pages/MarketplaceSignUp.jsx';
import MarketplaceAdmin from './pages/MarketplaceAdmin.jsx';
import MarketplaceProducts from './pages/MarketplaceProducts.jsx';
import MarketplaceProductDetail from './pages/MarketplaceProductDetail.jsx';
import MarketplaceOrders from './pages/MarketplaceOrders.jsx';
import MarketplaceAccount from './pages/MarketplaceAccount.jsx';
import MarketplaceFavorites from './pages/MarketplaceFavorites.jsx';
import MarketplaceFaq from './pages/MarketplaceFaq.jsx';

function HomeContent({ activeSector, setActiveSector }) {
  return (
    <main>
      <Hero activeId={activeSector} onPickSector={setActiveSector} />
      <PartnersCarousel />
      <AboutUs />
      <Vision2030 />
      <Projects />
      <SloganSectors />
      <Testimonials />
      <VisitMarketplace />
      <ContactUs />
    </main>
  );
}

export default function App() {
  // The "active sector" is held at the top so the navbar dropdown and the
  // hero cards stay in sync. Sector color theming is scoped to the Hero
  // section only — the rest of the page always uses the main brand palette.
  const [activeSector, setActiveSector] = useState('main');
  const [lang, setLang] = useState('ar');

  // Routes that bring their own navbar + footer (sub-brands). On these paths
  // the parent's chrome is suppressed so each sub-site stays visually
  // self-contained.
  const location = useLocation();
  const hideGlobalChrome = location.pathname.startsWith('/sectors/');

  // Dynamically update favicon based on the current route
  useEffect(() => {
    let faviconPath = '/favicons/Main.svg';
    
    if (location.pathname.startsWith('/sectors/advertising')) {
      faviconPath = '/favicons/Advertising.svg';
    } else if (location.pathname.startsWith('/sectors/events')) {
      faviconPath = '/favicons/Events.svg';
    } else if (location.pathname.startsWith('/sectors/travel')) {
      faviconPath = '/favicons/Tourism.svg';
    } else if (location.pathname.startsWith('/sectors/catering')) {
      faviconPath = '/favicons/Cattering.svg';
    } else if (location.pathname.startsWith('/sectors/electricity')) {
      faviconPath = '/favicons/Electricity.svg';
    }

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = faviconPath;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = 'image/svg+xml';
      newLink.href = faviconPath;
      document.head.appendChild(newLink);
    }
  }, [location.pathname]);

  return (
    <>
      {!hideGlobalChrome && (
        <Navbar
          lang={lang}
          onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
          onPickSector={setActiveSector}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<HomeContent activeSector={activeSector} setActiveSector={setActiveSector} />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/vision2030" element={<HamzaVision2030 />} />
        <Route path="/sectors/advertising" element={<AdvertisingHome />} />
        <Route path="/sectors/electricity" element={<ElectricityHome />} />
        <Route path="/sectors/events" element={<EventsHome />} />
        <Route path="/sectors/travel" element={<TravelHome />} />
        <Route path="/sectors/catering" element={<CateringHome />} />
        <Route path="/sectors/advertising/marketplace" element={<AdvertisingMarketplace />} />
        <Route path="/sectors/advertising/marketplace/products" element={<MarketplaceProducts />} />
        <Route path="/sectors/advertising/marketplace/products/:slug" element={<MarketplaceProductDetail />} />
        <Route path="/sectors/advertising/marketplace/orders" element={<MarketplaceOrders />} />
        <Route path="/sectors/advertising/marketplace/account" element={<MarketplaceAccount />} />
        <Route path="/sectors/advertising/marketplace/favorites" element={<MarketplaceFavorites />} />
        <Route path="/sectors/advertising/marketplace/signin" element={<MarketplaceSignIn />} />
        <Route path="/sectors/advertising/marketplace/signup" element={<MarketplaceSignUp />} />
        <Route path="/sectors/advertising/marketplace/faq" element={<MarketplaceFaq />} />
        <Route path="/sectors/advertising/marketplace/admin/*" element={<MarketplaceAdmin />} />
      </Routes>
      {!hideGlobalChrome && <Footer />}
    </>
  );
}
