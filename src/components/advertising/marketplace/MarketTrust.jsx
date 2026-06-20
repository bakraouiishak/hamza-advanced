import React from 'react';
import { motion } from 'motion/react';
import { MARKET_TRUST } from '../../../data/advertising-marketplace.js';

/* SVG icons keyed by trust item id — no images needed, pure stroke vectors. */
const TRUST_ICONS = {
  't-ship': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16V8h11v8" />
      <path d="M14 11h4l3 3v2h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  't-pay': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  ),
  't-quality': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.5 5 5.5.8-4 4 1 5.7L12 15l-5 2.5 1-5.7-4-4 5.5-.8z" />
    </svg>
  ),
  't-support': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  ),
};

/**
 * MarketTrust — compact 4-icon strip surfacing the marketplace's service
 * guarantees. No backend data; entirely static UI copy.
 */
export default function MarketTrust() {
  return (
    <section className="mk-section" style={{ paddingTop: 0 }}>
      <div className="mk-section__inner">
        <motion.div
          className="mk-trust"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {MARKET_TRUST.map((t) => (
            <div key={t.id} className="mk-trust__item">
              <div className="mk-trust__icon">{TRUST_ICONS[t.id]}</div>
              <div>
                <div className="mk-trust__label">{t.label}</div>
                <div className="mk-trust__sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
