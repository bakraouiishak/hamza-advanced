import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from './useClickOutside.js';
import { useCart } from '../../../../lib/cart.jsx';
import Price from '../Price.jsx';

/**
 * CartDropdown — cart icon + popover preview in the navbar.
 *
 * Wired to CartContext for live cart state. Shows item rows with
 * quantity controls and a "طلب المنتجات" CTA when ≥ 1 item exists.
 */
export default function CartDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const { items, count, removeItem, updateQty } = useCart();

  return (
    <div className="mk-iconbtn-wrap" ref={ref}>
      <button
        type="button"
        className={`mk-iconbtn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="السلّة"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && <span className="mk-iconbtn__badge">{count}</span>}
      </button>

      {open && (
        <div className="mk-dropdown mk-dropdown--wide" role="menu">
          <header className="mk-dropdown__head">
            <h4>السلّة</h4>
            {count > 0 && <span className="mk-dropdown__head-tag">{count} عنصر</span>}
          </header>

          {items.length === 0 ? (
            <div className="mk-dropdown__empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="mk-dropdown__empty-title">السلّة فارغة</p>
              <p className="mk-dropdown__empty-hint">ابدأ بتصفّح المنتجات لإضافتها إلى السلّة.</p>
            </div>
          ) : (
            <>
              <ul className="mk-dropdown__list">
                {items.map((it) => {
                  const id = it.product?.id || it.product?._id;
                  return (
                    <li key={id} className="mk-dropdown__row mk-cart-row">
                      <span className="mk-cart-row__thumb">
                        {it.product?.mainImage && <img src={it.product.mainImage} alt="" />}
                      </span>
                      <div className="mk-cart-row__body">
                        <strong>{it.product?.name}</strong>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {/* Qty controls */}
                          <button type="button" className="mk-cart-row__qty-btn"
                            onClick={() => updateQty(id, it.quantity - 1)}>−</button>
                          <span style={{ fontWeight: 700, color: 'var(--ad-yellow)', minWidth: 18, textAlign: 'center' }}>
                            {it.quantity}
                          </span>
                          <button type="button" className="mk-cart-row__qty-btn"
                            onClick={() => updateQty(id, it.quantity + 1)}>+</button>
                          <span style={{ margin: '0 0.3rem', color: 'rgba(247,240,245,0.35)' }}>×</span>
                          {it.product?.onDemand
                            ? <span style={{ fontSize: '0.76rem', color: 'rgba(254,252,79,0.65)' }}>حسب الطلب</span>
                            : <Price value={it.product?.price} />
                          }
                        </span>
                      </div>
                      <button type="button" className="mk-cart-row__remove" onClick={() => removeItem(id)}
                        aria-label="حذف">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <footer className="mk-dropdown__foot">
                <button type="button" className="mk-dropdown__cta" onClick={() => {
                  setOpen(false);
                  navigate('/sectors/advertising/marketplace/orders?checkout=1');
                }}>
                  طلب المنتجات
                </button>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
}
