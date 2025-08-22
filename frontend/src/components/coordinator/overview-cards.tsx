"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Case } from "@/types/coordinator";

interface OverviewCardsProps {
  cases: Case[];
  loading: boolean;
}

export function OverviewCards({ cases, loading }: OverviewCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalCases = cases.length;
  const newCases = cases.filter(c => c.status === "NEW").length;
  const inProgressCases = cases.filter(c => c.status === "IN_PROGRESS").length;
  const unassignedCases = cases.filter(c => !c.assigned_volunteer).length;
  
  // Calculate high urgency cases (urgency score >= 5)
  const highUrgencyCases = cases.filter(c => (c.urgency_score ?? 0) >= 5).length;

  const cards = [
    {
      title: "Total Cases",
      value: totalCases,
      description: "All cases in the system",
      variant: "default" as const,
    },
    {
      title: "New Cases",
      value: newCases,
      description: "Cases awaiting triage",
      variant: "secondary" as const,
    },
    {
      title: "In Progress",
      value: inProgressCases,
      description: "Cases being worked on",
      variant: "default" as const,
    },
    {
      title: "Unassigned",
      value: unassignedCases,
      description: "Cases without volunteers",
      variant: unassignedCases > 0 ? "destructive" as const : "default" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.title === "Unassigned" && card.value > 0 && (
              <Badge variant="destructive">Needs Attention</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}