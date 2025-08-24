import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import DashboardClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Dashboard",
    ar: "سندة | لوحة التحكم",
  };
  const descriptions: Record<string, string> = {
    en: "Volunteer dashboard with your latest cases and stats.",
    ar: "لوحة المتطوع مع آخر الحالات والإحصائيات.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/dashboard`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <DashboardClient />;
}
