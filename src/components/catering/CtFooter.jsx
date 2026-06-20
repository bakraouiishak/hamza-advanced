import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Catering footer — gold-on-navy footer with the identity-vector monogram
 * watermark bleeding from the bottom (handled via .ct-footer::before in the
 * stylesheet).
 */
export default function CtFooter() {
  const cols = [
    {
      title: 'القطاع',
      links: [
        { label: 'خدماتنا', href: '#services' },
        { label: 'قائمتنا', href: '#menu' },
        { label: 'كيف نعمل', href: '#process' },
        { label: 'شيفاتنا', href: '#chefs' },
      ],
    },
    {
      title: 'الهمزة المتطورة',
      links: [
        { label: 'الموقع الرئيسي', href: '/', router: true },
        { label: 'تواصل معنا', href: '/contact', router: true },
        { label: 'رؤية 2030', href: '/vision2030', router: true },
      ],
    },
    {
      title: 'قطاعات أخرى',
      links: [
        { label: 'الدعاية والإعلان', href: '/sectors/advertising', router: true },
        { label: 'إدارة الفعاليات', href: '/sectors/events', router: true },
        { label: 'الكهرباء', href: '/sectors/electricity', router: true },
        { label: 'السفر والسياحة', href: '/sectors/travel', router: true },
      ],
    },
  ];

  return (
    <footer className="ct-footer">
      <div className="ct-footer__inner">
        <div className="ct-footer__grid">
          <div className="ct-footer__brand">
            <img src="/catering/Logo Horizontal.svg" alt="الهمزة المتطورة — للتموين والإعاشة" />
            <p className="ct-footer__desc">
              قطاع التموين والإعاشة من الهمزة المتطورة — ضيافة بمعايير راقية،
              مذاق سعودي أصيل، وكوادر سعودية مدرّبة.
            </p>
            <div className="ct-footer__socials">
              {['instagram', 'tiktok', 'linkedin', 'twitter', 'facebook'].map((s) => (
                <a key={s} href="#" className="ct-footer__social" aria-label={s}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="ct-footer__col-title">{c.title}</h4>
              <div className="ct-footer__nav">
                {c.links.map((l) =>
                  l.router ? (
                    <Link key={l.label} to={l.href} className="ct-footer__link">
                      {l.label}
                    </Link>
                  ) : (
                    <a key={l.label} href={l.href} className="ct-footer__link">
                      {l.label}
                    </a>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="ct-footer__bottom">
          <span>© {new Date().getFullYear()} الهمزة المتطورة — جميع الحقوق محفوظة</span>
          <div className="ct-footer__bottom-links">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
