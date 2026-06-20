import React from 'react';
import { motion } from 'motion/react';
import { EV_VALUES } from '../../data/events.js';

/**
 * Values — six compact cards. Placed near the END of the page (per brief),
 * just before the Vision/Mission/Goal pillars and the contact CTA.
 */
export default function EvValues() {
  return (
    <section id="values" className="ev-section">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">قيمنا</span>
          <h2 className="ev-h2">
            ما <span className="ev-hl">نؤمن به</span> في عملنا
          </h2>
          <p className="ev-lede">
            ست قيم لا نتنازل عنها — كل فعالية، كل مؤتمر، كل لمسة بصرية تمرّ
            من خلالها.
          </p>
        </header>

        <div className="ev-values">
          {EV_VALUES.map((v, i) => (
            <motion.article
              key={v.id}
              className="ev-value"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ev-value__num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="ev-value__title">{v.title}</h3>
              <p className="ev-value__body">{v.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
