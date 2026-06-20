import React from 'react';
import OrdersList from '../OrdersList.jsx';

/**
 * ActiveOrdersTab — Pending + Accepted orders.
 *
 * The only mutating action available here is "cancel" (Pending only), wired
 * to POST /api/account/orders/:id/cancel which flips the status to
 * Rejected server-side. Accepted orders are READ-ONLY at this scope —
 * once the admin has accepted the work it's in production and the customer
 * can't pull it back.
 */
export default function ActiveOrdersTab() {
  return (
    <div className="acc-pane">
      <header className="acc-pane__head">
        <h2>الطلبات الحالية</h2>
        <p>الطلبات قيد الانتظار أو التي تم قبولها. يمكنك إلغاء الطلب طالما لم تتم الموافقة عليه بعد.</p>
      </header>
      <OrdersList
        statuses={['Pending', 'Accepted']}
        empty={{
          title: 'لا توجد طلبات نشطة',
          hint: 'كل طلباتك المكتملة في سجل الطلبات. لإنشاء طلب جديد، تصفّح المتجر.',
        }}
        action="cancel"
      />
    </div>
  );
}
