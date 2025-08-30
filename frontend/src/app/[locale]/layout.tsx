import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getDir } from "@/i18n/config";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import { assertLocale, type Locale } from "../../../next-intl.config";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["300", "400", "600", "700"] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Simple localized strings; can be moved to messages later
  const titles: Record<string, string> = {
    en: "sNDa | a Sandwich of Support",
    ar: "سندة | شطيرة الدعم",
  };
  const descriptions: Record<string, string> = {
    en: "A community platform empowering volunteers and donors to wrap support around every life.",
    ar: "منصّة مجتمعية تمكّن المتطوّعين والمتبرعين من إحاطة الدّعم بكل حياة.",
  };

  const title = titles[locale] ?? titles.en;
  const description = descriptions[locale] ?? descriptions.en;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: "sNDa",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  assertLocale(locale);
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const dir = getDir(locale as Locale);

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <div dir={dir} className={`${(locale === "ar" ? cairo : inter).className} flex flex-col min-h-screen`}>
            <Header />
            <main className="flex-grow container mx-auto p-4">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
      <Toaster 
        position="top-center" 
        expand 
        visibleToasts={3}
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))'
          }
        }}
      />
    </NextIntlClientProvider>
  );
}
