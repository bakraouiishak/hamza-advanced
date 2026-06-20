import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { EV_PARTNERS, EV_ROLES } from '../../data/events.js';

/**
 * Partners ecosystem — refactored as a tiered logo showcase.
 *
 * Layout
 *  1. ev-section__head (قاعدة الشركاء) — preserved exactly.
 *  2. Stats trio — "10 شراكة"، "5 جهات حكومية"، "6+ سنوات تعاون" — anchors the
 *     section in concrete business numbers before the visuals.
 *  3. Featured spotlight — the 2 most prestigious partners (ministries) are
 *     lifted into larger cards with full logo display.
 *  4. Logo wall — the remaining 8 partners in a 4-column responsive grid.
 *     Each card shows the logo + name + category chip.
 *  5. ev-section__head (مصفوفة الأدوار) — preserved.
 *  6. Roles matrix — preserved unchanged.
 */

const STATS = [
  { num: '10', lbl: 'شراكة استراتيجية ممتدة' },
  { num: '+5', lbl: 'جهات حكومية وهيئات رسمية' },
  { num: '+6', lbl: 'سنوات من التعاون التعاقدي' },
];

export default function EvPartners() {
  const featured = useMemo(() => EV_PARTNERS.filter((p) => p.featured), []);
  const standard = useMemo(() => EV_PARTNERS.filter((p) => !p.featured), []);

  return (
    <section id="partners" className="ev-section">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">قاعدة الشركاء الاستراتيجيين</span>
          <h2 className="ev-h2">
            منظومة <span className="ev-hl">B2B</span> راسخة
          </h2>
          <p className="ev-lede">
            علاقات تعاقدية ممتدة مع كيانات وصنّاع قرار بارزين في المملكة —
            وزارات، هيئات حكومية، جامعات وشركات مرموقة.
          </p>
        </header>

        {/* — Stats trio — */}
        <motion.div
          className="ev-prt-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {STATS.map((s) => (
            <motion.div
              key={s.lbl}
              className="ev-prt-stat"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <span className="ev-prt-stat__num">{s.num}</span>
              <span className="ev-prt-stat__lbl">{s.lbl}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* — Featured spotlight (ministries) — */}
        {featured.length > 0 && (
          <motion.div
            className="ev-prt-spotlight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            }}
          >
            <header className="ev-prt-spotlight__head">
              <span className="ev-prt-spotlight__eyebrow">شركاء مميّزون</span>
              <span className="ev-prt-spotlight__rule" aria-hidden="true" />
            </header>

            <div className="ev-prt-spotlight__grid">
              {featured.map((p) => (
                <motion.article
                  key={p.name}
                  className="ev-prt-feat"
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <span className="ev-prt-feat__type">{p.type}</span>
                  <div className="ev-prt-feat__logo">
                    <img src={encodeURI(p.image)} alt={p.name} loading="lazy" />
                  </div>
                  <h3 className="ev-prt-feat__name">{p.name}</h3>
                  <span className="ev-prt-feat__corner" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.4 6.8L21 9.3l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.9l-5-4.6 6.6-.5z" />
                    </svg>
                  </span>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* — Logo wall (remaining partners) — */}
        <header className="ev-prt-wall__head">
          <span className="ev-prt-spotlight__eyebrow">شراكاء وكيانات تعاقدية</span>
          <span className="ev-prt-spotlight__rule" aria-hidden="true" />
        </header>

        <motion.div
          className="ev-prt-wall"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {standard.map((p) => (
            <motion.article
              key={p.name}
              className={`ev-prt-tile ev-prt-tile--${p.category}`}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              title={p.name}
            >
              <div className="ev-prt-tile__logo">
                <img src={encodeURI(p.image)} alt={p.name} loading="lazy" />
              </div>
              <div className="ev-prt-tile__body">
                <span className="ev-prt-tile__chip">{p.type}</span>
                <h4 className="ev-prt-tile__name">{p.name}</h4>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Roles matrix head — preserved */}
        <header className="ev-section__head" style={{ marginTop: 'clamp(3rem, 6vw, 5rem)' }}>
          <span className="ev-eyebrow">مصفوفة الأدوار المتبادلة</span>
          <h2 className="ev-h2">
            شراكة <span className="ev-hl">فعّالة</span>
          </h2>
          <p className="ev-lede">
            لضمان أعلى معايير الجودة والتنفيذ المثالي في الوقت المحدد ووفق
            تطلعات الجهات المستفيدة، نعتمد نموذجاً واضحاً يحدد الأدوار المتوقعة
            منّا ومن الشريك الاستراتيجي.
          </p>
        </header>

        <div className="ev-roles">
          <motion.div
            className="ev-role-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ev-role-col__head">
              <span className="ev-role-col__badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 6.8L21 9.3l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.9l-5-4.6 6.6-.5z" />
                </svg>
              </span>
              <h3 className="ev-role-col__title">{EV_ROLES.hamza.title}</h3>
            </div>
            <ul>
              {EV_ROLES.hamza.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="ev-role-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ev-role-col__head">
              <span className="ev-role-col__badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <h3 className="ev-role-col__title">{EV_ROLES.beneficiary.title}</h3>
            </div>
            <ul>
              {EV_ROLES.beneficiary.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
