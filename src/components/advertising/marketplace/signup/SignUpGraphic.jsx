import React from 'react';

/**
 * SignUpGraphic — replaces the sign-in's photo with a custom yellow panel.
 *
 *   ┌──────────────────────────────────────┐
 *   │  [small wheel, blurred]              │
 *   │                                      │
 *   │         نُضيف لإعلاناتــك            │
 *   │              مَعنَى.                  │
 *   │                                      │
 *   │              [larger wheel, blurred] │
 *   └──────────────────────────────────────┘
 *
 * Both wheel SVGs (same source file) rotate 360° on a 4-second loop with an
 * ease-in-out timing curve, blurred by 20px so they read as ambient motion
 * rather than a focal element. Text sits dead-center, both lines on equal
 * weight in VIP Hakm Bold.
 */
export default function SignUpGraphic() {
  return (
    <div className="su-graphic" aria-hidden="false">
      {/* Top-left smaller wheel */}
      <img
        src="/advertising/marketplace/sing-up/wheel.svg"
        alt=""
        className="su-graphic__wheel su-graphic__wheel--tl"
        aria-hidden="true"
        draggable="false"
      />

      {/* Bottom-right larger wheel */}
      <img
        src="/advertising/marketplace/sing-up/wheel.svg"
        alt=""
        className="su-graphic__wheel su-graphic__wheel--br"
        aria-hidden="false"
        draggable="true"
      />

      {/* Centered two-line headline */}
      <div className="su-graphic__text">
        <span className="su-graphic__text-line">نُضيف لإعلانــاتــك</span>
        <span className="su-graphic__text-line">مَــعنَــــــى.</span>
      </div>
    </div>
  );
}
