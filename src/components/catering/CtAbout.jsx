import React from 'react';
import { motion } from 'motion/react';
import { CT_PILLARS } from '../../data/catering.js';
import { CookieIcon } from './CtIcons.jsx';

/**
 * About — three pillars (Vision, Mission, Goal). Same card pattern used in
 * other sub-sites; the gold accent on the label dot keeps it tied to the
 * catering identity.
 */
export default function CtAbout() {
  return (
    <section id="about" className="ct-section ct-section--alt">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">من نحن</span>
          <h2 className="ct-h2">
            ضيافة <span className="ct-hl">تُبنى على الثقة</span>
          </h2>
          <p className="ct-lede">
            ذراع التموين والإعاشة في الهمزة المتطورة : قطاع جديد ينطلق بمرجعية
            مؤسسية واضحة، ويحمل تجربة المجموعة في خدمة عملائها بأعلى المعايير.
          </p>
        </div>

        <div className="ct-pillars">
          {CT_PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              className="ct-pillar"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ct-pillar__label">{p.label}</span>
              <h3 className="ct-pillar__title">{p.title}</h3>
              <p className="ct-pillar__body">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
