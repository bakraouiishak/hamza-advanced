import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { AD_SERVICES } from '../../data/advertising.js';
import { AD_ICONS } from './AdIcons.jsx';

/**
 * Services Carousel — Stacked card carousel inspired by Testimonials appearance
 * (stacked cards with blur on left/right) and PartnersCarousel animation
 * (continuous motion with drag & pause on hover using useAnimationFrame).
 *
 * Cards are 650px tall, content centered, hover reveals a background service
 * image with a dark overlay to keep text readable.
 */

/* ── Map service IDs → image paths from /public/advertising/services images ── */
const SERVICE_IMAGES = {
  'events':          '/advertising/services images/ادارة واقامة الفعاليات.jpg',
  'print':           '/advertising/services images/المطبوعات الورقية.jpg',
  'packaging':       '/advertising/services images/علب المنتجات والتغليف.jpg',
  'bags':            '/advertising/services images/الأكياس الورقية والبلاستيكية.png',
  'signage':         '/advertising/services images/الحروف البارزة.png',
  'gifts':           '/advertising/services images/الهدايا الدعائية والدروع.png',
  'acrylic':         '/advertising/services images/الأكريليك والفوركس والخشب.png',
  'stickers':        '/advertising/services images/الاستكرات والبنرات واللوحات.png',
  'uv-print':        '/advertising/services images/الطباعة المباشرة UV.png',
  'visual-identity': '/advertising/services images/التصاميم والهويات البصرية.png',
  'stands':          '/advertising/services images/الاستاندات والأعلام.png',
  'uniform':         '/advertising/services images/الزي الموحد.png',
};

/* Source data already carries the canonical brand-approved titles — no
   per-card overrides needed anymore. Kept the variable name so the rest
   of the component reads unchanged. */
const CAROUSEL_SERVICES = AD_SERVICES;

export default function AdServices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const dragStartX = useRef(0);
  const containerRef = useRef(null);
  const autoProgressRef = useRef(0);
  const speedRef = useRef(1);

  const total = CAROUSEL_SERVICES.length;

  // ── PartnersCarousel-style continuous auto-advance ──
  // We accumulate fractional "progress" and snap to the next card when it
  // crosses 1.0 — giving the same gentle ease-in / ease-out feel.
  const AUTO_INTERVAL = 3200; // ms per card advance

  useAnimationFrame((time, delta) => {
    if (isDragging) return;

    const targetSpeed = isHovered ? 0 : 1;
    // Smooth transition with PartnersCarousel's bezier feel (delta * 0.003)
    speedRef.current += (targetSpeed - speedRef.current) * (delta * 0.003);

    autoProgressRef.current += speedRef.current * (delta / AUTO_INTERVAL);

    if (autoProgressRef.current >= 1) {
      autoProgressRef.current -= 1;
      setActiveIndex((prev) => (prev + 1) % total);
    }
  });

  // ── Drag handling (Testimonials-style pointer drag to navigate) ──
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragOffset(0);
    if (containerRef.current && e.pointerId) {
      containerRef.current.setPointerCapture?.(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diffX = dragStartX.current - currentX;
    setDragOffset(-diffX);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      setActiveIndex((prev) => (prev - 1 + total) % total);
    } else if (dragOffset > 50) {
      setActiveIndex((prev) => (prev + 1) % total);
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, total]);

  // ── Testimonials-style stacked card positioning ──
  const getCardStyle = (index) => {
    let relIndex = (index - activeIndex) % total;
    if (relIndex < 0) relIndex += total;

    const half = Math.floor(total / 2);
    if (relIndex > half) relIndex -= total;

    const isCenter = relIndex === 0;
    const isRight1 = relIndex === -1;
    const isRight2 = relIndex === -2;
    const isLeft1 = relIndex === 1;
    const isLeft2 = relIndex === 2;

    let translateX = 0;
    let scale = 1;
    let zIndex = 5;
    let blur = 0;
    let opacity = 1;

    if (isCenter) {
      translateX = 0; scale = 1; zIndex = 5; blur = 0; opacity = 1;
    } else if (isRight1) {
      translateX = 58; scale = 0.88; zIndex = 4; blur = 2; opacity = 0.75;
    } else if (isRight2) {
      translateX = 100; scale = 0.76; zIndex = 3; blur = 4; opacity = 0.4;
    } else if (isLeft1) {
      translateX = -58; scale = 0.88; zIndex = 4; blur = 2; opacity = 0.75;
    } else if (isLeft2) {
      translateX = -100; scale = 0.76; zIndex = 3; blur = 4; opacity = 0.4;
    } else {
      translateX = relIndex > 0 ? -150 : 150;
      scale = 0.55; zIndex = 1; blur = 8; opacity = 0;
    }

    let currentDragOffset = 0;
    if (Math.abs(relIndex) <= 2) {
      currentDragOffset = dragOffset;
    }

    return {
      transform: `translateX(calc(${translateX}% + ${currentDragOffset}px)) scale(${scale})`,
      zIndex,
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: isCenter ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  return (
    <section id="services" className="ad-section">
      <div className="ad-section__inner">
        <header className="ad-section__head">
          <span className="ad-eyebrow">خدمات همزة وصل للدعاية والإعلان</span>
          <h2 className="ad-h2">
            <span className="ad-hl">12 خدمة،</span> سقف واحد
          </h2>
          <p className="ad-lede">
            من تصميم الهوية البصرية إلى الطباعة الميدانية والحروف البارزة —
            دورة حياة كاملة لمشروعك الإعلاني، يقودها فريق متخصص في معاملنا
            المتخصصة وتحت إشراف نخبة من المهنيين.
          </p>
        </header>

        {/* ── Stacked Card Carousel ── */}
        <div
          className="ad-svc-carousel"
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {CAROUSEL_SERVICES.map((svc, i) => {
            const Icon = AD_ICONS[svc.icon] || AD_ICONS.print;
            const style = getCardStyle(i);
            const isActive = style.zIndex === 5;
            const isCardHovered = hoveredCard === svc.id;
            const imgSrc = SERVICE_IMAGES[svc.id];

            return (
              <article
                key={svc.id}
                className={`ad-svc-card ${isActive ? 'is-active' : ''} ${isCardHovered ? 'is-img-visible' : ''}`}
                style={style}
                onMouseEnter={() => isActive && setHoveredCard(svc.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background service image (revealed on hover) */}
                {imgSrc && (
                  <div className="ad-svc-card__img-wrap">
                    <img
                      src={imgSrc}
                      alt={svc.title}
                      className="ad-svc-card__img"
                      draggable="false"
                      loading="lazy"
                    />
                    <div className="ad-svc-card__img-overlay" />
                  </div>
                )}

                {/* Content — centered, pushed to bottom */}
                <div className="ad-svc-card__content">
                  <div className="ad-svc-card__icon">
                    <Icon width={28} height={28} />
                  </div>
                  <h3 className="ad-svc-card__title">{svc.title}</h3>
                  <p className="ad-svc-card__short">{svc.short}</p>
                  <p className="ad-svc-card__body">{svc.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
