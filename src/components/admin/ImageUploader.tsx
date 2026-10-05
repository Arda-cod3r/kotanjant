"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditorImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface UploadResponse {
  files?: { url: string; name: string }[];
  error?: string;
}

/** Çoklu görsel yükleme + sıralama + ana görsel seçimi. */
export default function ImageUploader({ initial = [] }: { initial?: EditorImage[] }) {
  const [images, setImages] = useState<EditorImage[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as UploadResponse;
      if (!res.ok || !data.files) {
        setError(data.error ?? "Görsel yüklenemedi.");
        return;
      }
      setImages((prev) => [
        ...prev,
        ...data.files!.map((file, index) => ({
          url: file.url,
          alt: "",
          isPrimary: prev.length === 0 && index === 0,
        })),
      ]);
    } catch {
      setError("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addImageUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setImages((prev) => [...prev, { url, alt: "", isPrimary: prev.length === 0 }]);
    setUrlInput("");
  }

  function removeAt(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) next[0].isPrimary = true;
      return [...next];
    });
  }

  function move(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function makePrimary(index: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  return (
    <div className="space-y-4">
      {/* Sunucu action'ına JSON olarak giden gizli alan */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="flex flex-wrap items-center gap-3">
        <label
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700",
            uploading && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {uploading ? "Yükleniyor..." : "Görsel Yükle"}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="veya görsel URL'si yapıştırın"
            className="h-10 min-w-40 flex-1 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="h-10 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Ekle
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>
      )}

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-400">
          Henüz görsel eklenmedi. En az bir görsel ekleyin.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={`${image.url}-${index}`}
              className="overflow-hidden rounded-xl border border-ink-100 bg-white"
            >
              <div className="relative aspect-square bg-ink-50">
                <Image
                  src={image.url}
                  alt={image.alt || "Ürün görseli"}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 rounded-md bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    ANA
                  </span>
                )}
              </div>
              <div className="space-y-2 p-2">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Alt metni"
                  className="h-8 w-full rounded-lg border border-ink-200 px-2 text-xs focus:border-brand-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Yukarı taşı"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="flex size-7 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Aşağı taşı"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      className="flex size-7 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Ana görsel yap"
                      onClick={() => makePrimary(index)}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md border transition",
                        image.isPrimary
                          ? "border-brand-200 bg-brand-50 text-brand-600"
                          : "border-ink-200 text-ink-600 hover:bg-ink-50",
                      )}
                    >
                      <Star className={cn("size-3.5", image.isPrimary && "fill-current")} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Görseli kaldır"
                    onClick={() => removeAt(index)}
                    className="flex size-7 items-center justify-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
