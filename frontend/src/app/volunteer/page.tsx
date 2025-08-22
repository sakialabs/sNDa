"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { StorySharing } from "@/components/volunteer/story-sharing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award,
  TrendingUp
} from "lucide-react";

interface Assignment {
  id: string;
  caseTitle: string;
  clientName: string;
  status: 'active' | 'completed' | 'pending';
  location: string;
  nextAppointment?: string;
  urgency: number;
}

interface VolunteerStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  hoursVolunteered: number;
  impactScore: number;
}

export default function VolunteerDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const loadVolunteerData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalCases: 12,
          activeCases: 3,
          completedCases: 9,
          hoursVolunteered: 48,
          impactScore: 85
        });

        setAssignments([
          {
            id: '1',
            caseTitle: 'Medical Support for Sarah',
            clientName: 'Sarah Johnson',
            status: 'active',
            location: 'Downtown Medical Center',
            nextAppointment: '2024-01-25T10:00:00Z',
            urgency: 7
          },
          {
            id: '2',
            caseTitle: 'Transportation Assistance',
            clientName: 'Michael Chen',
            status: 'pending',
            location: 'Westside Community',
            urgency: 5
          },
          {
            id: '3',
            caseTitle: 'Family Support Services',
            clientName: 'Maria Rodriguez',
            status: 'completed',
            location: 'Community Center',
            urgency: 6
          }
        ]);
      } catch (error) {
        console.error('Failed to load volunteer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVolunteerData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 8) return 'destructive';
    if (urgency >= 6) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.first_name || 'Volunteer'}!
        </h1>
        <p className="text-muted-foreground">
          Your impact dashboard and story sharing hub
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-fade-in">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCases}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeCases}</div>
                <p className="text-xs text-muted-foreground">Currently assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedCases}</div>
                <p className="text-xs text-muted-foreground">Successfully closed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.hoursVolunteered}</div>
                <p className="text-xs text-muted-foreground">Volunteered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.impactScore}%</div>
                <p className="text-xs text-muted-foreground">Community impact</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Current Assignments */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new volunteer opportunities!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{assignment.caseTitle}</h3>
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                      <Badge variant={getUrgencyColor(assignment.urgency)}>
                        Urgency: {assignment.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Client: {assignment.clientName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {assignment.location}
                      </div>
                      {assignment.nextAppointment && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(assignment.nextAppointment).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Sharing Section */}
      <div className="animate-fade-in">
        <StorySharing />
      </div>
    </div>
  );
}
