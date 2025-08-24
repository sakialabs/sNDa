import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import VolunteerClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Volunteer",
    ar: "سندة | المتطوعون",
  };
  const descriptions: Record<string, string> = {
    en: "Join our community of volunteers making real impact.",
    ar: "انضم إلى مجتمع المتطوعين لصنع أثر حقيقي.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/volunteer`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <VolunteerClient />;
}
