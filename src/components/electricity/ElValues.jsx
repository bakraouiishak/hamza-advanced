import React from 'react';
import { motion } from 'motion/react';
import { EL_VALUES } from '../../data/electricity.js';

/**
 * Values — four compact cards. Placed near the end of the page (per brief),
 * just before the Vision/Mission/Goal pillars and the contact CTA.
 */
export default function ElValues() {
  return (
    <section id="values" className="el-section">
      <div className="el-section__inner">
        <header className="el-section__head">
          <span className="el-eyebrow">قيمنا</span>
          <h2 className="el-h2">
            ما <span className="el-hl">نؤمن به</span> في عملنا
          </h2>
          <p className="el-lede">
            أربع قيم لا نتنازل عنها — كل تركيبة، كل عقد صيانة، كل توصية فنية،
            تمرّ من خلالها.
          </p>
        </header>

        <div className="el-values">
          {EL_VALUES.map((v, i) => (
            <motion.article
              key={v.id}
              className="el-value"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="el-value__num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="el-value__title">{v.title}</h3>
              <p className="el-value__body">{v.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
