import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import useAuthGate from './useAuthGate.js';

/**
 * MarketHero — homepage opener.
 *
 * Layered background:
 *   • Layer -1 — full-bleed PNG photograph (/advertising/marketplace/hero/background.png)
 *   • Layer  0 — vertical gradient #0B1220 0% (top) → #0B1220 100% (bottom)
 *                so the image fades into the brand ink as the eye moves down.
 *
 * Visual column — WEBM motion design (with GIF fallback for browsers without
 * VP8/VP9 support). WEBM is preferred because it's typically 5-10× smaller
 * than the equivalent GIF and supports alpha + smoother frame interpolation.
 */
export default function MarketHero() {
  const { gate } = useAuthGate();
  const navigate = useNavigate();

  /* "تصفّح المنتجات" — public catalog (RequireAuth-gated, so anonymous
     visitors get bounced to the signup page by the route guard already).
     We pre-empt that for a snappier UX: send guests to /signup directly
     instead of letting them hit a redirect. */
  const browseProducts = () => {
    gate(() => navigate('/sectors/advertising/marketplace/products'));
  };

  /* "تتبع الطلبات" — replaces the old "عروض اليوم" placeholder. Takes
     the customer to their orders page. Guests → /signup. */
  const trackOrders = () => {
    gate(() => navigate('/sectors/advertising/marketplace/orders'));
  };

  return (
    <section className="mk-hero">
      {/* Layer -1 — background photograph */}
      <div className="mk-hero__bg" aria-hidden="true" />
      {/* Layer  0 — top→bottom ink gradient (transparent → full opacity) */}
      <div className="mk-hero__bg-grad" aria-hidden="true" />
      {/* Identity pattern overlay sits ABOVE the gradient (tiny, atmospheric) */}
      <div className="mk-hero__pattern" />

      <div className="mk-hero__inner">
        {/* Copy column */}
        <div>
          <motion.span
            className="mk-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            متجر قطاع الدعاية والإعلان
          </motion.span>

          <motion.h1
            className="mk-hero__title"
            initial={{ opacity: 0, y: 18, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            كل ما تحتاجه <span className="mk-hl">لِـحضور بصري</span>
            <br />
            <span style={{ fontSize: '0.7em', color: 'rgba(247,240,245,1)', fontWeight: '100' }}>
              في مكان واحد.
            </span>
          </motion.h1>

          <motion.p
            className="mk-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            تصفّح كتالوج المنتجات الدعائية والإعلانية الجاهزة للطلب — من
            المطبوعات والحروف البارزة إلى الهدايا والاستاندات. أسعار تنافسية،
            شحن سريع، ودعم متخصص يرافقك من الطلب حتى التسليم.
          </motion.p>

          <motion.div
            className="mk-hero__cta-row"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="mk-btn mk-btn--primary" onClick={browseProducts}>
              تصفّح المنتجات
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="mk-btn mk-btn--ghost" onClick={trackOrders}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginInlineEnd: 6 }}>
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M3 9h18M8 14h4" />
              </svg>
              تتبع الطلبات
            </button>
          </motion.div>
        </div>

        {/* Visual column — motion-design loop. WEBM for modern browsers, GIF
            fallback rendered behind by the <img>-style poster of the <video>
            tag. */}
        <motion.div
          className="mk-hero__motion"
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <video src="/advertising/marketplace/hero/marketplace hero gif.webm" preload="metadata" autoPlay loop muted playsInline />
        </motion.div>
      </div>
    </section>
  );
}