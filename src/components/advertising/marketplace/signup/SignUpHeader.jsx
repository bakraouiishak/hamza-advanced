import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SignUpHeader — replaces the navbar on the sign-up page.
 * Identical structure to SignInHeader: brand logo on the start side, a pill
 * "back to marketplace" link on the end side.
 */
export default function SignUpHeader() {
  return (
    <div className="si-header">
      <Link to="/sectors/advertising" className="si-header__logo">
        <img
          src="/images/logos svg/hamza advanced advertising marketplace svg.svg"
          alt="الهمزة المتطورة — للدعاية والإعلان"
        />
      </Link>

      <Link to="/sectors/advertising/marketplace" className="si-header__back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        العودة للمتجر
      </Link>
    </div>
  );
}
