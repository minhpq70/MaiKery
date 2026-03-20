"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { CartItem, CartState } from "@/types";

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productId === action.item.productId);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, action.item];
      }
      return calcTotals({ ...state, items: newItems });
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((i) => i.productId !== action.productId);
      return calcTotals({ ...state, items: newItems });
    }
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        const newItems = state.items.filter((i) => i.productId !== action.productId);
        return calcTotals({ ...state, items: newItems });
      }
      const newItems = state.items.map((i) =>
        i.productId === action.productId ? { ...i, quantity: action.quantity } : i
      );
      return calcTotals({ ...state, items: newItems });
    }
    case "CLEAR_CART":
      return { items: [], totalItems: 0, subtotal: 0 };
    case "LOAD_CART":
      return calcTotals({ ...state, items: action.items });
    default:
      return state;
  }
}

function calcTotals(state: CartState): CartState {
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { ...state, totalItems, subtotal };
}

const CartContext = createContext<{
  cart: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    subtotal: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maikery_cart");
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: "LOAD_CART", items });
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("maikery_cart", JSON.stringify(cart.items));
  }, [cart.items]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
        removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
        updateQty: (productId, quantity) =>
          dispatch({ type: "UPDATE_QTY", productId, quantity }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
