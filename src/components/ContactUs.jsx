import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../styles/contactus.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   CONTACT US — Homepage Section
   Two-column layout: Info (RIGHT in RTL) | Form (LEFT in RTL)
   Premium dark theme with glassmorphism, scroll-in animations, and success state.
   ═══════════════════════════════════════════════════════════════════════════════ */

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleBlur = (e) => {
    setFocusedField(null);
    if (!e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, [e.target.name]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    setErrors({});
  };

  return (
    <section className="contact-section" id="contact">
      {/* ── Animated background glows ── */}
      <div className="contact-bg" aria-hidden="true">
        <div className="contact-bg__glow contact-bg__glow--1" />
        <div className="contact-bg__glow contact-bg__glow--2" />
      </div>

      {/* ── Header (centered, full width) ── */}
      <motion.div
        className="contact-header container-x"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="contact-eyebrow">تواصل معنا</span>
        <h2 className="contact-heading">
          <span className="contact-heading__green">لنبدأ شيئاً مختلفاً ..</span>
          <span className="contact-heading__white">دع الفكرة تتحول لواقع</span>
        </h2>
        <p className="contact-desc">
          سواء فكرة، استفسار، أو حتى مجرد بداية غير واضحة<br />
          نحن هنا لنبني معك الخطوة التالية بثقة، وضمن منظومة متكاملة من الخدمات
        </p>
      </motion.div>

      {/* ── Content Row ── */}
      <div className="contact-row container-x">

        {/* RIGHT column in RTL (first in DOM) → Info */}
        <motion.div
          className="contact-info"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Services */}
          <motion.div className="contact-services" variants={staggerItem}>
            <h3 className="contact-services__title">مع خدماتنا يمكنك :</h3>
            <motion.ul
              className="contact-services__list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.li key={i} variants={staggerItem}>
                  <span className="contact-services__icon-wrap">
                    <CheckIcon />
                  </span>
                  ميزة من ميزات خدماتنا
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Addresses */}
          <motion.div className="contact-addresses" variants={staggerItem}>
            <motion.div
              className="contact-address"
              variants={staggerItem}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-address__city">
                <div className="contact-address__icon-bg">
                  <img src="/images/contact/saudi arabia map.svg" alt="" className="contact-address__map" />
                </div>
                <span className="contact-address__name">جدة</span>
              </div>
              <p className="contact-address__text">
                عنوان شارع/نهج 2393 عنوان شارع<br />
                الحي السكني / المنطقة<br />
                المدينة
              </p>
            </motion.div>
            <motion.div
              className="contact-address"
              variants={staggerItem}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-address__city">
                <div className="contact-address__icon-bg">
                  <img src="/images/contact/saudi arabia map.svg" alt="" className="contact-address__map" />
                </div>
                <span className="contact-address__name">الرياض</span>
              </div>
              <p className="contact-address__text">
                عنوان شارع/نهج 2393 عنوان شارع<br />
                الحي السكني / المنطقة<br />
                المدينة
              </p>
            </motion.div>
          </motion.div>

          {/* Response time pill */}
          <motion.div className="contact-response-pill" variants={staggerItem}>
            <ClockIcon />
            نحن نرد على تواصلك معنا خلال&nbsp;<span className="contact-response-pill__green">24 ساعة</span>
          </motion.div>
        </motion.div>

        {/* LEFT column in RTL (second in DOM) → Form */}
        <motion.div
          className="contact-form-wrapper"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-form-card">
            <div className="contact-form-card__pattern"></div>
            <div className="contact-form-card__gradient"></div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="contact-form__row">
                    <div className={`contact-form__group ${focusedField === 'firstName' ? 'contact-form__group--focused' : ''}`}>
                      <label className="contact-form__label">الاسم</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="أدخل اسمك .."
                        value={formData.firstName}
                        className={`contact-form__input ${errors.firstName ? 'contact-form__input--error' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                    <div className={`contact-form__group ${focusedField === 'lastName' ? 'contact-form__group--focused' : ''}`}>
                      <label className="contact-form__label">اللقب</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="اللقب الكامل .."
                        value={formData.lastName}
                        className={`contact-form__input ${errors.lastName ? 'contact-form__input--error' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                      />
                    </div>
                  </div>

                  <div className={`contact-form__group ${focusedField === 'email' ? 'contact-form__group--focused' : ''}`}>
                    <label className="contact-form__label">البريد الالكتروني</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="أدخل بريدك الالكتروني .."
                      value={formData.email}
                      className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                  </div>

                  <div className={`contact-form__group ${focusedField === 'phone' ? 'contact-form__group--focused' : ''}`}>
                    <label className="contact-form__label">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="أدخل رقم هاتفك .."
                      value={formData.phone}
                      className={`contact-form__input ${errors.phone ? 'contact-form__input--error' : ''}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                  </div>

                  <div className={`contact-form__group ${focusedField === 'message' ? 'contact-form__group--focused' : ''}`}>
                    <label className="contact-form__label contact-form__label--green">كيف بإمكاننا مساعدتك؟</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      className={`contact-form__input contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    ></textarea>
                  </div>

                  <div className="contact-form__actions">
                    <motion.button
                      type="submit"
                      className="contact-submit-btn"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      أرسل للتواصل
                      <span className="contact-submit-btn__icon">
                        <ArrowLeftIcon />
                      </span>
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="contact-success__icon">
                    <motion.svg
                      width="72" height="72" viewBox="0 0 72 72" fill="none"
                    >
                      <motion.circle
                        cx="36" cy="36" r="30"
                        stroke="var(--emerald)"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.25 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M22 36l10 10 18-18"
                        stroke="var(--emerald)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                      />
                    </motion.svg>
                    {/* Pulsing ring behind the icon */}
                    <motion.div
                      className="contact-success__ring"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [0.8, 1.3, 1.5], opacity: [0.4, 0.15, 0] }}
                      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <h3 className="contact-success__title">تم إرسال رسالتك بنجاح!</h3>
                  <p className="contact-success__body">
                    شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك خلال
                    <strong> 24 ساعة </strong>كحد أقصى.
                  </p>
                  <motion.button
                    className="contact-success__btn"
                    onClick={handleReset}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    إرسال رسالة أخرى
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
