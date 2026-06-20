import React from 'react';
import { motion } from 'motion/react';
import { AD_FEATURED } from '../../data/advertising.js';

/**
 * Showcase — six featured "work categories" tiles. Each tile is a portrait
 * card with a brand mockup behind a darkening gradient; hover scales the
 * image and reveals the description copy. Visually equivalent to the case
 * gallery on the main Hamza Advanced site.
 */
export default function AdShowcase() {
  return (
    <section id="showcase" className="ad-section">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">نماذج من أعمالنا</span>
          <h2 className="ad-h2">
            مشاريع <span className="ad-hl">تُحدث الفرق</span>
          </h2>
          <p className="ad-lede">
            مؤسسة لها أعمال مميزة في جميع أنواع وسائل الدعاية والإعلان — قطاعات
            حكومية، تجارية، تعليمية، خيرية، ومبادرات وطنية.
          </p>
        </header>

        <div className="ad-showcase">
          {AD_FEATURED.map((item, i) => (
            <motion.article
              key={item.id}
              className="ad-show"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={item.image} alt={item.title} className="ad-show__img" loading="lazy" />
              <span className="ad-show__tag">{item.tag}</span>
              <div className="ad-show__caption">
                <h3 className="ad-show__title">{item.title}</h3>
                <p className="ad-show__desc">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
