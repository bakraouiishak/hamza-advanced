import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { HamzaWordmark } from '../components/BrandMarks.jsx';
import { SECTORS } from '../data/sectors.js';
import '../styles/hamza-vision2030.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   HAMZA × VISION 2030 — Full collaboration page
   Describes Hamza Advanced's commitment, mission, vision, values,
   and how its 5 sectors contribute to Saudi Vision 2030's three pillars.
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ── Data ── */
const SECTOR_ICON_PATHS = {
  ads: '/images/hero_section_svgs/Advertising SVG.svg',
  catering: '/images/hero_section_svgs/Cattering SVG.svg',
  electric: '/images/hero_section_svgs/Electricity SVG.svg',
  events: '/images/hero_section_svgs/Event Administration SVG.svg',
  travel: '/images/hero_section_svgs/Travel & Tourism SVG.svg',
};

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none"><path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M24 24v20M6 14l18 10 18-10" stroke="currentColor" strokeWidth="1.5" opacity=".4"/></svg>
    ),
    title: 'النزاهة',
    en: 'Integrity',
    desc: 'نعمل بشفافية ومسؤولية في كل خطوة، لنبني ثقة طويلة الأمد مع عملائنا وشركائنا.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'الجودة',
    en: 'Quality',
    desc: 'نلتزم بأعلى معايير الجودة في كل خدمة نقدمها، لنضمن التميز في كل التفاصيل.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none"><path d="M24 6c-9.941 0-18 8.059-18 18s8.059 18 18 18" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M24 6c9.941 0 18 8.059 18 18s-8.059 18-18 18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity=".4"/><path d="M20 18l8 6-8 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'الابتكار',
    en: 'Innovation',
    desc: 'نتبنى أحدث التقنيات والأفكار الإبداعية لتقديم حلول مبتكرة تواكب تطلعات الرؤية.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none"><path d="M8 24h32M24 8v32" stroke="currentColor" strokeWidth="1.5" opacity=".25"/><circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="40" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="24" cy="40" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
    ),
    title: 'التكامل',
    en: 'Integration',
    desc: 'خمسة قطاعات تعمل بتناغم تحت مظلة واحدة، لنقدم تجربة خدمية شاملة ومتكاملة.',
  },
];

/* Build sector contribution data from the real sectors registry */
const PILLAR_MAP = {
  ads: 'اقتصاد مزدهر',
  events: 'مجتمع حيوي',
  travel: 'مجتمع حيوي',
  electric: 'وطن طموح',
  catering: 'مجتمع حيوي',
};

const CONTRIBUTION_MAP = {
  ads: 'تعزيز الهوية الوطنية وتسويق المشاريع الكبرى من خلال حملات إعلانية إبداعية تدعم التنويع الاقتصادي.',
  events: 'تنظيم فعاليات ثقافية وترفيهية عالمية المستوى تعزز جودة الحياة وتحقق مستهدفات جذب الزوار.',
  travel: 'دعم قطاع السياحة بتقديم تجارب سفر متميزة تساهم في تحقيق هدف 100 مليون زيارة سياحية.',
  electric: 'توفير حلول كهربائية متقدمة تدعم البنية التحتية وتسهم في مشاريع الطاقة المتجددة والمدن الذكية.',
  catering: 'تقديم خدمات تموين احترافية للمشاريع والفعاليات الكبرى، لتعزيز منظومة الضيافة السعودية.',
};

const SECTORS_CONTRIB = SECTORS.filter(s => s.id !== 'main').map(s => ({
  id: s.id,
  name: s.name,
  tagline: s.tagline,
  color: s.color,
  colorSoft: s.colorSoft,
  services: s.services,
  pillar: PILLAR_MAP[s.id],
  contribution: CONTRIBUTION_MAP[s.id],
}));

const MILESTONES = [
  { year: '2014', text: 'تأسيس مؤسسة الهمزة المتطورة في مدينة الرياض' },
  { year: '2016', text: 'إطلاق قطاع الدعاية والإعلان كأول ذراع تشغيلي' },
  { year: '2019', text: 'التوسع إلى ثلاث قطاعات: الفعاليات والكهرباء' },
  { year: '2022', text: 'الوصول إلى +200 شريك حكومي وخاص' },
  { year: '2024', text: 'إطلاق قطاعي السفر والتموين واستكمال المنظومة الخماسية' },
  { year: '2030', text: 'المساهمة الفعّالة في تحقيق مستهدفات رؤية المملكة 2030' },
];

