import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import ContactClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Contact",
    ar: "سندة | تواصل معنا",
  };
  const descriptions: Record<string, string> = {
    en: "Reach our team for support, contributions, and partnerships.",
    ar: "تواصل مع فريقنا للدعم والمساهمة والشراكات.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/contact`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <ContactClient />;
}
