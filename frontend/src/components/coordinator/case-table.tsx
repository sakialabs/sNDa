"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Case } from "@/types/coordinator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CaseTableProps {
  cases: Case[];
  selectedCases: Set<string>;
  onSelectAllAction: (checked: boolean) => void;
  onSelectCaseAction: (caseId: string, checked: boolean) => void;
  loading: boolean;
  onViewCaseAction: (caseId: string) => void;
}

export function CaseTable({ 
  cases, 
  selectedCases, 
  onSelectAllAction: onSelectAll, 
  onSelectCaseAction: onSelectCase, 
  loading, 
  onViewCaseAction: onViewCase 
}: CaseTableProps) {
  const allSelected = cases.length > 0 && selectedCases.size === cases.length;
  const someSelected = selectedCases.size > 0 && selectedCases.size < cases.length;
  
  // Format date helper function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getUrgencyColor = (score: number | null) => {
    const safeScore = score ?? 0;
    if (safeScore >= 7) return 'bg-red-500';
    if (safeScore >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'NEW': return 'default';
      case 'IN_PROGRESS': return 'outline';
      case 'PENDING': return 'secondary';
      case 'RESOLVED': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No cases found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected || someSelected}
              onCheckedChange={() => onSelectAll(!allSelected)}
            />
          </TableHead>
          <TableHead>Case</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Urgency</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id} className="hover:bg-muted/50">
            <TableCell>
              <Checkbox
                checked={selectedCases.has(c.id)}
                onCheckedChange={(checked) => onSelectCase(c.id, !!checked)}
              />
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{c.title}</span>
                <span className="text-xs text-muted-foreground">#{c.id}</span>
              </div>
            </TableCell>
            <TableCell>
              {c.primary_subject.first_name} {c.primary_subject.last_name}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(c.status)} className="whitespace-nowrap">
                {c.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${getUrgencyColor(c.urgency_score)}`} />
                <span>{c.urgency_score ?? 'N/A'}</span>
              </div>
            </TableCell>
            <TableCell>
              {c.assigned_volunteer ? (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>{c.assigned_volunteer.first_name} {c.assigned_volunteer.last_name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Unassigned</span>
              )}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {formatDate(c.updated_at || c.created_at)}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(c.updated_at || c.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onViewCase(c.id)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
