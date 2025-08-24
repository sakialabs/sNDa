"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { authFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OverviewCards } from "@/components/coordinator/overview-cards";
import { Case, VolunteerProfile } from "@/types/coordinator";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "TRIAGED", label: "Triaged" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "RESOLVED", label: "Resolved" },
];

const URGENCY_OPTIONS = [
  { value: "ALL", label: "All Urgency Levels" },
  { value: "1", label: "Low (1-2)" },
  { value: "2", label: "Medium (3-4)" },
  { value: "3", label: "High (5-7)" },
  { value: "4", label: "Critical (8-10)" },
];

export default function CoordinatorDashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  // State for cases and volunteers
  const [cases, setCases] = useState<Case[]>([]);
  const [, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [casesRes, volunteersRes] = await Promise.all([
          authFetch("/api/cases/"),
          authFetch("/api/volunteers/"),
        ]);

        const [casesData, volunteersData] = await Promise.all([
          casesRes.json(),
          volunteersRes.json(),
        ]);

        setCases(
          Array.isArray(casesData) ? casesData : casesData?.results ?? []
        );
        setVolunteers(
          Array.isArray(volunteersData)
            ? volunteersData
            : volunteersData?.results ?? []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, router, locale]);

  // Filter cases based on current filters
  const filteredCases = cases.filter((c: Case) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;

    const urgencyScore = c.urgency_score ?? 0;
    const matchesUrgency =
      urgencyFilter === "ALL" ||
      (urgencyFilter === "1" && urgencyScore <= 2) ||
      (urgencyFilter === "2" && urgencyScore >= 3 && urgencyScore <= 4) ||
      (urgencyFilter === "3" && urgencyScore >= 5 && urgencyScore <= 7) ||
      (urgencyFilter === "4" && urgencyScore >= 8);

    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesUrgency && matchesSearch;
  });

  if (!isAuthenticated) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Coordinator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage cases, assign volunteers, and track progress
        </p>
      </div>

      <OverviewCards cases={cases} loading={loading} />

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No cases found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {c.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.primary_subject.first_name} {c.primary_subject.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge>{c.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{c.urgency_score ?? "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        {c.assigned_volunteer
                          ? `${c.assigned_volunteer.first_name} ${c.assigned_volunteer.last_name}`
                          : "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/${locale}/dashboard/cases/${c.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
