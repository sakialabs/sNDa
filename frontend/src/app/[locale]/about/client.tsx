"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, UserCheck, Stethoscope, HandCoins, Sparkles, Heart, Users, Wifi } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

// Animation variants (match Community/Volunteer)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function AboutClient() {
  const t = useTranslations();
  const locale = useLocale();
  const isAR = locale === "ar";
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-10`}
        >
          <h1 className="text-4xl font-bold text-foreground">{t("about.title")}</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">{t("about.subtitle")}</p>
        </motion.div>

        {/* Grouped cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Intro / Name & meaning */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Heart className="h-5 w-5 text-primary" />
                  {t("about.whoWeAre.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Intro copy */}
                <p className={`${isAR ? "text-right" : "text-left"}`}>{t.rich("about.whoWeAre.intro", { strong: (chunk) => <strong>{chunk}</strong> })}</p>
                <p className={`text-muted-foreground ${isAR ? "text-right" : "text-left"}`}>{t("about.whoWeAre.pronunciation")}</p>
                <p className={`text-foreground ${isAR ? "text-right" : "text-left"}`}>{t("about.whoWeAre.description")}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What we do */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t("about.whatWeDo.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-foreground ${isAR ? "text-right" : "text-left"}`}>{t("about.whatWeDo.description")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" dir={isAR ? "rtl" : "ltr"}>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Heart className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.wallOfLove")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.wallOfLoveDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.volunteerTools")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.volunteerToolsDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <HandCoins className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.donorPlatform")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.donorPlatformDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Wifi className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.offlineFirst")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.offlineFirstDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.boba")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.bobaDesc")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it works (Recent Achievements style) */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={isAR ? "rtl" : "ltr"}>
                  <ClipboardList className="h-5 w-5 text-primary" />
                  {t("about.howItWorks.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-foreground mb-3 ${isAR ? "text-right" : "text-left"}`}>{t("about.howItWorks.description")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir={isAR ? "rtl" : "ltr"}>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.referralTriage")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.referralTriageDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.coordinatorAssignment")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.coordinatorAssignmentDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.hospitalCare")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.hospitalCareDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <HandCoins className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.donorSupport")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.donorSupportDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div className={isAR ? "text-right" : "text-left"}>
                      <div className="font-medium">{t("about.storiesImpact")}</div>
                      <div className="text-xs text-muted-foreground">{t("about.storiesImpactDesc")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Built by & for */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-start" dir={isAR ? "rtl" : "ltr"}>
                  <Users className="h-5 w-5 text-primary" />
                  {t("about.ourBackbone.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={`text-foreground ${isAR ? "text-right" : "text-left"}`}>{t("about.ourBackbone.openSource")}</p>
                <p className={`text-muted-foreground ${isAR ? "text-right" : "text-left"}`}>{t.rich("about.ourBackbone.tech", { strong: (chunk) => <strong>{chunk}</strong> })}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
