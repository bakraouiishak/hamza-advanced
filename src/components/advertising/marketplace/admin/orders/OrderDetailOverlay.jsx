import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../../../../lib/api.js';
import { fmtDateTime, fmtMoney, fmtRelative } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import Modal from '../shared/Modal.jsx';
import OrderStatusBadge from './OrderStatusBadge.jsx';

const TRANSITIONS = {
  Pending: ['Accepted', 'Rejected'],
  Accepted: ['Done', 'Rejected'],
  Rejected: [],
  Done: [],
};
const STATUS_LABEL = {
  Pending: 'قيد الانتظار', Accepted: 'مقبول', Done: 'مكتمل', Rejected: 'مرفوض',
};
const PROGRESS = { Pending: 10, Accepted: 40, Done: 100, Rejected: 0 };
const PROGRESS_COLOR = { Pending: '#FEFC4F', Accepted: '#5BD8E8', Done: '#13BD84', Rejected: '#FF7A93' };

export default function OrderDetailOverlay({ orderId, onClose, onChanged, onDeleted }) {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgScope, setMsgScope] = useState(''); // productId, for scoped admin replies
  const [sending, setSending] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    if (!orderId) return;
    let alive = true;
    Promise.all([api.get(`/orders/${orderId}`), api.get('/products?limit=200&page=1')])
      .then(([o, p]) => { if (alive) { setOrder(o); setProducts(p.items || []); } })
      .catch(e => alive && setError(e.message));
    return () => { alive = false; };
  }, [orderId]);

  useEffect(() => { if (chatOpen) chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [order?.messages, chatOpen]);

  const setStatus = async (s) => {
    setBusy(true); setError(null);
    try { const u = await api.patch(`/orders/${orderId}/status`, { status: s }); setOrder(u); onChanged?.(u); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const saveItems = async (items) => {
    setBusy(true); setError(null);
    try {
      const payload = items.map(i => ({ product: i.product._id || i.product.id || i.product, quantity: i.quantity, unitPrice: i.unitPrice ?? null, customDimensions: i.customDimensions || {} }));
      const u = await api.patch(`/orders/${orderId}`, { items: payload }); setOrder(u); onChanged?.(u);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  /* Per-item price quote — uses the dedicated /quote endpoint so the
     payload stays minimal and the customer's chosen quantity is never
     accidentally overwritten. */
  const handleQuote = async (item, value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      setError('قيمة التسعير يجب أن تكون أكبر من 0');
      return;
    }
    if ((item.unitPrice ?? null) === n) return; // no-op
    setBusy(true); setError(null);
    try {
      const updated = await api.patch(
        `/orders/${orderId}/items/${item._id}/quote`,
        { unitPrice: n }
      );
      setOrder(updated);
      onChanged?.(updated);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  /* Admin no longer changes quantities — that's the customer's prerogative
     (via their own order-detail page). Kept as a no-op so any leftover
     references degrade gracefully. */
  const handleQtyChange = () => { };

  const handleRemoveLine = (idx) => {
    if (order.items.length <= 1) { alert('يجب أن يحتوي الطلب على عنصر واحد على الأقل'); return; }
    saveItems(order.items.filter((_, i) => i !== idx));
  };

  const handleAddProduct = (pid) => {
    if (!pid) return;
    const p = products.find(x => (x.id || x._id) === pid);
    if (!p) return;
    let customDimensions = { width: null, height: null, length: null };
    if (p.onDemand) {
      const w = prompt(`عرض "${p.name}" بالسنتيمتر:`);
      const h = prompt(`ارتفاع "${p.name}" بالسنتيمتر:`);
      const l = prompt(`طول "${p.name}" بالسنتيمتر:`);
      const num = v => (v == null || v === '' ? null : Number(v) > 0 ? Number(v) : null);
      customDimensions = { width: num(w), height: num(h), length: num(l) };
      if (!Object.values(customDimensions).some(v => v != null)) { alert('يجب إدخال مقاس واحد على الأقل.'); return; }
    }
    const existIdx = order.items.findIndex(i => (i.product._id || i.product.id || i.product) === pid);
    let items;
    if (existIdx >= 0) { items = [...order.items]; items[existIdx] = { ...items[existIdx], quantity: items[existIdx].quantity + 1 }; }
    else { items = [...order.items, { product: pid, quantity: Math.max(1, p.minimumOrder || 1), unitPrice: p.onDemand ? null : p.price, customDimensions }]; }
    saveItems(items);
  };

  const handleDelete = async () => {
    setBusy(true);
    try { await api.del(`/orders/${orderId}`); onDeleted?.(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const sendMsg = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const r = await api.post(`/orders/${orderId}/messages`, {
        text: msgText.trim(),
        productRef: msgScope || undefined,
      });
      setOrder(p => ({ ...p, messages: r.thread }));
      setMsgText('');
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  };

  // Index products by id so we can label scoped chat bubbles + the
  // "raise scope" button on each item row.
  const productNameById = React.useMemo(() => {
    const m = new Map();
    (order?.items || []).forEach((it) => {
      const id = it.product?._id || it.product?.id || it.product;
      m.set(String(id), it.product?.name || 'منتج');
    });
    return m;
  }, [order]);

  const openChatScoped = (productId) => {
    setMsgScope(productId ? String(productId) : '');
    setChatOpen(true);
  };

  const pct = order ? (PROGRESS[order.status] ?? 0) : 0;
  const pctColor = order ? (PROGRESS_COLOR[order.status] ?? '#F7F0F5') : '#F7F0F5';

  return (
    <Modal open onClose={onClose} title={order ? `طلب #${(order.id || order._id || '').slice(-6).toUpperCase()}` : 'تفاصيل الطلب'} size="xl">
      {error && <div className="adm-form__error">{error}</div>}
      {!order ? <div className="adm-skeleton__bar adm-skeleton__bar--lg" /> : (
        <div className="adm-order-detail">
          {/* Customer + meta */}
          <div className="adm-order-detail__head">
            <div className="adm-customer-card">
              <div className="adm-customer-card__avatar">
                {order.customer?.profileImg ? <img src={order.customer.profileImg} alt="" /> : <span>{order.customer?.name?.[0] || '?'}</span>}
              </div>
              <div>
                <h3>{order.customer ? `${order.customer.name} ${order.customer.surname}` : 'مستخدم محذوف'}</h3>
                <p>{order.customer?.email}</p>
                <p className="adm-customer-card__time">{fmtDateTime(order.createdDate)}</p>
              </div>
            </div>
            <div className="adm-order-detail__meta">
              <OrderStatusBadge status={order.status} />
              <div className="adm-order-detail__total">
                {order.needsQuote ? <span style={{ color: 'rgba(247,240,245,0.55)', fontSize: '0.95rem' }}>في انتظار التسعير</span> : <Price value={order.totalPrice} />}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="adm-progress">
            <div className="adm-progress__bar">
              <div className="adm-progress__fill" style={{ width: `${pct}%`, background: pctColor }} />
            </div>
            <div className="adm-progress__labels">
              <span style={{ color: pctColor }}>{STATUS_LABEL[order.status]}</span>
              <span style={{ color: pctColor }}>{pct}%</span>
            </div>
          </div>

          {order.needsQuote && (
            <div className="adm-form__error" style={{ background: 'rgba(254,252,79,0.08)', borderColor: 'rgba(254,252,79,0.30)', color: 'var(--ad-yellow)' }}>
              ⚠ هذا الطلب يحتوي على منتجات حسب الطلب لم تُسعَّر بعد.
            </div>
          )}

          {/* Status buttons — all 4 */}
          <section className="adm-card">
            <h4 className="adm-card__title">تحديث الحالة</h4>
            <div className="adm-status-btns">
              {['Pending', 'Accepted', 'Done', 'Rejected'].map(s => {
                const allowed = TRANSITIONS[order.status] || [];
                const isCurrent = order.status === s;
                const canTransit = allowed.includes(s);
                return (
                  <button key={s} type="button"
                    className={`adm-status-btn ${isCurrent ? 'is-current' : ''} ${canTransit ? 'is-allowed' : ''} adm-status-btn--${s.toLowerCase()}`}
                    disabled={busy || isCurrent || !canTransit}
                    onClick={() => canTransit && setStatus(s)}>
                    <span className="adm-status-btn__dot" />
                    {STATUS_LABEL[s]}
                    {isCurrent && <span className="adm-status-btn__tag">الحالية</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Items editor */}
          <section className="adm-card">
            <div className="adm-card__head">
              <h4 className="adm-card__title">عناصر الطلب ({order.items.length})</h4>
              <select className="adm-input" value="" onChange={e => { handleAddProduct(e.target.value); e.target.value = ''; }}
                disabled={busy || products.length === 0 || (order.status !== 'Pending' && order.status !== 'Accepted')}>
                <option value="">+ إضافة منتج…</option>
                {products.map(p => <option key={p.id || p._id} value={p.id || p._id}>{p.name} — {p.onDemand ? 'حسب الطلب' : fmtMoney(p.price)}</option>)}
              </select>
            </div>
            <div className="adm-order-items">
              {order.items.map((it, idx) => {
                const isOD = it.product?.onDemand;
                const dims = it.customDimensions || {};
                const dimsLabel = [dims.width, dims.height, dims.length].filter(Boolean).join(' × ');
                const unpriced = it.unitPrice == null;
                const editable = order.status === 'Pending' || order.status === 'Accepted';
                const files = it.designFiles || [];
                const productId = it.product?._id || it.product?.id || it.product;
                return (
                  <article
                    key={it._id || idx}
                    className={`adm-order-item ${unpriced ? 'is-unpriced' : ''}`}
                  >
                    {/* — Top row: thumbnail + name + qty + remove — */}
                    <header className="adm-order-item__head">
                      {it.product?.mainImage && (
                        <span className="adm-order-item__thumb">
                          <img src={it.product.mainImage} alt="" />
                        </span>
                      )}
                      <div className="adm-order-item__name-wrap">
                        <div className="adm-order-item__name-row">
                          <strong className="adm-order-item__name">{it.product?.name || 'منتج محذوف'}</strong>
                          {isOD && <span className="adm-badge adm-badge--yellow" style={{ fontSize: '0.66rem' }}>حسب الطلب</span>}
                        </div>
                        <div className="adm-order-item__meta">
                          <span className="adm-order-item__qty-pill" title="الكمية يتحكم بها العميل">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6" /></svg>
                            الكمية: <strong>{it.quantity}</strong>
                          </span>
                          {dimsLabel && (
                            <span className="adm-order-item__dims" dir="ltr">
                              {dimsLabel} cm
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="adm-btn adm-btn--danger adm-btn--sm"
                        disabled={busy || !editable}
                        onClick={() => handleRemoveLine(idx)}
                      >
                        إزالة
                      </button>
                    </header>

                    {/* — Price row: prominent inline quote input for on-demand
                        OR any unpriced item (admin must quote either way) — */}
                    <div className="adm-order-item__pricing">
                      {(isOD || unpriced) ? (
                        <div className="adm-quote">
                          <label className="adm-quote__label">
                            {unpriced ? 'تسعير الوحدة (مطلوب):' : 'سعر الوحدة:'}
                          </label>
                          <div className="adm-quote__input-wrap">
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              defaultValue={"it.unitPrice ?? ''"}
                              placeholder="أدخل السعر…"
                              disabled={!editable || busy}
                              onBlur={(e) => handleQuote(it, e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                              className="adm-quote__input"
                            />
                            <span className="adm-quote__currency">ر.س</span>
                          </div>
                          <span className="adm-quote__hint">× {it.quantity} = <strong>{unpriced ? '—' : <Price value={it.unitPrice * it.quantity} />}</strong></span>
                        </div>
                      ) : (
                        <div className="adm-order-item__fixed-price">
                          <span>سعر الوحدة:</span>
                          <strong><Price value={it.unitPrice} /></strong>
                          <span className="adm-order-item__sep">×</span>
                          <span>{it.quantity}</span>
                          <span className="adm-order-item__sep">=</span>
                          <strong className="adm-order-item__line-total">
                            <Price value={it.unitPrice * it.quantity} />
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* — Files row — */}
                    <div className="adm-order-item__files">
                      <span className="adm-order-item__files-label">
                        ملفات التصميم ({files.length}/2):
                      </span>
                      {files.length === 0 ? (
                        <span className="adm-order-item__files-empty">العميل لم يرفع ملفات بعد</span>
                      ) : (
                        <div className="adm-item-files adm-item-files--horiz">
                          {files.map((f) => (
                            <a
                              key={f._id}
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              download={f.filename || true}
                              className="adm-item-file"
                              title={f.filename || 'ملف'}
                            >
                              <span className="adm-item-file__ext">{(f.format || '').toUpperCase()}</span>
                              <span className="adm-item-file__name">{f.filename || 'ملف'}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        className="adm-btn adm-btn--sm adm-btn--ghost"
                        style={{ marginInlineStart: 'auto', fontSize: '0.72rem' }}
                        onClick={() => openChatScoped(productId)}
                      >
                        💬 رد عن هذا المنتج
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="adm-form__actions" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="adm-btn adm-btn--danger" onClick={() => setConfirmDel(true)} disabled={busy}>حذف الطلب</button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="adm-btn adm-btn--primary" onClick={() => setChatOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                المحادثة ({(order.messages || []).length})
              </button>
              <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>إغلاق</button>
            </div>
          </div>

          <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title="حذف الطلب">
            <p>هل أنت متأكد من حذف هذا الطلب نهائيًا؟</p>
            <div className="adm-form__actions">
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmDel(false)}>إلغاء</button>
              <button type="button" className="adm-btn adm-btn--danger" onClick={handleDelete} disabled={busy}>تأكيد الحذف</button>
            </div>
          </Modal>
        </div>
      )}

      {/* Chat side panel */}
      {chatOpen && (
        <div className="adm-chat-panel-bg" onClick={() => setChatOpen(false)}>
          <aside className="adm-chat-panel" onClick={e => e.stopPropagation()}>
            <div className="adm-chat-panel__head">
              <h4>المحادثة مع العميل</h4>
              <button type="button" onClick={() => setChatOpen(false)} className="adm-chat-panel__close">✕</button>
            </div>
            <div className="adm-chat-panel__body">
              {(order?.messages || []).length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(247,240,245,0.35)', padding: '2rem 0' }}>
                  لا توجد رسائل بعد.
                </p>
              )}
              {(order?.messages || []).map((m) => {
                const refName = m.productRef ? productNameById.get(String(m.productRef)) : null;
                return (
                  <div key={m._id} className={`co-msg co-msg--${m.sender.toLowerCase()}`}>
                    {refName && <span className="co-msg__ref">{refName}</span>}
                    <div className="co-msg__bubble">{m.text}</div>
                    <span className="co-msg__meta">
                      {m.sender === 'Admin' ? 'أنت (الإدارة)' : 'العميل'} • {fmtRelative(m.sentAt)}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEnd} />
            </div>
            <div className="adm-chat-panel__input">
              {msgScope && (
                <span className="co-chat-input__scope" style={{ marginBottom: 6 }}>
                  <button type="button" onClick={() => setMsgScope('')} aria-label="إلغاء الربط">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                  ردّ عن: {productNameById.get(String(msgScope)) || 'منتج'}
                </span>
              )}
              <input
                placeholder={msgScope ? `ردّ عن "${productNameById.get(String(msgScope))}"…` : 'اكتب ردّك للعميل…'}
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                disabled={sending}
              />
              <button onClick={sendMsg} disabled={sending || !msgText.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
          </aside>
        </div>
      )}
    </Modal>
  );
}
