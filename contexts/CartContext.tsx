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
  addToCart: (item: Omit<CartItem, 'customizationTotal' | 'itemTotal'> & { customizations?: CartCustomization[]; quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
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
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = useCallback(
    (raw: Omit<CartItem, 'customizationTotal' | 'itemTotal'> & { customizations?: CartCustomization[]; quantity?: number }) => {
      const customizations = raw.customizations ?? [];
      const quantity = raw.quantity ?? 1;
      const customizationTotal = customizations.reduce((acc, c) => acc + (c.assetPrice ?? 0), 0) * quantity;
      const itemTotal = (raw.basePrice * quantity) + customizationTotal;

      const newItem: CartItem = { ...raw, quantity, customizations, customizationTotal, itemTotal };

      setItems((prev) => {
        const exists = prev.find((i) => i.itemId === raw.itemId && i.itemType === raw.itemType);
        if (exists) {
          if (raw.itemType === 'accessory') {
            return prev.map((item) => {
              if (item.itemId !== raw.itemId || item.itemType !== raw.itemType) return item;

              const mergedQuantity = item.quantity + quantity;
              const mergedCustomizationTotal = customizations.reduce((acc, c) => acc + (c.assetPrice ?? 0), 0) * mergedQuantity;

              return {
                ...item,
                quantity: mergedQuantity,
                customizations,
                customizationTotal: mergedCustomizationTotal,
                itemTotal: (item.basePrice * mergedQuantity) + mergedCustomizationTotal,
              };
            });
          }

          return prev.map((item) => (item.itemId === raw.itemId && item.itemType === raw.itemType ? newItem : item));
        }
        return [...prev, newItem];
      });
      setIsOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
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
