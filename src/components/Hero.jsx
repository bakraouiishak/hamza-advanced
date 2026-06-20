import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, color } from 'motion/react';
import { Link } from 'react-router-dom';
import { SECTOR_BY_ID } from '../data/sectors.js';
import HamzaWheel from './HamzaWheel.jsx';
import { feDropShadow } from 'motion/react-client';

/**
 * Hero — "Hero Section Main Idle" matching the Figma reference.
 *
 * Layout (visual, left→right):
 *   [empty image slot] | Text content (center-right) | HamzaWheel (far right, half-cropped)
 *
 * Clicking a wheel wedge swaps in the matching sector's hero content
 * (eyebrow stays constant, line-2 noun + accent colour change, body stays
 * constant, CTAs adapt). The clicked wedge stays accent-coloured after the
 * mouse leaves; the others sit in the deactivated dark state.
 */

// Per-sector hero copy. Eyebrow stays constant; line-2 noun, body, media and
// CTA targets adapt. Bodies mirror the main paragraph's "from X, through Y,
// to Z" cadence and roughly its length.
const SECTOR_HERO = {
  main: {
    line1: 'عالم من',
    line2: 'الخيـارات',
    body: 'الهمزة المتطورة هي بيت خدمات متكامل يجمع تحت مظلّته خطوط أعمال متعددة، من التصميم، مرورًا بالطباعة وصولاً إلى تنظيم الفعاليات والإدارة.',
    media: { src: '/images/hero-images/main.jpg', type: 'image' },
  },
  ads: {
    line1: 'عالم من',
    line2: 'الاعلانات',
    body: 'قطاع الدعاية والإعلان في الهمزة المتطورة يحوّل الأفكار إلى أثر بصري ملموس، من تصميم الهويات، مرورًا بالطباعة الرقمية واللافتات، وصولاً إلى الحملات الإبداعية التي تترك بصمة لا تُنسى.',
    media: { src: '/images/hero-images/advertising.mp4', type: 'video' },
    siteHref: '/sectors/advertising',
    marketplaceHref: '/sectors/advertising/marketplace',
  },
  events: {
    line1: 'عالم من',
    line2: 'الفعاليــات',
    body: 'قطاع إدارة وإقامة الفعاليات يقدّم حلولاً متكاملة من التخطيط الاستراتيجي، مرورًا بالتنسيق اللوجستي والتنفيذ الميداني، وصولاً إلى إدارة المؤتمرات والمناسبات الرسمية بمعايير احترافية عالية.',
    media: { src: '/images/hero-images/events.jpg', type: 'image' },
    siteHref: '/sectors/events',
  },
  electric: {
    line1: 'عالم من',
    line2: 'الكهرباء',
    body: 'قطاع الكهرباء يوفّر منظومة هندسية متكاملة للأنظمة الحرجة، من توريد المولّدات وأنظمة UPS، مرورًا بالتركيب والصيانة الدورية، وصولاً إلى الاستشارات الفنية للقطاعين التجاري والحكومي.',
    media: { src: '/images/hero-images/electricity.avif', type: 'image' },
    siteHref: '/sectors/electricity',
  },
  travel: {
    line1: 'عالم من',
    line2: 'الاكتشـاف',
    body: 'قطاع السفر والسياحة يصمّم تجارب سفر استثنائية للأفراد والمجموعات، من حجوزات الطيران والباقات السياحية، مرورًا بإصدار التأشيرات، وصولاً إلى تنظيم رحلات مؤسسية مخصّصة بأعلى معايير الراحة.',
    media: { src: '/images/hero-images/travel.jpg', type: 'image' },
    siteHref: '/sectors/travel',
  },
  catering: {
    line1: 'عالم من',
    line2: 'التموين',
    body: 'قطاع التموين والإعاشة يقدّم خدمات ضيافة بمعايير راقية للمؤسسات والفعاليات، من تخطيط القوائم المتنوعة، مرورًا بإعداد الوجبات اليومية، وصولاً إلى تنظيم بوفيهات المناسبات بأعلى مستويات الجودة.',
    media: { src: '/images/hero-images/catering.mp4', type: 'video' },
    siteHref: '/sectors/catering',
  },
};

