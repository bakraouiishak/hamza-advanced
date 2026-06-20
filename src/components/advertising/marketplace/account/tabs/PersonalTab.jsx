import React, { useState } from 'react';
import { api } from '../../../../../lib/api.js';
import { useAuth } from '../../../../../lib/auth.jsx';

/**
 * PersonalTab — name + surname + password change.
 *
 * Two stacked forms:
 *   1. Personal data — name & surname only. Email is read-only (login
 *      identity, deliberately not editable here). Phone/address are
 *      hidden too — out of scope of the user's request.
 *   2. Password — current + new, with show/hide toggle. Backend verifies
 *      the current password via bcrypt before accepting the new one.
 *
 * Both forms have their own loading state, so the user can update one
 * without locking the other.
 */
export default function PersonalTab() {
  const { user } = useAuth();
  return (
    <div className="acc-pane">
      <header className="acc-pane__head">
        <h2>البيانات الشخصية</h2>
        <p>عدّل اسمك أو غيّر كلمة المرور. البريد الإلكتروني هو معرّف تسجيل الدخول ولا يمكن تغييره من هنا.</p>
      </header>

      <NameForm initial={user} />
      <hr className="acc-divider" />
      <PasswordForm />
    </div>
  );
}

function NameForm({ initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [surname, setSurname] = useState(initial?.surname || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const dirty = name.trim() !== (initial?.name || '') || surname.trim() !== (initial?.surname || '');

  const submit = async (e) => {
    e.preventDefault();
    if (!dirty) return;
    setBusy(true); setErr(null); setOk(null);
    try {
      await api.patch('/account/me', { name: name.trim(), surname: surname.trim() });
      setOk('تم حفظ التعديلات.');
      // The navbar greeting reads from useAuth().user, which is hydrated on
      // mount — a one-time hard refresh would be needed to update it, but
      // we keep the page-level state correct so the sidebar updates.
      Object.assign(initial, { name: name.trim(), surname: surname.trim() });
    } catch (e2) { setErr(e2.message); }
    finally { setBusy(false); }
  };

  return (
    <form className="acc-form" onSubmit={submit}>
      <h3 className="acc-form__title">الاسم</h3>
      <div className="acc-form__row">
        <label className="acc-field">
          <span>الاسم</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            required
          />
        </label>
        <label className="acc-field">
          <span>اللقب</span>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            maxLength={60}
            required
          />
        </label>
      </div>
      <label className="acc-field acc-field--locked">
        <span>البريد الإلكتروني</span>
        <input type="email" value={initial?.email || ''} disabled readOnly />
        <span className="acc-field__lock">لا يمكن تغييره</span>
      </label>

      {err && <div className="acc-msg acc-msg--err">{err}</div>}
      {ok && <div className="acc-msg acc-msg--ok">{ok}</div>}

      <div className="acc-form__actions">
        <button
          type="submit"
          className="acc-btn acc-btn--primary"
          disabled={busy || !dirty}
        >
          {busy ? 'جارٍ الحفظ…' : 'حفظ التعديلات'}
        </button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null); setOk(null);
    if (next.length < 8) { setErr('كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.'); return; }
    if (next !== confirm) { setErr('كلمتا المرور الجديدتان غير متطابقتين.'); return; }
    setBusy(true);
    try {
      await api.patch('/account/me/password', { currentPassword: current, newPassword: next });
      setOk('تم تحديث كلمة المرور بنجاح.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e2) { setErr(e2.message); }
    finally { setBusy(false); }
  };

  return (
    <form className="acc-form" onSubmit={submit}>
      <div className="acc-form__title-row">
        <h3 className="acc-form__title">كلمة المرور</h3>
        <button
          type="button"
          className="acc-form__toggle"
          onClick={() => setShow((v) => !v)}
        >
          {show ? 'إخفاء' : 'إظهار'}
        </button>
      </div>

      <label className="acc-field">
        <span>كلمة المرور الحالية</span>
        <input
          type={show ? 'text' : 'password'}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <div className="acc-form__row">
        <label className="acc-field">
          <span>كلمة المرور الجديدة</span>
          <input
            type={show ? 'text' : 'password'}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label className="acc-field">
          <span>تأكيد كلمة المرور</span>
          <input
            type={show ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      </div>

      {err && <div className="acc-msg acc-msg--err">{err}</div>}
      {ok && <div className="acc-msg acc-msg--ok">{ok}</div>}

      <div className="acc-form__actions">
        <button
          type="submit"
          className="acc-btn acc-btn--primary"
          disabled={busy || !current || !next || !confirm}
        >
          {busy ? 'جارٍ التحديث…' : 'تحديث كلمة المرور'}
        </button>
      </div>
    </form>
  );
}
