import React from 'react';
import { motion } from 'motion/react';
import { TR_PROMISE } from '../../data/travel.js';

/**
 * Expertise / promise — four stat cards highlighting the company's
 * differentiators (services, personalization, support, reach). Anchors the
 * "why us" narrative immediately after the services grid.
 */
export default function TrExpertise() {
  return (
    <section id="why" className="tr-section tr-pattern-bg">
      <div className="tr-section__inner">
        <header className="tr-section__head">
          <span className="tr-eyebrow">لماذا نحن</span>
          <h2 className="tr-h2">
            تستحقّ تجربة <span className="tr-hl">كاملة</span>
          </h2>
          <p className="tr-lede">
            لأن السفر عالم إلهام وتجديد — فريق خبراء الهمزة المتطورة للسفر
            والسياحة يوفّر لك أفضل الحلول للسفر داخلياً وخارجياً، للأفراد
            والمجموعات والشركات.
          </p>
        </header>

        <div className="tr-promise">
          {TR_PROMISE.map((p, i) => (
            <motion.article
              key={p.title}
              className="tr-promise__card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tr-promise__stat">{p.stat}</div>
              <div className="tr-promise__stat-lbl">{p.statLabel}</div>
              <h3 className="tr-promise__title">{p.title}</h3>
              <p className="tr-promise__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
