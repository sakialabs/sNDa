"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Compass, HeartHandshake, MessageCircle, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("errors");
  const locale = useLocale();
  const prefix = `/${locale}`;
  const pathname = usePathname();
  const missingLocale = pathname ? !/^\/(en|ar)\b/.test(pathname) : false;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("notFound.title", { default: "Page not found" })}
        </h1>
        <p className="text-muted-foreground">
          {t("notFound.description", { default: "The page you’re looking for doesn’t exist or has been moved." })}
        </p>
        {pathname && (
          <p className="text-xs text-muted-foreground mt-2">
            {t("notFound.pathTried", { default: "You tried to visit" })} <code className="px-1 py-0.5 rounded bg-muted text-foreground">{pathname}</code>
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-6">
            {missingLocale && pathname && (
              <div className="mb-5">
                <div className="text-sm font-medium text-foreground mb-2">
                  {t("notFound.missingLocale", { default: "This link is missing a language prefix." })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`}>
                    <Button size="sm" variant="outline">English: /en{pathname}</Button>
                  </Link>
                  <Link href={`/ar${pathname.startsWith('/') ? pathname : `/${pathname}`}`}>
                    <Button size="sm" variant="outline">العربية: /ar{pathname}</Button>
                  </Link>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href={`${prefix}`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">{t("actions.backHome", { default: "Back to Home" })}</div>
                    <div className="text-sm text-muted-foreground">{t("notFound.homeHint", { default: "Return to the main page" })}</div>
                  </div>
                </div>
              </Link>

              <Link href={`${prefix}/community`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <HeartHandshake className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">{t("actions.community", { default: "Visit Community" })}</div>
                    <div className="text-sm text-muted-foreground">{t("notFound.communityHint", { default: "See stories and impact" })}</div>
                  </div>
                </div>
              </Link>

              <Link href={`${prefix}/volunteer`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <Compass className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">{t("actions.volunteer", { default: "Become a Volunteer" })}</div>
                    <div className="text-sm text-muted-foreground">{t("notFound.volunteerHint", { default: "Find ways to help" })}</div>
                  </div>
                </div>
              </Link>

              <Link href={`${prefix}/contact`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">{t("actions.contact", { default: "Contact Us" })}</div>
                    <div className="text-sm text-muted-foreground">{t("notFound.contactHint", { default: "We’re here to help" })}</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Link href={`${prefix}`}>
                <Button size="lg" className="gap-2">
                  <Home className="h-4 w-4" /> {t("actions.backHome", { default: "Back to Home" })}
                </Button>
              </Link>
              <Link href={`${prefix}/dashboard`}>
                <Button size="lg" variant="outline" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" /> {t("actions.dashboard", { default: "Go to Dashboard" })}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
