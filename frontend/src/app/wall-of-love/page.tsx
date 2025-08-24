"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { connectWS } from "@/lib/ws";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PublicStory {
  id: string;
  title: string;
  content: string;
  author_name: string;
  case_title: string;
  story_type: string;
  tags: string[];
  likes_count: number;
  published_at: string;
  media: any[];
}

export default function WallOfLovePage() {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "progress" | "breakthrough">("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<{
    items: { url: string; type?: string }[];
    index: number;
  } | null>(null);
  const [liked, setLiked] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = sessionStorage.getItem("snda-liked-stories");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowLeft") {
        setLightbox((lb) => (lb ? { ...lb, index: Math.max(0, lb.index - 1) } : lb));
      } else if (e.key === "ArrowRight") {
        setLightbox((lb) => (lb ? { ...lb, index: Math.min(lb.items.length - 1, lb.index + 1) } : lb));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  useEffect(() => {
    // seed with a couple of examples (dev)
    const seed = [
      {
        id: "seed-1",
        title: "Smiles After Surgery",
        content:
          "Thanks to quick coordination and donor support, Amal received urgent surgery and is recovering well.",
        author_name: "Hussein",
        case_title: "Post-op Care - Amal",
        story_type: "success",
        tags: ["health", "surgery", "recovery"],
        likes_count: 12,
        published_at: new Date().toISOString(),
        media: [],
      },
      {
        id: "seed-2",
        title: "School Supplies Delivered",
        content:
          "Volunteer team delivered backpacks and books to 20 students starting the new term with confidence.",
        author_name: "Mona",
        case_title: "Education Support",
        story_type: "progress",
        tags: ["education", "supplies"],
        likes_count: 9,
        published_at: new Date().toISOString(),
        media: [],
      },
    ];
    setStories(seed);
    // small artificial delay for skeleton UX polish
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const disconnect = connectWS<any>("/ws/stories/", (msg) => {
      const story: PublicStory | undefined = msg?.story ?? msg;
      if (!story || !story.id || !story.title) return;
      setStories((prev) => [story, ...prev]);
    });
    return () => disconnect();
  }, []);

  const filteredStories = useMemo(() => {
    if (filter === "all") return stories;
    return stories.filter((s) => s.story_type?.toLowerCase() === filter);
  }, [stories, filter]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      if (isLiked) next.delete(id);
      else next.add(id);
      try {
        sessionStorage.setItem("snda-liked-stories", JSON.stringify(Array.from(next)));
      } catch {}
      // optimistic count update
      setStories((curr) =>
        curr.map((s) => (s.id === id ? { ...s, likes_count: s.likes_count + (isLiked ? -1 : 1) } : s))
      );
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-foreground">Wall of Love</h1>
        <p className="text-muted-foreground mt-2">A living feed of community impact stories.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Latest Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {([
                { key: "all", label: "All" },
                { key: "success", label: "Success" },
                { key: "progress", label: "Progress" },
                { key: "breakthrough", label: "Breakthrough" },
              ] as const).map((f) => (
                <Button
                  key={f.key}
                  size="sm"
                  variant={filter === f.key ? "default" : "outline"}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Skeleton */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-l-4 border-primary/20 pl-4 py-2">
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-2/3 bg-muted animate-pulse rounded mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="text-sm text-muted-foreground">No stories yet. Be the first to share a sandwich of support 🥪</div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {filteredStories.map((story) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.45 }}
                      className="border-l-4 border-primary/20 pl-4 py-2 rounded"
                      layout
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{story.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {story.author_name} • {story.case_title}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLike(story.id)}
                          className="flex items-center gap-1 text-primary hover:text-primary/90 transition-colors"
                          aria-pressed={liked.has(story.id)}
                          aria-label={liked.has(story.id) ? "Unlike" : "Like"}
                        >
                          <Heart className={`h-4 w-4 ${liked.has(story.id) ? "fill-primary" : ""}`} />
                          <span className="text-sm">{story.likes_count}</span>
                        </button>
                      </div>
                      <div className={expanded.has(story.id) ? "mb-3" : "mb-3 line-clamp-4"}>
                        <p className="text-foreground">{story.content}</p>
                      </div>
                      <div className="-mt-2 mb-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleExpanded(story.id)}>
                          {expanded.has(story.id) ? "Show less" : "Show more"}
                        </Button>
                      </div>

                      {Array.isArray(story.media) && story.media.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {story.media.slice(0, 3).map((m: any, i: number) => {
                            const url: string = typeof m === "string" ? m : m?.url ?? "";
                            const type: string | undefined = typeof m === "string" ? undefined : m?.type;
                            const isVideo = type?.startsWith("video") || /\.(mp4|webm|ogg)$/i.test(url);
                            if (!url) return null;
                            return (
                              <motion.button
                                key={i}
                                type="button"
                                onClick={() =>
                                  setLightbox({
                                    items: story.media
                                      .map((mm: any) => ({ url: typeof mm === "string" ? mm : mm?.url ?? "", type: typeof mm === "string" ? undefined : mm?.type }))
                                      .filter((it: any) => it.url),
                                    index: i,
                                  })
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-video overflow-hidden rounded bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {isVideo ? (
                                  // eslint-disable-next-line jsx-a11y/media-has-caption
                                  <video src={url} className="h-full w-full object-cover" muted preload="metadata" />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={url} alt={story.title} className="h-full w-full object-cover" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {story.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(story.published_at).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {lightbox && (
            <div className="relative bg-black">
              <button
                type="button"
                className="absolute top-3 right-3 z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setLightbox((lb) => lb && { ...lb, index: Math.max(0, lb.index - 1) })}
                aria-label="Previous"
                disabled={lightbox.index === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
                onClick={() =>
                  setLightbox((lb) => lb && { ...lb, index: Math.min(lb.items.length - 1, lb.index + 1) })
                }
                aria-label="Next"
                disabled={lightbox.index >= lightbox.items.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {(() => {
                const current = lightbox.items[lightbox.index];
                const isVideo = current.type?.startsWith("video") || /\.(mp4|webm|ogg)$/i.test(current.url);
                return isVideo ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={current.url} className="w-full h-full" controls autoPlay />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.url} alt="Media preview" className="w-full h-full object-contain" />
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
