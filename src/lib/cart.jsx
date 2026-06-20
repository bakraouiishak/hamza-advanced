import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * CartContext — client-side cart state.
 *
 * Persisted to localStorage under `hamza:cart` so the cart survives page
 * refreshes and tab restarts. Each entry stores a snapshot of the product
 * (id, name, price, mainImage, onDemand, minimumOrder) so the cart can
 * render even if the backend is briefly unreachable.
 *
 * Exposed API:
 *   items                          — array of { product, quantity }
 *   count                          — number of unique products
 *   totalQuantity                  — sum of all quantities
 *   addItem(product, qty=1)        — merges if product already in cart
 *   removeItem(productId)
 *   updateQty(productId, qty)
 *   clear()
 */
const CartCtx = createContext(null);
const STORAGE_KEY = 'hamza:cart';

function pid(p) { return p?.id || p?._id; }

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial);

  // Persist on every change.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => pid(it.product) === pid(product));
      const startQty = Math.max(1, Number(qty) || 1);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + startQty };
        return next;
      }
      return [...prev, { product, quantity: startQty }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => pid(it.product) !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    const n = Number(qty);
    if (!Number.isFinite(n) || n < 1) return removeItem(id);
    setItems((prev) => prev.map((it) => pid(it.product) === id ? { ...it, quantity: n } : it));
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.length, [items]);
  const totalQuantity = useMemo(
    () => items.reduce((s, it) => s + (it.quantity || 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, count, totalQuantity, addItem, removeItem, updateQty, clear }),
    [items, count, totalQuantity, addItem, removeItem, updateQty, clear]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart() must be called inside <CartProvider>');
  return ctx;
}
