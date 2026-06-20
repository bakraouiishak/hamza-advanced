import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../lib/auth.jsx';

/**
 * SignInForm — wired to POST /api/auth/login.
 *
 * On success:
 *   • Admins are routed to the dashboard.
 *   • Customers are routed back to wherever they were trying to reach
 *     (location.state.from) or to the marketplace home as a fallback.
 *
 * Errors render inline as a discreet banner above the submit button.
 */
export default function SignInForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') {
        navigate('/sectors/advertising/marketplace/admin', { replace: true });
      } else {
        const fallback = '/sectors/advertising/marketplace';
        const dest = location.state?.from?.pathname || fallback;
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'تعذّر تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="si-form" onSubmit={handleSubmit} noValidate>
      {/* Eyebrow */}
      <span className="si-form__eyebrow">مرحبًا بعودتك</span>

      {/* Heading */}
      <h1 className="si-form__heading">
        تسجيل الدخول إلى <span className="si-hl">المتجر</span>
      </h1>

      {/* Description */}
      <p className="si-form__desc">
        أدخل بياناتك للوصول إلى حسابك ومتابعة طلباتك.
      </p>

      {/* Email field */}
      <div className="si-field">
        <label className="si-field__label" htmlFor="si-email">
          البريد الإلكتروني
        </label>
        <div className="si-field__wrap">
          <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M22 7l-10 6L2 7" />
          </svg>
          <input
            id="si-email"
            type="email"
            className="si-field__input"
            placeholder="example@hamza.sa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            dir="ltr"
          />
        </div>
      </div>

      {/* Password field */}
      <div className="si-field">
        <label className="si-field__label" htmlFor="si-password">
          كلمة المرور
        </label>
        <div className="si-field__wrap">
          <svg className="si-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="3" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <input
            id="si-password"
            type={showPassword ? 'text' : 'password'}
            className="si-field__input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
          />
          <button
            type="button"
            className="si-field__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? (
              /* Eye-off icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember me + forgot password row */}
      <div className="si-form__options">
        <label className="si-checkbox">
          <input type="checkbox" />
          <span className="si-checkbox__box" />
          <span className="si-checkbox__text">تذكّرني</span>
        </label>
        <button
          type="button"
          className="si-form__forgot"
          aria-disabled="true"
          tabIndex={-1}
          title="استعادة كلمة المرور — قريبًا"
        >
          نسيت كلمة المرور؟
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="si-form__error" role="alert">
          {error}
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="si-form__submit" disabled={submitting}>
        {submitting ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
        {!submitting && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Divider */}
      <div className="si-form__divider">
        <span />
        <p>ليس لديك حساب؟</p>
        <span />
      </div>

      {/* Sign-up link — routes to the signup page, carries the original
          intended destination forward so post-signup we land where the
          user was originally heading. */}
      <Link
        to="/sectors/advertising/marketplace/signup"
        state={location.state}
        className="si-form__signup-link"
      >
        إنشاء حساب جديد
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </form>
  );
}
