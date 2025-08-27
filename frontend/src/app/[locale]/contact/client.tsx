"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { Mail, Users, Megaphone, Shield } from "lucide-react";

export default function ContactClient() {
  const locale = useLocale();
  const isAR = locale === "ar";
  return (
    <div className="max-w-7xl mx-auto p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground">{isAR ? "تواصل معنا" : "Contact Us"}</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">We’d love to hear from you!</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? 'flex-row-reverse' : ''}`}>
                  <Mail className="h-5 w-5 text-primary" />
                  General Support
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">Questions, feedback, help with the platform.</p>
                <Button asChild size="sm">
                  <a href="mailto:snda@hey.me">Email snda@hey.me</a>
                </Button>
                <p className="text-xs text-muted-foreground">We read every message with care 🌍❤️</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? 'flex-row-reverse' : ''}`}>
                  <Users className="h-5 w-5 text-primary" />
                  Contribute
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">Open issues, propose features, join discussions.</p>
                <div className={`flex gap-3 ${isAR ? 'justify-end' : 'justify-start'}`}>
                  <Button asChild size="sm">
                    <a href="https://github.com/sakialabs/sNDa" target="_blank" rel="noreferrer">GitHub</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="mailto:snda@hey.me?subject=Contribute%20to%20sNDa">Email us</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Design, code, research, operations—there’s room for you.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? 'flex-row-reverse' : ''}`}>
                  <Megaphone className="h-5 w-5 text-primary" />
                  Partnerships & Media
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${isAR ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-muted-foreground">Organizations, hospitals, NGOs, and press.</p>
                <Button asChild variant="outline" size="sm">
                  <a href="mailto:snda@hey.me?subject=Partnership%20Inquiry">Partner with us</a>
                </Button>
                <p className="text-xs text-muted-foreground m-0">Include: org name, goals, and timeline.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 justify-start ${isAR ? 'flex-row-reverse' : ''}`}>
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-foreground ${isAR ? 'text-right' : 'text-left'}`}>
                Report vulnerabilities responsibly to <a className="underline" href="mailto:snda@hey.me?subject=Security">snda@hey.me</a> <span className="text-muted-foreground">(subject "Security")</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
