import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Travel & Tourism sub-brand navbar — mirrors the dark-glass topbar of the
 * parent homepage, swapping in the travel wordmark and travel-specific anchor
 * inventory. "العودة للهمزة المتطورة" pill jumps back to the parent.
 */
export default function TrNavbar() {
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
    { href: '#projects', label: 'مشاريعنا' },
    { href: '#values', label: 'قيمنا' },
    { href: '#contact', label: 'تواصل' },
  ];

  return (
    <header className={`tr-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="tr-nav__inner">
        <Link to="/sectors/travel" className="tr-nav__brand">
          <img src="/travel/Horizontal Logo.svg" alt="الهمزة المتطورة — للسفر والسياحة" />
        </Link>

        <nav className="tr-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="tr-nav__link">
              {l.label}
            </a>
          ))}
          <Link to="/" className="tr-nav__back" title="الانتقال إلى الهمزة المتطورة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            الهمزة المتطورة
          </Link>
          <a href="#contact" className="tr-nav__cta">
            خطّط رحلتك
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>

        <button
          className="tr-nav__mobile-btn"
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
            className="tr-nav__drawer"
          >
            <div className="tr-nav__drawer-links">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobile(false)}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="tr-nav__drawer-divider" />

            <div className="tr-nav__drawer-buttons">
              <Link to="/" className="tr-nav__back" title="الانتقال إلى الهمزة المتطورة" onClick={() => setMobile(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                الهمزة المتطورة
              </Link>
              <a href="#contact" className="tr-nav__cta" onClick={() => setMobile(false)}>
                خطّط رحلتك
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
