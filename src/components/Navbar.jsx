import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamzaWordmark, MARK_BY_ID } from './BrandMarks.jsx';
import { SECTORS } from '../data/sectors.js';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Top navigation — dark glass style.
 * RTL layout: Logo is anchored to the RIGHT (start in RTL).
 * Nav links + lang toggle + CTA are grouped on the LEFT (end in RTL).
 *
 * Mega-menus (sectors + vision2030) span 100vw and sit flush under the navbar.
 */

const VISION_CARDS = [
  {
    id: 'vision',
    icon: '/images/vision2030/Vision2030 Icon.svg',
    title: 'التعريف ببرنامج رؤية2030',
    description: 'تعرّف على البرنامج الوطني الذي يقود تحول المملكة نحو مستقبل أكثر تنوعاً واستدامة واقتصاداً مزدهراً.',
    cta: { label: 'زيارة الموقع', href: 'https://www.vision2030.gov.sa', external: true },
    accent: 'vision',
  },
  {
    id: 'commitment',
    icon: '/images/logos svg/hamza advanced svg.svg',
    title: 'التزاماتنا مع برنامج رؤية2030',
    description: 'نعمل على تحقيق مستهدفات الرؤية من خلال قطاعاتنا الخمسة، ونساهم في بناء اقتصاد مستدام.',
    cta: { label: 'اكتشف المزيد', href: '/vision2030' },
    accent: 'hamza',
  },
];

// Sector logos (sourced from each sector's own navbar component)
const SECTOR_HERO = {
  ads: '/images/logos svg/hamza advanced advertising svg.svg',
  events: '/events/Horizontal Combination Logo.svg',
  electric: '/electricity/Horizontal Logo.svg',
  travel: '/travel/Horizontal Logo.svg',
  catering: '/catering/Logo Horizontal.svg',
};

const SECTOR_CTA = {
  ads: 'زيارة موقع الدعاية',
  events: 'زيارة موقع الفعاليات',
  electric: 'زيارة موقع الكهرباء',
  travel: 'زيارة موقع السياحة',
  catering: 'زيارة موقع التموين',
};

// All sectors have a live sub-site — navigate to each sector's page.
const SECTOR_ROUTES = {
  ads: '/sectors/advertising',
  events: '/sectors/events',
  electric: '/sectors/electricity',
  travel: '/sectors/travel',
  catering: '/sectors/catering',
};

const SECTOR_ICONS_MOBILE = {
  ads: '/images/hero_section_svgs/Advertising SVG.svg',
  catering: '/images/hero_section_svgs/Cattering SVG.svg',
  electric: '/images/hero_section_svgs/Electricity SVG.svg',
  events: '/images/hero_section_svgs/Event Administration SVG.svg',
  travel: '/images/hero_section_svgs/Travel & Tourism SVG.svg',
};

