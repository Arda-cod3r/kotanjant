"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
        <CheckCircle2 className="size-5 text-green-400" />
        Bültenimize kaydınız alındı. Teşekkürler!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20 focus-within:ring-brand-400">
        <span className="flex items-center pl-3 text-ink-300">
          <Mail className="size-4" />
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="E-posta adresiniz"
          aria-label="Bülten e-posta adresi"
          className="h-11 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-ink-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {status === "loading" ? "Kaydediliyor..." : "Abone Ol"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-brand-300">Geçerli bir e-posta adresi girin.</p>
      )}
    </form>
  );
}
