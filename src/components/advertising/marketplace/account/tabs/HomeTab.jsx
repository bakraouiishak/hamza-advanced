import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../../lib/api.js';
import { fmtInt, fmtNum, fmtRelative } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import Sparkline from '../charts/Sparkline.jsx';
import StatusDonut from '../charts/StatusDonut.jsx';

/**
 * HomeTab — customer's purchase dashboard.
 *
 * Layout:
 *   ┌──────────── KPI strip (4 cards) ────────────┐
 *   │ Total spent  • Done orders • In-flight • Items │
 *   ├──────────────────────┬──────────────────────┤
 *   │  14-day spend         │   Status mix donut    │
 *   │  (sparkline)          │   (4-slice gauge)     │
 *   ├──────────────────────┴──────────────────────┤
 *   │           Recent orders (5 most recent)        │
 *   ├────────────────────────────────────────────┤
 *   │           Top products you ordered            │
 *   └────────────────────────────────────────────┘
 *
 * Each block degrades gracefully — if the customer hasn't ordered yet,
 * empty states with friendly Arabic copy fill in. No external chart libs.
 */
const STATUS_LABEL = {
  Pending:  'قيد الانتظار',
  Accepted: 'مقبول',
  Done:     'مكتمل',
  Rejected: 'مرفوض',
};
const STATUS_COLOR = {
  Pending:  '#FEFC4F',
  Accepted: '#5BD8E8',
  Done:     '#13BD84',
  Rejected: '#FF7A93',
};

export default function HomeTab() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    api.get('/account/me/stats')
      .then((d) => { if (alive) setStats(d); })
      .catch((e) => alive && setErr(e.message));
    return () => { alive = false; };
  }, []);

  if (err) return <div className="acc-empty acc-empty--error">تعذّر تحميل البيانات: {err}</div>;
  if (!stats) return <HomeSkeleton />;

  const { totals, charts, recent } = stats;
  const empty = totals.orders.total === 0;

  return (
    <div className="acc-home">
      {/* — KPI strip — */}
      <div className="acc-kpis">
        <KpiCard
          label="إجمالي المصاريف"
          value={<Price value={totals.spend.total} />}
          hint={`في آخر 30 يوم: ${fmtNum(totals.spend.last30d)} ﷼`}
          accent
        />
        <KpiCard
          label="طلبات مكتملة"
          value={fmtInt(totals.orders.done)}
          hint={`${fmtInt(totals.units)} قطعة مُسلَّمة`}
        />
        <KpiCard
          label="طلبات قيد التنفيذ"
          value={fmtInt(totals.orders.pending + totals.orders.accepted)}
          hint={`${totals.orders.pending} قيد الانتظار · ${totals.orders.accepted} مقبول`}
        />
        <KpiCard
          label="إجمالي الطلبات"
          value={fmtInt(totals.orders.total)}
          hint={empty ? 'لم تطلب بعد — جرّب المتجر!' : 'منذ بداية عضويتك'}
        />
      </div>

      {/* — Charts row — */}
      <div className="acc-charts">
        <article className="acc-card acc-card--chart">
          <header className="acc-card__head">
            <h3>المصاريف خلال آخر 14 يوم</h3>
            <span className="acc-card__hint">إجمالي يومي للطلبات المكتملة</span>
          </header>
          <Sparkline data={charts.spendByDay} />
        </article>

        <article className="acc-card acc-card--chart">
          <header className="acc-card__head">
            <h3>توزيع حالات الطلبات</h3>
            <span className="acc-card__hint">منذ بداية حسابك</span>
          </header>
          <StatusDonut data={charts.ordersByStatus} />
        </article>
      </div>

      {/* — Recent orders — */}
      <article className="acc-card">
        <header className="acc-card__head">
          <h3>آخر طلباتك</h3>
          {recent.orders.length > 0 && (
            <Link to="/sectors/advertising/marketplace/orders" className="acc-card__link">
              عرض الكل
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </Link>
          )}
        </header>
        {recent.orders.length === 0 ? (
          <div className="acc-card__empty">
            <p>لا يوجد نشاط بعد — تصفّح المتجر وأضف منتجك الأول إلى السلة.</p>
            <Link to="/sectors/advertising/marketplace/products" className="acc-cta">
              تصفّح المنتجات
            </Link>
          </div>
        ) : (
          <ul className="acc-recent">
            {recent.orders.map((o) => (
              <li key={o._id} className="acc-recent__row">
                <span
                  className="acc-recent__dot"
                  style={{ background: STATUS_COLOR[o.status] }}
                  aria-hidden
                />
                <div className="acc-recent__body">
                  <strong>طلب #{(o._id || '').slice(-6).toUpperCase()}</strong>
                  <span className="acc-recent__meta">
                    {(o.items || []).length} عناصر · {fmtRelative(o.createdDate)}
                  </span>
                </div>
                <span
                  className="acc-recent__status"
                  style={{ color: STATUS_COLOR[o.status], borderColor: STATUS_COLOR[o.status] }}
                >
                  {STATUS_LABEL[o.status]}
                </span>
                <span className="acc-recent__price">
                  {o.needsQuote
                    ? <em>قيد التسعير</em>
                    : <Price value={o.totalPrice} />}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* — Top products — */}
      {charts.topProducts.length > 0 && (
        <article className="acc-card">
          <header className="acc-card__head">
            <h3>منتجاتك الأكثر طلبًا</h3>
            <span className="acc-card__hint">حسب عدد القطع المُسلَّمة</span>
          </header>
          <ul className="acc-tops">
            {charts.topProducts.map((p, i) => (
              <li key={p.productId} className="acc-tops__row">
                <span className="acc-tops__rank">{i + 1}</span>
                <span className="acc-tops__thumb">
                  {p.mainImage ? <img src={p.mainImage} alt="" /> : <span>—</span>}
                </span>
                <span className="acc-tops__name">{p.name}</span>
                <span className="acc-tops__count">{fmtInt(p.units)} قطعة</span>
                <div className="acc-tops__bar" style={{
                  '--pct': `${(p.units / charts.topProducts[0].units) * 100}%`,
                }} />
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}

function KpiCard({ label, value, hint, accent }) {
  return (
    <article className={`acc-kpi ${accent ? 'is-accent' : ''}`}>
      <span className="acc-kpi__label">{label}</span>
      <strong className="acc-kpi__value">{value}</strong>
      {hint && <span className="acc-kpi__hint">{hint}</span>}
    </article>
  );
}

function HomeSkeleton() {
  return (
    <div className="acc-home">
      <div className="acc-kpis">
        {[0, 1, 2, 3].map((i) => <div key={i} className="acc-kpi acc-kpi--skel" />)}
      </div>
      <div className="acc-charts">
        <div className="acc-card acc-card--skel" />
        <div className="acc-card acc-card--skel" />
      </div>
      <div className="acc-card acc-card--skel" style={{ height: 200 }} />
    </div>
  );
}
