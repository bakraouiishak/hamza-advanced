import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Catering sub-brand navbar — clones the dark-glass topbar of the parent
 * Hamza Advanced homepage but swaps the wordmark to the gold-on-navy catering
 * logo and the back-pill that anchors the visitor to the umbrella brand.
 */
export default function CtNavbar() {
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

  const links = [
    { href: '#services', label: 'خدماتنا' },
    { href: '#why', label: 'لماذا نحن' },
    { href: '#menu', label: 'قائمتنا' },
    { href: '#process', label: 'كيف نعمل' },
    { href: '#chefs', label: 'شيفاتنا' },
  ];

  return (
    <header className={`ct-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ct-nav__inner">
        <Link to="/sectors/catering" className="ct-nav__brand">
          <img src="/catering/Logo Horizontal.svg" alt="الهمزة المتطورة — للتموين والإعاشة" />
        </Link>

        <nav className="ct-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="ct-nav__link">
              {l.label}
            </a>
          ))}
          <Link to="/" className="ct-nav__back" title="الانتقال إلى الهمزة المتطورة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            الهمزة المتطورة
          </Link>
          <a href="#cta" className="ct-nav__cta">
            اطلب عرض ضيافة
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>

        <button
          className="ct-nav__mobile-btn"
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
            className="ct-nav__drawer"
          >
            <div className="ct-nav__drawer-links">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobile(false)}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="ct-nav__drawer-divider" />

            <div className="ct-nav__drawer-buttons">
              <Link to="/" className="ct-nav__back" title="الانتقال إلى الهمزة المتطورة" onClick={() => setMobile(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                الهمزة المتطورة
              </Link>
              <a href="#cta" className="ct-nav__cta" onClick={() => setMobile(false)}>
                اطلب عرض ضيافة
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
