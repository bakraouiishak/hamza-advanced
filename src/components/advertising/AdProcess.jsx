import React from 'react';
import { motion } from 'motion/react';
import { AD_PROCESS } from '../../data/advertising.js';

/**
 * Process — four-step horizontal timeline. Numbers are oversized "ghost" type
 * that snap to brand yellow on hover, echoing the Hamza Wasl PDF's section
 * separator pages (where the chapter numerals dominate the layout).
 */
export default function AdProcess() {
  return (
    <section id="process" className="ad-section ad-bg">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">منهجية العمل</span>
          <h2 className="ad-h2">
            كيف <span className="ad-hl">نُنفذ</span> مشروعك الإعلاني
          </h2>
          <p className="ad-lede">
            دورة حياة كاملة لمشروعك — من الإحاطة الأولى إلى التسليم النهائي،
            مع دعم لوجستي ومتابعة بعد الإطلاق لقياس الأثر.
          </p>
        </header>

        <div className="ad-process">
          {AD_PROCESS.map((step, i) => (
            <motion.article
              key={step.n}
              className="ad-process__step"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ad-process__n">{step.n}</div>
              <h3 className="ad-process__title">{step.title}</h3>
              <p className="ad-process__body">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
