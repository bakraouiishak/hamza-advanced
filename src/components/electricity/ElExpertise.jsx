import React from 'react';
import { motion } from 'motion/react';
import { EL_PROMISE } from '../../data/electricity.js';

/**
 * Expertise / promise — four stat cards highlighting the company's
 * differentiators (experience, 24/7 support, range, regulatory compliance).
 * Sits right after services to anchor the "why us" narrative before values.
 */
export default function ElExpertise() {
  return (
    <section id="why" className="el-section el-pattern-bg">
      <div className="el-section__inner">
        <header className="el-section__head">
          <span className="el-eyebrow">لماذا نحن</span>
          <h2 className="el-h2">
            خبرة <span className="el-hl">يُعتمد عليها</span>
          </h2>
          <p className="el-lede">
            هدفنا الرئيس: تطوير المشهد العام لقطاع الكهرباء — بأفضل الخدمات
            والمنتجات وأسعار لا تُنافس. لا نقبل التنازل عن الجودة.
          </p>
        </header>

        <div className="el-promise">
          {EL_PROMISE.map((p, i) => (
            <motion.article
              key={p.title}
              className="el-promise__card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="el-promise__stat">{p.stat}</div>
              <div className="el-promise__stat-lbl">{p.statLabel}</div>
              <h3 className="el-promise__title">{p.title}</h3>
              <p className="el-promise__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
