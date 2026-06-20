import React from 'react';
import { motion } from 'motion/react';
import { TR_BRAND } from '../../data/travel.js';

/**
 * Travel hero — eyebrow pill, two-line display headline with cyan highlight,
 * lede, dual CTA, stat strip. The side visual is the Identity Compass needle
 * inside a rotating dial — exploration in motion. The "Identity Travel Paths"
 * dashed line slips through the hero, with the same compass riding it.
 */
export default function TrHero() {
  return (
    <section className="tr-hero">
      <div className="tr-hero__pattern" />  

      {/* Travel path that crosses the hero — compass slides along it */}
      <svg className="tr-hero__path" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden filter="blur(2.5px)" opacity={0.5}>
        <path
          id="tr-hero-path"
          d="M -20 480 Q 220 260, 480 360 T 920 220 Q 999 180, 1240 320"
          fill="none"
          stroke="rgba(91, 216, 232, 0.32)"
          strokeWidth="2"
          strokeDasharray="6 9"
          strokeLinecap="round"
        />
        <g>
          <image
            href="/travel/Identity Compass.svg"
            width="44"
            height="44"
            x="-22"
            y="-22"
            className="tr-hero__path-compass"
          >
            <animateMotion
              dur="25s"
              repeatCount="indefinite"
            >
              <mpath href="#tr-hero-path" />
            </animateMotion>
          </image>
        </g>
      </svg>

      <div className="tr-hero__inner">
        <div>
          <motion.span
            className="tr-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            قطاع السفر والسياحة — {TR_BRAND.tagline}
          </motion.span>

          <motion.h1
            className="tr-hero__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>إلى كل وجهة، </span>
            <span className="tr-hl">باتجاه واحد:</span>
            <br />
            <span className="tr-hero__heading-accent">راحتك.</span>
            <br />
            <span className="tr-hero__heading-sub">
              نُخطّط كل رحلة كأنها صُمّمت لك وحدك.
            </span>
          </motion.h1>

          <motion.p
            className="tr-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {TR_BRAND.short}
          </motion.p>

          <motion.div
            className="tr-hero__cta-row"
            initial={{ opacity: 0, y: 14, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#contact" className="tr-btn tr-btn--primary">
              خطّط رحلتك
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#services" className="tr-btn tr-btn--ghost">
              تصفّح خدماتنا
            </a>
          </motion.div>

          <motion.div
            className="tr-hero__stats"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { n: '8', l: 'خدمات سفر متكاملة' },
              { n: '24/7', l: 'مرافقة المسافر' },
              { n: '∞', l: 'وجهات حول العالم' },
              { n: '100%', l: 'تخصيص لكل رحلة' },
            ].map((s) => (
              <div key={s.l} className="tr-hero__stat">
                <div className="tr-hero__stat-num">{s.n}</div>
                <div className="tr-hero__stat-lbl">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="tr-hero__visual"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="tr-hero__ring" />
          <div className="tr-hero__ring tr-hero__ring--mid" />
          <div className="tr-hero__ring tr-hero__ring--inner" />
          <div className="tr-hero__dial" aria-hidden>
            {/* cardinal marks on the outer ring */}
            {['N', 'E', 'S', 'W'].map((c, i) => (
              <span key={c} className="tr-hero__cardinal" style={{ transform: `rotate(${i * 90}deg)` }}>
                <span>{c}</span>
              </span>
            ))}
          </div>
          <img src="/travel/Identity Compass.svg" alt="" className="tr-hero__compass" />
        </motion.div>
      </div>
    </section>
  );
}
