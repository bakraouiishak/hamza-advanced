import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Advertising sub-brand navbar — visually clones the dark-glass topbar of the
 * Hamza Advanced homepage (height, blur, scroll-color shift), but swaps in the
 * yellow advertising wordmark and the advertising-specific link inventory.
 *
 * The "العودة للهمزة المتطورة" pill on the far end lets a visitor jump back to
 * the parent brand homepage at any time — a strict requirement of the brief.
 */
export default function AdNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

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

  // Anchors only — this sub-site is single-page; each section scrolls into view
  const links = [
    { href: '#why', label: 'لماذا نحن' },
    { href: '#services', label: 'خدماتنا' },
    { href: '#process', label: 'كيف نعمل' },
    { href: '#showcase', label: 'أعمالنا' },
    { href: '#clients', label: 'عملاؤنا' },
  ];

  return (
    <header className={`ad-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ad-nav__inner">
        {/* Brand wordmark — yellow advertising logo */}
        <Link to="/sectors/advertising" className="ad-nav__brand">
          <img
            src="/images/logos svg/hamza advanced advertising svg.svg"
            alt="الهمزة المتطورة — للدعاية والإعلان"
          />
        </Link>

        {/* Desktop links */}
        <nav className="ad-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="ad-nav__link">
              {l.label}
            </a>
          ))}
          <Link to="/" className="ad-nav__back" title="الانتقال إلى الهمزة المتطورة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            الهمزة المتطورة
          </Link>
          <Link to="/sectors/advertising/marketplace" className="ad-nav__cta">
            المتجر الالكتروني
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="ad-nav__mobile-btn"
          aria-label="القائمة"
          onClick={() => setMobile((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="ad-nav__drawer"
          >
            <div className="ad-nav__drawer-links">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobile(false)}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="ad-nav__drawer-divider" />

            <div className="ad-nav__drawer-buttons">
              <Link to="/" className="ad-nav__back" title="الانتقال إلى الهمزة المتطورة" onClick={() => setMobile(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                الهمزة المتطورة
              </Link>
              <Link to="/sectors/advertising/marketplace" className="ad-nav__cta" onClick={() => setMobile(false)}>
                المتجر الالكتروني
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
