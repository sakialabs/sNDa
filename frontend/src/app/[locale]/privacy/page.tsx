"use client";
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
  const [mounted, setMounted] = useState(false);
  const LAST_UPDATED = "August 2025"; // static to avoid hydration mismatch
  const t = useTranslations()

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
            {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t("privacy.title")}</h1>
        <p className="mt-3 text-base text-muted-foreground">{t("privacy.subtitle")}</p>
      </div>

      {/* Content card */}
      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 md:p-8">
          <div className="space-y-8 text-foreground ltr:text-left rtl:text-right">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.information.title')}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium text-foreground">{t('privacy.sections.information.personalTitle')}</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>{t('privacy.sections.information.personal.item1')}</li>
                  <li>{t('privacy.sections.information.personal.item2')}</li>
                  <li>{t('privacy.sections.information.personal.item3')}</li>
                </ul>

                <p className="font-medium text-foreground">{t('privacy.sections.information.caseTitle')}</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>{t('privacy.sections.information.case.item1')}</li>
                  <li>{t('privacy.sections.information.case.item2')}</li>
                  <li>{t('privacy.sections.information.case.item3')}</li>
                </ul>

                <p className="font-medium text-foreground">{t('privacy.sections.information.technicalTitle')}</p>
                <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-1">
                  <li>{t('privacy.sections.information.technical.item1')}</li>
                  <li>{t('privacy.sections.information.technical.item2')}</li>
                  <li>{t('privacy.sections.information.technical.item3')}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.use.title')}</h2>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>{t('privacy.sections.use.item1')}</li>
                <li>{t('privacy.sections.use.item2')}</li>
                <li>{t('privacy.sections.use.item3')}</li>
                <li>{t('privacy.sections.use.item4')}</li>
                <li>{t('privacy.sections.use.item5')}</li>
                <li>{t('privacy.sections.use.item6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.sharing.title')}</h2>
              <p className="text-muted-foreground mb-3">{t('privacy.sections.sharing.intro')}</p>
              <p className="text-muted-foreground">{t('privacy.sections.sharing.note')}</p>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground mt-3">
                <li>{t('privacy.sections.sharing.item1')}</li>
                <li>{t('privacy.sections.sharing.item2')}</li>
                <li>{t('privacy.sections.sharing.item3')}</li>
                <li>{t('privacy.sections.sharing.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.security.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.security.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.children.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.children.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.rights.title')}</h2>
              <p className="text-muted-foreground mb-2">{t('privacy.sections.rights.intro')}</p>
              <ul className="list-disc ltr:pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
                <li>{t('privacy.sections.rights.item1')}</li>
                <li>{t('privacy.sections.rights.item2')}</li>
                <li>{t('privacy.sections.rights.item3')}</li>
                <li>{t('privacy.sections.rights.item4')}</li>
                <li>{t('privacy.sections.rights.item5')}</li>
                <li>{t('privacy.sections.rights.item6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.retention.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.retention.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.transfers.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.transfers.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.changes.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.changes.desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.sections.contact.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.sections.contact.desc')}</p>
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
