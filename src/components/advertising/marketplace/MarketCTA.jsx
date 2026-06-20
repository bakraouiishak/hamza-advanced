import React from 'react';
import { motion } from 'motion/react';

/**
 * MarketCTA — final banner before the footer. Encourages large-order
 * customers to reach out for a custom quote, bridging back to the
 * advertising sector site's contact channel.
 */
export default function MarketCTA() {
  return (
    <section className="mk-section">
      <div className="mk-section__inner">
        <motion.div
          className="mk-cta-banner"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mk-cta-banner__title">
            تحتاج <span className="mk-hl">طلب مخصّص</span> أو كميات كبيرة؟
          </h2>
          <p className="mk-cta-banner__body">
            فريقنا جاهز لتفصيل الطلبات الكبرى وتقديم تسعيرات تنافسية للشركات
            والمؤسسات والجهات الحكومية — تواصل معنا مباشرةً عبر موقع القطاع.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/sectors/advertising#contact" className="mk-btn mk-btn--primary">
              اطلب عرض سعر
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/sectors/advertising#services" className="mk-btn mk-btn--ghost">
              تعرّف على خدماتنا
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
