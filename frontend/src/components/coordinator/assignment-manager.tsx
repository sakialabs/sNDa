"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  availability: string;
  activeAssignments: number;
  completedCases: number;
  rating: number;
  lastActive: string;
}

interface Assignment {
  id: string;
  caseId: string;
  caseTitle: string;
  volunteer: Volunteer;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';
  assignmentNote: string;
  volunteerResponse?: string;
  estimatedHours?: number;
  actualHours?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

interface AssignmentManagerProps {
  caseId: string;
  caseTitle: string;
  currentAssignment?: Assignment;
  onAssignmentUpdate: () => void;
}

export function AssignmentManager({ 
  caseId, 
  caseTitle, 
  currentAssignment,
  onAssignmentUpdate 
}: AssignmentManagerProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');

  useEffect(() => {
    loadAvailableVolunteers();
  }, []);

  const loadAvailableVolunteers = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVolunteers([
        {
          id: '1',
          name: 'Sarah Ahmed',
          email: 'sarah@example.com',
          skills: ['Medical Support', 'Translation', 'Family Care'],
          availability: 'Weekdays 9-5',
          activeAssignments: 2,
          completedCases: 15,
          rating: 4.8,
          lastActive: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'Mohamed Hassan',
          email: 'mohamed@example.com',
          skills: ['Transportation', 'Emergency Response', 'Community Outreach'],
          availability: 'Flexible',
          activeAssignments: 1,
          completedCases: 23,
          rating: 4.9,
          lastActive: '2024-01-20T08:30:00Z'
        },
        {
          id: '3',
          name: 'Fatima Al-Rashid',
          email: 'fatima@example.com',
          skills: ['Counseling', 'Child Care', 'Educational Support'],
          availability: 'Evenings & Weekends',
          activeAssignments: 0,
          completedCases: 8,
          rating: 4.7,
          lastActive: '2024-01-19T16:45:00Z'
        }
      ]);
    } catch (error) {
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVolunteer = async () => {
    if (!selectedVolunteer || !assignmentNote.trim()) {
      toast.error("Please select a volunteer and provide assignment instructions");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Assignment created successfully! Volunteer will be notified.");
      setShowAssignDialog(false);
      setSelectedVolunteer('');
      setAssignmentNote('');
      setEstimatedHours('');
      setScheduledStart('');
      onAssignmentUpdate();
    } catch (error) {
      toast.error("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentAction = async (action: 'cancel' | 'complete') => {
    if (!currentAssignment) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'cancel') {
        toast.success("Assignment cancelled");
      } else {
        toast.success("Assignment marked as completed");
      }
      
      onAssignmentUpdate();
    } catch (error) {
      toast.error(`Failed to ${action} assignment`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'ACCEPTED': return 'default';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'secondary';
      case 'DECLINED': return 'destructive';
      case 'CANCELLED': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'DECLINED': return <XCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Assignment Management</span>
          {!currentAssignment && (
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Volunteer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Assign Volunteer to Case</DialogTitle>
                  <DialogDescription>
                    Select a volunteer and provide assignment details for: {caseTitle}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Volunteer Selection */}
                  <div>
                    <Label>Select Volunteer</Label>
                    {loading ? (
                      <div className="space-y-3 mt-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 mt-2">
                        {volunteers.map((volunteer) => (
                          <div
                            key={volunteer.id}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedVolunteer === volunteer.id 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedVolunteer(volunteer.id)}
                          >
                            <Avatar>
                              <AvatarImage src={volunteer.avatar} />
                              <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{volunteer.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">★ {volunteer.rating}</Badge>
                                  <Badge variant={volunteer.activeAssignments > 2 ? "destructive" : "secondary"}>
                                    {volunteer.activeAssignments} active
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {volunteer.skills.slice(0, 3).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Available: {volunteer.availability} • {volunteer.completedCases} completed cases
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assignment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimated-hours">Estimated Hours</Label>
                      <Input
                        id="estimated-hours"
                        type="number"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(e.target.value)}
                        placeholder="e.g., 8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduled-start">Scheduled Start</Label>
                      <Input
                        id="scheduled-start"
                        type="datetime-local"
                        value={scheduledStart}
                        onChange={(e) => setScheduledStart(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignment-note">Assignment Instructions</Label>
                    <Textarea
                      id="assignment-note"
                      value={assignmentNote}
                      onChange={(e) => setAssignmentNote(e.target.value)}
                      placeholder="Provide detailed instructions for the volunteer..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignVolunteer} disabled={loading}>
                      {loading ? "Creating Assignment..." : "Assign Volunteer"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentAssignment ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentAssignment.volunteer.avatar} />
                  <AvatarFallback>{currentAssignment.volunteer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{currentAssignment.volunteer.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentAssignment.volunteer.email}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(currentAssignment.status)} className="flex items-center gap-1">
                {getStatusIcon(currentAssignment.status)}
                {currentAssignment.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Assigned:</span> {new Date(currentAssignment.createdAt).toLocaleDateString()}
              </div>
              {currentAssignment.estimatedHours && (
                <div>
                  <span className="font-medium">Est. Hours:</span> {currentAssignment.estimatedHours}h
                </div>
              )}
              {currentAssignment.scheduledStart && (
                <div>
                  <span className="font-medium">Scheduled:</span> {new Date(currentAssignment.scheduledStart).toLocaleDateString()}
                </div>
              )}
              {currentAssignment.actualHours && (
                <div>
                  <span className="font-medium">Actual Hours:</span> {currentAssignment.actualHours}h
                </div>
              )}
            </div>

            {currentAssignment.assignmentNote && (
              <div>
                <h5 className="font-medium mb-2">Assignment Instructions:</h5>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {currentAssignment.assignmentNote}
                </p>
              </div>
            )}

            {currentAssignment.volunteerResponse && (
              <div>
                <h5 className="font-medium mb-2">Volunteer Response:</h5>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {currentAssignment.volunteerResponse}
                </p>
              </div>
            )}

            <div className="flex space-x-2 pt-4 border-t">
              {currentAssignment.status === 'IN_PROGRESS' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleAssignmentAction('complete')}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(currentAssignment.status) && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleAssignmentAction('cancel')}
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Assignment
                </Button>
              )}
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Volunteer
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Assignment Yet</h3>
            <p className="text-muted-foreground mb-4">
              This case hasn't been assigned to a volunteer yet.
            </p>
            <Button onClick={() => setShowAssignDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Volunteer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
