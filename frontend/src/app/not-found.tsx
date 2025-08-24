"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Compass, HeartHandshake, MessageCircle, LayoutDashboard } from "lucide-react";

export default function NotFoundRoot() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        {pathname && (
          <p className="text-xs text-muted-foreground mt-2">
            You tried to visit <code className="px-1 py-0.5 rounded bg-muted text-foreground">{pathname}</code>
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
                  This link is missing a language prefix.
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
              <Link href={`/en`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">Back to Home (EN)</div>
                    <div className="text-sm text-muted-foreground">Return to the main page</div>
                  </div>
                </div>
              </Link>

              <Link href={`/ar`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">العودة للرئيسية (AR)</div>
                    <div className="text-sm text-muted-foreground">الرجوع إلى الصفحة الرئيسية</div>
                  </div>
                </div>
              </Link>

              <Link href={`/en/community`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <HeartHandshake className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">Visit Community (EN)</div>
                    <div className="text-sm text-muted-foreground">See stories and impact</div>
                  </div>
                </div>
              </Link>

              <Link href={`/ar/community`} className="group">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors flex items-center gap-3">
                  <HeartHandshake className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">زيارة المجتمع (AR)</div>
                    <div className="text-sm text-muted-foreground">اطّلع على القصص والأثر</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Link href={`/en/dashboard`}>
                <Button size="lg" variant="outline" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard (EN)
                </Button>
              </Link>
              <Link href={`/ar/dashboard`}>
                <Button size="lg" variant="outline" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" /> الذهاب للوحة التحكم (AR)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
