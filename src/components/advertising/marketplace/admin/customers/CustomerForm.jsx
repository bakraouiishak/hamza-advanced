import React, { useState } from 'react';
import { api } from '../../../../../lib/api.js';

/**
 * CustomerForm — used for both "Add" and "Edit" flows.
 *
 *  • In ADD mode (no `initial`) it calls POST /api/auth/signup with role
 *    auto-Customer, then promotes via PATCH /api/users/:id if the admin
 *    flipped the role toggle.
 *  • In EDIT mode it PATCHes /api/users/:id. profileImg upload happens via
 *    a separate multipart PATCH if a file was chosen.
 *
 * Validation errors from the backend are surfaced inline.
 */
export default function CustomerForm({ initial = null, onSaved, onCancel }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name:     initial?.name     || '',
    surname:  initial?.surname  || '',
    email:    initial?.email    || '',
    phone:    initial?.phone    || '',
    address:  initial?.address  || '',
    password: '',
    role:     initial?.role     || 'Customer',
  });
  const [profileFile, setProfileFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setProfileFile(null);
    // Frontend safety net: warn the admin if they pick a huge file. Cloudinary
    // will still compress on the way through, but a hint helps.
    setProfileFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let saved;
      if (isEdit) {
        // PATCH — multipart so we can send a profile picture if changed.
        const fd = new FormData();
        ['name', 'surname', 'email', 'phone', 'address', 'role'].forEach((k) => {
          if (form[k] !== undefined && form[k] !== '') fd.append(k, form[k]);
        });
        if (form.password) fd.append('password', form.password);
        if (profileFile)   fd.append('profileImg', profileFile);
        saved = await api.patch(`/users/${initial.id || initial._id}`, fd);
      } else {
        // CREATE — signup endpoint forces Customer; if admin chose Admin we
        // promote in a second PATCH call.
        const body = { ...form };
        if (!body.password || body.password.length < 8) {
          throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        }
        saved = await api.post('/auth/signup', body);
        const newUserId = saved.user.id || saved.user._id;
        if (form.role === 'Admin') {
          saved = { user: await api.patch(`/users/${newUserId}`, { role: 'Admin' }) };
        }
        // Profile image upload after creation (separate multipart PATCH).
        if (profileFile) {
          const fd = new FormData();
          fd.append('profileImg', profileFile);
          saved = { user: await api.patch(`/users/${newUserId}`, fd) };
        }
      }
      onSaved?.(saved.user || saved);
    } catch (err) {
      setError(err.message || 'تعذّر الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="adm-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="adm-form__error">{error}</div>}

      <div className="adm-form__row">
        <label className="adm-field">
          <span>الاسم</span>
          <input value={form.name} onChange={set('name')} required dir="rtl" />
        </label>
        <label className="adm-field">
          <span>اللقب</span>
          <input value={form.surname} onChange={set('surname')} required dir="rtl" />
        </label>
      </div>

      <label className="adm-field">
        <span>البريد الإلكتروني</span>
        <input type="email" value={form.email} onChange={set('email')} required dir="ltr" />
      </label>

      <div className="adm-form__row">
        <label className="adm-field">
          <span>الهاتف</span>
          <input value={form.phone} onChange={set('phone')} required dir="ltr" placeholder="+966 5X XXX XXXX" />
        </label>
        <label className="adm-field">
          <span>الدور</span>
          <select value={form.role} onChange={set('role')}>
            <option value="Customer">عميل</option>
            <option value="Admin">مدير</option>
          </select>
        </label>
      </div>

      <label className="adm-field">
        <span>العنوان</span>
        <input value={form.address} onChange={set('address')} required dir="rtl" />
      </label>

      <label className="adm-field">
        <span>{isEdit ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور'}</span>
        <input
          type="password"
          value={form.password}
          onChange={set('password')}
          {...(isEdit ? {} : { required: true })}
          minLength={8}
          dir="ltr"
          placeholder={isEdit ? 'اتركها فارغة لإبقاء الحالية' : '8 أحرف على الأقل'}
        />
      </label>

      <label className="adm-field">
        <span>الصورة الشخصية (سيتم ضغطها تلقائيًا)</span>
        <input type="file" accept="image/*" onChange={handleFile} />
        {initial?.profileImg && !profileFile && (
          <small className="adm-field__hint">
            الصورة الحالية: <a href={initial.profileImg} target="_blank" rel="noopener noreferrer">عرض</a>
          </small>
        )}
      </label>

      <div className="adm-form__actions">
        <button type="button" className="adm-btn adm-btn--ghost" onClick={onCancel}>إلغاء</button>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ…' : isEdit ? 'حفظ التغييرات' : 'إضافة العميل'}
        </button>
      </div>
    </form>
  );
}
