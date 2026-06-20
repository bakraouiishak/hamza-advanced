import React from 'react';
import { fmtRelative } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import EmptyState from '../shared/EmptyState.jsx';

const STATUS_TONE = {
  Pending:  'yellow',
  Accepted: 'cyan',
  Done:     'green',
  Rejected: 'rose',
};

/**
 * RecentActivity — side panel listing the 5 most recent orders and the
 * 5 most recent customer signups, each with relative timestamps.
 */
export default function RecentActivity({ recentOrders = [], recentCustomers = [] }) {
  return (
    <div className="adm-recent">
      <section className="adm-recent__col">
        <div className="adm-chart__head">
          <h3 className="adm-chart__title">آخر الطلبات</h3>
          <p className="adm-chart__sub">أحدث 5 طلبات في المتجر</p>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState message="لا يوجد بيانات لهذه الصفحة" />
        ) : (
          <ul className="adm-recent__list">
            {recentOrders.map((o) => (
              <li key={o.id || o._id} className="adm-recent__row">
                <div className="adm-recent__row-main">
                  <span className={`adm-badge adm-badge--${STATUS_TONE[o.status]}`}>{o.status}</span>
                  <span className="adm-recent__row-title">
                    {o.customer ? `${o.customer.name} ${o.customer.surname}` : 'مستخدم محذوف'}
                  </span>
                </div>
                <div className="adm-recent__row-meta">
                  <span><Price value={o.totalPrice} /></span>
                  <span className="adm-recent__row-time">{fmtRelative(o.createdDate)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="adm-recent__col">
        <div className="adm-chart__head">
          <h3 className="adm-chart__title">آخر العملاء</h3>
          <p className="adm-chart__sub">أحدث 5 عملاء انضموا للمتجر</p>
        </div>
        {recentCustomers.length === 0 ? (
          <EmptyState message="لا يوجد بيانات لهذه الصفحة" />
        ) : (
          <ul className="adm-recent__list">
            {recentCustomers.map((u) => (
              <li key={u.id || u._id} className="adm-recent__row">
                <div className="adm-recent__row-main">
                  <span className="adm-recent__avatar">
                    {u.profileImg
                      ? <img src={u.profileImg} alt="" />
                      : (u.name?.[0] || '?')}
                  </span>
                  <span className="adm-recent__row-title">{u.name} {u.surname}</span>
                </div>
                <div className="adm-recent__row-meta">
                  <span className="adm-recent__row-time">{fmtRelative(u.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
