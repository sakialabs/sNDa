"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAssignAction: (volunteerId: string) => Promise<void>;
  onBulkStatusChangeAction: (status: string) => Promise<void>;
  loading: boolean;
  availableVolunteers: Array<{ id: string; name: string }>;
}

export function BulkActions({
  selectedCount,
  onBulkAssignAction: onBulkAssign,
  onBulkStatusChangeAction: onBulkStatusChange,
  loading,
  availableVolunteers,
}: BulkActionsProps) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = [
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "PENDING", label: "Pending" },
    { value: "RESOLVED", label: "Resolved" },
  ];

  const handleAssign = async () => {
    if (!selectedVolunteer) return;
    await onBulkAssign(selectedVolunteer);
    setAssignOpen(false);
    setSelectedVolunteer("");
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    await onBulkStatusChange(selectedStatus);
    setStatusOpen(false);
    setSelectedStatus("");
  };

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'case' : 'cases'} selected
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAssignOpen(true)}
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Assign
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setStatusOpen(true)}
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Change Status
      </Button>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign {selectedCount} cases</DialogTitle>
            <DialogDescription>
              Select a volunteer to assign these cases to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volunteer">Volunteer</Label>
              <Select
                value={selectedVolunteer}
                onValueChange={setSelectedVolunteer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a volunteer" />
                </SelectTrigger>
                <SelectContent>
                  {availableVolunteers.map((volunteer) => (
                    <SelectItem key={volunteer.id} value={volunteer.id}>
                      {volunteer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedVolunteer || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update status for {selectedCount} cases</DialogTitle>
            <DialogDescription>
              Select the new status for these cases.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={!selectedStatus || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
