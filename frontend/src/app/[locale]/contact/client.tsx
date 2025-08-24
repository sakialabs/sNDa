"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function ContactClient() {
  const locale = useLocale();
  const isAR = locale === "ar";
  return (
    <div className="max-w-7xl mx-auto p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
        <p className="text-xl text-muted-foreground mt-2">We’d love to hear from you.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">General Support</h2>
            <Card className="h-full">
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Questions, feedback, help with the platform.</p>
                <Button asChild size="sm">
                  <a href="mailto:snda@hey.com">Email snda@hey.com</a>
                </Button>
                <p className="text-xs text-muted-foreground">We read every message with care 🌍❤️</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">Contribute</h2>
            <Card className="h-full">
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Open issues, propose features, join discussions.</p>
                <div className="flex justify-center gap-3">
                  <Button asChild size="sm">
                    <a href="https://github.com/sakialabs/sNDa" target="_blank" rel="noreferrer">GitHub</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="mailto:snda@hey.com?subject=Contribute%20to%20sNDa">Email us</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Design, code, research, operations—there’s room for you.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <h2 className="text-base font-medium text-foreground text-center mb-3">Partnerships & Media</h2>
            <Card className="h-full">
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Organizations, hospitals, NGOs, and press.</p>
                <Button asChild variant="outline" size="sm">
                  <a href="mailto:snda@hey.com?subject=Partnership%20Inquiry">Partner with us</a>
                </Button>
                <p className="text-xs text-muted-foreground m-0">Include: org name, goals, and timeline.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12">
          <h2 className="text-base font-medium text-foreground text-center mb-3">Security</h2>
          <Card>
            <CardContent>
              <p className={`text-foreground ${isAR ? 'text-right' : 'text-left'}`}>
                Report vulnerabilities responsibly to <a className="underline" href="mailto:snda@hey.com?subject=Security">snda@hey.com</a> <span className="text-muted-foreground">(subject "Security")</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
