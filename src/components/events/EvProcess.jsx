import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EV_PROCESS } from '../../data/events.js';

/**
 * Operational cycle — 17 strict stages, compressed into one interactive
 * three-phase stage.
 *
 * UX design choices
 *  • 17 vertical cards = exhausting scroll. We group them into 3 logical
 *    phases (التخطيط / التحضير / التنفيذ) presented as segmented tabs.
 *  • Inside the active phase, a numbered horizontal stepper lets the visitor
 *    scan + jump. Click any node to read its detail.
 *  • One large detail card carries the active step's body — keeps the visual
 *    surface compact regardless of phase length.
 *  • Prev/next chevrons + ←/→ keyboard nav for fast skimming.
 *  • A global progress bar at the bottom shows position in the 17-step cycle.
 *  • Phase changes auto-select that phase's first step.
 *
 * Responsive
 *  • Stepper scrolls horizontally on narrow screens; nodes stay generous
 *    (44×44 hit target on mobile).
 *  • Phase tabs collapse to a 3-column grid on mobile.
 */

/* Phase grouping — chosen by activity, not equal slices. Step ranges map
   into EV_PROCESS by 1-indexed step number (`.n`). */
const PHASES = [
  {
    id: 'plan',
    label: 'التخطيط',
    tagline: 'الاستراتيجية والتأسيس',
    range: [1, 5],
    image: '/event organization/EdProcess/التخطيط.jpg',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: 'prep',
    label: 'التحضير',
    tagline: 'التجهيز والتسويق',
    range: [6, 12],
    image: '/event organization/EdProcess/التحضير.jpg',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M5 7v12h14V7M9 11h6M9 15h4" />
      </svg>
    ),
  },
  {
    id: 'exec',
    label: 'التنفيذ والمتابعة',
    tagline: 'الإطلاق والتقييم',
    range: [13, 17],
    image: '/event organization/EdProcess/التنفيذ.jpg',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-11" />
      </svg>
    ),
  },
];

