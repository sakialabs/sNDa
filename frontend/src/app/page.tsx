"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { ReferralForm } from "@/components/referral-form";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { authFetch } from "@/lib/api/client";
import type { Case } from "@/lib/types";
import Link from "next/link";

export default function HomePage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [featured, setFeatured] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState(
    [
      {
        id: "h1",
        title: "A New Beginning for Amira",
        content:
          "Confidence grew with mentorship; Amira is excelling in school and making friends.",
        author_name: "Sarah Ahmed",
        case_title: "Educational Support - Amira K.",
        tags: ["education", "mentorship"],
        likes_count: 24,
        published_at: "2024-01-10",
      },
      {
        id: "h2",
        title: "Building Bridges Through Art",
        content:
          "Art therapy helped Omar find his voice and share stories of hope.",
        author_name: "Layla Mahmoud",
        case_title: "Emotional Support - Omar T.",
        tags: ["art", "creativity"],
        likes_count: 31,
        published_at: "2024-01-08",
      },
      {
        id: "h3",
        title: "From Fear to Friendship",
        content:
          "Group activities helped Nour move from isolation to leadership.",
        author_name: "Omar Hassan",
        case_title: "Social Integration - Nour M.",
        tags: ["social", "leadership"],
        likes_count: 18,
        published_at: "2024-01-05",
      },
    ] as const
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await authFetch("/api/cases/");
        const data = await res.json();
        const items: Case[] = Array.isArray(data) ? data : data?.results ?? [];
        // Prioritize NEW then higher urgency
        const sorted = items.sort((a, b) => {
          const aNew = a.status === "NEW" ? 1 : 0;
          const bNew = b.status === "NEW" ? 1 : 0;
          if (aNew !== bNew) return bNew - aNew;
          return (b.urgency_score ?? 0) - (a.urgency_score ?? 0);
        });
        setFeatured(sorted.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cases");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="flex flex-col text-center py-12 min-h-[calc(100vh-12rem)]">
      <div className="space-y-4 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-foreground"
        >
          🥪 a Sandwich of Support 🥪
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground"
        >
          sNDa connects kids, families, volunteers, and donors to build a
          resilient network of care, starting with urgent needs in Sudan.
        </motion.p>
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground text-center max-w-md mx-auto"
        >
          Whether you want to help directly, coordinate efforts, or support
          financially - every contribution matters in building a network of
          care.
        </motion.p> */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex-1 sm:flex-none">
                  Submit a Referral
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <ReferralForm />
              </DialogContent>
            </Dialog>

            <Button
              size="lg"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => {
                // TODO: Open signup form from header
                const joinUsButton = document.querySelector("[data-join-us]");
                if (joinUsButton) {
                  (joinUsButton as HTMLButtonElement).click();
                }
              }}
            >
              Join Our Community
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Urgent referrals</h2>
            <Link
              href="/dashboard"
              className="text-sm underline underline-offset-4"
            >
              See more
            </Link>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {loading ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="rounded border p-3 bg-card">
                  <div className="aspect-[16/9] mb-3 rounded bg-muted" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                  <div className="mt-1 h-3 bg-muted rounded w-1/2" />
                </li>
              ))}
            </ul>
          ) : featured.length === 0 ? (
            <div className="text-sm text-muted-foreground">No cases yet.</div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => (
                <li key={c.id} className="rounded border p-3 bg-card">
                  <Link
                    href={`/cases/${c.id}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    <div className="aspect-[16/9] mb-3 overflow-hidden rounded bg-muted flex items-center justify-center">
                      {c.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.thumbnail_url}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl">🥪</div>
                      )}
                    </div>
                    <div className="font-semibold line-clamp-1">{c.title}</div>
                  </Link>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {c.primary_subject?.first_name}{" "}
                      {c.primary_subject?.last_name}
                    </div>
                    <span className="text-xs rounded px-2 py-0.5 border">
                      {c.status === "NEW" ? "New" : c.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/cases/${c.id}`}>View details</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/cases/${c.id}?support=1`}>
                        Offer support
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Wall of Love Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Latest stories</h2>
            <Link href="/wall-of-love" className="text-sm underline underline-offset-4">
              See all stories
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {stories.slice(0, 3).map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 * i }}
                    className="border-l-4 border-primary/20 pl-4"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-semibold line-clamp-1">{s.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">by {s.author_name} • {s.case_title}</div>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">{s.likes_count}</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{s.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {s.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{new Date(s.published_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
