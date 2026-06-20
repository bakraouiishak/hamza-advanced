import React from 'react';
import { motion } from 'motion/react';
import { TR_VALUES } from '../../data/travel.js';

/**
 * Values — four compact cards. Per the brief, this block sits near the END
 * of the page, just before the Vision/Mission pillars and the contact CTA.
 */
export default function TrValues() {
  return (
    <section id="values" className="tr-section tr-values-section">
      <div className="tr-section__inner">
        <header className="tr-section__head">
          <span className="tr-eyebrow">قيمنا</span>
          <h2 className="tr-h2">
            ما <span className="tr-hl">نؤمن به</span> في كل رحلة
          </h2>
          <p className="tr-lede">
            أربع قيم لا نتنازل عنها — كل برنامج سياحي، كل حجز، كل استشارة سفر،
            تمرّ من خلالها.
          </p>
        </header>

        <div className="tr-values">
          {TR_VALUES.map((v, i) => (
            <motion.article
              key={v.id}
              className="tr-value"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tr-value__num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="tr-value__title">{v.title}</h3>
              <p className="tr-value__body">{v.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
