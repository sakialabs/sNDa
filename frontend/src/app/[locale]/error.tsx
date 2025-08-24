"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors");
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">{t("generic.title", { default: "Something went wrong" })}</h1>
      <p className="text-muted-foreground mb-6">
        {t("generic.description", { default: "An unexpected error occurred. You can try again or return home." })}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
        >
          {t("actions.tryAgain", { default: "Try again" })}
        </button>
        <Link
          href={`/${locale}/`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input hover:bg-accent"
        >
          {t("actions.backHome", { default: "Back to Home" })}
        </Link>
      </div>
    </div>
  );
}
