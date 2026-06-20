import React from 'react';
import { motion } from 'motion/react';
import { TR_PILLARS } from '../../data/travel.js';

/**
 * Vision / Message / Why-us pillars — three cards. Per the brief, this block
 * sits at the END of the page (just before the CTA / footer), reframing the
 * "why" behind everything the visitor saw above.
 */
export default function TrPillars() {
  return (
    <section className="tr-section">
      <div className="tr-section__inner">
        <header className="tr-section__head">
          <span className="tr-eyebrow">من نحن</span>
          <h2 className="tr-h2">
            رؤية، رسالة، <span className="tr-hl">سبب اختيارنا.</span>
          </h2>
          <p className="tr-lede">
            مؤسسة سعودية متخصصة في تنظيم الرحلات والتجارب السياحية داخلياً
            ودولياً — نؤمن أن السفر عالم إلهام وتجديد، ولذلك نخطّط كل رحلة كأنها
            صُمّمت لك وحدك لتستكشفها.
          </p>
        </header>

        <div className="tr-pillars">
          {TR_PILLARS.map((p, i) => (
            <motion.article
              key={p.id}
              className="tr-pillar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="tr-pillar__label">{p.label}</span>
              <h3 className="tr-pillar__title">{p.title}</h3>
              <p className="tr-pillar__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
