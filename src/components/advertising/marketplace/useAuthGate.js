import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth.jsx';

/**
 * useAuthGate — central hook used by every homepage CTA on the marketplace
 * landing page. Per the product brief, anonymous visitors who click ANY
 * interactive marketplace control (category card, product +, "اطلب الباقة",
 * etc.) get bounced to the sign-UP page (not sign-in) because the goal of
 * the homepage is acquisition.
 *
 * Usage:
 *   const { gate } = useAuthGate();
 *   <button onClick={() => gate(() => addItem(product))} />
 *
 * The callback runs immediately if the user is signed in; otherwise we
 * navigate to /signup carrying the current location as state so the signup
 * page can bounce the user back here after they finish onboarding.
 */
export default function useAuthGate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const gate = useCallback((onAuthed) => {
    if (user) {
      onAuthed?.();
      return true;
    }
    navigate('/sectors/advertising/marketplace/signup', {
      state: { from: { pathname: window.location.pathname + window.location.search } },
    });
    return false;
  }, [user, navigate]);

  return { gate, isAuthed: !!user };
}
