import React from 'react';
import { motion } from 'motion/react';
import { CT_PROCESS } from '../../data/catering.js';

/**
 * Process — 4 steps from initial consultation to on-site service. Same
 * timeline pattern used in the advertising sub-site for visual consistency.
 */
export default function CtProcess() {
  return (
    <section id="process" className="ct-section">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">كيف نعمل</span>
          <h2 className="ct-h2">
            من <span className="ct-hl">الاستشارة</span> إلى آخر ضيف
          </h2>
          <p className="ct-lede">
            منهجية واضحة بأربع مراحل تربط طموح العميل بتنفيذ ميداني منضبط — لا
            مفاجآت في الجودة ولا في التكلفة.
          </p>
        </div>

        <div className="ct-process">
          {CT_PROCESS.map((p, i) => (
            <motion.div
              key={p.n}
              className="ct-process__step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ct-process__n">{p.n}</div>
              <h3 className="ct-process__title">{p.title}</h3>
              <p className="ct-process__body">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
