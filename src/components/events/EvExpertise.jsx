import React from 'react';
import { motion } from 'motion/react';
import { EV_PROMISE } from '../../data/events.js';

/**
 * Expertise / promise — four stat cards highlighting the sector's three
 * permanent characteristics (scientific methodology / technical scope /
 * professional specialization) plus the B2B partner ecosystem badge.
 * Sits after services to anchor the "why us" narrative before the process.
 */
export default function EvExpertise() {
  return (
    <section id="why" className="ev-section ev-pattern-bg">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">ممكّنات نجاح الفعالية الدائمة</span>
          <h2 className="ev-h2">
            خبرة <span className="ev-hl">يُعتمد عليها</span>
          </h2>
          <p className="ev-lede">
            يرتكز نموذج أعمالنا الهيكلي على ثلاث خصائص تشغيلية واضحة تضمن جودة
            المخرجات التشغيلية وعائدات الأثر الاجتماعي والمؤسسي.
          </p>
        </header>

        <div className="ev-promise">
          {EV_PROMISE.map((p, i) => (
            <motion.article
              key={p.title}
              className="ev-promise__card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ev-promise__stat">{p.stat}</div>
              <div className="ev-promise__stat-lbl">{p.statLabel}</div>
              <h3 className="ev-promise__title">{p.title}</h3>
              <p className="ev-promise__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
