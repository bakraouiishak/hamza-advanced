import React, { useEffect } from 'react';

/**
 * Modal — a simple full-screen overlay used by the order-detail viewer and
 * by the delete-confirmation dialog. Closes on Escape or click-outside.
 */
export default function Modal({ open, onClose, title = null, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="adm-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`adm-modal__panel adm-modal__panel--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="adm-modal__head">
            <h3 className="adm-modal__title">{title}</h3>
            <button type="button" className="adm-modal__close" onClick={onClose} aria-label="إغلاق">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        )}
        <div className="adm-modal__body">{children}</div>
      </div>
    </div>
  );
}
