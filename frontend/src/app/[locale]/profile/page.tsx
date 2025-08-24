import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import ProfileClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Profile",
    ar: "سندة | الملف الشخصي",
  };
  const descriptions: Record<string, string> = {
    en: "View and manage your account details.",
    ar: "اعرض وأدر تفاصيل حسابك.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/profile`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <ProfileClient />;
}
