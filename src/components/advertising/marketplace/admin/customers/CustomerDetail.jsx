import React, { useEffect, useState } from 'react';
import { api } from '../../../../../lib/api.js';
import { fmtDateTime } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import CustomerForm from './CustomerForm.jsx';
import Modal from '../shared/Modal.jsx';
import EmptyState from '../shared/EmptyState.jsx';

/**
 * CustomerDetail — preview window for one customer.
 *  • Top: profile card (avatar + identity + role badge + edit/delete).
 *  • Middle: customer-data table (full fields).
 *  • Bottom: their orders (latest 50, brief list).
 */
export default function CustomerDetail({ customer, onClose, onChanged, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [orders, setOrders] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoadingOrders(true);
    api.get(`/orders?limit=50&page=1`)
      .then((data) => {
        if (!alive) return;
        // Filter client-side since the listOrders endpoint already restricts
        // visibility for non-admins; for admins it returns all orders. We
        // need only those for THIS customer.
        const id = customer.id || customer._id;
        const mine = (data.items || []).filter(
          (o) => (o.customer?._id || o.customer?.id || o.customer) === id
        );
        setOrders(mine);
      })
      .catch(() => alive && setOrders([]))
      .finally(() => alive && setLoadingOrders(false));
    return () => { alive = false; };
  }, [customer]);

  const handleDelete = async () => {
    try {
      await api.del(`/users/${customer.id || customer._id}`);
      onDeleted?.(customer);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="adm-detail">
      <header className="adm-detail__head">
        <button type="button" className="adm-detail__close" onClick={onClose} aria-label="إغلاق">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="adm-detail__eyebrow">ملف العميل</p>
          <h2 className="adm-detail__title">{customer.name} {customer.surname}</h2>
        </div>
        <div className="adm-detail__actions">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setEditing(true)}>
            تعديل
          </button>
          <button type="button" className="adm-btn adm-btn--danger" onClick={() => setConfirmDel(true)}>
            حذف
          </button>
        </div>
      </header>

      {/* Profile summary */}
      <section className="adm-card">
        <div className="adm-customer-card">
          <div className="adm-customer-card__avatar">
            {customer.profileImg
              ? <img src={customer.profileImg} alt="" />
              : <span>{customer.name?.[0] || '?'}</span>}
          </div>
          <div className="adm-customer-card__body">
            <h3>{customer.name} {customer.surname}</h3>
            <p>{customer.email}</p>
            <span className={`adm-badge adm-badge--${customer.role === 'Admin' ? 'yellow' : 'cyan'}`}>
              {customer.role === 'Admin' ? 'مدير' : 'عميل'}
            </span>
          </div>
        </div>
      </section>

      {/* Data table */}
      <section className="adm-card">
        <h4 className="adm-card__title">بيانات العميل</h4>
        <dl className="adm-kv">
          <div><dt>الاسم الكامل</dt><dd>{customer.name} {customer.surname}</dd></div>
          <div><dt>البريد</dt><dd>{customer.email}</dd></div>
          <div><dt>الهاتف</dt><dd dir="ltr">{customer.phone}</dd></div>
          <div><dt>العنوان</dt><dd>{customer.address}</dd></div>
          <div><dt>كلمة المرور</dt><dd>•••••••• (محميّة)</dd></div>
          <div><dt>الدور</dt><dd>{customer.role === 'Admin' ? 'مدير' : 'عميل'}</dd></div>
          <div><dt>تاريخ التسجيل</dt><dd>{fmtDateTime(customer.createdAt)}</dd></div>
        </dl>
      </section>

      {/* Orders */}
      <section className="adm-card">
        <h4 className="adm-card__title">طلبات العميل</h4>
        {loadingOrders ? (
          <div className="adm-skeleton__bar adm-skeleton__bar--md" />
        ) : orders.length === 0 ? (
          <EmptyState message="لا يوجد بيانات لهذه الصفحة" hint="لم يقم هذا العميل بأي طلب بعد." />
        ) : (
          <ul className="adm-customer-orders">
            {orders.map((o) => (
              <li key={o.id || o._id}>
                <span className={`adm-badge adm-badge--${{Pending:'yellow',Accepted:'cyan',Done:'green',Rejected:'rose'}[o.status]}`}>
                  {o.status}
                </span>
                <span>{(o.items || []).length} عنصر</span>
                <span><Price value={o.totalPrice} /></span>
                <span className="adm-customer-orders__time">{fmtDateTime(o.createdDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="تعديل بيانات العميل" size="lg">
        <CustomerForm
          initial={customer}
          onCancel={() => setEditing(false)}
          onSaved={(u) => { setEditing(false); onChanged?.(u); }}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title="حذف العميل">
        <p>هل أنت متأكد من حذف <strong>{customer.name} {customer.surname}</strong>؟ لا يمكن التراجع عن هذه العملية.</p>
        <div className="adm-form__actions">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmDel(false)}>إلغاء</button>
          <button type="button" className="adm-btn adm-btn--danger" onClick={handleDelete}>تأكيد الحذف</button>
        </div>
      </Modal>
    </div>
  );
}
