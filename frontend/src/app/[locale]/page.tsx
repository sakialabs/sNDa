import type { Metadata } from "next";
import { assertLocale } from "../../../next-intl.config";
import HomeClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Home",
    ar: "سندة | الصفحة الرئيسية",
  };
  const descriptions: Record<string, string> = {
    en: "Discover campaigns, volunteer opportunities, and stories that wrap support around every life.",
    ar: "اكتشف الحملات وفرص التطوّع والقصص التي تُحيط الدّعم بكل حياة.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
