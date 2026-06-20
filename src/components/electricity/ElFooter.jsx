import React from 'react';
import { Link } from 'react-router-dom';
import { EL_BRAND } from '../../data/electricity.js';

/**
 * Electricity footer — four-column layout matching the parent design system.
 * A faint floating logo mark sits in the background.
 */
export default function ElFooter() {
  return (
    <footer className="el-footer" dir="rtl">
      <div className="el-footer__inner">
        <div className="el-footer__grid">
          <div className="el-footer__brand">
            <img src="/electricity/Horizontal Logo.svg" alt="الهمزة المتطورة — للكهرباء" />
            <p className="el-footer__desc">
              {EL_BRAND.divisionName}® — مؤسسة سعودية رسمية متخصصة في توريد
              وصيانة الأنظمة الكهربائية الحرجة، بفريق هندسي معتمد ودعم فني على
              مدار الساعة.
            </p>
            <div className="el-footer__socials">
              <a href="#" className="el-footer__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="el-footer__social" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="el-footer__social" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="el-footer__col-title">روابط سريعة</h4>
            <div className="el-footer__nav">
              <Link to="/" className="el-footer__link">← الانتقال للهمزة المتطورة</Link>
              <a href="#services" className="el-footer__link">خدماتنا</a>
              <a href="#why" className="el-footer__link">لماذا نحن</a>
              <a href="#values" className="el-footer__link">قيمنا</a>
              <a href="#contact" className="el-footer__link">تواصل معنا</a>
            </div>
          </div>

          <div>
            <h4 className="el-footer__col-title">أبرز خدماتنا</h4>
            <div className="el-footer__nav">
              <a href="#services" className="el-footer__link">توريد المولّدات الديزل</a>
              <a href="#services" className="el-footer__link">أنظمة UPS الإلكترونية</a>
              <a href="#services" className="el-footer__link">مفاتيح التحويل الآلية ATS</a>
              <a href="#services" className="el-footer__link">عقود الصيانة الوقائية</a>
              <a href="#services" className="el-footer__link">لوحات التحكم والتوزيع</a>
              <a href="#services" className="el-footer__link">الاستشارات الهندسية</a>
            </div>
          </div>

          <div>
            <h4 className="el-footer__col-title">تواصل معنا</h4>
            <div className="el-footer__nav">
              <a href={`tel:${EL_BRAND.contact.phone.replace(/\s/g, '')}`} className="el-footer__link">{EL_BRAND.contact.phone}</a>
              <a href={`mailto:${EL_BRAND.contact.email}`} className="el-footer__link">{EL_BRAND.contact.email}</a>
              <a href={`https://${EL_BRAND.contact.website}`} className="el-footer__link">{EL_BRAND.contact.website}</a>
              <span className="el-footer__link" style={{ cursor: 'default' }}>{EL_BRAND.contact.address}</span>
            </div>
          </div>
        </div>

        <div className="el-footer__bottom">
          <p>© الهمزة المتطورة — للكهرباء 2026® — جميع الحقوق محفوظة.</p>
          <div className="el-footer__bottom-links">
            <Link to="/">الموقع الرئيسي</Link>
            <a href="#">سياسة الخصوصية</a>
            <a href="#">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
