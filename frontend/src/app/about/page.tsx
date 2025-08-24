"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, UserCheck, Stethoscope, HandCoins, Sparkles, Heart, Users, BookOpen, Wifi } from "lucide-react";

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

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-foreground">About sNDa</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">Solidarity Network for Development & Action</p>
        </motion.div>

        {/* Grouped cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Intro / Name & meaning */}
          <motion.div variants={itemVariants}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">Who we are</h2>
            <Card>
              <CardContent className="space-y-3">
                <p className="text-foreground"><strong>sNDa</strong> = <strong>Solidarity Network for Development & Action</strong>.</p>
                <p className="text-muted-foreground">Pronounced <strong>sun-dah (سندة)</strong>; in Sudanese slang, <em>sanda</em> is a light snack; in Arabic, <strong>سندة</strong> means support. We bring both: warmth and practical help.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What we do */}
          <motion.div variants={itemVariants}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">What we do</h2>
            <Card>
              <CardContent className="space-y-5">
                <p className="text-foreground text-center max-w-3xl mx-auto">We’re a solidarity platform that wraps children and communities in care, starting with kids in Sudan, built for the world. sNDa connects <strong>families, volunteers, coordinators, donors, and hospitals</strong> so help arrives faster and outcomes are transparent.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Wall of Love</div>
                      <div className="text-xs text-muted-foreground">Curated, public impact stories</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Volunteer Tools</div>
                      <div className="text-xs text-muted-foreground">Dashboard, streaks, badges</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <HandCoins className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Donor Platform</div>
                      <div className="text-xs text-muted-foreground">Clear campaigns, outcomes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Wifi className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Offline-first</div>
                      <div className="text-xs text-muted-foreground">Works through outages, SMS</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
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

          {/* How it works (icon cards) */}
          <motion.div variants={itemVariants}>
            <h2 className="text-base font-medium text-foreground text-center mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-2 text-base font-medium">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Referral & triage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">Collect and verify case details.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-2 text-base font-medium">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Coordinator assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">Match to the right coordinator.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-2 text-base font-medium">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Hospital care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">Coordinate treatment logistics.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-2 text-base font-medium">
                    <HandCoins className="h-5 w-5 text-primary" />
                    Donor support & tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">Fund transparently with updates.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-2 text-base font-medium">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Stories & impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">Share progress with the community.</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Built by & for */}
          <motion.div variants={itemVariants}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">Built by &amp; for the community</h2>
            <Card>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Open-source, privacy-first, multilingual (AR/EN at launch)</p>
                <p className="text-muted-foreground">Tech: <strong>Django, Next.js, PostgreSQL, PyTorch</strong> for reliability, speed, and inclusivity.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
