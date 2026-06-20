import React from 'react';
import { motion } from 'motion/react';
import { EV_BRAND } from '../../data/events.js';

/**
 * CTA banner — closes the page before the footer. Pitch + primary contact
 * action on the left; four contact channels (phone, email, website, address)
 * stacked on the right. Channels are lifted verbatim from p.8 of the profile.
 */
export default function EvCTA() {
  const items = [
    {
      label: 'رقم الهاتف والاتصال المباشر',
      value: EV_BRAND.contact.phone,
      href: `tel:${EV_BRAND.contact.phone.replace(/\s|\+/g, '')}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: 'البريد الإلكتروني الرسمي',
      value: EV_BRAND.contact.email,
      href: `mailto:${EV_BRAND.contact.email}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: 'الموقع الإلكتروني المخصص للقطاع',
      value: EV_BRAND.contact.website,
      href: `https://${EV_BRAND.contact.website}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      label: 'العنوان الرئيسي والمكتب',
      value: EV_BRAND.contact.address,
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="ev-section">
      <div className="ev-section__inner">
        <motion.div
          className="ev-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h2 className="ev-cta__title">
              فعاليتك القادمة <span className="ev-hl">تبدأ بمكالمة</span>.
            </h2>
            <p className="ev-cta__body">
              نرحّب بفتح آفاق التعاون لتنظيم ومناقشة الكراسات والمناقصات
              والمشاريع الكبرى من خلال القنوات الرسمية المباشرة.
            </p>
            <div style={{ marginTop: '1.6rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <a href={`tel:${EV_BRAND.contact.phone.replace(/\s|\+/g, '')}`} className="ev-btn ev-btn--primary">
                اتصل بنا الآن
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href={`mailto:${EV_BRAND.contact.email}`} className="ev-btn ev-btn--ghost">
                أرسل بريد إلكتروني
              </a>
            </div>
          </div>

          <div className="ev-cta__contact-list">
            {items.map((it) => (
              <a key={it.label} href={it.href} className="ev-cta__contact-item">
                {it.icon}
                <div>
                  <span className="ev-cta__contact-label">{it.label}</span>
                  <span>{it.value}</span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
