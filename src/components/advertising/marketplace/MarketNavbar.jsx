import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

import { useAuth } from '../../../lib/auth.jsx';
import { MARKET_CATEGORIES } from '../../../data/advertising-marketplace.js';
import UserMenu from './nav/UserMenu.jsx';
import NotificationsDropdown from './nav/NotificationsDropdown.jsx';
import CartDropdown from './nav/CartDropdown.jsx';

/**
 * MarketNavbar — two distinct layouts depending on auth state.
 *
 * ─── DISCONNECTED (guest) ───────────────────────────────────────────────
 *   Right (RTL start):  [advertising logo] [|] [تسجيل الدخول] [|] [انشاء حساب]
 *   Center            :  [3 inert nav links]
 *   Left  (RTL end)   :  [الهمزة المتطورة pill] [موقع القطاع pill]
 *
 * ─── CONNECTED (signed in) ──────────────────────────────────────────────
 *   Right (RTL start):  [user pill]   [bell]   [cart]
 *   Center            :  [marketplace logo — perfectly centered]
 *   Left  (RTL end)   :  [3 inert nav links]
 *
 * The center logo is anchored to the geometric centre via absolute
 * positioning (CSS), so the two side clusters can have any width without
 * pushing the logo off-axis.
 */
export default function MarketNavbar() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  // Close services dropdown on Escape
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setServicesOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesOpen]);

  // Navigate to products page with category filter, then close dropdown / drawer
  const pickCategory = (label) => {
    setServicesOpen(false);
    setMobile(false);
    navigate(`/sectors/advertising/marketplace/products?category=${encodeURIComponent(label)}`);
  };

  /* Nav links — `to` means the page exists and the link is live. */
  const links = [
    { key: 'products', label: 'منتجاتنا', to: '/sectors/advertising/marketplace/products' },
    { key: 'faq',      label: 'تساؤلاتكم', to: '/sectors/advertising/marketplace/faq' },
    { key: 'services', label: 'خدماتنا', hasDropdown: true },
  ];

  // Render a single nav-item — Link, mega-dropdown trigger, or inert button.
  const renderLink = (l) => {
    if (l.to) {
      return (
        <Link key={l.key} to={l.to} className="mk-nav__link">
          {l.label}
        </Link>
      );
    }
    if (l.key === 'services') {
      return (
        <button
          key={l.key}
          type="button"
          className={`mk-nav__link mk-nav__link--services ${servicesOpen ? 'is-open' : ''}`}
          aria-expanded={servicesOpen}
          aria-haspopup="true"
          onMouseEnter={() => setServicesOpen(true)}
          onFocus={() => setServicesOpen(true)}
          onClick={() => setServicesOpen((v) => !v)}
        >
          {l.label}
          <svg
            width="11" height="11" viewBox="0 0 12 12" fill="none"
            style={{ transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease' }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      );
    }
    return (
      <button key={l.key} type="button" className="mk-nav__link" aria-disabled="true" tabIndex={-1}>
        {l.label}
      </button>
    );
  };

  const isLoggedIn = ready && !!user;

  return (
    <header className={`mk-nav ${scrolled ? 'is-scrolled' : ''} ${isLoggedIn ? 'is-auth' : 'is-guest'}`}>
      <div className="mk-nav__inner">

        {/* ─── RTL start (visual RIGHT) ────────────────────────────── */}
        <div className="mk-nav__start">
          {isLoggedIn ? (
            <div className="mk-nav__user-cluster">
              <UserMenu />
              <NotificationsDropdown />
              <CartDropdown />
            </div>
          ) : (
            <div className="mk-nav__auth">
              {/* Advertising-sector logo on the very right, with a divider */}
              <Link
                to="/sectors/advertising"
                className="mk-nav__guest-logo"
                title="موقع القطاع"
              >
                <img
                  src="/images/logos svg/hamza advanced advertising marketplace svg.svg"
                  alt="الهمزة المتطورة — للدعاية والإعلان"
                />
              </Link>
              <span className="mk-nav__auth-sep" />
              <Link to="/sectors/advertising/marketplace/signin" className="mk-nav__auth-link">
                تسجيل الدخول
              </Link>
              <span className="mk-nav__auth-sep" />
              {/* "انشاء حساب" now renders with the same text-link affordance
                  as the in-nav links (منتجاتنا, تساؤلاتكم) — quieter
                  visual weight, identical underline hover. */}
              <Link
                to="/sectors/advertising/marketplace/signup"
                className="mk-nav__link"
              >
                انشاء حساب
              </Link>
            </div>
          )}
        </div>

        {/* ─── CENTRE ─────────────────────────────────────────────────
            Disconnected: 3 nav links. Connected: marketplace logo. */}
        {isLoggedIn ? (
          <Link to="/sectors/advertising/marketplace" className="mk-nav__center-logo">
            <img
              src="/images/logos svg/hamza advanced advertising marketplace svg.svg"
              alt="متجر الهمزة المتطورة"
            />
          </Link>
        ) : (
          <nav className="mk-nav__links" aria-label="Marketplace navigation">
            {links.map(renderLink)}
          </nav>
        )}

        {/* ─── RTL end (visual LEFT) ──────────────────────────────────
            Connected: 3 nav links. Disconnected: 2 CTA pills. */}
        <div className="mk-nav__end">
          {isLoggedIn ? (
            <nav className="mk-nav__links mk-nav__links--end" aria-label="Marketplace navigation">
              {links.map(renderLink)}
            </nav>
          ) : (
            <div className="mk-nav__cta-cluster">
              <Link to="/" className="mk-nav__cta-secondary">
                الهمزة المتطورة
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/sectors/advertising" className="mk-nav__cta-primary">
                موقع القطاع
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle (unchanged) */}
        <button
          className="mk-nav__mobile-btn"
          aria-label="القائمة"
          onClick={() => setMobile((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
      </div>

      {/* ─── Services mega-dropdown — full-width strip beneath the navbar ─── */}
      <AnimatePresence>
        {servicesOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mk-mega"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            role="menu"
            aria-label="فئات خدمات السوق"
          >
            <div className="mk-mega__inner">
              <header className="mk-mega__head">
                <div>
                  <span className="mk-mega__eyebrow">خدماتنا</span>
                  <h3 className="mk-mega__title">{MARKET_CATEGORIES.length} فئة متكاملة</h3>
                </div>
                <p className="mk-mega__sub">
                  اختر الفئة التي تبحث فيها — لتنتقل مباشرة إلى المنتجات المرتبطة بها.
                </p>
              </header>
              <ul className="mk-mega__grid" role="none">
                {MARKET_CATEGORIES.map((c, i) => (
                  <li key={c.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className="mk-mega__item"
                      onClick={() => pickCategory(c.label)}
                    >
                      <span className="mk-mega__item-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mk-mega__item-label">{c.label}</span>
                      <span className="mk-mega__item-arrow" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <footer className="mk-mega__foot">
                <Link
                  to="/sectors/advertising/marketplace/products"
                  className="mk-mega__view-all"
                  onClick={() => setServicesOpen(false)}
                >
                  تصفّح جميع المنتجات
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="mk-nav__drawer"
          >
            {isLoggedIn ? (
              <>
                {links.map((l) => l.to ? (
                  <Link
                    key={l.key}
                    to={l.to}
                    onClick={() => setMobile(false)}
                    style={{ padding: '0.75rem 0.85rem', borderRadius: 12, color: 'rgba(247,240,245,0.85)', fontWeight: 600 }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <button
                    key={l.key}
                    type="button"
                    aria-disabled="true"
                    style={{ padding: '0.75rem 0.85rem', borderRadius: 12, color: 'rgba(247,240,245,0.85)', fontWeight: 600, background: 'transparent', border: 0, textAlign: 'start' }}
                  >
                    {l.label}
                  </button>
                ))}
                <span className="mk-nav__drawer-sep" />
                <span className="mk-nav__drawer-greeting">أهلا بك مجددًا {user.name}</span>
                <Link
                  to="/sectors/advertising/marketplace/orders"
                  onClick={() => setMobile(false)}
                  style={{ padding: '0.75rem 0.85rem', borderRadius: 12, color: 'rgba(247,240,245,0.85)', fontWeight: 600 }}
                >
                  طلباتي
                </Link>
                <Link
                  to="/sectors/advertising/marketplace/account"
                  onClick={() => setMobile(false)}
                  style={{ padding: '0.75rem 0.85rem', borderRadius: 12, color: 'rgba(247,240,245,0.85)', fontWeight: 600 }}
                >
                  حسابي
                </Link>
                <Link
                  to="/sectors/advertising/marketplace/favorites"
                  onClick={() => setMobile(false)}
                  style={{ padding: '0.75rem 0.85rem', borderRadius: 12, color: 'rgba(247,240,245,0.85)', fontWeight: 600 }}
                >
                  المفضّلة
                </Link>
              </>
            ) : (
              <>
                {/* 1. منتجاتنا (wired) */}
                <Link
                  to="/sectors/advertising/marketplace/products"
                  className="mk-nav__drawer-item"
                  onClick={() => setMobile(false)}
                >
                  منتجاتنا
                </Link>

                {/* 2. تساؤلاتكم (wired) */}
                <Link
                  to="/sectors/advertising/marketplace/faq"
                  className="mk-nav__drawer-item"
                  onClick={() => setMobile(false)}
                >
                  تساؤلاتكم
                </Link>

                {/* 3. خدماتنا (expandable) */}
                <button
                  type="button"
                  className="mk-nav__drawer-item mk-nav__drawer-item--expandable"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                >
                  <span>خدماتنا</span>
                  <svg
                    width="11" height="11" viewBox="0 0 12 12" fill="none"
                    style={{
                      transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.25s ease',
                      marginInlineStart: 'auto'
                    }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden', width: '100%' }}
                    >
                      <div className="mk-nav__drawer-categories-grid">
                        {MARKET_CATEGORIES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="mk-nav__drawer-category-card"
                            onClick={() => pickCategory(c.label)}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. Horizontal divider */}
                <div className="mk-nav__drawer-divider" />

                {/* 5. Buttons displayed in a row */}
                <div className="mk-nav__drawer-buttons">
                  <Link
                    to="/"
                    className="mk-nav__cta-secondary"
                    style={{ fontSize: '0.7rem', padding: '0.5rem 0.85rem' }}
                    onClick={() => setMobile(false)}
                  >
                    الهمزة المتطورة
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link
                    to="/sectors/advertising"
                    className="mk-nav__cta-primary"
                    style={{ fontSize: '0.7rem', padding: '0.5rem 0.85rem' }}
                    onClick={() => setMobile(false)}
                  >
                    موقع القطاع
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
