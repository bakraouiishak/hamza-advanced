import React from 'react';
import { motion } from 'motion/react';
import { CT_SERVICES } from '../../data/catering.js';
import { BuffetIcon, ChefIcon, MenuIcon, TruckIcon } from './CtIcons.jsx';

const ICONS = {
  institutional: ChefIcon,
  buffet: BuffetIcon,
  daily: TruckIcon,
  menu: MenuIcon,
};

/**
 * Services grid — four cards covering the catering product line: institutional
 * contracts, event buffets, daily packaged meals, and menu engineering. Hover
 * reveals the long-form description; the icon plate inverts to solid gold.
 */
export default function CtServices() {
  return (
    <section id="services" className="ct-section">
      <div className="ct-section__inner">
        <div className="ct-section__head">
          <span className="ct-eyebrow">خدماتنا</span>
          <h2 className="ct-h2">
            خط خدمات <span className="ct-hl">يغطي كل مناسبة</span>
          </h2>
          <p className="ct-lede">
            من العقود التشغيلية اليومية إلى البوفيهات الفاخرة في المؤتمرات،
            نوفّر تشكيلة خدمات تتناسب مع طبيعة عميلنا وحجم مناسبته.
          </p>
        </div>

        <div className="ct-services">
          {CT_SERVICES.map((s, i) => {
            const Icon = ICONS[s.id] || MenuIcon;
            return (
              <motion.article
                key={s.id}
                className="ct-svc"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <img className="ct-svc__img" src={s.img} alt={s.title} />
                <div className="ct-svc__content">
                  <span className="ct-svc__icon">
                    <Icon />
                  </span>
                  <h3 className="ct-svc__title">{s.title}</h3>
                  <p className="ct-svc__desc">{s.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
