import { useEffect, useState } from 'react';
import { api } from '../../../lib/api.js';

/**
 * useHomeFeed — single fetch of GET /api/marketplace/home shared by all
 * homepage sections (categories, carousel, packs). One round-trip, three
 * components hydrated. Returns `{ data, error, loading }`.
 *
 * Each consumer falls back to its existing skeleton until `data` arrives,
 * so the page still renders something on first paint and during slow
 * networks.
 */
export default function useHomeFeed() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    api.get('/marketplace/home')
      .then((d) => { if (alive) setData(d); })
      .catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, []);

  return { data, error, loading: !data && !error };
}
