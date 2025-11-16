'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { getStudentStats, type StudentStats } from '@/lib/services/student-stats.service';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  FileText,
  Bell,
  Bookmark,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [stats, setStats] = useState<StudentStats>({
    totalHours: 0,
    activeOpportunities: 0,
    completedOpportunities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserAndStats() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch stats
        try {
          const userStats = await getStudentStats(user.id);
          setStats(userStats);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }

      setLoading(false);
    }

    loadUserAndStats();
  }, []);

  const activeOpportunities = [
    {
      id: '1',
      title: 'STEM Mentorship Program',
      department: 'ES',
      progress: 30,
      hoursCompleted: 12,
      totalHours: 40,
      nextSession: {
        date: 'Mon, Dec 16',
        time: '18:00-20:00',
        location: 'Engineering Building, Room 203',
      },
    },
    {
      id: '2',
      title: 'Community Outreach Initiative',
      department: 'CSIE',
      progress: 65,
      hoursCompleted: 26,
      totalHours: 40,
      nextSession: {
        date: 'Wed, Dec 18',
        time: '14:00-17:00',
        location: 'Community Center',
      },
    },
  ];

  const upcomingSessions = [
    {
      id: '1',
      title: 'STEM Mentorship Program',
      date: 'Mon, Dec 16',
      time: '18:00-20:00',
      location: 'Engineering Building, Room 203',
    },
    {
      id: '2',
      title: 'Community Outreach Initiative',
      date: 'Wed, Dec 18',
      time: '14:00-17:00',
      location: 'Community Center',
    },
    {
      id: '3',
      title: 'STEM Mentorship Program',
      date: 'Mon, Dec 23',
      time: '18:00-20:00',
      location: 'Engineering Building, Room 203',
    },
  ];

  const notifications = [
    {
      id: '1',
      type: 'accepted',
      message: 'Your application for "Environmental Awareness" was accepted!',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'session',
      message: 'New session added to "STEM Mentorship Program"',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'reminder',
      message: 'Reminder: Session tomorrow at 18:00',
      time: '1 day ago',
    },
  ];

  const applications = {
    underReview: 3,
    accepted: 2,
    rejected: 1,
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeHeader userName="Student" role="student" />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Explore New Opportunities
          </Button>
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            Check-in Now
          </Button>
        </CardContent>
      </Card>

      {/* Active Opportunities */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Active Opportunities</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeOpportunities.map((opportunity) => (
            <Card key={opportunity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                  <Badge variant="secondary">{opportunity.department}</Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={opportunity.progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium">
                      {opportunity.hoursCompleted}/{opportunity.totalHours} hrs (
                      {opportunity.progress}%)
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Next Session:</span>
                    <span className="ml-2 text-muted-foreground">
                      {opportunity.nextSession.date} • {opportunity.nextSession.time}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {opportunity.nextSession.location}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Log Hours
                  </Button>
                  <Button size="sm">
                    <QrCode className="mr-2 h-4 w-4" />
                    Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your next scheduled activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                <div className="font-medium">{session.title}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {session.date} • {session.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {session.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with your activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Applications Status */}
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track the status of your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">{applications.underReview}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{applications.accepted}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{applications.rejected}</p>
              </div>
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
