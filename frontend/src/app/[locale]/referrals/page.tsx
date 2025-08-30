"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import ReferralCard from "@/components/referral-card";
import ReferralDetailModal from "@/components/referral-detail-modal";
import { API_CONFIG } from "@/lib/api/config";
import { SkeletonCard } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";


type Referral = {
  id: number | string;
  title: string;
  summary?: string;
  location?: string;
  case_type?: string;
  urgency?: string;
};

export default function ReferralsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const safeT = (key: string, fallback: string) => {
    try {
      return t ? t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  // Set page title dynamically
  useEffect(() => {
    const titles: Record<string, string> = {
      en: "sNDa | Referrals",
      ar: "سندة | الإحالات",
    };
    document.title = titles[locale] ?? titles.en;
  }, [locale]);
  const [items, setItems] = useState<Referral[]>([]);
  const [serverMode, setServerMode] = useState<boolean | null>(null); // null = unknown, true = server-side pagination
  const [query, setQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<Referral | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  const buildUrl = useCallback((p = 1) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("page_size", String(pageSize));
    if (query) params.set("q", query);
    if (urgencyFilter && urgencyFilter !== "all") params.set("urgency", urgencyFilter);
    if (caseTypes.length > 0) params.set("case_type", caseTypes.join(","));
    return `${API_CONFIG.BASE_URL}/api/referrals/?${params.toString()}`;
  }, [pageSize, query, urgencyFilter, caseTypes]);

  const fetchPage = useCallback(async (p = 1, append = false) => {
    try {
      setError(null);
      if (!append) setLoading(true);
      else setLoadingMore(true);

      // abort previous
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const url = buildUrl(p);
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`Failed to load referrals (${res.status})`);
      const data = await res.json();

      // server-side pagination shape: { results: [], next: url, count }
      if (data && typeof data === "object" && Array.isArray(data.results)) {
        setServerMode(true);
        setTotal(typeof data.count === "number" ? data.count : null);
        setNextUrl(data.next || null);
        setItems((prev) => (append ? [...prev, ...data.results] : data.results));
      } else if (Array.isArray(data)) {
        // fallback: server returns array -> client-side paginate
        setServerMode(false);
        setTotal(data.length);
        setNextUrl(null);
        // if appending, just merge; otherwise replace
        setItems((prev) => (append ? [...prev, ...data] : data));
      } else if (data && Array.isArray(data.results)) {
        // another defensive check
        setServerMode(true);
        setItems((prev) => (append ? [...prev, ...data.results] : data.results));
        setNextUrl(data.next || null);
      } else {
        // unknown shape
        setServerMode(false);
        setItems((prev) => (append ? prev : []));
        setNextUrl(null);
      }
    } catch (err: unknown) {
      // Abort handled separately
      const e = err as { name?: string; message?: string } | null;
      if (e?.name === "AbortError") return;
      setError(e?.message ?? "Failed to load referrals");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildUrl]);

  // initial and filter-triggered fetch with debounce
  useEffect(() => {
    // reset to page 1 on filter/search change
    setPage(1);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchPage(1, false);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, urgencyFilter, caseTypes, fetchPage]);

  // cleanup abort on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const filtered = items.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.title || "").toLowerCase().includes(q) ||
      (r.summary || "").toLowerCase().includes(q) ||
      (r.location || "").toLowerCase().includes(q)
    );
  });

  // apply filters
  const withFilters = filtered.filter((r) => {
    if (urgencyFilter && urgencyFilter !== "all") {
      if (!r.urgency) return false;
      if (r.urgency.toLowerCase() !== urgencyFilter.toLowerCase()) return false;
    }
    if (caseTypes.length > 0) {
      const ct = (r.case_type || "").toLowerCase();
      if (!caseTypes.includes(ct)) return false;
    }
    return true;
  });

  // client-side pagination if serverMode === false — apply to filtered results
  const paginated = (() => {
    if (serverMode === false) {
      const start = (page - 1) * pageSize;
      return withFilters.slice(start, start + pageSize);
    }
    return withFilters;
  })();

  const loadMore = async () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      if (serverMode && nextUrl) {
        // fetch nextUrl directly
        const res = await fetch(nextUrl);
        if (!res.ok) throw new Error(`Failed to load more (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data.results)) {
          setItems((prev) => [...prev, ...data.results]);
          setNextUrl(data.next || null);
          setTotal(typeof data.count === 'number' ? data.count : total);
        }
      } else {
        await fetchPage(nextPage, true);
        setPage(nextPage);
      }
    } catch (err: unknown) {
      const e = err as { message?: string } | null;
      setError(e?.message ?? 'Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  };

  const retry = () => {
    setError(null);
    fetchPage(page, false);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">{safeT("referrals.title", "🤝 Referrals")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-2">{safeT("referrals.subtitle", "Browse urgent and ongoing referral requests. Search to find ways to help.")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{safeT("referrals.filtersHeader", "Search & Filters")}</span>
                </div>
                <div className="text-sm text-muted-foreground">{withFilters.length} results</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={safeT("referrals.filters.searchPlaceholder", "Search by title, summary or location...")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm mr-2">{t ? t("referrals.filters.urgency") : "Urgency"}:</label>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t ? t("referrals.filters.all") : "All"}</SelectItem>
                      <SelectItem value="high">{t ? t("referrals.filters.high") : "High"}</SelectItem>
                      <SelectItem value="medium">{t ? t("referrals.filters.medium") : "Medium"}</SelectItem>
                      <SelectItem value="low">{t ? t("referrals.filters.low") : "Low"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-sm mr-2">{t ? t("referrals.filters.caseType") : "Case type"}:</label>
                  {([
                    ["medical", t ? t("referrals.filters.types.medical") : "Medical"],
                    ["education", t ? t("referrals.filters.types.education") : "Education"],
                    ["nutrition", t ? t("referrals.filters.types.nutrition") : "Nutrition"],
                    ["shelter", t ? t("referrals.filters.types.shelter") : "Shelter"],
                    ["protection", t ? t("referrals.filters.types.protection") : "Protection"],
                  ] as const).map(([key, label]) => {
                    const active = caseTypes.includes(key as string);
                    return (
                      <Button key={key} size="sm" variant={active ? "default" : "outline"} onClick={() => {
                        setCaseTypes((prev) => prev.includes(key as string) ? prev.filter((c) => c !== key) : [...prev, key as string]);
                      }}>{label as string}</Button>
                    );
                  })}
                </div>
              </div>

              {/* Results show directly under filters */}
              <div className="mt-6">
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : paginated.length === 0 ? (
                  <div className="text-sm text-muted-foreground">{t ? t("referrals.noResults") : "No referrals found."}</div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-red-700">{error}</div>
                          <div>
                            <Button size="sm" variant="outline" onClick={retry}>Retry</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      <motion.div layout className="grid gap-4 sm:grid-cols-2">
                        {paginated.map((r) => (
                          <motion.div key={r.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                            <ReferralCard referral={r} onClick={() => setSelected(r)} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Load more */}
                    <div className="mt-6 flex justify-center">
                      {(serverMode && nextUrl) || (serverMode === false && total !== null && page * pageSize < total) ? (
                        <Button onClick={loadMore} disabled={loadingMore} size="sm">{loadingMore ? (t ? t('referrals.loadingMore') : 'Loading...') : (t ? t('referrals.loadMore') : 'Load more')}</Button>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selected && <ReferralDetailModal id={selected.id} onCloseAction={() => setSelected(null)} />}
      </div>
    </main>
  );
}
