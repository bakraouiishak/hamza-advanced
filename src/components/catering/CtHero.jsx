import React from 'react';
import { motion } from 'motion/react';
import { CT_BRAND, CT_HERO_STATS } from '../../data/catering.js';
import { CookieIcon } from './CtIcons.jsx';

/**
 * Catering hero — same skeleton as the parent/advertising hero (eyebrow → big
 * headline with gold highlight → lede → dual CTA → stat strip) but the visual
 * column is the brand's signature: a circular meal plate with the
 * identity-driven text-on-path halo from /public/catering. Two half-visible
 * spinning plates also bleed in from the edges to echo the round dishware
 * motif without competing with the headline.
 */
export default function CtHero() {
  return (
    <section className="ct-hero">
      <div className="ct-hero__background">
        {/* Video can be dropped at /public/catering/hero/catering-hero.mp4.
            Falls back gracefully to the still on Meal 2 if the video is absent. */}
        <video autoPlay muted loop playsInline poster="/catering/Meal 2.png">
          <source src="/catering/hero/catering-hero.mp4" type="video/mp4" autoPlay loop muted playsInline/>
        </video>
      </div>

      {/* Half-visible spinning plates on the edges — identity-driven decor */}
      <div
        className="ct-edge-plate ct-edge-plate--left"
        style={{ backgroundImage: 'url(/catering/Meal 1.png)' }}
        aria-hidden="true"
      />
      <div
        className="ct-edge-plate ct-edge-plate--right"
        style={{ backgroundImage: 'url(/catering/Meal 3.png)' }}
        aria-hidden="true"
      />

      <div className="ct-hero__inner">
        {/* Copy column */}
        <div>
          <motion.span
            className="ct-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            قطاع التموين والإعاشة
          </motion.span>
          <motion.h1
            className="ct-hero__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>عالم من </span>
            <span className="ct-hl">الضيافة</span>
            <br />
            <span style={{ fontSize: '0.7em', color: 'rgba(157,150,155,1)' }}>
              مذاق أصلي، تقديم بمعايير راقية.
            </span>
          </motion.h1>

          <motion.p
            className="ct-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {CT_BRAND.short} نُقدّم خدمات تموين وإعاشة للجهات الحكومية والشركات
            الكبرى، بكوادر سعودية مدرّبة وشيفات متخصصين، وبتوقيت لا يخذل المناسبة.
          </motion.p>

          <motion.div
            className="ct-hero__cta-row"
            initial={{ opacity: 0, y: 14, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#cta" className="ct-btn ct-btn--primary">
              اطلب عرض ضيافة
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#menu" className="ct-btn ct-btn--ghost">
              تصفّح القائمة
            </a>
          </motion.div>

          <motion.div
            className="ct-hero__stats"
            initial={{ opacity: 0, y: 12, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {CT_HERO_STATS.map((s) => (
              <div key={s.l} className="ct-hero__stat">
                <div className="ct-hero__stat-num">{s.n}</div>
                <div className="ct-hero__stat-lbl">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual column — round plate + identity text-on-path halo */}
        <motion.div
          className="ct-hero__visual"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(50px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ct-hero__plate">
            <video src="/catering/hero/catering-hero-motion.webm" autoPlay loop muted playsInline></video>
            <img src="/catering/Meal 1.png" alt="طبق ضيافة الهمزة" />
          </div>
          {/* Identity-driven text-on-path SVG from /public/catering */}
          <img
            className="ct-hero__path"
            src="/catering/Round text on path 1.svg"
            alt=""
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
