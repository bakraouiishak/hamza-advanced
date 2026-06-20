import React, { useRef, useState } from 'react';
import { api } from '../../../../../lib/api.js';
import { useAuth } from '../../../../../lib/auth.jsx';

/**
 * PictureTab — avatar upload + remove.
 *
 * Single file, JPG/PNG/WebP/GIF, ≤ 8 MB. Cloudinary downscales server-side
 * to 512×512 with face-aware crop, so the customer's selfie always lands
 * neatly inside the circular avatar slot across the marketplace.
 */
export default function PictureTab() {
  const { user } = useAuth();
  const [me, setMe] = useState(user);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const fileRef = useRef(null);

  const pick = () => fileRef.current?.click();

  const upload = async (file) => {
    if (!file) return;
    setBusy(true); setErr(null); setOk(null);
    try {
      const fd = new FormData();
      fd.append('profileImg', file);
      const updated = await api.post('/account/me/avatar', fd);
      setMe(updated);
      setOk('تم تحديث صورتك الشخصية.');
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (!me.profileImg) return;
    setBusy(true); setErr(null); setOk(null);
    try {
      const updated = await api.del('/account/me/avatar');
      setMe(updated);
      setOk('تمت إزالة الصورة الشخصية.');
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const initial = (me?.name || '?').charAt(0);

  return (
    <div className="acc-pane">
      <header className="acc-pane__head">
        <h2>الصورة الشخصية</h2>
        <p>تظهر صورتك في القائمة العلوية وفي رسائل المحادثة مع فريق الإدارة.</p>
      </header>

      <div className="acc-picture">
        <div className="acc-picture__avatar">
          {me?.profileImg
            ? <img src={me.profileImg} alt="صورتك الحالية" />
            : <span>{initial}</span>}
        </div>

        <div className="acc-picture__actions">
          <button
            type="button"
            className="acc-btn acc-btn--primary"
            onClick={pick}
            disabled={busy}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {me?.profileImg ? 'تغيير الصورة' : 'رفع صورة'}
          </button>
          {me?.profileImg && (
            <button
              type="button"
              className="acc-btn acc-btn--ghost"
              onClick={remove}
              disabled={busy}
            >
              إزالة الصورة
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <p className="acc-picture__hint">
            JPG / PNG / WebP / GIF — حجم أقصى 8 ميجابايت. سيتم إعادة تأطير الصورة تلقائيًا حول الوجه.
          </p>
        </div>
      </div>

      {err && <div className="acc-msg acc-msg--err">{err}</div>}
      {ok && <div className="acc-msg acc-msg--ok">{ok}</div>}
    </div>
  );
}