export default function Hero({ activeId, onPickSector }) {
  const active = SECTOR_BY_ID[activeId] || SECTOR_BY_ID.main;
  const isMain = active.id === 'main';
  const content = SECTOR_HERO[active.id] || SECTOR_HERO.main;
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Primary CTA target — sector site if available, otherwise inert.
  const SiteCTA = ({ children, className, style }) => {
    if (content.siteHref) {
      return <Link to={content.siteHref} className={className} style={style}>{children}</Link>;
    }
    return <a href="#" className={className} style={style}>{children}</a>;
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-figma"
      data-sector={active.sectorAttr || undefined}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 500ms ease-out',
      }}
    >
      {/* ── Background gradient ── */}
      <div className="hero-figma__bg" />

      {/* ── Per-sector media (image or video) — grayscale + 0.6 opacity ── */}
      <AnimatePresence mode="wait">
        {content.media && (
          <motion.div
            key={`media-${active.id}`}
            className="hero-figma__media"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            {content.media.type === 'video' ? (
              <video
                src={content.media.src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <img src={content.media.src} alt="" loading="eager" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dark gradient overlay (always on top of media) ── */}
      {content.media && <div className="hero-figma__media-overlay" aria-hidden="true" />}

      {/* ── Image slot (left side) — intentionally blank; per-sector image
            will be wired in later by the owner. ── */}
      <div className="hero-figma__portrait-wrap" aria-hidden="true" />

      {/* ── Interactive Hamza Wheel (right side, half-cropped) ── */}
      <div className="hero-figma__wheel-wrap">
        <HamzaWheel activeSectorId={activeId} onSectorClick={onPickSector} />
      </div>

      {/* ── Content area (center-right) ── */}
      <div className="hero-figma__content">
        {/* Eyebrow */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`eb-${active.id}`}
            className="hero-figma__eyebrow"
            style={{ color: active.color, textShadow: `0 0 12px ${active.color}` }}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(10px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            مؤسسة الهمزة المتطورة
          </motion.p>
        </AnimatePresence>

        {/* Main heading — two lines */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`h1-${active.id}`}
            className="hero-figma__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(25px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero-figma__heading-line1">{content.line1}</span>
            <span className="hero-figma__heading-line2" style={{ color: active.color, textShadow: `0 0 40px ${active.color}` }}>
              {content.line2}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Body text — constant across sectors */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`body-${active.id}`}
            className="hero-figma__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(10px)' }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.body}
          </motion.p>
        </AnimatePresence>

        {/* CTA buttons */}
        <motion.div
          className="hero-figma__cta-row"
          initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {isMain ? (
            <>
              <a
                href="#"
                className="hero-figma__btn hero-figma__btn--ghost"
                style={{
                  '--accent-color': active.color,
                  '--accent-color-soft': active.colorSoft || active.color,
                  '--accent-color-deep': active.colorDeep || active.color,
                  '--accent-contrast': '#0b1220',
                }}
              >
                تصفح خدماتنا
              </a>
              <a
                href="#"
                className="hero-figma__btn hero-figma__btn--primary"
              >
                تواصل معنا
              </a>
            </>
          ) : (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                onClick={() => onPickSector('main')}
                className="hero-figma__btn hero-figma__reset-btn"
                title="العودة للهوية الأم"
              >
                ↺
              </motion.button>
              <SiteCTA
                className="hero-figma__btn hero-figma__btn--ghost"
                style={{
                  '--accent-color': active.color,
                  '--accent-color-soft': active.colorSoft || active.color,
                  '--accent-color-deep': active.colorDeep || active.color,
                  '--accent-contrast': active.contrast || '#0b1220',
                }}
              >
                موقع القطاع
              </SiteCTA>
              {content.marketplaceHref ? (
                <Link
                  to={content.marketplaceHref}
                  className="hero-figma__btn hero-figma__btn--primary"
                >
                  المتجر الالكتروني
                </Link>
              ) : (
                <a
                  href="#"
                  className="hero-figma__btn hero-figma__btn--primary"
                >
                  تواصل معنا
                </a>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
