import React from 'react';
import { motion } from 'motion/react';
import { CT_EXPERTISE } from '../../data/catering.js';

/**
 * Expertise / "Why us" — four stat cards. Because the catering sector is brand
 * new, these data points emphasize regulatory standing (SFDA, HACCP) and the
 * operational backbone rather than client count.
 */
export default function CtExpertise() {
  return (
    <section id="why" className="ct-section">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">لماذا الهمزة</span>
          <h2 className="ct-h2">
            <span className="ct-hl">معايير راقية</span> تحفظ سُمعتك
          </h2>
          <p className="ct-lede">
            بناء قطاع تموين من داخل بيت خبرة مؤسسي يعني أنّ كل عقد جديد ينطلق من
            تراكم سنوات في إدارة المشاريع وضبط الجودة — وليس من نقطة الصفر.
          </p>
        </div>

        <div className="ct-expertise">
          {CT_EXPERTISE.map((e, i) => (
            <motion.div
              key={e.title}
              className="ct-expertise__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ct-expertise__stat">{e.stat}</div>
              <div className="ct-expertise__stat-lbl">{e.lbl}</div>
              <h3 className="ct-expertise__title">{e.title}</h3>
              <p className="ct-expertise__body">{e.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
