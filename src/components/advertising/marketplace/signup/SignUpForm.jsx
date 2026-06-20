import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../lib/auth.jsx';

/**
 * SignUpForm — wired to POST /api/auth/signup via the AuthProvider's
 * `signup` helper, which also persists the returned JWT so the new customer
 * lands on the marketplace already signed-in (no "log in after signup" step).
 *
 * On success we navigate to the marketplace home with a `justSignedUp`
 * flag in the route state — the marketplace page reads this flag once and
 * renders a 3-step onboarding overlay (Add to cart → Order → Confirm with
 * admin). Refreshing the page or returning later does NOT re-trigger the
 * overlay because route state is consumed on mount and cleared.
 */
export default function SignUpForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const set = (field) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    // ── Client-side guards (the backend re-validates everything) ──
    if (form.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين.');
      return;
    }
    if (!form.acceptTerms) {
      setError('يجب الموافقة على الشروط والأحكام للمتابعة.');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name:    form.name.trim(),
        surname: form.surname.trim(),
        email:   form.email.trim(),
        phone:   form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
      });
      // Land on marketplace home + flag the onboarding overlay
      navigate('/sectors/advertising/marketplace', {
        replace: true,
        state: { justSignedUp: true },
      });
    } catch (err) {
      setError(err.message || 'تعذّر إنشاء الحساب. تأكّد من البيانات وحاول مجددًا.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="si-form" onSubmit={handleSubmit} noValidate>
      {/* Eyebrow */}
      <span className="si-form__eyebrow">ابدأ رحلتك معنا</span>

      {/* Heading */}
      <h1 className="si-form__heading">
        إنشاء حساب في <span className="si-hl">المتجر</span>
      </h1>

      {/* Description */}
      <p className="si-form__desc">
        أنشئ حسابك للوصول إلى العروض والباقات ومتابعة طلباتك بسهولة.
      </p>

      {/* Name + Surname row */}
      <div className="su-row su-row--2">
        <div className="si-field">
          <label className="si-field__label" htmlFor="su-name">الاسم</label>
          <div className="si-field__wrap">
            <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="su-name"
              type="text"
              className="si-field__input"
              placeholder="محمد"
              value={form.name}
              onChange={set('name')}
              autoComplete="given-name"
              dir="rtl"
            />
          </div>
        </div>

        <div className="si-field">
          <label className="si-field__label" htmlFor="su-surname">اللقب</label>
          <div className="si-field__wrap">
            <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="su-surname"
              type="text"
              className="si-field__input"
              placeholder="العتيبي"
              value={form.surname}
              onChange={set('surname')}
              autoComplete="family-name"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="si-field">
        <label className="si-field__label" htmlFor="su-email">البريد الإلكتروني</label>
        <div className="si-field__wrap">
          <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M22 7l-10 6L2 7" />
          </svg>
          <input
            id="su-email"
            type="email"
            className="si-field__input"
            placeholder="example@hamza.sa"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            dir="ltr"
          />
        </div>
      </div>

      {/* Phone + Address row */}
      <div className="su-row su-row--2">
        <div className="si-field">
          <label className="si-field__label" htmlFor="su-phone">الهاتف</label>
          <div className="si-field__wrap">
            <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              id="su-phone"
              type="tel"
              className="si-field__input"
              placeholder="+966 5X XXX XXXX"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
              dir="ltr"
            />
          </div>
        </div>

        <div className="si-field">
          <label className="si-field__label" htmlFor="su-address">العنوان</label>
          <div className="si-field__wrap">
            <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              id="su-address"
              type="text"
              className="si-field__input"
              placeholder="جدة، حي الفيصلية"
              value={form.address}
              onChange={set('address')}
              autoComplete="street-address"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="si-field">
        <label className="si-field__label" htmlFor="su-password">كلمة المرور</label>
        <div className="si-field__wrap">
          <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="3" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <input
            id="su-password"
            type={showPassword ? 'text' : 'password'}
            className="si-field__input"
            placeholder="8 أحرف على الأقل"
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
            dir="ltr"
          />
          <button
            type="button"
            className="si-field__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="si-field">
        <label className="si-field__label" htmlFor="su-confirm">تأكيد كلمة المرور</label>
        <div className="si-field__wrap">
          <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="3" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <input
            id="su-confirm"
            type={showConfirm ? 'text' : 'password'}
            className="si-field__input"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            autoComplete="new-password"
            dir="ltr"
          />
          <button
            type="button"
            className="si-field__toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showConfirm ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Terms acceptance — replaces the "Remember me + forgot" row */}
      <div className="si-form__options" style={{ marginTop: '0.25rem' }}>
        <label className="si-checkbox">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={set('acceptTerms')}
          />
          <span className="si-checkbox__box" />
          <span className="si-checkbox__text">
            أوافق على الشروط والأحكام وسياسة الخصوصية
          </span>
        </label>
      </div>

      {/* Error banner — surfaces validation or backend errors inline */}
      {error && (
        <div className="si-form__error" role="alert">
          {error}
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="si-form__submit" disabled={submitting}>
        {submitting ? 'جارٍ إنشاء الحساب…' : 'إنشاء الحساب'}
        {!submitting && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Divider */}
      <div className="si-form__divider">
        <span />
        <p>لديك حساب بالفعل؟</p>
        <span />
      </div>

      {/* Sign-in cross-link — now a real Link to the sign-in page. */}
      <Link
        to="/sectors/advertising/marketplace/signin"
        className="si-form__signup-link"
      >
        تسجيل الدخول
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </form>
  );
}
