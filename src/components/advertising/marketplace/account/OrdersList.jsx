import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../lib/api.js';
import { fmtDateTime } from '../../../../lib/format.js';
import Price from '../Price.jsx';

/**
 * OrdersList — reused by ActiveOrdersTab + HistoryTab.
 *
 * Props:
 *  • statuses — array of statuses to include (e.g. ['Pending','Accepted'])
 *  • empty    — { title, hint } shown when there are no rows
 *  • action   — 'cancel' | 'delete' — controls which destructive button
 *               renders on each row, and the confirmation copy.
 *
 * Behaviour
 * ─────────
 * Both "cancel" (Active tab) and "delete" (History tab) now hit the SAME
 * backend endpoint: DELETE /api/account/orders/:id. The cancel flow used
 * to flip status → Rejected, but the customer's actual intent is the same
 * in both cases: get it out of my list. One endpoint, one mental model.
 *
 * After the confirm click we mark the row as fading, wait for the CSS
 * transition to finish, then drop it from local state — so the user gets
 * a gentle visual confirmation that the action completed.
 */
const STATUS_LABEL = {
  Pending:  'قيد الانتظار',
  Accepted: 'مقبول',
  Done:     'مكتمل',
  Rejected: 'مرفوض',
};
const STATUS_COLOR = {
  Pending:  '#FEFC4F',
  Accepted: '#5BD8E8',
  Done:     '#13BD84',
  Rejected: '#FF7A93',
};

/* Order JSON comes back from /api/orders with `id` (not `_id`) because of
   the model's toJSON transform. Reading `_id` blindly was the source of
   the "Invalid _id: undefined" bug — every call to /account/orders/:id
   was sending the string "undefined" as the id. */
const idOf = (o) => o?.id || o?._id || null;

/* CSS-side fade duration — keep in sync with `.acc-orders__row.is-fading`
   transition timing in advertising-marketplace-account.css. */
const FADE_MS = 320;

export default function OrdersList({ statuses, empty, action }) {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState(null);
  const [confirming, setConfirming] = useState(null); // orderId being confirmed
  const [busyId, setBusyId] = useState(null);
  const [fadingId, setFadingId] = useState(null);     // orderId fading out

  useEffect(() => {
    let alive = true;
    api.get('/orders?limit=200')
      .then((res) => { if (alive) setOrders(res.items || []); })
      .catch((e) => alive && setErr(e.message));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return null;
    const set = new Set(statuses);
    return orders.filter((o) => set.has(o.status));
  }, [orders, statuses]);

  /* Single delete pathway — used by both "cancel" (Pending) and "delete"
     (Done/Rejected). The backend enforces which statuses are allowed. */
  const performDelete = async (orderId) => {
    if (!orderId) {
      // Defensive: never make a network call with a falsy id, even if
      // upstream state somehow regresses.
      setErr('معرّف الطلب مفقود — أعِد تحميل الصفحة.');
      return;
    }
    setBusyId(orderId); setErr(null);
    try {
      await api.del(`/account/orders/${orderId}`);
      setConfirming(null);
      // Trigger fade animation; remove from list after it finishes.
      setFadingId(orderId);
      setTimeout(() => {
        setOrders((prev) => (prev || []).filter((o) => idOf(o) !== orderId));
        setFadingId(null);
      }, FADE_MS);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (err) return <div className="acc-msg acc-msg--err">{err}</div>;
  if (!filtered) return <div className="acc-card acc-card--skel" style={{ height: 180 }} />;
  if (filtered.length === 0) {
    return (
      <div className="acc-empty">
        <strong>{empty.title}</strong>
        <p>{empty.hint}</p>
        <Link to="/sectors/advertising/marketplace/products" className="acc-cta">
          تصفّح المتجر
        </Link>
      </div>
    );
  }

  return (
    <ul className="acc-orders">
      {filtered.map((o) => {
        const oid = idOf(o);
        const idShort = (oid || '').slice(-6).toUpperCase();
        const items = o.items || [];
        const firstFew = items.slice(0, 3);
        const extra = items.length - firstFew.length;
        const cancellable = action === 'cancel' && o.status === 'Pending';
        const deletable = action === 'delete' && (o.status === 'Done' || o.status === 'Rejected');
        const isConfirming = confirming === oid;
        const busy = busyId === oid;
        const isFading = fadingId === oid;

        return (
          <li
            key={oid}
            className={`acc-orders__row ${isFading ? 'is-fading' : ''}`}
          >
            <div className="acc-orders__main">
              <div className="acc-orders__head">
                <strong>طلب #{idShort}</strong>
                <span
                  className="acc-orders__status"
                  style={{ color: STATUS_COLOR[o.status], borderColor: STATUS_COLOR[o.status] }}
                >
                  <span className="acc-orders__dot" style={{ background: STATUS_COLOR[o.status] }} />
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <span className="acc-orders__time">{fmtDateTime(o.createdDate)}</span>

              <div className="acc-orders__thumbs">
                {firstFew.map((it, idx) => (
                  <span key={idx} className="acc-orders__thumb">
                    {it.product?.mainImage
                      ? <img src={it.product.mainImage} alt={it.product?.name || ''} />
                      : <span>—</span>}
                  </span>
                ))}
                {extra > 0 && <span className="acc-orders__thumb-extra">+{extra}</span>}
              </div>
            </div>

            <div className="acc-orders__side">
              <span className="acc-orders__total">
                {o.needsQuote
                  ? <em>قيد التسعير</em>
                  : <Price value={o.totalPrice} />}
              </span>

              <div className="acc-orders__actions">
                <Link
                  to="/sectors/advertising/marketplace/orders"
                  state={{ openOrderId: oid }}
                  className="acc-btn acc-btn--ghost acc-btn--sm"
                >
                  التفاصيل
                </Link>

                {cancellable && !isConfirming && (
                  <button
                    type="button"
                    className="acc-btn acc-btn--danger acc-btn--sm"
                    onClick={() => setConfirming(oid)}
                    disabled={busy || isFading}
                  >
                    إلغاء الطلب
                  </button>
                )}
                {deletable && !isConfirming && (
                  <button
                    type="button"
                    className="acc-btn acc-btn--danger acc-btn--sm"
                    onClick={() => setConfirming(oid)}
                    disabled={busy || isFading}
                  >
                    حذف
                  </button>
                )}

                {isConfirming && (
                  <div className="acc-orders__confirm">
                    <span>{action === 'cancel' ? 'تأكيد الإلغاء؟' : 'تأكيد الحذف نهائيًا؟'}</span>
                    <button
                      type="button"
                      className="acc-btn acc-btn--danger acc-btn--sm"
                      onClick={() => performDelete(oid)}
                      disabled={busy}
                    >
                      {busy ? '…' : 'تأكيد'}
                    </button>
                    <button
                      type="button"
                      className="acc-btn acc-btn--ghost acc-btn--sm"
                      onClick={() => setConfirming(null)}
                      disabled={busy}
                    >
                      تراجع
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
