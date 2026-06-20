import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MARKET_CATEGORIES } from '../../../data/advertising-marketplace.js';
import useHomeFeed from './useHomeFeed.js';
import useAuthGate from './useAuthGate.js';

/**
 * MarketCategories — 12 category tiles. Each tile's thumbnail is one
 * random product image from that category (server-picked). Clicking a
 * tile (or "كل الفئات") routes to the products page; clicks from
 * anonymous visitors get bounced to /signup via the shared auth gate.
 */
const PRODUCTS_PATH = '/sectors/advertising/marketplace/products';

export default function MarketCategories() {
  const { data } = useHomeFeed();
  const { gate } = useAuthGate();
  const navigate = useNavigate();

  // Merge live data (image + count) onto the canonical client-side order
  // so we keep the brand-approved sequence even when the backend returns
  // categories in a different order.
  const liveByKey = new Map((data?.categories || []).map((c) => [c.key, c]));
  const tiles = MARKET_CATEGORIES.map((c) => {
    const live = liveByKey.get(c.id);
    return {
      id: c.id,
      label: c.label,
      count: live?.count ?? null,
      image: live?.image ?? null,
    };
  });

  const goToProducts = (label = null) => {
    gate(() => {
      const url = label
        ? `${PRODUCTS_PATH}?category=${encodeURIComponent(label)}`
        : PRODUCTS_PATH;
      navigate(url);
    });
  };

  return (
    <section className="mk-section">
      <div className="mk-section__inner">
        <header className="mk-section__head">
          <div className="mk-section__head-left">
            <span className="mk-eyebrow">تصفّح حسب الفئة</span>
            <h2 className="mk-h2">
              فئات <span className="mk-hl">المتجر</span>
            </h2>
            <p className="mk-sub">
              اختر الفئة الأنسب لمشروعك — كل فئة تضم منتجات جاهزة ومخصّصة
              بأسعار تنافسية.
            </p>
          </div>
          <button
            type="button"
            className="mk-link"
            onClick={() => goToProducts(null)}
          >
            كل الفئات
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        <div className="mk-categories">
          {tiles.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              className="mk-cat"
              onClick={() => goToProducts(c.label)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mk-cat__media" aria-hidden>
                {c.image ? (
                  <img src={c.image} alt="" loading="lazy" />
                ) : (
                  /* Dashed fallback when the category has no products yet */
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="9" cy="9" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>
              <span className="mk-cat__label">{c.label}</span>
              <span className="mk-cat__count">
                {c.count == null ? '—' : `${c.count} منتج`}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
