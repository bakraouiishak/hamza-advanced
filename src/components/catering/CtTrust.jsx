import React from 'react';
import { motion } from 'motion/react';
import { CT_TRUST } from '../../data/catering.js';
import { ShieldIcon, LeafIcon, TruckIcon, ClockIcon, MenuIcon, ChefIcon } from './CtIcons.jsx';

const ICONS = [ShieldIcon, ChefIcon, TruckIcon, MenuIcon, ClockIcon, LeafIcon];

/**
 * Trust strip — six factual commitments (licenses, insurance, cold-chain,
 * dietary accommodations). For a brand-new sector this answers the unspoken
 * question every procurement lead asks first: "what guardrails do you have?"
 */
export default function CtTrust() {
  return (
    <section className="ct-section">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">ضمانات الجودة</span>
          <h2 className="ct-h2">
            معايير <span className="ct-hl">نقف خلفها</span>
          </h2>
          <p className="ct-lede">
            كل بند هنا التزام مكتوب نراجعه دورياً مع عملائنا — وليس وعداً
            تسويقياً عابراً.
          </p>
        </div>

        <div className="ct-trust">
          {CT_TRUST.map((t, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={t.title}
                className="ct-trust__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="ct-trust__icon">
                  <Icon />
                </span>
                <div>
                  <h3 className="ct-trust__title">{t.title}</h3>
                  <p className="ct-trust__body">{t.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
