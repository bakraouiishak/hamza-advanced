import React from 'react';
import { motion } from 'motion/react';
import { EL_PILLARS } from '../../data/electricity.js';

/**
 * Mission / Vision / Goal pillars — three cards. Per the brief, this block
 * sits at the END of the page (just before the CTA / footer), reframing
 * everything the visitor saw above into the brand's "why".
 */
export default function ElPillars() {
  return (
    <section className="el-section el-pattern-bg">
      <div className="el-section__inner">
        <header className="el-section__head">
          <span className="el-eyebrow">من نحن</span>
          <h2 className="el-h2">
            رؤية، رسالة، <span className="el-hl">هدف.</span>
          </h2>
          <p className="el-lede">
            مؤسسة سعودية رسمية، تلتزم بجميع المعايير النظامية والتشريعات
            واللوائح التنظيمية — تقدّم لقطاع الكهرباء فكرًا جديدًا ووجهة نظر
            مختلفة.
          </p>
        </header>

        <div className="el-pillars">
          {EL_PILLARS.map((p, i) => (
            <motion.article
              key={p.id}
              className="el-pillar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="el-pillar__label">{p.label}</span>
              <h3 className="el-pillar__title">{p.title}</h3>
              <p className="el-pillar__body">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
