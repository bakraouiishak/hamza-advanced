import React from 'react';
import { motion } from 'motion/react';
import { CT_CHEFS } from '../../data/catering.js';

/**
 * Chefs — three card profiles. The human element is the single strongest
 * trust signal a new catering brand can show; we lead with named chefs and
 * specific career anchors (hotel groups, training cities) instead of generic
 * "expert team" filler.
 */
export default function CtChefs() {
  return (
    <section id="chefs" className="ct-section ct-section--alt">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">خبراء الطبخ</span>
          <h2 className="ct-h2">
            <span className="ct-hl">شيفات</span> يحملون توقيع الطبق
          </h2>
          <p className="ct-lede">
            خط شيفاتنا التنفيذي يجمع بين مدرسة الفنادق الفاخرة والمائدة السعودية
            الأصيلة — وراء كل طبق نُقدّمه اسم وخبرة سنوات.
          </p>
        </div>

        <div className="ct-chefs">
          {CT_CHEFS.map((c, i) => (
            <motion.article
              key={c.name}
              className="ct-chef"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ct-chef__photo">
                <img src={c.img} alt={c.name} />
              </div>
              <div className="ct-chef__body">
                <span className="ct-chef__role">{c.role}</span>
                <h3 className="ct-chef__name">{c.name}</h3>
                <p className="ct-chef__bio">{c.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
