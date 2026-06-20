import React, { useEffect, useRef, useState } from 'react';
import Price from './Price.jsx';
import useHomeFeed from './useHomeFeed.js';
import useAuthGate from './useAuthGate.js';
import { useCart } from '../../../lib/cart.jsx';

/**
 * MarketCarousel — horizontal scroll-snap carousel of the 7 most-sold
 * products (Done orders). Inner shadows on the left/right edges hint at
 * the scrollable area; the wrapper toggles `is-at-start` / `is-at-end`
 * classes so each shadow fades out when the user reaches the matching end.
 *
 * Click "+" → adds one unit of the product to the cart. Anonymous visitors
 * get bounced to /signup via the shared auth gate.
 */
export default function MarketCarousel() {
  const { data } = useHomeFeed();
  const { gate } = useAuthGate();
  const { addItem } = useCart();
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const [addedId, setAddedId] = useState(null);

  const products = data?.topProducts || [];
  // While loading, keep the existing skeleton experience (4 placeholder cards).
  const cards = products.length > 0 ? products : Array.from({ length: 4 }, (_, i) => ({ _id: `skel-${i}` }));

  /* Edge-shadow toggling — bound on mount + on scroll. In RTL containers
     scrollLeft becomes ≤ 0 (Chromium/Webkit) or moves like LTR (Firefox);
     the math we use below is direction-agnostic because we compare against
     the absolute maxScroll value. */
  useEffect(() => {
    const el = trackRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    const update = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      // In RTL Chromium, scrollLeft goes from 0 (right end) to -maxScroll
      // (left end). In LTR / Firefox it goes 0 → +maxScroll. Normalize.
      const x = Math.abs(el.scrollLeft);
      const atStart = x <= 4;
      const atEnd = Math.abs(x - maxScroll) <= 4;
      wrap.classList.toggle('is-at-start', atStart);
      wrap.classList.toggle('is-at-end', atEnd || maxScroll <= 0);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [cards.length]);

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector('.mk-prod');
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    trackRef.current.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  const handleAdd = (product) => {
    gate(() => {
      addItem(
        {
          _id: product._id,
          id: product._id,
          name: product.name,
          mainImage: product.mainImage,
          price: product.price,
          onDemand: product.onDemand,
          minimumOrder: product.minimumOrder || 1,
        },
        Math.max(1, product.minimumOrder || 1)
      );
      setAddedId(product._id);
      setTimeout(() => setAddedId((cur) => (cur === product._id ? null : cur)), 900);
    });
  };

  return (
    <section className="mk-section">
      <div className="mk-section__inner">
        <header className="mk-section__head">
          <div className="mk-section__head-left">
            <span className="mk-eyebrow">الأكثر طلبًا</span>
            <h2 className="mk-h2">
              منتجات <span className="mk-hl">مختارة</span> لك
            </h2>
            <p className="mk-sub">
              منتجاتنا الأكثر طلبًا من العملاء — كروت، بنرات، حروف بارزة،
              ودروع تذكارية جاهزة للطلب.
            </p>
          </div>
          <div className="mk-carousel__nav">
            <button
              type="button"
              className="mk-carousel__btn"
              aria-label="السابق"
              onClick={() => scrollBy('next')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="mk-carousel__btn is-next"
              aria-label="التالي"
              onClick={() => scrollBy('prev')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        <div className="mk-carousel" ref={wrapRef}>
          <div className="mk-carousel__track" ref={trackRef}>
            {cards.map((p) => {
              const isSkel = !p.name;
              const isAdded = addedId === p._id;
              return (
                <article key={p._id} className="mk-prod">
                  <div className="mk-prod__media" aria-hidden>
                    {p.unitsSold > 0 && (
                      <span className="mk-prod__badge">الأكثر طلبًا</span>
                    )}
                    {isSkel ? (
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    ) : (
                      <img src={p.mainImage} alt={p.name} loading="lazy" />
                    )}
                  </div>
                  <div className="mk-prod__body">
                    <span className="mk-prod__cat">
                      {p.category || <span className="mk-skel mk-skel--text-sm" />}
                    </span>
                    <h3 className="mk-prod__title">
                      {p.name || (
                        <>
                          <span className="mk-skel mk-skel--text-lg" />
                          <span className="mk-skel mk-skel--text-md" style={{ marginTop: 6, display: 'block' }} />
                        </>
                      )}
                    </h3>
                    <div className="mk-prod__row">
                      <div>
                        {isSkel ? (
                          <span className="mk-skel mk-skel--text-md" style={{ width: 90 }} />
                        ) : p.onDemand ? (
                          <span className="mk-prod__price" style={{ fontSize: '0.85rem' }}>
                            حسب الطلب
                          </span>
                        ) : (
                          <span className="mk-prod__price"><Price value={p.price} /></span>
                        )}
                      </div>
                      {!isSkel && (
                        <button
                          type="button"
                          className={`mk-prod__add ${isAdded ? 'is-added' : ''}`}
                          aria-label={isAdded ? 'تمت الإضافة' : 'إضافة للسلة'}
                          onClick={() => handleAdd(p)}
                        >
                          {isAdded ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
