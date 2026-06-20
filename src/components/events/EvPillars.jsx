import React from 'react';
import { motion } from 'motion/react';
import { EV_PILLARS } from '../../data/events.js';

/**
 * Mission / Vision / Goal pillars — three cards. Per the brief, this block
 * sits near the END of the page (just before the CTA / footer), reframing
 * everything the visitor saw above into the brand's "why".
 */
export default function EvPillars() {
  return (
    <section className="ev-section ev-pattern-bg">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">من نحن</span>
          <h2 className="ev-h2">
            رؤية، رسالة، <span className="ev-hl">هدف.</span>
          </h2>
          <p className="ev-lede">
            مؤسسة همزة وصل للخدمات التجارية تلتزم بكافة المعايير النظامية
            والتشريعات واللوائح التنظيمية في المملكة العربية السعودية —
            ككيان رسمي رائد في إدارة وإقامة الفعاليات.
          </p>
        </header>

        <div className="ev-pillars">
          {EV_PILLARS.map((p, i) => (
            <motion.article
              key={p.id}
              className="ev-pillar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ev-pillar__label">{p.label}</span>
              <h3 className="ev-pillar__title">{p.title}</h3>
              <p className="ev-pillar__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
