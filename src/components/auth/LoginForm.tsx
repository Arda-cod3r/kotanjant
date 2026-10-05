"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Loader2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/server/actions/auth";

const DEMO_ACCOUNTS = [
  { label: "Müşteri", email: "musteri@kotanjant.com", password: "Musteri!234" },
  { label: "Admin", email: "admin@kotanjant.com", password: "Admin!2345" },
  { label: "Süperadmin", email: "superadmin@kotanjant.com", password: "SuperAdmin!234" },
];

export default function LoginForm({ showDemoAccounts = true }: { showDemoAccounts?: boolean }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="size-4" /> {state.error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-700">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink-700">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {showDemoAccounts && (
        <div className="rounded-xl bg-ink-50 px-4 py-3">
          <p className="text-xs font-semibold text-ink-700">Hızlı giriş (demo hesaplar)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-sm text-ink-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
          <UserPlus className="size-4" /> Kayıt Olun
        </Link>
      </p>
    </div>
  );
}
