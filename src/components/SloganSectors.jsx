import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * SloganSectors — scroll-snap section right after Vision2030.
 *
 * Behavior:
 *   - The section "locks" the viewport (scroll-snap + sticky inner)
 *   - While locked, each wheel tick advances the active sector
 *   - Static header (eyebrow / h2 / body) stays fixed
 *   - Sector details sub-section animates between 5 sectors
 *   - Vertical nav dots on the far left track the active sector
 */

/* ── Sector data specific to this section ──────────────────────────────────── */
const SLOGAN_SECTORS = [
  {
    id: 'ads',
    name: 'الدعاية والإعلان',
    fullName: 'الهمزة المتطورة للدعاية والإعلان',
    sloganWord: 'الإعـلانـــات',
    color: '#FEFC4F',
    iconBgColor: '#43462C',
    colorRgb: '254,252,79',
    icon: '/images/hero_section_svgs/Advertising SVG.svg',
    image: '/images/slogan sectors/advertising.jpg',
    description: 'يقوم هذا القطاع على تقديم حلول دعائية متكاملة تشمل التصميم والإنتاج الإعلاني والطباعة واللافتات، بما يعزّز الحضور البصري للعلامات التجارية في السوق السعودي.',
    services: [
      'تصميم هوية بصرية متكاملة',
      'إنتاج مواد دعائية وإعلانية',
      'طباعة عالية الجودة ولافتات',
      'حملات تسويقية بصرية مبتكرة',
      'استشارات في استراتيجيات الإعلان',
    ],
  },
  {
    id: 'events',
    name: 'إدارة وإقامة الفعاليات',
    fullName: 'الهمزة المتطورة لإدارة وإقامة الفعاليات',
    sloganWord: 'الفـعـاليـــات',
    color: '#EE4266',
    iconBgColor: '#401D30',
    colorRgb: '238,66,102',
    icon: '/images/hero_section_svgs/Event Administration SVG.svg',
    image: '/images/slogan sectors/events.jpg',
    description: 'يقوم هذا القطاع على تنظيم وإدارة الفعاليات والمؤتمرات والمناسبات الرسمية بإدارة لوجستية احترافية متكاملة تضمن نجاح كل حدث بأعلى المعايير.',
    services: [
      'تخطيط وتنظيم الفعاليات الكبرى',
      'إدارة لوجستية شاملة للمؤتمرات',
      'تنسيق البروتوكول والاستقبال الرسمي',
      'خدمات الإنتاج المسرحي والصوتي',
      'تجهيز المعارض والمساحات التفاعلية',
    ],
  },
  {
    id: 'travel',
    name: 'السفر والسياحة',
    fullName: 'الهمزة المتطورة للسفر والسياحة',
    sloganWord: 'الاكتشـــاف',
    color: '#2ADBD6',
    iconBgColor: '#10404A',
    colorRgb: '42,219,214',
    icon: '/images/hero_section_svgs/Travel & Tourism SVG.svg',
    image: '/images/slogan sectors/tourism.jpg',
    description: 'يقوم هذا القطاع على تصميم برامج سفر مخصّصة وباقات سياحية فاخرة للأفراد والمؤسسات، مع خدمات حجوزات وتأشيرات بمعايير استثنائية.',
    services: [
      'حجوزات طيران وفنادق عالمية',
      'باقات سياحية مخصّصة للمجموعات',
      'خدمات تأشيرات ومعاملات السفر',
      'رحلات مؤسسية وبرامج حوافز',
      'تنسيق الرحلات الداخلية والخارجية',
    ],
  },
  {
    id: 'electric',
    name: 'الكهرباء',
    fullName: 'الهمزة المتطورة للكهرباء',
    sloganWord: 'الطــــاقـــة',
    color: '#008CFF',
    iconBgColor: '#0A2D52',
    colorRgb: '0,140,255',
    icon: '/images/hero_section_svgs/Electricity SVG.svg',
    image: '/images/slogan sectors/electricity.jpg',
    description: 'يقوم هذا القطاع على تنفيذ وصيانة المشاريع الكهربائية بأعلى معايير السلامة والكفاءة، للقطاعين التجاري والحكومي بالمملكة العربية السعودية.',
    services: [
      'تركيبات كهربائية صناعية وتجارية',
      'صيانة دورية وطوارئ كهربائية',
      'مشاريع البنية التحتية الكهربائية',
      'استشارات فنية وتصميم أنظمة',
      'حلول الطاقة الذكية والمستدامة',
    ],
  },
  {
    id: 'catering',
    name: 'التموين والإعاشة',
    fullName: 'الهمزة المتطورة للتموين والإعاشة',
    sloganWord: 'الضيـــافـــة',
    color: '#D79F56',
    iconBgColor: '#3A250F',
    colorRgb: '215,159,86',
    icon: '/images/hero_section_svgs/Cattering SVG.svg',
    image: '/images/slogan sectors/cattering.jpg',
    description: 'يقوم هذا القطاع على تقديم خدمات إطعام مؤسسي وتموين فعاليات بمعايير صحية مرتفعة، مع قوائم طعام متنوعة تلبّي مختلف الأذواق والمناسبات.',
    services: [
      'تموين مؤسسي يومي للشركات',
      'بوفيهات فاخرة للفعاليات والمناسبات',
      'وجبات يومية بجودة غذائية عالية',
      'تخطيط قوائم طعام مخصّصة',
      'خدمات الضيافة والتقديم الاحترافي',
    ],
  },
];

