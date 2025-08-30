"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Users, Megaphone, Shield } from "lucide-react";

export default function ContactClient() {
  const locale = useLocale();
  const isAR = locale === "ar";
  const t = useTranslations();
  return (
    <div className="max-w-7xl mx-auto p-4 py-10" dir={isAR ? "rtl" : "ltr"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-center ${isAR ? "text-center" : "text-center"}`}
      >
  <h1 className="text-4xl font-bold text-foreground">{t("contact.title")}</h1>
  <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">{t("contact.subtitle")}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Mail className="h-5 w-5 text-primary" />
                  {t("contact.generalSupport")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">{t("contact.generalSupportDesc")}</p>
                <Button asChild size="sm">
                  <a href="mailto:snda@hey.me">{t("contact.emailUsShort")}</a>
                </Button>
                <p className="text-xs text-muted-foreground">{t("contact.weReadEveryMessage")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Users className="h-5 w-5 text-primary" />
                  {t("contact.contribute")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">{t("contact.contributeDesc")}</p>
                <div className={`flex gap-3 ${isAR ? 'justify-start' : 'justify-start'}`} dir={isAR ? "rtl" : "ltr"}>
                  <Button asChild size="sm">
                    <a href="https://github.com/sakialabs/sNDa" target="_blank" rel="noreferrer">GitHub</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="mailto:snda@hey.me?subject=Contribute%20to%20sNDa">{t("contact.emailUs")}</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{t("contact.contributeShort")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Megaphone className="h-5 w-5 text-primary" />
                  {t("contact.partnerships")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">{t("contact.partnershipsDesc")}</p>
                <Button asChild variant="outline" size="sm">
                  <a href="mailto:snda@hey.me?subject=Partnership%20Inquiry">{t("contact.partnerWithUs")}</a>
                </Button>
                <p className={`text-xs text-muted-foreground m-0 ${isAR ? 'text-right' : 'text-left'}`}>{t("contact.includeOrgDetails")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Shield className="h-5 w-5 text-primary" />
                {t("contact.security")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-foreground ${isAR ? 'text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{
                  __html: t("contact.securityDesc", {
                    email: `<a class="underline" href="mailto:snda@hey.me?subject=Security">snda@hey.me</a>`,
                  }),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
