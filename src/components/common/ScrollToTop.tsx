"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sayfa (route) değişiminde kaydırmayı en başa alır.
 * Next.js App Router normalde bunu yapar; ancak tarayıcı kaydırma restorasyonu
 * gibi durumlarda sayfa eski (uzun sayfada çok aşağıdaki) konumunda kalabiliyor.
 * Bu bileşen her geçişte "instant" kaydırma ile başa dönmeyi garanti eder.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
