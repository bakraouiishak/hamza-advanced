import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TR_SERVICES } from '../../data/travel.js';
import { TR_ICONS } from './TrIcons.jsx';

/**
 * Services — full-bleed horizontal carousel on a slightly wavy dashed path.
 *
 * The auto-scroll, hover-easing, drag, and release-momentum are all driven by
 * a single rAF loop (no CSS keyframes) so we can blend smoothly between
 * states:
 *   - Idle:       velocity eases toward -baseSpeed (R→L scroll).
 *   - Hover:      target velocity eases toward 0 (ease-in / ease-out on
 *                 enter / leave — handled by exponential smoothing).
 *   - Dragging:   tx is driven directly from pointer delta; we also sample
 *                 pointer velocity for the release.
 *   - Released:   the sampled velocity decays exponentially; once it's
 *                 below the autoplay speed, normal autoplay resumes.
 *
 * The dashed sine path is fixed; each card's translateY is sampled from the
 * same sine at its current viewport-center X, so the cards visibly ride the
 * line wherever the strip is.
 */
const AMPLITUDE = 34;   // px — slight curve, matches Figma feel
const PERIOD = 560;     // px — one full wave roughly = 2 cards + gap
const AUTOPLAY_LOOP_SECONDS = 75; // matches the visual cadence already in place
const FALLBACK_SPEED = 60; // px/s, used only until we can measure the strip

