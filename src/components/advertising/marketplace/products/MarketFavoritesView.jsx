import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../lib/api.js';
import { useAuth } from '../../../../lib/auth.jsx';
import Price from '../Price.jsx';

export default function MarketFavoritesView() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // Fetch favorite products
  useEffect(() => {
    let alive = true;
    api.get('/account/favorites')
      .then(data => {
        if (alive) {
          setFavorites(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (alive) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { alive = false; };
  }, []);

  const handleConfirmRemove = async (productId) => {
    try {
      const res = await api.post('/account/favorites/toggle', { productId });
      if (res && res.favorites) {
        // Update global auth context favorites
        if (user) {
          user.favorites = res.favorites;
        }
        // Update local page state to filter out the removed favorite
        setFavorites(prev => prev.filter(p => (p._id || p.id) !== productId));
      }
      setConfirmRemoveId(null);
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setConfirmRemoveId(null);
    }
  };

  if (loading) {
    return (
      <section className="mkp-section">
        <div className="mkp-section__inner">
          <div className="mkp-header">
            <div>
              <span className="mk-eyebrow">المتجر الإلكتروني</span>
              <h1 className="mk-h2">منتجاتي <span className="mk-hl">المفضلة</span></h1>
              <p className="mk-sub">جاري تحميل قائمة المنتجات المفضلة...</p>
            </div>
          </div>
          <div className="mkp-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mkp-card mkp-card--skel">
                <div className="mk-skel mk-skel--block" style={{ aspectRatio: '1/1' }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="mk-skel mk-skel--text-sm" />
                  <div className="mk-skel mk-skel--text-lg" />
                  <div className="mk-skel mk-skel--text-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mkp-section">
      <div className="mkp-section__inner">
        {/* Header */}
        <div className="mkp-header">
          <div>
            <span className="mk-eyebrow">المتجر الإلكتروني</span>
            <h1 className="mk-h2">منتجاتي <span className="mk-hl">المفضلة</span></h1>
            <p className="mk-sub">قائمة بالمنتجات التي قمت بحفظها للرجوع إليها لاحقًا.</p>
          </div>
        </div>

        {error && <div className="mkp-error">⚠ {error}</div>}

        {favorites.length === 0 ? (
          <div className="mkp-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="mkp-empty__title">قائمة المفضلة فارغة</p>
            <p className="mkp-empty__hint">تصفح المنتجات وأضف ما يعجبك إلى قائمة المفضلة.</p>
            <Link to="/sectors/advertising/marketplace/products" className="pd-back" style={{ marginTop: '1.5rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="mkp-grid">
            {favorites.map(p => (
              <FavoriteProductCard
                key={p._id || p.id}
                p={p}
                confirmRemoveId={confirmRemoveId}
                setConfirmRemoveId={setConfirmRemoveId}
                onConfirmRemove={handleConfirmRemove}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FavoriteProductCard({ p, confirmRemoveId, setConfirmRemoveId, onConfirmRemove }) {
  const videoRef = useRef(null);
  const isVideo = !!p.animationMedia && /\/video\/upload\//i.test(p.animationMedia);
  const showConfirm = confirmRemoveId === (p._id || p.id);

  const handleEnter = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    try { v.currentTime = 0; } catch {}
    const play = v.play();
    if (play?.catch) play.catch(() => {});
  };
  const handleLeave = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch {}
  };

  const hasDims = p.width || p.height || p.length;

  return (
    <article className="mkp-card" onMouseEnter={handleEnter} onMouseLeave={handleLeave} style={{ position: 'relative' }}>
      {/* Media container */}
      <div className="mkp-card__media">
        <img src={p.mainImage} alt={p.name} loading="lazy" />
        {p.animationMedia && (isVideo ? (
          <video ref={videoRef} className="mkp-card__hover-media" src={p.animationMedia}
            muted loop playsInline preload="metadata" />
        ) : (
          <img src={p.animationMedia} alt="" className="mkp-card__hover-media" loading="lazy" />
        ))}
        {p.onDemand && <span className="mkp-card__badge">حسب الطلب</span>}

        {/* Favorite heart button overlay */}
        <button
          type="button"
          className="mkp-card__fav-btn"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmRemoveId(p._id || p.id);
          }}
          aria-label="Remove from favorites"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Product Body */}
      <div className="mkp-card__body">
        <span className="mkp-card__cat">{p.category}</span>
        <h3 className="mkp-card__title">{p.name}</h3>
        <div className="mkp-card__meta">
          {p.onDemand ? (
            <span className="mkp-card__demand">منتج حسب الطلب</span>
          ) : (
            <>
              {hasDims && (
                <span className="mkp-card__dims" dir="ltr">
                  {[p.width, p.height, p.length].filter(Boolean).join(' × ')} cm
                </span>
              )}
              <span className="mkp-card__price"><Price value={p.price} /></span>
            </>
          )}
        </div>
        <Link to={`/sectors/advertising/marketplace/products/product_${p.reference}`} className="mkp-card__cta">
          عرض المنتج
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Confirmation delete overlay */}
      {showConfirm && (
        <div className="mkp-card__confirm-overlay">
          <p className="mkp-card__confirm-text">هل متأكد ..؟</p>
          <div className="mkp-card__confirm-actions">
            <button
              type="button"
              className="mkp-card__confirm-btn mkp-card__confirm-btn--yes"
              onClick={() => onConfirmRemove(p._id || p.id)}
            >
              نعم
            </button>
            <button
              type="button"
              className="mkp-card__confirm-btn mkp-card__confirm-btn--no"
              onClick={() => setConfirmRemoveId(null)}
            >
              تراجع
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
