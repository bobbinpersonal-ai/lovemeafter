'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

/**
 * Client-side cart state for the storefront build-out.
 *
 * This manages line items locally (persisted to localStorage) rather than
 * calling Shopify's Cart API, because the app is currently running against
 * mock product data (see lib/shopify.js). The action surface below
 * (ADD_ITEM / REMOVE_ITEM / UPDATE_QUANTITY) is intentionally shaped like a
 * Cart API integration so swapping in real `cartCreate` / `cartLinesAdd` /
 * `cartLinesUpdate` mutations later is a lib-level change, not a
 * component-level rewrite.
 */

const CartContext = createContext(null);
const STORAGE_KEY = 'lma_cart_v1';
export const FREE_SHIPPING_THRESHOLD = 300; // Matches the announcement bar copy.

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload || state;

    case 'ADD_ITEM': {
      const { variantId, product, variant, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.variantId === variantId);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            variantId,
            quantity,
            productHandle: product.handle,
            title: product.title,
            variantTitle: variant.title,
            price: Number(variant.price?.amount ?? product.price ?? 0),
            image: product.images?.[0]?.url ?? null,
          },
        ],
      };
    }

    case 'UPDATE_QUANTITY': {
      const { variantId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.variantId !== variantId) };
      }
      return {
        ...state,
        items: state.items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)),
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.variantId !== action.payload.variantId) };

    case 'SET_DRAWER_OPEN':
      return { ...state, isDrawerOpen: action.payload };

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

const initialState = { items: [], isDrawerOpen: false };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'HYDRATE', payload: { ...parsed, isDrawerOpen: false } });
      }
    } catch {
      // Corrupt/unavailable storage -- fall back to an empty cart silently.
    }
  }, []);

  // Persist items (not drawer-open state) whenever they change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // Storage unavailable (private browsing, quota) -- non-fatal.
    }
  }, [state.items]);

  const addItem = useCallback((product, variant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { variantId: variant.id, product, variant, quantity } });
    dispatch({ type: 'SET_DRAWER_OPEN', payload: true });
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } });
  }, []);

  const removeItem = useCallback((variantId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { variantId } });
  }, []);

  const openDrawer = useCallback(() => dispatch({ type: 'SET_DRAWER_OPEN', payload: true }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'SET_DRAWER_OPEN', payload: false }), []);

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      isDrawerOpen: state.isDrawerOpen,
      subtotal,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      openDrawer,
      closeDrawer,
    }),
    [state.items, state.isDrawerOpen, subtotal, itemCount, addItem, updateQuantity, removeItem, openDrawer, closeDrawer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
