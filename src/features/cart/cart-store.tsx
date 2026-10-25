"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { cartReducer, INITIAL_CART, type CartState } from "./cart-reducer";
import { BOOKING_KEY, CART_KEY, parseStoredBooking, parseStoredCart } from "./storage";
import { calculatePricing, type CartPricing } from "@/features/pricing/pricing";
import type { BookingRecord, CartItemData, ContactData } from "@/types";

interface CartContextValue {
  state: CartState;
  items: CartItemData[];
  contact: ContactData;
  pricing: CartPricing;
  /** False until localStorage has been read on the client (avoids hydration mismatches). */
  hydrated: boolean;
  booking: BookingRecord | null;
  addItem: (item: Omit<CartItemData, "id">) => string;
  updateItem: (item: CartItemData) => void;
  removeItem: (id: string) => void;
  setContact: (contact: Partial<ContactData>) => void;
  completeBooking: (booking: BookingRecord) => void;
  clearBooking: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode / quota): the app still works in memory */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART);
  const [hydrated, setHydrated] = useState(false);
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    dispatch({ type: "hydrate", state: parseStoredCart(safeGet(CART_KEY)) });
    setBooking(parseStoredBooking(safeGet(BOOKING_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeSet(CART_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addItem = useCallback((item: Omit<CartItemData, "id">) => {
    const id = makeId();
    dispatch({ type: "add", item: { ...item, id } });
    return id;
  }, []);
  const updateItem = useCallback((item: CartItemData) => dispatch({ type: "update", item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const setContact = useCallback((contact: Partial<ContactData>) => dispatch({ type: "setContact", contact }), []);
  const completeBooking = useCallback((record: BookingRecord) => {
    setBooking(record);
    safeSet(BOOKING_KEY, JSON.stringify(record));
    dispatch({ type: "clearItems" });
  }, []);
  const clearBooking = useCallback(() => {
    setBooking(null);
    safeSet(BOOKING_KEY, null);
  }, []);

  const pricing = useMemo(() => calculatePricing(state.items.length), [state.items.length]);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      items: state.items,
      contact: state.contact,
      pricing,
      hydrated,
      booking,
      addItem,
      updateItem,
      removeItem,
      setContact,
      completeBooking,
      clearBooking,
    }),
    [state, pricing, hydrated, booking, addItem, updateItem, removeItem, setContact, completeBooking, clearBooking],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}