export default function Navbar({ lang, onToggleLang, onPickSector }) {
  const navigate = useNavigate();
  const handleSectorPick = (id) => {
    const route = SECTOR_ROUTES[id];
    if (route) {
      navigate(route);
    } else {
      onPickSector?.(id);
    }
  };

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'sectors' | 'vision' | null
  const [hoveredVisionCard, setHoveredVisionCard] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSectorsOpen, setMobileSectorsOpen] = useState(false);
  const [mobileVisionOpen, setMobileVisionOpen] = useState(false);
  const closeTimer = useRef(null);

  const openMenu = (name) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(name);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);

  // Disable body scroll when mobile navbar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMobileSectorsOpen(false);
      setMobileVisionOpen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const links = [
    { href: '#', label: 'قطاعات المؤسسة', dropdownType: 'sectors' },
    { href: '#about', label: 'حول المؤسسة' },
    { href: '#vision', label: 'رؤية2030', dropdownType: 'vision' },
    { href: '#projects', label: 'محفظة أعمالنا' },
  ];

  const sectorEntries = SECTORS.filter((s) => s.id !== 'main');

  return (
    <header
      className={[
        'navbar-glass fixed top-0 inset-x-0 z-[60] transition-all duration-300',
        scrolled ? 'scrolled' : '',
      ].join(' ')}
    >
      <div className="container-x flex items-center justify-between h-[72px] gap-6">
        {/* Logo — max RIGHT in RTL (start side) */}
        <Link to="/" className="shrink-0 order-first">
          <HamzaWordmark dark />
        </Link>

        {/* Nav links + lang + CTA cluster — grouped at max LEFT in RTL (end side) */}
        <div className="flex items-center gap-1 order-last">
          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-3">
            {links.map((l) => {
              if (l.dropdownType === 'sectors' || l.dropdownType === 'vision') {
                const isOpen = activeMenu === l.dropdownType;
                return (
                  <div
                    key={l.label}
                    className="relative"
                    onMouseEnter={() => openMenu(l.dropdownType)}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      className="nav-link-dark flex items-center gap-1.5"
                      aria-expanded={isOpen}
                    >
                      {l.label}
                      <svg width="12" height="12" viewBox="0 0 12 12" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              }

              return (
                <a
                  key={l.label}
                  href={l.href}
                  className="nav-link-dark"
                >
                  {l.label}
                </a>
              );
            })}
            {/* CTA */}
            <Link to="/contact" className="nav-cta-btn">
              تواصل معنا
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </nav>

          {/* Divider (desktop only) */}
          <span className="hidden lg:block w-px h-5 bg-cream/15 mx-2" />

          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            className="nav-lang-toggle hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            aria-label="تبديل اللغة"
            title="تبديل اللغة (للعرض فقط)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7F0F5" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
            </svg>
            العربية
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-cream/10 text-cream"
            aria-label="القائمة"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Full-width mega menus (desktop) ──────────────────────────────── */}
      <AnimatePresence>
        {activeMenu === 'sectors' && (
          <motion.div
            key="sectors-mega"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mega-menu hidden lg:block"
            onMouseEnter={() => openMenu('sectors')}
            onMouseLeave={scheduleClose}
          >
            <div className="mega-menu__inner">
              <div className="mega-menu__header">
                <div className="flex items-baseline gap-3">
                  <span className="mega-menu__eyebrow">القطاعات</span>
                  <h3 className="mega-menu__title">خمسة عوالم تحت مظلة الهمزة المتطورة</h3>
                </div>
                <span className="mega-menu__hint">اختر القطاع للانتقال إلى موقعه</span>
              </div>

              <div className="sector-mega-grid">
                {sectorEntries.map((s) => {
                  const Mark = MARK_BY_ID[s.id];
                  const hero = SECTOR_HERO[s.id];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className="sector-card"
                      style={{ '--card-accent': s.color, '--card-accent-soft': s.colorSoft }}
                      onClick={() => {
                        handleSectorPick(s.id);
                        setActiveMenu(null);
                      }}
                    >
                      <div className="sector-card__hero">
                        {hero && <img src={hero} alt="" loading="lazy" />}
                      </div>
                      <div className="sector-card__name-row">
                        <span className="sector-card__glyph">
                          {Mark && <Mark width={14} height={14} />}
                        </span>
                        <span className="sector-card__name">{s.name}</span>
                      </div>
                      <div className="sector-card__tagline">{s.tagline}</div>
                      <p className="sector-card__desc">{s.description}</p>
                      <span className="sector-card__cta">
                        {SECTOR_CTA[s.id] || 'زيارة الموقع'}
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'vision' && (
          <motion.div
            key="vision-mega"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mega-menu hidden lg:block"
            onMouseEnter={() => openMenu('vision')}
            onMouseLeave={scheduleClose}
          >
            <div className="mega-menu__inner">
              <div className="mega-menu__header">
                <div className="flex items-baseline gap-3">
                  <span className="mega-menu__eyebrow">رؤية 2030</span>
                  <h3 className="mega-menu__title">شركاء في صناعة المستقبل</h3>
                </div>
                <span className="mega-menu__hint">تعرّف على البرنامج الوطني ومساهمة الهمزة المتطورة</span>
              </div>

              <div
                className={`vision2030__cards rounded-xl overflow-hidden border border-cream/[0.07] ${
                  hoveredVisionCard === 'commitment' ? 'hover-commitment' :
                  hoveredVisionCard === 'vision' ? 'hover-vision' : ''
                }`}
                style={{
                  borderTop: '1px solid rgba(247, 240, 245, 0.07)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                {VISION_CARDS.map((card) => (
                    <div
                      key={card.id}
                      className={`vision2030__card vision2030__card--${card.accent} ${hoveredVisionCard === card.id ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredVisionCard(card.id)}
                      onMouseLeave={() => setHoveredVisionCard(null)}
                      style={{
                        padding: '26px 30px',
                        gap: '10px',
                        borderTopWidth: '2px',
                      }}
                    >
                      <div className="vision2030__card-glow" />
                      <div className="vision2030__card-icon" style={{ width: '38px', height: '38px' }}>
                        <img src={card.icon} alt="" style={{ width: '22px', height: '22px' }} />
                      </div>
                      <h3 className="vision2030__card-title" style={{ fontSize: '1.1rem' }}>{card.title}</h3>
                      <p className="vision2030__card-desc" style={{ fontSize: '0.78rem', lineHeight: '1.7', marginBottom: '4px' }}>{card.description}</p>
                      {card.cta.external ? (
                        <a
                          href={card.cta.href}
                          className="vision2030__cta"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ padding: '7px 20px', fontSize: '0.78rem', marginTop: 'auto' }}
                        >
                          {card.cta.label}
                        </a>
                      ) : (
                        <Link
                          to={card.cta.href}
                          className="vision2030__cta"
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                          style={{ padding: '7px 20px', fontSize: '0.78rem', marginTop: 'auto' }}
                        >
                          {card.cta.label}
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'calc(100vh - 72px)', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden fixed top-[72px] inset-x-0 bottom-0 z-50 overflow-y-auto border-t border-cream/10"
            style={{ height: 'calc(100vh - 72px)', background: 'rgba(11,18,32,0.98)', backdropFilter: 'blur(20px)' }}
          >
            <div className="container-x py-6 flex flex-col gap-4 pb-12" dir="rtl">
              {/* 1. قطاعات المؤسسة (Expandable) */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileSectorsOpen(!mobileSectorsOpen)}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-cream/5 font-semibold text-cream/85 text-[0.9rem] transition-colors"
                >
                  <span>قطاعات المؤسسة</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className={`transition-transform ${mobileSectorsOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileSectorsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-1.5 pr-3 pl-1 mt-1 border-r border-cream/5"
                    >
                      {sectorEntries.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            handleSectorPick(s.id);
                            setMobileOpen(false);
                          }}
                          className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg hover:bg-cream/5 transition-colors"
                        >
                          {/* Left side in LTR / End in RTL: Left Arrow */}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cream/35">
                            <path d="M15 19l-7-7 7-7" />
                          </svg>

                          {/* Right side in LTR / Start in RTL: Title, Divider, Icon */}
                          <div className="flex items-center gap-3">
                            <span className="text-cream/75 text-[0.82rem] font-medium">{s.name}</span>
                            <div className="w-px h-3.5 bg-cream/15" /> {/* thin divider */}
                            <img
                              src={SECTOR_ICONS_MOBILE[s.id]}
                              alt=""
                              className="w-4.5 h-4.5 object-contain"
                            />
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. حول المؤسسة */}
              <a
                href="#about"
                className="px-3 py-3 rounded-lg hover:bg-cream/5 font-semibold text-cream/85 text-[0.9rem] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                حول المؤسسة
              </a>

              {/* 3. رؤية 2030 (Expandable) */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileVisionOpen(!mobileVisionOpen)}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-cream/5 font-semibold text-cream/85 text-[0.9rem] transition-colors"
                >
                  <span>رؤية 2030</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className={`transition-transform ${mobileVisionOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileVisionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-1.5 pr-3 pl-1 mt-1 border-r border-cream/5"
                    >
                      {VISION_CARDS.map((card) => {
                        const inner = (
                          <div className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg hover:bg-cream/5 transition-colors">
                            {/* Left side in LTR / End in RTL: Left Arrow */}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cream/35">
                              <path d="M15 19l-7-7 7-7" />
                            </svg>

                            {/* Right side in LTR / Start in RTL: Title, Divider, Icon */}
                            <div className="flex items-center gap-3">
                              <span className="text-cream/75 text-[0.82rem] font-medium">{card.title}</span>
                              <div className="w-px h-3.5 bg-cream/15" /> {/* thin divider */}
                              <img
                                src={card.icon}
                                alt=""
                                className="w-4.5 h-4.5 object-contain filter brightness-[1.5]"
                              />
                            </div>
                          </div>
                        );
                        return card.cta.external ? (
                          <a
                            key={card.id}
                            href={card.cta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link
                            key={card.id}
                            to={card.cta.href}
                            onClick={() => setMobileOpen(false)}
                          >
                            {inner}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. محفظة أعمالنا */}
              <a
                href="#projects"
                className="px-3 py-3 rounded-lg hover:bg-cream/5 font-semibold text-cream/85 text-[0.9rem] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                محفظة أعمالنا
              </a>

              {/* Contact Us CTA Button */}
              <Link
                to="/contact"
                className="nav-cta-btn justify-center mt-4 text-[0.9rem]"
                onClick={() => setMobileOpen(false)}
              >
                تواصل معنا
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
