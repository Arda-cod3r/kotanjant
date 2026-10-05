import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SitePageContent } from "@/lib/site-content";

/** Kurumsal ve yasal bilgi sayfalarının ortak görünümü. */
export default function InfoPage({ page }: { page: SitePageContent }) {
  return (
    <div className="container-page max-w-4xl py-10">
      <nav aria-label="Sayfa yolu" className="flex items-center gap-1 text-xs text-ink-500">
        <Link href="/" className="hover:text-brand-700">
          Ana Sayfa
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink-700">{page.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-black text-ink-900">{page.title}</h1>
      {page.intro && (
        <p className="mt-3 border-l-4 border-brand-600 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-600">
          {page.intro}
        </p>
      )}

      <div className="mt-10 space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="border-b border-ink-100 pb-2 text-lg font-bold text-ink-900">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-ink-600">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink-600">
                    <span className="mt-2 size-1.5 shrink-0 bg-brand-600" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex h-11 items-center border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
      >
        ← Ana sayfaya dön
      </Link>
    </div>
  );
}
