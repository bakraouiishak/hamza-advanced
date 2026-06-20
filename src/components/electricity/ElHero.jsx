import React from 'react';
import { motion } from 'motion/react';
import { EL_BRAND } from '../../data/electricity.js';

/**
 * Electricity hero — eyebrow pill, two-line display headline with blue
 * highlight, lede, dual CTA, stat strip. Side visual is the electricity logo
 * mark inside three concentric glowing rings — a static "energy core".
 */
export default function ElHero() {
  return (
    <section className="el-hero">
      <div className="el-hero__grid" />
      <div className="el-hero__pattern" />

      <div className="el-hero__inner">
        <div>
          <motion.span
            className="el-hero__eyebrow"
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            قطاع الكهرباء — {EL_BRAND.tagline}
          </motion.span>

          <motion.h1
            className="el-hero__heading"
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>الكهرباء، </span>
            <span className="el-hl">ليه مختصين.</span>
            <br />
            <span style={{ fontSize: '0.7em', color: 'rgba(157,150,155,1)' }}>
              توريد وصيانة, بأعلى معايير السلامة.
            </span>
          </motion.h1>

          <motion.p
            className="el-hero__body"
            initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {EL_BRAND.short}
          </motion.p>

          <motion.div
            className="el-hero__cta-row"
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#contact" className="el-btn el-btn--primary">
              اطلب عرض سعر
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#services" className="el-btn el-btn--ghost">
              تصفّح خدماتنا
            </a>
          </motion.div>

          <motion.div
            className="el-hero__stats"
            initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { n: '11+', l: 'سنوات خبرة' },
              { n: '800kVA', l: 'أعلى سعة UPS' },
              { n: '24/7', l: 'دعم فني' },
              { n: '4000A', l: 'سعة ATS' },
            ].map((s) => (
              <div key={s.l} className="el-hero__stat">
                <div className="el-hero__stat-num">{s.n}</div>
                <div className="el-hero__stat-lbl">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="el-hero__visual"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="el-hero__ring" />
          <div className="el-hero__ring el-hero__ring--mid" />
          <div className="el-hero__ring el-hero__ring--inner" />
          <video src="/electricity/elHero/el-hero-motion.webm" preload="metadata" autoPlay loop muted playsInline />
        </motion.div>
      </div>
    </section>
  );
}
