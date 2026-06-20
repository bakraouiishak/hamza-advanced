import React from 'react';
import { Link } from 'react-router-dom';
import { TR_BRAND } from '../../data/travel.js';

/**
 * Travel & Tourism footer — four-column layout matching the parent design
 * system. A faint floating compass sits in the background.
 */
export default function TrFooter() {
  return (
    <footer className="tr-footer" dir="rtl">
      <div className="tr-footer__inner">
        <div className="tr-footer__grid">
          <div className="tr-footer__brand">
            <img src="/travel/Horizontal Logo.svg" alt="الهمزة المتطورة — للسفر والسياحة" />
            <p className="tr-footer__desc">
              {TR_BRAND.divisionName}® — مؤسسة سعودية متخصصة في تنظيم الرحلات
              والتجارب السياحية داخلياً ودولياً، بخدمات مُخصّصة للأفراد
              والمجموعات والشركات.
            </p>
            <div className="tr-footer__socials">
              <a href="#" className="tr-footer__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="tr-footer__social" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="tr-footer__social" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="tr-footer__col-title">روابط سريعة</h4>
            <div className="tr-footer__nav">
              <Link to="/" className="tr-footer__link">← الانتقال للهمزة المتطورة</Link>
              <a href="#services" className="tr-footer__link">خدماتنا</a>
              <a href="#why" className="tr-footer__link">لماذا نحن</a>
              <a href="#projects" className="tr-footer__link">مشاريعنا</a>
              <a href="#values" className="tr-footer__link">قيمنا</a>
              <a href="#contact" className="tr-footer__link">تواصل معنا</a>
            </div>
          </div>

          <div>
            <h4 className="tr-footer__col-title">أبرز خدماتنا</h4>
            <div className="tr-footer__nav">
              <a href="#services" className="tr-footer__link">حجوزات الطيران</a>
              <a href="#services" className="tr-footer__link">التأشيرات والتأمين</a>
              <a href="#services" className="tr-footer__link">السكن والإقامة</a>
              <a href="#services" className="tr-footer__link">البرامج السياحية</a>
              <a href="#services" className="tr-footer__link">النقل والمواصلات</a>
              <a href="#services" className="tr-footer__link">الخدمات اللوجستية</a>
            </div>
          </div>

          <div>
            <h4 className="tr-footer__col-title">تواصل معنا</h4>
            <div className="tr-footer__nav">
              <a href={`tel:${TR_BRAND.contact.phone.replace(/\s/g, '')}`} className="tr-footer__link">{TR_BRAND.contact.phone}</a>
              <a href={`mailto:${TR_BRAND.contact.email}`} className="tr-footer__link">{TR_BRAND.contact.email}</a>
              <a href={`https://${TR_BRAND.contact.website}`} className="tr-footer__link">{TR_BRAND.contact.website}</a>
              <span className="tr-footer__link" style={{ cursor: 'default' }}>{TR_BRAND.contact.address}</span>
            </div>
          </div>
        </div>

        <div className="tr-footer__bottom">
          <p>© الهمزة المتطورة — للسفر والسياحة 2026® — جميع الحقوق محفوظة.</p>
          <div className="tr-footer__bottom-links">
            <Link to="/">الموقع الرئيسي</Link>
            <a href="#">سياسة الخصوصية</a>
            <a href="#">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
