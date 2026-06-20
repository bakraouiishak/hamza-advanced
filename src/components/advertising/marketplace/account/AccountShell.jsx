import React, { useState } from 'react';
import { useAuth } from '../../../../lib/auth.jsx';

import AccountSidebar from './AccountSidebar.jsx';
import HomeTab from './tabs/HomeTab.jsx';
import PictureTab from './tabs/PictureTab.jsx';
import PersonalTab from './tabs/PersonalTab.jsx';
import ActiveOrdersTab from './tabs/ActiveOrdersTab.jsx';
import HistoryTab from './tabs/HistoryTab.jsx';

/**
 * AccountShell — the two-pane layout used by every settings tab.
 *
 *  [right sidebar (RTL)]  |  [active tab panel]
 *
 * The sidebar holds the section navigation; the panel renders the active
 * tab's content. State lives here so switching tabs is instant (no router
 * round-trips, no scroll jumps) and each tab can keep its own internal
 * state alive while the user moves around.
 */
const TABS = {
  home:     { Component: HomeTab,         label: 'الرئيسية' },
  picture:  { Component: PictureTab,      label: 'الصورة الشخصية' },
  personal: { Component: PersonalTab,     label: 'البيانات الشخصية' },
  active:   { Component: ActiveOrdersTab, label: 'الطلبات الحالية' },
  history:  { Component: HistoryTab,      label: 'سجل الطلبات' },
};

export default function AccountShell() {
  const { user } = useAuth();
  const [tab, setTab] = useState('home');

  const ActiveTab = TABS[tab].Component;

  return (
    <section className="ad-scope acc-page">
      <div className="acc-page__inner">
        <header className="acc-page__head">
          <div>
            <span className="acc-page__eyebrow">حسابي</span>
            <h1 className="acc-page__title">
              مرحبًا، <span className="acc-page__title-name">{user?.name}</span>
            </h1>
            <p className="acc-page__sub">
              تحكّم في معلوماتك الشخصية، صورتك، طلباتك، وسجل تعاملاتك معنا.
            </p>
          </div>
        </header>

        <div className="acc-layout">
          <AccountSidebar active={tab} onPick={setTab} tabs={TABS} />
          <main className="acc-main" role="tabpanel" aria-labelledby={`acc-tab-${tab}`}>
            <ActiveTab />
          </main>
        </div>
      </div>
    </section>
  );
}
