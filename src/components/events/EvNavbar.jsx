import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Events sub-brand navbar — mirrors the dark-glass topbar of the parent
 * homepage, swapping in the events horizontal combination logo and events-
 * specific anchor inventory. "العودة للهمزة المتطورة" pill jumps back.
 */
export default function EvNavbar() {
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
    { href: '#process', label: 'منهجيتنا' },
    { href: '#projects', label: 'أعمالنا' },
    { href: '#partners', label: 'شركاؤنا' },
    { href: '#contact', label: 'تواصل' },
  ];

  return (
    <header className={`ev-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ev-nav__inner">
        <Link to="/sectors/events" className="ev-nav__brand">
          <img src="/events/Horizontal Combination Logo.svg" alt="الهمزة المتطورة — لإدارة وإقامة الفعاليات" />
        </Link>

        <nav className="ev-nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="ev-nav__link">
              {l.label}
            </a>
          ))}
          <Link to="/" className="ev-nav__back" title="الانتقال إلى الهمزة المتطورة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            الهمزة المتطورة
          </Link>
          <a href="#contact" className="ev-nav__cta">
            احجز فعاليتك
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>

        <button
          className="ev-nav__mobile-btn"
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
            className="ev-nav__drawer"
          >
            <div className="ev-nav__drawer-links">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobile(false)}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="ev-nav__drawer-divider" />

            <div className="ev-nav__drawer-buttons">
              <Link to="/" className="ev-nav__back" title="الانتقال إلى الهمزة المتطورة" onClick={() => setMobile(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                الهمزة المتطورة
              </Link>
              <a href="#contact" className="ev-nav__cta" onClick={() => setMobile(false)}>
                احجز فعاليتك
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
