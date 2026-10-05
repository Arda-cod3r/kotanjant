"use client";

import { useSyncExternalStore } from "react";

// Abonelik gerektirmeyen sabit store: değer yalnızca sunucu/client snapshot'ına göre değişir.
const subscribe = () => () => {};

/**
 * "Client'ta mount edildi mi?" bilgisini hydration uyuşmazlığı yaratmadan döner.
 * Sunucu render'ında (ve ilk hydration anında) `false`, client'a geçildiğinde `true` olur.
 *
 * `useEffect(() => setMounted(true), [])` deseninin React'in önerdiği karşılığıdır:
 * effect içinde senkron `setState` çağırmadığı için yeni `react-hooks/set-state-in-effect`
 * kuralına uyar ve gereksiz cascading render'a yol açmaz.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
