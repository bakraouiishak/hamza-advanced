import React from 'react';
import { motion } from 'motion/react';
import { CT_MENU } from '../../data/catering.js';

/**
 * Menu preview — bento grid of signature dishes. Hover reveals the description.
 * Acts as a quick visual taste-test for prospects browsing the page before
 * requesting a full menu PDF.
 */
export default function CtMenu() {
  return (
    <section id="menu" className="ct-section ct-section--alt">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">قائمتنا</span>
          <h2 className="ct-h2">
            مذاق <span className="ct-hl">يمثّل المملكة</span>
          </h2>
          <p className="ct-lede">
            مختارات من أطباقنا الأكثر طلباً في البوفيهات والفعاليات — قوائمنا
            الكاملة تُفصَّل لكل عميل بحسب طبيعة المناسبة وذوق الضيوف.
          </p>
        </div>

        <div className="ct-menu">
          {CT_MENU.map((d, i) => (
            <motion.article
              key={d.title}
              className="ct-dish"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <img className="ct-dish__img" src={d.img} alt={d.title} />
              <span className="ct-dish__tag">{d.tag}</span>
              <div className="ct-dish__caption">
                <h3 className="ct-dish__title">{d.title}</h3>
                <p className="ct-dish__desc">{d.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