const TOTAL_SECTORS = SLOGAN_SECTORS.length;

/* ── Transition config for Motion ── */
const sectorTransition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
};

const staggerChild = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
};

export default function SloganSectors() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = SLOGAN_SECTORS[activeIndex];

  /* ── Scroll-based sector switching ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current/4) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScroll = (rect.height - window.innerHeight) / 4;
      const scrolled = -rect.top/4;

      if (scrolled >= 0 && scrolled <= totalScroll) {
        // Calculate progress (0 to 1)
        const progress = scrolled / totalScroll;
        // Map to index (0 to 4)
        const index = Math.min(
          TOTAL_SECTORS - 1,
          Math.max(0, Math.floor(progress * TOTAL_SECTORS))
        );
        setActiveIndex(index);
      } else if (scrolled < 0) {
        setActiveIndex(0);
      } else if (scrolled > totalScroll) {
        setActiveIndex(TOTAL_SECTORS - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKey = (e) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const isStickyActive = rect.top <= 0 && rect.bottom > window.innerHeight;
      if (!isStickyActive) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSector(Math.min(activeIndex + 1, TOTAL_SECTORS - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSector(Math.max(activeIndex - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  const scrollToSector = (index) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalScroll = rect.height - window.innerHeight;
    const targetScrollY = window.scrollY + rect.top + (index / TOTAL_SECTORS) * totalScroll + 10;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="slogan-sectors"
      id="slogan-sectors"
      dir="rtl"
    >
      {/* The tall spacer that enables scroll-snap sticking */}
      <div className="slogan-sectors__scroll-spacer">
        <div ref={stickyRef} className="slogan-sectors__sticky">
          <div className="slogan-sectors__inner">
            {/* ── Static header ── */}
            <div className="slogan-sectors__header">
              <p className="slogan-sectors__eyebrow">ارقى الخدمات، بيت واحد.</p>
              <h2 className="slogan-sectors__heading">
                <span className="slogan-sectors__heading-line1">عالم من</span>
                <span className="slogan-sectors__heading-accent">
                  {' '}الخيارات
                </span>
              </h2>
              <p className="slogan-sectors__subheading">ليس مجرد شعار</p>
              <p className="slogan-sectors__body">
                نقدم على مدار السنوات خدمات مميزة على مختلف القطاعات، للشركات الكبرى والناشئة، بالإضافة
                لخدمات القطاع الحكومي بالمملكة العربية السعودية.
              </p>
            </div>

            {/* ── Sector details sub-section ── */}
            <div className="slogan-sectors__details">
              {/* Vertical nav dots (far left) */}
              <div className="slogan-sectors__nav">
                {SLOGAN_SECTORS.map((sector, i) => (
                  <button
                    key={sector.id}
                    className={`slogan-sectors__nav-dot ${i === activeIndex ? 'is-active' : ''
                      }`}
                    style={{
                      '--dot-color': sector.color,
                    }}
                    onClick={() => scrollToSector(i)}
                    aria-label={`اذهب إلى ${sector.name}`}
                  />
                ))}
              </div>

              {/* Image side (left in visual / right in RTL flow) */}
              <div className="slogan-sectors__image-side">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`img-${active.id}`}
                    className="slogan-sectors__image-container"
                    initial={{ opacity: 0, scale: 1.04, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.97, filter: 'blur(20px)' }}
                    transition={sectorTransition}
                  >
                    {/* Sector image */}
                    <img
                      src={active.image}
                      alt={active.name}
                      className="slogan-sectors__image"
                    />

                    {/* Gradient overlay */}
                    <div
                      className="slogan-sectors__image-gradient"
                      style={{
                        background: `linear-gradient(to top, ${active.color} 0%, transparent 75%)`,
                        opacity: 0.5,
                        // mixBlendMode: "screen",
                      }}
                    />

                    {/* Legend pill on top-right of image */}
                    <div className="slogan-sectors__image-legend">
                      <span
                        className="slogan-sectors__legend-dot"
                        style={{ background: active.color }}
                      />
                      <span className="slogan-sectors__legend-text">
                        {active.fullName}
                      </span>
                    </div>

                    {/* Large partially-visible icon (cropped by container) */}
                    <div className="slogan-sectors__image-icon-wrap">
                      <motion.img
                        key={`bg-icon-${active.id}`}
                        src={active.icon}
                        alt=""
                        className="slogan-sectors__image-icon"
                        initial={{ opacity: 0, x: -20, y: 20, scale: 0.85, filter: 'blur(20px)' }}
                        animate={{ opacity: 0.9, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 20, y: 20, scale: 0.85, filter: 'blur(20px)' }}
                        transition={{ ...sectorTransition, duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info side (right in visual / left in RTL flow) */}
              <div className="slogan-sectors__info-side">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${active.id}`}
                    className="slogan-sectors__info-content"
                    initial={{ opacity: 0, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(20px)' }}
                    transition={sectorTransition}
                  >
                    {/* Sector icon + name */}
                    <motion.div
                      className="slogan-sectors__sector-badge"
                      initial={{ opacity: 0, y: -10, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ ...staggerChild, delay: 0.05, filter: 'blur(20px)' }}
                    >
                      <div style={{
                          backgroundColor: active.iconBgColor,
                          borderRadius: "25%",
                          height: "44px",
                          width: "44px",
                          padding: "auto",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",  
                        }}>

                      <img
                        src={active.icon}
                        alt=""
                        className="slogan-sectors__sector-icon"
                        style={{
                          height: "44px",
                          width: "44px",
                        }}
                        />
                        </div>
                      <span
                        className="slogan-sectors__sector-name"
                        style={{ color: active.color }}
                      >
                        {active.fullName}
                      </span>
                    </motion.div>

                    {/* "عالم من" + dynamic word */}
                    <motion.div
                      className="slogan-sectors__slogan"
                      initial={{ opacity: 0, y: 16, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ ...staggerChild, delay: 0.1, filter: 'blur(20px)' }}
                    >
                      <span className="slogan-sectors__slogan-prefix">
                        عـــالم من
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`word-${active.id}`}
                          className="slogan-sectors__slogan-word"
                          style={{
                            color: active.color,
                            fontFamily: "'VIP Hakm', 'Tajawal', 'Cairo', sans-serif",
                            fontWeight: "bold"
                          }}
                          initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -20, filter: 'blur(12px)' }}
                          transition={sectorTransition}
                        >
                          {active.sloganWord}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      className="slogan-sectors__description"
                      initial={{ opacity: 0, y: 12, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ ...staggerChild, delay: 0.15, filter: 'blur(20px)' }}
                    >
                      {active.description}
                    </motion.p>

                    {/* Services list */}
                    <motion.ul
                      className="slogan-sectors__services"
                      initial={{ opacity: 0, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ ...staggerChild, delay: 0.2, filter: 'blur(20px)' }}
                    >
                      {active.services.map((service, i) => (
                        <motion.li
                          key={`${active.id}-svc-${i}`}
                          className="slogan-sectors__service-item"
                          initial={{ opacity: 0, y: 20, x: -10, filter: 'blur(20px)' }}
                          animate={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
                          transition={{
                            ...staggerChild,
                            delay: 0.22 + i * 0.09,
                          }}
                        >
                          <svg
                            className="slogan-sectors__check"
                            viewBox="0 0 20 20"
                            fill="none"
                            style={{ color: active.color }}
                          >
                            <path
                              d="M16.667 5L7.5 14.167 3.333 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{service}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
