"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { connectWS } from "@/lib/ws";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { SHARED_STORIES, PublicStory, MediaItem } from "@/lib/shared-stories";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WebSocketMessage {
  story?: PublicStory;
  [key: string]: unknown;
}

export default function WallOfLoveClient() {
  const locale = useLocale();
  const f = useFormatter();
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isAR = locale === "ar";
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
  const [likingStories, setLikingStories] = useState<Set<string>>(new Set());

  // Process pending likes after authentication
  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      try {
        const pendingLikes = sessionStorage.getItem("snda-pending-likes");
        if (pendingLikes) {
          const storyIds = JSON.parse(pendingLikes) as string[];
          // Process each pending like
          storyIds.forEach(storyId => {
            setLiked((prev: Set<string>) => {
              const next = new Set(prev);
              if (!next.has(storyId)) {
                next.add(storyId);
                setStories((curr: PublicStory[]) =>
                  curr.map((s: PublicStory) => (s.id === storyId ? { ...s, likes_count: s.likes_count + 1 } : s))
                );
                // Update sessionStorage with liked stories
                try {
                  sessionStorage.setItem("snda-liked-stories", JSON.stringify(Array.from(next)));
                } catch {}
              }
              return next;
            });
          });
          // Clear pending likes
          sessionStorage.removeItem("snda-pending-likes");
          toast.success(t("wallOfLove.likesProcessed", { count: storyIds.length }));
        }
      } catch {
        // Ignore errors
      }
    }
  }, [isAuthenticated, t]);

  // Debounced like function to prevent double-clicking
  const toggleLike = useCallback((id: string): void => {
    // Don't do anything if auth is still loading
    if (authLoading) {
      return;
    }

    // Prevent multiple clicks on the same story
    if (likingStories.has(id)) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the intended like for after login
      try {
        const pending = sessionStorage.getItem("snda-pending-likes");
        const pendingLikes = pending ? JSON.parse(pending) : [];
        if (!pendingLikes.includes(id)) {
          pendingLikes.push(id);
          sessionStorage.setItem("snda-pending-likes", JSON.stringify(pendingLikes));
        }
      } catch {}
      
      // Redirect to login with current page as return destination
      const currentPath = `/${locale}/wall-of-love`;
      router.push(`/${locale}/login?from=${encodeURIComponent(currentPath)}`);
      toast.info(t("wallOfLove.redirectingToLogin"));
      return;
    }

    setLikingStories(prev => new Set(prev).add(id));

    setLiked((prev: Set<string>) => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      if (isLiked) next.delete(id);
      else next.add(id);
      try {
        sessionStorage.setItem("snda-liked-stories", JSON.stringify(Array.from(next)));
      } catch {}
      setStories((curr: PublicStory[]) =>
        curr.map((s: PublicStory) => (s.id === id ? { ...s, likes_count: s.likes_count + (isLiked ? -1 : 1) } : s))
      );
      
      // Remove from liking set after a short delay
      setTimeout(() => {
        setLikingStories(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
      
      return next;
    });
  }, [isAuthenticated, authLoading, t, likingStories, locale, router]);

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
    setStories(SHARED_STORIES);
    setLoading(false);
  }, []);

  useEffect(() => {
    const disconnect = connectWS<WebSocketMessage>("/ws/stories/", (msg: WebSocketMessage) => {
      const story: PublicStory | undefined = msg?.story ?? (msg && 'id' in msg && 'title' in msg && 'content' in msg ? msg as unknown as PublicStory : undefined);
      if (!story || !story.id || !story.title) return;
      setStories((prev: PublicStory[]) => [story, ...prev]);
    });
    return () => disconnect();
  }, []);

  const filteredStories = useMemo((): PublicStory[] => {
    if (filter === "all") return stories;
    return stories.filter((s: PublicStory) => s.story_type?.toLowerCase() === filter);
  }, [stories, filter]);

  const toggleExpanded = (id: string): void => {
    setExpanded((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
        <h1 className="text-4xl font-bold text-foreground">{t('wallOfLove.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('wallOfLove.subtitle')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('wallOfLove.latestStories')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {([
                { key: "all", label: t('wallOfLove.filters.all') },
                { key: "success", label: t('wallOfLove.filters.success') },
                { key: "progress", label: t('wallOfLove.filters.progress') },
                { key: "breakthrough", label: t('wallOfLove.filters.breakthrough') },
              ] as const).map((f) => (
                <Button key={f.key} size="sm" variant={filter === f.key ? "default" : "outline"} onClick={() => setFilter(f.key)}>
                  {f.label}
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`${isAR ? "border-r-4 pr-4" : "border-l-4 pl-4"} border-primary/20 py-2`}>
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
              <div className="text-sm text-muted-foreground">{t('wallOfLove.noStories')}</div>
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
                      className={`${isAR ? "border-r-4 pr-4" : "border-l-4 pl-4"} border-primary/20 py-2 rounded`}
                      layout
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{story.title}</h3>
                          <p className="text-sm text-muted-foreground">{t('wallOfLove.by')} {story.author_name} • {story.case_title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLike(story.id)}
                          disabled={likingStories.has(story.id) || authLoading}
                          className={`flex items-center gap-1 transition-colors ${
                            likingStories.has(story.id) || authLoading
                              ? "text-muted-foreground cursor-wait opacity-80"
                              : "text-primary hover:text-primary/90 cursor-pointer"
                          }`}
                          aria-pressed={liked.has(story.id)}
                          aria-label={
                            authLoading
                              ? t('common.loading')
                              : !isAuthenticated 
                              ? t('wallOfLove.clickToLogin')
                              : liked.has(story.id) 
                              ? t('wallOfLove.unlike') 
                              : t('wallOfLove.like')
                          }
                          title={
                            authLoading 
                              ? t('common.loading')
                              : !isAuthenticated 
                              ? t('wallOfLove.clickToLogin') 
                              : undefined
                          }
                        >
                          <Heart className={`h-4 w-4 ${liked.has(story.id) ? "fill-current" : ""}`} />
                          <span className="text-sm">{f.number(story.likes_count)}</span>
                        </button>
                      </div>
                      <div className={expanded.has(story.id) ? "mb-3" : "mb-3 line-clamp-4"}>
                        <p className="text-foreground">{story.content}</p>
                      </div>
                      <div className="-mt-2 mb-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleExpanded(story.id)}>
                          {expanded.has(story.id) ? t('wallOfLove.showLess') : t('wallOfLove.showMore')}
                        </Button>
                      </div>

                      {Array.isArray(story.media) && story.media.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {story.media.slice(0, 3).map((m: string | MediaItem, i: number) => {
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
                                      .map((mm: string | MediaItem) => ({ url: typeof mm === "string" ? mm : mm?.url ?? "", type: typeof mm === "string" ? undefined : mm?.type }))
                                      .filter((it: { url: string; type?: string }) => it.url),
                                    index: i,
                                  })
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-video overflow-hidden rounded bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {isVideo ? (
                                   
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
                          {f.dateTime(new Date(story.published_at), { dateStyle: "medium", timeStyle: "short" })}
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

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {lightbox && (
            <div className="relative bg-black">
              <button
                type="button"
                className={`absolute top-3 ${isAR ? "left-3" : "right-3"} z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white`}
                onClick={() => setLightbox(null)}
                aria-label={t('wallOfLove.close')}
              >
                <X className="h-5 w-5" />
              </button>

              <button
                type="button"
                className={`absolute ${isAR ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white`}
                onClick={() => setLightbox((lb) => lb && { ...lb, index: Math.max(0, lb.index - 1) })}
                aria-label={t('wallOfLove.previous')}
                disabled={lightbox.index === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className={`absolute ${isAR ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white`}
                onClick={() => setLightbox((lb) => lb && { ...lb, index: Math.min(lb.items.length - 1, lb.index + 1) })}
                aria-label="Next"
                disabled={lightbox.index >= lightbox.items.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {(() => {
                const current = lightbox.items[lightbox.index];
                const isVideo = current.type?.startsWith("video") || /\.(mp4|webm|ogg)$/i.test(current.url);
                return isVideo ? (
                   
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
