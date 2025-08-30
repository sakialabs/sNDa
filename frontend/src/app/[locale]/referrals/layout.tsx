import type { Metadata } from "next";
import { assertLocale } from "../../../../next-intl.config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const titles: Record<string, string> = {
    en: "sNDa | Referrals",
    ar: "سندة | الإحالات",
  };
  const descriptions: Record<string, string> = {
    en: "Browse urgent and ongoing referral requests. Search and filter to find ways to help children in need.",
    ar: "تصفح طلبات الإحالة العاجلة والجارية. ابحث وفلتر لتجد طرق مساعدة الأطفال المحتاجين.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `/${locale}/referrals`,
    },
    twitter: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      card: "summary_large_image",
    },
  };
}

export default function ReferralsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
