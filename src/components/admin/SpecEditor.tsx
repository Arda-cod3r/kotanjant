"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export interface EditorSpec {
  label: string;
  value: string;
}

/** Teknik özellik satırları: ekle / sil / sırala. */
export default function SpecEditor({ initial = [] }: { initial?: EditorSpec[] }) {
  const [specs, setSpecs] = useState<EditorSpec[]>(
    initial.length > 0 ? initial : [{ label: "", value: "" }],
  );

  function update(index: number, patch: Partial<EditorSpec>) {
    setSpecs((prev) => prev.map((spec, i) => (i === index ? { ...spec, ...patch } : spec)));
  }

  function add() {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeAt(index: number) {
    setSpecs((prev) => (prev.length === 1 ? [{ label: "", value: "" }] : prev.filter((_, i) => i !== index)));
  }

  function move(index: number, direction: -1 | 1) {
    setSpecs((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  // Boş satırları göndermeden JSON olarak serileştir.
  const serialized = JSON.stringify(
    specs.filter((spec) => spec.label.trim() && spec.value.trim()),
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name="specs" value={serialized} />

      {specs.map((spec, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={spec.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="Özellik (ör. Jant Çapı)"
            className="h-10 flex-1 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => update(index, { value: e.target.value })}
            placeholder="Değer (ör. 15 inç)"
            className="h-10 flex-1 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Yukarı taşı"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="flex size-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Aşağı taşı"
              onClick={() => move(index, 1)}
              disabled={index === specs.length - 1}
              className="flex size-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
            >
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Satırı sil"
              onClick={() => removeAt(index)}
              className="flex size-8 items-center justify-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-ink-300 px-4 text-sm font-semibold text-ink-600 transition hover:border-brand-300 hover:text-brand-700"
      >
        <Plus className="size-4" /> Özellik Ekle
      </button>
    </div>
  );
}
