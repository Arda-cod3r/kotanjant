import type { Metadata } from "next";
import ScrollToTop from "@/components/common/ScrollToTop";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Kotanjant Jant & Aksesuar";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${siteName} | Jant Kapakları ve Oto Aksesuar`,
    template: `%s | ${siteName}`,
  },
  description:
    "Jant kapağı, silecek, paspas ve oto aksesuarlarında geniş ürün yelpazesi. Güvenli alışveriş, hızlı teslimat ve kolay iade.",
  keywords: ["jant kapağı", "jant kapakları", "oto aksesuar", "silecek", "paspas", "krom kapak"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName,
    title: `${siteName} | Jant Kapakları ve Oto Aksesuar`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="min-h-dvh bg-white text-ink-900 antialiased">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
