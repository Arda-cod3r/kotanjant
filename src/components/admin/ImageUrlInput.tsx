"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

/**
 * Tek görsel girişi: dosya yükleyebilir veya URL yapıştırabilir.
 * Seçilen URL gizli input ile server action'a gönderilir.
 */
export default function ImageUrlInput({
  name,
  label = "Görsel",
  defaultValue = "",
  hint,
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("files", files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { files?: { url: string }[]; error?: string };
      if (!res.ok || !data.files?.[0]) {
        setError(data.error ?? "Görsel yüklenemedi.");
        return;
      }
      setUrl(data.files[0].url);
    } catch {
      setError("Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <input type="hidden" name={name} value={url} />

      <div className="mt-1.5 flex gap-4">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/uploads/... veya https://..."
            className="h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-ink-200 px-4 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {uploading ? "Yükleniyor..." : "Dosya Yükle"}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFile(e.target.files)}
            />
          </label>
          {hint && <p className="text-xs text-ink-400">{hint}</p>}
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        {url && (
          <div className="relative size-24 shrink-0 overflow-hidden border border-ink-100 bg-ink-50">
            <Image src={url} alt="Önizleme" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              aria-label="Görseli kaldır"
              onClick={() => setUrl("")}
              className="absolute right-1 top-1 flex size-6 items-center justify-center bg-white/90 text-ink-600 hover:text-red-600"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
