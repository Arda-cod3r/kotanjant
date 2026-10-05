"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

export interface CartState {
  lines: CartLine[];
  /** Sepete ekler; aynı ürün varsa adedi artırır ve stok üst sınırını aşmaz. */
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, line.stock);
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId ? { ...l, quantity: Math.max(1, nextQty) } : l,
              ),
            };
          }
          return {
            lines: [...state.lines, { ...line, quantity: Math.min(quantity, line.stock) }],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId
                ? { ...l, quantity: Math.max(0, Math.min(quantity, l.stock)) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),
    }),
    {
      name: "kotanjant-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Header'daki sepet sayacı (toplam adet). */
export const selectCartCount = (state: CartState) =>
  state.lines.reduce((sum, l) => sum + l.quantity, 0);

/** Sepet ara toplamı (₺). */
export const selectCartSubtotal = (state: CartState) =>
  state.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
