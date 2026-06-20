import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MarketFooter — compact footer for the marketplace. Brand block on the
 * right (RTL start), three link columns and a contact column. All nav links
 * are disabled placeholders for now (pages will be built later); only the
 * two cross-site exits — back to the advertising sector site and to the
 * parent brand — are real routes.
 */
export default function MarketFooter() {
  return (
    <footer className="mk-footer" dir="rtl">
      <div className="mk-footer__inner">
        <div className="mk-footer__grid">
          {/* Brand */}
          <div className="mk-footer__brand">
            <img
              src="/images/logos svg/hamza advanced advertising marketplace svg.svg"
              alt="متجر الهمزة المتطورة"
            />
            <p className="mk-footer__desc">
              متجر الهمزة المتطورة للدعاية والإعلان — كل ما تحتاجه من منتجات
              دعائية وإعلانية بجودة عالية وأسعار تنافسية.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link
                to="/sectors/advertising"
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 999,
                  background: 'var(--ad-yellow)',
                  color: 'var(--ad-ink)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                موقع القطاع
              </Link>
              <Link
                to="/"
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 999,
                  border: '1px solid rgba(247,240,245,0.28)',
                  color: 'rgba(247,240,245,0.7)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              >
                الهمزة المتطورة
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mk-footer__col-title">المتجر</h4>
            <div className="mk-footer__nav">
              <button type="button" className="mk-footer__link" aria-disabled="true">جميع المنتجات</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">الفئات</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">الباقات</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">العروض</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">الجديد</button>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="mk-footer__col-title">حسابي</h4>
            <div className="mk-footer__nav">
              <button type="button" className="mk-footer__link" aria-disabled="true">تسجيل الدخول</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">إنشاء حساب</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">طلباتي</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">المفضّلة</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">السلّة</button>
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="mk-footer__col-title">المساعدة</h4>
            <div className="mk-footer__nav">
              <button type="button" className="mk-footer__link" aria-disabled="true">تساؤلاتكم</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">سياسة الشحن</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">الاستبدال والإرجاع</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">طرق الدفع</button>
              <button type="button" className="mk-footer__link" aria-disabled="true">تواصل معنا</button>
            </div>
          </div>
        </div>

        <div className="mk-footer__bottom">
          <p>© متجر الهمزة المتطورة 2026® — جميع الحقوق محفوظة.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button type="button" className="mk-footer__link" aria-disabled="true">سياسة الخصوصية</button>
            <button type="button" className="mk-footer__link" aria-disabled="true">الشروط والأحكام</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
