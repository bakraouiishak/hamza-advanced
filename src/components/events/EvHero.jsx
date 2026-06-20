import React from 'react';
import { motion } from 'motion/react';
import { EV_BRAND } from '../../data/events.js';

/**
 * Events hero — eyebrow pill, display headline with pink highlight, lede,
 * dual CTA, stat strip. Side visual is the brand "رمز الامتياز" sparkle
 * inside three concentric glowing rings, flanked by floating sparkles.
 */
export default function EvHero() {
  return (
    <section className="ev-hero">
      <div className="ev-hero__pattern" />
      <div className="ev-hero__mark" />

      <div className="ev-hero__inner">
        <div>
          <motion.span
            className="ev-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            قطاع إدارة وإقامة الفعاليات — {EV_BRAND.taglineEn}
          </motion.span>

          <motion.h1
            className="ev-hero__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>تألق بفعالياتك </span>
            <span className="ev-hl">معنا.</span>
            <br />
            <span style={{ fontSize: '0.7em', color: 'rgba(154, 150, 155, 1)' }}>
              من الفكرة إلى التنفيذ : 17 مرحلة من الإشراف والمتابعة.
            </span>
          </motion.h1>

          <motion.p
            className="ev-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {EV_BRAND.short}
          </motion.p>

          <motion.div
            className="ev-hero__cta-row"
            initial={{ opacity: 0, y: 14, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#contact" className="ev-btn ev-btn--primary">
              احجز فعاليتك
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#projects" className="ev-btn ev-btn--ghost">
              تصفّح أعمالنا
            </a>
          </motion.div>

          <motion.div
            className="ev-hero__stats"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { n: '17', l: 'مرحلة تشغيلية' },
              { n: '10+', l: 'شركاء استراتيجيون' },
              { n: '08', l: 'خدمات متكاملة' },
              { n: '24/7', l: 'فِرَق ميدانية' },
            ].map((s) => (
              <div key={s.l} className="ev-hero__stat">
                <div className="ev-hero__stat-num">{s.n}</div>
                <div className="ev-hero__stat-lbl">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="ev-hero__visual"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ev-hero__ring" />
          <div className="ev-hero__ring ev-hero__ring--mid" />
          <div className="ev-hero__ring ev-hero__ring--inner" />
          <img src="/events/identity vector 1.svg" alt="" className="ev-hero__star" />
          <img src="/events/identity vector 1.svg" alt="" className="ev-hero__sparkle ev-hero__sparkle--a" />
          <img src="/events/identity vector 1.svg" alt="" className="ev-hero__sparkle ev-hero__sparkle--b" />
          <img src="/events/identity vector 2.svg" alt="" className="ev-hero__sparkle ev-hero__sparkle--c" />
        </motion.div>
      </div>
    </section>
  );
}
