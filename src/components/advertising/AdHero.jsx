import React from 'react';
import { motion } from 'motion/react';
import { AD_BRAND } from '../../data/advertising.js';

/**
 * Advertising hero — same skeleton as the main Hero: eyebrow pill, two-line
 * display headline with an accented highlight word, lede paragraph, dual CTA
 * row, and a side visual. The visual swaps out the wheel for three stacked
 * brand mockups (business card / letterhead / mug) that drift gently to
 * communicate "print & print & print" without an obvious carousel.
 */
export default function AdHero() {
  return (
    <section className="ad-hero">

      <div className="ad-hero__background">
        <div className="ad-hero__video" />
        <video autoPlay muted loop playsInline className="video-background">
          <source src="/advertising/hero/advertising hero video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="ad-hero__inner">
        {/* ── Copy column ── */}
        <div>
          <motion.span
            className="ad-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            قطاع الدعاية والإعلان
          </motion.span>

          <motion.h1
            className="ad-hero__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>حضور بصري </span>
            <span className="ad-hl">لا يُنسى.</span>
            <br />
            <span style={{ fontSize: '0.7em', color: 'rgba(157,150,155,1)' }}>
              فِكر يصمد، طباعة تُلهم.
            </span>
          </motion.h1>

          <motion.p
            className="ad-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {AD_BRAND.short} نحن نضفي روحًا وحيوية على كل منتج لِيخطف الأنظار،
            ونتعهد بالدقة في الأداء والسرعة في الإنجاز — بأسعار لا تقبل المنافسة.
          </motion.p>

          <motion.div
            className="ad-hero__cta-row"
            initial={{ opacity: 0, y: 14, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#contact" className="ad-btn ad-btn--primary">
              اطلب عرض سعر
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#services" className="ad-btn ad-btn--ghost">
              تصفّح خدماتنا
            </a>
          </motion.div>

          {/* Inline stat strip — anchors the brand's promise */}
          <motion.div
            className="ad-hero__stats"
            initial={{ opacity: 0, y: 12, filter: 'blur(25px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { n: '250+', l: 'مشروع منفّذ' },
              { n: '80+', l: 'هوية بصرية' },
              { n: '11+', l: 'سنوات خبرة' },
              { n: '24/6', l: 'جاهزية' },
            ].map((s) => (
              <div key={s.l} className="ad-hero__stat">
                <div className="ad-hero__stat-num">{s.n}</div>
                <div className="ad-hero__stat-lbl">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Visual column — stacked mockups ── */}
        <motion.div
          className="ad-hero__visual"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(25px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ad-hero__card ad-hero__card--a">
            <img src="/advertising/mockups/Business Card.jpg" alt="" />
          </div>
          <div className="ad-hero__card ad-hero__card--b">
            <img src="/advertising/mockups/A4 Letterhead.jpg" alt="" />
          </div>
          <div className="ad-hero__card ad-hero__card--c">
            <img src="/advertising/mockups/Mug Mockup.jpg" alt="" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
