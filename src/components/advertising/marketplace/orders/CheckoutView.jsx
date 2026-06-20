import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../../../lib/api.js';
import { useCart } from '../../../../lib/cart.jsx';
import Price from '../Price.jsx';

/**
 * CheckoutView — cart finalization with per-product 2-file upload + description.
 *
 * Layout (RTL):
 *   ┌──────────────────────────┬──────────────────────────┐
 *   │  Right panel: cart list  │  Left panel: details of  │
 *   │  (click a row to focus)  │  the selected product —  │
 *   │                          │  2 file slots + textarea │
 *   └──────────────────────────┴──────────────────────────┘
 *   Bottom summary bar with "طلب المنتجات" CTA.
 *
 * Submission flow:
 *   1. POST /api/orders with items + per-item description
 *      (server converts descriptions into Customer chat messages tagged
 *      with productRef)
 *   2. For each cart row that has files staged, POST them to
 *      /api/orders/:id/items/:itemId/design-files
 *   3. Clear the cart, route the user to /orders/:id (single order detail)
 */
export default function CheckoutView({ onOrderCreated }) {
  const { items, updateQty, removeItem, clear } = useCart();

  // Per-product transient state — keyed by productId in the cart.
  const [dims, setDims] = useState({});         // productId -> { width, height, length }
  const [files, setFiles] = useState({});       // productId -> [File, File]
  const [descriptions, setDescriptions] = useState({}); // productId -> string

  const [selectedId, setSelectedId] = useState(items[0] ? (items[0].product.id || items[0].product._id) : null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const pid = (p) => p?.id || p?._id;
  const selected = useMemo(
    () => items.find((it) => pid(it.product) === selectedId) || items[0] || null,
    [items, selectedId]
  );

  // ── Per-product helpers ──────────────────────────────────────────────
  const updateFile = (productId, slot /* 0|1 */, file) => {
    setFiles((prev) => {
      const cur = [...(prev[productId] || [])];
      cur[slot] = file || undefined;
      // Trim trailing empties so the array stays compact.
      while (cur.length && !cur[cur.length - 1]) cur.pop();
      return { ...prev, [productId]: cur };
    });
  };
  const setDim = (productId, key, value) => {
    setDims((prev) => ({ ...prev, [productId]: { ...(prev[productId] || {}), [key]: value } }));
  };
  const setDesc = (productId, text) => {
    setDescriptions((prev) => ({ ...prev, [productId]: text }));
  };

  // ── Validation ───────────────────────────────────────────────────────
  const validation = useMemo(() => {
    const errors = [];
    for (const it of items) {
      const id = pid(it.product);
      const p = it.product;
      if (p.onDemand) {
        const d = dims[id] || {};
        const filled = ['width', 'height', 'length'].filter((k) => d[k] && Number(d[k]) > 0);
        if (filled.length === 0) {
          errors.push(`${p.name}: يلزم إدخال مقاس واحد على الأقل (للمنتجات حسب الطلب).`);
        }
      }
      if (it.quantity < (p.minimumOrder || 1)) {
        errors.push(`${p.name}: الحد الأدنى للطلب هو ${p.minimumOrder} قطعة.`);
      }
    }
    return errors;
  }, [items, dims]);

  const canSubmit = items.length > 0 && validation.length === 0 && !submitting;

  // ── Submit ───────────────────────────────────────────────────────────
  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      // 1. Create the order with descriptions piped through as productRef messages.
      const payload = items.map((it) => {
        const id = pid(it.product);
        const desc = (descriptions[id] || '').trim();
        const line = { product: id, quantity: it.quantity };
        if (it.product.onDemand) line.customDimensions = dims[id] || {};
        if (desc) line.description = desc;
        return line;
      });
      const order = await api.post('/orders', { items: payload });
      const orderId = order.id || order._id;

      // 2. Upload files PER item, matching the freshly-created order items
      //    by product id (server-side items[] preserves the request order).
      for (const orderItem of order.items || []) {
        const productId = String(orderItem.product?._id || orderItem.product?.id || orderItem.product);
        const staged = files[productId] || [];
        const concrete = staged.filter(Boolean);
        if (concrete.length === 0) continue;
        const fd = new FormData();
        concrete.forEach((f) => fd.append('files', f));
        try {
          await api.post(`/orders/${orderId}/items/${orderItem._id}/design-files`, fd);
        } catch (e) {
          // Don't fail the whole order on a per-file upload error — just
          // surface it gently. The customer can re-upload from the order
          // detail page later.
          console.warn('[checkout] file upload failed for', productId, e);
        }
      }

      clear();
      onOrderCreated?.(order);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('تعذّر إرسال الطلب. حاول مجددًا.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="co-page">
        <div className="co-empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2 className="co-empty__title">السلّة فارغة</h2>
          <p className="co-empty__hint">ابدأ بتصفّح المنتجات لإضافتها إلى السلّة.</p>
          <Link to="/sectors/advertising/marketplace/products" className="co-empty__cta">
            تصفّح المنتجات
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <header className="co-page__head">
        <span className="co-eyebrow">إتمام الطلب</span>
        <h1 className="co-page__title">جهّز <span className="co-hl">{items.length}</span> منتج لإرساله إلى الإدارة</h1>
        <p className="co-page__sub">
          اختر منتجًا من السلّة لإضافة ملفات التصميم الخاصة به (حتى ملفين)
          وكتابة ملاحظاتك للإدارة. عند الانتهاء اضغط "طلب المنتجات".
        </p>
      </header>

      {error && <div className="co-error">⚠ {error}</div>}

      <div className="co-grid">
        {/* RTL start (visual right) — cart list */}
        <aside className="co-list">
          <div className="co-list__head">
            <h3>سلّتك</h3>
            <button type="button" className="co-list__clear" onClick={clear}>إفراغ السلة</button>
          </div>
          <ul className="co-list__items">
            {items.map((it) => {
              const id = pid(it.product);
              const isSel = id === pid(selected?.product);
              const fcount = (files[id] || []).filter(Boolean).length;
              const desc = (descriptions[id] || '').trim();
              const dimReady = !it.product.onDemand || (() => {
                const d = dims[id] || {};
                return ['width', 'height', 'length'].some((k) => d[k] && Number(d[k]) > 0);
              })();
              return (
                <li
                  key={id}
                  className={`co-list-row ${isSel ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(id)}
                >
                  <span className="co-list-row__thumb">
                    {it.product.mainImage && <img src={it.product.mainImage} alt="" />}
                  </span>
                  <div className="co-list-row__body">
                    <strong className="co-list-row__name">{it.product.name}</strong>
                    <div className="co-list-row__meta">
                      <span>× {it.quantity}</span>
                      <span className="co-list-row__sep" />
                      {it.product.onDemand
                        ? <span style={{ color: 'var(--ad-yellow)' }}>حسب الطلب</span>
                        : <Price value={it.product.price} />}
                    </div>
                    <div className="co-list-row__indicators">
                      <span className={`co-pill ${fcount >= 1 ? 'is-good' : ''}`}>
                        {fcount}/2 ملفات
                      </span>
                      <span className={`co-pill ${desc ? 'is-good' : ''}`}>
                        {desc ? 'وصف ✓' : 'بدون وصف'}
                      </span>
                      {it.product.onDemand && (
                        <span className={`co-pill ${dimReady ? 'is-good' : 'is-warn'}`}>
                          {dimReady ? 'مقاسات ✓' : 'مقاسات مطلوبة'}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="co-list-row__remove"
                    onClick={(e) => { e.stopPropagation(); removeItem(id); }}
                    aria-label="حذف"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* RTL end (visual left) — product detail / per-item config */}
        <section className="co-detail">
          {selected ? (
            <ProductDetailPanel
              item={selected}
              dims={dims[pid(selected.product)] || {}}
              setDim={(k, v) => setDim(pid(selected.product), k, v)}
              files={files[pid(selected.product)] || []}
              onFileChange={(slot, f) => updateFile(pid(selected.product), slot, f)}
              description={descriptions[pid(selected.product)] || ''}
              setDescription={(t) => setDesc(pid(selected.product), t)}
              quantity={selected.quantity}
              setQuantity={(q) => updateQty(pid(selected.product), q)}
            />
          ) : null}
        </section>
      </div>

      {/* Sticky bottom summary + submit */}
      <footer className="co-bar">
        <div className="co-bar__totals">
          <div className="co-bar__totals-row">
            <span>المنتجات:</span><strong>{items.length}</strong>
            <span className="co-bar__sep" />
            <span>القطع:</span><strong>{items.reduce((s, it) => s + it.quantity, 0)}</strong>
            <span className="co-bar__sep" />
            <span>الإجمالي التقريبي:</span>
            <strong>
              <Price value={items.reduce(
                (s, it) => s + ((it.product.onDemand ? 0 : it.product.price) * it.quantity),
                0
              )} />
            </strong>
          </div>
          {items.some((it) => it.product.onDemand) && (
            <p className="co-bar__note">⚠ يحتوي الطلب على منتجات حسب الطلب — التسعير النهائي يقدّمه فريق الإدارة بعد المراجعة.</p>
          )}
          {validation.length > 0 && (
            <ul className="co-bar__issues">
              {validation.map((m, i) => <li key={i}>• {m}</li>)}
            </ul>
          )}
        </div>
        <button type="button" className="co-bar__cta" disabled={!canSubmit} onClick={submit}>
          {submitting ? 'جارٍ الإرسال…' : 'طلب المنتجات'}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </footer>
    </div>
  );
}

/* ── Product detail panel (right side) ─────────────────────────────────── */
function ProductDetailPanel({
  item, dims, setDim, files, onFileChange,
  description, setDescription, quantity, setQuantity,
}) {
  const p = item.product;
  const fileSlots = [0, 1];
  const min = p.minimumOrder || 1;

  return (
    <div className="co-prod">
      <div className="co-prod__media">
        {p.mainImage ? <img src={p.mainImage} alt={p.name} /> : <div className="co-prod__media-empty" />}
      </div>
      <div className="co-prod__body">
        <span className="co-prod__cat">{p.category}</span>
        <h2 className="co-prod__title">{p.name}</h2>
        {p.description && <p className="co-prod__desc">{p.description}</p>}

        {/* Quantity + price */}
        <div className="co-prod__row">
          <div className="co-qty">
            <button type="button" onClick={() => setQuantity(Math.max(min, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <div className="co-prod__price">
            {p.onDemand
              ? <span style={{ color: 'var(--ad-yellow)', fontWeight: 700 }}>السعر حسب المقاسات</span>
              : <Price value={p.price * quantity} size="lg" />}
          </div>
        </div>
        {quantity < min && (
          <p className="co-prod__min-warn">الحد الأدنى لهذا المنتج: {min} قطعة</p>
        )}

        {/* Custom dimensions for on-demand */}
        {p.onDemand && (
          <div className="co-prod__section">
            <h4 className="co-prod__section-title">المقاسات (سم)</h4>
            <p className="co-prod__section-hint">أدخل المقاسات التي تحتاجها — يكفي مقاس واحد على الأقل.</p>
            <div className="co-prod__dims">
              {['width', 'height', 'length'].map((k) => (
                <label key={k} className="co-dim">
                  <span>{ {width:'العرض', height:'الارتفاع', length:'الطول'}[k] }</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    dir="ltr"
                    value={dims[k] || ''}
                    onChange={(e) => setDim(k, e.target.value)}
                    placeholder="—"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* File slots × 2 */}
        <div className="co-prod__section">
          <h4 className="co-prod__section-title">ملفات التصميم</h4>
          <p className="co-prod__section-hint">
            ارفع حتى ملفين بصيغة <code>SVG · EPS · PDF · AI</code> (حد أقصى 25 ميجابايت لكل ملف).
          </p>
          <div className="co-prod__files">
            {fileSlots.map((slot) => {
              const f = files[slot];
              return (
                <div key={slot} className={`co-file ${f ? 'is-filled' : ''}`}>
                  {f ? (
                    <>
                      <span className="co-file__ext">{(f.name.split('.').pop() || '').toUpperCase()}</span>
                      <div className="co-file__body">
                        <strong className="co-file__name" title={f.name}>{f.name}</strong>
                        <span className="co-file__size">{Math.round(f.size / 1024)} KB</span>
                      </div>
                      <button type="button" className="co-file__x" onClick={() => onFileChange(slot, null)} aria-label="إزالة">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <label className="co-file__drop">
                      <input
                        type="file"
                        accept=".svg,.eps,.pdf,.ai,application/postscript,application/pdf,image/svg+xml"
                        onChange={(e) => { onFileChange(slot, e.target.files?.[0] || null); e.target.value = ''; }}
                      />
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>الملف {slot + 1}</span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Description / first chat message */}
        <div className="co-prod__section">
          <h4 className="co-prod__section-title">ملاحظات وتفاصيل لهذا المنتج</h4>
          <p className="co-prod__section-hint">
            ما تكتبه هنا يصل للإدارة كأوّل رسالة في محادثة الطلب لهذا المنتج
            (الخامة المفضّلة، الألوان، أي تفاصيل خاصة).
          </p>
          <textarea
            className="co-prod__textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: نفّذ الكروت على ورق مطفّي 350 جرام، اللون الأساسي #FEFC4F…"
            maxLength={2000}
          />
          <div className="co-prod__textarea-meter">{description.length}/2000</div>
        </div>
      </div>
    </div>
  );
}
