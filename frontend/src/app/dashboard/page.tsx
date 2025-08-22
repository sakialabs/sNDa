"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api/client";
import type { Case } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user?.username;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await authFetch("/api/cases/");
        const data = await res.json();
        setCases(Array.isArray(data) ? data : data?.results ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cases");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {displayName}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {cases ? cases.filter((c) => c.status === "NEW").length : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {cases ? cases.filter((c) => c.status !== "NEW").length : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{cases ? cases.length : "—"}</p>
          </CardContent>
        </Card>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Loading latest cases…
        </div>
      ) : cases && cases.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Recent Cases</h2>
          <ul className="space-y-2">
            {cases.slice(0, 5).map((k) => (
              <li key={k.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <a
                    href={`/cases/${k.id}`}
                    className="font-medium underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {k.title}
                  </a>
                  <div className="text-xs text-muted-foreground">
                    {k.status}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {k.primary_subject?.first_name} {k.primary_subject?.last_name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No cases yet.</div>
      )}
    </div>
  );
}
