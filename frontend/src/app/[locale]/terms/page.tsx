"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const [mounted, setMounted] = useState(false);
  const LAST_UPDATED = "August 2025"; // static to avoid hydration mismatch
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="text-center max-w-2xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto mt-3"></div>
      </div>
      <div className="mt-8 rounded-xl border bg-card">
        <div className="p-6 md:p-8">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;
  }
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t("terms.title")}</h1>
        <p className="mt-3 text-base text-muted-foreground">{t("terms.subtitle")}</p>
      </div>

      {/* Content card */}
      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 md:p-8">
          <div className="space-y-8 text-foreground ltr:text-left rtl:text-right">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.acceptance.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.acceptance.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.description.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.description.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.responsibilities.title')}</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>{t('terms.sections.responsibilities.item1')}</li>
                <li>{t('terms.sections.responsibilities.item2')}</li>
                <li>{t('terms.sections.responsibilities.item3')}</li>
                <li>{t('terms.sections.responsibilities.item4')}</li>
                <li>{t('terms.sections.responsibilities.item5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.privacy.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.privacy.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.prohibited.title')}</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>{t('terms.sections.prohibited.item1')}</li>
                <li>{t('terms.sections.prohibited.item2')}</li>
                <li>{t('terms.sections.prohibited.item3')}</li>
                <li>{t('terms.sections.prohibited.item4')}</li>
                <li>{t('terms.sections.prohibited.item5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.liability.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.liability.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.changes.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.changes.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.sections.contact.title')}</h2>
              <p className="text-muted-foreground">{t('terms.sections.contact.desc')}</p>
            </section>

            <div className="mt-2 pt-6 border-t">
              <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
