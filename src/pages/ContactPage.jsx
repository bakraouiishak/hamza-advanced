import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { HamzaWordmark, MARK_BY_ID } from '../components/BrandMarks.jsx';
import { SECTORS } from '../data/sectors.js';
import '../styles/contact-page.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   CONTACT PAGE — تواصل معنا
   Premium standalone contact page with sector-aware inquiry form,
   interactive map cards, and animated success state.
   ═══════════════════════════════════════════════════════════════════════════════ */

const SECTOR_LIST = SECTORS.filter(s => s.id !== 'main');

const SERVICE_BENEFITS = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: 'رد خلال 24 ساعة كحد أقصى' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, text: 'فريق استشاري متخصص لكل قطاع' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'حماية بياناتك وسريتها بالكامل' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: 'خدمة عملاء مخصصة بخمس قطاعات' },
];

const OFFICES = [
  {
    city: 'الرياض',
    en: 'Riyadh',
    address: 'طريق الملك فهد — حي العليا\nالرياض، المملكة العربية السعودية',
    phone: '+966 11 XXX XXXX',
    email: 'info@hamza-adv.com',
    primary: true,
  },
  {
    city: 'جدة',
    en: 'Jeddah',
    address: 'شارع التحلية — حي الأندلس\nجدة، المملكة العربية السعودية',
    phone: '+966 12 XXX XXXX',
    email: 'jeddah@hamza-adv.com',
    primary: false,
  },
];
export default function ContactPage() {
  const [selectedSector, setSelectedSector] = useState(null);
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleBlur = (e) => {
    if (!e.target.value.trim()) {
      setErrors(prev => ({ ...prev, [e.target.name]: true }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.message.trim()) newErrors.message = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="cp" dir="rtl">

      {/* ── Back nav ── */}
      <Link to="/" className="cp__back" aria-label="العودة للرئيسية">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        العودة للرئيسية
      </Link>

      {/* ── Background elements ── */}
      <div className="cp__bg" aria-hidden="true">
        <div className="cp__bg-glow cp__bg-glow--1" />
        <div className="cp__bg-glow cp__bg-glow--2" />
        <div className="cp__bg-grid" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
         HERO HEADER
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="cp__hero">
        <div className="cp__container">
          <motion.div
            className="cp__hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="cp__hero-eyebrow">تواصل معنا</span>
            <h1 className="cp__hero-title">
              <span className="cp__hero-title-green">لنبدأ شيئاً مختلفاً ..</span>
              <span className="cp__hero-title-white">دع الفكرة تتحول لواقع</span>
            </h1>
            <p className="cp__hero-body">
              سواء فكرة، استفسار، أو حتى مجرد بداية غير واضحة — نحن هنا لنبني
              معك الخطوة التالية بثقة، وضمن منظومة متكاملة من الخدمات
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         MAIN CONTENT: Form + Info side by side
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="cp__main">
        <div className="cp__container">
          <div className="cp__grid">

            {/* ── LEFT: Form side ── */}
            <motion.div
              className="cp__form-col"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    className="cp__form-card"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Pattern overlay */}
                    <div className="cp__form-pattern" />
                    <div className="cp__form-gradient" />

                    <form className="cp__form" ref={formRef} onSubmit={handleSubmit} noValidate>

                      {/* ── Sector selector ── */}
                      <div className="cp__form-group">
                        <label className="cp__label cp__label--accent">اختر القطاع المناسب</label>
                        <div className="cp__sector-grid">
                          {SECTOR_LIST.map(s => {
                            const Mark = MARK_BY_ID[s.id];
                            const isSelected = selectedSector === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                className={`cp__sector-btn ${isSelected ? 'cp__sector-btn--active' : ''}`}
                                style={{ '--s-color': s.color }}
                                onClick={() => setSelectedSector(isSelected ? null : s.id)}
                              >
                                <span className="cp__sector-btn-icon" style={{ color: s.color }}>
                                  {Mark && <Mark width={20} height={20} />}
                                </span>
                                <span className="cp__sector-btn-name">{s.name}</span>
                                {isSelected && (
                                  <motion.div
                                    className="cp__sector-btn-check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </motion.div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── Name & Company row ── */}
                      <div className="cp__form-row">
                        <div className="cp__form-group">
                          <label className="cp__label">الاسم الكامل <span className="cp__required">*</span></label>
                          <input
                            type="text" name="name"
                            placeholder="أدخل اسمك .."
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`cp__input ${errors.name ? 'cp__input--error' : ''}`}
                          />
                        </div>
                        <div className="cp__form-group">
                          <label className="cp__label">اسم الشركة / الجهة</label>
                          <input
                            type="text" name="company"
                            placeholder="اسم الجهة (اختياري) .."
                            value={formData.company}
                            onChange={handleChange}
                            className="cp__input"
                          />
                        </div>
                      </div>

                      {/* ── Email & Phone row ── */}
                      <div className="cp__form-row">
                        <div className="cp__form-group">
                          <label className="cp__label">البريد الإلكتروني <span className="cp__required">*</span></label>
                          <input
                            type="email" name="email"
                            placeholder="example@domain.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`cp__input ${errors.email ? 'cp__input--error' : ''}`}
                          />
                        </div>
                        <div className="cp__form-group">
                          <label className="cp__label">رقم الهاتف</label>
                          <input
                            type="tel" name="phone"
                            placeholder="+966 5XX XXX XXXX"
                            value={formData.phone}
                            onChange={handleChange}
                            className="cp__input"
                          />
                        </div>
                      </div>

                      {/* ── Message ── */}
                      <div className="cp__form-group">
                        <label className="cp__label cp__label--accent">كيف بإمكاننا مساعدتك؟ <span className="cp__required">*</span></label>
                        <textarea
                          name="message"
                          placeholder="أخبرنا عن مشروعك أو استفسارك .."
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`cp__input cp__textarea ${errors.message ? 'cp__input--error' : ''}`}
                        />
                      </div>

                      {/* ── Submit ── */}
                      <div className="cp__form-actions">
                        <button type="submit" className="cp__submit">
                          أرسل رسالتك
                          <span className="cp__submit-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="19" y1="12" x2="5" y2="12"/>
                              <polyline points="12 19 5 12 12 5"/>
                            </svg>
                          </span>
                        </button>
                        <span className="cp__form-note">الحقول المطلوبة مُعلّمة بـ <span className="cp__required">*</span></span>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    className="cp__success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="cp__success-icon">
                      <motion.svg
                        width="64" height="64" viewBox="0 0 64 64" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      >
                        <circle cx="32" cy="32" r="28" stroke="var(--emerald)" strokeWidth="2" fill="none" opacity="0.2"/>
                        <motion.path
                          d="M20 32l8 8 16-16"
                          stroke="var(--emerald)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </motion.svg>
                    </div>
                    <h3 className="cp__success-title">تم إرسال رسالتك بنجاح!</h3>
                    <p className="cp__success-body">
                      شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك خلال
                      <strong> 24 ساعة </strong>كحد أقصى.
                    </p>
                    <button
                      className="cp__success-btn"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', company: '', email: '', phone: '', message: '' });
                        setSelectedSector(null);
                      }}
                    >
                      إرسال رسالة أخرى
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── RIGHT: Info side ── */}
            <motion.div
              className="cp__info-col"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {/* Benefits */}
              <div className="cp__benefits">
                <h3 className="cp__benefits-title">لماذا تتواصل معنا؟</h3>
                <div className="cp__benefits-list">
                  {SERVICE_BENEFITS.map((b, i) => (
                    <motion.div
                      key={i}
                      className="cp__benefit"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    >
                      <div className="cp__benefit-icon">{b.icon}</div>
                      <span className="cp__benefit-text">{b.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Offices */}
              <div className="cp__offices">
                <h3 className="cp__offices-title">مكاتبنا</h3>
                <div className="cp__offices-grid">
                  {OFFICES.map(o => (
                    <div key={o.city} className={`cp__office ${o.primary ? 'cp__office--primary' : ''}`}>
                      <div className="cp__office-header">
                        <img src="/images/contact/saudi arabia map.svg" alt="" className="cp__office-map" />
                        <div>
                          <span className="cp__office-city">{o.city}</span>
                          <span className="cp__office-en">{o.en}</span>
                        </div>
                        {o.primary && <span className="cp__office-badge">المقر الرئيسي</span>}
                      </div>
                      <p className="cp__office-address">{o.address}</p>
                      <div className="cp__office-contact">
                        <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="cp__office-link">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {o.phone}
                        </a>
                        <a href={`mailto:${o.email}`} className="cp__office-link">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          {o.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response time */}
              <div className="cp__response-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                نحن نرد على تواصلك معنا خلال&nbsp;<strong>24 ساعة</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
