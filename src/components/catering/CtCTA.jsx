import React from 'react';
import { motion } from 'motion/react';
import { CT_BRAND } from '../../data/catering.js';
import { PhoneIcon, MailIcon, PinIcon } from './CtIcons.jsx';

/**
 * Final CTA — gold-tinted banner with three direct contact lanes. The
 * identity-vector cookie monogram bleeds in from the top corner as a quiet
 * brand watermark.
 */
export default function CtCTA() {
  return (
    <section id="cta" className="ct-section">
      <div className="ct-section__inner">
        <motion.div
          className="ct-cta"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="ct-eyebrow">ابدأ مناسبتك معنا</span>
            <h2 className="ct-cta__title">
              مناسبتك القادمة <span className="ct-hl">تستحق ضيافة الهمزة</span>
            </h2>
            <p className="ct-cta__body">
              تواصل مع فريق المبيعات لِترتيب جلسة استشارة مجانية — نُرسل لك عينة
              قائمة مبدئية وعرضاً سعرياً واضحاً خلال 48 ساعة من تفاصيل مناسبتك.
            </p>
            <a href="#contact" className="ct-btn ct-btn--primary" style={{ marginTop: '1.5rem' }}>
              احجز جلسة استشارة
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <ul className="ct-cta__contact-list" id="contact">
            <li>
              <a href={`tel:${CT_BRAND.contactPhone.replace(/\s/g, '')}`} className="ct-cta__contact-item">
                <PhoneIcon />
                <span>
                  <span className="ct-cta__contact-label">اتصل بنا</span>
                  {CT_BRAND.contactPhone}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${CT_BRAND.contactEmail}`} className="ct-cta__contact-item">
                <MailIcon />
                <span>
                  <span className="ct-cta__contact-label">البريد الإلكتروني</span>
                  {CT_BRAND.contactEmail}
                </span>
              </a>
            </li>
            <li>
              <div className="ct-cta__contact-item">
                <PinIcon />
                <span>
                  <span className="ct-cta__contact-label">المقر الرئيسي</span>
                  {CT_BRAND.contactAddress}
                </span>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
