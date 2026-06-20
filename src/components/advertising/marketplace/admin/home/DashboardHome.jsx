import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../../../lib/api.js';
import { fmtInt, fmtMoney } from '../../../../../lib/format.js';
import Price from '../../Price.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import LoadingShell from '../shared/LoadingShell.jsx';
import StatCard from './StatCard.jsx';
import RevenueChart from './RevenueChart.jsx';
import StatusDonut from './StatusDonut.jsx';
import TopProductsBar from './TopProductsBar.jsx';
import RecentActivity from './RecentActivity.jsx';

const POLL_INTERVAL_MS = 20_000;

/**
 * DashboardHome — the admin landing page.
 *
 * Fetches /api/dashboard/stats on mount and re-fetches every 20s for the
 * near-real-time feel the brief asked for. While polling, the UI does NOT
 * flash a loader — only the very first load shows a skeleton.
 */
export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const initial = useRef(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await api.get('/dashboard/stats');
        if (alive) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err.message || 'تعذّر تحميل الإحصائيات');
      } finally {
        initial.current = false;
      }
    };
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (!stats && initial.current) {
    return (
      <div className="adm-page">
        <PageHeader
          eyebrow="نظرة عامة"
          title="الرئيسية"
          subtitle="ملخّص فوري لأداء المتجر — يُحدّث تلقائيًا كل 20 ثانية."
        />
        <LoadingShell />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="adm-page">
        <PageHeader title="الرئيسية" />
        <div className="adm-error">⚠ {error}</div>
      </div>
    );
  }

  const { totals, charts, recent } = stats;

  return (
    <div className="adm-page">
      <PageHeader
        eyebrow="نظرة عامة"
        title="الرئيسية"
        subtitle="ملخّص فوري لأداء المتجر — يُحدّث تلقائيًا كل ٢٠ ثانية."
      />

      {/* 4 KPI cards */}
      <div className="adm-kpis">
        <StatCard
          label="إجمالي المنتجات"
          value={fmtInt(totals.products)}
          hint="في الكتالوج"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          }
        />
        <StatCard
          label="إجمالي العملاء"
          value={fmtInt(totals.customers)}
          hint={`${fmtInt(totals.admins)} مدير`}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="10" cy="7" r="4" />
            </svg>
          }
        />
        <StatCard
          label="طلبات قيد الانتظار"
          value={fmtInt(totals.orders.pending)}
          hint={`من إجمالي ${fmtInt(totals.orders.total)}`}
          accent="amber"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <StatCard
          label="إيراد آخر 30 يومًا"
          value={<Price value={totals.revenue.last30d} />}
          hint={`إجمالي: ${fmtMoney(totals.revenue.total)}`}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* Charts row 1 */}
      <div className="adm-grid adm-grid--2">
        <RevenueChart  data={charts.revenueByDay} />
        <StatusDonut   data={charts.ordersByStatus} />
      </div>

      {/* Charts row 2 */}
      <div className="adm-grid adm-grid--2">
        <TopProductsBar data={charts.topProducts} />
        <RecentActivity
          recentOrders={recent.orders}
          recentCustomers={recent.customers}
        />
      </div>
    </div>
  );
}
