import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAnimationFrame } from 'motion/react';
import { EL_SERVICES } from '../../data/electricity.js';
import { EL_ICONS } from './ElIcons.jsx';

/**
 * Services Carousel — inline horizontal marquee.
 *
 * Behavior:
 *  • All cards rendered side-by-side on a single track.
 *  • Track auto-translates left→right at a steady speed (one card every 2.5s).
 *  • Track is duplicated and wraps modulo, giving an infinite seamless loop.
 *  • Drag (pointer) offsets the progress; auto-advance resumes on release.
 *  • Cards default state: imageless. On hover: the card scales up, a
 *    background image fades in behind a dark gradient, and the icon+title
 *    cluster slides to the bottom-right (RTL bottom-start).
 */

/* id → file path in /public/electricity/elServices images/  */
const SERVICE_IMAGES = {
  generators:   '/electricity/elServices images/توريد المولّدات الديزل.jpg',
  ups:          '/electricity/elServices images/أنظمة UPS الإلكترونية.webp',
  ats:          '/electricity/elServices images/مفاتيح التحويل الآلية ATS.jpg',
  batteries:    '/electricity/elServices images/توريد البطاريات.jpg',
  maintenance:  '/electricity/elServices images/عقود الصيانة الوقائية والعلاجية.jpg',
  installation: '/electricity/elServices images/التركيب والاختبار والتشغيل.avif',
  panels:       '/electricity/elServices images/لوحات التحكم والتوزيع.jpg',
  consultancy:  '/electricity/elServices images/الاستشارات الهندسية.jpg',
};

/* Speed: one card-width advance per 5s — slower, more meditative.
   We measure the actual card+gap width on mount and use it to compute px/ms. */
const ADVANCE_INTERVAL_MS = 5000;
/* Smoothing factor for drag — higher = snappier, lower = more inertial. */
const DRAG_SMOOTHING = 0.18;
/* How fast the auto-scroll ramps in / out on hover enter & exit.
   Lower = longer ease. Tuned so the ease feels like ~600ms in/out. */
const HOVER_RAMP = 0.045;

