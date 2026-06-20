import React, { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../../../lib/api.js';
import Price from '../../Price.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import LoadingShell from '../shared/LoadingShell.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import Modal from '../shared/Modal.jsx';
import ProductForm from './ProductForm.jsx';

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

/**
 * Single grid card. Pulled out of the main render tree so each card owns its
 * own <video> ref and mouse-event handlers without polluting the parent.
 * Behaviour: video plays from t=0 on mouseEnter, pauses + resets on
 * mouseLeave. The first frame stays invisible because the parent's
 * .adm-product-card__hover rule keeps opacity:0 until hover.
 */
function ProductGridCard({ p, onOpen, onEditClick, onDeleteClick }) {
  const videoRef = useRef(null);
  const isVideo = !!p.animationMedia && /\/video\/upload\//i.test(p.animationMedia);

  const handleEnter = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    try { v.currentTime = 0; } catch {}
    const play = v.play();
    if (play && typeof play.catch === 'function') play.catch(() => { /* autoplay blocked — fine */ });
  };
  const handleLeave = () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch {}
  };

  return (
    <article
      className="adm-product-card"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="adm-product-card__media">
        <img src={p.mainImage} alt={p.name} loading="lazy" />
        {p.animationMedia && (isVideo ? (
          <video
            ref={videoRef}
            className="adm-product-card__hover"
            src={p.animationMedia}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={p.animationMedia}
            alt=""
            className="adm-product-card__hover"
            loading="lazy"
          />
        ))}
      </div>
      <div className="adm-product-card__body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
          <span className="adm-product-card__cat">{p.category}</span>
          {p.onDemand && (
            <span className="adm-badge adm-badge--yellow" style={{ fontSize: '0.66rem' }}>حسب الطلب</span>
          )}
        </div>
        <h3 className="adm-product-card__title">{p.name}</h3>
        <div className="adm-product-card__row">
          <span className="adm-product-card__price">
            {p.onDemand ? 'السعر حسب المقاسات' : <Price value={p.price} />}
          </span>
          <span className="adm-product-card__ref" dir="ltr">{p.reference}</span>
        </div>
        <div className="adm-product-card__meta" style={{ fontSize: '0.74rem', color: 'rgba(247,240,245,0.45)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span>الحد الأدنى: {p.minimumOrder || 1}</span>
          {(p.width || p.height || p.length) && (
            <span dir="ltr">
              {[p.width, p.height, p.length].filter(Boolean).join(' × ')} cm
            </span>
          )}
        </div>
        <div className="adm-product-card__actions">
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={(e) => { e.stopPropagation(); onEditClick(); }}
          >
            تعديل
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--danger adm-btn--sm"
            onClick={(e) => { e.stopPropagation(); onDeleteClick(); }}
          >
            حذف
          </button>
        </div>
      </div>
    </article>
  );
}

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'الأحدث أولًا' },
  { value: 'createdAt',  label: 'الأقدم أولًا' },
  { value: 'name',       label: 'الاسم (أ-ي)' },
  { value: '-name',      label: 'الاسم (ي-أ)' },
  { value: 'price',      label: 'السعر (تصاعدي)' },
  { value: '-price',     label: 'السعر (تنازلي)' },
  { value: 'prodTime',   label: 'زمن الإنتاج (الأقصر أولًا)' },
];

