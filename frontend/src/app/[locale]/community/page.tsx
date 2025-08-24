import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import CommunityClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Community",
    ar: "سندة | المجتمع",
  };
  const descriptions: Record<string, string> = {
    en: "See community impact, live stories, and goals.",
    ar: "استكشف أثر المجتمع والقصص والأهداف الحية.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/community`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <CommunityClient />;
}
