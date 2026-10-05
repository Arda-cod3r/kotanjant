"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";

/** Sipariş onay sayfası açıldığında sepeti temizler. */
export default function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
