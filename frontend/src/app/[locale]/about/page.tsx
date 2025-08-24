import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | About",
    ar: "سندة | من نحن",
  };
  const descriptions: Record<string, string> = {
    en: "Learn about our mission, values, and the community wrapping support around every life.",
    ar: "تعرّف على رسالتنا وقيمنا ومجتمعنا الذي يحيط الدّعم بكل حياة.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/about`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

import AboutClient from "./client";

export default function AboutPage() {
  return <AboutClient />;
}
