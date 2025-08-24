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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

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
}

export default function VolunteerPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🤝 Volunteer Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our community of volunteers making a real difference in the lives of displaced families and children.
          </p>
        </motion.div>

        {/* Quick Stats */}
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
                <div className="text-3xl font-bold text-primary">89</div>
                <p className="text-sm text-muted-foreground">Active Volunteers</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">1,247</div>
                <p className="text-sm text-muted-foreground">Cases Resolved</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">50+</div>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
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
          {/* How It Works */}
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  How Volunteering Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold">Sign Up & Get Matched</h3>
                    <p className="text-sm text-muted-foreground">Create your profile and we'll match you with cases that fit your skills and availability.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold">Take Action</h3>
                    <p className="text-sm text-muted-foreground">Work directly with families to provide support, guidance, and resources they need.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold">Share Your Impact</h3>
                    <p className="text-sm text-muted-foreground">Document your journey and inspire others by sharing stories of the lives you've touched.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Volunteer Types */}
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Ways to Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Case Worker</h3>
                      <p className="text-sm text-muted-foreground">Direct family support and advocacy</p>
                    </div>
                    <Badge variant="secondary">High Impact</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Translator</h3>
                      <p className="text-sm text-muted-foreground">Language support and communication</p>
                    </div>
                    <Badge variant="secondary">Flexible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Mentor</h3>
                      <p className="text-sm text-muted-foreground">Long-term guidance and friendship</p>
                    </div>
                    <Badge variant="secondary">Ongoing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Emergency Response</h3>
                      <p className="text-sm text-muted-foreground">Urgent case assistance</p>
                    </div>
                    <Badge variant="secondary">On-Call</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Volunteer Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Why Volunteers Love sNDa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Gamified Experience</h3>
                  <p className="text-sm text-muted-foreground">Earn badges, track streaks, and see your impact grow with our engaging reward system.</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Real Impact</h3>
                  <p className="text-sm text-muted-foreground">Every case you complete directly changes a family's life and helps them build a better future.</p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Continuous Learning</h3>
                  <p className="text-sm text-muted-foreground">Develop new skills, gain cultural awareness, and grow personally through meaningful work.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to Make a Difference?</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Join hundreds of volunteers who are already changing lives in their communities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See Our Impact
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