/**
 * ProductsPage — full CRUD for the catalog.
 *  • Grid (cards) ⇄ List (table) view toggle.
 *  • Filters: search, category, sort, price range.
 *  • Add / edit product (modal with ProductForm).
 *  • Delete with confirmation.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

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

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = async () => {
    try {
      const data = await api.get('/products?limit=200&page=1');
      setProducts(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    let arr = [...products];
    if (q) {
      const rx = q.toLowerCase();
      arr = arr.filter((p) =>
        p.name?.toLowerCase().includes(rx) ||
        p.reference?.toLowerCase().includes(rx)
      );
    }
    if (cat) arr = arr.filter((p) => p.category === cat);
    if (minPrice) arr = arr.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) arr = arr.filter((p) => p.price <= Number(maxPrice));

    const dir = sort.startsWith('-') ? -1 : 1;
    const key = sort.replace(/^-/, '');
    arr.sort((a, b) => {
      const av = a[key]; const bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return arr;
  }, [products, q, cat, sort, minPrice, maxPrice]);

  const handleDelete = async (p) => {
    try {
      await api.del(`/products/${p.id || p._id}`);
      setProducts((arr) => arr.filter((x) => (x.id || x._id) !== (p.id || p._id)));
      setConfirmDel(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (products === null && !error) {
    return (
      <div className="adm-page">
        <PageHeader title="المنتجات" />
        <LoadingShell rows={6} />
      </div>
    );
  }

  return (
    <div className="adm-page">
      <PageHeader
        eyebrow="إدارة الكتالوج"
        title="المنتجات"
        subtitle="إضافة، تعديل، وحذف المنتجات الدعائية المعروضة في المتجر."
      >
        <div className="adm-viewtoggle">
          <button
            type="button"
            className={`adm-viewtoggle__btn ${view === 'grid' ? 'is-active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="عرض شبكي"
            title="بطاقات"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </button>
          <button
            type="button"
            className={`adm-viewtoggle__btn ${view === 'list' ? 'is-active' : ''}`}
            onClick={() => setView('list')}
            aria-label="عرض قائمة"
            title="قائمة"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setAdding(true)}>
          + إضافة منتج
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="ابحث بالاسم أو المرجع…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="adm-input adm-input--search"
          />
          <div className="adm-search-kbd">
            <kbd>⌘</kbd>
            <span>+</span>
            <kbd>K</kbd>
          </div>
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="adm-input">
          <option value="">كل الفئات</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="adm-input">
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="السعر من"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="adm-input adm-input--narrow"
          dir="ltr"
        />
        <input
          type="number"
          placeholder="إلى"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="adm-input adm-input--narrow"
          dir="ltr"
        />
      </div>

      {error && <div className="adm-error">⚠ {error}</div>}

      {filtered.length === 0 ? (
        <EmptyState message="لا يوجد بيانات لهذه الصفحة" hint="ابدأ بإضافة منتج جديد." />
      ) : view === 'grid' ? (
        <div className="adm-products-grid">
          {filtered.map((p) => (
            <ProductGridCard
              key={p.id || p._id}
              p={p}

              onOpen={() => setEditing(p)}
              onEditClick={() => setEditing(p)}
              onDeleteClick={() => setConfirmDel(p)}
            />
          ))}
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>الحد الأدنى</th>
                <th>المقاسات</th>
                <th>زمن الإنتاج</th>
                <th>المرجع</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id || p._id} className="adm-table__row" onClick={() => setEditing(p)}>
                  <td>
                    <div className="adm-table__user">
                      <span className="adm-table__thumb">
                        <img src={p.mainImage} alt="" />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {p.name}
                        {p.onDemand && (
                          <span className="adm-badge adm-badge--yellow" style={{ fontSize: '0.66rem' }}>حسب الطلب</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.onDemand ? '—' : <Price value={p.price} />}</td>
                  <td>{p.minimumOrder || 1}</td>
                  <td dir="ltr" style={{ fontSize: '0.82rem' }}>
                    {(p.width || p.height || p.length)
                      ? `${[p.width, p.height, p.length].filter(Boolean).join(' × ')} cm`
                      : '—'}
                  </td>
                  <td>{p.prodTime}</td>
                  <td dir="ltr">{p.reference}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setConfirmDel(p)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="إضافة منتج جديد" size="lg">
        <ProductForm
          onCancel={() => setAdding(false)}
          onSaved={(p) => { setAdding(false); setProducts((arr) => [p, ...(arr || [])]); }}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="تعديل المنتج" size="lg">
        {editing && (
          <ProductForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={(p) => {
              setEditing(null);
              setProducts((arr) => arr.map((x) => (x.id || x._id) === (p.id || p._id) ? p : x));
            }}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="حذف المنتج">
        {confirmDel && (
          <>
            <p>هل أنت متأكد من حذف <strong>{confirmDel.name}</strong>؟ سيتم حذف الصور من Cloudinary أيضًا. لا يمكن التراجع عن هذه العملية.</p>
            <div className="adm-form__actions">
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmDel(null)}>إلغاء</button>
              <button type="button" className="adm-btn adm-btn--danger" onClick={() => handleDelete(confirmDel)}>تأكيد الحذف</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
