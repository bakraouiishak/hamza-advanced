import { useEffect } from 'react';

/**
 * useClickOutside — closes a popover when the user clicks anywhere outside
 * its container, or presses Escape. Used by the navbar's three dropdowns
 * (UserMenu, NotificationsDropdown, CartDropdown) so we don't repeat the
 * same boilerplate three times.
 */
export default function useClickOutside(ref, onClose) {
  useEffect(() => {
    if (!onClose) return;
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, onClose]);
}
