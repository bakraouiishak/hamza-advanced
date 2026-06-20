import React from 'react';
import OrdersList from '../OrdersList.jsx';

/**
 * HistoryTab — Done + Rejected orders.
 *
 * Customer can permanently delete entries from their own history. Active
 * orders cannot be deleted here — they have to be cancelled first via
 * ActiveOrdersTab (which flips them to Rejected, after which they show up
 * here and become deletable).
 */
export default function HistoryTab() {
  return (
    <div className="acc-pane">
      <header className="acc-pane__head">
        <h2>سجل الطلبات</h2>
        <p>كل طلباتك المكتملة أو المرفوضة. الحذف نهائي — لا يمكن استرجاع الطلب بعد إزالته من السجل.</p>
      </header>
      <OrdersList
        statuses={['Done', 'Rejected']}
        empty={{
          title: 'السجل فارغ',
          hint: 'ستظهر هنا طلباتك بعد إكمالها أو رفضها.',
        }}
        action="delete"
      />
    </div>
  );
}
