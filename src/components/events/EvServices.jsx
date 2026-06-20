import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EV_SERVICES } from '../../data/events.js';
import { EV_ICONS } from './EvIcons.jsx';

/**
 * Detailed services — single wide stage (1200×546) that swaps between the 6
 * services on the brief. A row of 6 icon-only pills sits at the top of the
 * stage; the active one drives the title / short / body underneath.
 *
 * Behaviour
 *  • Auto-cycles every 4.5 seconds by default.
 *  • Hovering the stage (or any pill) pauses the cycle and locks the visible
 *    service to the user's pick. Cycle resumes once the cursor leaves.
 *  • Click on a pill behaves the same as hover — useful for touch devices,
 *    where hover doesn't exist.
 */
const AUTOPLAY_MS = 4500;

export default function EvServices() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-cycle through services unless the user is interacting with the stage.
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % EV_SERVICES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const activeService = EV_SERVICES[active];

  return (
    <section id="services" className="ev-section">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">خدمات قطاع الفعاليات</span>
          <h2 className="ev-h2">
            خدمات تفصيلية، <span className="ev-hl">سقف واحد</span>
          </h2>
          <p className="ev-lede">
            خدمات لوجستية متكاملة تدمج بين الجانب التكتيكي الميداني والخدمات
            المساعدة — من تجهيز المعارض إلى تصنيع المواد الدعائية في معاملنا
            المتخصصة.
          </p>
        </header>

        <motion.div
          className="ev-svc-stage"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Service-specific background image — crossfades on switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${activeService.id}`}
              className="ev-svc-stage__bg"
              style={{ backgroundImage: `url("${encodeURI(activeService.image)}")` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
          </AnimatePresence>
          {/* Vignette layer over the photo for legible copy */}
          <div className="ev-svc-stage__scrim" aria-hidden="true" />

          {/* Top row — 6 small icon pills, centered */}
          <nav
            className="ev-svc-stage__pills"
            role="tablist"
            aria-label="فئات الخدمات"
          >
            {EV_SERVICES.map((s, i) => {
              const Icon = EV_ICONS[s.icon] || EV_ICONS.sparkle;
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="ev-svc-stage-panel"
                  className={`ev-svc-stage__pill ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  title={s.title}
                >
                  <Icon width={28} height={28} />
                </button>
              );
            })}
          </nav>

          {/* Active service content — pinned to bottom-right of the stage.
              Inside the content card, items stack top-down from the right
              (RTL natural reading: title → short → body). The active icon
              tile is intentionally removed per spec. */}
          <div
            className="ev-svc-stage__panel"
            id="ev-svc-stage-panel"
            role="tabpanel"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                className="ev-svc-stage__content"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="ev-svc__title ev-svc-stage__title">
                  {activeService.title}
                </h3>
                <p className="ev-svc__short ev-svc-stage__short">
                  {activeService.short}
                </p>
                <p className="ev-svc__body ev-svc-stage__body">
                  {activeService.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step indicator at the foot of the stage */}
            <div className="ev-svc-stage__steps" aria-hidden="true">
              {EV_SERVICES.map((s, i) => (
                <span
                  key={s.id}
                  className={`ev-svc-stage__step ${i === active ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
