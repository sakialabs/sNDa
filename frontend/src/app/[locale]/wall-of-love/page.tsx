import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import WallOfLoveClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Wall of Love",
    ar: "سندة | جدار المحبة",
  };
  const descriptions: Record<string, string> = {
    en: "A living feed of community impact stories from volunteers and families.",
    ar: "سجل حيّ لقصص الأثر المجتمعي من المتطوعين والأسر.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/wall-of-love`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <WallOfLoveClient />;
}
