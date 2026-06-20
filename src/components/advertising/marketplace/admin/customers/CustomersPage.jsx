import React, { useEffect, useMemo, useState, useRef } from 'react';
import { api } from '../../../../../lib/api.js';
import { fmtDate } from '../../../../../lib/format.js';
import PageHeader from '../shared/PageHeader.jsx';
import LoadingShell from '../shared/LoadingShell.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import Modal from '../shared/Modal.jsx';
import CustomerForm from './CustomerForm.jsx';
import CustomerDetail from './CustomerDetail.jsx';

/**
 * CustomersPage — table of all users with filters/sort, an "add customer"
 * button, and click-through to a CustomerDetail panel (replaces the
 * preview area while open).
 */
export default function CustomersPage() {
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(null);

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
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt'); // -field = DESC

  const load = async () => {
    try {
      const data = await api.get('/users?limit=200&page=1');
      setCustomers(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'تعذّر تحميل العملاء');
    }
  };

  useEffect(() => { load(); }, []);

  /* Client-side filter + sort over the loaded list. */
  const filtered = useMemo(() => {
    if (!customers) return [];
    let arr = [...customers];
    if (q) {
      const rx = q.toLowerCase();
      arr = arr.filter((c) =>
        (c.name + ' ' + c.surname).toLowerCase().includes(rx) ||
        c.email?.toLowerCase().includes(rx) ||
        c.phone?.toLowerCase().includes(rx)
      );
    }
    if (role) arr = arr.filter((c) => c.role === role);

    const dir = sortBy.startsWith('-') ? -1 : 1;
    const key = sortBy.replace(/^-/, '');
    arr.sort((a, b) => {
      const av = a[key]; const bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return arr;
  }, [customers, q, role, sortBy]);

  if (customers === null && !error) {
    return (
      <div className="adm-page">
        <PageHeader title="العملاء" subtitle="إدارة قاعدة عملاء المتجر." />
        <LoadingShell />
      </div>
    );
  }

  if (selected) {
    return (
      <div className="adm-page">
        <CustomerDetail
          customer={selected}
          onClose={() => setSelected(null)}
          onChanged={(u) => {
            setSelected(u);
            setCustomers((arr) => arr.map((x) => (x.id === u.id || x._id === u._id) ? u : x));
          }}
          onDeleted={() => {
            setCustomers((arr) => arr.filter((x) => (x.id || x._id) !== (selected.id || selected._id)));
            setSelected(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="adm-page">
      <PageHeader
        eyebrow="إدارة المستخدمين"
        title="العملاء"
        subtitle="إدارة قاعدة عملاء المتجر — إضافة، تعديل، حذف."
      >
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setAdding(true)}>
          + إضافة عميل
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search-wrap">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="ابحث بالاسم، البريد، أو الهاتف…"
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
        <select value={role} onChange={(e) => setRole(e.target.value)} className="adm-input">
          <option value="">كل الأدوار</option>
          <option value="Customer">عميل</option>
          <option value="Admin">مدير</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="adm-input">
          <option value="-createdAt">الأحدث أولًا</option>
          <option value="createdAt">الأقدم أولًا</option>
          <option value="name">الاسم (أ-ي)</option>
          <option value="-name">الاسم (ي-أ)</option>
          <option value="email">البريد (أ-ي)</option>
        </select>
      </div>

      {/* Empty / Table */}
      {error && <div className="adm-error">⚠ {error}</div>}

      {filtered.length === 0 ? (
        <EmptyState message="لا يوجد بيانات لهذه الصفحة" hint="أضف عميلاً جديدًا للبدء." />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>البريد</th>
                <th>الهاتف</th>
                <th>الدور</th>
                <th>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id || c._id} onClick={() => setSelected(c)} className="adm-table__row">
                  <td>
                    <div className="adm-table__user">
                      <span className="adm-table__avatar">
                        {c.profileImg
                          ? <img src={c.profileImg} alt="" />
                          : (c.name?.[0] || '?')}
                      </span>
                      <span>{c.name} {c.surname}</span>
                    </div>
                  </td>
                  <td dir="ltr">{c.email}</td>
                  <td dir="ltr">{c.phone}</td>
                  <td>
                    <span className={`adm-badge adm-badge--${c.role === 'Admin' ? 'yellow' : 'cyan'}`}>
                      {c.role === 'Admin' ? 'مدير' : 'عميل'}
                    </span>
                  </td>
                  <td>{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="إضافة عميل جديد" size="lg">
        <CustomerForm
          onCancel={() => setAdding(false)}
          onSaved={(u) => {
            setAdding(false);
            setCustomers((arr) => [u, ...(arr || [])]);
          }}
        />
      </Modal>
    </div>
  );
}
