import React, { useEffect, useMemo, useState, useRef } from 'react';
import { api } from '../../../../../lib/api.js';
import { fmtDateTime } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import LoadingShell from '../shared/LoadingShell.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import OrderDetailOverlay from './OrderDetailOverlay.jsx';

const STATUS_OPTIONS = [
  { value: '',         label: 'كل الحالات' },
  { value: 'Pending',  label: 'قيد الانتظار' },
  { value: 'Accepted', label: 'مقبول' },
  { value: 'Done',     label: 'مكتمل' },
  { value: 'Rejected', label: 'مرفوض' },
];

const SORT_OPTIONS = [
  { value: '-createdDate', label: 'الأحدث أولًا' },
  { value: 'createdDate',  label: 'الأقدم أولًا' },
  { value: '-totalPrice',  label: 'الأعلى سعرًا' },
  { value: 'totalPrice',   label: 'الأقل سعرًا' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');           // 'grid' | 'list'
  const [openOrderId, setOpenOrderId] = useState(null);

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

  // Filters
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('-createdDate');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');

  const load = async () => {
    try {
      const data = await api.get('/orders?limit=200&page=1');
      setOrders(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    let arr = [...orders];
    if (q) {
      const rx = q.toLowerCase();
      arr = arr.filter((o) => {
        const c = o.customer || {};
        return (
          (c.name + ' ' + c.surname).toLowerCase().includes(rx) ||
          c.email?.toLowerCase().includes(rx) ||
          (o.id || o._id || '').toLowerCase().includes(rx)
        );
      });
    }
    if (status) arr = arr.filter((o) => o.status === status);
    if (minTotal) arr = arr.filter((o) => o.totalPrice >= Number(minTotal));
    if (maxTotal) arr = arr.filter((o) => o.totalPrice <= Number(maxTotal));

    const dir = sort.startsWith('-') ? -1 : 1;
    const key = sort.replace(/^-/, '');
    arr.sort((a, b) => {
      const av = a[key]; const bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return arr;
  }, [orders, q, status, sort, minTotal, maxTotal]);

  if (orders === null && !error) {
    return (
      <div className="adm-page">
        <PageHeader title="الطلبات" />
        <LoadingShell rows={5} />
      </div>
    );
  }

  return (
    <div className="adm-page">
      <PageHeader
        eyebrow="إدارة العمليات"
        title="الطلبات"
        subtitle="استعراض كل الطلبات الواردة، تحديث الحالات، وتعديل عناصر السلال."
      >
        <div className="adm-viewtoggle">
          <button
            type="button"
            className={`adm-viewtoggle__btn ${view === 'grid' ? 'is-active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="بطاقات"
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
            aria-label="قائمة"
            title="قائمة"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="ابحث برقم الطلب، اسم العميل، أو البريد…"
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
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="adm-input">
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="adm-input">
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="الإجمالي من"
          value={minTotal}
          onChange={(e) => setMinTotal(e.target.value)}
          className="adm-input adm-input--narrow"
          dir="ltr"
        />
        <input
          type="number"
          placeholder="إلى"
          value={maxTotal}
          onChange={(e) => setMaxTotal(e.target.value)}
          className="adm-input adm-input--narrow"
          dir="ltr"
        />
      </div>

      {error && <div className="adm-error">⚠ {error}</div>}

      {filtered.length === 0 ? (
        <EmptyState message="لا يوجد بيانات لهذه الصفحة" hint="لم تُسجَّل أي طلبات بعد." />
      ) : view === 'list' ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>عدد العناصر</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id || o._id} className="adm-table__row" onClick={() => setOpenOrderId(o.id || o._id)}>
                  <td><code>{(o.id || o._id || '').slice(-6).toUpperCase()}</code></td>
                  <td>
                    <div className="adm-table__user">
                      <span className="adm-table__avatar">
                        {o.customer?.profileImg
                          ? <img src={o.customer.profileImg} alt="" />
                          : (o.customer?.name?.[0] || '?')}
                      </span>
                      <span>{o.customer ? `${o.customer.name} ${o.customer.surname}` : 'مستخدم محذوف'}</span>
                    </div>
                  </td>
                  <td>{(o.items || []).length}</td>
                  <td><Price value={o.totalPrice} /></td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td>{fmtDateTime(o.createdDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="adm-orders-grid">
          {filtered.map((o) => (
            <article
              key={o.id || o._id}
              className="adm-order-card"
              onClick={() => setOpenOrderId(o.id || o._id)}
            >
              <div className="adm-order-card__head">
                <div className="adm-table__user">
                  <span className="adm-table__avatar">
                    {o.customer?.profileImg
                      ? <img src={o.customer.profileImg} alt="" />
                      : (o.customer?.name?.[0] || '?')}
                  </span>
                  <div>
                    <p className="adm-order-card__name">
                      {o.customer ? `${o.customer.name} ${o.customer.surname}` : 'مستخدم محذوف'}
                    </p>
                    <p className="adm-order-card__id">
                      <code>#{(o.id || o._id || '').slice(-6).toUpperCase()}</code>
                    </p>
                  </div>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
              <div className="adm-order-card__body">
                <div className="adm-order-card__row">
                  <span>عدد العناصر</span>
                  <strong>{(o.items || []).length}</strong>
                </div>
                <div className="adm-order-card__row">
                  <span>الإجمالي</span>
                  <strong className="adm-order-card__total"><Price value={o.totalPrice} /></strong>
                </div>
                <div className="adm-order-card__row">
                  <span>التاريخ</span>
                  <span>{fmtDateTime(o.createdDate)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {openOrderId && (
        <OrderDetailOverlay
          orderId={openOrderId}
          onClose={() => setOpenOrderId(null)}
          onChanged={(updated) => {
            setOrders((arr) => arr.map((x) => (x.id || x._id) === (updated.id || updated._id) ? { ...x, ...updated } : x));
          }}
          onDeleted={() => {
            setOrders((arr) => arr.filter((x) => (x.id || x._id) !== openOrderId));
            setOpenOrderId(null);
          }}
        />
      )}
    </div>
  );
}
