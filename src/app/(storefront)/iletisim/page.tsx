import type { Metadata } from "next";
import InfoPage from "@/components/storefront/InfoPage";
import { sitePages } from "@/lib/site-content";

const page = sitePages["iletisim"];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function Page() {
  return <InfoPage page={page} />;
}
