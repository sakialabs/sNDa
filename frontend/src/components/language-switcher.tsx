"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();

  const setLocale = (locale: "en" | "ar") => {
    startTransition(() => {
      // Replace leading /en or /ar with new locale; if none, prefix
      const path = window.location.pathname;
      const newPath = path.match(/^\/(en|ar)(\/|$)/)
        ? path.replace(/^\/(en|ar)/, `/${locale}`)
        : `/${locale}${path}`;
      router.replace(newPath as any);
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="px-2 py-1 text-xs"
        onClick={() => setLocale("en")}
        disabled={pending}
      >
        EN
      </Button>
      <span className="text-muted-foreground text-xs">|</span>
      <Button
        variant="ghost"
        size="sm"
        className="px-2 py-1 text-xs"
        onClick={() => setLocale("ar")}
        disabled={pending}
      >
        AR
      </Button>
    </div>
  );
}
