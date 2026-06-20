import React from 'react';
import { motion } from 'motion/react';
import { AD_PROMISE } from '../../data/advertising.js';

/**
 * Promise pillars — four "stat + body" cards built from the brand's verbatim
 * promise statement ("نعدكم بالدقة في الأداء والسرعة في إنهاء الأعمال…").
 * Mirrors the AboutUs stat-card primitive on the main site, in yellow.
 */
export default function AdPromise() {
  return (
    <section className="ad-section">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">وعد الهمزة المتطورة</span>
          <h2 className="ad-h2">
            ما الذي <span className="ad-hl">يجعلنا مختلفين</span>؟
          </h2>
          <p className="ad-lede">
            هدفنا الرئيس إرضاء العميل، وليس الربح المادي — لذلك أسعارنا لا
            تقبل المنافسة، وأداؤنا لا يقبل التنازل عن الجودة.
          </p>
        </header>

        <div className="ad-promise">
          {AD_PROMISE.map((p, i) => (
            <motion.article
              key={p.title}
              className="ad-promise__card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ad-promise__stat">{p.stat}</div>
              <div className="ad-promise__stat-lbl">{p.statLabel}</div>
              <h3 className="ad-promise__title">{p.title}</h3>
              <p className="ad-promise__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
