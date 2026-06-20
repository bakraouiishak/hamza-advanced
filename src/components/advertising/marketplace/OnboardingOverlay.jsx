import React, { useEffect, useState } from 'react';

/**
 * OnboardingOverlay — 3-step welcome modal shown once, right after sign-up.
 *
 * Lifecycle:
 *   1. SignUpForm navigates to /marketplace with `state.justSignedUp: true`
 *   2. AdvertisingMarketplace consumes that flag and mounts this overlay
 *   3. User clicks Next twice, then "تم" on the final step
 *   4. onDone fires → parent unmounts the overlay and the route state is
 *      cleared so a refresh / back-nav won't show it again
 *
 * The flow is strictly linear forward — no skip, no close-X. A subtle
 * "السابق" button is available on steps 2 and 3 to revisit a step in
 * case the user clicked Next by accident.
 */
const STEPS = [
  {
    num: '01',
    title: 'أضف المنتجات للسلّة',
    body:
      'تصفّح كتالوج المتجر، اختر المنتج الذي يناسب مشروعك، وحدّد الكمية المطلوبة ثم أضفه إلى سلّتك بضغطة واحدة.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        <path d="M12 10v4M10 12h4" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'اطلب منتجات السلّة',
    body:
      'ادخل إلى سلّتك، راجع المنتجات المختارة وكمياتها، ثم أرسل طلبك مع تفاصيل عنوانك ومتطلباتك الإضافية إلى المتجر.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M8 10h8M8 14h8M8 18h5" />
        <path d="M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'أكّد الطلب بعد المحادثة مع الإدارة',
    body:
      'للمنتجات حسب الطلب، تواصل مع الإدارة عبر دردشة الطلب لمراجعة المقاسات والخامات. فور وصول التسعير النهائي، تأكّد القبول لتبدأ مرحلة التنفيذ والتسليم.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
    ),
  },
];

export default function OnboardingOverlay({ onDone }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const isLast = step === total - 1;
  const cur = STEPS[step];

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const next = () => {
    if (isLast) onDone?.();
    else setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="onb" role="dialog" aria-modal="true" aria-labelledby="onb-title">
      <div className="onb__panel" key={step /* re-trigger fade on step change */}>
        {/* Step indicator: 01 / 03 */}
        <div className="onb__indicator">
          <span className="onb__num">{cur.num}</span>
          <span className="onb__num-divider" />
          <span className="onb__num-total">{String(total).padStart(2, '0')}</span>
        </div>

        {/* Icon plate */}
        <div className="onb__icon">{cur.icon}</div>

        {/* Title + body */}
        <h2 id="onb-title" className="onb__title">{cur.title}</h2>
        <p className="onb__body">{cur.body}</p>

        {/* Progress dots */}
        <div className="onb__dots" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`onb__dot ${i === step ? 'is-active' : ''} ${i < step ? 'is-past' : ''}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="onb__actions">
          {step > 0 ? (
            <button type="button" className="onb__back" onClick={back}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l-7 7 7 7" />
              </svg>
              السابق
            </button>
          ) : <span />}
          <button type="button" className="onb__next" onClick={next}>
            {isLast ? 'استكشاف المتجر' : 'التالي'}
            {!isLast && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l7-7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
