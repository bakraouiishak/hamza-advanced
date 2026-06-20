import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { AD_CLIENTS } from '../../data/advertising.js';

/**
 * Clients wall — past clients grouped by their classified segment
 * (حكومي / تعليمي / مالي / …). Each segment renders its own labelled card
 * with a count badge, an icon, and the list of clients underneath.
 *
 * The icon set is intentionally minimal — single-stroke line glyphs that
 * read crisply at 28-32px and inherit currentColor.
 */

const SEG_META = {
  'حكومي': {
    eyebrow: 'القطاع الحكومي',
    blurb: 'وزارات وهيئات وأمانات تعتمد علينا في هوياتها وتنفيذها الميداني.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-6h6v6" />
        <path d="M5 10h14" />
      </svg>
    ),
  },
  'تعليمي': {
    eyebrow: 'القطاع التعليمي',
    blurb: 'جامعات ومدارس ومؤسسات تدريب رفيعة المستوى.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
      </svg>
    ),
  },
  'مالي': {
    eyebrow: 'القطاع المالي',
    blurb: 'بنوك ومؤسسات تمويل بمعايير امتثال صارمة.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M4 10h16l-8-7z" />
        <path d="M6 10v9M10 10v9M14 10v9M18 10v9" />
      </svg>
    ),
  },
  'ثقافي': {
    eyebrow: 'القطاع الثقافي',
    blurb: 'ملتقيات وجمعيات تروّج للهوية والإرث الثقافي.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h6v16H4z" />
        <path d="M14 4h6v16h-6z" />
        <path d="M10 8h4M10 12h4M10 16h4" />
      </svg>
    ),
  },
  'غير ربحي': {
    eyebrow: 'القطاع غير الربحي',
    blurb: 'جمعيات ومراكز خيرية ذات أثر مجتمعي مستدام.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  'تجاري': {
    eyebrow: 'القطاع التجاري',
    blurb: 'شركات قابضة، تجزئة، صناعة وخدمات بأحجام مختلفة.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V8l9-5 9 5v13" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  'مطاعم': {
    eyebrow: 'قطاع المطاعم',
    blurb: 'هويات بصرية وتغليف وقوائم لأبرز العلامات الغذائية.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2v8a3 3 0 0 0 6 0V2M10 2v20M17 8l-2 4h4l-2-4zM17 12v10" />
      </svg>
    ),
  },
  'مبادرة': {
    eyebrow: 'المبادرات والمشاريع',
    blurb: 'مشاريع ومبادرات وطنية بأهداف تنموية وبيئية.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21l3-8 6-6 5 5-6 6-8 3z" />
        <path d="M14 8l2 2" />
      </svg>
    ),
  },
};

// Display order for segments (most institutional → most specialised).
const SEG_ORDER = ['حكومي', 'تعليمي', 'مالي', 'ثقافي', 'غير ربحي', 'تجاري', 'مطاعم', 'مبادرة'];

export default function AdClients() {
  // Bucket clients by segment, preserving the brand-approved display order.
  const grouped = useMemo(() => {
    const byseg = {};
    AD_CLIENTS.forEach((c) => {
      (byseg[c.segment] ||= []).push(c);
    });
    return SEG_ORDER
      .filter((seg) => byseg[seg]?.length)
      .map((seg) => ({ seg, clients: byseg[seg] }));
  }, []);

  const total = AD_CLIENTS.length;

  return (
    <section id="clients" className="ad-section">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">خبراتنا السابقة</span>
          <h2 className="ad-h2">
            <span className="ad-hl">قاعدة عملاء</span> مرموقة
          </h2>
          <p className="ad-lede">
            خبرات متعددة وتجارب ثرية مع جهات حكومية، تعليمية، خيرية، وتجارية —
            كل واحدة منها مشروع كامل من تصميم الهوية حتى التسليم الميداني.
          </p>

          <div className="ad-clients__summary">
            <span className="ad-clients__summary-num">{total}+</span>
            <span className="ad-clients__summary-lbl">
              عميل عبر <strong>{grouped.length}</strong> قطاعات مختلفة
            </span>
          </div>
        </header>

        <motion.div
          className="ad-clients-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {grouped.map(({ seg, clients }) => {
            const meta = SEG_META[seg] || {};
            return (
              <motion.article
                key={seg}
                className="ad-clients-cat"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <header className="ad-clients-cat__head">
                  <span className="ad-clients-cat__icon" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <div className="ad-clients-cat__head-body">
                    <span className="ad-clients-cat__eyebrow">{meta.eyebrow || seg}</span>
                    <h3 className="ad-clients-cat__title">{seg}</h3>
                    {meta.blurb && <p className="ad-clients-cat__blurb">{meta.blurb}</p>}
                  </div>
                  <span className="ad-clients-cat__count" aria-label={`${clients.length} عميل`}>
                    {String(clients.length).padStart(2, '0')}
                  </span>
                </header>

                <ul className="ad-clients-cat__list" role="list">
                  {clients.map((c) => (
                    <li key={c.name} className="ad-client-chip">
                      <span className="ad-client-chip__dot" aria-hidden="true" />
                      <span className="ad-client-chip__name">{c.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
