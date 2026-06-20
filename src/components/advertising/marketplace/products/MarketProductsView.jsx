import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../../lib/api.js';
import Price from '../Price.jsx';

const CATEGORIES = [
  'إدارة الفعاليات والمؤتمرات والمعارض',
  'المطبوعات الورقية',
  'علب المنتجات والتغليف',
  'الأكياس الورقية والبلاستيكية',
  'الحروف البارزة',
  'الهدايا الدعائية والدروع',
  'أعمال الاكريليك والفوركس والخشب',
  'الاستكرات والبنرات واللوحات الدعائية',
  'الطباعة المباشرة على المواد UV',
  'التصاميم والهويات البصرية',
  'الاستاندات وطاولات العرض والأعلام',
  'الزي الموحد',
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'الأحدث أولًا' },
  { value: 'createdAt', label: 'الأقدم أولًا' },
  { value: 'name', label: 'الاسم (أ-ي)' },
  { value: '-name', label: 'الاسم (ي-أ)' },
  { value: 'price', label: 'السعر (تصاعدي)' },
  { value: '-price', label: 'السعر (تنازلي)' },
];

const MIN_ORDER_OPTIONS = [1, 5, 10, 25, 50];

/* ── Grid card with hover video ─────────────────────────────────────── */
function ProductGridCard({ p }) {
  const videoRef = useRef(null);
  const isVideo = !!p.animationMedia && /\/video\/upload\//i.test(p.animationMedia);

  const handleEnter = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    try { v.currentTime = 0; } catch { }
    const play = v.play();
    if (play?.catch) play.catch(() => { });
  };
  const handleLeave = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch { }
  };

  const hasDims = p.width || p.height || p.length;

  return (
    <article className="mkp-card" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div className="mkp-card__media">
        <img src={p.mainImage} alt={p.name} loading="lazy" />
        {p.animationMedia && (isVideo ? (
          <video ref={videoRef} className="mkp-card__hover-media" src={p.animationMedia}
            muted loop playsInline preload="metadata" />
        ) : (
          <img src={p.animationMedia} alt="" className="mkp-card__hover-media" loading="lazy" />
        ))}
        {p.onDemand && <span className="mkp-card__badge">حسب الطلب</span>}
      </div>
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
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

/* ── List row ────────────────────────────────────────────────────────── */
function ProductListRow({ p }) {
  const hasDims = p.width || p.height || p.length;
  return (
    <div className="mkp-list-row">
      <span className="mkp-list-row__thumb">
        <img src={p.mainImage} alt="" />
      </span>
      <div className="mkp-list-row__info">
        <h4>{p.name}</h4>
        <span className="mkp-list-row__cat">{p.category}</span>
      </div>
      <div className="mkp-list-row__details">
        {hasDims && <span className="mkp-list-row__dims" dir="ltr">{[p.width, p.height, p.length].filter(Boolean).join(' × ')} cm</span>}
        {p.onDemand
          ? <span className="mkp-list-row__demand">حسب الطلب</span>
          : <span className="mkp-list-row__price"><Price value={p.price} /></span>
        }
      </div>
      <Link to={`/sectors/advertising/marketplace/products/product_${p.reference}`} className="mkp-list-row__cta">عرض المنتج</Link>
    </div>
  );
}

/* ── Dual-thumb range slider ─────────────────────────────────────────── */
function RangeSlider({ min, max, low, high, onLow, onHigh }) {
  const pctLow = ((low - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;
  return (
    <div className="mkp-range">
      <div className="mkp-range__track">
        <div className="mkp-range__fill" style={{ right: `${pctLow}%`, left: `${100 - pctHigh}%` }} />
      </div>
      <input type="range" min={min} max={max} value={low}
        onChange={e => onLow(Math.min(Number(e.target.value), high - 1))} className="mkp-range__input" />
      <input type="range" min={min} max={max} value={high}
        onChange={e => onHigh(Math.max(Number(e.target.value), low + 1))} className="mkp-range__input" />
      <div className="mkp-range__labels">
        <span dir="ltr">{low}</span>
        <span dir="ltr">{high}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN VIEW
   ═══════════════════════════════════════════════════════════════════════ */
export default function MarketProductsView() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* filters */
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [filterOpen, setFilterOpen] = useState(false);
  // Seed selected categories from the URL — the mega-dropdown sends the
  // chosen category through `?category=<label>`.
  const urlCategory = searchParams.get('category');
  const [selCats, setSelCats] = useState(
    urlCategory && CATEGORIES.includes(urlCategory) ? [urlCategory] : []
  );

  // React to URL changes (e.g. user clicks a different category in the
  // mega-dropdown while already on this page) by syncing selCats accordingly.
  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setSelCats([urlCategory]);
      setFilterOpen(true);
    }
  }, [urlCategory]);
  const [minOrder, setMinOrder] = useState(null);
  const [dimFilter, setDimFilter] = useState('all'); // 'all' | 'dims' | 'onDemand'
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  /* price range — derived from data */
  const priceExtent = useMemo(() => {
    if (!products) return [0, 1000];
    const prices = products.filter(p => !p.onDemand && p.price != null).map(p => Number(p.price));
    if (!prices.length) return [0, 1000];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);
  const [priceLow, setPriceLow] = useState(null);
  const [priceHigh, setPriceHigh] = useState(null);
  const effectiveLow = priceLow ?? priceExtent[0];
  const effectiveHigh = priceHigh ?? priceExtent[1];

  /* close sort dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* fetch */
  useEffect(() => {
    let alive = true;
    api.get('/products?limit=200&page=1')
      .then(data => { if (alive) { setProducts(data.items || []); setError(null); } })
      .catch(err => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  /* filter + sort */
  const filtered = useMemo(() => {
    if (!products) return [];
    let arr = [...products];
    if (q) {
      const lc = q.toLowerCase();
      arr = arr.filter(p => p.name?.toLowerCase().includes(lc) || p.category?.toLowerCase().includes(lc));
    }
    if (selCats.length) arr = arr.filter(p => selCats.includes(p.category));
    if (dimFilter === 'dims') arr = arr.filter(p => !p.onDemand && (p.width || p.height || p.length));
    if (dimFilter === 'onDemand') arr = arr.filter(p => p.onDemand);
    if (minOrder != null) arr = arr.filter(p => (p.minimumOrder || 1) >= minOrder);
    /* price range — only apply to non-onDemand */
    arr = arr.filter(p => {
      if (p.onDemand) return true;
      const pr = Number(p.price) || 0;
      return pr >= effectiveLow && pr <= effectiveHigh;
    });

    const dir = sort.startsWith('-') ? -1 : 1;
    const key = sort.replace(/^-/, '');
    arr.sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return arr;
  }, [products, q, selCats, sort, effectiveLow, effectiveHigh, minOrder, dimFilter]);

  const toggleCat = useCallback((c) => {
    setSelCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }, []);

  const activeFilterCount = selCats.length + (minOrder != null ? 1 : 0)
    + (dimFilter !== 'all' ? 1 : 0)
    + ((priceLow != null || priceHigh != null) ? 1 : 0);

  const resetFilters = () => { setSelCats([]); setMinOrder(null); setDimFilter('all'); setPriceLow(null); setPriceHigh(null); };

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (products === null && !error) {
    return (
      <section className="mkp-section">
        <div className="mkp-section__inner">
          <div className="mkp-toolbar"><div className="mk-skel mk-skel--text-lg" style={{ width: 220 }} /></div>
          <div className="mkp-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="mkp-card mkp-card--skel">
                <div className="mk-skel mk-skel--block" />
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

  /* ── RENDER ───────────────────────────────────────────────────────────── */
  return (
    <section className="mkp-section">
      <div className="mkp-section__inner">
        {/* Header */}
        <div className="mkp-header">
          <div>
            <span className="mk-eyebrow">المتجر الإلكتروني</span>
            <h1 className="mk-h2">منتجاتنا <span className="mk-hl">الدعائية</span></h1>
            <p className="mk-sub">تصفّح كامل كتالوج المنتجات والخدمات الإعلانية.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mkp-toolbar">
          <div className="mkp-toolbar__search-wrap">
            <svg className="mkp-toolbar__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="ابحث بالاسم أو الفئة…"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="mkp-toolbar__search"
            />
            <div className="mkp-search-kbd">
              <kbd>⌘</kbd>
              <span>+</span>
              <kbd>K</kbd>
            </div>
          </div>

          <div className="mkp-toolbar__controls">
            {/* View toggle */}
            <div className="mkp-viewtoggle">
              <button type="button" className={`mkp-viewtoggle__btn ${view === 'grid' ? 'is-active' : ''}`}
                onClick={() => setView('grid')} aria-label="عرض شبكي">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </button>
              <button type="button" className={`mkp-viewtoggle__btn ${view === 'list' ? 'is-active' : ''}`}
                onClick={() => setView('list')} aria-label="عرض قائمة">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="mkp-sort" ref={sortRef}>
              <button type="button" className={`mkp-sort__trigger ${sortOpen ? 'is-open' : ''}`}
                onClick={() => setSortOpen(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M6 12h12M9 18h6" />
                </svg>
                {SORT_OPTIONS.find(s => s.value === sort)?.label ?? 'ترتيب حسب'}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {sortOpen && (
                <div className="mkp-sort__dropdown">
                  {SORT_OPTIONS.map(s => (
                    <button key={s.value} type="button"
                      className={`mkp-sort__option ${sort === s.value ? 'is-active' : ''}`}
                      onClick={() => { setSort(s.value); setSortOpen(false); }}>
                      {s.label}
                      {sort === s.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter toggle */}
            <button type="button" className={`mkp-filter-btn ${filterOpen ? 'is-open' : ''}`}
              onClick={() => setFilterOpen(v => !v)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              عرض فقط
              {activeFilterCount > 0 && <span className="mkp-filter-btn__count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {error && <div className="mkp-error">⚠ {error}</div>}

        {/* Layout: sidebar + grid */}
        <div className={`mkp-layout ${filterOpen ? 'has-panel' : ''}`}>
          {/* ── Filter panel ─────────────────────────────────────────── */}
          {filterOpen && (
            <aside className="mkp-panel">
              <div className="mkp-panel__head">
                <h3>تصفية المنتجات</h3>
                {activeFilterCount > 0 && (
                  <button type="button" className="mkp-panel__reset" onClick={resetFilters}>
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mkp-panel__section">
                <h4 className="mkp-panel__label">الفئة</h4>
                <div className="mkp-panel__chips">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button"
                      className={`mkp-chip ${selCats.includes(c) ? 'is-active' : ''}`}
                      onClick={() => toggleCat(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mkp-panel__section">
                <h4 className="mkp-panel__label">نطاق السعر</h4>
                <RangeSlider
                  min={priceExtent[0]} max={priceExtent[1]}
                  low={effectiveLow} high={effectiveHigh}
                  onLow={v => setPriceLow(v)} onHigh={v => setPriceHigh(v)}
                />
              </div>

              {/* Min order */}
              <div className="mkp-panel__section">
                <h4 className="mkp-panel__label">الحد الأدنى للطلب</h4>
                <div className="mkp-panel__minorder">
                  {MIN_ORDER_OPTIONS.map(n => (
                    <button key={n} type="button"
                      className={`mkp-minorder-btn ${minOrder === n ? 'is-active' : ''}`}
                      onClick={() => setMinOrder(minOrder === n ? null : n)}>
                      {n}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions / On Demand */}
              <div className="mkp-panel__section">
                <h4 className="mkp-panel__label">نوع المنتج</h4>
                <div className="mkp-panel__dimbtns">
                  {[
                    { v: 'all', l: 'الكل' },
                    { v: 'dims', l: 'بمقاسات محددة' },
                    { v: 'onDemand', l: 'حسب الطلب' },
                  ].map(d => (
                    <button key={d.v} type="button"
                      className={`mkp-dim-btn ${dimFilter === d.v ? 'is-active' : ''}`}
                      onClick={() => setDimFilter(d.v)}>
                      {d.l}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* ── Products area ────────────────────────────────────────── */}
          <div className="mkp-products-area">
            <p className="mkp-results-count">{filtered.length} منتج</p>

            {filtered.length === 0 ? (
              <div className="mkp-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <p className="mkp-empty__title">لا توجد منتجات مطابقة</p>
                <p className="mkp-empty__hint">حاول تعديل معايير البحث أو التصفية.</p>
              </div>
            ) : view === 'grid' ? (
              <div className="mkp-grid">
                {filtered.map(p => <ProductGridCard key={p.id || p._id} p={p} />)}
              </div>
            ) : (
              <div className="mkp-list">
                {filtered.map(p => <ProductListRow key={p.id || p._id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
