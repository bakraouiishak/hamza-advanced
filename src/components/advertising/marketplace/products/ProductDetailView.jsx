import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api.js';
import { useCart } from '../../../../lib/cart.jsx';
import { useAuth } from '../../../../lib/auth.jsx';
import Price from '../Price.jsx';
import SaudiRiyal from '../SaudiRiyal.jsx';

/* ── Juxtapose Slider ───────────────────────────────────────────────── */
function Juxtapose({ beforeSrc, afterSrc, alt }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [containerW, setContainerW] = useState(0);

  /* Track the container width so the before-image stays pixel-aligned */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const canZoom = pos <= 2 || pos >= 98;

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const onPointerDown = (e) => {
    if (zoomed) return;
    setDragging(true);
    updatePos(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (zoomed) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setZoomPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
      return;
    }
    if (!dragging) return;
    updatePos(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const handleClick = () => {
    if (canZoom && !dragging) setZoomed(z => !z);
  };

  return (
    <div
      ref={containerRef}
      className={`jux ${zoomed ? 'jux--zoomed' : ''} ${canZoom ? 'jux--can-zoom' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handleClick}
      style={{ touchAction: 'none', '--jux-w': containerW ? `${containerW}px` : '100%' }}
    >
      {/* After image (full) */}
      <img src={afterSrc} alt={alt} className="jux__img jux__img--after"
        style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined} />
      {/* Before image (clipped) */}
      <div className="jux__before" style={{ width: `${pos}%` }}>
        <img src={beforeSrc} alt={alt} className="jux__img jux__img--before"
          style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined} />
      </div>
      {/* Slider handle */}
      {!zoomed && (
        <div className="jux__handle" style={{ left: `${pos}%` }}>
          <div className="jux__handle-line" />
          <div className="jux__handle-knob">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M8 4l-6 8 6 8" /><path d="M16 4l6 8-6 8" />
            </svg>
          </div>
        </div>
      )}
      {/* Zoom hint */}
      {canZoom && !zoomed && (
        <div className="jux__zoom-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>
          اضغط للتكبير
        </div>
      )}
      {zoomed && (
        <div className="jux__zoom-hint jux__zoom-hint--active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3M8 11h6"/></svg>
          اضغط للخروج
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT DETAIL VIEW
   ═══════════════════════════════════════════════════════════════════════ */
export default function ProductDetailView() {
  const { slug } = useParams();
  const ref = slug?.replace(/^product_/, '') || slug;
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(null);   // initialised once product loads
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && product) {
      const pid = product._id || product.id;
      setIsFavorite(user.favorites?.includes(pid) || false);
    } else {
      setIsFavorite(false);
    }
  }, [user, product]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/sectors/advertising/marketplace/signin');
      return;
    }
    if (!product) return;
    const pid = product._id || product.id;
    try {
      const res = await api.post('/account/favorites/toggle', { productId: pid });
      if (res && res.favorites) {
        user.favorites = res.favorites;
        setIsFavorite(res.favorites.includes(pid));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  useEffect(() => {
    let alive = true;
    api.get(`/products/ref/${ref}`)
      .then(data => { if (alive) setProduct(data); })
      .catch(async () => {
        // Fallback: fetch all and find by reference
        try {
          const all = await api.get('/products?limit=200&page=1');
          const found = (all.items || []).find(p => p.reference === ref);
          if (alive) {
            if (found) setProduct(found);
            else setError('لم يتم العثور على المنتج');
          }
        } catch (err) {
          if (alive) setError(err.message);
        }
      });
    return () => { alive = false; };
  }, [ref]);

  /* Set qty to the minimum order once the product loads */
  const minOrder = product?.minimumOrder || 1;
  useEffect(() => {
    if (product && qty === null) setQty(minOrder);
  }, [product, minOrder, qty]);

  const effectiveQty = qty ?? minOrder;
  const belowMin = effectiveQty < minOrder;

  const handleAdd = () => {
    if (!product || belowMin) return;
    addItem(product, effectiveQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const hasDims = product?.width || product?.height || product?.length;

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (!product && !error) {
    return (
      <section className="pd-section">
        <div className="pd-inner">
          <div className="pd-layout">
            <div className="pd-media"><div className="mk-skel mk-skel--block" style={{ aspectRatio: '1/1', borderRadius: 18 }} /></div>
            <div className="pd-info" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="mk-skel mk-skel--text-sm" style={{ width: 120 }} />
              <div className="mk-skel mk-skel--text-lg" style={{ width: '80%' }} />
              <div className="mk-skel mk-skel--text-md" style={{ width: 200 }} />
              <div className="mk-skel mk-skel--text-md" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pd-section">
        <div className="pd-inner">
          <div className="mkp-error">⚠ {error}</div>
          <Link to="/sectors/advertising/marketplace/products" className="pd-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            العودة للمنتجات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pd-section">
      <div className="pd-inner">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/sectors/advertising/marketplace">المتجر</Link>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2L4 6l4 4"/></svg>
          <Link to="/sectors/advertising/marketplace/products">المنتجات</Link>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2L4 6l4 4"/></svg>
          <span>{product.name}</span>
        </nav>

        {/* Main layout: image left, info right */}
        <div className="pd-layout">
          {/* ── Media (Juxtapose) ──────────────────────────────── */}
          <div className="pd-media">
            {product.mainImage && product.animationMedia ? (
              <Juxtapose
                beforeSrc={product.mainImage}
                afterSrc={product.animationMedia}
                alt={product.name}
              />
            ) : (
              <div className="pd-media__single">
                <img src={product.mainImage} alt={product.name} />
              </div>
            )}
            {product.mainImage && product.animationMedia && (
              <div className="pd-media__labels">
                <span>المنتج المطبوع</span>
                <span>المنتج الأساسي</span>
              </div>
            )}
          </div>

          {/* ── Product info ───────────────────────────────────── */}
          <div className="pd-info">
            <span className="pd-info__cat">{product.category}</span>
            <h1 className="pd-info__title">
              <span>{product.name}</span>
              <button
                type="button"
                className={`pd-fav-btn ${isFavorite ? 'is-favorite' : ''}`}
                onClick={handleToggleFavorite}
                aria-label="Add to favorites"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </h1>

            {product.onDemand ? (
              <div className="pd-info__demand-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                منتج حسب الطلب — السعر يحدد بعد استلام المقاسات
              </div>
            ) : (
              <div className="pd-info__price">
                <Price value={product.price} size={20} />
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="pd-info__section">
                <h3 className="pd-info__label">الوصف</h3>
                <p className="pd-info__desc">{product.description}</p>
              </div>
            )}

            {/* Specs grid */}
            <div className="pd-specs">
              {hasDims && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 3H3v18h18V3zM9 3v18M3 9h18"/></svg>
                  </span>
                  <div>
                    <span className="pd-spec__label">المقاسات</span>
                    <span className="pd-spec__value" dir="ltr">{[product.width, product.height, product.length].filter(Boolean).join(' × ')} cm</span>
                  </div>
                </div>
              )}
              <div className="pd-spec">
                <span className="pd-spec__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </span>
                <div>
                  <span className="pd-spec__label">الحد الأدنى للطلب</span>
                  <span className="pd-spec__value">{minOrder} قطعة</span>
                </div>
              </div>
              {product.prodTime && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </span>
                  <div>
                    <span className="pd-spec__label">زمن الإنتاج</span>
                    <span className="pd-spec__value">{product.prodTime}</span>
                  </div>
                </div>
              )}
              {product.reference && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                  </span>
                  <div>
                    <span className="pd-spec__label">المرجع</span>
                    <span className="pd-spec__value" dir="ltr">{product.reference}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="pd-cart">
              <div className="pd-cart__qty">
                <button type="button" className="pd-cart__qty-btn" onClick={() => setQty(q => Math.max(minOrder, q - 1))}
                  disabled={effectiveQty <= minOrder}>−</button>
                <span className="pd-cart__qty-val">{effectiveQty}</span>
                <button type="button" className="pd-cart__qty-btn" onClick={() => setQty(q => (q ?? minOrder) + 1)}>+</button>
              </div>
              <button type="button" className={`pd-cart__add ${added ? 'is-added' : ''} ${belowMin ? 'is-disabled' : ''}`} onClick={handleAdd}
                disabled={belowMin}>
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    تمت الإضافة
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    أضف إلى السلّة
                  </>
                )}
              </button>
            </div>
            {belowMin && (
              <p className="pd-cart__min-warn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                الكمية المطلوبة أقل من الحد الأدنى للطلب ({minOrder} قطعة)
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
