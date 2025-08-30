"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/lib/api/config";

type Detail = {
  id: string | number;
  title: string;
  details?: string;
  summary?: string;
  location?: string;
  contacts?: string;
};

export default function ReferralDetailModal({ id, onCloseAction }: { id: string | number; onCloseAction: () => void; }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Detail | null>(null);
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}/api/referrals/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setData(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
  <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={onCloseAction}>
      <div onClick={(e) => e.stopPropagation()} className="w-[760px] max-w-[95%]">
        <Card>
          <CardContent>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={onCloseAction}>{t("referralModal.close")}</Button>
            </div>

            {loading ? (
              <div className="py-8 text-center">{t("referralModal.loading")}</div>
            ) : !data ? (
              <div className="py-8 text-center">{t("referralModal.notAvailable")}</div>
            ) : (
              <div>
                <CardTitle className="text-2xl">{data.title}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">{data.summary}</div>

                <section className="mt-4">
                  <h4 className="font-medium">{t("referralModal.detailsHeading")}</h4>
                  <div className="whitespace-pre-wrap text-sm text-foreground">{data.details || t("referralModal.noExtraDetails")}</div>
                </section>

                <section className="mt-4">
                  <h4 className="font-medium">{t("referralModal.locationContactHeading")}</h4>
                  <div className="text-sm">{data.location || t("referralModal.unspecified")}</div>
                  <div className="text-sm mt-2">{data.contacts || t("referralModal.noContact")}</div>
                </section>

                <div className="mt-6">
                  <Button asChild>
                    <a href={`/${locale}/cases/${id}?support=1`} className="inline-block">I want to help</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
