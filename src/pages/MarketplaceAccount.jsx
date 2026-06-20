import React from 'react';
import { RequireAuth } from '../lib/auth.jsx';
import MarketNavbar from '../components/advertising/marketplace/MarketNavbar.jsx';
import MarketFooter from '../components/advertising/marketplace/MarketFooter.jsx';
import AccountShell from '../components/advertising/marketplace/account/AccountShell.jsx';

import '../styles/advertising.css';
import '../styles/advertising-marketplace.css';
import '../styles/advertising-marketplace-account.css';

/**
 * MarketplaceAccount — customer "حسابي" hub.
 *
 * Wraps the AccountShell (sidebar + active-tab panel) in the marketplace
 * chrome (navbar + footer) and gates everything behind RequireAuth.
 */
export default function MarketplaceAccount() {
  return (
    <RequireAuth>
      <MarketNavbar />
      <AccountShell />
      <MarketFooter />
    </RequireAuth>
  );
}
