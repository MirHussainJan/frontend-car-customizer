'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { CartItem, CartCustomization } from '../lib/types';

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'customizationTotal' | 'itemTotal'> & { customizations?: CartCustomization[] }) => void;
  removeFromCart: (vehicleId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'autoforge_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch (_) {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cartTotal = items.reduce((acc, item) => acc + item.itemTotal, 0);
  const cartCount = items.length;

  const addToCart = useCallback(
    (raw: Omit<CartItem, 'customizationTotal' | 'itemTotal'> & { customizations?: CartCustomization[] }) => {
      const customizations = raw.customizations ?? [];
      const customizationTotal = customizations.reduce((acc, c) => acc + (c.assetPrice ?? 0), 0);
      const itemTotal = raw.basePrice + customizationTotal;

      const newItem: CartItem = { ...raw, customizations, customizationTotal, itemTotal };

      setItems((prev) => {
        // Replace if same vehicle already in cart
        const exists = prev.find((i) => i.vehicleId === raw.vehicleId);
        if (exists) {
          return prev.map((i) => (i.vehicleId === raw.vehicleId ? newItem : i));
        }
        return [...prev, newItem];
      });
      setIsOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((vehicleId: string) => {
    setItems((prev) => prev.filter((i) => i.vehicleId !== vehicleId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