/* ── Animated Counter ── */
function AnimCounter({ target, suffix = '', isInView }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!isInView || done.current) return;
    done.current = true;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 2000, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);
  return <>{count}{suffix}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function HamzaVision2030() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.95]);

  /* Scroll to top on mount */
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="hv30" dir="rtl">

      {/* ── Back nav ── */}
      <Link to="/" className="hv30__back" aria-label="العودة للرئيسية">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        العودة للرئيسية
      </Link>

      {/* ═══════════════════════════════════════════════════════════════════════
         1. HERO — Full viewport, parallax Riyadh skyline
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__hero" ref={heroRef}>
        <motion.div className="hv30__hero-bg" style={{ y: bgY }}>
          <img src="/images/vision2030/background.jpg" alt="" />
        </motion.div>
        <motion.div className="hv30__hero-overlay" style={{ opacity: overlayOpacity }} />

        {/* Floating particles */}
        <div className="hv30__particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="hv30__particle" style={{
              '--x': `${10 + Math.random() * 80}%`,
              '--y': `${10 + Math.random() * 80}%`,
              '--size': `${3 + Math.random() * 5}px`,
              '--delay': `${Math.random() * 6}s`,
              '--dur': `${7 + Math.random() * 8}s`,
            }} />
          ))}
        </div>

        <div className="hv30__hero-content">
          {/* Logos lockup */}
          <motion.div
            className="hv30__logos"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/logos svg/hamza advanced svg.svg"
              alt="Hamza Advanced"
              className="hv30__logo hv30__logo--hamza"
            />
            <span className="hv30__logo-x">×</span>
            <img
              src="/images/vision2030/Vision2030 Logo.svg"
              alt="Vision 2030"
              className="hv30__logo hv30__logo--v30"
              style={{ filter: 'brightness(1.5)' }}
            />
          </motion.div>

          <motion.h1
            className="hv30__hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="hv30__hero-title-sub">التزاماتنا مع برنامج</span>
            <span className="hv30__hero-title-main">
              رؤية <span className="hv30__gradient-2030">2030</span>
            </span>
          </motion.h1>

          <motion.p
            className="hv30__hero-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            مؤسسة الهمزة المتطورة تؤمن بأن رؤية المملكة العربية السعودية 2030 ليست مجرد
            خطة وطنية — بل هي دعوة لكل مؤسسة سعودية لتقديم أفضل ما لديها. نحن ملتزمون
            بتحقيق ركائز الرؤية الثلاث من خلال قطاعاتنا الخمسة المتكاملة.
          </motion.p>

          <motion.div
            className="hv30__hero-scroll"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
              <rect x="1" y="1" width="22" height="34" rx="11" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <motion.circle cx="12" cy="10" r="3" fill="var(--emerald)" animate={{ cy: [8, 22, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         2. MISSION & VISION — Split glass cards
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__mv-section">
        <div className="hv30__container">
          <motion.div
            className="hv30__section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
          >
            <span className="hv30__badge">من نحن</span>
            <h2 className="hv30__section-title">رسالتنا ورؤيتنا</h2>
          </motion.div>

          <div className="hv30__mv-grid">
            {/* Mission */}
            <motion.div
              className="hv30__mv-card hv30__mv-card--mission"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hv30__mv-icon">
                <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".5"/><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>
              </div>
              <span className="hv30__mv-label">الرسالة</span>
              <h3 className="hv30__mv-title">تقديم خدمات متكاملة بمعايير عالمية</h3>
              <p className="hv30__mv-body">
                نسعى لأن نكون الشريك الأمثل للقطاعين العام والخاص، من خلال تقديم
                خدمات شاملة ومتكاملة تجمع بين الاحترافية والابتكار، وتساهم في
                تحقيق التنمية المستدامة وتعزيز مكانة المملكة عالمياً.
              </p>
              <div className="hv30__mv-accent" />
            </motion.div>

            {/* Vision */}
            <motion.div
              className="hv30__mv-card hv30__mv-card--vision"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="hv30__mv-icon">
                <svg viewBox="0 0 48 48" fill="none"><path d="M6 24C6 24 14 10 24 10s18 14 18 14-8 14-18 14S6 24 6 24z" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="2" fill="currentColor"/></svg>
              </div>
              <span className="hv30__mv-label">الرؤية</span>
              <h3 className="hv30__mv-title">بيت الخدمات الأول في المملكة</h3>
              <p className="hv30__mv-body">
                أن نكون المؤسسة الرائدة في تقديم الخدمات المتكاملة بالمملكة العربية
                السعودية، ونموذجاً يُحتذى في المساهمة ببرنامج رؤية 2030 من خلال
                الابتكار والجودة والالتزام بأعلى المعايير العالمية.
              </p>
              <div className="hv30__mv-accent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         3. VALUES — 4 glassmorphic value cards
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__values-section">
        <div className="hv30__container">
          <motion.div
            className="hv30__section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="hv30__badge">مبادئنا الأساسية</span>
            <h2 className="hv30__section-title">قيمنا التي نلتزم بها</h2>
          </motion.div>

          <div className="hv30__values-grid">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="hv30__value-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="hv30__value-icon">{v.icon}</div>
                <h3 className="hv30__value-title">{v.title}</h3>
                <span className="hv30__value-en">{v.en}</span>
                <p className="hv30__value-desc">{v.desc}</p>
                <div className="hv30__value-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         4. KEY STATS — Animated counters
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__stats-section" ref={statsRef}>
        <div className="hv30__container">
          <div className="hv30__stats-grid">
            {[
              { n: 11, s: '+', label: 'سنوات من الخبرة', sub: 'Years of Experience' },
              { n: 5, s: '', label: 'قطاعات متكاملة', sub: 'Integrated Sectors' },
              { n: 250, s: '+', label: 'شريك وعميل', sub: 'Partners & Clients' },
              { n: 3, s: '', label: 'ركائز نخدمها', sub: "Vision 2030 Pillars" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="hv30__stat"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <span className="hv30__stat-number">
                  <AnimCounter target={s.n} suffix={s.s} isInView={statsInView} />
                </span>
                <span className="hv30__stat-label">{s.label}</span>
                <span className="hv30__stat-sub">{s.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         5. SECTORS CONTRIBUTION — Horizontal scroll carousel
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__sectors-section">
        <div className="hv30__container">
          <motion.div
            className="hv30__section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="hv30__badge">قطاعاتنا الخمسة</span>
            <h2 className="hv30__section-title">مساهمات قطاعاتنا في تحقيق الرؤية</h2>
            <p className="hv30__section-subtitle">
              كل قطاع من قطاعاتنا يساهم بشكل مباشر في تحقيق ركيزة من ركائز رؤية 2030
            </p>
          </motion.div>
        </div>

        {/* Horizontal scroll wrapper with blur edges */}
        <div className="hv30__sectors-scroll-wrap">
          <div className="hv30__sectors-blur hv30__sectors-blur--right" />
          <div className="hv30__sectors-blur hv30__sectors-blur--left" />

          <motion.div
            className="hv30__sectors-track"
            drag="x"
            dragConstraints={{ left: 0, right: 800 }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
          >
            {SECTORS_CONTRIB.map((s, i) => {
              const iconPath = SECTOR_ICON_PATHS[s.id];
              return (
                <motion.div
                  key={s.id}
                  className="hv30__sector-card"
                  style={{ '--sector-color': s.color, '--sector-color-soft': s.colorSoft }}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {/* Top row: icon + pillar badge */}
                  <div className="hv30__sector-top">
                    <div className="hv30__sector-icon-wrap" style={{ background: `${s.color}18`, color: s.color }}>
                      {iconPath && <img src={iconPath} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />}
                    </div>
                    <span className="hv30__sector-pillar" style={{ '--pill-color': s.color }}>{s.pillar}</span>
                  </div>

                  {/* Sector name + tagline */}
                  <h3 className="hv30__sector-name">{s.name}</h3>
                  <span className="hv30__sector-tagline">{s.tagline}</span>

                  {/* Contribution text */}
                  <p className="hv30__sector-contribution">{s.contribution}</p>

                  {/* Services chips */}
                  <div className="hv30__sector-services">
                    {s.services.map(sv => (
                      <span key={sv} className="hv30__sector-chip" style={{ '--chip-color': s.color }}>{sv}</span>
                    ))}
                  </div>

                  {/* Bottom accent bar */}
                  <div className="hv30__sector-bar" />

                  {/* Background glow */}
                  <div className="hv30__sector-bg-glow" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         6. TIMELINE — Milestones
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__timeline-section">
        <div className="hv30__container">
          <motion.div
            className="hv30__section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="hv30__badge">محطات الإنجاز</span>
            <h2 className="hv30__section-title">رحلتنا نحو 2030</h2>
          </motion.div>

          <div className="hv30__timeline">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                className={`hv30__tl-item ${m.year === '2030' ? 'hv30__tl-item--future' : ''}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="hv30__tl-dot" />
                <div className="hv30__tl-content">
                  <span className="hv30__tl-year">{m.year}</span>
                  <p className="hv30__tl-text">{m.text}</p>
                </div>
              </motion.div>
            ))}
            <div className="hv30__tl-line" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         7. CTA — Final call to action
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hv30__cta-section">
        <div className="hv30__container">
          <motion.div
            className="hv30__cta-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="/images/vision2030/Vision2030 Graphic.svg"
              alt=""
              className="hv30__cta-graphic"
            />
            <h2 className="hv30__cta-title">شاركنا رحلة التحول</h2>
            <p className="hv30__cta-body">
              سواء كنت جهة حكومية أو شركة خاصة، نحن هنا لنكون شريكك الاستراتيجي
              في تحقيق مستهدفات الرؤية.
            </p>
            <div className="hv30__cta-buttons">
              <Link to="/contact" className="hv30__cta-btn hv30__cta-btn--primary">
                تواصل معنا
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/" className="hv30__cta-btn hv30__cta-btn--ghost">
                العودة للرئيسية
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <a
                href="https://www.vision2030.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="hv30__cta-btn hv30__cta-btn--ghost"
              >
                زيارة موقع رؤية 2030
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
