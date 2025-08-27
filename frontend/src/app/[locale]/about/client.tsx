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
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? "flex-row-reverse" : ""}`}>
                  <Heart className="h-5 w-5 text-primary" />
                  {t("about.whoWeAre.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Intro copy */}
                <p className={`${isAR ? "text-right" : "text-left"}`}>{t.rich("about.whoWeAre.intro", { strong: (chunk) => <strong>{chunk}</strong> })}</p>
                <p className={`text-muted-foreground ${isAR ? "text-right" : "text-left"}`}>
                  {isAR ? "تُنطق سُن-دة (سندة)؛ في اللهجة السودانية تعني وجبة خفيفة، وفي العربية تعني الدعم. نحن نجلب الدفء والمساعدة العملية معًا." : "Pronounced sun-dah (سندة); in Sudanese slang it means a light snack, and in Arabic it means support. We bring both warmth and practical help."}
                </p>
                <p className={`text-foreground ${isAR ? "text-right" : "text-left"}`}>We’re a solidarity platform that blends grassroots care with a global vision. By combining human connection with smart technology, sNDa supports children in Sudan today and vulnerable communities worldwide tomorrow.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What we do */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? "flex-row-reverse" : ""}`}>
                  <Sparkles className="h-5 w-5 text-primary" />
                  What we do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-foreground ${isAR ? "text-right" : "text-left"}`}>sNDa connects families, volunteers, coordinators, donors, and hospitals so help arrives faster and outcomes remain transparent. The platform focuses on fast referrals, coordinated triage, secure case tracking, and clear donor impact.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Wall of Love</div>
                      <div className="text-xs text-muted-foreground">Curated, public impact stories</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Volunteer Tools</div>
                      <div className="text-xs text-muted-foreground">Dashboard, streaks, badges</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <HandCoins className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Donor Platform</div>
                      <div className="text-xs text-muted-foreground">Clear campaigns, outcomes</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Wifi className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Offline-first</div>
                      <div className="text-xs text-muted-foreground">Works through outages, SMS</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Boba (our bot)</div>
                      <div className="text-xs text-muted-foreground">Guidance, reminders, smart tips</div>
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
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-foreground mb-3 ${isAR ? "text-right" : "text-left"}`}>
                  Our web app makes it simple to go from a referral to real impact. Each case starts with verified details, then moves through clear steps. Along the way, progress is tracked and shared so the whole community can see the difference they’re making.     </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Referral & triage</div>
                      <div className="text-xs text-muted-foreground">Collect and verify case details</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <UserCheck className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Coordinator assignment</div>
                      <div className="text-xs text-muted-foreground">Match to the right coordinator</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Hospital care</div>
                      <div className="text-xs text-muted-foreground">Coordinate treatment logistics</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <HandCoins className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Donor support & tracking</div>
                      <div className="text-xs text-muted-foreground">Fund transparently with updates</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${isAR ? "flex-row-reverse text-right" : ""}`}>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Stories & impact</div>
                      <div className="text-xs text-muted-foreground">Share progress with the community</div>
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
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? "flex-row-reverse" : ""}`}>
                  <Users className="h-5 w-5 text-primary" />
                  Our backbone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-foreground">Open-source, privacy-first, multilingual (AR/EN at launch)</p>
                <p className="text-muted-foreground">Tech: <strong>Django, Next.js, PostgreSQL, PyTorch</strong> for reliability, speed, and inclusivity.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
