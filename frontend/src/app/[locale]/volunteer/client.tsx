"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Award,
  Target,
  BookOpen,
  Sparkles,
  MapPin,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
};

export default function VolunteerClient() {
  const locale = useLocale();
  const f = useFormatter();
  const prefix = `/${locale}`;
  const isAR = locale === "ar";
  const t = useTranslations();
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("volunteer.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("volunteer.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">{f.number(89)}</div>
                <p className="text-sm text-muted-foreground">{t("volunteer.activeVolunteers")}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">{f.number(1247)}</div>
                <p className="text-sm text-muted-foreground">{t("volunteer.casesResolved")}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">50+</div>
                <p className="text-sm text-muted-foreground">{t("volunteer.citiesCovered")}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">98%</div>
                <p className="text-sm text-muted-foreground">{t("volunteer.successRate")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={isAR ? "rtl" : "ltr"}>
                  <Target className="h-5 w-5 text-primary" />
                  {t("volunteer.howItWorks.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 flex-1 ${isAR ? 'text-right' : 'text-left'}`}>
                <div className="flex items-start gap-3" dir={isAR ? "rtl" : "ltr"}>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold">{t("volunteer.howItWorks.step1.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("volunteer.howItWorks.step1.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" dir={isAR ? "rtl" : "ltr"}>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold">{t("volunteer.howItWorks.step2.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("volunteer.howItWorks.step2.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" dir={isAR ? "rtl" : "ltr"}>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold">{t("volunteer.howItWorks.step3.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("volunteer.howItWorks.step3.desc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={isAR ? "rtl" : "ltr"}>
                  <Users className="h-5 w-5 text-primary" />
                  {t("volunteer.waysToHelp.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 flex-1 ${isAR ? 'text-right' : 'text-left'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" dir={isAR ? "rtl" : "ltr"}>
                    <div>
                      <h3 className="font-semibold">{t("volunteer.waysToHelp.caseWorker.title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("volunteer.waysToHelp.caseWorker.desc")}</p>
                    </div>
                    <Badge variant="secondary">High Impact</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" dir={isAR ? "rtl" : "ltr"}>
                    <div>
                      <h3 className="font-semibold">{t("volunteer.waysToHelp.translator.title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("volunteer.waysToHelp.translator.desc")}</p>
                    </div>
                    <Badge variant="secondary">Flexible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" dir={isAR ? "rtl" : "ltr"}>
                    <div>
                      <h3 className="font-semibold">{t("volunteer.waysToHelp.mentor.title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("volunteer.waysToHelp.mentor.desc")}</p>
                    </div>
                    <Badge variant="secondary">Ongoing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" dir={isAR ? "rtl" : "ltr"}>
                    <div>
                      <h3 className="font-semibold">{t("volunteer.waysToHelp.emergency.title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("volunteer.waysToHelp.emergency.desc")}</p>
                    </div>
                    <Badge variant="secondary">On-Call</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="mt-8">
            <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={isAR ? "rtl" : "ltr"}>
                <Award className="h-5 w-5 text-primary" />
                {t("volunteer.why.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`text-center ${isAR ? 'text-right' : 'text-left'} md:text-center`}>
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{t("volunteer.why.gamified.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("volunteer.why.gamified.desc")}</p>
                </div>
                <div className={`text-center ${isAR ? 'text-right' : 'text-left'} md:text-center`}>
                  <Heart className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{t("volunteer.why.realImpact.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("volunteer.why.realImpact.desc")}</p>
                </div>
                <div className={`text-center ${isAR ? 'text-right' : 'text-left'} md:text-center`}>
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{t("volunteer.why.learning.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("volunteer.why.learning.desc")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">{t("volunteer.cta.title")}</h2>
              <p className="text-lg mb-6 text-muted-foreground">{t("volunteer.cta.subtitle")}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={`${prefix}/login`}>
                    <Button size="lg" className="w-full sm:w-auto">{t("actions.getStarted")}</Button>
                </Link>
                <Link href={`${prefix}/community`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("actions.seeImpact")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
