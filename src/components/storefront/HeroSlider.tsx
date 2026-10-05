"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlideDTO } from "@/lib/types";

const AUTOPLAY_MS = 5500;

export default function HeroSlider({ slides }: { slides: HeroSlideDTO[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) goTo(delta < 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  }

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="relative min-w-full">
            <div className="relative h-[300px] w-full sm:h-[400px] lg:h-[480px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-transparent" />
            </div>
            <div className="container-page absolute inset-0 flex flex-col justify-center">
              <div className="max-w-xl">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-400">
                  Kotanjant
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-md text-base text-ink-200 sm:text-lg">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href}
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {slide.cta}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Oklar */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Önceki slayt"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Sonraki slayt"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Noktalar */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${i + 1}. slayda git`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-8 bg-brand-500" : "w-2 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