export default function ElServices() {
  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  // Live offset (px). The render reads this through state so React paints,
  // but the animation loop mutates the ref to avoid per-frame React work.
  // `targetOffset` is what we ease toward; `offsetRef` is the painted value.
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const [offset, setOffset] = useState(0);

  const [cardStride, setCardStride] = useState(420); // card width + gap (px)
  const [hoveredCard, setHoveredCard] = useState(null);

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Hover-pause state.
  //   isHoveredRef     → instantaneous hover flag (set by pointer enter/leave)
  //   speedMultRef     → painted speed multiplier, eases between 0 ↔ 1
  // The auto-advance multiplies its step by speedMultRef each frame, so hover
  // ease-IN (1 → 0) gradually stops the scroll, and hover ease-OUT (0 → 1)
  // smoothly resumes it on mouse leave.
  const isHoveredRef = useRef(false);
  const speedMultRef = useRef(1);

  // ── Measure card stride once mounted & on resize ──
  useEffect(() => {
    const measure = () => {
      const card = cardRef.current;
      const track = trackRef.current;
      if (!card || !track) return;
      const cardW = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
      setCardStride(cardW + gap);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Auto-advance loop + smooth drag ──
  // - Auto-motion advances the TARGET each frame (does NOT pause on hover).
  // - While dragging, the target is being set directly by pointer move.
  // - The painted offset eases toward the target via simple lerp, giving
  //   drags a smooth deceleration instead of a jarring snap.
  useAnimationFrame((_, delta) => {
    const cycle = cardStride * EL_SERVICES.length;

    // Hover-pause: ease the speed multiplier toward 0 on hover, 1 otherwise.
    // Same frame-rate-independent lerp formula as drag smoothing.
    const targetMult = isHoveredRef.current ? 0 : 1;
    const mt = 1 - Math.pow(1 - HOVER_RAMP, delta / 16.667);
    speedMultRef.current += (targetMult - speedMultRef.current) * mt;

    if (!isDraggingRef.current) {
      const speed = cardStride / ADVANCE_INTERVAL_MS; // px per ms
      targetOffsetRef.current += speed * delta * speedMultRef.current;
    }

    // Keep target in canonical range so painted value follows without
    // long catch-up runs after a wrap.
    if (targetOffsetRef.current >= cycle) {
      targetOffsetRef.current -= cycle;
      offsetRef.current -= cycle;
    } else if (targetOffsetRef.current < 0) {
      targetOffsetRef.current += cycle;
      offsetRef.current += cycle;
    }

    // Frame-rate independent lerp (≈ DRAG_SMOOTHING at 60fps).
    const t = 1 - Math.pow(1 - DRAG_SMOOTHING, delta / 16.667);
    offsetRef.current += (targetOffsetRef.current - offsetRef.current) * t;

    setOffset(offsetRef.current);
  });

  // ── Pointer drag handlers ──
  const onPointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX ?? (e.touches?.[0]?.clientX) ?? 0;
    // Anchor the drag to the target (not the painted offset) so motion
    // doesn't snap to mid-ease when the user grabs.
    dragStartOffsetRef.current = targetOffsetRef.current;
    if (containerRef.current && e.pointerId != null) {
      containerRef.current.setPointerCapture?.(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX) ?? 0;
    const dx = x - dragStartXRef.current;
    // Dragging right (positive dx) should pull cards back (reduce offset),
    // dragging left advances. Inverted to feel "grab and throw".
    let next = dragStartOffsetRef.current - dx;
    const cycle = cardStride * EL_SERVICES.length;
    next = ((next % cycle) + cycle) % cycle;
    // Only update the target — the lerp in useAnimationFrame eases the
    // painted offset toward it, giving the drag a fluid feel.
    targetOffsetRef.current = next;
  }, [cardStride]);

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // ── Duplicate the list for seamless loop ──
  const loop = [...EL_SERVICES, ...EL_SERVICES, ...EL_SERVICES];

  return (
    <section id="services" className="el-section">
      <div className="el-section__inner">
        <header className="el-section__head">
          <span className="el-eyebrow">خدمات قطاع الكهرباء</span>
          <h2 className="el-h2">
            8 خدمات، <span className="el-hl">سقف واحد</span>
          </h2>
          <p className="el-lede">
            من التوريد إلى الصيانة الدورية، نقدّم دورة حياة كاملة لأنظمة الطاقة
            في منشأتك — بفريق هندسي معتمد ومعدّات الوكلاء المعتمدين.
          </p>
        </header>

        <div
          className={`el-svc-carousel ${isDragging ? 'is-dragging' : ''}`}
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
        >
          <div
            className="el-svc-track"
            ref={trackRef}
            // Force LTR so positive translateX always means "to the right"
            // regardless of the RTL ancestor. Card content stays RTL.
            dir="ltr"
            style={{
              transform: `translate3d(${-offset}px, 0, 0)`,
              transition: isDragging ? 'none' : undefined,
            }}
          >
            {loop.map((s, i) => {
              const Icon = EL_ICONS[s.icon] || EL_ICONS.install;
              const img = SERVICE_IMAGES[s.id];
              const key = `${s.id}-${i}`;
              const isCardHovered = hoveredCard === key;
              return (
                <article
                  key={key}
                  ref={i === 0 ? cardRef : null}
                  className={`el-svc-card ${isCardHovered ? 'is-hovered' : ''}`}
                  dir="rtl"
                  onMouseEnter={() => setHoveredCard(key)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {img && (
                    <div className="el-svc-card__img-wrap" aria-hidden="true">
                      <img
                        src={img}
                        alt=""
                        className="el-svc-card__img"
                        draggable="false"
                        loading="lazy"
                      />
                      <div className="el-svc-card__img-overlay" />
                    </div>
                  )}

                  <div className="el-svc-card__content">
                    <div className="el-svc-card__icon">
                      <Icon width={26} height={26} />
                    </div>
                    <h3 className="el-svc-card__title">{s.title}</h3>
                    <p className="el-svc-card__short">{s.short}</p>
                    <p className="el-svc-card__body">{s.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
