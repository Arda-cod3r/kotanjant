"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";

export default function SearchBar({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 250ms debounce ile /api/products/search ucundan önerileri çeker.
  // Not: tüm state güncellemeleri zamanlayıcı geri çağrısı içinde yapılır
  // (effect gövdesinde senkron setState'ten kaçınmak için).
  useEffect(() => {
    const term = query.trim();
    const timer = setTimeout(async () => {
      if (term.length < 2) {
        setResults([]);
        setLoading(false);
        setOpen(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`);
        const data = (await res.json()) as { products?: ProductDTO[] };
        setResults(data.products ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Dışarı tıklanınca öneri panelini kapat.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/arama?q=${encodeURIComponent(term)}`);
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search" className="flex w-full">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Jant kapağı, silecek, paspas ara..."
            aria-label="Ürün ara"
            className="h-11 w-full rounded-l-xl border border-r-0 border-ink-200 bg-white pl-10 pr-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-11 rounded-r-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Ara
        </button>
      </form>

      {open && (results.length > 0 || loading) && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-xl">
          {loading && results.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-ink-500">
              <Loader2 className="size-4 animate-spin" /> Aranıyor...
            </div>
          ) : (
            <ul className="max-h-96 divide-y divide-ink-50 overflow-auto">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/urun/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-ink-50"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {product.name}
                      </span>
                      <span className="block text-xs text-ink-500">{product.sku}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-brand-600">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 && (
            <Link
              href={`/arama?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
              className="block bg-ink-50 px-4 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-ink-100"
            >
              Tüm sonuçları gör
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
