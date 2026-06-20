import React from 'react';
import { motion } from 'motion/react';
import { AD_PILLARS } from '../../data/advertising.js';

/**
 * About / Pillars — three cards (Vision / Mission / Goal) sourced directly
 * from page 4 of the Hamza Wasl deck. Card hover lifts the surface and lights
 * a yellow glow at the top — the same gesture used on the main site's About,
 * just chromatically retuned.
 */
export default function AdAbout() {
  return (
    <section id="why" className="ad-section ad-pattern-bg">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">حول قطاع الدعاية والإعلان</span>
          <h2 className="ad-h2">
            نحن <span className="ad-hl">نُترجم الفكرة</span> إلى أثر بصري
          </h2>
          <p className="ad-lede">
            مؤسسة سعودية رسمية، تلتزم بجميع المعايير النظامية والتشريعات
            واللوائح التنظيمية — نقدم فكرًا جديدًا ووجهة نظر مختلفة في كل ما
            تحتاجه من دعاية وإعلان.
          </p>
        </header>
        <div className="ad-pillars">
          {AD_PILLARS.map((p, i) => (
            <motion.article
              key={p.id}
              className="ad-pillar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ad-pillar__label">{p.label}</span>
              <h3 className="ad-pillar__title">{p.title}</h3>
              <p className="ad-pillar__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
