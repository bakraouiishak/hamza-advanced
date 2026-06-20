import React from 'react';
import { motion } from 'motion/react';

/**
 * About Us — "لماذا الهمزة المتطورة؟"
 * Three stat cards with icons, descriptions, and large accent-coloured numbers.
 * Cards lift gently on hover with a green icon glow.
 */

const CARDS = [
  {
    title: 'خبرة السنين',
    description:
      'أكثر من عقد من الخبرة في تقديم حلول متكاملة تجمع بين الاحترافية والابتكار، مما أكسبنا ثقة أبرز الجهات في المملكة.',
    stat: '11',
    statLabel: 'سنة',
    statSuffix: '',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'ثقة العملاء',
    description:
      'شراكات استراتيجية مع أكثر من 250 جهة حكومية وخاصة، تعكس مستوى الالتزام والجودة الذي نقدمه في كل مشروع.',
    stat: '250',
    statLabel: 'عميل',
    statSuffix: '+',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'تنوع الخدمات',
    description:
      'خمسة قطاعات متكاملة تحت مظلة واحدة — من الإعلان والفعاليات إلى الكهرباء والسفر والتموين — لتغطية كافة احتياجاتكم.',
    stat: '5',
    statLabel: 'قطاعات',
    statSuffix: '',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

/* Stagger children for scroll-in animation */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AboutUs() {
  return (
    <section id="about" className="about-us" dir="rtl">
      <div className="about-us__inner">
        {/* ── Header ── */}
        <motion.div
          className="about-us__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about-us__eyebrow">لماذا الهمزة المتطورة؟</p>
          <h2 className="about-us__heading">
            <span className="about-us__heading-line1">بيت الخدمات المتكامل</span>
            <span className="about-us__heading-line2">الوحيد في المملكة</span>
          </h2>
          <p className="about-us__body">
            مؤسسة الهمزة المتطورة هي بيت خدمات شامل يضم تحت سقف واحد خمسة قطاعات
            حيوية، تتكامل فيما بينها لتقديم تجربة لا مثيل لها في السوق السعودي.
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          className="about-us__cards"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {CARDS.map((card) => (
            <motion.article
              key={card.title}
              className="about-card"
              variants={cardVariants}
            >
              {/* Icon */}
              <div className="about-card__icon-wrap">
                <div className="about-card__icon">{card.icon}</div>
              </div>

              {/* Title */}
              <h3 className="about-card__title">{card.title}</h3>

              {/* Description */}
              <p className="about-card__desc">{card.description}</p>

              {/* Stat */}
              <div className="about-card__stat-row">
                <span className="about-card__stat">
                  {card.statSuffix}{card.stat}
                </span>
                <span className="about-card__stat-label">{card.statLabel}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
