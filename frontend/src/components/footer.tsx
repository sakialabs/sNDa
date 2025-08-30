"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  return (
    <footer className="border-t border-beige-100 dark:border-beige-800 bg-white/80 dark:bg-card/80 backdrop-blur-md">
      <div className="w-full px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left Section: Logo and tagline - Far Left */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥪</span>
            <span className="text-lg font-semibold">sNDa</span>
            <span className="hidden sm:block text-sm text-muted-foreground">
              {t("footer.tagline")}
            </span>
          </div>

          {/* Right Section: Navigation links - Far Right */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href={`/${locale}/terms`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.contact")}
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright and made with love */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} sNDa. {t("footer.allRightsReserved")}
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right flex items-center">
              {t("footer.madeWith")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
