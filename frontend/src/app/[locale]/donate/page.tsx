import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import DonateClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Donate",
    ar: "سندة | تبرع",
  };
  const descriptions: Record<string, string> = {
    en: "Support our mission through transparent campaigns and tracked outcomes.",
    ar: "ادعم رسالتنا عبر حملات شفافة ونتائج مُتابعة.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/donate`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <DonateClient />;
}