export default function TrServices() {
  const stripRef = useRef(null);
  const viewportRef = useRef(null);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // --- rAF-driven motion + drag/momentum + hover-easing ---------------------
  useEffect(() => {
    const strip = stripRef.current;
    const viewport = viewportRef.current;
    if (!strip || !viewport) return;

    // The .tr-carousel__strip in CSS runs its own keyframe animation. We
    // neutralize it via inline style (overrides the CSS rule) so this rAF
    // loop can own `transform` for drag + momentum + eased hover. No CSS
    // file edits, no other components touched.
    const prevAnim = strip.style.animation;
    strip.style.animation = 'none';

    let baseSpeed = FALLBACK_SPEED;
    const recomputeSpeed = () => {
      const half = strip.scrollWidth / 2;
      if (half > 0) baseSpeed = half / AUTOPLAY_LOOP_SECONDS;
    };
    recomputeSpeed();

    let tx = 0;              // current translateX in px
    let vx = -baseSpeed;     // current velocity in px/s
    let lastT = performance.now();
    let hovering = false;
    let dragging = false;
    let pointerId = null;
    let lastPointerX = 0;
    let lastPointerT = 0;
    let dragVel = 0;         // smoothed pointer velocity (px/s)
    let raf = 0;

    const measureHalf = () => strip.scrollWidth / 2 || 0;
    const wrap = (n) => {
      const half = measureHalf();
      if (half <= 0) return n;
      while (n <= -half) n += half;
      while (n > 0) n -= half;
      return n;
    };

    const applyCurve = () => {
      const items = strip.querySelectorAll('.tr-carousel__item');
      for (const el of items) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const y = AMPLITUDE * Math.sin((cx / PERIOD) * Math.PI * 2);
        el.style.setProperty('--tr-curve-y', `${y.toFixed(2)}px`);
      }
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000); // cap at 50ms
      lastT = now;

      if (!dragging) {
        // Target velocity depends on hover state.
        const target = hovering ? 0 : -baseSpeed;
        // Exponential ease — gives the smooth ease-in/ease-out feel on
        // hover-enter & leave AND lets release momentum decay naturally.
        // Higher k = faster snap. 2.2 ≈ ~0.5s settle.
        const k = Math.abs(vx) > baseSpeed * 1.05 ? 1.6 /* coast */ : 3.0 /* settle */;
        vx += (target - vx) * (1 - Math.exp(-k * dt));
        tx += vx * dt;
        tx = wrap(tx);
        strip.style.transform = `translateX(${tx.toFixed(2)}px)`;
      }

      applyCurve();
      raf = requestAnimationFrame(tick);
    };

    // ---- Pointer handlers ---------------------------------------------------
    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastPointerT = performance.now();
      dragVel = 0;
      viewport.setPointerCapture?.(e.pointerId);
      viewport.classList.add('is-dragging');
    };
    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const now = performance.now();
      const dx = e.clientX - lastPointerX;
      const dt = Math.max(1, now - lastPointerT) / 1000;
      // Smooth velocity sample.
      const instant = dx / dt;
      dragVel = dragVel * 0.6 + instant * 0.4;
      lastPointerX = e.clientX;
      lastPointerT = now;
      tx = wrap(tx + dx);
      strip.style.transform = `translateX(${tx.toFixed(2)}px)`;
    };
    const onPointerUp = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      viewport.classList.remove('is-dragging');
      // Hand the sampled pointer velocity to the autoplay loop — it'll
      // exponentially decay back toward the autoplay target.
      vx = Math.max(-1800, Math.min(1800, dragVel));
    };

    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('pointerleave', onPointerUp);
    viewport.addEventListener('mouseenter', onEnter);
    viewport.addEventListener('mouseleave', onLeave);

    raf = requestAnimationFrame((t) => { lastT = t; tick(t); });
    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
      viewport.removeEventListener('pointerleave', onPointerUp);
      viewport.removeEventListener('mouseenter', onEnter);
      viewport.removeEventListener('mouseleave', onLeave);
      // Restore the CSS-driven autoplay we suspended on mount.
      strip.style.animation = prevAnim;
      strip.style.transform = '';
    };
  }, []);

  // --- SVG dashed sine path (analytic, sampled across 2× viewport width) ----
  const pathD = useMemo(() => {
    const w = Math.max(vw, 320) * 2;
    const midY = AMPLITUDE + 4;
    const step = 12;
    const points = [];
    for (let x = -vw; x <= w - vw; x += step) {
      const y = midY + AMPLITUDE * Math.sin((x / PERIOD) * Math.PI * 2);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${points.shift()} L ${points.join(' ')}`;
  }, [vw]);

  const loop = [...TR_SERVICES, ...TR_SERVICES];
  const svgHeight = AMPLITUDE * 2 + 8;

  return (
    <section id="services" className="tr-section tr-services-section">
      <div className="tr-services-section__bg" aria-hidden />
      <div className="tr-services-section__cloud tr-services-section__cloud--a" aria-hidden />
      <div className="tr-services-section__cloud tr-services-section__cloud--b" aria-hidden />

      <div className="tr-section__inner">
        <header className="tr-section__head">
          <span className="tr-eyebrow">خدمات السفر والسياحة</span>
          <h2 className="tr-h2">
            8 خدمات، <span className="tr-hl">مظلّة واحدة</span>
          </h2>
          <p className="tr-lede">
            من استقبال المطار إلى التأشيرات والإقامة والنقل — دورة سفر كاملة
            تحت إدارة فريق متخصّص، بخبرة تشمل الرحلات الفردية والمؤسسية.
          </p>
        </header>
      </div>

      <div className="tr-carousel" dir="ltr">
        <div className="tr-carousel__viewport" ref={viewportRef}>
          <svg
            className="tr-carousel__path"
            width="100%"
            height={svgHeight}
            viewBox={`${-vw} 0 ${vw * 2} ${svgHeight}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={pathD}
              fill="none"
              stroke="rgba(244, 251, 252, 0.55)"
              strokeWidth="1.6"
              strokeDasharray="6 9"
              strokeLinecap="round"
            />
          </svg>

          <div className="tr-carousel__strip" ref={stripRef}>
            {loop.map((s, i) => {
              const Icon = TR_ICONS[s.icon] || TR_ICONS.compass;
              return (
                <article key={`${s.id}-${i}`} className="tr-carousel__item">
                  <div className="tr-svc">
                    <div className="tr-svc__icon">
                      <Icon width={26} height={26} />
                    </div>
                    <h3 className="tr-svc__title" dir="rtl">{s.title}</h3>
                    <p className="tr-svc__short" dir="rtl">{s.short}</p>
                    <p className="tr-svc__body" dir="rtl">{s.body}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="tr-carousel__edge tr-carousel__edge--start" aria-hidden />
          <div className="tr-carousel__edge tr-carousel__edge--end" aria-hidden />
        </div>
      </div>
    </section>
  );
}