export default function EvProcess() {
  const [phaseId, setPhaseId] = useState(PHASES[0].id);
  const [stepN, setStepN] = useState(1);
  const stepperRef = useRef(null);

  const activePhase = useMemo(
    () => PHASES.find((p) => p.id === phaseId) || PHASES[0],
    [phaseId]
  );

  // Steps inside the current phase
  const phaseSteps = useMemo(
    () => EV_PROCESS.filter((s) => s.n >= activePhase.range[0] && s.n <= activePhase.range[1]),
    [activePhase]
  );

  const activeStep = useMemo(
    () => EV_PROCESS.find((s) => s.n === stepN) || EV_PROCESS[0],
    [stepN]
  );

  // When user switches phase, auto-focus that phase's first step
  const pickPhase = (id) => {
    const p = PHASES.find((x) => x.id === id);
    if (!p) return;
    setPhaseId(id);
    setStepN(p.range[0]);
  };

  // Prev/next nav across all 17 stages (loops at edges for a friendlier feel)
  const goPrev = () => {
    const nextN = stepN <= 1 ? EV_PROCESS.length : stepN - 1;
    setStepN(nextN);
    const owner = PHASES.find((p) => nextN >= p.range[0] && nextN <= p.range[1]);
    if (owner) setPhaseId(owner.id);
  };
  const goNext = () => {
    const nextN = stepN >= EV_PROCESS.length ? 1 : stepN + 1;
    setStepN(nextN);
    const owner = PHASES.find((p) => nextN >= p.range[0] && nextN <= p.range[1]);
    if (owner) setPhaseId(owner.id);
  };

  // Keyboard navigation when the section is focused / hovered
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();      // RTL: ← moves forward visually
      else if (e.key === 'ArrowRight') goNext(); // RTL: → moves backward visually
    };
    const node = stepperRef.current;
    if (!node) return undefined;
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepN]);

  const progressPct = (stepN / EV_PROCESS.length) * 100;

  return (
    <section id="process" className="ev-section ev-pattern-bg">
      <div className="ev-section__inner">
        <header className="ev-section__head">
          <span className="ev-eyebrow">الدورة التشغيلية الكاملة</span>
          <h2 className="ev-h2">
            17 مرحلة <span className="ev-hl">صارمة</span> لكل فعالية
          </h2>
          <p className="ev-lede">
            نعتمد في قطاع تنظيم الفعاليات على منهجية صارمة تتكوّن من 17 مرحلة
            لضمان الإشراف والمتابعة الشاملة لجميع العمليات قبل وأثناء وبعد
            الفعالية.
          </p>
        </header>

        <motion.div
          className="ev-proc"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Phase-driven background photo — grayscale + blur, crossfades on
              phase switch. Sits below the scrim and all content. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${activePhase.id}`}
              className="ev-proc__bg"
              style={{ backgroundImage: `url("${encodeURI(activePhase.image)}")` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
          </AnimatePresence>
          <div className="ev-proc__scrim" aria-hidden="true" />

          {/* Phase segmented tabs */}
          <div className="ev-proc__phases" role="tablist" aria-label="مراحل الدورة التشغيلية">
            {PHASES.map((p) => {
              const isActive = p.id === phaseId;
              const count = p.range[1] - p.range[0] + 1;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`ev-proc__phase ${isActive ? 'is-active' : ''}`}
                  onClick={() => pickPhase(p.id)}
                >
                  <span className="ev-proc__phase-icon">{p.icon}</span>
                  <span className="ev-proc__phase-body">
                    <span className="ev-proc__phase-label">{p.label}</span>
                    <span className="ev-proc__phase-tagline">{p.tagline}</span>
                  </span>
                  <span className="ev-proc__phase-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Horizontal stepper — numbered nodes for the active phase */}
          <div
            className="ev-proc__stepper"
            tabIndex={0}
            ref={stepperRef}
            role="tablist"
            aria-label="مراحل الدورة التشغيلية"
          >
            <div className="ev-proc__stepper-track" aria-hidden="true" />
            <div
              className="ev-proc__stepper-fill"
              style={{
                /* Track endpoints are the centers of the first and last nodes
                   (anchored 22px = node-radius from each side). Nodes are
                   distributed via `space-between`, so node `idx` sits at
                   `idx / (N-1)` of the track. The fill reaches the active
                   node's center exactly. */
                width:
                  phaseSteps.length > 1
                    ? `${
                        (phaseSteps.findIndex((s) => s.n === stepN) /
                          (phaseSteps.length - 1)) *
                        100
                      }%`
                    : '0%',
              }}
              aria-hidden="true"
            />
            <div className="ev-proc__stepper-nodes">
              {phaseSteps.map((s) => {
                const isActive = s.n === stepN;
                const isDone = s.n < stepN;
                return (
                  <button
                    key={s.n}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    title={s.title}
                    className={`ev-proc__node ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                    onClick={() => setStepN(s.n)}
                  >
                    <span className="ev-proc__node-n">{String(s.n).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail card */}
          <div className="ev-proc__detail">
            <div className="ev-proc__detail-meta">
              <span className="ev-proc__detail-phase">{activePhase.label}</span>
              <span className="ev-proc__detail-counter">
                <strong>{String(stepN).padStart(2, '0')}</strong>
                <span>/ {String(EV_PROCESS.length).padStart(2, '0')}</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.n}
                className="ev-proc__detail-body"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="ev-proc__detail-title">{activeStep.title}</h3>
                <p className="ev-proc__detail-text">{activeStep.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="ev-proc__detail-nav">
              <button
                type="button"
                className="ev-proc__nav-btn"
                onClick={goPrev}
                aria-label="المرحلة السابقة"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="ev-proc__nav-bar" aria-hidden="true">
                <div className="ev-proc__nav-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <button
                type="button"
                className="ev-proc__nav-btn"
                onClick={goNext}
                aria-label="المرحلة التالية"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Venue-readiness pledge — kept as a compact callout under the stage */}
        <motion.aside
          className="ev-hosting-note"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ev-step__num" style={{ background: 'rgba(230,59,92,0.2)', borderColor: 'rgba(230,59,92,0.5)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <path d="M12 14l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="ev-hosting-note__title">محددات بيئة الاستضافة</h4>
            <p className="ev-hosting-note__body">
              نعمل على التحقق المطلق من الجاهزية اللوجستية للأثاث، الصوت،
              الإضاءة المتكاملة، ومناسبة شاشات العرض العملاقة لبيئة الفعالية.
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
