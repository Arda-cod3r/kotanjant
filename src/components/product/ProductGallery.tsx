"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImageDTO } from "@/lib/types";

const ZOOM_SCALE = 2.2; // Yakınlaştırma oranı

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImageDTO[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex];
  const hasImages = images.length > 0;

  /** Fare konumunu yüzdeye çevirip yakınlaştırma odağını günceller. */
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  /** Dokunmatik cihazlarda merkezden yakınlaştırma aç/kapat. */
  function toggleCenterZoom() {
    setOrigin({ x: 50, y: 50 });
    setZoom((v) => !v);
  }

  if (!hasImages) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-ink-100 bg-ink-50 text-sm text-ink-400">
        Görsel bulunmuyor
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Küçük görseller (thumbnail galerisi) */}
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}. görseli göster`}
            aria-current={index === activeIndex}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-ink-50 transition sm:size-20",
              index === activeIndex
                ? "border-brand-600 ring-1 ring-brand-200"
                : "border-ink-100 hover:border-ink-300",
            )}
          >
            <Image
              src={image.url}
              alt={image.alt ?? `${productName} ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Ana görsel + yakınlaştırma */}
      <div className="flex-1">
        <div
          ref={frameRef}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={toggleCenterZoom}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-2xl border border-ink-100 bg-ink-50",
            zoom ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
        >
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover transition-opacity duration-200",
              zoom ? "opacity-0" : "opacity-100",
            )}
          />

          {/* Magnifier katmanı: hover/dokunma sırasında seçili noktayı büyütür */}
          {zoom && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${active.url})`,
                backgroundSize: `${ZOOM_SCALE * 100}%`,
                backgroundPosition: `${origin.x}% ${origin.y}%`,
              }}
            />
          )}

          {!zoom && (
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink-950/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
              <ZoomIn className="size-3.5" /> Yakınlaştırmak için hover yapın
            </span>
          )}
        </div>

        {/* Görsel sayacı */}
        <p className="mt-3 text-center text-xs text-ink-400 sm:text-left">
          {activeIndex + 1} / {images.length} görsel
        </p>
      </div>
    </div>
  );
}
