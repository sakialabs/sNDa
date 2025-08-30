"use client";

import Link from "next/link";
import React from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

type Referral = {
  id: number | string;
  title: string;
  summary?: string;
  location?: string;
  urgency?: string;
  thumbnail_url?: string;
};

export default function ReferralCard({ referral, onClick }: { referral: Referral; onClick?: () => void; }) {
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-lg" onClick={onClick}>
      <Card className="p-0 overflow-hidden">
        <Link href={`${prefix}/cases/${referral.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="aspect-[16/9] bg-muted flex items-center justify-center overflow-hidden">
            {referral.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={referral.thumbnail_url} alt={referral.title} className="h-full w-full object-cover" />
            ) : (
              <div className="text-5xl">🥪</div>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <CardTitle className="line-clamp-2 text-base">{referral.title}</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{referral.summary}</div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{referral.location || ""}</div>
            <div className={`px-2 py-0.5 rounded border text-[11px] ${referral.urgency === 'high' ? 'text-red-600 border-red-200' : 'text-foreground/80'}`}>
              {referral.urgency ? referral.urgency.toUpperCase() : 'NORMAL'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
