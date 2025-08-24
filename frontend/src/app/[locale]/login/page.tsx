import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";
import LoginClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Login",
    ar: "سندة | تسجيل الدخول",
  };
  const descriptions: Record<string, string> = {
    en: "Access your volunteer dashboard and manage your impact.",
    ar: "ادخل إلى لوحة المتطوع وأدر تأثيرك.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/login`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function Page() {
  return <LoginClient />;
}
