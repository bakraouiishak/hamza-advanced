import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../../lib/api.js';
import { fmtDateTime, fmtRelative } from '../../../../lib/format.js';
import Price from '../Price.jsx';
import CheckoutView from './CheckoutView.jsx';

/* ── Status pill (4 statuses) ────────────────────────────────────────── */
const STATUS = {
  Pending:  { bg: 'rgba(254,252,79,0.14)', fg: '#FEFC4F', label: 'قيد الانتظار' },
  Accepted: { bg: 'rgba(91,216,232,0.14)', fg: '#5BD8E8', label: 'مقبول' },
  Done:     { bg: 'rgba(19,189,132,0.16)', fg: '#13BD84', label: 'مكتمل' },
  Rejected: { bg: 'rgba(255,122,147,0.14)', fg: '#FF7A93', label: 'مرفوض' },
};
function StatusBadge({ status }) {
  const t = STATUS[status] || { bg: 'rgba(247,240,245,0.10)', fg: '#F7F0F5', label: status };
  return (
    <span className="co-status" style={{ background: t.bg, color: t.fg, borderColor: t.fg + '44' }}>
      <span className="co-status__dot" style={{ background: t.fg }} />
      {t.label}
    </span>
  );
}

/* ── 4-stage progress stepper ────────────────────────────────────────── */
const HAPPY_PATH = ['Pending', 'Accepted', 'Done'];
function Stepper({ status }) {
  const rejected = status === 'Rejected';
  const idx = HAPPY_PATH.indexOf(status);

  return (
    <div className={`co-stepper ${rejected ? 'is-rejected' : ''}`}>
      {HAPPY_PATH.map((key, i) => {
        const done = !rejected && (i < idx || (i === idx && status === 'Done'));
        const active = !rejected && i === idx;
        return (
          <React.Fragment key={key}>
            <div className={`co-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
              <span className="co-step__bullet">{done ? '✓' : (i + 1)}</span>
              <span className="co-step__label">{STATUS[key].label}</span>
              {key === 'Pending'  && <span className="co-step__hint">في انتظار مراجعة الإدارة</span>}
              {key === 'Accepted' && <span className="co-step__hint">قيد التنفيذ</span>}
              {key === 'Done'     && <span className="co-step__hint">تم التسليم</span>}
            </div>
            {i < HAPPY_PATH.length - 1 && (
              <span className={`co-step-line ${done ? 'is-filled' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
      {rejected && (
        <div className="co-step is-rejected-step">
          <span className="co-step__bullet">×</span>
          <span className="co-step__label">مرفوض</span>
          <span className="co-step__hint">لم يُقبل الطلب</span>
        </div>
      )}
    </div>
  );
}

/* ── Per-item design files manager (upload / remove) ──────────────────── */
function ItemFiles({ orderId, item, terminal, onUpdate }) {
  const fileSlots = [0, 1];
  const current = item.designFiles || [];
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      const r = await api.post(`/orders/${orderId}/items/${item._id}/design-files`, fd);
      onUpdate?.(item._id, r.designFiles);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (fileId) => {
    setBusy(true);
    try {
      const r = await api.del(`/orders/${orderId}/items/${item._id}/design-files/${fileId}`);
      onUpdate?.(item._id, r.designFiles);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="co-item-files">
      {fileSlots.map((slot) => {
        const f = current[slot];
        if (f) {
          return (
            <div key={slot} className="co-file is-filled">
              <span className="co-file__ext">{(f.format || '').toUpperCase()}</span>
              <div className="co-file__body">
                <strong className="co-file__name" title={f.filename}>{f.filename || `ملف ${slot + 1}`}</strong>
                <span className="co-file__size">
                  {f.sizeBytes ? `${Math.round(f.sizeBytes / 1024)} KB` : ''}
                </span>
              </div>
              <a href={f.url} target="_blank" rel="noreferrer" className="co-file__dl" title="تحميل">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              {!terminal && (
                <button type="button" className="co-file__x" disabled={busy} onClick={() => remove(f._id)} aria-label="إزالة">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          );
        }
        if (terminal) {
          return <div key={slot} className="co-file is-disabled"><span style={{ fontSize: '0.78rem', color: 'rgba(247,240,245,0.35)' }}>—</span></div>;
        }
        return (
          <label key={slot} className="co-file co-file__drop">
            <input
              type="file"
              accept=".svg,.eps,.pdf,.ai,application/postscript,application/pdf,image/svg+xml"
              disabled={busy}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>{busy ? 'جارٍ الرفع…' : `ارفع ملفًا ${slot + 1}`}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Single order detail (overlay) ────────────────────────────────────── */
function OrderDetail({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [msgScope, setMsgScope] = useState('');  // '' = general, productId = scoped
  const [sending, setSending] = useState(false);
  const chatEnd = useRef(null);

  const load = () => api.get(`/orders/${orderId}`).then(setOrder).catch((e) => setErr(e.message));
  useEffect(() => { if (orderId) load(); }, [orderId]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [order?.messages]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const terminal = order && (order.status === 'Done' || order.status === 'Rejected');

  const sendMsg = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const r = await api.post(`/orders/${orderId}/messages`, {
        text: msgText.trim(),
        productRef: msgScope || undefined,
      });
      setOrder((p) => ({ ...p, messages: r.thread }));
      setMsgText('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSending(false);
    }
  };

  /* Customer can change qty until the order is in a terminal state. The
     backend enforces minimumOrder so the UI doesn't need a min-side guard. */
  const updateQty = async (itemId, newQty) => {
    if (!Number.isFinite(newQty) || newQty < 1) return;
    try {
      const updated = await api.patch(`/orders/${orderId}/items/${itemId}/quantity`, { quantity: newQty });
      setOrder(updated);
    } catch (e) {
      setErr(e.message);
    }
  };

  const onItemFilesUpdate = (itemId, designFiles) => {
    setOrder((prev) => prev && ({
      ...prev,
      items: prev.items.map((it) => it._id === itemId ? { ...it, designFiles } : it),
    }));
  };

  // Index products by id so we can label scoped chat bubbles
  const productNameById = useMemo(() => {
    const m = new Map();
    (order?.items || []).forEach((it) => {
      const id = it.product?._id || it.product?.id || it.product;
      m.set(String(id), it.product?.name || 'منتج');
    });
    return m;
  }, [order]);

  return (
    <div className="co-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="co-detail" onClick={(e) => e.stopPropagation()}>
        {err && <div className="co-error">{err}</div>}
        {!order ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(247,240,245,0.45)' }}>جارٍ التحميل…</div>
        ) : (
          <>
            <div className="co-detail__head">
              <div>
                <span className="co-eyebrow">طلب</span>
                <h2>#{(order.id || order._id || '').slice(-6).toUpperCase()}</h2>
                <div className="co-detail__head-meta">{fmtDateTime(order.createdDate)}</div>
              </div>
              <StatusBadge status={order.status} />
              <button type="button" className="co-detail__close-btn" onClick={onClose} aria-label="إغلاق">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <Stepper status={order.status} />

            {order.needsQuote && (
              <div className="co-quote-banner">⏳ في انتظار تسعير الإدارة للمنتجات حسب الطلب — ستصلك إشعارات فور وصول التسعير.</div>
            )}

            {/* Per-item — name, qty, price, files, scoped chat opener */}
            <div className="co-section-card">
              <h4 className="co-section-card__title">عناصر الطلب ({(order.items || []).length})</h4>
              <div className="co-items">
                {(order.items || []).map((it) => (
                  <div key={it._id} className="co-item-detail">
                    <div className="co-item-detail__head">
                      <div className="co-item-detail__thumb">
                        {it.product?.mainImage && <img src={it.product.mainImage} alt="" />}
                      </div>
                      <div className="co-item-detail__body">
                        <strong className="co-item-detail__name">{it.product?.name || 'منتج'}</strong>
                        <div className="co-item-detail__meta">
                          {/* Quantity stepper — editable until the order is closed */}
                          {terminal ? (
                            <span>× {it.quantity}</span>
                          ) : (
                            <span className="co-qty co-qty--inline" title="عدّل الكمية">
                              <button
                                type="button"
                                onClick={() => updateQty(it._id, it.quantity - 1)}
                                disabled={it.quantity <= (it.product?.minimumOrder || 1)}
                                aria-label="إنقاص"
                              >−</button>
                              <span>{it.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(it._id, it.quantity + 1)}
                                aria-label="زيادة"
                              >+</button>
                            </span>
                          )}
                          {it.unitPrice != null
                            ? <span>• <Price value={it.unitPrice} /></span>
                            : <span style={{ color: 'var(--ad-yellow)' }}>• بانتظار التسعير</span>}
                          {it.product?.onDemand && it.customDimensions && (() => {
                            const d = it.customDimensions;
                            const filled = ['width', 'height', 'length'].filter((k) => d[k] && Number(d[k]) > 0);
                            if (filled.length === 0) return null;
                            return (
                              <span dir="ltr" style={{ color: 'rgba(247,240,245,0.55)', fontSize: '0.78rem' }}>
                                • {filled.map((k) => d[k]).join(' × ')} cm
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="co-item-detail__price">
                        {it.unitPrice != null ? <Price value={it.unitPrice * it.quantity} /> : '—'}
                      </div>
                    </div>
                    <div className="co-item-detail__files-head">
                      <span>ملفات التصميم ({(it.designFiles || []).length}/2)</span>
                      <button
                        type="button"
                        className="co-item-detail__chat-btn"
                        onClick={() => setMsgScope(String(it.product?._id || it.product?.id || it.product))}
                        title="إرسال رسالة عن هذا المنتج"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                        </svg>
                        راسل الإدارة عن هذا المنتج
                      </button>
                    </div>
                    <ItemFiles orderId={orderId} item={it} terminal={terminal} onUpdate={onItemFilesUpdate} />
                  </div>
                ))}
              </div>
            </div>

            <div className="co-detail__total">
              <span className="co-detail__total-label">الإجمالي</span>
              <span className="co-detail__total-value">
                {order.needsQuote ? 'في انتظار التسعير' : <Price value={order.totalPrice} size="lg" />}
              </span>
            </div>

            {/* Chat — bubbles labelled with product name if productRef set */}
            <div className="co-section-card">
              <h4 className="co-section-card__title">
                المحادثة مع الإدارة
                <span style={{ fontSize: '0.74rem', color: 'rgba(247,240,245,0.50)', fontWeight: 500, marginInlineStart: 8 }}>
                  ({(order.messages || []).length} رسالة)
                </span>
              </h4>
              <div className="co-chat">
                {(order.messages || []).length === 0 && (
                  <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(247,240,245,0.35)', padding: '1rem 0' }}>
                    لا توجد رسائل بعد.
                  </p>
                )}
                {(order.messages || []).map((m) => {
                  const refName = m.productRef ? productNameById.get(String(m.productRef)) : null;
                  return (
                    <div key={m._id} className={`co-msg co-msg--${m.sender.toLowerCase()}`}>
                      {refName && (
                        <span className="co-msg__ref">{refName}</span>
                      )}
                      <div className="co-msg__bubble">{m.text}</div>
                      <span className="co-msg__meta">
                        {m.sender === 'Admin' ? 'الإدارة' : 'أنت'} • {fmtRelative(m.sentAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEnd} />
              </div>
              <div className="co-chat-input">
                {msgScope && (
                  <span className="co-chat-input__scope" title="انقر لإلغاء الربط بالمنتج">
                    <button type="button" onClick={() => setMsgScope('')} aria-label="إلغاء">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                    عن: {productNameById.get(String(msgScope)) || 'منتج'}
                  </span>
                )}
                <input
                  className="co-chat-input__field"
                  placeholder={msgScope ? `رسالة عن "${productNameById.get(String(msgScope))}"…` : 'اكتب رسالتك للإدارة…'}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  disabled={sending}
                />
                <button className="co-chat-input__send" onClick={sendMsg} disabled={sending || !msgText.trim()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════ */
export default function CustomerOrdersView() {
  const [params, setParams] = useSearchParams();
  const initialMode = params.get('checkout') === '1' ? 'checkout' : 'list';
  const initialOpen = params.get('id') || null;
  const [view, setView] = useState(initialMode);
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState(null);
  const [openId, setOpenId] = useState(initialOpen);

  const load = async () => {
    try {
      const d = await api.get('/orders?limit=200&page=1');
      setOrders(d.items || []);
    } catch (e) { setErr(e.message); }
  };
  useEffect(() => { if (view === 'list') load(); }, [view]);

  const onOrderCreated = (o) => {
    const oid = o.id || o._id;
    setView('list');
    setOpenId(oid);
    setParams({ id: oid });
  };

  const chev = <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2L4 6l4 4" /></svg>;

  return (
    <section className="co-section">
      <div className="co-inner">
        <nav className="co-breadcrumb">
          <Link to="/sectors/advertising/marketplace">المتجر</Link>{chev}
          <span>{view === 'checkout' ? 'إتمام الطلب' : 'طلباتي'}</span>
        </nav>

        {view === 'checkout' ? (
          <CheckoutView onOrderCreated={onOrderCreated} />
        ) : (
          <>
            <div className="co-header">
              <h1 className="co-header__title">طلباتي</h1>
              <p className="co-header__sub">تتبع حالة طلباتك وراسل الإدارة في أي وقت.</p>
            </div>
            {err && <div className="co-error" style={{ marginBottom: '1rem' }}>{err}</div>}
            {orders === null ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(247,240,245,0.45)' }}>جارٍ التحميل…</div>
            ) : orders.length === 0 ? (
              <div className="co-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11V7a3 3 0 016 0v4" />
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                </svg>
                <p className="co-empty__title">لا توجد طلبات بعد</p>
                <p className="co-empty__hint">ابدأ بإضافة منتج إلى السلة وأرسل أول طلب لك.</p>
                <Link to="/sectors/advertising/marketplace/products" className="co-empty__cta">
                  تصفّح المنتجات
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="co-grid-cards">
                {orders.map((o) => (
                  <article key={o.id || o._id} className="co-card" onClick={() => { setOpenId(o.id || o._id); setParams({ id: o.id || o._id }); }}>
                    <div className="co-card__head">
                      <span className="co-card__id">#{(o.id || o._id || '').slice(-6).toUpperCase()}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="co-card__items">
                      {(o.items || []).slice(0, 4).map((it, i) => (
                        <div key={i} className="co-card__thumb">
                          {it.product?.mainImage && <img src={it.product.mainImage} alt="" />}
                        </div>
                      ))}
                      {(o.items || []).length > 4 && <div className="co-card__more">+{o.items.length - 4}</div>}
                    </div>
                    <div className="co-card__row"><span>المنتجات</span><strong>{(o.items || []).length}</strong></div>
                    <div className="co-card__row"><span>الإجمالي</span>
                      <strong className="co-price">
                        {o.needsQuote ? 'بانتظار التسعير' : <Price value={o.totalPrice} />}
                      </strong>
                    </div>
                    <div className="co-card__row"><span>التاريخ</span><span>{fmtRelative(o.createdDate)}</span></div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {openId && <OrderDetail orderId={openId} onClose={() => { setOpenId(null); setParams({}); load(); }} />}
      </div>
    </section>
  );
}
