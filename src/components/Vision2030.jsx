import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * Vision 2030 — Dual-card video showcase section.
 *
 * Structure:
 * ┌─────────────────────────────────────────────────┐
 * │  Eyebrow  /  Heading  /  Body text              │
 * │  [Vision2030 Graphic SVG — center-left]         │
 * │  [Cityscape silhouette background]              │
 * │  [Video plays here when "التعريف" is hovered]    │
 * ├────────────────────────┬────────────────────────┤
 * │ Card: التعريف ببرنامج  │ Card: التزاماتنا       │
 * │ (Vision2030 teal/lilac)│ (Hamza green accent)   │
 * └────────────────────────┴────────────────────────┘
 *
 * States:
 * - Static (no hover): Dark background, cityscape silhouette, graphic visible, both cards neutral
 * - Hover card vision: Video plays in background, right card gets lilac tint, left card dims
 * - Hover card commitment: Dark cityscape stays, left card gets green accent, right card dims
 */

const CARDS = [
  {
    id: 'vision',
    icon: '/images/vision2030/Vision2030 Icon.svg',
    title: 'التعريف ببرنامج رؤية2030',
    description: 'تعرّف على البرنامج الوطني الذي يقود تحول المملكة نحو مستقبل أكثر تنوعاً واستدامة واقتصاداً مزدهراً.',
    cta: { label: 'زيارة الموقع', href: 'https://www.vision2030.gov.sa', external: true },
    accent: 'vision', // Uses Vision2030 teal/lilac
    videoSrc: '/videos/vision2030 goals.mp4',
  },
  {
    id: 'commitment',
    icon: '/images/logos svg/hamza advanced svg.svg',
    title: 'التزاماتنا مع برنامج رؤية2030',
    description: 'نعمل على تحقيق مستهدفات الرؤية من خلال قطاعاتنا الخمسة، ونساهم في بناء اقتصاد مستدام.',
    cta: { label: 'اكتشف المزيد', href: '/vision2030' },
    accent: 'hamza', // Uses Hamza Advanced emerald green
  },
];

export default function Vision2030() {
  const videoRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null); // null = static, 'commitment', 'vision'

  /* ── Hover handlers ── */
  const handleCardEnter = useCallback((cardId) => {
    setHoveredCard(cardId);

    // If hovering the vision card, play video from where it left off
    if (cardId === 'vision' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleCardLeave = useCallback(() => {
    // Pause video but do NOT reset position (so it proceeds where stopped)
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setHoveredCard(null);
  }, []);

  /* ── Prevent section-level mouse leave from interfering with card hovers ── */
  const handleSectionLeave = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setHoveredCard(null);
  }, []);

  return (
    <section id="vision" className="vision2030" dir="rtl" onMouseLeave={handleSectionLeave}>
      <div className="vision2030__inner">

        {/* ── Background area (cityscape + video + graphic) ── */}
        <div className="vision2030__backdrop">
          {/* Cityscape silhouette */}
          <div className="vision2030__cityscape" />

          {/* Video layer — visible only when hovering vision card */}
          <video
            ref={videoRef}
            className={`vision2030__video ${hoveredCard === 'vision' ? 'is-visible' : ''}`}
            src="/videos/vision2030 goals.mp4"
            preload="metadata"
            playsInline
            muted
            loop
          />

          {/* Dark overlay on video */}
          <div className={`vision2030__video-overlay ${hoveredCard === 'vision' ? 'is-video-active' : ''}`} />

          {/* Vision2030 Graphic — center left, visible only in static state */}
          <motion.img
            src="/images/vision2030/Vision2030 Graphic.svg"
            alt=""
            className="vision2030__graphic"
            animate={{
              opacity: hoveredCard === null ? 1 : 0,
              scale: hoveredCard === null ? 1 : 0.9,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ── Header text overlay ── */}
          <motion.div
            className="vision2030__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Inner div to handle opacity fade independent of Framer Motion whileInView */}
            <div className={`vision2030__header-content ${hoveredCard !== null ? 'is-faded' : ''}`}>
              <p className="vision2030__eyebrow">نحو رؤية أوضح</p>
              <h2 className="vision2030__heading">
                <span className="vision2030__heading-line1">التزاماتنا مع برنامج</span>
                <span className="vision2030__heading-line2">رؤية2030</span>
              </h2>
              <p className="vision2030__body">
                نقدم على مدار السنوات خدمات مميزة على مختلف القطاعات، للشركات الكبرى والناشئة، بالإضافة
                لخدمات القطاع الحكومي بالمملكة العربية السعودية.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Cards row ── */}
        <motion.div
          className={`vision2030__cards ${
            hoveredCard === 'commitment' ? 'hover-commitment' :
            hoveredCard === 'vision' ? 'hover-vision' : ''
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`vision2030__card vision2030__card--${card.accent} ${hoveredCard === card.id ? 'is-hovered' : ''}`}
              onMouseEnter={() => handleCardEnter(card.id)}
              onMouseLeave={handleCardLeave}
            >
              {/* Top glow line for hovered commitment card */}
              <div className="vision2030__card-glow" />

              {/* Icon */}
              <div className="vision2030__card-icon">
                <img src={card.icon} alt="" />
              </div>

              {/* Title */}
              <h3 className="vision2030__card-title">{card.title}</h3>

              {/* Description */}
              <p className="vision2030__card-desc">{card.description}</p>

              {/* CTA Button */}
              {card.cta.external ? (
                <a
                  href={card.cta.href}
                  className="vision2030__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {card.cta.label}
                </a>
              ) : (
                <Link
                  to={card.cta.href}
                  className="vision2030__cta"
                  onClick={(e) => e.stopPropagation()}
                >
                  {card.cta.label}
                </Link>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
