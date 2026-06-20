import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MARKET_PACKS } from '../../../data/advertising-marketplace.js';
import Price from './Price.jsx';
import useHomeFeed from './useHomeFeed.js';
import useAuthGate from './useAuthGate.js';
import { useCart } from '../../../lib/cart.jsx';

/**
 * MarketPacks — three bundle cards (Starter / Pro / Enterprise). Each card
 * carries:
 *   • A discount chip
 *   • A pack media well — random product image from the backend
 *   • A bullet list of what's inside
 *   • A bundled price (sum of picked products × discount)
 *   • "اطلب الباقة" — adds every product of the pack to the cart at once
 *     (anonymous → /signup). After a successful add the button flashes
 *     green and navigates to the orders/cart finalization page.
 */
const PACK_CHIPS = {
  starter:    'الباقة الأساسية',
  pro:        'الباقة الاحترافية',
  enterprise: 'باقة المؤسسات',
};

export default function MarketPacks() {
  const { data } = useHomeFeed();
  const { gate } = useAuthGate();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [doneId, setDoneId] = useState(null);

  // Merge live packs onto the skeleton order so cards always render in
  // the brand-approved sequence.
  const liveById = new Map((data?.packs || []).map((p) => [p.id, p]));
  // The backend ships canonical pack ids ('pk-starter', etc.); fall back
  // to the local skeleton id (1/2/3) by index when the backend hasn't
  // responded yet — preserves the placeholder UX during slow networks.
  const livePacks = data?.packs || [];
  const slots = MARKET_PACKS.map((p, i) => {
    const live = livePacks[i] || liveById.get(p.id);
    return live || p; // skeleton when no data
  });

  const orderPack = (pack) => {
    if (!pack.products || pack.products.length === 0) return;
    gate(() => {
      pack.products.forEach((p) => {
        addItem(p, Math.max(1, p.minimumOrder || 1));
      });
      setDoneId(pack.id);
      // Small celebration window before bouncing to the cart so the user
      // sees the green flash and understands what happened.
      setTimeout(() => {
        navigate('/sectors/advertising/marketplace/orders');
      }, 700);
    });
  };

  return (
    <section className="mk-section">
      <div className="mk-section__inner">
        <header className="mk-section__head">
          <div className="mk-section__head-left">
            <span className="mk-eyebrow">باقات بخصومات حصرية</span>
            <h2 className="mk-h2">
              وفّر أكثر مع <span className="mk-hl">الباقات الجاهزة</span>
            </h2>
            <p className="mk-sub">
              باقات مدروسة تجمع أكثر المنتجات طلبًا في باقة واحدة بسعر مخفّض —
              مثالية للمشاريع الجديدة والشركات الناشئة.
            </p>
          </div>
        </header>

        <div className="mk-packs">
          {slots.map((pack, i) => {
            const isLive = !!pack.title && Array.isArray(pack.items);
            const isDone = doneId === pack.id;
            return (
              <motion.article
                key={pack.id}
                className="mk-pack"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mk-pack__head">
                  <span className="mk-pack__chip">
                    {PACK_CHIPS[pack.accent] || 'الباقة'}
                  </span>
                  <span className="mk-pack__discount">
                    {pack.discountPct != null ? `${pack.discountPct}%-` : '٪-'}
                  </span>
                </div>

                {/* Pack media — random product image from one of the bundled
                    products, picked server-side for stable composition. */}
                <div className="mk-pack__media" aria-hidden>
                  {pack.image ? (
                    <img src={pack.image} alt="" loading="lazy" />
                  ) : (
                    <span className="mk-pack__media-empty">
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </span>
                  )}
                </div>

                <h3 className="mk-pack__title">
                  {pack.title || <span className="mk-skel mk-skel--text-lg" style={{ width: '70%' }} />}
                </h3>

                <ul className="mk-pack__items">
                  {(pack.items || Array.from({ length: 4 })).map((it, idx) => (
                    <li key={idx} className="mk-pack__item">
                      <span className="mk-pack__item-bullet">
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {it || <span className="mk-skel mk-skel--text-md" />}
                    </li>
                  ))}
                </ul>

                <div className="mk-pack__bottom">
                  <div className="mk-pack__price">
                    {pack.price != null ? (
                      <>
                        <span className="mk-pack__price-now"><Price value={pack.price} /></span>
                        {pack.oldPrice != null && pack.oldPrice !== pack.price && (
                          <span className="mk-pack__price-old"><Price value={pack.oldPrice} /></span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="mk-skel mk-skel--text-lg" style={{ width: 90, height: 22 }} />
                        <span className="mk-skel mk-skel--text-sm" style={{ width: 60, marginTop: 4 }} />
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`mk-btn mk-btn--primary ${isDone ? 'is-done' : ''}`}
                    disabled={!isLive || !pack.products?.length}
                    onClick={() => orderPack(pack)}
                  >
                    {isDone ? 'تمت الإضافة ✓' : 'اطلب الباقة'}
                    {!isDone && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
